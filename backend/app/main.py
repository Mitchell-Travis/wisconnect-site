import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.concurrency import run_in_threadpool
from pydantic import BaseModel
from sqlalchemy import text

from .database import engine
from .auth import ORIGIN, PASSWORD_COMMON_MESSAGE, router, throttle
from .contact import router as contact_router
from .inquiries import router as inquiries_router
from .newsletter import router as newsletter_router
from .accounts import router as accounts_router
from .applications import router as applications_router
from .sessions import router as sessions_router
from .businesses import router as businesses_router
from .reports import router as reports_router
from .team import router as team_router
from .preview_config import LAN_ORIGIN, LAN_HOST, allowed_client
from .request_limits import RequestBodyLimitMiddleware, is_private_api


class Health(BaseModel):
    status: str
    database: str


app = FastAPI(title="WisConnect API", version="0.1.0", docs_url=None if LAN_ORIGIN else "/docs", redoc_url=None if LAN_ORIGIN else "/redoc", openapi_url=None if LAN_ORIGIN else "/openapi.json")
app.add_middleware(RequestBodyLimitMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=[LAN_HOST] if LAN_HOST else ["localhost", "127.0.0.1"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def local_auth_boundary(request: Request, call_next):
    def protected(response):
        response.headers["Cache-Control"] = "no-store"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response

    if LAN_ORIGIN and (not request.client or not allowed_client(request.client.host)
                       or request.headers.get("host") != LAN_ORIGIN.removeprefix("http://")):
        return protected(JSONResponse({"detail": "Outside the configured mobile preview."}, status_code=403))
    if is_private_api(request.url.path):
        if (os.getenv("WISCONNECT_LOCAL_AUTH") != "1" or not request.client
                or not allowed_client(request.client.host)):
            return protected(JSONResponse({"detail": "Local authentication pilot is unavailable."}, status_code=404))
        if request.method not in {"GET", "HEAD", "OPTIONS"}:
            if request.headers.get("origin") != ORIGIN or request.headers.get("x-wisconnect-request") != "1":
                return protected(JSONResponse({"detail": "Untrusted request origin."}, status_code=403))
        try:
            if request.method not in {"GET", "HEAD", "OPTIONS"}:
                await run_in_threadpool(throttle, "write-ip:" + request.client.host, 600)
            elif request.method != "OPTIONS":
                await run_in_threadpool(throttle, "read-ip:" + request.client.host, 600, 60)
        except HTTPException as error:
            return protected(JSONResponse({"detail": error.detail}, status_code=error.status_code, headers=error.headers))
        response = await call_next(request)
        return protected(response)
    return await call_next(request)


@app.exception_handler(RequestValidationError)
async def invalid_input(request: Request, error: RequestValidationError):
    if request.url.path.startswith("/auth/team"):
        return JSONResponse({"detail": "Check the account role, permissions, access status and version. Publishing requires business editing. Confirm your password to save."}, status_code=422)
    if request.url.path.startswith("/auth/reports"):
        return JSONResponse({"detail": "Choose valid start and end dates in YYYY-MM-DD format."}, status_code=422)
    if request.url.path.startswith("/auth/businesses"):
        return JSONResponse({"detail": "Check the business fields, directory address, account link and HTTPS website. Names allow 120 characters; descriptions and internal notes allow 2,000. Choose an approved image and public profile."}, status_code=422)
    if request.url.path == "/introductions":
        return JSONResponse({"detail": "Check all five answers: name (120 characters), email (254), location (160), and business/expertise and contribution (1,200 each)."}, status_code=422)
    if request.url.path.startswith("/auth/applications"):
        return JSONResponse({"detail": "Check the required answers, review status and reviewer. Introduction answers allow 1,200 characters each; internal notes allow 2,000."}, status_code=422)
    if request.url.path == "/auth/profile" or (request.url.path.startswith("/auth/members/") and request.url.path.endswith("/profile")):
        return JSONResponse({"detail": "Check your profile: name is required (up to 100 characters); phone allows 40, location 160 and biography 2,000 characters. Reload if the saved version is missing."}, status_code=422)
    if request.url.path.startswith("/newsletter/"):
        return JSONResponse({"detail": "Use a valid email and agree to receive updates, or check your confirmation link."}, status_code=422)
    if request.url.path.startswith("/auth/contact-inquiries"):
        return JSONResponse({"detail": "Check the follow-up status, administrator and calendar date. Private notes allow 2,000 characters."}, status_code=422)
    if request.url.path == "/contact":
        return JSONResponse({"detail": "Check your name, email, topic and message (up to 3,000 characters)."}, status_code=422)
    # Return only fixed messages, never raw errors or submitted passwords.
    if any(item["type"] == "password_common" for item in error.errors()):
        return JSONResponse({"detail": PASSWORD_COMMON_MESSAGE}, status_code=422)
    for item in error.errors():
        if item["loc"][-1:] == ("password",) and item["type"] in {"string_too_short", "string_too_long"}:
            minimum = 15 if request.url.path in {"/auth/accept", "/auth/password-reset/confirm"} else 1
            return JSONResponse({"detail": f"Use {minimum}–128 characters for your password."}, status_code=422)
    # Never echo credentials or invitation tokens in validation responses.
    return JSONResponse({"detail": "Check your entries. Use a valid email, name, and a password of 15–128 characters when creating an account."}, status_code=422)


app.include_router(router)
app.include_router(contact_router)
app.include_router(inquiries_router)
app.include_router(newsletter_router)
app.include_router(accounts_router)
app.include_router(applications_router)
app.include_router(sessions_router)
app.include_router(businesses_router)
app.include_router(reports_router)
app.include_router(team_router)


if not LAN_ORIGIN:
    @app.get("/")
    def root() -> dict[str, str]:
        return {"service": "WisConnect API", "docs": "/docs"}


@app.get("/health", response_model=Health)
def health() -> Health:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return Health(status="ok", database="connected")


if LAN_ORIGIN:
    # Mount last so API endpoints keep their authentication and write protections.
    app.mount("/", StaticFiles(directory=Path(__file__).resolve().parents[2] / "out", html=True), name="mobile-website")
