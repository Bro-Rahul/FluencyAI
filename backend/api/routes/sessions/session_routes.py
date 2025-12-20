from fastapi import APIRouter, Depends, Form, UploadFile,status, File, WebSocket, WebSocketDisconnect,HTTPException
from sqlalchemy.orm import Session
from api.db import get_db,Sessions,get_redis
from api.config import settings
from typing import Annotated
from redis.asyncio import Redis
from api.tasks import get_text_speech
import secrets
import time



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

    get_text_speech.delay(id,audio_file_path._str)
    return id


@routes.websocket("/transcript/{stream_name}/")
async def stream_transcript(websocket: WebSocket, stream_name: str):
    await websocket.accept()

    redis = Redis(
        host="localhost",
        port=6379,
        decode_responses=True,
    )

    stream_key = f"{stream_name}_tokens"
    status_key = f"{stream_name}_status"

    last_id = "$"

    try:
        while True:
            status = await redis.get(status_key)

            if status == "done":
                await websocket.close()
                return

            messages = await redis.xread(
                {stream_key: last_id},
                block=1000,
                count=10,
            )

            for _, entries in messages:
                for message_id, data in entries:
                    last_id = message_id
                    await websocket.send_json(data)

    except WebSocketDisconnect:
        pass
    finally:
        await redis.close()


@routes.post("/test-transcript/")
def create_session(redis:Annotated[Redis,Depends(get_redis)]):
    id = secrets.token_urlsafe(10)
    get_text_speech.delay(id,str(settings.AUDIO_ROOT_DIR / 'smallqvmZ2G4.mp3'))
    status_key = f"{id}_status"
    redis.set(status_key,"processing")
    return id
    
