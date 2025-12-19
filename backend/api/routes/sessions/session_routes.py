from fastapi import APIRouter, Depends, Form, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from api.db import get_db,get_redis
from api.db.model import Sessions
from api.config import settings
from typing import Annotated
from faster_whisper import WhisperModel
from pydub import AudioSegment
from io import BytesIO
from redis.asyncio import Redis
from api.tasks import get_text_speech,update_counter,speech_text
import secrets
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=2)  # adjust depending on CPU cores


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

        segments, info = model.transcribe(
            buffer,
            beam_size=1,       # reduce for speed
            vad_filter=False,  # avoid hanging on short chunks
            without_timestamps=True
        )
        chunk_text = " ".join(segment.text for segment in segments).strip()
        if chunk_text:
            yield f"data: {chunk_text}\n\n"



def chunk_audio(audio_bytes: bytes):
    """Yield AudioSegment chunks from the uploaded audio."""
    audio = AudioSegment.from_file(BytesIO(audio_bytes))
    audio = audio.set_channels(1).set_frame_rate(16000)
    for i in range(0, len(audio), CHUNK_MS):
        yield audio[i:i + CHUNK_MS]

async def transcribe_chunk(chunk):
    """
    Run the blocking model.transcribe in a thread, returning the text.
    """
    loop = asyncio.get_running_loop()
    buffer = BytesIO()
    chunk.export(buffer, format="wav")
    buffer.seek(0)

    # Run the blocking call in a thread
    segments, _info = await loop.run_in_executor(
        executor,
        lambda: model.transcribe(buffer, beam_size=1, vad_filter=False, without_timestamps=True)
    )
    chunk_text = " ".join(segment.text for segment in segments).strip()
    return chunk_text

async def stream_transcribe_audio_async(audio_bytes: bytes):
    """Async generator streaming transcription results."""
    for chunk in chunk_audio(audio_bytes):
        chunk_text = await transcribe_chunk(chunk)
        if chunk_text:
            yield f"data: {chunk_text}\n\n"

@routes.post("/create/")
async def create_session(
    user_id: Annotated[str, Form(...)],
    audio_file: Annotated[UploadFile, File(...)]
):
    audio_bytes = await audio_file.read()
    return StreamingResponse(
        stream_transcribe_audio_async(audio_bytes),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@routes.post("/create-transcript/")
async def create_session(
    user_id: Annotated[str, Form(...)],
    audio_file: Annotated[UploadFile, File(...)]
):
    audio_bytes = await audio_file.read()
    name,ext = audio_file.filename.split(".")  
    id = secrets.token_urlsafe(5)
    audio_file_path = settings.AUDIO_ROOT_DIR / f"{name}{id}.{ext}"

    with open(audio_file_path,"wb") as f:
        f.write(audio_bytes)

    get_text_speech.delay(id,audio_file_path._str)
    return id


@routes.post("/transcript-test/")
def create_session():
    speech_text.delay()
    return "test"



@routes.get("/generate-task")
def generate_new_task(redis:Annotated[Redis,Depends(get_redis)]):
    id = secrets.token_urlsafe(16)
    update_counter.delay(id)
    redis.set(id,1)
    return f"{id}"


@routes.websocket("/ws/{job_id}/")
async def get_counter(
    websocket: WebSocket,
    job_id: str,
    redis: Annotated[Redis, Depends(get_redis)],
):
    await websocket.accept()

    try:
        while True:
            value = redis.get(job_id)
            if value:
                value_str = value.decode()
                await websocket.send_text(value_str)
                await asyncio.sleep(5)
            else:
                await websocket.close()
                break
    except WebSocketDisconnect:
        pass


@routes.websocket("/ws/transcript/{stream_name}/")
async def stream_transcript(
    websocket: WebSocket,
    stream_name: str,
):
    await websocket.accept()

    last_id = "0"
    redis = Redis(
        host="localhost",
        port=6379,
        db=0,
        decode_responses=True,
    )
    try:
        while True:
            messages = await redis.xread(
                {stream_name: last_id},
                block=1000,
            )

            for _, entries in messages:
                for message_id, data in entries:
                    last_id = message_id

                    if "text" in data:
                        await websocket.send_json({
                            "chunk_index": int(data.get("chunk_index", 0)),
                            "text": data["text"],
                        })

                    if data.get("event") == "done":
                        await websocket.close()
                        return

    except WebSocketDisconnect:
        print(f"WebSocket disconnected")
