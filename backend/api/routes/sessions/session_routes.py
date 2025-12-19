from fastapi import APIRouter, Depends, Form, UploadFile, File, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from api.db import get_db,Sessions
from api.config import settings
from typing import Annotated
from redis.asyncio import Redis
from api.tasks import get_text_speech
import secrets



routes = APIRouter()

@routes.get("/")
def get_all_sessions(db: Annotated[Session, Depends(get_db)]):
    data = db.query(Sessions).all()
    return data


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

    # get_text_speech.delay(id,audio_file_path._str)
    return id


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
