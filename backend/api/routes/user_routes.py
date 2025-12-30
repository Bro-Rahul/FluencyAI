from fastapi import APIRouter,Depends
from api.db import get_db
from api.schema.user_schema import UserResponseSchema
from api.db.models import Users
from sqlmodel import Session,select
from typing import List

router = APIRouter()


@router.get("/users/",response_model=List[UserResponseSchema])
def list_users(
    db:Session = Depends(get_db),
):
    return db.exec(select(Users)).all()
