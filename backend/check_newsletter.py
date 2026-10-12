"""Newsletter integration checks in an owned disposable PostgreSQL schema.
Uses local Mailpit only; leaves application records and unrelated messages intact.
"""
import json
import re
import os
import secrets
import socket
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from unittest.mock import patch
from uuid import uuid4

from sqlalchemy import create_engine, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session
from starlette.requests import Request as AppRequest

from .app import newsletter
from .app.auth import DUMMY_HASH, digest, now
from .app.database import DATABASE_URL
from .app.models import NewsletterSubscriber as Subscriber, LoginSession, User


def main():
    suffix = secrets.token_hex(6)
    schema = "newsletter_check_" + suffix
    base = create_engine(DATABASE_URL)
    with base.begin() as conn:
        conn.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({"options": f"-csearch_path={schema}"})
    engine = create_engine(url)
    environment = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False),
                       WISCONNECT_LOCAL_AUTH="1", WISCONNECT_CONTACT_MAIL_MODE="local")
    process = None
    log = tempfile.TemporaryFile()
    owned_mail = []
    email = f"newsletter-{suffix}@example.test"

    def mail(path, body=None, method="GET"):
        req = Request("http://127.0.0.1:8025/api/v1" + path,
                      data=json.dumps(body).encode() if body else None,
                      method=method, headers={"Content-Type": "application/json"})
        with urlopen(req, timeout=5) as response:
            data = response.read()
            return json.loads(data) if data and method == "GET" else None

    try:
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "head"],
                       env=environment, check=True)
        cookies = {}
        with Session(engine) as db:
            for role in ["admin", "member"]:
                user = User(name="Newsletter test " + role, email=f"{role}-{suffix}@example.test",
                            password_hash=DUMMY_HASH, role=role)
                db.add(user)
                db.flush()
                secret = secrets.token_urlsafe(32)
                db.add(LoginSession(token_hash=digest(secret), user_id=user.id, expires_at=now() + timedelta(hours=1)))
                cookies[role] = "wisconnect_local_session=" + secret
            db.commit()
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        process = subprocess.Popen([sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1",
                                    "--port", str(port), "--no-access-log", "--no-proxy-headers"],
                                   env=environment, stdout=log, stderr=log,
                                   creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0)

        def request(path, body=None, role=None, origin="http://localhost:3000"):
            headers = {"Content-Type": "application/json", "Origin": origin, "X-WisConnect-Request": "1"}
            if role:
                headers["Cookie"] = cookies[role]
            req = Request(f"http://127.0.0.1:{port}" + path,
                          data=json.dumps(body).encode() if body is not None else None, headers=headers)
            try:
                response = urlopen(req, timeout=20)
            except HTTPError as exc:
                response = exc
            with response:
                data = response.read()
                return response.status, json.loads(data) if data else None

        for _ in range(100):
            try:
                if request("/health")[0] == 200:
                    break
            except URLError:
                time.sleep(.1)
        else:
            raise AssertionError("Newsletter test API did not start")

        payload = {"email": "  " + email.upper() + "  ", "consent": True}
        endpoint = "/newsletter/subscribe"
        assert request(endpoint, payload, origin="https://untrusted.example")[0] == 403
        for change in [{"email": "bad"}, {"email": "a..b@example.test"}, {"consent": False},
                       {"email": "a@-example.test"}, {"email": "a@example.test\nBcc: b@example.test"}]:
            assert request(endpoint, {**payload, **change})[0] == 422
        assert request(endpoint, {**payload, "extra": "x" * 9000})[0] == 413
        assert request("/auth/newsletter-subscribers")[0] == 401
        assert request("/auth/newsletter-subscribers", role="member")[0] == 403
        with ThreadPoolExecutor(max_workers=3) as pool:
            results = list(pool.map(lambda _: request(endpoint, payload), range(3)))
        assert all(status == 202 for status, _ in results)
        with Session(engine) as db:
            rows = list(db.scalars(select(Subscriber)))
            assert len(rows) == 1 and rows[0].email == email and rows[0].status == "pending"
            row_id = rows[0].id
        assert request("/auth/newsletter-subscribers", role="admin")[1]["items"] == []

        def messages():
            result = []
            for item in mail("/messages?limit=200")["messages"]:
                detail = mail("/message/" + item["ID"])
                if email in json.dumps(detail):
                    result.append(detail)
            return result

        captured = messages()
        assert len(captured) == 1, "Concurrent signups must send exactly one email"
        content = captured[0]["Text"]
        confirmation = re.search(r"#confirm=([A-Za-z0-9_-]{43})", content).group(1)
        unsubscribe = re.search(r"#unsubscribe=([A-Za-z0-9_-]{43})", content).group(1)
        with Session(engine) as db:
            row = db.get(Subscriber, row_id)
            assert row.confirmation_hash == digest(confirmation) and row.unsubscribe_hash == digest(unsubscribe)
        assert request("/newsletter/confirm", {"token": "x" * 43})[0] == 400
        with ThreadPoolExecutor(max_workers=2) as pool:
            confirmations = list(pool.map(lambda _: request("/newsletter/confirm", {"token": confirmation}), range(2)))
        assert sorted(status for status, _ in confirmations) == [200, 400]
        active = request("/auth/newsletter-subscribers", role="admin")[1]["items"]
        assert len(active) == 1 and active[0]["status"] == "subscribed"
        assert set(active[0]) == {"id", "email", "status", "created_at", "confirmed_at", "unsubscribed_at", "consent_version"}
        assert request(endpoint, payload)[1] == results[0][1] and len(messages()) == 1
        assert request("/newsletter/unsubscribe", {"token": unsubscribe})[0] == 200
        assert request("/newsletter/unsubscribe", {"token": unsubscribe})[0] == 200
        assert request("/auth/newsletter-subscribers", role="admin")[1]["items"] == []
        assert request("/newsletter/confirm", {"token": confirmation})[0] == 400

        # Resubscription requires fresh consent and a new confirmation; expiry never activates.
        assert request(endpoint, payload)[0] == 202
        latest = messages()[0]["Text"]
        new_confirmation = re.search(r"#confirm=([A-Za-z0-9_-]{43})", latest).group(1)
        assert new_confirmation != confirmation
        with Session(engine) as db:
            row = db.get(Subscriber, row_id)
            assert row.status == "pending"
            row.confirmation_expires_at = now() - timedelta(seconds=1)
            row.last_sent_at = now() - timedelta(minutes=2)
            db.commit()
        assert request("/newsletter/confirm", {"token": new_confirmation})[0] == 400
        assert request(endpoint, payload)[0] == 202
        newest = messages()[0]["Text"]
        token = re.search(r"#confirm=([A-Za-z0-9_-]{43})", newest).group(1)
        assert request("/newsletter/confirm", {"token": token})[0] == 200

        # Failed SMTP leaves a retryable, inactive record; no external mail transport is used.
        fake_request = AppRequest({"type": "http", "client": ("127.0.0.1", 1)})
        failure_email = "failure-" + email
        with Session(engine) as db, patch.object(newsletter, "send_confirmation", side_effect=OSError("offline")):
            try:
                newsletter.subscribe(newsletter.SubscribeInput(email=failure_email, consent=True), fake_request, db)
                raise AssertionError("Expected SMTP failure")
            except newsletter.HTTPException as error:
                assert error.status_code == 503
        with Session(engine) as db:
            row = db.scalar(select(Subscriber).where(Subscriber.email == failure_email))
            assert row.status == "pending" and row.confirmation_hash is None and row.last_sent_at is None
            with patch.object(newsletter, "send_confirmation") as sender:
                assert newsletter.subscribe(newsletter.SubscribeInput(email=failure_email, consent=True), fake_request, db)["accepted"]
                sender.assert_called_once()
        for _ in range(12):
            last_status, _ = request(endpoint, payload)
        assert last_status == 429
        print("PASS: PostgreSQL migration, validation, origin/size limits, duplicate/concurrent signup, one captured email, hashed tokens, single-use confirmation, expiry, unsubscribe, resubscribe, SMTP failure/retry, admin-only active list, safe fields and throttling. No external email.")
    finally:
        if process:
            process.terminate()
            process.wait(timeout=10)
        log.close()
        engine.dispose()
        with base.begin() as conn:
            conn.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()
        # Also find owned mail after a partial test failure.
        for item in mail("/messages?limit=200")["messages"]:
            if item["ID"] not in owned_mail and email in json.dumps(mail("/message/" + item["ID"])):
                owned_mail.append(item["ID"])
        if owned_mail:
            mail("/messages", {"IDs": owned_mail}, "DELETE")


if __name__ == "__main__":
    main()
