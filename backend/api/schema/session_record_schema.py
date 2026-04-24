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


class SessionProfileSummarySchema(SessionStatisticsSchema):
    total_duration: int
    best_score: float
    practice_days: int
    weekly_duration: int
    weekly_sessions: int
    monthly_sessions: int
    monthly_active_days: int
    monthly_elapsed_days: int
    weekly_duration_share: int
    monthly_sessions_share: int
    monthly_active_days_share: int
    last_session_at: datetime | None
