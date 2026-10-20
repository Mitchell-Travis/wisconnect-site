"""Bound API request buffering before form/JSON parsing, including chunked bodies."""

from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send


def is_private_api(path: str) -> bool:
    return (path.startswith("/auth") or path == "/contact"
            or path.startswith("/newsletter/") or path == "/introductions" or path == "/businesses")


def body_limit(path: str) -> int:
    if path.startswith("/auth/businesses"):
        return 32768
    if path == "/introductions" or path.startswith("/auth/applications"):
        return 20480
    return 16384 if path == "/contact" or path.startswith("/auth/contact-inquiries") else 8192


class RequestBodyLimitMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if (scope["type"] != "http" or not is_private_api(scope["path"])
                or scope["method"] in {"GET", "HEAD", "OPTIONS"}):
            await self.app(scope, receive, send)
            return

        limit = body_limit(scope["path"])
        lengths = [value for name, value in scope.get("headers", []) if name == b"content-length"]
        if lengths:
            if len(lengths) != 1 or not lengths[0].isdigit():
                await JSONResponse({"detail": "Invalid content length."}, status_code=400)(scope, receive, send)
                return
            # Compare bounded decimal text; do not parse an arbitrarily large integer.
            length = lengths[0].lstrip(b"0") or b"0"
            maximum = str(limit).encode("ascii")
            if len(length) > len(maximum) or (len(length) == len(maximum) and length > maximum):
                await JSONResponse({"detail": "Request too large."}, status_code=413)(scope, receive, send)
                return

        body = bytearray()
        while True:
            message = await receive()
            if message["type"] == "http.disconnect":
                return
            chunk = message.get("body", b"")
            if len(chunk) > limit - len(body):
                await JSONResponse({"detail": "Request too large."}, status_code=413)(scope, receive, send)
                return
            body.extend(chunk)
            if not message.get("more_body", False):
                break

        replayed = False

        async def bounded_receive():
            nonlocal replayed
            if not replayed:
                replayed = True
                return {"type": "http.request", "body": bytes(body), "more_body": False}
            return await receive()

        await self.app(scope, bounded_receive, send)
