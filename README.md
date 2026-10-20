# WisConnect

WisConnect is a worker-owned cooperative platform connecting women entrepreneurs, business opportunity, capital, and communities.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, CSS Modules, Motion
- Backend: FastAPI, SQLAlchemy, Pydantic, Alembic
- Database: PostgreSQL
- Later, when needed: Redis and Celery or RQ

## Local setup

Requirements: Node.js 22+, Python 3.13+, and Docker with Compose. On Windows, start Docker Desktop with Linux containers enabled.

Install the frontend dependencies:

```sh
npm ci
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm` in these commands; no execution-policy change is needed.

Create the Python environment on Windows (PowerShell):

```powershell
py -3.13 -m venv .venv
```

On macOS/Linux, use `python3` version 3.13 or newer:

```bash
python3 -m venv .venv
```

Then run these commands on any platform; activating the virtual environment is not required:

```sh
node scripts/python.mjs -m pip install -r backend/requirements.txt
npm run local:up
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
npm run foundation:check
npm run applications:check
npm run contact:check
npm run newsletter:check
```

`npm run backend:check` runs all twelve backend/security suites sequentially. Start the local database and Mailpit first (`npm run local:up`). Each integration suite owns a disposable database schema and synthetic messages; never point these checks at production. Phone/LAN browser checks remain a separate manual check.

GitHub Actions checks pull requests, runs weekly advisory scans and gates the existing Pages deployment. It builds both public and account-enabled exports, checks TypeScript, audits npm/Python dependencies, migrates an ephemeral PostgreSQL database, and runs the backend suites against Mailpit without external delivery. The workflow needs no application secrets. It becomes active when these local changes are committed and pushed; branch protection and a successful hosted run still need verification. Railway setup is deferred.

The frontend uses `package-lock.json` with `npm ci`. For the Python 3.14 Linux/macOS runtime, install the full hash-checked dependency set:

```sh
node scripts/python.mjs -m pip install --require-hashes -r backend/requirements.lock
node scripts/python.mjs -m pip check
```

`backend/requirements.txt` records direct dependencies; `backend/requirements.lock` pins their transitive dependencies and package hashes. Windows/Python 3.13 development still uses `requirements.txt`; that environment is not covered by this lock. To update the lock, use an isolated Python 3.14 tooling environment with `pip-tools==7.6.2`, run `pip-compile --generate-hashes --strip-extras --no-emit-index-url --no-emit-trusted-host --output-file backend/requirements.lock backend/requirements.txt`, then audit and run the backend suites. Review version changes before committing; a clean advisory scan does not certify the application as secure.

## Local invite-only member access

This is a **local pilot**, not a production authentication launch. Use `localhost`, not a LAN address or tunnel. Public navigation leads to website content and membership inquiries; there is no public account-registration link.

Start your Docker runtime first (Docker Desktop on Windows/macOS, Docker Engine on Linux, or Colima on macOS), then:

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

Links expire after 24 hours, work only once, and are bound to the invited email. Pending invitations can be revoked; revoke before resending. Activation always creates a **member**, never an administrator. Tokens and eight-hour sessions are hashed in PostgreSQL; passwords use the standard library's salted scrypt. Session cookies are HttpOnly and SameSite=Strict. Logout invalidates the server-side session; inactive accounts and expired sessions are denied. Unsafe requests require an exact trusted Origin and a custom header. Login/invite requests use shared PostgreSQL rate limits that survive process restarts.

`npm run dev:api` explicitly enables `WISCONNECT_LOCAL_AUTH=1`, binds to `127.0.0.1`, and ignores forwarded client-IP headers. Without that flag, auth endpoints return 404. Frontend auth is disabled off `http://localhost:3000` and in Pages base-path builds. Do not expose this API/inbox through a tunnel or reverse proxy: loopback is not a substitute for production hosting security.

`npm run auth:check` creates and removes its own random PostgreSQL schema and synthetic inbox messages, leaving application accounts untouched. It checks migrations, concurrent single-use redemption, expiry, revocation, role denial, SMTP failure rollback, session invalidation, validation, CSRF, and throttling. For browser verification, start an isolated Chrome instance with remote debugging on port 9222 and run `npm run auth:check -- --browser`; this uses native Chrome/CDP, not Playwright. The browser check uses disposable accounts and redirects its API requests to the isolated test server.

Before a real launch: choose API/database hosting and a same-site HTTPS deployment, set Secure cookies, use production email, add administrator MFA, complete security audit logging, deployment-level abuse protection, breached-password screening and an independent security review. Local account recovery, application review and shared throttling are implemented; cooperative membership decisions and marketplace permissions are separate. Track remaining work in `docs/admin-roadmap.md`.

Security references: [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [single-use token guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), and [Mailpit's local Docker setup](https://mailpit.axllent.org/docs/install/docker/).

## Contact submissions and email

Run `npm run auth:up`, `npm run db:migrate`, `npm run dev` and `npm run dev:api`. Contact uses the same local-only API boundary as authentication. Visitors do not need an account to submit; only administrators can view **Contact inquiries** in the dashboard or retry a failed email notification.

Each submission is saved before email is attempted. The browser retains its submission ID across an unchanged retry; concurrent retries create one inquiry and serialize notification attempts. An SMTP acceptance followed by a server/database failure can still result in a duplicate notification when retried. Delivery status means the email service accepted the message, not that it reached the recipient’s inbox.

By default, `WISCONNECT_CONTACT_MAIL_MODE=local` captures notifications in Mailpit at `http://localhost:8025`. Nothing is delivered externally. The recipient is fixed to `hello@wisconnect.co`; the visitor’s validated address is Reply-To. No account is created.

For real email, configure the server process with `WISCONNECT_CONTACT_MAIL_MODE=smtp` and the SMTP host, port, TLS mode, username, password and verified From address listed in `.env.example`. Use credentials authorized for the sending service. The launcher does not automatically load `.env`; set variables in the server’s environment and restart the API. Keep credentials private and out of `NEXT_PUBLIC_*` variables and Git. Real sending credentials have not been configured or tested. Public MX records point to Google mail servers; that alone does not establish sending permissions or authentication settings.

`npm run contact:check` uses its own disposable PostgreSQL schema and local test emails. It checks validation, origin restrictions, admin access, concurrent retries, persistence when email fails, retry, pagination and TLS configuration with a fake SMTP transport. It removes its own test data.

The GitHub Pages build keeps Contact submission disabled and offers direct email. Public form submission requires a hosted API/database and appropriate production controls; SMTP configuration alone does not enable the hosted form.

## Current scope

The responsive homepage includes purpose, the holding-cooperative model, eight visionaries, eight Chicago business sectors, eleven network businesses with location filters, services, community projects, Chicago/Liberia locations, a connection map, member stories, membership-interest steps, FAQs and contact/partnership next steps. Unfinished programs, resources, news, events, gallery and other placeholders are temporarily hidden with their implementation preserved. See `docs/phase1-website-content.md` for the wider inventory. Contact submissions are saved in the local administrator dashboard and trigger an email notification. Join saves introductions for local administrator review; the public static site retains the email-draft fallback. Neither flow grants membership. The API also provides database health and the local-only member invitation pilot above.

GitHub Pages remains configured for the static public website. The API and database require separate application hosting before production deployment.

## Account foundation and member records

`npm run local:up` starts persistent PostgreSQL and Mailpit and applies migrations. It uses the preserved native runtimes on this development machine, or Docker Compose elsewhere. Then run `npm run dev:api` and `npm run dev` in separate terminals. `npm run local:check` checks the database, schema version, storage location, API, inbox and website. It does not alter records.

Native data and runtimes live in the ignored `.local/` directory; Docker uses named `postgres_data` and `mailpit_data` volumes. Do not delete `.local/`, run `docker compose down -v`, or recreate a database to fix a login issue. Keep a backup before changing storage. On this machine the earlier temporary cluster was preserved as an offline fallback, not the active database.

`npm run db:backup` writes a PostgreSQL custom-format archive with owner-only permissions under `.local/backups/`. Use matching PostgreSQL client tools (17 here); native runtimes or `pg_dump` on PATH are supported, with a Docker fallback for the default local database. Archives include private records and password hashes: keep them out of Git and copy important backups to protected storage outside this computer. Restore with `pg_restore` into a **new, empty database**, verify its records and schema, then explicitly change `DATABASE_URL`; never overwrite the active database as a test.

Administrators can search and paginate accounts, edit private member profiles, and deactivate/reactivate member access. Deactivation immediately revokes existing sessions and recovery tokens while retaining records. Administrators cannot deactivate administrators or grant roles from this screen. Members edit only their own profile through Account settings. Profiles support name, optional phone, city/country and a short biography. These fields are private and are not automatically published or treated as membership approval. Concurrent stale edits receive a reload message instead of silently overwriting a newer record. Administrative/profile/recovery activity is recorded; the older name-only API remains for compatibility.

Forgotten passwords: use **Forgot your password?** on `/login/`, then open the captured reset email at `http://localhost:8025`. Links expire in 30 minutes, work once and are stored only as hashes. A new request replaces earlier links; a successful reset signs out every session. Recovery does not activate suspended accounts. A common generic response is used for existing, absent and inactive accounts. If no message arrives, run `npm run local:check`; local delivery failures are logged without the address or token.

Account, invitation and password-recovery APIs remain restricted to localhost or the explicitly configured private LAN preview described below. Public account recovery is disabled in the static website. Real email, hosted identity configuration, production backups and account-policy decisions remain separate deployment work. No membership fees, dues or approval rules have been invented.

## Shared request protection

Account settings includes **Session security**: list your own sessions, sign out another session, or sign out all others. Sessions expire after 30 minutes without an authenticated request and at most eight hours after sign-in. New sign-ins retain at most ten sessions per account. Browser/device labels are approximate; raw user-agent strings/IP addresses are not stored. Migration `0007_session_management` preserves existing tokens and absolute expiry and starts legacy idle timers at migration. Back up and migrate before restarting the API. `npm run sessions:check` verifies this in a disposable schema; see `docs/reviews/2026-10-13/session-security.md`.

Migration `0006_shared_rate_limits` adds expiring PostgreSQL counters. Back up before `npm run db:migrate`, then restart API workers. All workers must use the same database/schema. Missing/unavailable counters fail closed with HTTP 503 and Retry-After; do not bypass this by disabling the limiter.

Protected API writes have a shared 600-request/IP allowance per 15 minutes; reads allow 600/IP per minute. The higher shared-IP write allowance accommodates offices, while stricter endpoint quotas remain: login 10/email per 15 minutes, recovery 12/IP and 3/email, new inquiries/introductions 8/IP, newsletter signup 12/IP and invitations 20/administrator. HTTP 429 reports the remaining window in Retry-After. OPTIONS is not counted. Client IP comes from the direct connection; production proxy trust still requires explicit configuration.

Counter updates are atomic and use database time. Keys are hashed; a separate bounded connection pool avoids waiting on connections held by endpoint transactions. Expired counters are removed in indexed batches of at most 32 per call. Fixed windows can admit a burst spanning two windows; edge-level connection, request and concurrency limits are still required before hosting. The health endpoint and static files are not covered by these API counters.

`npm run ratelimit:check` uses an owned disposable schema, multiple interpreter processes and two API workers to check concurrency, restart persistence, expiry, cleanup, remaining retry time, lock timeouts, unavailable storage and HTTP enforcement. `npm run security:check` checks bounded request-body handling without a database. Review: `docs/reviews/2026-10-13/shared-rate-limits.md`.

## Introductions and Applications review (local)

The local `/join/` form saves all five answers through `POST /introductions` and returns a reference. Repeating an uncertain submission with the same key does not create a duplicate. No account or email is created. On the public static site, Join continues to prepare an email draft until a hosted API/database is configured.

Administrators open **Members → Applications** to search introductions, filter by review status or assignment, read the original answers, assign an active administrator, and save internal notes. Statuses are **New**, **Reviewing**, and **Waiting for information**. Changes record the administrator, date, before/after status or assignment and note. Notes are append-only; they are not sent to applicants. The review flow has no approve/decline action or membership rules.

Migration `0005_introductions` adds the intake and activity tables. Back up the local database before applying it with `npm run db:migrate`. The Applications APIs are administrator-only, protected by the existing local-origin/session boundary, and use version checks to prevent lost edits. Lists and history load 25 records at a time. `npm run applications:check` uses and removes its own disposable PostgreSQL schema to test validation, permissions, filters, pagination, retries and concurrent edits.

## Phone testing on the same Wi-Fi

The temporary mobile preview serves the built website and authenticated API together, using the existing local database and accounts. Start the database/Mailpit as usual, then run:

```bash
npm run dev:mobile -- --host 192.168.100.16 --network 192.168.100.0/24
```

Open `http://192.168.100.16:3001/login/` on the phone and sign in with the existing account. Keep the Mac awake and both devices on the same private Wi-Fi. This is an HTTP development preview for a trusted local network, not public hosting. Changes made here affect the same saved local records. Use Ctrl+C in the preview terminal to stop it. The localhost development server/API can continue separately.

The command builds an exact `NEXT_PUBLIC_LAN_ORIGIN` into the frontend and starts a separate API process bound to that address. It requires an explicit private IPv4 address and /24 or smaller subnet. Requests must come from that subnet with the exact Host; writes still require the configured Origin and request header. Authentication, administrator permissions, HttpOnly/SameSite cookies and rate limits remain enforced. Forwarded client headers are not trusted. Without the mobile opt-in, the API remains loopback-only; the public static build still disables account/submission APIs. The database and Mailpit are not exposed on Wi-Fi.

The site is a build snapshot. Restart this command after code changes or another build; confirm the Mac's address if the network changes. Port 3001 must be free. Invitations/recovery/newsletter links generated by the mobile process point to the mobile origin, while email is still captured in Mailpit on the Mac. Open the test inbox there; it is deliberately not served to the phone.

Verification (uses a disposable schema and sends no real emails):

```bash
npm run mobile:check -- --host 192.168.100.16 --network 192.168.100.0/24
```
