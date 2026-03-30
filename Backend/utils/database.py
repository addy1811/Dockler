import asyncpg
from typing import Optional

_pool: Optional[asyncpg.Pool] = None


async def init_db(database_url: str):
    global _pool
    _pool = await asyncpg.create_pool(
        dsn=database_url,
        min_size=5,
        max_size=20,
        command_timeout=60
    )
    await create_tables()


async def get_pool() -> asyncpg.Pool:
    return _pool


async def close_db():
    if _pool:
        await _pool.close()


async def create_tables():
    async with _pool.acquire() as conn:
        await conn.execute("""
             CREATE TABLE IF NOT EXISTS users (
                id            TEXT PRIMARY KEY,
                name          TEXT NOT NULL,
                email         TEXT NOT NULL UNIQUE,
                password_hash TEXT,                          
                google_id     TEXT UNIQUE,                   
                avatar_url    TEXT,
                created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
 
            CREATE INDEX IF NOT EXISTS idx_users_email
                ON users(email);
 
            CREATE INDEX IF NOT EXISTS idx_users_google_id
                ON users(google_id);
                
            CREATE TABLE IF NOT EXISTS documents (
                doc_id      TEXT PRIMARY KEY,
                user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
                filename    TEXT NOT NULL,
                file_path   TEXT NOT NULL,
                chunk_count INTEGER NOT NULL DEFAULT 0,
                char_count  INTEGER NOT NULL DEFAULT 0,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_documents_user_id
                ON documents(user_id);
                
            CREATE TABLE IF NOT EXISTS chat_history (
                id          TEXT PRIMARY KEY,
                doc_id      TEXT NOT NULL REFERENCES documents(doc_id) ON DELETE CASCADE,
                question    TEXT NOT NULL,
                answer      TEXT NOT NULL,
                chunks_used INTEGER NOT NULL DEFAULT 0,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_chat_history_doc_id
                ON chat_history(doc_id);
        """)