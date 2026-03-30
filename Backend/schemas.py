from pydantic import BaseModel, Field
from datetime import datetime
 
 
# ── Document Schemas ──────────────────────────────────────
 
class DocumentMeta(BaseModel):
    doc_id: str
    filename: str
    chunk_count: int
    char_count: int
 
 
class UploadResponse(BaseModel):
    message: str
    doc_id: str
    filename: str
    chunk_count: int
 
 
class DocumentListResponse(BaseModel):
    documents: list[DocumentMeta]
 
 
class DeleteResponse(BaseModel):
    message: str
 
 
# ── Chat Schemas ──────────────────────────────────────────
 
class AskRequest(BaseModel):
    doc_id: str = Field(..., description="ID of the uploaded document to query")
    question: str = Field(..., min_length=1, max_length=1000, description="Question to ask about the document")
 
 
class AskResponse(BaseModel):
    doc_id: str
    question: str
    answer: str
    chunks_used: int
 
 
class ChatMessage(BaseModel):
    id: str
    question: str
    answer: str
    timestamp: datetime
 
 
class ChatHistoryResponse(BaseModel):
    doc_id: str
    filename: str
    chat_history: list[ChatMessage]
 