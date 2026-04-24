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
from api.gemini import client
from typing import Dict, Any

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
        )
        .where(
            func.extract("year",SessionRecords.created_at) == 2025,
            SessionRecords.user_id == 1
        )
        .group_by(cast(SessionRecords.created_at, Date))
    )
    result = db.exec(stmt).mappings().all()
    return result

""" result = get_heatmap()
for item in result:
    print(item) """

schema = {
  "score": 0,
  "ielts_band": 0.0,
  "cefr_level": "",
  "description": "",
  "key_metrics": {
    "grammar_accuracy": 0,
    "fluency": 0,
    "pacing": 0,
    "confidence": 0
  },
  "duration": "HH:MM:SS",
  "avg_pace": 0,
  "filler": {
    "total_count": 0,
    "detected": {}
  },
  "improvement_suggestions": [
    "User-spoken sentence\nImproved version"
  ],
  "grammar_corrections": [
    {
      "user_sentence": "",
      "corrected_sentence": "",
      "why_it_matters": ""
    }
  ],
  "vocabulary_enhancements": [
    {
      "original_word": "",
      "enhanced_word": ""
    }
  ],
  "comprehensive_report_md": "# Overall Report\n... (detailed analysis string) ..."
}

def get_prompt(data: Dict[str, Any]):
    prompt = f"""
    You are a professional English speech coach and linguist.
    
    Analyze the provided speech transcript and return a detailed evaluation.
    
    TASKS:
    1. Fill out all technical fields in the schema (scores, metrics, corrections).
    2. Generate a `comprehensive_report_md`. This should be a full-length, formatted Markdown string that summarizes:
       - Overall performance & "vibe."
       - Overall score: 1–10
       - Key metrics: 0–100 percentages
       - CEFR Level: A1–C2
       - Strengths and specific weaknesses.
       - A combined table of grammar and vocabulary improvements.
       - A final "Path to Success" coaching paragraph.

    OUTPUT RULES (STRICT):
    - Return ONLY valid JSON.
    - No markdown blocks outside the JSON.
    - The `comprehensive_report_md` field must contain the entire formatted report as a single string.
    - Follow this schema exactly:
    
    {json.dumps(schema, indent=2)}

    Speech Transcript (Audio Chunks):
    {data}
    """
    return prompt


def report_generate(id:int):
    
    report = db.exec(select(SessionReports).where(SessionReports.session_id == id)).first()
    print(report.transcriptions)
    print("hi")

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=get_prompt(report.transcriptions)
    )
    report.report = json.loads(response.text)
    db.commit()