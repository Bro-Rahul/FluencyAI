from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Session
from api.config import settings
from redis import Redis


DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
    redis = Redis(
        host="localhost",
        port=6379,
        db=0,
        decode_responses=True,
    )
    try:
        yield redis
    finally:
        redis.close()