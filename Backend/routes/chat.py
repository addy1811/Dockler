from fastapi import APIRouter, HTTPException
from schemas import AskRequest, AskResponse, ChatMessage, ChatHistoryResponse, DeleteResponse
from utils.vectorStore import retrieve_chunks, get_chroma_client, create_collection
from utils.llm import get_llm_ans
from utils.database import get_pool
from config import settings
import uuid

router = APIRouter()


@router.post("/ask", response_model=AskResponse)
async def ask_quest(body: AskRequest):

    pool = await get_pool()
    async with pool.acquire() as conn:
        doc = await conn.fetchrow(
            "SELECT doc_id FROM documents WHERE doc_id = $1", body.doc_id
        )
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found. Please upload it first.")

    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="Gemini API key not configured")

    try:
        chroma_client = get_chroma_client(settings.CHROMA_DIR)
        collection = create_collection(chroma_client, body.doc_id)
        chunks = retrieve_chunks(
            query=body.question,
            collection=collection,
            top_k=settings.TOP_K_RES
        )

        answer = await get_llm_ans(
            question=body.question,
            context_chunks=chunks,
            api_key=settings.GEMINI_API_KEY
        )

        chat_id = str(uuid.uuid4())
        async with pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO chat_history (id, doc_id, question, answer, chunks_used)
                VALUES ($1, $2, $3, $4, $5)
            """, chat_id, body.doc_id, body.question, answer, len(chunks))

        return AskResponse(
            doc_id=body.doc_id,
            question=body.question,
            answer=answer,
            chunks_used=len(chunks)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate answer: {str(e)}")


@router.get("/history/{doc_id}", response_model=ChatHistoryResponse)
async def get_chat_history(doc_id: str):
    pool = await get_pool()

    async with pool.acquire() as conn:
        doc = await conn.fetchrow(
            "SELECT filename FROM documents WHERE doc_id = $1", doc_id
        )

        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        rows = await conn.fetch("""
            SELECT id, question, answer, created_at as timestamp
            FROM chat_history
            WHERE doc_id = $1
            ORDER BY created_at ASC
        """, doc_id)

    return ChatHistoryResponse(
        doc_id=doc_id,
        filename=doc["filename"],
        chat_history=[ChatMessage(**dict(row)) for row in rows]
    )


@router.delete("/history/{doc_id}", response_model=DeleteResponse)
async def clear_chat_history(doc_id: str):
    pool = await get_pool()

    async with pool.acquire() as conn:
        doc = await conn.fetchrow(
            "SELECT doc_id FROM documents WHERE doc_id = $1", doc_id
        )
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        await conn.execute(
            "DELETE FROM chat_history WHERE doc_id = $1", doc_id
        )

    return DeleteResponse(message="Chat history cleared successfully")