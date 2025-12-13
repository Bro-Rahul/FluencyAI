from fastapi import APIRouter,Depends,Form,UploadFile,File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from api.db import get_db
from api.db.model import Sessions
from typing import Annotated
from faster_whisper import WhisperModel
import asyncio
import tempfile


routes = APIRouter(prefix='/sessions')
device = "cuda" if torch.cuda.is_available() else "cpu"
model_size="medium" if device=="cuda" else "small"
compute_type="float16" if device=="cuda" else "int8"

@routes.get("/")
def get_all_sessions(db:Annotated[Session,Depends(get_db)]):
    data = db.query(Sessions).all()
    return data


async def stream(audio_bytes: bytes):
    model = WhisperModel(model_size, device=device, compute_type=compute_type) 

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmp:
        tmp.write(audio_bytes)
        tmp.flush()

        segments, _ = model.transcribe(tmp.name, vad_filter=True)

    for seg in segments:
        yield seg.text


@routes.post("/create/")
async def create_session(
    user_id: Annotated[str, Form(...)],
    audio_file: Annotated[UploadFile, File(...)]
):
    audio_bytes = await audio_file.read()

    return StreamingResponse(
        stream(audio_bytes),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )



async def stream_number():
    for i in range(5):
        yield f"chunk {i+1}"
        await asyncio.sleep(1)

    yield "event: end\ndata: done\n\n"


@routes.get("/get/")
async def create_session_get():
    return StreamingResponse(
        stream_number(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        })