import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.database import init_db , close_db
from contextlib import asynccontextmanager
from routes.doc import router  as doc_route
from routes.chat import router as chat_route
from routes.auth import router as auth_route
from config import settings


@asynccontextmanager
async def lifespan(app : FastAPI):
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok = True)
    os.makedirs(settings.CHROMA_DIR , exist_ok = True)
    await init_db(settings.DATABASE_URL)
    print("<-----API started succesully----->")
    yield
    await close_db()
    print("<------API shutting down------->")
    
app = FastAPI(
    title = "Docking",
    version = "1.0.0",
    lifespan = lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(auth_route, prefix="/api/auth", tags=["Auth"])
app.include_router(doc_route , prefix = "/api/doc" , tags = ["Docs"])
app.include_router(chat_route , prefix = "/api/chat", tags = ["Chat"])


@app.get("/api/health", tags=["Health"])
async def health():
    return { "status" : "Ok" ," message": "It is working"}