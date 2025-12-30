from fastapi import APIRouter,Depends
from api.db import get_db
from api.crud.session_report import get_reports

router = APIRouter()


@router.get("/session-reports/")
def fetch_reports(
    db = Depends(get_db),
):
    return get_reports(db)