"""Shared limiter checks in an owned disposable schema; no mail or user mutations."""
import json
import os
import secrets
import socket
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import OperationalError

from .app.database import DATABASE_URL
from .app.rate_limits import bucket_key, throttle


def attempt(key, limit, window=900):
    try:
        throttle(key, limit, window)
        return 200
    except HTTPException as error:
        assert error.status_code in {429, 503}
        assert int(error.headers["Retry-After"]) > 0
        return error.status_code


def main():
    schema = "ratelimit_check_" + secrets.token_hex(6)
    base = create_engine(DATABASE_URL)
    with base.begin() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({"options": f"-csearch_path={schema}"})
    engine = create_engine(url)
    env = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False), WISCONNECT_LOCAL_AUTH="1")
    processes, ports = [], []
    log = tempfile.TemporaryFile()

    def worker():
        result = subprocess.run([sys.executable, "-m", "backend.check_rate_limits", "--worker"],
                                env=env, capture_output=True, text=True, check=True, timeout=30)
        return json.loads(result.stdout)

    def request(port, path="/auth/me", body=None):
        req = Request(f"http://127.0.0.1:{port}" + path, data=body,
                      headers={"Origin": "http://localhost:3000", "X-WisConnect-Request": "1",
                               "Content-Type": "application/json"})
        try:
            response = urlopen(req, timeout=10)
        except HTTPError as error:
            response = error
        with response:
            return response.status, response.read(), response.headers

    try:
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "head"], env=env, check=True)
        # Independent interpreters/connections compete for exactly one allowance.
        with ThreadPoolExecutor(max_workers=3) as pool:
            results = sum(list(pool.map(lambda _: worker(), range(3))), [])
        assert results.count(200) == 7 and results.count(429) == 29, results
        assert worker() == [429] * 12, "A fresh process must retain previous limits"

        with patch("backend.app.rate_limits.rate_limit_engine", engine):
            with engine.begin() as connection:
                connection.execute(text("UPDATE rate_limit_buckets SET expires_at=statement_timestamp()-interval '1 second'"))
            assert attempt("concurrent", 7) == 200
            with engine.connect() as connection:
                row = connection.execute(text("SELECT count, key_hash FROM rate_limit_buckets")).one()
                assert row.count == 1 and row.key_hash == bucket_key("concurrent")
            assert attempt("independent", 1) == 200 and attempt("independent", 1) == 429
            # Server time and returned remaining TTL, not a fixed 900 seconds.
            with engine.begin() as connection:
                connection.execute(text("UPDATE rate_limit_buckets SET expires_at=statement_timestamp()+interval '10 seconds' WHERE key_hash=:key"), {"key": bucket_key("independent")})
            try:
                throttle("independent", 1)
            except HTTPException as error:
                assert error.status_code == 429 and 1 <= int(error.headers["Retry-After"]) <= 10
            else:
                raise AssertionError("Limit should still be active")
            # Denial does not extend the window or grow the counter without bound.
            with engine.connect() as connection:
                assert connection.execute(text("SELECT count FROM rate_limit_buckets WHERE key_hash=:key"), {"key": bucket_key("independent")}).scalar_one() == 2
            with engine.begin() as connection:
                connection.execute(text("INSERT INTO rate_limit_buckets SELECT md5('expired-' || n::text), 1, statement_timestamp()-interval '1 minute' FROM generate_series(1,100) n"))
            assert attempt("cleanup", 10) == 200
            with engine.connect() as connection:
                assert connection.execute(text("SELECT count(*) FROM rate_limit_buckets WHERE expires_at<statement_timestamp()")).scalar_one() == 68
            for _ in range(3):
                assert attempt("cleanup", 10) == 200
            with engine.connect() as connection:
                assert connection.execute(text("SELECT count(*) FROM rate_limit_buckets WHERE expires_at<statement_timestamp()")).scalar_one() == 0
            # Real row contention must fail closed within the configured lock timeout.
            with engine.begin() as connection:
                connection.execute(text("SELECT key_hash FROM rate_limit_buckets WHERE key_hash=:key FOR UPDATE"), {"key": bucket_key("cleanup")})
                started = time.monotonic()
                assert attempt("cleanup", 10) == 503
                assert time.monotonic() - started < 4
            with patch.object(engine, "begin", side_effect=OperationalError("hidden SQL", {}, Exception("hidden secret"))):
                try:
                    throttle("failure", 1)
                except HTTPException as error:
                    assert error.status_code == 503 and "hidden" not in str(error.detail)
                else:
                    raise AssertionError("Backend failure must not grant access")

        # Actual API middleware across two separate workers, without real accounts.
        for _ in range(2):
            with socket.socket() as sock:
                sock.bind(("127.0.0.1", 0))
                port = sock.getsockname()[1]
            ports.append(port)
            processes.append(subprocess.Popen([sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", str(port), "--no-access-log", "--no-proxy-headers"], env=env, stdout=log, stderr=log))
            for _ in range(100):
                try:
                    if request(port, "/health")[0] == 200:
                        break
                except URLError:
                    time.sleep(.1)
            else:
                raise AssertionError("Isolated API did not start")
        assert [request(port)[0] for port in ports] == [401, 401]
        with engine.begin() as connection:
            key = bucket_key("read-ip:127.0.0.1", 60)
            assert connection.execute(text("SELECT count FROM rate_limit_buckets WHERE key_hash=:key"), {"key": key}).scalar_one() == 2
            connection.execute(text("UPDATE rate_limit_buckets SET count=600 WHERE key_hash=:key"), {"key": key})
        for port in ports:
            status, _, headers = request(port)
            assert status == 429 and 1 <= int(headers["Retry-After"]) <= 60
            assert headers["Cache-Control"] == "no-store"
            assert request(port, "/auth/login", b"{}")[0] == 422, "Read quota must not consume write quota"
        with engine.begin() as connection:
            connection.execute(text("UPDATE rate_limit_buckets SET count=600 WHERE key_hash=:key"), {"key": bucket_key("write-ip:127.0.0.1")})
        assert all(request(port, "/auth/login", b"{}")[0] == 429 for port in ports)
        # Missing/unavailable limiter tables cannot silently disable protection.
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE rate_limit_buckets RENAME TO unavailable_buckets"))
        try:
            for port in ports:
                status, body, headers = request(port)
                assert status == 503 and headers["Retry-After"] == "5" and b"rate_limit_buckets" not in body
        finally:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE unavailable_buckets RENAME TO rate_limit_buckets"))
        print("PASS: shared concurrent quotas across processes, restart persistence, expiry, independent keys, remaining Retry-After, bounded counters/cleanup, lock timeout, fail-closed behavior, and HTTP read/write enforcement across two API workers.")
    except BaseException:
        log.seek(0)
        print(log.read().decode()[-2500:])
        raise
    finally:
        for process in processes:
            process.terminate()
            process.wait(timeout=10)
        log.close()
        engine.dispose()
        with base.begin() as connection:
            connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()


if __name__ == "__main__":
    if "--worker" in sys.argv:
        with ThreadPoolExecutor(max_workers=4) as pool:
            print(json.dumps(list(pool.map(lambda _: attempt("concurrent", 7), range(12)))))
    else:
        main()
