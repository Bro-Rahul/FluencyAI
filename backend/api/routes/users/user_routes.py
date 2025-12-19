from fastapi import APIRouter,Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from api.db import get_db
from api.db.model import Users
from api.validators.users_validator import CreateUserValidator
from api.views.users import user_view


routes = APIRouter()


@routes.get("/")
def list_users(db:Session=Depends(get_db)):
    users = db.query(Users).all()
    return users
