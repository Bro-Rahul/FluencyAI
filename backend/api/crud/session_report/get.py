from fastapi.encoders import jsonable_encoder
from sqlmodel import Session,select
from api.db.models import SessionReports

def get_reports(
    db:Session
):

    result = db.exec(select(SessionReports)).all()
    data = jsonable_encoder(result)
    return data