from pydantic import BaseModel,ConfigDict
import uuid

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class LoginUserSchema(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    avatar: str | None
    score: int
    access_token: str
