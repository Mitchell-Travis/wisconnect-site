"""Private LAN/session checks in a disposable database schema, with no real emails."""
import argparse
import json
import os
import secrets
import socket
import subprocess
import sys
import tempfile
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4
from unittest.mock import patch

from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session

from .app.auth import password_hash
from .app.database import DATABASE_URL
from .app.models import User
from .app.preview_config import allowed_client, validate_lan


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', required=True)
    parser.add_argument('--network', required=True)
    args = parser.parse_args()
    with socket.socket() as sock:
        sock.bind((args.host, 0))
        port = sock.getsockname()[1]
    origin = f'http://{args.host}:{port}'
    _, network = validate_lan(origin, args.network)
    for bad_origin, bad_network in [('http://8.8.8.8:3001', '8.8.8.0/24'),
                                    (origin, '0.0.0.0/0'), (origin + '/path', args.network),
                                    ('http://localhost:3001', args.network)]:
        try:
            validate_lan(bad_origin, bad_network)
        except ValueError:
            pass
        else:
            raise AssertionError('Unsafe mobile configuration accepted')
    with patch('backend.app.preview_config.LAN_NETWORK', network):
        assert allowed_client(args.host)
        assert not allowed_client('8.8.8.8') and not allowed_client('127.0.0.1')
    assert allowed_client('127.0.0.1') and not allowed_client(args.host)

    schema = 'mobile_check_' + secrets.token_hex(6)
    base = create_engine(DATABASE_URL)
    with base.begin() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({'options': f'-csearch_path={schema}'})
    engine = create_engine(url)
    env = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False),
               WISCONNECT_LOCAL_AUTH='1', WISCONNECT_LAN_ORIGIN=origin, WISCONNECT_LAN_CIDR=args.network)
    process = None
    log = tempfile.TemporaryFile()
    password = secrets.token_urlsafe(24)
    cookies = {}

    def request(path, body=None, role=None, method=None, headers=None):
        extra = {'Origin': origin, 'X-WisConnect-Request': '1', 'Content-Type': 'application/json'}
        if role:
            extra['Cookie'] = cookies[role]
        extra.update(headers or {})
        try:
            response = urlopen(Request(origin + path, data=json.dumps(body).encode() if body is not None else None,
                                      method=method or ('POST' if body is not None else 'GET'), headers=extra), timeout=10)
        except HTTPError as error:
            response = error
        with response:
            raw = response.read()
            data = json.loads(raw) if raw and 'application/json' in response.headers.get('content-type', '') else raw
            return response.status, data, response.headers

    try:
        subprocess.run([sys.executable, '-m', 'alembic', '-c', 'backend/alembic.ini', 'upgrade', 'head'], env=env, check=True)
        with Session(engine) as db:
            for role in ['admin', 'member']:
                db.add(User(email=role+'@example.test', name='Mobile '+role, password_hash=password_hash(password), role=role))
            db.commit()
        process = subprocess.Popen([sys.executable, '-m', 'uvicorn', 'backend.app.main:app', '--host', args.host,
                                    '--port', str(port), '--no-proxy-headers', '--no-access-log'], env=env, stdout=log, stderr=log)
        for _ in range(80):
            try:
                if request('/health')[0] == 200:
                    break
            except (OSError, URLError):
                time.sleep(.1)
        else:
            raise AssertionError('Mobile API did not start')
        for path in ['/', '/login/', '/dashboard/', '/join/']:
            status, body, _ = request(path)
            assert status == 200 and b'<html' in body
        assert request('/auth/me')[0] == 401
        credentials = {'email': 'admin@example.test', 'password': password}
        for headers in [{'Origin': 'https://untrusted.example'}, {'Origin': 'null'},
                        {'X-WisConnect-Request': ''}, {'Origin': 'http://localhost:3000'},
                        {'Host': 'untrusted.example'}, {'Host': args.host},
                        {'Origin': 'https://untrusted.example', 'X-Forwarded-For': args.host}]:
            assert request('/auth/login', credentials, headers=headers)[0] == 403
        for role in ['admin', 'member']:
            status, data, headers = request('/auth/login', {'email': role+'@example.test', 'password': password})
            assert status == 200 and data['role'] == role
            cookie = headers['Set-Cookie']
            assert 'HttpOnly' in cookie and 'SameSite=strict' in cookie and 'Path=/auth' in cookie
            assert headers['Cache-Control'] == 'no-store'
            cookies[role] = cookie.split(';')[0]
            assert request('/auth/me', role=role)[0] == 200
        assert request('/auth/member-directory', role='member')[0] == 403
        assert request('/auth/applications', role='member')[0] == 403
        for path in ['/auth/member-directory', '/auth/applications', '/auth/invitations', '/auth/overview']:
            assert request(path, role='admin')[0] == 200
        payload = {'submission_id': str(uuid4()), 'name': 'Mobile Test', 'email': 'mobile@example.test',
                   'location': 'Synthetic', 'expertise': 'Testing', 'contribution': 'Testing mobile review'}
        status, receipt, _ = request('/introductions', payload)
        assert status == 201
        endpoint = '/auth/applications/' + str(receipt['reference'])
        change = {'request_id': str(uuid4()), 'version': 0, 'status': 'reviewing', 'reviewer_id': None, 'note': 'Mobile review note'}
        assert request(endpoint, change, role='admin', method='PATCH')[0] == 200
        assert request(endpoint, role='admin')[1]['activity']['items'][0]['note'] == 'Mobile review note'
        assert request('/auth/logout', role='admin', method='POST')[0] == 204
        assert request('/auth/me', role='admin')[0] == 401
        assert request('/.env')[0] == 404
        assert request('/%2e%2e/backend/app/auth.py')[0] == 404
        print('PASS: LAN opt-in/subnet validation, static pages, strict host/origin checks, password login, session cookies, admin/member permissions, introduction/review persistence and logout; disposable schema only.')
    except BaseException:
        log.seek(0)
        print(log.read().decode()[-3000:])
        raise
    finally:
        if process:
            process.terminate()
            process.wait(timeout=10)
        engine.dispose()
        with base.begin() as connection:
            connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()
        log.close()


if __name__ == '__main__':
    main()
