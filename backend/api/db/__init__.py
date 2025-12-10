from .database import Base,engine,get_db
from .model import Users,Sessions

Base.metadata.create_all(bind=engine)
