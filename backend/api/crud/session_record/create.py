from fastapi import HTTPException,UploadFile
from api.tasks import generate_report
from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError
from api.db.models import SessionRecords,SessionReports,TaskStatus
from secrets import token_hex
from api.config import settings


def create_session_record(
    user_id:int,
    audio_path:str,
    duration:int,
    db:Session
):
    try:
        task_id = token_hex(10)      

        new_record = SessionRecords(
            audio_file=audio_path,
            status=TaskStatus.PENDING,
            duration=duration,
            task_id=task_id,
            user_id=user_id,
        )
        new_record.report = SessionReports()
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        full_path = settings.AUDIO_ROOT_DIR / audio_path
        generate_report.delay(task_id,str(full_path))  # create the task once the task is store in db
        return new_record
    except SQLAlchemyError as e:
        raise Exception(str(e))


async def create_new_session(
    user_id:int,
    audio_file:UploadFile, 
    duration:int,
    db : Session,
):
    audio_bytes = await audio_file.read()
    name,ext = audio_file.filename.split(".")
    unique_hex = token_hex(6)
    file_name =  f"{name}{unique_hex}.{ext}"
    file_path = settings.AUDIO_ROOT_DIR / file_name 

    with open(file_path,"wb") as f:
        f.write(audio_bytes)

    try:
        new_session = create_session_record(
            audio_path=file_name,
            duration=duration,
            user_id=user_id,
            db=db
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    return new_session 
    
