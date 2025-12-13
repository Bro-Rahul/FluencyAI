FROM python:3.11-slim

WORKDIR /app

COPY requiredments.txt .

RUN pip install --no-cache-dir -r requiredments.txt

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
