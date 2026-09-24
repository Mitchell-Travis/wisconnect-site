"""Integration check against a disposable PostgreSQL schema and local Mailpit.

Run npm run auth:up, then npm run auth:check. No real email is sent.
"""

import json
import os
import re
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

from sqlalchemy import create_engine, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session

from .app.auth import EmailInput, digest, invite, now, password_hash
from .app.database import DATABASE_URL
from .app.models import Invitation, LoginSession, User


def main():
    suffix = secrets.token_hex(6)
    schema = "auth_check_" + suffix
    # Owned, uniquely named schema; never delete or modify the application's tables.
    base = create_engine(DATABASE_URL)
    with base.begin() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({"options": f"-csearch_path={schema}"})
    db_engine = create_engine(url)
    environment = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False), WISCONNECT_LOCAL_AUTH="1")
    server = None
    log = tempfile.TemporaryFile()
    password = secrets.token_urlsafe(24)
    admin_email = f"admin-{suffix}@example.test"
    member_email = f"member-{suffix}@example.test"

    def mail(path, method="GET"):
        with urlopen(Request("http://localhost:8025/api/v1" + path, method=method), timeout=5) as response:
            return json.load(response) if method == "GET" else None

    try:
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "head"], env=environment, check=True)
        with Session(db_engine) as db:
            db.add(User(email=admin_email, name="Test administrator", password_hash=password_hash(password), role="admin"))
            db.commit()
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        server = subprocess.Popen([sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", str(port), "--no-access-log", "--no-proxy-headers"], env=environment, stdout=log, stderr=log)
        origin = f"http://localhost:{port}"

        def request(path, body=None, cookie="", method=None, headers=None):
            extra = {"Origin": "http://localhost:3000", "X-WisConnect-Request": "1", "Content-Type": "application/json"}
            if cookie:
                extra["Cookie"] = cookie
            if headers:
                extra.update(headers)
            req = Request(origin + path, data=json.dumps(body).encode() if body is not None else None,
                          method=method or ("POST" if body is not None else "GET"), headers=extra)
            try:
                response = urlopen(req, timeout=10)
            except HTTPError as error:
                response = error
            with response:
                data = response.read()
                return response.status, json.loads(data) if data else None, response.headers

        for _ in range(100):
            try:
                if request("/health")[0] == 200:
                    break
            except URLError:
                time.sleep(.1)
        else:
            raise AssertionError("Test API failed to start")
        assert request("/auth/me")[0] == 401
        assert request("/auth/me", {"name": "Unauthorized"}, method="PATCH")[0] == 401
        assert request("/auth/invitations")[0] == 401
        assert request("/auth/members")[0] == 401
        assert request("/auth/invitations", {"email": member_email})[0] == 401
        status, data, headers = request("/auth/login", {"email": admin_email, "password": password})
        assert status == 200 and data["role"] == "admin"
        cookie_header = headers["Set-Cookie"]
        assert "HttpOnly" in cookie_header and "SameSite=strict" in cookie_header and "Path=/auth" in cookie_header
        admin_cookie = cookie_header.split(";")[0]
        assert headers["Cache-Control"] == "no-store"
        assert request("/auth/invitations", {"email": member_email}, admin_cookie, headers={"Origin": "https://evil.example"})[0] == 403
        assert request("/auth/invitations", {"email": member_email}, admin_cookie, headers={"X-WisConnect-Request": ""})[0] == 403
        assert request("/auth/login", {"email": admin_email, "password": "incorrect"})[0] == 401
        invalid = request("/auth/accept", {"token": "secret-invalid", "name": "A", "password": "short"})
        assert invalid[0] == 422 and "short" not in json.dumps(invalid[1]) and "secret-invalid" not in json.dumps(invalid[1])

        def invitation_token(email):
            previous_ids = {item["ID"] for item in mail("/messages")["messages"]}
            assert request("/auth/invitations", {"email": email}, admin_cookie)[0] == 201
            messages = mail("/messages")["messages"]
            message = next(item for item in messages if item["ID"] not in previous_ids and any(to["Address"] == email for to in item["To"]))
            body = mail("/message/" + message["ID"])["Text"]
            return re.search(r"#token=([A-Za-z0-9_-]{43})", body).group(1)

        token = invitation_token(member_email)
        assert request("/auth/invitations", {"email": member_email}, admin_cookie)[0] == 409
        assert request("/auth/invitation", {"token": token})[1]["email"] == member_email
        assert request("/auth/accept", {"token": token, "name": "Test member", "password": password, "role": "admin"})[0] == 422
        assert request("/auth/accept", {"token": token, "name": "   ", "password": password})[0] == 422
        rejected_password = "12345678901234567890"
        rejected = request("/auth/accept", {"token": token, "name": "Test member", "password": rejected_password})
        assert rejected[0] == 422 and "too common" in rejected[1]["detail"]
        assert rejected_password not in json.dumps(rejected[1])
        with Session(db_engine) as db:
            invitation = db.scalar(select(Invitation).where(Invitation.email == member_email))
            assert invitation.token_hash == digest(token) and invitation.token_hash != token
        body = {"token": token, "name": "Test member", "password": password}
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(lambda _: request("/auth/accept", body)[0], range(2)))
        assert sorted(results) == [201, 400], "Only one simultaneous redemption may succeed"
        assert request("/auth/invitation", {"token": token})[0] == 400
        status, data, headers = request("/auth/login", {"email": member_email.upper(), "password": password})
        assert status == 200 and data["role"] == "member"
        member_cookie = headers["Set-Cookie"].split(";")[0]
        assert request("/auth/me", cookie=member_cookie)[1]["email"] == member_email
        assert request("/auth/me", {"name": "Changed"}, member_cookie, method="PATCH", headers={"Origin": "https://evil.example"})[0] == 403
        for invalid_profile in [{"name": "   "}, {"name": "x" * 101}, {"name": "Changed", "role": "admin"}, {"name": "Changed", "email": admin_email}]:
            assert request("/auth/me", invalid_profile, member_cookie, method="PATCH")[0] == 422
        status, updated, _ = request("/auth/me", {"name": "  Updated member  "}, member_cookie, method="PATCH")
        assert status == 200 and updated == {"name": "Updated member", "email": member_email, "role": "member"}
        assert request("/auth/me", cookie=member_cookie)[1] == updated
        assert request("/auth/members", cookie=member_cookie)[0] == 403
        status, directory, _ = request("/auth/members", cookie=admin_cookie)
        assert status == 200 and len(directory) == 2
        assert all(set(row) == {"id", "name", "email", "role", "active"} for row in directory)
        assert next(row for row in directory if row["email"] == member_email)["name"] == "Updated member"
        assert request("/auth/me", cookie=admin_cookie)[1]["name"] == "Test administrator"
        with Session(db_engine) as db:
            assert db.scalar(select(User).where(User.email == member_email)).name == "Updated member"
        assert request("/auth/invitations", cookie=member_cookie)[0] == 403
        assert request("/auth/invitations", {"email": "other@example.test"}, member_cookie)[0] == 403
        assert request("/auth/invitations/1", cookie=member_cookie, method="DELETE")[0] == 403
        assert request("/auth/invitations", {"email": member_email}, admin_cookie)[0] == 409
        assert request("/auth/logout", cookie=member_cookie, method="POST")[0] == 204
        assert request("/auth/me", cookie=member_cookie)[0] == 401
        assert request("/auth/me", {"name": "After logout"}, member_cookie, method="PATCH")[0] == 401

        member_id = next(row["id"] for row in directory if row["email"] == member_email)
        admin_id = next(row["id"] for row in directory if row["email"] == admin_email)
        member_path = f"/auth/members/{member_id}"
        status, _, headers = request("/auth/login", {"email": member_email, "password": password})
        assert status == 200
        active_member_cookie = headers["Set-Cookie"].split(";")[0]
        assert request(member_path, method="DELETE")[0] == 401
        assert request(member_path, cookie=active_member_cookie, method="DELETE")[0] == 403
        assert request(member_path, cookie=admin_cookie, method="DELETE", headers={"Origin": "https://evil.example"})[0] == 403
        assert request(member_path, cookie=admin_cookie, method="DELETE", headers={"X-WisConnect-Request": ""})[0] == 403
        assert request(f"/auth/members/{admin_id}", cookie=admin_cookie, method="DELETE")[0] == 403
        with Session(db_engine) as db:
            other_admin = User(email=f"other-admin-{suffix}@example.test", name="Other administrator", password_hash="unused", role="admin")
            db.add(other_admin)
            db.commit()
            other_admin_id = other_admin.id
            # A second device session must also be revoked by deletion.
            db.add(LoginSession(token_hash=digest("second-device"), user_id=member_id, expires_at=now() + timedelta(hours=1)))
            db.commit()
        assert request(f"/auth/members/{other_admin_id}", cookie=admin_cookie, method="DELETE")[0] == 403
        with ThreadPoolExecutor(max_workers=2) as pool:
            deleted = list(pool.map(lambda _: request(member_path, cookie=admin_cookie, method="DELETE")[0], range(2)))
        assert sorted(deleted) == [204, 404]
        assert request("/auth/me", cookie=active_member_cookie)[0] == 401
        assert request("/auth/login", {"email": member_email, "password": password})[0] == 401
        assert all(row["id"] != member_id for row in request("/auth/members", cookie=admin_cookie)[1])
        with Session(db_engine) as db:
            assert db.get(User, member_id) is None
            assert db.scalar(select(LoginSession).where(LoginSession.user_id == member_id)) is None
            assert db.scalar(select(Invitation).where(Invitation.email == member_email)).used_at is not None
        assert request("/auth/accept", body)[0] == 400, "Old invitation cannot recreate a deleted account"
        replacement_token = invitation_token(member_email)
        assert replacement_token != token
        assert request("/auth/invitation", {"token": replacement_token})[0] == 200

        for state in ["revoked", "expired"]:
            email = f"{state}-{suffix}@example.test"
            bad_token = invitation_token(email)
            with Session(db_engine) as db:
                invitation = db.scalar(select(Invitation).where(Invitation.email == email))
                invitation_id = invitation.id
                if state == "expired":
                    invitation.expires_at = now() - timedelta(seconds=1)
                    db.commit()
            if state == "revoked":
                assert request(f"/auth/invitations/{invitation_id}", cookie=admin_cookie, method="DELETE")[0] == 204
            assert request("/auth/accept", {**body, "token": bad_token})[0] == 400
            replacement = invitation_token(email)
            assert replacement != bad_token
            assert request("/auth/invitation", {"token": bad_token})[0] == 400

        with Session(db_engine) as db:
            admin_user = db.scalar(select(User).where(User.email == admin_email))
            assert admin_user.password_hash != password
            failed_email = f"failed-{suffix}@example.test"
            with patch("backend.app.auth.smtplib.SMTP", side_effect=OSError):
                try:
                    invite(EmailInput(email=failed_email), admin_user, db)
                    raise AssertionError("SMTP failure should be reported")
                except Exception as error:
                    assert getattr(error, "status_code", None) == 503
            assert db.scalar(select(Invitation).where(Invitation.email == failed_email)) is None
            admin_user.active = False
            db.commit()
        assert request("/auth/me", cookie=admin_cookie)[0] == 401
        with Session(db_engine) as db:
            admin_user = db.scalar(select(User).where(User.email == admin_email))
            admin_user.active = True
            session = db.get(LoginSession, digest(admin_cookie.split("=", 1)[1]))
            session.expires_at = now() - timedelta(seconds=1)
            db.commit()
        assert request("/auth/me", cookie=admin_cookie)[0] == 401
        for _ in range(10):
            assert request("/auth/login", {"email": "unknown@example.test", "password": password})[0] == 401
        assert request("/auth/login", {"email": "unknown@example.test", "password": password})[0] == 429
        if "--browser" in sys.argv:
            subprocess.run(["node", "scripts/check-auth.mjs"], input=json.dumps({
                "api": origin, "email": admin_email, "password": password,
                "member": f"browser-{suffix}@example.test",
            }), text=True, check=True)
        server.terminate()
        server.wait(timeout=10)
        disabled_environment = {key: value for key, value in environment.items() if key != "WISCONNECT_LOCAL_AUTH"}
        server = subprocess.Popen(server.args, env=disabled_environment, stdout=log, stderr=log)
        for _ in range(100):
            try:
                if request("/auth/me")[0] == 404:
                    break
            except URLError:
                time.sleep(.1)
        else:
            raise AssertionError("Auth must be disabled without explicit local opt-in")
        print("PASS: migrations, invitations, SMTP rollback, single-use concurrency, revocation, expiry, roles, member deletion/session revocation, validation, CSRF, sessions, logout, throttling, and local opt-in gate.")
    finally:
        if server:
            server.terminate()
            server.wait(timeout=10)
        log.close()
        db_engine.dispose()
        with base.begin() as connection:
            connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()
        # Delete only this run's synthetic messages, including the optional browser test.
        messages = mail("/messages")["messages"]
        owned_ids = [item["ID"] for item in messages if any(
            to["Address"].endswith(f"-{suffix}@example.test") for to in item["To"])]
        if owned_ids:
            with urlopen(Request("http://localhost:8025/api/v1/messages", method="DELETE",
                                 data=json.dumps({"IDs": owned_ids}).encode(),
                                 headers={"Content-Type": "application/json"}), timeout=5):
                pass


if __name__ == "__main__":
    main()
