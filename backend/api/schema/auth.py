from pydantic import BaseModel
import uuid

class TokenSchema(BaseModel):
    access_token: str
    token_type: str
