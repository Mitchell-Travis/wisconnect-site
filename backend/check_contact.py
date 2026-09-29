"""Contact integration checks in an owned disposable PostgreSQL schema.
Uses local Mailpit only; leaves application records and unrelated messages intact.
"""
import json
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

from .app import contact
from .app.auth import DUMMY_HASH, digest, now
from .app.database import DATABASE_URL
from .app.models import ContactInquiry, LoginSession, User


def main():
    suffix = secrets.token_hex(6)
    schema = "contact_check_" + suffix
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
    email = f"contact-{suffix}@example.test"

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
                user = User(name="Contact test " + role, email=f"{role}-{suffix}@example.test",
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
            raise AssertionError("Contact test API did not start")

        payload = {"submission_id": str(uuid4()), "name": "  Test visitor  ", "email": email,
                   "message": "First line & collaboration.\nSecond line 🟣"}
        assert request("/contact", payload, origin="https://untrusted.example")[0] == 403
        for change in [{"name": "  "}, {"email": "bad-address"}, {"message": "  "},
                       {"message": "x" * 3001}, {"topic": "Unknown"}, {"email": "a@example.test\nBcc: other@example.test"}]:
            status, error = request("/contact", {**payload, **change})
            assert status == 422 and "password" not in error["detail"]
        assert request("/contact", {**payload, "message": "x" * 17000})[0] == 413
        assert request("/auth/contact-inquiries")[0] == 401
        assert request("/auth/contact-inquiries", role="member")[0] == 403

        # Concurrent resubmits share one database record and serialized email attempt.
        with ThreadPoolExecutor(max_workers=3) as pool:
            results = list(pool.map(lambda _: request("/contact", payload), range(3)))
        assert all(status == 201 and body["received"] for status, body in results)
        ids = {body["reference"] for _, body in results}
        assert len(ids) == 1
        inquiry_id = ids.pop()
        assert request("/contact", {**payload, "message": "Changed"})[0] == 409
        status, listing = request("/auth/contact-inquiries", role="admin")
        assert status == 200 and len(listing["items"]) == 1
        saved = listing["items"][0]
        assert saved["name"] == "Test visitor" and saved["topic"] == "General inquiry"
        assert saved["message"] == payload["message"] and saved["email_status"] == "sent"
        assert saved["email_mode"] == "local"
        assert request(f"/auth/contact-inquiries/{inquiry_id}/retry-email", {}, role="member")[0] == 403

        # Persist first even when SMTP fails; an administrator can retry.
        failed_payload = contact.ContactInput(**{**payload, "submission_id": str(uuid4()), "message": "SMTP failure test " + suffix})
        with patch.dict(os.environ, {"WISCONNECT_CONTACT_MAIL_MODE": "local"}):
            with Session(engine) as db, patch.object(contact, "send_email", side_effect=OSError("test")):
                receipt = contact.submit_contact(failed_payload, AppRequest({"type": "http", "client": ("127.0.0.1", 1)}), db)
                failed_id = receipt["reference"]
                assert db.get(ContactInquiry, failed_id).email_status == "failed"
        status, retry = request(f"/auth/contact-inquiries/{failed_id}/retry-email", {}, role="admin")
        assert status == 200 and retry["email_status"] == "sent"
        assert request(f"/auth/contact-inquiries/{failed_id}/retry-email", {}, role="admin")[1]["email_status"] == "sent"

        # Verify pagination without sending another 26 messages.
        with Session(engine) as db:
            for i in range(26):
                db.add(ContactInquiry(submission_id=str(uuid4()), name="Pagination test", email=email,
                                      topic="General inquiry", message=str(i), created_at=now(),
                                      email_status="pending", email_mode="local"))
            db.commit()
        _, first = request("/auth/contact-inquiries", role="admin")
        _, second = request("/auth/contact-inquiries?before=" + str(first["next_cursor"]), role="admin")
        assert len(first["items"]) == 25 and len(second["items"]) == 3 and second["next_cursor"] is None
        assert not ({r["id"] for r in first["items"]} & {r["id"] for r in second["items"]})

        # Local delivery is inspected by unique test address; unrelated mail is not removed.
        messages = mail("/messages?limit=200")["messages"]
        for item in messages:
            detail = mail("/message/" + item["ID"])
            if email in json.dumps(detail):
                owned_mail.append(item["ID"])
                assert "hello@wisconnect.co" in json.dumps(detail)
        assert len(owned_mail) == 2, "Expected exactly one notification per saved submission"

        # SMTP config is exercised with a fake transport, never an external provider.
        with Session(engine) as db:
            row = db.get(ContactInquiry, inquiry_id)
            config = {"WISCONNECT_CONTACT_MAIL_MODE": "smtp", "WISCONNECT_CONTACT_SMTP_HOST": "smtp.example.invalid",
                      "WISCONNECT_CONTACT_SMTP_USER": "test", "WISCONNECT_CONTACT_SMTP_PASSWORD": "not-a-secret",
                      "WISCONNECT_CONTACT_FROM": "WisConnect <contact@example.test>", "WISCONNECT_CONTACT_SMTP_SECURITY": "starttls"}
            with patch.dict(os.environ, config), patch.object(contact.smtplib, "SMTP") as transport:
                client = transport.return_value.__enter__.return_value
                client.send_message.return_value = {}
                contact.send_email(row)
                client.starttls.assert_called_once()
                client.login.assert_called_once()
                sent = client.send_message.call_args.args[0]
                assert sent["To"] == "hello@wisconnect.co" and sent["Reply-To"] == email
        print("PASS: migration, validation/origin/size, admin-only inbox, concurrent idempotency, saved-on-SMTP-failure, retry, pagination, two captured local emails and TLS configuration. No external email sent.")
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
