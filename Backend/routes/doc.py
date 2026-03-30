from fastapi import HTTPException , APIRouter , UploadFile , File
from schemas import DocumentMeta , UploadResponse , DeleteResponse , DocumentListResponse
from utils.pdfParser import ext_pdf_txt , chunk_txt
from utils.vectorStore import get_chroma_client , create_collection , embed_store , del_collection
from utils.database import get_pool
from config import settings
import os
import uuid
import aiofiles

router = APIRouter()
def valid_file(filename : str) -> bool:
     return "." in filename and filename.rsplit("." , 1)[1].lower() in settings.ALLOWED_EXT
     
@router.post("/upload" , response_model = UploadResponse , status_code = 201)
async def upload_doc(file : UploadFile = File(...)):
     
     if not valid_file(file.filename):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
     file.file.seek(0,2) # moving cursor to end of file
     size_mb = file.file.tell() / (1024 * 1024)
     file.file.seek(0)  # moving back to beginning
     if size_mb > settings.MAX_LENGTH:
        raise HTTPException(status_code = 400 ,  detail =f"File is too large. Maximum size is {settings.MAX_LENGTH}MB")
    

     doc_id = str(uuid.uuid4())
     safe_filename = file.filename.replace(" " , "_")
     file_path = os.path.join(settings.UPLOAD_FOLDER ,f"{doc_id}_{safe_filename}")


     async with aiofiles.open(file_path , "wb") as f:
         content = await file.read()
         await f.write(content)
         
    
     try:
         txt = ext_pdf_txt(file_path)
         if not txt.strip():
             os.remove(file_path)
             raise HTTPException(status_code=400, detail="Could not extract text. PDF may be scanned.")
             
         chunks = chunk_txt(txt , settings.PIECE_SIZE , settings.PIECE_OVERLAP)
        
        
         chroma_client = get_chroma_client(settings.CHROMA_DIR)  # conn to chroma
         collection = create_collection(chroma_client ,doc_id ) # each doc get its own collection
         embed_store(chunks , collection , doc_id)
         
         pool = await get_pool()
         async with pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO documents (doc_id, filename, file_path, chunk_count, char_count)
                VALUES ($1, $2, $3, $4, $5)
            """, doc_id, safe_filename, file_path, len(chunks), len(txt))

         return UploadResponse(
            message="Document uploaded and processed successfully",
            doc_id=doc_id,
            filename=safe_filename,
            chunk_count=len(chunks)
        )

     except HTTPException:
        raise
     except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process: {str(e)}")

@router.get("/", response_model=DocumentListResponse)
async def list_docs():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT doc_id, filename, chunk_count, char_count
            FROM documents
            ORDER BY created_at DESC
        """)
    return DocumentListResponse(
        documents=[DocumentMeta(**dict(row)) for row in rows]
    )
    
@router.delete("/{doc_id}", response_model=DeleteResponse)
async def delete_document(doc_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM documents WHERE doc_id = $1", doc_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")

        if os.path.exists(row["file_path"]):
            os.remove(row["file_path"])

        chroma_client = get_chroma_client(settings.CHROMA_DIR)
        del_collection(chroma_client, doc_id)

        await conn.execute(
            "DELETE FROM documents WHERE doc_id = $1", doc_id
        )

    return DeleteResponse(message="Document deleted successfully")