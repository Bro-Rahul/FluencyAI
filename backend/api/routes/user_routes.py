from fastapi import APIRouter,Depends
from api.db import get_db
from api.schema.user_schema import UserResponseSchema,UserHeatMapSchema
from api.auth import authenticated_user
from typing import List
from api.crud.users import (
    list_all_users,
    get_user_heatmap
)

router = APIRouter(prefix="/users")


@router.get("/",response_model=List[UserResponseSchema])
def list_users(
    db = Depends(get_db),
):
    return list_all_users(db) 


@router.get("/heat-map/",response_model=List[UserHeatMapSchema])
def user_heatmap(
    year:int,
    user = Depends(authenticated_user),
    db = Depends(get_db),
):
    return get_user_heatmap(user.id,year,db)