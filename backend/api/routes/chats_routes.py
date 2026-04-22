from fastapi.routing import APIRouter
from fastapi import WebSocket,WebSocketDisconnect
from api.utils import connection_manager,socket_events


routes = APIRouter(prefix="/chats")

@routes.get("/")
def get_router():
    return "hi there"


@routes.websocket("/{client_id}")
async def pair_peoples(ws:WebSocket,client_id:str):
    await connection_manager.connect(ws)

    try:
        while True:
            payload = await ws.receive_json()
            payload['data']['id'] = client_id
            await socket_events.handle(ws,payload)
        
    except WebSocketDisconnect:
        connection_manager.disconnect(ws)