from sqlmodel import Session,select,Integer,cast
from api.db.models import SessionRecords,SessionReports
from api.db import get_db
from fastapi.routing import APIRouter
from fastapi import Depends
from sqlmodel import desc,asc
from pydantic import BaseModel
from enum import Enum
from api.auth import authenticated_user


class SortField(str, Enum):
    score = "score"
    created_at = "created_at"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


router = APIRouter(prefix="/filter")

@router.get("/")
def get_filter_values(
    sort_by: SortField = SortField.score,
    order: SortOrder = SortOrder.desc,
    user = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    column_map = {
        SortField.score: SessionReports.report['score'],
        SortField.created_at: SessionRecords.created_at,
    }

    column = column_map[sort_by]

    query = (
        select(SessionRecords,SessionReports.report)
        .join(SessionReports)
        .where(SessionRecords.user_id == user.id)
        .order_by(
            column.asc() if order == SortOrder.asc else column.desc()
        )
    )

    return db.exec(query).mappings().all()
