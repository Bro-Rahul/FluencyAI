from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy.sql import func
from sqlalchemy import String, Integer, TIMESTAMP,UUID
from api.db import Base
import uuid


class Users(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    username: Mapped[str] = mapped_column(
        String,
        index=True
    )

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True
    )

    password: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    avatar: Mapped[str] = mapped_column(
        String,
        nullable=True,
    )

    score: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    created_at: Mapped[str] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    sessions: Mapped[list["Sessions"]] = relationship( # type: ignore
        "Sessions",
        back_populates="user"
    )