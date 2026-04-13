from sqlmodel import Session,select,func,Date,cast,text,FLOAT
from api.db.models import SessionRecords,SessionReports
from api.schema.session_record_schema import SessionRecordSchema


def list_sessions(db:Session, user_id:int):
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
        .where(SessionRecords.user_id == user_id)
        .order_by(SessionReports.created_at.desc())
        .join(SessionReports)
    )
    rows = db.exec(statement).mappings().all()
    return rows
   

def list_pending_sessions(db:Session, pending_list:list[int], user_id:int):
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
            SessionRecords.id.in_(pending_list),
            SessionRecords.user_id == user_id,
        )
        .join(SessionReports)
    )
    rows = db.exec(statement).mappings().all()
    return rows

def get_user_statistics(db:Session,user_id:int):
    results = db.exec(
            select(
                func.count("*").label("total"),
                func.avg(
                    func.coalesce(
                        cast(
                            SessionReports.report["score"].astext,
                            FLOAT(precision=2,decimal_return_scale=2)
                        ),
                        0
                    )
                ).label("avg")
            )
            .where(SessionRecords.user_id == user_id)
            .join(SessionReports, SessionRecords.report)
            .group_by(SessionRecords.user_id)
        ).mappings().first()

    unique_dates = (
        select(
            cast(SessionRecords.created_at, Date).label("days")
        )
        .where(SessionRecords.user_id == user_id)
        .distinct()
        .cte("unique_dates")
    )

    row_number_cte = (
        select(
            unique_dates.c.days,
            func.row_number()
            .over(order_by=unique_dates.c.days)
            .label("rn")
        )
        .cte("row_number")
    )

    strike = (
        select(
            row_number_cte.c.days,
            row_number_cte.c.rn,
            (
                row_number_cte.c.days
                - text("INTERVAL '1 day'") * row_number_cte.c.rn
            ).label("abc")
        )
        .cte("strike")
    )

    streak_counts = (
        select(func.count().label("data"))
        .select_from(strike)
        .group_by(strike.c.abc)
        .subquery()
    )

    final_stmt = select(func.max(streak_counts.c.data))
    streak = db.exec(final_stmt).first()
    results = dict(results or {"total": 0, "avg": 0})
    results["total"] = int(results.get("total") or 0)
    results["avg"] = float(results.get("avg") or 0)
    results["streak"] = int(streak or 0)
    return results
