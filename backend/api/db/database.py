from sqlmodel import create_engine, Session
from api.config import settings
from redis import Redis


DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)

def get_db():
    with Session(engine) as session:
        yield session


def get_redis():
    redis = Redis(decode_responses=True)
    try:
        yield redis
    finally:
        redis.close()