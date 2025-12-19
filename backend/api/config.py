from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).parent

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    RABBIT_MQ_URL: str
    AUDIO_ROOT_DIR:Path = BASE_DIR / "media" / "audios"
    PROFILE_ROOT_DIR:Path = BASE_DIR / "media" / "profile"
    ALGORITHM:str
    SECRET_KEY:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int

    class Config:
        env_file = ".env"

settings = Settings()