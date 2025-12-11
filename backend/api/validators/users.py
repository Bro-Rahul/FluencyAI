from pydantic import BaseModel,Field,EmailStr
from typing import Annotated

class CreateUserValidator(BaseModel):
    username:Annotated[str,Field(min_length=3,description="Username must be greater then 3 Characters",max_length=40)]
    password:Annotated[str,Field(min_length=4,description="Password must be greater then equal to 4 Character")]
    email:Annotated[str,EmailStr]
