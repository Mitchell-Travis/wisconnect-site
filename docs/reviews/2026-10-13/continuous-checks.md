# Dependency and regression checks

13 October 2026. Local changes for the active admin goal; no push, external email, production database access or hosting setup. Railway remains deferred.

## Changes

- Added a reusable GitHub Actions workflow for pull requests, manual runs and weekly advisory scans. Existing Pages deployment now depends on this workflow. Checks use read-only repository permission and no application secrets; disposable PostgreSQL 17 and Mailpit services supply integration dependencies.
- Added `npm run backend:check`: eleven sequential, timeout-bounded suites for request limits, shared quotas, authentication, account foundations, sessions, applications, invitations, businesses, inquiries, contact and newsletter. The checks use owned schemas and synthetic mail. LAN/browser testing remains separate.
- CI audits npm dependencies at moderate severity or above and Python dependencies at any reported severity. Audit/network errors fail the job. It builds Pages and local account-enabled exports and checks TypeScript. The backend lock is installed with mandatory hashes and checked for dependency consistency before migrations/tests.
- Patched Next.js 16.3.5 → 16.3.8, sharp 0.35.4 → 0.35.5 and source-map-js 1.2.1 → 1.2.2. Kept Next.js on its current minor series (`~16.3.8`). Updated package-lock integrity metadata; Linux platform dependencies remain present. Existing app content, styling and Python runtime versions are preserved.

## Verification

- Initial npm audit reported three affected packages (one critical, two high). Compatible fixes applied; subsequent npm audit reported zero known vulnerabilities. Advisory results are time-dependent and do not establish whether the specific application exposed each affected feature.
- Python audit of all 26 installed runtime packages reported no known vulnerabilities.
- Generated a full 26-package Python 3.14 hash lock without changing runtime versions. A fresh isolated install with `--require-hashes` passed, as did `pip check`, direct-requirements drift validation and an audit of the final lock. Linux runner execution remains to be verified in GitHub.
- All eleven backend suites passed through the new aggregate command, against disposable local schemas and owned Mailpit messages.
- Next.js 16.3.8 Pages build and LAN-origin build passed; TypeScript and whitespace checks passed.
- `actionlint` 1.7.7 accepted both workflow files. Existing preview `/login/` and `/dashboard/` returned 200; health reported a connected database. API process and actual account/application/listing records were not changed.

## Limits and release follow-up

The workflow has not run on GitHub because these changes have not been pushed. Verify its first hosted run and configure required branch checks when publishing is authorized. Python runtime lock targets CPython 3.14 on Linux/macOS; Windows/Python 3.13 development requirements are separate. Actions and service-image tags are versioned but not digest-pinned; tooling dependencies are separate from the application runtime lock. Dependency review/updates, host security, MFA, production email, monitoring, off-machine backups, private documents and finer team permissions remain roadmap work.

Workflow service configuration follows [GitHub’s PostgreSQL service guidance](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers). Hash enforcement follows [pip’s repeatable installation guidance](https://pip.pypa.io/en/stable/topics/repeatable-installs/).
