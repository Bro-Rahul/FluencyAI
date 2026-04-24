from typing import Annotated
from fastapi import Depends, HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from api.db.models import Users
from api.db import get_db
from api.schema.auth_schema import LoginSchema
from api.exceptions.users_ecceptions import InvalidCredencialsException,UserDoesNotExistsException
from api.hasher import verify_password
from api.config import settings
from api.crud.users import get_user_by_email
from datetime import datetime,timedelta,timezone
from sqlmodel import Session,select
from jose import jwt
from jose.exceptions import JWTError
import hashlib
import secrets


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")



def validate_user(
    user_details : LoginSchema,
    db:Session
):
    user = db.exec(select(Users).where(Users.username == user_details.username)).first()
    if not user:
        raise UserDoesNotExistsException("User Does not Existe with the following credencials")
    
    if not verify_password(user_details.password,user.password):
        raise InvalidCredencialsException("User Does not Existe with the following credencials")

    return user


def create_access_token(data: dict, expires_delta: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire_time = datetime.now(timezone.utc) + timedelta(minutes=expires_delta) 
    to_encode.update({"exp": expire_time})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def generate_otp(length: int = 6) -> str:
    return "".join(secrets.choice("0123456789") for _ in range(length))


def hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode("utf-8")).hexdigest()


def create_password_reset_token(email: str, expires_delta: int = settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES):
    to_encode = {
        "sub": email,
        "scope": "password_reset",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expires_delta),
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def validate_password_reset_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired reset token",
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        scope = payload.get("scope")
        if not email or scope != "password_reset":
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception



def authenticated_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db:Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        raise credentials_exception
    user = get_user_by_email(user_id,db)
    if user is None:
        raise credentials_exception
    return user


def authenticated_user_token(
    token:str,
    db:Session
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        raise credentials_exception
    user = get_user_by_email(user_id,db)
    if user is None:
        raise credentials_exception
    return user
