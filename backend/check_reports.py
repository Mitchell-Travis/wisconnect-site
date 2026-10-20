"""Operational report/privacy/CSV checks in an owned schema. No mail or real writes."""
import csv
import io
import json
import os
import secrets
import socket
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone
from unittest.mock import patch
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import create_engine, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from .app.auth import DUMMY_HASH, digest, now
from .app.database import DATABASE_URL
from .app.models import Business, BusinessEvent, ContactInquiry, Introduction, LoginSession, User
from .app.reports import csv_cell, report


def main():
    schema = "reports_check_" + secrets.token_hex(6)
    base = create_engine(DATABASE_URL)
    with base.begin() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({"options": f"-csearch_path={schema}"})
    engine = create_engine(url)
    env = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False), WISCONNECT_LOCAL_AUTH="1")
    process = None
    log = tempfile.TemporaryFile()
    cookies, ids = {}, {}
    today = now().date()
    first, last = today - timedelta(days=10), today - timedelta(days=4)
    lower = datetime.combine(first, datetime.min.time(), timezone.utc)
    upper = datetime.combine(last + timedelta(days=1), datetime.min.time(), timezone.utc)
    dangerous = '=HYPERLINK("https://example.invalid","name"),\n@SUM(1,1)'
    try:
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "head"], env=env, check=True)
        with Session(engine) as db:
            for role in ("admin", "other", "member", "inactive"):
                user = User(name=dangerous if role == "other" else role, email=role+"@example.test", password_hash=DUMMY_HASH,
                            role="member" if role == "member" else "admin", active=role != "inactive")
                db.add(user); db.flush(); ids[role] = user.id
                token = secrets.token_urlsafe(32); cookies[role] = "wisconnect_local_session=" + token
                db.add(LoginSession(token_hash=digest(token), user_id=user.id, expires_at=now()+timedelta(hours=1)))
            moments = (lower-timedelta(microseconds=1), lower, upper-timedelta(microseconds=1), upper)
            for n, moment in enumerate(moments):
                db.add(Introduction(submission_id=str(uuid4()), name="PRIVATE applicant", email="private@example.test", location="Private location",
                    expertise="PRIVATE expertise", contribution="PRIVATE contribution", status=("new", "reviewing", "waiting", "new")[n], created_at=moment, updated_at=now()))
                db.add(ContactInquiry(submission_id=str(uuid4()), name="PRIVATE visitor", email="private@example.test", topic="PRIVATE topic",
                    message="PRIVATE message", status=("open", "in_progress", "closed", "open")[n], created_at=moment,
                    assignee_id=(ids["other"], ids["inactive"], ids["admin"], None)[n], follow_up_on=today-timedelta(days=1) if n == 0 else today))
            business = db.scalar(select(Business).order_by(Business.id))
            business.status = "draft"
            for n, moment in enumerate(moments):
                db.add(BusinessEvent(business_id=business.id, actor_name="PRIVATE actor", action=("publish", "saved", "publish", "archive")[n], created_at=moment))
            db.commit()
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0)); port = sock.getsockname()[1]
        process = subprocess.Popen([sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", str(port), "--no-access-log", "--no-proxy-headers"], env=env, stdout=log, stderr=log)

        def request(path, role=None):
            headers = {"Origin": "http://localhost:3000"}
            if role: headers["Cookie"] = cookies[role]
            try: response = urlopen(Request(f"http://127.0.0.1:{port}" + path, headers=headers), timeout=15)
            except HTTPError as error: response = error
            with response:
                raw = response.read().decode("utf-8-sig")
                return response.status, json.loads(raw) if response.headers.get("Content-Type", "").startswith("application/json") else raw, response.headers

        for _ in range(100):
            try:
                if request("/health")[0] == 200: break
            except URLError: time.sleep(.1)
        else: raise AssertionError("API did not start")
        params = f"?start={first}&end={last}"
        for path in ("/auth/reports", "/auth/reports/export"):
            for role, expected in ((None, 401), ("member", 403), ("inactive", 401)):
                status, _, headers = request(path + params, role)
                assert status == expected and headers["Cache-Control"] == "no-store"
            for invalid in ("?start=2026-02-30&end=2026-03-01", "?start=2026-1-01&end=2026-01-02", "?start=2026-01-01", "?end=2026-01-01", f"?start={last}&end={first}", "?start=2020-01-01&end=2022-01-01", "?start=9999-01-01&end=9999-01-02"):
                assert request(path + invalid, "admin")[0] == 422, invalid
        status, data, headers = request("/auth/reports" + params, "admin")
        assert status == 200, data
        assert headers["Cache-Control"] == "no-store" and headers["X-Content-Type-Options"] == "nosniff"
        assert data["applications"] == {"total": 2, "new": 0, "reviewing": 1, "waiting": 1}
        assert data["inquiries"] == {"total": 2, "open": 0, "in_progress": 1, "closed": 1}
        assert data["directory"] == {"published": 11, "draft": 1, "archived": 0}
        assert data["directory_activity"] == {"imported": 0, "created": 0, "saved": 1, "publish": 1, "archive": 0, "restore": 0}
        assert data["accounts"] == {"admin_active": 2, "admin_inactive": 1, "member_active": 1, "member_inactive": 0, "staff_active": 0, "staff_inactive": 0}
        assert {key: data["workload"][key] for key in ("active", "due", "overdue", "unassigned", "groups")} == {"active": 3, "due": 3, "overdue": 1, "unassigned": 1, "groups": 3}
        assert any(row["id"] == ids["inactive"] and not row["active_account"] for row in data["workload"]["rows"])
        serialized = json.dumps(data)
        assert all(value not in serialized for value in ("PRIVATE", "@example.test", "password_hash", "token_hash", "submission_id", "internal_notes"))
        status, exported, headers = request("/auth/reports/export" + params, "admin")
        assert status == 200 and headers["Content-Type"].startswith("text/csv")
        assert headers["Content-Disposition"] == f'attachment; filename="wisconnect-report-{first}-to-{last}.csv"'
        assert headers["Cache-Control"] == "no-store" and "PRIVATE" not in exported and "@example.test" not in exported
        rows = list(csv.reader(io.StringIO(exported)))
        assert all(len(row) == 7 for row in rows)
        assert any(row[1].startswith('Text: =HYPERLINK') for row in rows)
        assert any(row[:3] == ["Applications received — current status", "Received", "2"] for row in rows)
        for value in ('=1+1', '+cmd', '-cmd', '@SUM(1,1)', '  =cmd', '\t=cmd', '\r=cmd', '\n=cmd', '＝cmd', '＋cmd', '－cmd', '＠cmd', '\ufeff=cmd'):
            assert csv_cell(value).startswith("Text: "), value
        assert csv_cell('Anna, "B"') == 'Anna, "B"' and csv_cell(12) == 12
        default = request("/auth/reports", "admin")[1]
        assert default["period"] == {"start": (today-timedelta(days=29)).isoformat(), "end": today.isoformat()}
        assert default["directory_activity"]["imported"] == 12
        empty = request("/auth/reports?start=2000-01-01&end=2000-01-01", "admin")[1]
        assert empty["applications"]["total"] == 0 and empty["inquiries"]["total"] == 0
        assert empty["accounts"] == data["accounts"] and empty["workload"] == data["workload"]
        assert request(f"/auth/reports?start={today-timedelta(days=365)}&end={today}", "admin")[0] == 200
        assert request(f"/auth/reports?start={today-timedelta(days=366)}&end={today}", "admin")[0] == 422
        # A large staff list cannot create an unbounded export or pretend partial detail is complete.
        with Session(engine) as db:
            for n in range(52):
                user = User(name=f"Staff {n}", email=f"staff{n}@example.test", password_hash=DUMMY_HASH, role="admin")
                db.add(user); db.flush()
                db.add(ContactInquiry(submission_id=str(uuid4()), name="PRIVATE", email="private@example.test", topic="PRIVATE", message="PRIVATE", created_at=now(), assignee_id=user.id))
            db.commit()
        large = request("/auth/reports" + params, "admin")[1]
        assert large["workload"]["groups"] == 55 and len(large["workload"]["rows"]) == 50 and large["workload"]["active"] == 55
        with Session(engine) as db, patch.object(db, "execute", side_effect=OperationalError("PRIVATE SQL", {}, Exception("PRIVATE password"))):
            try: report(db, str(first), str(last))
            except HTTPException as error: assert error.status_code == 503 and "PRIVATE" not in error.detail
            else: raise AssertionError("Expected report failure")
        print("PASS: administrator/active-session permissions, UTC inclusive ranges and limits, complete counts, current-vs-period semantics, bounded workload, private-field exclusion, quoted formula-safe CSV, fail-closed errors and unchanged records. No external mail.")
    except Exception:
        log.seek(0); print(log.read().decode(errors="replace")[-4000:]); raise
    finally:
        if process: process.terminate(); process.wait(timeout=10)
        log.close(); engine.dispose()
        with base.begin() as connection: connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()


if __name__ == "__main__": main()
