from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UUID, ForeignKey,String
from api.db import Base
import uuid


class Sessions(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    audio_file:Mapped[str] = mapped_column(
        String,
        nullable=False   
    )

    speech_text:Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    user: Mapped["user"] = relationship(back_populates="sessions") # type: ignore
