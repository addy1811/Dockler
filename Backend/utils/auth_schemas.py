from pydantic import BaseModel , EmailStr , Field
from typing import Optional
from datetime import datetime


class RegisterRequest(BaseModel):
    name: str = Field(... , min_len= 2 , max_len = 100)
    email : EmailStr
    password: str = Field(... , min_len = 8, max_len = 128)
    
class LoginRequest(BaseModel):
    email : EmailStr
    password : str = Field(... , min_len = 1)
    
class UserOut(BaseModel):
    id : str
    name : str
    email : str
    avatar_url : Optional[str] = None
    created_at : datetime
    
class TokenResponse(BaseModel):
    access_tok : str
    token_type : str = "bearer"
    user : UserOut

class MessageResponse(BaseModel):
    message : str