from typing import Optional, Annotated
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field,Relationship
from pydantic import EmailStr
from typing import List


class Users(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    username: Annotated[str, Field(max_length=30, nullable=False)]
    email: Annotated[EmailStr, Field(unique=True, nullable=False)]
    password: Annotated[str, Field(nullable=False)]

    score: Annotated[int, Field(default=0)]

    avatar: Annotated[Optional[str], Field(nullable=True)]

    created_at: Annotated[
        datetime,
        Field(default_factory=lambda: datetime.now(timezone.utc))
    ]
    
    records: List["SessionRecords"] = Relationship( # type: ignore
        back_populates="user"
    )