"""Local infrastructure startup, diagnostics and private PostgreSQL backups."""
import argparse
import os
from pathlib import Path
import shutil
import shlex
import socket
import subprocess
import sys
from datetime import datetime, timezone
from urllib.request import urlopen
from sqlalchemy import text
from sqlalchemy.engine import make_url
from .app.database import DATABASE_URL, engine

ROOT = Path(__file__).resolve().parents[1]
LOCAL = ROOT / '.local'
PG_BIN = LOCAL / 'runtime/Postgres.app/Contents/Versions/17/bin'


def listening(port):
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=1): return True
    except OSError: return False


def run(args, **kwargs):
    subprocess.run([str(arg) for arg in args], cwd=ROOT, check=True, **kwargs)


def backup():
    folder = LOCAL / 'backups'; folder.mkdir(parents=True, exist_ok=True, mode=0o700)
    path = folder / (datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '.dump')
    url = make_url(DATABASE_URL)
    binary = str(PG_BIN / 'pg_dump') if (PG_BIN / 'pg_dump').exists() else shutil.which('pg_dump')
    # The database password is only placed in the child environment, never command arguments.
    environment = dict(os.environ, PGPASSWORD=url.password or '')
    try:
        with path.open('xb') as output:
            path.chmod(0o600)
            if binary:
                run([binary, '-h', url.host or '127.0.0.1', '-p', str(url.port or 5432), '-U', url.username or 'wisconnect', '-d', url.database or 'wisconnect', '-Fc'], env=environment, stdout=output)
            elif shutil.which('docker') and DATABASE_URL == 'postgresql+psycopg://wisconnect:wisconnect@127.0.0.1:5432/wisconnect':
                run(['docker', 'compose', 'exec', '-T', 'db', 'pg_dump', '-U', 'wisconnect', '-d', 'wisconnect', '-Fc'], stdout=output)
            else: raise SystemExit('Install PostgreSQL client tools (pg_dump) for this configured database.')
    except BaseException:
        path.unlink(missing_ok=True)
        raise
    print(f'Private database backup saved: {path}')


def up():
    if PG_BIN.exists():
        data = LOCAL / 'postgres'
        if not (data / 'PG_VERSION').exists():
            raise SystemExit('Native database not initialized. Use the documented Docker setup or restore an existing local cluster before starting.')
        if not listening(5432):
            run([PG_BIN / 'pg_ctl', '-D', data, '-l', LOCAL / 'postgres.log', '-o', f'-h 127.0.0.1 -p 5432 -k {shlex.quote(str(LOCAL))}', '-w', 'start'])
        with engine.connect() as connection:
            actual = Path(connection.scalar(text('SHOW data_directory'))).resolve()
            if actual != data.resolve():
                raise SystemExit('Port 5432 belongs to a different database. No migration or restart performed.')
        mailpit = LOCAL / 'runtime/mailpit'
        if not listening(8025) and not listening(1025):
            if not mailpit.exists(): raise SystemExit('Local Mailpit runtime is missing.')
            (LOCAL / 'mailpit').mkdir(exist_ok=True, mode=0o700)
            with (LOCAL / 'mailpit.log').open('ab') as log:
                subprocess.Popen([str(mailpit), '--listen', '127.0.0.1:8025', '--smtp', '127.0.0.1:1025', '--smtp-disable-rdns', '--disable-version-check', '--database', str(LOCAL / 'mailpit/messages.db')], cwd=ROOT, stdout=log, stderr=log, start_new_session=True)
        elif not (listening(8025) and listening(1025)):
            raise SystemExit('Only one mail-service port is available. Check the local services before continuing.')
    else:
        if not shutil.which('docker'): raise SystemExit('Start Docker Desktop and run this command again. No supported local database runtime was found.')
        run(['docker', 'compose', 'up', '-d', '--wait', 'db', 'mailpit'])
    run([sys.executable, '-m', 'alembic', '-c', 'backend/alembic.ini', 'upgrade', 'head'])
    print('Database is ready. Run npm run dev:api and npm run dev in separate terminals. Mailpit: http://localhost:8025')


def doctor():
    from alembic.config import Config
    from alembic.script import ScriptDirectory
    ok = True
    try:
        with engine.connect() as connection:
            connection.execute(text('SELECT 1'))
            revision = connection.scalar(text('SELECT version_num FROM alembic_version'))
            expected = ScriptDirectory.from_config(Config(str(ROOT / 'backend/alembic.ini'))).get_current_head()
            print('Database: connected')
            print('Migrations: current' if revision == expected else 'Migrations: update required; run npm run db:migrate')
            ok = revision == expected
            directory = str(connection.scalar(text('SHOW data_directory')))
            if directory.startswith(('/tmp/', '/private/tmp/', '/var/folders/', '/private/var/folders/')):
                print('Storage: temporary directory; preserve and relocate before relying on these records'); ok = False
            else: print('Storage: persistent data directory')
    except Exception:
        print('Database: unavailable or not initialized; run npm run local:up'); ok = False
    for label, url in [('API','http://127.0.0.1:8001/health'), ('Test inbox','http://127.0.0.1:8025/api/v1/info'), ('Website','http://localhost:3000/login/')]:
        try:
            with urlopen(url, timeout=5) as response: healthy = response.status == 200
        except Exception: healthy = False
        print(f'{label}: ' + ('ready' if healthy else 'unavailable')); ok = ok and healthy
    if not ok: raise SystemExit(1)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['up', 'doctor', 'backup'])
    args = parser.parse_args()
    {'up': up, 'doctor': doctor, 'backup': backup}[args.command]()
