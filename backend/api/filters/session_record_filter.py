from sqlmodel import select,desc,asc,FLOAT,cast
from api.db.models import SessionRecords,SessionReports



class SessionRecordFilter:

    ORDER_BY_MAP = {
        "score": cast(SessionReports.report["score"], FLOAT),
        "created_at": SessionRecords.created_at,
    }

    @staticmethod
    def query(order_by: str, direction: str = "desc"):
        column = SessionRecordFilter.ORDER_BY_MAP.get(order_by)

        if column is None:
            raise ValueError(f"Invalid order_by field: {order_by}")

        order_clause = desc(column) if direction == "desc" else asc(column)

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
            .order_by(order_clause)
        )
        return statement
