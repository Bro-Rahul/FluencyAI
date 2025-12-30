from sqlmodel import Session,select
from api.db.models import Users
from api.db.models import Users



def get_user_by_email(email:str,db:Session)->Users|None:
    return db.exec(select(Users).where(Users.email == email)).first()

def get_user_by_id(id:str,db:Session)->Users|None:
    return db.exec(select(Users).where(Users.id == id)).first()