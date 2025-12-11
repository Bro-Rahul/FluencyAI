from fastapi import FastAPI,Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from api.routes.users import routes as user_routes
from pydantic import ValidationError
from fastapi.exceptions import RequestValidationError



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(user_routes.routes)


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    print(exc.errors())
    formatted_errors = [
        {
            "field": ".".join(str(x) for x in err["loc"]),
            "message": err["msg"]
        }
        for err in exc.errors()
    ]
    return JSONResponse(status_code=422, content={"errors": formatted_errors})


@app.get("/")
def main():
    return "Server is Running"