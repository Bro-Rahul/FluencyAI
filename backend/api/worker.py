from celery import Celery
from celery.signals import worker_process_init
from .config import settings

celery_app = Celery(
    "worker",
    broker=settings.RABBIT_MQ_URL,
    backend=settings.REDIS_URL
)