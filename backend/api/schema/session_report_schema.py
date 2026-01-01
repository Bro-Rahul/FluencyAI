from pydantic import BaseModel
from typing import Dict,Any,List
from datetime import datetime


class SessionReportSchema(BaseModel):
    id : int
    session_id : int
    created_at : datetime
    report : Dict[str,Any]
    transcriptions : List[Dict[str,Any]]
    audio_file : str
    duration : int