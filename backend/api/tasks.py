from faster_whisper import WhisperModel
from api.db import get_redis
from pydub import AudioSegment
from io import BytesIO
from .worker import celery_app
from api.config import settings
from redis import Redis
import time


MODEL_SIZE = "small"
DEVICE = "cpu"
COMPUTE_TYPE = "int8"

model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
CHUNK_MS = 3000

@celery_app.task
def add_number(x:int,y:int):
    time.sleep(10)
    return x+y


@celery_app.task
def generate_lines(job_id:int):
    redis:Redis = next(get_redis())
    redis.xadd("dsds","",)
    for i in range(10):
        time.sleep(5)


@celery_app.task
def update_counter(job_id:str):
    redis:Redis = next(get_redis()) 
    for i in range(10):
        redis.set(job_id,i+1)
        time.sleep(5)
    redis.delete(job_id)
    return "Update Success"



@celery_app.task
def get_text_speech(job_id: str, audio_path: str):
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    redis: Redis = next(get_redis())

    audio = AudioSegment.from_file(BytesIO(audio_bytes))
    audio = audio.set_channels(1).set_frame_rate(16000)

    stream_name = f"transcription:{job_id}"

    for idx, i in enumerate(range(0, len(audio), CHUNK_MS)):
        chunk = audio[i : i + CHUNK_MS]

        buffer = BytesIO()
        chunk.export(buffer, format="wav")
        buffer.seek(0)

        segments, info = model.transcribe(
            buffer,
            beam_size=5,
            vad_filter=True,
            without_timestamps=True,
        )

        chunk_text = " ".join(
            segment.text for segment in segments
        ).strip()

        if not chunk_text:
            continue

        redis.xadd(
            stream_name,
            {
                "job_id": job_id,
                "chunk_index": idx,
                "text": chunk_text,
            },
        )
    return "success"


@celery_app.task
def speech_text():
    MODEL_SIZE = "small"
    DEVICE = "cpu"
    COMPUTE_TYPE = "int8"

    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
    CHUNK_MS = 3000
    audio_path = settings.AUDIO_ROOT_DIR / "small-Qgmpng.mp3"
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    redis: Redis = next(get_redis())

    audio = AudioSegment.from_file(BytesIO(audio_bytes))
    audio = audio.set_channels(1).set_frame_rate(16000)

    stream_name = "test"

    for idx, i in enumerate(range(0, len(audio), CHUNK_MS)):
        chunk = audio[i:i+CHUNK_MS]
        buffer = BytesIO()
        chunk.export(buffer, format="wav")
        buffer.seek(0)

        # safer params for Celery
        segments, info = model.transcribe(
            buffer,
            beam_size=1,
            vad_filter=False,  
        )

        chunk_text = " ".join(segment.text for segment in segments).strip()
        if chunk_text:
            redis.xadd(stream_name, {"chunk_index": idx, "text": chunk_text})

    return "success"