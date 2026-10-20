# Shared rate limiting

13 October 2026. Completes the shared-limiter milestone in the active admin goal. The broader backend/production goal remains active.

## Implementation

- Replaced the process-local dictionary with `rate_limit_buckets` in PostgreSQL, added by migration `0006_shared_rate_limits`. Existing endpoint calls use the shared implementation through `auth.throttle`.
- A single `INSERT ... ON CONFLICT DO UPDATE` consumes each allowance atomically. Database timestamps determine expiry, and denied attempts saturate at limit + 1 without extending the window. PostgreSQL documents the concurrency guarantee for [ON CONFLICT DO UPDATE](https://www.postgresql.org/docs/current/sql-insert.html).
- Only hashed scoped keys are stored. These are pseudonymous counters, not irreversible anonymization of predictable identifiers. Email-scoped login/recovery keys retain the existing normalization/hash behavior.
- Requests use a separate pool of five connections per process, no overflow, a two-second pool wait, three-second connect timeout, 1.5-second SQL statement timeout and 750ms row-lock timeout. This avoids dependency on connections held by endpoint business transactions. These settings are not an end-to-end network timeout guarantee.
- Database errors, exhausted pool waits and lock timeouts return a generic HTTP 503 with Retry-After: 5; there is no permissive local fallback. Error logs exclude query text, identifiers and credentials. Ordinary quota exhaustion returns HTTP 429 with the actual remaining window.
- Indexed cleanup removes at most 32 expired rows per call and skips locked rows. Active rows are preserved. Counters survive worker replacement and restarts.
- Middleware runs blocking limiter work in the threadpool, after local access/origin checks. It covers protected API reads and writes; OPTIONS, static assets and health checks are excluded.

## Policy

| Scope | Allowance |
| --- | --- |
| Protected writes, shared client IP | 600 per 15 minutes |
| Protected reads, shared client IP | 600 per minute |
| Login, normalized email hash | 10 per 15 minutes |
| Password recovery, IP / email hash | 12 / 3 per 15 minutes |
| New contact inquiries or introductions, IP | 8 per 15 minutes each |
| Newsletter signup, IP | 12 per 15 minutes |
| Invitations, administrator | 20 per 15 minutes |

Other profile/edit/review/mail-retry quotas are unchanged. The original 80-write shared-IP cap was increased to accommodate an office with several administrators; sensitive endpoint quotas remain. This is an initial policy requiring production traffic review, not a claim of load testing against anticipated demand.

Fixed windows allow bursts across window boundaries. Distributed denial-of-service protection, trusted production proxy configuration, connection/slow-request limits and admission control for costly password hashing remain deployment work. The direct client IP is still used with forwarded headers disabled for the local preview.

## Verification

- `npm run ratelimit:check` passed using a uniquely named disposable schema. Three interpreter processes competed for seven allowed calls: exactly seven succeeded and the other 29 were rejected. A new interpreter was still rejected. Tests covered expiry, independent scopes, remaining Retry-After, saturation, bounded cleanup, actual row-lock timeout and storage failure.
- Two real isolated API workers shared read/write counters; both rejected exhausted limits; read exhaustion did not consume the independent write allowance. Missing counter storage returned 503 without SQL details. Privacy headers remained present.
- `npm run foundation:check`, `npm run auth:check`, `npm run applications:check` and all eight `npm run security:check` cases passed after the change. Direct handler tests now explicitly use their owned limiter schema, so they cannot mutate the application's counters.
- `npm run contact:check` and `npm run newsletter:check` also passed: validation/origin/size handling, durable/idempotent submissions, SMTP failure/retry, private list permissions, confirmation/expiry/unsubscribe and throttling. Only owned synthetic messages were captured in local Mailpit; no external email was sent. All seven relevant check suites and `git diff --check` passed.
- Local backup completed before migration: `.local/backups/20261013T125136651030Z.dump` (private, ignored). Migration from 0005 to 0006 applied successfully; it only adds the counter table/index/constraint.
- Local diagnostics confirmed the database and inbox were healthy and migrations current. Website/API preview processes had stopped; absence of a listener on port 3001 was confirmed outside the sandbox before starting a new worker.
- Restarted the private preview with the existing `out/` build at `http://192.168.100.16:3001`. Read-only checks returned healthy database status, login page 200 and unsigned session 401. Existing account sessions remain stored; no passwords/accounts/application records were changed. No external email or public deployment.

## Files and rollout

Implementation: `backend/app/rate_limits.py`, `models.py`, `auth.py`, `main.py` and migration `0006_shared_rate_limits.py`. Checks: `backend/check_rate_limits.py`, existing auth/foundation suites and npm scripts. Roadmap and README reflect current behavior.

Apply the migration before restarting workers. All workers must use the same schema. Removing the table while this code runs will correctly cause protected requests to return 503; code rollback must precede any schema downgrade. The change is local and uncommitted, alongside the preserved ongoing migration.
