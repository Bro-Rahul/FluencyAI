from pydantic import BaseModel, EmailStr, Field
from api.schema.user_schema import UserResponseSchema


class LoginSchema(BaseModel):
    username : str
    password : str

class SocialLoginSchema(BaseModel):
    email: str
    username: str
    avatar: str | None = None
    provider: str

class AuthenticatedUsersSchema(UserResponseSchema):
    access_token : str


class ForgotPasswordRequestSchema(BaseModel):
    email: EmailStr


class VerifyPasswordOtpSchema(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=4, max_length=8)


class PasswordResetTokenSchema(BaseModel):
    reset_token: str


class ResetPasswordSchema(PasswordResetTokenSchema):
    new_password: str = Field(min_length=6)
