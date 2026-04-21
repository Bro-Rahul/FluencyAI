from typing import Set,List,Dict
from fastapi import WebSocket

class ConnectionManger:

    def __init__(self):
        self.clients:Set = set()
    
    async def connect(self,ws:WebSocket):
        await ws.accept()
        self.clients.add(ws)


    def disconnect(self,ws:WebSocket):
        self.clients.remove(ws)

connection_manager = ConnectionManger()