from fastapi import APIRouter,Depends
from api.db import get_db
from api.crud.session_report import (
    get_reports,
    get_report_by_session_id
)
from api.schema.session_report_schema import SessionReportSchema


router = APIRouter(prefix="/session-reports")


@router.get("/")
def fetch_reports(
    db = Depends(get_db),
):
    return get_reports(db)

@router.get("/{session_id}/",response_model=SessionReportSchema)
def get_report(
    session_id:str,
    db = Depends(get_db)
):
    return get_report_by_session_id(db,session_id)