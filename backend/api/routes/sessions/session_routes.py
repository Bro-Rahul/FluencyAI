from fastapi import APIRouter, Depends, Form, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from api.db import get_db
from api.db.model import Sessions
from typing import Annotated
from faster_whisper import WhisperModel
from pydub import AudioSegment
from io import BytesIO

routes = APIRouter()

MODEL_SIZE = "small"
DEVICE = "cpu"
COMPUTE_TYPE = "int8"

model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
CHUNK_MS = 2000 


@routes.get("/")
def get_all_sessions(db: Annotated[Session, Depends(get_db)]):
    data = db.query(Sessions).all()
    return data


def stream_transcribe_audio(audio_bytes: bytes):
    audio = AudioSegment.from_file(BytesIO(audio_bytes))
    audio = audio.set_channels(1).set_frame_rate(16000)

    for i in range(0, len(audio), CHUNK_MS):
        chunk = audio[i:i + CHUNK_MS]

        buffer = BytesIO()
        chunk.export(buffer, format="wav")
        buffer.seek(0)

        segments, info = model.transcribe(buffer, beam_size=5, vad_filter=True, without_timestamps=True)
        chunk_text = " ".join(segment.text for segment in segments).strip()
        if chunk_text:
            yield f"data: {chunk_text}\n\n"



@routes.post("/create/")
async def create_session(
    user_id: Annotated[str, Form(...)],
    audio_file: Annotated[UploadFile, File(...)]
):
    audio_bytes = await audio_file.read()
    return StreamingResponse(
        stream_transcribe_audio(audio_bytes),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )
