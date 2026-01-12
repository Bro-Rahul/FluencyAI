from sqlmodel import Session,select,text,Date,or_
from sqlalchemy import func,cast,Integer,FLOAT
from api.db import get_db
from api.db.models import SessionRecords,SessionReports,Users,TaskStatus
from pathlib import Path
from api.filters.session_record_filter import SessionRecordFilter
from api.pagination.response import PaginatedResponse
from api.schema.session_record_schema import SessionRecordSchema
import json
from fastapi.encoders import jsonable_encoder

path = Path(__file__).parent / "api" / "media" / "audios"

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


def set_pending(id:int):
    record = db.exec(select(SessionRecords).where(SessionRecords.id == id)).first()
    print(record)
    record.status = TaskStatus.PENDING
    db.commit()

def set_finish(id:int):
    record = db.exec(select(SessionRecords).where(SessionRecords.id == id)).first()
    print(record)
    record.status = TaskStatus.FINISH
    db.commit()


def get_status(id:int):
    record = db.exec(select(SessionRecords).where(SessionRecords.id == id)).first()
    print(record.status)

# set_pending(12)
# set_finish(12)
# get_status(12)


def filter():
    result = db.exec(select(SessionRecords).order_by(SessionRecords.id.desc()))
    for item in result:
        print(item.id)

# filter()

def get_paginated(key:str):
    
    rows = db.exec(SessionRecordFilter.query("created_at")).mappings().all()
    filter_data = [SessionRecordSchema(**item) for item in rows]
    response = PaginatedResponse.get_paginated_response(filter_data,key)
    return response

# get_paginated()

def fetch(key:str):
    data = PaginatedResponse.query_key(key)
    if data is None:
        data = get_paginated(key)
    
    for item in data:
        print(item)

def get_heatmap():
    stmt = (
        select(
            func.count().label("total"),
            cast(SessionRecords.created_at, Date).label("date")
        ).filter(SessionRecords.user_id == 1)
        .group_by(cast(SessionRecords.created_at, Date))
    )
    result = db.exec(stmt).mappings().all()
    return result

result = get_heatmap()
for item in result:
    print(item)