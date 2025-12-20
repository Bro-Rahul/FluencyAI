from faster_whisper import WhisperModel
from api.db import get_redis
from pydub import AudioSegment
from io import BytesIO
from .worker import celery_app
from redis import Redis
from celery.signals import worker_process_init
from functools import lru_cache


@lru_cache(maxsize=1)
def get_whisper_model():
    return WhisperModel(
        "small",
        device="cpu",
        compute_type="int8",
    )

@worker_process_init.connect
def load_model(**kwargs):
    get_whisper_model() 



@celery_app.task
def get_text_speech(job_id: str, audio_path: str):
    model = get_whisper_model()
    CHUNK_MS = 3000
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    redis: Redis = next(get_redis())
    stream_key = f"{job_id}_tokens"
    status_key = f"{job_id}_status"

    audio = AudioSegment.from_file(BytesIO(audio_bytes))
    audio = audio.set_channels(1).set_frame_rate(16000)

    for idx, i in enumerate(range(0, len(audio), CHUNK_MS)):
        chunk = audio[i : i + CHUNK_MS]

        buffer = BytesIO()
        chunk.export(buffer, format="wav")
        buffer.seek(0)
        segments,_ = model.transcribe(buffer,beam_size=5,vad_filter=True,without_timestamps=True,)

        for item in segments:
            token = {
                "text": item.text,
                "start": item.start,
                "end": item.end,
                "time" : item.end - item.start
            }
            redis.xadd(
                stream_key,
                token
            )

    redis.set(status_key,"done",60)
    return "success"