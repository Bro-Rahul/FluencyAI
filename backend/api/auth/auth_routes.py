from datetime import datetime, timedelta, timezone

from fastapi import Depends,HTTPException,status
from fastapi.routing import APIRouter
from fastapi.responses import JSONResponse
from api.schema.user_schema import UserCreateSchema,UserResponseSchema
from api.schema.auth_schema import (
    LoginSchema,
    AuthenticatedUsersSchema,
    SocialLoginSchema,
    ForgotPasswordRequestSchema,
    VerifyPasswordOtpSchema,
    PasswordResetTokenSchema,
    ResetPasswordSchema,
)
from api.auth.auth_curd import (
    create_access_token,
    validate_user,
    generate_otp,
    hash_otp,
    create_password_reset_token,
    validate_password_reset_token,
)
from api.crud.users import (
    create_user,
    get_user_by_email
) 

from api.crud.session_record import get_user_statistics
from api.db import get_db
from sqlmodel import Session
from api.hasher import get_password_hash
from api.config import settings
from api.utils.email import send_password_reset_otp

router = APIRouter()


def build_social_username(username: str, email: str) -> str:
    base_username = username.strip() or email.split("@")[0]
    return base_username[:30]


def normalize_utc_datetime(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


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
    user_statistics = get_user_statistics(db,user.id)
    return {
        **user.model_dump(),
        **user_statistics,
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
    user_statistics = get_user_statistics(db,user.id)

    return {
        **user.model_dump(),
        **user_statistics,
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


@router.post("/auth/forgot-password/request-otp/", response_class=JSONResponse)
def request_password_reset_otp(
    user_info: ForgotPasswordRequestSchema,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(user_info.email, db)

    if user:
        otp = generate_otp()
        user.reset_otp_hash = hash_otp(otp)
        user.reset_otp_expires_at = datetime.now(timezone.utc) + timedelta(
            minutes=settings.PASSWORD_RESET_OTP_EXPIRE_MINUTES
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        send_password_reset_otp(user.email, user.username, otp)

    return {
        "message": "If an account exists for this email, an OTP has been sent."
    }


@router.post("/auth/forgot-password/verify-otp/", response_model=PasswordResetTokenSchema, response_class=JSONResponse)
def verify_password_reset_otp(
    user_info: VerifyPasswordOtpSchema,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(user_info.email, db)
    otp_expires_at = normalize_utc_datetime(user.reset_otp_expires_at if user else None)

    if (
        not user
        or not user.reset_otp_hash
        or not otp_expires_at
        or otp_expires_at < datetime.now(timezone.utc)
        or user.reset_otp_hash != hash_otp(user_info.otp)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    user.reset_otp_hash = None
    user.reset_otp_expires_at = None
    db.add(user)
    db.commit()

    return {
        "reset_token": create_password_reset_token(user.email)
    }


@router.post("/auth/forgot-password/reset/", response_class=JSONResponse)
def reset_password(
    user_info: ResetPasswordSchema,
    db: Session = Depends(get_db)
):
    email = validate_password_reset_token(user_info.reset_token)
    user = get_user_by_email(email, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.password = get_password_hash(user_info.new_password)
    user.reset_otp_hash = None
    user.reset_otp_expires_at = None
    db.add(user)
    db.commit()

    return {
        "message": "Password reset successfully"
    }
