from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Optional

BASE_DIR = Path(__file__).parent

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    RABBIT_MQ_URL: str
    AUDIO_ROOT_DIR:Path = BASE_DIR / "media" / "audios"
    PROFILE_ROOT_DIR:Path = BASE_DIR / "media" / "profile"
    MEDIA_ROOT:Path = BASE_DIR / "media"
    ALGORITHM:str
    SECRET_KEY:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    GEMINI_API_KEY:str
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False
    PASSWORD_RESET_OTP_EXPIRE_MINUTES: int = 10
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 15

    class Config:
        env_file = ".env"

settings = Settings()
