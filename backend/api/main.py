from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routes import (
    session_records_routes,
    user_routes,
    auth_routes,
    session_reports_routes
)
from api.config import settings
import uvicorn

app = FastAPI(title="Fluency AI")
app.mount("/static",StaticFiles(directory=settings.MEDIA_ROOT),name="media")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


PREFIX = "/v1/api"

app.include_router(user_routes.router,prefix=f"{PREFIX}",tags=["Users"])
app.include_router(auth_routes.router,prefix=f"{PREFIX}",tags=["Auth"])
app.include_router(session_records_routes.router,prefix=f"{PREFIX}",tags=["Session Records"])
app.include_router(session_reports_routes.router,prefix=f"{PREFIX}",tags=["Session Reports"])

@app.get("/")
def read_root():
    return {"message": "Hello from backend!"}

if __name__ == "__main__":
    uvicorn.run(
        "api.main:app",
        reload=True
    )