from api.validators.users_validator import CreateUserValidator
from sqlalchemy.orm import Session
from api.db.model import Users
from api.utils.hasher import Hasher
from api.exceptions.user_exceptions import UserAlreadyExistsException

def get_user_by_email(email:str,db:Session)->Users:
    return db.query(Users).filter_by(email=email).first()

def get_user_by_username(username:str,db:Session)->Users:
    return db.query(Users).filter_by(username=username).first()


def create_user(user_data:CreateUserValidator,db:Session)->Users:
    user_dict = user_data.model_dump() 
    user_dict["password"] = Hasher.get_password_hash(user_dict["password"])
    user_already_present = get_user_by_email(user_dict['email'],db)
    if user_already_present:
        raise UserAlreadyExistsException("An user with this email already registered try different email")
    new_user = Users(**user_dict)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user 