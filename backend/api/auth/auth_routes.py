from fastapi import Depends,HTTPException,status
from fastapi.routing import APIRouter
from fastapi.responses import JSONResponse
from api.schema.user_schema import UserCreateSchema,UserResponseSchema
from api.schema.auth_schema import LoginSchema,AuthenticatedUsersSchema,SocialLoginSchema
from api.auth.auth_curd import create_access_token,validate_user
from api.crud.users import (
    create_user,
    get_user_by_email
) 
from api.db import get_db
from sqlmodel import Session

router = APIRouter()


def build_social_username(username: str, email: str) -> str:
    base_username = username.strip() or email.split("@")[0]
    return base_username[:30]


@router.post("/auth/login/",response_model=AuthenticatedUsersSchema,response_class=JSONResponse)
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
        "access_token": access_token,
    }

@router.post("/auth/social-login/", response_model=AuthenticatedUsersSchema, response_class=JSONResponse)
def social_login_user(
    user_info: SocialLoginSchema,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(user_info.email, db)

    if not user:
        db_user = create_user(
            UserCreateSchema(
                username=build_social_username(user_info.username, user_info.email),
                email=user_info.email,
                password=f"{user_info.provider}:{user_info.email}",
            ),
            db,
        )
        db_user.avatar = user_info.avatar
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        user = db_user
    elif user_info.avatar and user.avatar != user_info.avatar:
        user.avatar = user_info.avatar
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.email)})

    return {
        **user.model_dump(),
        "access_token": access_token,
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
