# Backend security foundation review

13 October 2026. Source review and isolated integration checks of the current uncommitted FastAPI/PostgreSQL pilot. This is not a penetration test or a production certification. No real users, passwords, applications or memberships were modified. No external email was sent and no release was deployed.

**Follow-up:** the process-local limiter findings below describe the initial audit. Shared PostgreSQL throttling, read limits and remaining-window Retry-After are now implemented and verified; see [shared rate limits](shared-rate-limits.md) for the current policy, migration and preview rollout. The LAN preview has also been restarted with bounded-body handling. Other production gaps below remain open.

## Assessment

There is a useful security foundation already. It includes strong password hashing, server-enforced administrator/member permissions, revocable sessions, expiring single-use tokens, explicit origin checks, bounded inputs and local rate limiting. It is intentionally a local/LAN pilot. It should not become public merely by removing the local-access restrictions.

## Existing protections

| Area | Observed implementation |
| --- | --- |
| Passwords | Salted scrypt with N=2^17, r=8, p=1; constant-time comparison; common-password rejection; 15–128-character new passwords; two concurrent password hashes per process. Unknown login accounts use a dummy hash. |
| Sessions | Random 256-bit tokens; only SHA-256 token hashes stored; eight-hour expiry; HttpOnly and SameSite=Strict cookies; server checks session validity and active account. Logout, account suspension and password reset revoke applicable sessions. |
| Permissions | Current-user and administrator dependencies enforce access server-side. Profile writes cannot supply their own role/account identity. Profile edits and application review use version checks and row locking. |
| Invitations/recovery | Hashed random tokens, expiration and single-use redemption; recovery invalidates old sessions; concurrent redemption and mail failure rollback have integration coverage. |
| Request boundary | Exact allowed Origin plus a custom header for unsafe requests; local opt-in/client restrictions; exact LAN Host/subnet checks; explicit CORS origin. Forwarded client IP headers are not trusted in the local startup commands. |
| Data integrity | SQLAlchemy queries, schema constraints, bounded fields, rejected extra input fields, idempotent application submission/review and administrator-only private notes. |
| Privacy | Fixed validation messages avoid reflecting submitted passwords/tokens. Protected API responses receive no-store, no-referrer and nosniff headers. Profile data is not published. |
| Recovery foundation | Persistent local PostgreSQL storage, Alembic migrations and a local backup command. An isolated restore rehearsal was documented on 12 October; it was not repeated in this review. |

Source: `backend/app/auth.py`, `accounts.py`, `applications.py`, `models.py`, `main.py`, `preview_config.py`, `backend/devtools.py`, `compose.yaml` and the existing account-foundation review.

## Rate limiting exists, but is process-local

The limiter in `backend/app/auth.py` uses a locked in-memory dictionary with a 900-second window and a maximum of 4,096 keys. Rejections return HTTP 429 with Retry-After. Examples:

| Scope | Limit per 15-minute window |
| --- | ---: |
| Protected unsafe requests, by client IP | 80 |
| Login attempts, by normalized email hash | 10 |
| Recovery requests, by IP / email hash | 12 / 3 |
| New contact inquiries / introductions, by IP | 8 / 8 |
| Newsletter signup, by IP | 12 |
| Invitations, by administrator | 20 |

There are additional per-user edit/review/mail-retry limits. Idempotent submission retries can bypass the endpoint's new-submission quota but remain subject to the global write limit.

Important gaps: counters disappear on process restart; multiple workers do not share counters; reads have no equivalent general protection; many new keys can exhaust the cardinality budget and deny new keys; a shared office IP can hit the global write allowance. Shared atomic enforcement and appropriate endpoint-specific budgets are required before public hosting. Password hashing concurrency bounds memory use, but waiting requests still need admission/time limits.

## Changes made during this review

The original size check called `await request.body()` before comparing its length, so it had already buffered an arbitrarily large incoming body. Added `backend/app/request_limits.py`: declared oversized bodies are rejected before reading; bodies without Content-Length are read with a cumulative cap, stopping at the first overflowing chunk before reaching the endpoint. Understated Content-Length does not bypass the byte count. Limits remain 8 KiB by default, 16 KiB for contact and 20 KiB for applications/introduction intake.

The local origin/client checks still run before body buffering. Global write throttling now also counts oversized requests. Boundary rejections now receive the same privacy headers as other protected API responses. No authentication, role or membership semantics changed.

This bounds application-level accumulation; the ASGI server/proxy can still allocate an individual incoming chunk. Deployment-level body/header limits, concurrency limits and slow-request timeouts remain necessary. Protected GET/HEAD/OPTIONS bodies are not prebuffered by this middleware.

The fix is saved in source and verified through isolated API processes. The long-running LAN preview does not reload Python automatically and has not been restarted as part of this audit; it will receive the change on restart. There is no production deployment of this backend.

## Remaining work, ordered by release importance

1. **Shared abuse protection:** atomic multi-worker rate limiting, explicit backend-failure behavior, limits on expensive reads, trustworthy client IP handling behind the actual proxy, timeouts and bounded work queues.
2. **Production identity/transport settings:** HTTPS-only origins, Secure session cookies, validated production secrets/database configuration, proxy trust and separate environments. Current `secure=False` is intentional for local HTTP and unsuitable for public sessions.
3. **Administrator account protection:** MFA and tested recovery; sensitive-action reauthentication; idle expiry and a session-management interface. Current roles are only admin/member; granular team capabilities must accompany additional administrative functions.
4. **Security visibility:** complete sign-in/invitation/role-change audit coverage; structured redacted logs; error, uptime, abuse and failed-mail alerts. Current account/application event tables provide useful history but not a complete security audit trail.
5. **Delivery and operations:** real sender/provider configuration for invitation/recovery/newsletter flows, a durable mail outbox with safe retries, protected off-machine backups, scheduled restore rehearsals and database recovery targets. Contact has a separate SMTP adapter; that does not mean all identity email is production-ready.
6. **Supply chain and browser controls:** automated dependency vulnerability checks, reproducible dependency installation, CI security/integration checks, CSP and other appropriate production response headers. No dependency vulnerability scan was run in this review; no claim is made that dependencies are vulnerability-free.
7. **Uploads before Documents/business media:** private storage and authorization, format/content validation, size limits, safe generated names, scanning as appropriate, and controlled downloads. Do not expose arbitrary uploads from the application directory.
8. **Data lifecycle:** document retention, export permissions, deletion/archive policy and backup access. Resolve actual membership and document-publication policy with the team rather than infer it from account status.

## Verification

- Baseline `npm run foundation:check`, `npm run auth:check` and `npm run applications:check` passed against separate disposable PostgreSQL schemas. The foundation suite deliberately exercises a failed local email delivery and passes its rollback assertions.
- `npm run security:check`: eight network-free cases passed, covering exact route-family boundaries, chunked overflow, early rejection, understated/malformed/duplicate Content-Length, large decimal headers, disconnect, empty bodies and read/static passthrough.
- After the fix, `npm run applications:check` passed, including real HTTP 413 rejection and privacy headers on oversized and untrusted-origin responses.
- `npm run auth:check` passed again after the fix: migrations, invitation delivery/rollback, concurrent single-use acceptance, expiry/revocation, roles, session revocation, validation, CSRF, logout, throttling and the local opt-in gate.
- `git diff --check` passed after the code changes. No frontend source changed in this review, so no frontend build was necessary.

Initial integration runs were blocked by the command sandbox's localhost-network restriction. Approved reruns connected successfully; this was an execution-environment limitation, not a failed backend assertion.

## Reference guidance

The deployment recommendations align with OWASP's guidance on [REST API transport and resource controls](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), [authentication and throttling](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [MFA](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) and [file uploads](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html). Existing implementation statements above come from repository inspection and the named checks, not from those general references.
