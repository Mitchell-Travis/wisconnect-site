"""Build and serve the website plus API for an explicitly selected private LAN."""
import argparse
import os
from pathlib import Path
import subprocess
import sys

from .app.preview_config import validate_lan

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', required=True, help='This computer’s Wi-Fi IPv4 address')
    parser.add_argument('--network', required=True, help='Local network CIDR, e.g. 192.168.100.0/24')
    parser.add_argument('--port', type=int, default=3001)
    args = parser.parse_args()
    origin = f'http://{args.host}:{args.port}'
    try:
        validate_lan(origin, args.network)
    except ValueError as error:
        parser.error(str(error))
    env = dict(os.environ, WISCONNECT_LOCAL_AUTH='1', WISCONNECT_LAN_ORIGIN=origin,
               WISCONNECT_LAN_CIDR=args.network, NEXT_PUBLIC_LAN_ORIGIN=origin)
    if env.get('GITHUB_ACTIONS') == 'true':
        parser.error('Mobile preview is for a local development machine, not CI.')
    subprocess.run(['npm', 'run', 'build'], cwd=ROOT, env=env, check=True)
    print(f'Mobile preview: {origin}/login/ — same local database; test emails stay in Mailpit on the Mac.', flush=True)
    try:
        subprocess.run([sys.executable, '-m', 'uvicorn', 'backend.app.main:app', '--host', args.host,
                        '--port', str(args.port), '--no-proxy-headers', '--no-access-log'], cwd=ROOT, env=env, check=True)
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
