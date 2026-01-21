from sqlmodel import Session,select
from sqlalchemy import func,cast,Date
from api.db.models import Users,SessionRecords




def get_user_by_email(email:str,db:Session)->Users|None:
    return db.exec(select(Users).where(Users.email == email)).first()

def get_user_by_id(id:str,db:Session)->Users|None:
    return db.exec(select(Users).where(Users.id == id)).first()


def list_all_users(db:Session):
    return db.exec(select(Users)).all()


def get_user_heatmap(
    id:int,
    year:int,
    db:Session
):
    stmt = (
            select(
            func.count().label("total"),
            cast(SessionRecords.created_at, Date).label("date")
            )
            .where(
                func.extract("year",SessionRecords.created_at) == year,
                SessionRecords.user_id == id
            )
            .group_by(cast(SessionRecords.created_at, Date))
        )
    result = db.exec(stmt).mappings().all()
    return result