from typing import Dict,List,Set,Callable,Any
from fastapi import WebSocket
from pydantic import BaseModel


class WebRTCPayload(BaseModel):
    client_id : str


class SocketEvents:
    
    def __init__(self):
        self.client:Set = set()
        self.waiting_queue:List[str] = []
        self.peer_map:Dict[str,WebSocket] = {}
        self.events:Dict[str,Callable] = {}

    
    def connect(self,ws:WebSocket):
        self.client.add(ws)

    def disconnect(self,ws:WebSocket):
        self.client.remove(ws)

    
    def on(self, event):
        def decorator(func):
            self.events[event] = func
            return func
        return decorator
    
    async def send_json(self,ws:WebSocket,data:Any):
        await ws.send_json(data)

    async def handle(self,ws:WebSocket,payload:Dict):
        event = payload.get("event")
        data = payload.get("data")
        if event in self.events:
            await self.events[event](ws, data)


socket_events = SocketEvents()


@socket_events.on("find")
async def find_event(ws:WebRTCPayload,data:Dict):
    client_id = data.get("id")

    if socket_events.waiting_queue:
        peer_id = socket_events.waiting_queue[-1]
        peer_socket = socket_events.peer_map.get(peer_id)
        await socket_events.send_json(peer_socket,{
            "event": "Match",
            "data" : {
                "target" : client_id,
                "role" : "Receiver"
            }
        })

        await socket_events.send_json(ws,{
            "event": "Match",
            "data" : {
                "target" : peer_id,
                "role": "Caller"
            }
        })
    else:
        socket_events.waiting_queue.append(client_id)
        socket_events.peer_map[client_id] = ws
        await socket_events.send_json(ws,{
            "event" : "Waiting",
            "data" : {}
        })
        


@socket_events.on("Offer")
async def offer_event(ws:WebSocket,data:Dict):
    print("Offer invoke ")
    print(data)
    target_peer = data.get("target")
    target_socket = socket_events.peer_map.get(target_peer)
    await socket_events.send_json(target_socket,data)


@socket_events.on("Answer")
async def answer_event(ws:WebSocket,data:Dict):
    print("Answer invoke ")
    target_peer = data.get("target")
    target_socket = socket_events.peer_map.get(target_peer)
    await socket_events.send_json(target_socket,data)
    

@socket_events.on("Ice")
async def ice_events(ws:WebSocket,data:Dict):
    print("Ice invoke ")
    target_peer = data.get("target")
    target_socket = socket_events.peer_map.get(target_peer)
    await socket_events.send_json(target_socket,data)

