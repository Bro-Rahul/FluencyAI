from fastapi import APIRouter,Depends
from api.db.models import SessionReports
from sqlmodel import Session,select
from api.db import get_db


router = APIRouter()


@router.get("/session_reports/")
def get_reports(
    db:Session = Depends(get_db),
):
    result = db.exec(select(SessionReports)).all()
    return result