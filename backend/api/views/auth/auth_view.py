from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException,status
from api.validators.auth_validator import LoginUserValidator
from api.views.users import user_view
from api.utils.hasher import Hasher
from api.config import settings
from api.db import get_db,Users
from sqlalchemy.orm import Session
from datetime import timedelta,datetime,timezone
from jose import jwt
from jose.exceptions import ExpiredSignatureError
from typing import Annotated


oauth2_schema = OAuth2PasswordBearer(tokenUrl="/token")


def verify_user(login_info:LoginUserValidator,db:Session):
    user_details = user_view.get_user_by_username(login_info.username,db=db)
    if not user_details:
        return False

    if Hasher.verify_password(login_info.password,user_details.password):
        return False
    
    return user_details



def create_access_token(data: dict, expires_delta: int=15):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode,settings.SECRET_KEY,settings.ALGORITHM)
    return encoded_jwt



def get_authenticated_user(
    token:Annotated[str,Depends(oauth2_schema)],
    db:Annotated[Session,Depends(get_db)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_details = payload.get("sub")
        if user_details is None:
            raise credentials_exception
    except ExpiredSignatureError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is Expired!",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise credentials_exception

    user = db.query(Users).filter(Users.id == user_details).first()
    if not user:
        raise credentials_exception
    return user