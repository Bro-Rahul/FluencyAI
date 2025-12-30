from sqlmodel import Session,select
from api.db.models import SessionRecords,SessionReports
from api.schema.session_record_schema import SessionRecordSchema


def list_sessions(db:Session):
    statement = (
        select(
            SessionRecords.id,
            SessionRecords.task_id,
            SessionRecords.user_id,
            SessionRecords.created_at,
            SessionRecords.duration,
            SessionRecords.status,
            SessionReports.report["title"].astext.label("title"),
            SessionReports.report["score"].astext.label("score"),
            SessionReports.report["description"].astext.label("description"),
        )
        .join(SessionReports)
    )
    rows = db.exec(statement).all()
    return rows