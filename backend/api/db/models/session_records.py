from typing import Optional
from datetime import datetime, timezone
from enum import Enum

from sqlmodel import SQLModel, Field, Relationship


class TaskStatus(str, Enum):
    PENDING = "pending"
    FINISH = "finish"


class SessionRecords(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    task_id: str = Field(nullable=False)

    user_id: int = Field(
        foreign_key="users.id",
        nullable=False
    )

    duration:int = Field(
        nullable=False,
        ge=0
    )

    audio_file: str = Field(nullable=False)

    status: TaskStatus = Field(
        default=TaskStatus.PENDING,
        nullable=False
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    user: "Users" = Relationship( # type: ignore
        back_populates="records"
    )

    report:"SessionReports" = Relationship( # type: ignore
        back_populates="session"
    )