from typing import Any, Callable, Dict, List, Set

from fastapi import WebSocket


class SocketEvents:
    def __init__(self):
        self.client: Set[WebSocket] = set()
        self.waiting_queue: List[str] = []
        self.peer_map: Dict[str, WebSocket] = {}
        self.socket_to_client: Dict[WebSocket, str] = {}
        self.matches: Dict[str, str] = {}
        self.events: Dict[str, Callable] = {}

    def connect(self, ws: WebSocket):
        self.client.add(ws)

    def register_client(self, ws: WebSocket, client_id: str):
        self.peer_map[client_id] = ws
        self.socket_to_client[ws] = client_id

    def disconnect(self, ws: WebSocket):
        self.client.discard(ws)
        client_id = self.socket_to_client.pop(ws, None)

        if not client_id:
            return None

        self.peer_map.pop(client_id, None)

        if client_id in self.waiting_queue:
            self.waiting_queue.remove(client_id)

        peer_id = self.matches.pop(client_id, None)
        if peer_id:
            self.matches.pop(peer_id, None)

        return client_id, peer_id

    def on(self, event):
        def decorator(func):
            self.events[event] = func
            return func

        return decorator

    async def send_json(self, ws: WebSocket | None, data: Any):
        if ws is None:
            return
        await ws.send_json(data)

    async def emit(self, ws: WebSocket | None, event: str, data: Dict[str, Any]):
        await self.send_json(
            ws,
            {
                "event": event,
                "data": data,
            },
        )

    async def forward(self, event: str, data: Dict[str, Any]):
        target_peer = data.get("target")
        target_socket = self.peer_map.get(target_peer)
        sender_id = data.get("id")
        forwarded_data = {
            **data,
            "target": sender_id,
        }
        await self.emit(target_socket, event, forwarded_data)

    async def handle(self, ws: WebSocket, payload: Dict):
        event = payload.get("event")
        data = payload.get("data", {})
        if event in self.events:
            await self.events[event](ws, data)


socket_events = SocketEvents()


@socket_events.on("find")
async def find_event(ws: WebSocket, data: Dict):
    client_id = data.get("id")
    socket_events.register_client(ws, client_id)

    if client_id in socket_events.waiting_queue:
        return

    if client_id in socket_events.matches:
        peer_id = socket_events.matches[client_id]
        await socket_events.emit(
            ws,
            "Match",
            {
                "target": peer_id,
                "role": "Caller",
            },
        )
        return

    while socket_events.waiting_queue:
        peer_id = socket_events.waiting_queue.pop(0)
        if peer_id == client_id:
            continue

        peer_socket = socket_events.peer_map.get(peer_id)
        if peer_socket is None:
            continue

        socket_events.matches[client_id] = peer_id
        socket_events.matches[peer_id] = client_id

        await socket_events.emit(
            peer_socket,
            "Match",
            {
                "target": client_id,
                "role": "Receiver",
            },
        )

        await socket_events.emit(
            ws,
            "Match",
            {
                "target": peer_id,
                "role": "Caller",
            },
        )
        return

    socket_events.waiting_queue.append(client_id)
    await socket_events.emit(
        ws,
        "Waiting",
        {},
    )


@socket_events.on("Offer")
async def offer_event(ws: WebSocket, data: Dict):
    await socket_events.forward("Offer", data)


@socket_events.on("Answer")
async def answer_event(ws: WebSocket, data: Dict):
    await socket_events.forward("Answer", data)


@socket_events.on("Ice")
async def ice_events(ws: WebSocket, data: Dict):
    await socket_events.forward("Ice", data)


@socket_events.on("Leave")
async def leave_event(ws: WebSocket, data: Dict):
    client_id = data.get("id") or socket_events.socket_to_client.get(ws)
    if not client_id:
        return

    peer_id = socket_events.matches.pop(client_id, None)
    if peer_id:
        socket_events.matches.pop(peer_id, None)
        peer_socket = socket_events.peer_map.get(peer_id)
        await socket_events.emit(
            peer_socket,
            "PeerDisconnected",
            {
                "target": client_id,
            },
        )

    if client_id in socket_events.waiting_queue:
        socket_events.waiting_queue.remove(client_id)
