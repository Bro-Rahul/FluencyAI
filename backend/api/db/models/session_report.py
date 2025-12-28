from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from sqlmodel import SQLModel,Field,Relationship
from datetime import datetime,timezone
from typing import Dict,Any,List


class SessionReports(SQLModel,table=True):
    id:int = Field(default=None,primary_key=True)

    session_id:int = Field(
            foreign_key="sessionrecords.id",
            nullable=False
        )
    transcriptions: List[Dict[str, Any]] = Field(
        default_factory=list,
        sa_column=Column(JSONB)
    )

    report:Dict[str,Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB)
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    session:"SessionRecords" = Relationship( # type: ignore
        back_populates="report"
    )