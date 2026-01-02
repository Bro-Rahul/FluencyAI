from sqlmodel import Session,select,text,Date
from sqlalchemy import func,cast,Integer,FLOAT
from api.db import get_db
from api.db.models import SessionRecords,SessionReports,Users,TaskStatus

db = next(get_db())
def run():
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
        .join(SessionReports, SessionRecords.report)
        .group_by(SessionRecords.user_id)
    ).mappings().first()

    unique_dates = (
        select(
            cast(SessionRecords.created_at, Date).label("days")
        )
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
    temp = db.exec(final_stmt).first()
    results = dict(results)
    results["streak"] = temp

    print(results)

# run()


def mark_pending():
    obj = db.exec(select(SessionRecords)).all()[0]
    print(obj.status)
    obj.status = TaskStatus.FINISH
    db.commit()
    db.refresh(obj)
    print(obj.status)



mark_pending()