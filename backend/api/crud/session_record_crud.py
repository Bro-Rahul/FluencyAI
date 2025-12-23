from sqlmodel import Session
from api.db.models import SessionReports
from api.db.models.session_records import SessionRecords,TaskStatus
from sqlalchemy.exc import SQLAlchemyError
from api.tasks import get_text_speech
from api.worker import celery_app

def create_session_record(user_id:int,audio_path:str,duration:int,db:Session):

    try:
        task = get_text_speech.delay(audio_path)
        new_record = SessionRecords(
            audio_file=audio_path,
            status=TaskStatus.PENDING,
            duration=duration,
            task_id=task.id,
            user_id=user_id,
        )
        new_record.report = SessionReports()
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record
    except SQLAlchemyError as e:
        celery_app.control.revoke(task.id, terminate=True)
        raise Exception(str(e))
