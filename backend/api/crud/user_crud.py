from sqlmodel import Session,select
from api.db.models import Users
from api.schema.user_schema import UserCreateSchema
from api.db.models import Users
from api.hasher import get_password_hash

def get_user_by_email(email:str,db:Session)->Users|None:
    return db.exec(select(Users).where(Users.email == email)).first()

def get_user_by_id(id:str,db:Session)->Users|None:
    return db.exec(select(Users).where(Users.id == id)).first()

def create_user(user_data:UserCreateSchema,db:Session):
    hash_password = get_password_hash(user_data.password)
    print(hash_password)
    new_users = user_data.model_dump(exclude="password")
    user_exists = get_user_by_email(user_data.email,db)
    if user_exists:
        raise Exception("User Already Exists With this Email")
    db_user = Users(**new_users,password=hash_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user