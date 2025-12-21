from pydantic import BaseModel,ConfigDict,U
import uuid

class SessionCreate(BaseModel):
    user_id: uuid.UUID 
    audio_file: str

    model_config = ConfigDict(from_attributes=True)


class NewSessionResponse(BaseModel):
    session: SessionCreate
    job_id: str
