"""Owned-schema checks for session privacy, idle expiry, revocation and login caps."""
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

from sqlalchemy import create_engine, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session

from .app.auth import COOKIE, digest, now, password_hash
from .app.database import DATABASE_URL
from .app.models import AccountEvent, LoginSession


def main():
    schema = "sessions_check_" + secrets.token_hex(6)
    base = create_engine(DATABASE_URL)
    with base.begin() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({"options": f"-csearch_path={schema}"})
    engine = create_engine(url)
    env = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False), WISCONNECT_LOCAL_AUTH="1")
    process, log = None, tempfile.TemporaryFile()
    password = secrets.token_urlsafe(24)
    tokens, ids, public_ids = {}, {}, {}

    def seed(key, owner, *, idle=False, expired=False):
        token = secrets.token_urlsafe(32)
        with Session(engine) as db:
            row = LoginSession(token_hash=digest(token), user_id=ids[owner],
                               created_at=now()-timedelta(hours=1),
                               last_seen_at=now()-timedelta(minutes=31 if idle else 1),
                               expires_at=now()+timedelta(hours=-1 if expired else 1),
                               client_name="Test browser")
            db.add(row); db.commit(); public_ids[key] = row.public_id
        tokens[key] = token

    try:
        # Verify migration preserves a legacy token, its absolute expiry and user.
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "0006_shared_rate_limits"], env=env, check=True)
        with engine.begin() as connection:
            for role in ["admin", "member"]:
                result = connection.execute(text(
                    "INSERT INTO users (email, name, password_hash, role, active) "
                    "VALUES (:email, :name, :password_hash, :role, true) RETURNING id"
                ), {"email": role+"@example.test", "name": role,
                    "password_hash": password_hash(password), "role": role})
                ids[role] = result.scalar_one()
        legacy_token = secrets.token_urlsafe(32)
        legacy_expiry = now()+timedelta(hours=1)
        with engine.begin() as connection:
            connection.execute(text("INSERT INTO login_sessions(token_hash,user_id,expires_at) VALUES(:token,:user,:expiry)"),
                               {"token": digest(legacy_token), "user": ids["admin"], "expiry": legacy_expiry})
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "head"], env=env, check=True)
        with Session(engine) as db:
            legacy = db.get(LoginSession, digest(legacy_token))
            assert legacy and legacy.expires_at == legacy_expiry and legacy.user_id == ids["admin"]
            assert legacy.public_id and legacy.client_name == "Existing session"
        for key, owner in [("main", "admin"), ("other", "admin"), ("member", "member")]:
            seed(key, owner)
        seed("idle", "admin", idle=True); seed("expired", "admin", expired=True)
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0)); port = sock.getsockname()[1]
        process = subprocess.Popen([sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", str(port), "--no-access-log", "--no-proxy-headers"], env=env, stdout=log, stderr=log)

        def request(path="/auth/me", key="main", method="GET", body=None, origin="http://localhost:3000"):
            headers = {"Origin": origin, "X-WisConnect-Request": "1", "Content-Type": "application/json",
                       "User-Agent": "Chrome/123 Macintosh"}
            if key: headers["Cookie"] = COOKIE + "=" + tokens[key]
            try:
                response = urlopen(Request(f"http://127.0.0.1:{port}"+path, headers=headers, method=method,
                                          data=json.dumps(body).encode() if body else None), timeout=15)
            except HTTPError as error:
                response = error
            with response:
                raw = response.read()
                return response.status, json.loads(raw) if raw else None, response.headers

        for _ in range(100):
            try:
                if request("/health")[0] == 200: break
            except URLError: time.sleep(.1)
        else: raise AssertionError("API failed to start")
        assert request("/auth/sessions", key=None)[0] == 401
        assert request(key="idle")[0] == 401 and request(key="expired")[0] == 401
        data = request("/auth/sessions")[1]
        assert data["idle_minutes"] == 30 and len(data["items"]) == 3
        assert sum(item["current"] for item in data["items"]) == 1
        assert all(set(item) == {"id", "client_name", "created_at", "last_seen_at", "expires_at", "current"} for item in data["items"])
        assert all(token not in json.dumps(data) and digest(token) not in json.dumps(data) for token in tokens.values())
        assert len(request("/auth/sessions", key="member")[1]["items"]) == 1
        assert request("/auth/sessions/"+public_ids["member"], method="DELETE")[0] == 404
        assert request("/auth/sessions/"+public_ids["main"], method="DELETE")[0] == 409
        assert request("/auth/sessions/"+public_ids["other"], method="DELETE", origin="https://bad.example")[0] == 403
        with Session(engine) as db:
            current = db.get(LoginSession, digest(tokens["main"]))
            assert current.last_seen_at > now()-timedelta(seconds=15)
            absolute = current.expires_at
        assert request("/auth/sessions/"+public_ids["other"], method="DELETE")[0] == 204
        assert request(key="other")[0] == 401
        assert request()[0] == 200 and request(key="member")[0] == 200
        seed("race", "admin")
        with ThreadPoolExecutor(max_workers=2) as pool:
            calls = [pool.submit(request, "/auth/me", "race"), pool.submit(request, "/auth/sessions/"+public_ids["race"], "main", "DELETE")]
            results = [call.result() for call in calls]
        assert results[1][0] == 204 and request(key="race")[0] == 401
        assert request("/auth/sessions/revoke-others", method="POST")[0] == 200
        assert len(request("/auth/sessions")[1]["items"]) == 1
        assert request(key="member")[0] == 200
        with Session(engine) as db:
            assert db.get(LoginSession, digest(tokens["main"])).expires_at == absolute
            assert db.get(LoginSession, digest(tokens["race"])) is None
        # Login prunes the oldest sessions and records only a coarse device label.
        for index in range(11): seed("cap"+str(index), "member")
        response = request("/auth/login", key=None, method="POST", body={"email": "member@example.test", "password": password})
        assert response[0] == 200
        tokens["new"] = response[2]["Set-Cookie"].split(";")[0].split("=", 1)[1]
        listed = request("/auth/sessions", key="new")[1]["items"]
        assert len(listed) == 10 and any(item["current"] and item["client_name"] == "Chrome on macOS" for item in listed)
        assert request("/auth/logout", key="new", method="POST")[0] == 204
        assert request(key="new")[0] == 401
        with Session(engine) as db:
            actions = set(db.scalars(select(AccountEvent.action)))
            assert {"signed_in", "signed_out", "session_revoked", "other_sessions_revoked"} <= actions
        print("PASS: legacy migration, private session IDs/ownership, admin and member self-service, idle/absolute expiry, activity refresh, single/bulk/concurrent revocation, origin checks, session cap, coarse labels and audit events.")
    except BaseException:
        log.seek(0); print(log.read().decode()[-3000:]); raise
    finally:
        if process: process.terminate(); process.wait(timeout=10)
        log.close(); engine.dispose()
        with base.begin() as connection:
            connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()


if __name__ == "__main__": main()
