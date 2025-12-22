from pydantic import BaseModel
from datetime import datetime


class SessionRecordResponseSchema(BaseModel):
    id:int
    task_id : str
    user_id : int
    status : str
    created_at : datetime