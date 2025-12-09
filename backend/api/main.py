from fastapi.responses import Response
from fastapi import FastAPI,Depends
from sqlalchemy.orm import Session
from api.db import get_db
from api.db.model import User

app = FastAPI()


@app.get("/")
def hellow():
    return Response("Hi there")


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()