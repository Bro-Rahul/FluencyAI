from sqlmodel import Session,select,func
from api.db.models import SessionRecords,SessionReports
from api.schema.session_record_schema import SessionRecordSchema,SessionStatisticsSchema



def list_sessions(db:Session):
    statement = (
        select(
            SessionRecords.status,
            SessionRecords.id,
            SessionRecords.task_id,
            SessionRecords.user_id,
            SessionRecords.created_at,
            SessionRecords.duration,
            SessionReports.report["title"].astext.label("title"),
            SessionReports.report["score"].astext.label("score"),
            SessionReports.report["description"].astext.label("description"),
        )
        .order_by(SessionReports.created_at.desc())
        .join(SessionReports)
    )
    rows = db.exec(statement).all()
    return [
        SessionRecordSchema(**row._mapping)
        for row in rows
    ]

def list_pending_sessions(db:Session,pending_list:list[int]):
    statement = (
        select(
            SessionRecords.status,
            SessionRecords.id,
            SessionRecords.task_id,
            SessionRecords.user_id,
            SessionRecords.created_at,
            SessionRecords.duration,
            SessionReports.report["title"].astext.label("title"),
            SessionReports.report["score"].astext.label("score"),
            SessionReports.report["description"].astext.label("description"),
        )
        .order_by(SessionReports.created_at.desc())
        .where(
            SessionRecords.id.in_(pending_list)
        )
        .join(SessionReports)
    )
    rows = db.exec(statement).all()
    return [
        SessionRecordSchema(**row._mapping)
        for row in rows
    ]

def get_user_statistics(db:Session,user_id:int):
    data = db.exec(
        select(
            func.count(SessionRecords.id).label("total"),
            func.avg(SessionRecords.duration).label("avg"),
        ).group_by(SessionRecords.user_id)
    ).fetchone()
    return SessionStatisticsSchema(**data._mapping)