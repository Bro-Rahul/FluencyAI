from fastapi import Depends,HTTPException,status
from fastapi.routing import APIRouter
from api.schema.user_schema import UserCreateSchema,UserResponseSchema
from api.schema.auth_schema import LoginSchema,AuthenticatedUsersSchema
from api.auth.auth_curd import create_access_token,validate_user
from api.crud.user_crud import (
    create_user,
    get_user_by_email
) 
from api.db import get_db
from sqlmodel import Session

router = APIRouter()


@router.post("/auth/login/",response_model=AuthenticatedUsersSchema)
def login_user(
    user_details : LoginSchema,
    db:Session = Depends(get_db)
):
    try:
        user = validate_user(user_details,db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    access_token = create_access_token(data={"sub": str(user.email)})
    return {
        **user.model_dump(),   
        "access_token" : access_token
    }

@router.post("/auth/register/",response_model=UserResponseSchema)
def register_user(
    user_info : UserCreateSchema,
    db:Session = Depends(get_db)
):
    user = get_user_by_email(user_info.email,db)
    if user:
        raise HTTPException(
            detail="User Already Exists with this account",
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    db_user = create_user(user_info,db)
    return db_user