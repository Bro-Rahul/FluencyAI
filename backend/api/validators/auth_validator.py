from pydantic import BaseModel,EmailStr,constr
from typing import Annotated

class LoginUserValidator(BaseModel):
    username :Annotated[str,constr(min_length=3,max_length=30,strip_whitespace=True)]
    password :Annotated[str,constr(min_length=3,max_length=50,strip_whitespace=True)]

