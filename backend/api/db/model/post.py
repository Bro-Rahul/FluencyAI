from sqlalchemy import Column, Integer, String
from api.db import Base

class Post(Base):
    __tablename__ = "Posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String, unique=True, index=True)