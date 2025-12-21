from fastapi import APIRouter,HTTPException,Depends,status
from sqlalchemy.orm import Session
from api.views.users import user_view
from api.views.auth import auth_view
from api.validators.users_validator import CreateUserValidator
from api.validators.auth_validator import LoginUserValidator
from api.schema.auth import TokenSchema,LoginUserSchema
from api.exceptions.user_exceptions import UserAlreadyExistsException
from api.db import get_db



router = APIRouter()

@router.post("/register/")
def register_user(
    register_info:CreateUserValidator,
    db:Session = Depends(get_db)
):
    try:
        new_user = user_view.create_user(user_data=register_info,db=db)
    except UserAlreadyExistsException as e:
        return HTTPException(400,"User is already Exists with this Email")
    return new_user


@router.post("/login/",response_model=LoginUserSchema)
def login_user(
    login_details:LoginUserValidator,
    db:Session = Depends(get_db)
):
    user = auth_view.verify_user(login_details,db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth_view.create_access_token(data={"sub": str(user.id)})
    response = LoginUserSchema(
        id=user.id,
        username=user.username,
        email=user.email,
        score=user.score,
        avatar=user.avatar,
        access_token=access_token
    )
    return response