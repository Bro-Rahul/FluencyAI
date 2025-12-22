from fastapi import APIRouter,Depends,File,UploadFile
from api.db import get_db
from api.db.models import Users
from api.db.models import SessionRecords
from api.tasks import get_text_speech
from api.crud.session_record_crud import create_session_record
from api.schema.session_record_schema import SessionRecordResponseSchema
from celery.result import AsyncResult
from sqlmodel import select,Session
from api.crud.auth_crud import authenticated_user
from api.config import settings
from api.worker import celery_app
from secrets import token_hex


router = APIRouter()

@router.get("/sessions/",response_model=list[SessionRecordResponseSchema])
def list_sessions(
    user:Users = Depends(authenticated_user),
    db:Session=Depends(get_db)
):
    result = db.exec(select(SessionRecords)).all()
    return result


@router.post("/sessions/create/",response_model=SessionRecordResponseSchema)
async def create_sessionrecord(
    user:Users = Depends(authenticated_user),
    db:Session = Depends(get_db),
    audio_file:UploadFile = File(...,) 
):
    audio_bytes = await audio_file.read()
    name,ext = audio_file.filename.split(".")
    unique_hex = token_hex(6)
    file_path = settings.AUDIO_ROOT_DIR / f"{name}{unique_hex}.{ext}" 

    with open(file_path,"wb") as f:
        f.write(audio_bytes)

    task = get_text_speech.delay(str(file_path))

    new_session = create_session_record(
        task_id=task.id,
        user_id=user.id,
        audio_path=str(file_path),
        db=db
    )

    return new_session
    


@router.get("/sessions/{task_id}/")
async def create_sessionrecord(
    task_id:str
):
    result = AsyncResult(task_id, app=celery_app)
    return {
        "task_id": task_id,
        "status": result.status,
        "ready": result.ready(),
        "successful": result.successful(),
        "result": result.result if result.ready() else result.info,
    }
