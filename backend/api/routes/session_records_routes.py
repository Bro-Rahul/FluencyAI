from fastapi import APIRouter,Depends,File,UploadFile,Form
from fastapi.responses import StreamingResponse
from fastapi.requests import Request
from api.crud.session_record import (
    list_sessions,
    list_pending_sessions,
    create_new_session,
    get_user_statistics
)
from api.db import get_db
from api.auth import authenticated_user_token,authenticated_user
from fastapi.encoders import jsonable_encoder
import asyncio
import json
from api.schema.session_record_schema import SessionStatisticsSchema

router = APIRouter(prefix="/sessions")

@router.get("/")
async def list_sessions_sse(
    request:Request,
    db=Depends(get_db),
):
    token = request.query_params.get("token")
    user = authenticated_user_token(token,db)
    async def generator():
        results = list_sessions(db)
        while True:
            yield f"data: {json.dumps(jsonable_encoder(results))}\n\n"
            pending = [item.id for item in results if item.status == "pending"]
            results = list_pending_sessions(db, pending)
            if not results:
                yield "event: close\ndata: done\n\n"
                return 
            await asyncio.sleep(2)

    return StreamingResponse(
        generator(),
        media_type="text/event-stream",
    )


@router.post("/create/")
async def create_session(
    user = Depends(authenticated_user),
    audio_file:UploadFile = File(...),
    duration:int = Form(...,ge=0),
    db = Depends(get_db)
):
    new_session = await create_new_session(user.id,audio_file,duration,db)
    return new_session



@router.get("/get-statistics/",response_model=SessionStatisticsSchema)
async def get_stats(
    user = Depends(authenticated_user),
    db = Depends(get_db)
):
    result = get_user_statistics(db,user.id)
    print(result)
    return result

