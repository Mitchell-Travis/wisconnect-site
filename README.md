# WisConnect

WisConnect is a worker-owned cooperative platform connecting women entrepreneurs, business opportunity, capital, and communities.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, CSS Modules, Motion
- Backend: FastAPI, SQLAlchemy, Pydantic, Alembic
- Database: PostgreSQL
- Later, when needed: Redis and Celery or RQ

## Local setup

Requirements: Node.js 22+, Python 3.13+, and Docker.

```bash
npm install
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
npm run db:up
npm run db:migrate
```

Run the frontend and API in separate terminals:

```bash
npm run dev
```

```bash
npm run dev:api
```

- Website: `http://localhost:3000`
- API: `http://localhost:8001`
- API documentation: `http://localhost:8001/docs`
- Database health check: `http://localhost:8001/health`

Local defaults are documented in `.env.example`. Override them with environment variables when necessary.

## Checks

```bash
npm run typecheck
npm run build
```

## Current scope

The existing responsive public website and supplied WisConnect brand assets are preserved. The API currently provides the smallest working foundation and a database health check; application tables will be introduced through Alembic after the first dashboard data model is approved.

GitHub Pages remains configured for the static public website. The API and database require separate application hosting before production deployment.
