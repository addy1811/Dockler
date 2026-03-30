import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    GEMINI_API_KEY : str = ""
    
    SECRET_KEY : str = ""
    JWT_ALGO : str = "HS256"
    JWT_EXP_MIN: int = 60 * 24 * 7 
    
    GOOGLE_CLIENT_ID : str = ""
    GOOGLE_CLIENT_SECRET : str = ""
    GOOGLE_REDIRECT_URL : str = ""
    
    UPLOAD_FOLDER : str = os.path.join(os.path.dirname(__file__),"uploads")
    MAX_LENGTH : int= 16 
    ALLOWED_EXT : set = {"pdf"}
    
    CHROMA_DIR : str =  os.path.join(os.path.dirname(__file__) , "vectorstore")
    
    PIECE_SIZE : int= 500
    PIECE_OVERLAP : int= 50
    TOP_K_RES : int = 5
    
    DATABASE_URL : str = ""
    
    class Config:
      env_file = ".env"
    
    
settings = Settings()
    