from api.db import get_db
from api.db.models.session_records import SessionRecords,TaskStatus
from sqlmodel import Session,select
from faster_whisper import WhisperModel
from functools import lru_cache
from celery.signals import worker_process_init
from celery.app.task import Task
from pydub import AudioSegment
from io import BytesIO
from .worker import celery_app


CHUNK_SIZE = 3000
DEVICE= "cpu"
COMPUTING_TYPE= "int8"
MODEL = "small"

@lru_cache(maxsize=1)
def get_whisper_model():
    return WhisperModel(
        MODEL,
        device=DEVICE,
        compute_type=COMPUTING_TYPE
    )

@worker_process_init.connect
def load_model(**kwargs):
    get_whisper_model() 


@celery_app.task(bind=True)
def get_text_speech(self:Task,audio_path: str):
    db:Session = next(get_db())
    session_record = db.exec(select(SessionRecords).where(SessionRecords.task_id == self.request.id)).first()
    if not session_record:
        return "No Such Session Record Exists "

    model = get_whisper_model()
    CHUNK_MS = 3000
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    audio = AudioSegment.from_file(BytesIO(audio_bytes))
    audio = audio.set_channels(1).set_frame_rate(16000)

    transcription = []
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
        transcription.append(token)
        self.update_state(
            state="PROGRESS",
            meta={
                "segments":transcription
            }
        )

    session_record.status = TaskStatus.FINISH
    session_record.report.transcriptions = transcription
    db.commit()
    db.close()
    return "success"
