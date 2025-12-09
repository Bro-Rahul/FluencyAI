from .database import Base,engine,get_db
from .model import User,Post

Base.metadata.create_all(bind=engine)
