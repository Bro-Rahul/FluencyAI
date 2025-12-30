from fastapi import APIRouter,Depends,File,UploadFile,Form
from api.crud.session_record import (
    list_sessions,
    create_new_session
)
from api.db import get_db
from api.auth import authenticated_user
from api.schema.session_record_schema import SessionRecordSchema


router = APIRouter(prefix="/sessions")

@router.get("/",response_model=list[SessionRecordSchema])
def list_sessions_api(
    user = Depends(authenticated_user),
    db = Depends(get_db)
):
    return list_sessions(db)

@router.post("/create/")
async def create_session(
    user = Depends(authenticated_user),
    audio_file:UploadFile = File(...),
    duration:int = Form(...,ge=0),
    db = Depends(get_db)
):
    new_session = await create_new_session(user.id,audio_file,duration,db)
    return new_session
