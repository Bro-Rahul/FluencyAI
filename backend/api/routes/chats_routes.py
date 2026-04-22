from fastapi import WebSocket, WebSocketDisconnect
from fastapi.routing import APIRouter

from api.utils import connection_manager, socket_events


routes = APIRouter(prefix="/chats")

@routes.get("/")
def get_router():
    return "hi there"


@routes.websocket("/{client_id}")
async def pair_peoples(ws: WebSocket, client_id: str):
    await connection_manager.connect(ws)
    socket_events.connect(ws)
    try:
        while True:
            payload = await ws.receive_json()
            payload.setdefault("data", {})
            payload["data"]["id"] = client_id
            await socket_events.handle(ws, payload)
    except WebSocketDisconnect:
        connection_manager.disconnect(ws)
        disconnected = socket_events.disconnect(ws)
        if disconnected:
            _, peer_id = disconnected
            if peer_id:
                peer_socket = socket_events.peer_map.get(peer_id)
                await socket_events.emit(
                    peer_socket,
                    "PeerDisconnected",
                    {
                        "target": client_id,
                    },
                )
