from datetime import datetime , timedelta , timezone
from typing import Optional
from fastapi import Security , HTTPException
import jwt
from fastapi.security import HTTPBearer , HTTPAuthorizationCredentials
from config import settings 

bearer_tok = HTTPBearer(auto_error=False)

def create_access_tok(user_id: str) -> str:
    jwt_expire = datetime.now(timezone.utc) + timedelta(minutes = settings.JWT_EXP_MIN)
    payload = {
        "sub" : user_id,
        "exp" : jwt_expire,
        "iat" : datetime.now(timezone.utc),
    }
    return  jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGO)

def decode_access_tok(token : str) -> str:
      try:
          payload = jwt.decode(token , settings.SECRET_KEY , algorithm = [settings.JWT_ALGO])
          user_id : str = payload.get("sub")
          if not user_id :
              raise HTTPException(status = 401 , detail = "Invalid token payload")
          return user_id
      
      except jwt.ExpiredSignatureError:
          raise HTTPException(staus = 401 , detail = "Token has expired. Please log in again.")
      except jwt.InvalidTokenError:
          raise HTTPException(status_code=401, detail="Invalid token. Please log in again.")
      
async def get_user_id(credentials : Optional[HTTPAuthorizationCredentials] = Security(bearer_tok)) -> str:
    if not credentials:
        raise HTTPException(status_code = 401 , detail = "Not authenticated. Please log in")
    return decode_access_tok(credentials.credentials)