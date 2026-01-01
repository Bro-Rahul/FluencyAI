from fastapi.encoders import jsonable_encoder
from sqlmodel import Session,select
from api.db.models import SessionReports,SessionRecords

def get_reports(
    db:Session
):

    result = db.exec(select(SessionReports)).all()
    data = jsonable_encoder(result)
    return data


def get_report_by_session_id(
    db:Session,
    session_id : int
):
    result = db.exec(
        select(
            SessionReports.id,
            SessionReports.session_id,
            SessionReports.report,
            SessionReports.transcriptions,
            SessionReports.created_at,
            SessionRecords.audio_file,
            SessionRecords.duration
        )
        .join(SessionRecords,SessionReports.session_id == SessionRecords.id)
        .where(
            SessionReports.session_id == session_id)
        ).mappings().one_or_none()
    return result