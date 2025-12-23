from pydantic import BaseModel
from datetime import datetime


class SessionRecordResponseSchema(BaseModel):
    id:int
    task_id : str
    user_id : int
    title : str|None
    description : str|None
    duration : int
    status : str
    duration : int
    created_at : datetime