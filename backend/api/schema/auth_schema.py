from pydantic import BaseModel
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
