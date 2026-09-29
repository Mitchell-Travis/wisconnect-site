import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const python = join(root, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const args = process.argv.slice(2);
const env = { ...process.env };

if (args[0] === '--local-auth') {
  args.shift();
  env.WISCONNECT_LOCAL_AUTH = '1';
}

if (!existsSync(python)) {
  console.error('Project Python environment not found. Create it with Python 3.13+:');
  console.error(process.platform === 'win32' ? '  py -3.13 -m venv .venv' : '  python3 -m venv .venv');
  console.error('Then run: node scripts/python.mjs -m pip install -r backend/requirements.txt');
  process.exit(1);
}

const result = spawnSync(python, args, { cwd: root, env, stdio: 'inherit' });
if (result.error) {
  console.error(`Could not start the project Python environment: ${result.error.message}`);
}
process.exit(result.status ?? 1);
