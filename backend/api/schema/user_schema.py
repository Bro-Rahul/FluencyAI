from pydantic import BaseModel,constr,EmailStr
from typing import Annotated
from datetime import date,datetime


class UserCreateSchema(BaseModel):
    username : Annotated[str,constr(min_length=3,max_length=30,strip_whitespace=True)]
    email : Annotated[str,EmailStr]
    password : str

class UserResponseSchema(BaseModel):
    id : int
    username : str
    email : str
    avatar : str|None
    score : int
    created_at : datetime

class UserHeatMapSchema(BaseModel):
    date: date
    total : int