import uuid
import httpx
import argon2
from argon2 import PasswordHasher
from argon2.exceptions import VerificationError , VerifyMismatchError , InvalidHashError
from fastapi import APIRouter , HTTPException , Depends
from fastapi.responses import RedirectResponse
from utils.database import get_pool
from utils.jwt_utils import create_access_tok , get_user_id
from utils.auth_schemas import RegisterRequest , LoginRequest , UserOut , TokenResponse , MessageResponse
from config import settings

router = APIRouter() 

ph = PasswordHasher()

def user_row(row) -> UserOut:
    return UserOut(
        id = row["id"],
        name = row["name"],
        email = row["email"],
        avatar_url = row["avatar_url"],
        created_at= row["created_at"],
    )
    
@router.post("/register" , response_model = TokenResponse , status_code = 201)
async def register(body : RegisterRequest):
  pool = await  get_pool()
  async  with pool.acquire() as conn:
      
       exist = await conn.fetchrow(
            "SELECT id FROM users WHERE email = $1" , body.email
       )
       if exist:
           raise HTTPException(status_code = 409 , detail = "An account with this email already exists.")
       
       
       password_hash = ph.hash(body.password)
       
       user_id = str(uuid.uuid4())
       row = await conn.fetchrow(
           """INSERT INTO users (id , name , email , password_hash) VALUES ($1 , $2 , $3 , $4) 
           RETURNING id , name , email , avatar_url , created_at""",
           user_id, body.name , body.email , password_hash
       )
       
       token = create_access_tok(user_id)
       return TokenResponse(access_tok= token , user = user_row(row))
   
   
@router.post("/login" , response_model = TokenResponse)
async def login(body : LoginRequest):
    pool = await get_pool()
    async with pool.acquire() as conn:
         row = await conn.fetchrow(
             "SELECT id, name, email, password_hash, avatar_url, created_at FROM users WHERE email = $1", body.email
         )
         if not row:
             raise HTTPException(status_code = 401 , detail = "Invalid email or password")
         
         if not row["password_hash"]:
             raise HTTPException(status_code = 401, detail= "This account uses Google Sign-In. Please continue with Google")
         
         
         try:
             ph.verify(row["password_hash"], body.password)
         except (VerifyMismatchError , VerificationError , InvalidHashError):
             raise HTTPException(status_code = 401 , detail = "Invalid email or password")
         
         if ph.check_needs_rehash(row["password_hash"]):
            new_hash = ph.hash(body.password)
            async with pool.acquire() as conn2:
                await conn2.execute(
                    "UPDATE users SET password_hash = $1 WHERE id = $2",
                    new_hash, row["id"]
                )
    token = create_access_tok(row["id"])
    return TokenResponse(access_token=token, user= user_row(row))

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
 
@router.get("/google")
async def google_login():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth is not configured.")
    params = (
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URL}"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
        f"&access_type=offline"
    )
    return RedirectResponse(url=GOOGLE_AUTH_URL + params)

@router.get("/google/callback")
async def google_callback(code: str):
    
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501 , detail="Google OAuth is not configured.")
    
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URL,
            "grant_type": "authorization_code",
        })
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange Google auth code.")
        google_token = token_resp.json()["access_token"]
        
        user_resp = await client.get(
            GOOGLE_USERINFO_URL, headers={"Authorization": f"Bearer {google_token}"}
        )
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Google user info.")
        g = user_resp.json()
        
    google_id = g.get("sub")
    email     = g.get("email")
    name      = g.get("name", email.split("@")[0])
    avatar    = g.get("picture")
 
    pool = await get_pool()
    async with pool.acquire() as conn:
        
        row = await conn.fetchrow(
            "SELECT id FROM users WHERE google_id = $1 OR email = $2", google_id , email
        )
        
        if row:
            user_id = row["id"]
            await conn.execute(
                "UPDATE users SET google_id = $1, avatar_url = $2, updated_at = NOW() WHERE id = $3",
                google_id, avatar, user_id
            )
        else:
            user_id = str(uuid.uuid4())
            await conn.execute(
                """
                 INSERT INTO users (id, name, email, google_id, avatar_url)
                VALUES ($1, $2, $3, $4, $5)
                """,
                user_id, name, email, google_id, avatar
            )
    jwt_token = create_access_tok(user_id)
    frontend_url = f"http://localhost:5173/app?token={jwt_token}"
    return RedirectResponse(url=frontend_url)


@router.get("/me" , response_model = UserOut)
async def get_me(user_id : str = Depends(get_user_id)):
    pool = await get_pool()
    async  with pool.acquire() as conn:
        row = conn.fetchrow(
            "SELECT id , name , email , avatar_url , created_at FROM users WHERE id = $1", user_id
        )
        if not row:
            raise HTTPException(status_code = 404 , detaik = "User not found")
        return user_row(row)
    