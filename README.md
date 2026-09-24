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
npm run auth:check
```

## Local invite-only member access

This is a **local pilot**, not a production authentication launch. Use `localhost`, not a LAN address or tunnel. Public navigation leads to website content and membership inquiries; there is no public account-registration link.

Start the existing Docker runtime first (on this machine: `colima start`), then:

```bash
npm run auth:up
npm run db:migrate
npm run auth:admin
```

`auth:admin` asks for your name, email, and a password in your own terminal. Password entry is hidden. There are no shared/default credentials, and this command refuses to create another administrator if one already exists. Do not send passwords through chat.

With `npm run dev` and `npm run dev:api` running in separate terminals:

1. Open `http://localhost:3000/admin/` and sign in as the administrator.
2. Enter an **already approved** member's email address. Only invite test identities for this phase.
3. Open `http://localhost:8025` to read the intercepted invitation. Mailpit is local-only and has no external email relay configured.
4. Sign out of the administrator account (or use a separate browser profile), then open the invitation link. `/signup/#token=…` lets the invited person choose their own name and password. Refreshing after the fragment is cleared requires reopening the email link.
5. Sign in at `http://localhost:3000/login/`. Both roles reach `/dashboard/`. Members can edit their profile name; administrators can list accounts, manage invitations and delete eligible member accounts. `/admin/` opens Invitations within the same dashboard. Operational sections remain previews.

Links expire after 24 hours, work only once, and are bound to the invited email. Pending invitations can be revoked; revoke before resending. Activation always creates a **member**, never an administrator. Tokens and eight-hour sessions are hashed in PostgreSQL; passwords use the standard library's salted scrypt. Session cookies are HttpOnly and SameSite=Strict. Logout invalidates the server-side session; inactive accounts and expired sessions are denied. Unsafe requests require an exact trusted Origin and a custom header. Login/invite requests are throttled in this single local API process.

`npm run dev:api` explicitly enables `WISCONNECT_LOCAL_AUTH=1`, binds to `127.0.0.1`, and ignores forwarded client-IP headers. Without that flag, auth endpoints return 404. Frontend auth is disabled off `http://localhost:3000` and in Pages base-path builds. Do not expose this API/inbox through a tunnel or reverse proxy: loopback is not a substitute for production hosting security.

`npm run auth:check` creates and removes its own random PostgreSQL schema and synthetic inbox messages, leaving application accounts untouched. It checks migrations, concurrent single-use redemption, expiry, revocation, role denial, SMTP failure rollback, session invalidation, validation, CSRF, and throttling. For browser verification, start an isolated Chrome instance with remote debugging on port 9222 and run `npm run auth:check -- --browser`; this uses native Chrome/CDP, not Playwright. The browser check uses disposable accounts and redirects its API requests to the isolated test server.

Before a real launch: choose API/database hosting and a same-site HTTPS deployment, set Secure cookies, use production email, add administrator MFA and account recovery, shared rate limiting, audit logging, breached-password screening, and an independent security review. The admin's approval decision is manual in this slice; no application-review system or marketplace permissions are implied.

Security references: [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [single-use token guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), and [Mailpit's local Docker setup](https://mailpit.axllent.org/docs/install/docker/).

## Current scope

The responsive public website now represents the Phase 1 content inventory, including explicit placeholders for content and decisions awaiting approval. See `docs/phase1-website-content.md`. Contact and Join prepare email drafts; they do not save submissions or grant membership. The API provides a database health check and the separate local-only member invitation pilot above.

GitHub Pages remains configured for the static public website. The API and database require separate application hosting before production deployment.
