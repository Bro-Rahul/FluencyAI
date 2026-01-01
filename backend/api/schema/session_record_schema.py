from pydantic import BaseModel
from datetime import datetime


class SessionRecordSchema(BaseModel):
    id:int
    task_id : str
    user_id : int
    title : str|None
    description : str|None
    duration : int
    status : str
    score : str|None
    created_at : datetime

class SessionStatisticsSchema(BaseModel):
    total: int
    avg : float
    streak : int