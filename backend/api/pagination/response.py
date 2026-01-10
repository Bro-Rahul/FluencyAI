from api.db import get_redis
from datetime import timedelta
from typing import Any
from fastapi.encoders import jsonable_encoder
import json

class PaginatedResponse:
    @staticmethod
    def query_key(key:str):
        redis = next(get_redis())
        data = redis.get(key)
        if data:
            return json.loads(data)
        return None

    @staticmethod
    def set_data(data:str,redis_key:str):
        redis = next(get_redis())
        data = redis.setex(redis_key,timedelta(minutes=10),json.dumps(data))

    @staticmethod
    def get_paginated_response(data:Any,redis_key:str):
        PaginatedResponse.set_data(jsonable_encoder(data),redis_key)
        return data[:2]