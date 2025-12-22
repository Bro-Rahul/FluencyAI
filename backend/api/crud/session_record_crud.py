from sqlmodel import Session
from api.db.models.session_records import SessionRecords,TaskStatus


def create_session_record(task_id:str,user_id:int,audio_path:str,db:Session):
    new_record = SessionRecords(
        audio_file=audio_path,
        status=TaskStatus.PENDING,
        task_id=task_id,
        user_id=user_id,
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record
