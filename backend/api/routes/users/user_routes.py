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

@routes.post("/create/")
def create(userData:CreateUserValidator,db:Session=Depends(get_db)):
    try:
        return user_view.create_user(user_data=userData,db=db)
    except Exception as e:
        return JSONResponse({
            "errors": str(e)
        },status_code=400)
        

