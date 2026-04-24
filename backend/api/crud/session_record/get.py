from datetime import datetime, timezone, timedelta

from sqlmodel import Session,select,func,Date,cast,text,FLOAT
from api.db.models import SessionRecords,SessionReports
from api.schema.session_record_schema import SessionRecordSchema


def _build_share(value: int, total: int):
    if total <= 0:
        return 0
    return min(100, round((value / total) * 100))


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


def get_user_profile_summary(db: Session, user_id: int):
    statistics = get_user_statistics(db, user_id)
    sessions = list_sessions(db, user_id)

    now = datetime.now(timezone.utc)
    week_start = now - timedelta(days=6)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_elapsed_days = now.day

    total_duration = 0
    best_score = 0.0
    practice_days: set = set()
    monthly_active_days: set = set()
    weekly_duration = 0
    weekly_sessions = 0
    monthly_sessions = 0
    last_session_at = None

    for session in sessions:
        created_at = session["created_at"]
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        duration = int(session["duration"] or 0)
        score = float(session["score"] or 0)

        total_duration += duration
        best_score = max(best_score, score)
        practice_days.add(created_at.date())

        if last_session_at is None or created_at > last_session_at:
            last_session_at = created_at

        if created_at >= week_start:
            weekly_duration += duration
            weekly_sessions += 1

        if created_at >= month_start:
            monthly_sessions += 1
            monthly_active_days.add(created_at.date())

    return {
        **statistics,
        "total_duration": total_duration,
        "best_score": best_score,
        "practice_days": len(practice_days),
        "weekly_duration": weekly_duration,
        "weekly_sessions": weekly_sessions,
        "monthly_sessions": monthly_sessions,
        "monthly_active_days": len(monthly_active_days),
        "monthly_elapsed_days": monthly_elapsed_days,
        "weekly_duration_share": _build_share(weekly_duration, total_duration),
        "monthly_sessions_share": _build_share(monthly_sessions, statistics["total"]),
        "monthly_active_days_share": _build_share(len(monthly_active_days), monthly_elapsed_days),
        "last_session_at": last_session_at,
    }
