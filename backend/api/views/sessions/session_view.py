from api.db import Sessions
from sqlalchemy.orm import Session
import uuid

def create_new_session(user_id:uuid.UUID,audio_file:str,db:Session)->Sessions:
    new_session = Sessions(user_id=user_id,audio_file=audio_file)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session 