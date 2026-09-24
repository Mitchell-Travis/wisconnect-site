import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from .database import engine
from .auth import ORIGIN, PASSWORD_COMMON_MESSAGE, router, throttle


class Health(BaseModel):
    status: str
    database: str


app = FastAPI(title="WisConnect API", version="0.1.0")
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def local_auth_boundary(request: Request, call_next):
    if request.url.path.startswith("/auth"):
        if (os.getenv("WISCONNECT_LOCAL_AUTH") != "1" or not request.client
                or request.client.host not in {"127.0.0.1", "::1"}):
            return JSONResponse({"detail": "Local authentication pilot is unavailable."}, status_code=404)
        if request.method not in {"GET", "HEAD", "OPTIONS"}:
            if request.headers.get("origin") != ORIGIN or request.headers.get("x-wisconnect-request") != "1":
                return JSONResponse({"detail": "Untrusted request origin."}, status_code=403)
            if len(await request.body()) > 8192:
                return JSONResponse({"detail": "Request too large."}, status_code=413)
            try:
                throttle("ip:" + request.client.host, 80)
            except HTTPException as error:
                return JSONResponse({"detail": error.detail}, status_code=error.status_code, headers=error.headers)
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response
    return await call_next(request)


@app.exception_handler(RequestValidationError)
async def invalid_input(request: Request, error: RequestValidationError):
    # Return only fixed messages, never raw errors or submitted passwords.
    if any(item["type"] == "password_common" for item in error.errors()):
        return JSONResponse({"detail": PASSWORD_COMMON_MESSAGE}, status_code=422)
    for item in error.errors():
        if item["loc"][-1:] == ("password",) and item["type"] in {"string_too_short", "string_too_long"}:
            minimum = 15 if request.url.path == "/auth/accept" else 1
            return JSONResponse({"detail": f"Use {minimum}–128 characters for your password."}, status_code=422)
    # Never echo credentials or invitation tokens in validation responses.
    return JSONResponse({"detail": "Check your entries. Use a valid email, name, and a password of 15–128 characters when creating an account."}, status_code=422)


app.include_router(router)


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "WisConnect API", "docs": "/docs"}


@app.get("/health", response_model=Health)
def health() -> Health:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return Health(status="ok", database="connected")
