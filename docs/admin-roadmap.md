# WisConnect admin completion goals

Updated 13 October 2026. Mitchell requested an active, persistent goal for completing a functional admin platform. This roadmap supersedes earlier notes that said no persistent goal was running. Existing local migration and approved styling must be preserved.

## Overall goal — active

Complete a secure, usable admin platform with business management linked to the public directory, inquiry follow-up, application-to-invitation handoff, private documents, team permissions and useful reports. Verify the workflows and prepare hosted API/database/email deployment. A working local pilot is not a completed production release.

## 1. Backend foundations — in progress

- [x] Review authentication, authorization, rate limiting, request validation, data integrity and deployment boundaries against the current source.
- [x] Establish a passing baseline with isolated account, authentication and application integration checks.
- [x] Enforce request body limits before unbounded buffering, including chunked requests; preserve privacy headers on API boundary rejections.
- [x] Replace process-local throttling with atomic shared limits; test multiple workers, restart behavior, expiration and backend failure. Add read limits and raise the shared office-IP allowance while retaining endpoint quotas. Deployment load testing and proxy/edge configuration remain release gates.
- [ ] Add explicit production configuration: HTTPS, Secure cookies, exact origins/hosts, trusted proxy configuration, secret validation, least-privilege database credentials and separate preview/production environments.
- [x] Add own-session visibility/revocation, 30-minute idle expiry, unchanged eight-hour maximum, ten-session cap and sign-in/sign-out activity. See [session security](reviews/2026-10-13/session-security.md).
- [ ] Add administrator MFA, its recovery procedures and reauthentication for sensitive changes.
- [ ] Complete security audit events and structured operational logs with credential/token/PII redaction; define retention and administrator access.
- [x] Add dependency checks and backend/security regression checks to CI. Inventory and hash-lock the Python 3.14 runtime and use the npm lock. Local suites/builds/audits passed; workflow is local until pushed, and its first GitHub run/required branch checks still need release verification. See [continuous checks](reviews/2026-10-13/continuous-checks.md).
- [ ] Add deployment-level body/header/connection limits, request timeouts and concurrency controls. Configure and verify browser security headers, including CSP for the actual frontend.
- [ ] Automate protected off-machine backups and test restore; add uptime, errors, database and mail-delivery monitoring and actionable alerts.
- [ ] Complete production email transport and durable delivery/retry handling before sending real invitations or recovery links.

Evidence and limits: [backend security review](reviews/2026-10-13/backend-security.md).

Shared PostgreSQL throttling and session management are implemented and migrated locally; evidence is in [the shared-limit review](reviews/2026-10-13/shared-rate-limits.md) and session review above. Continue business-management implementation while tracking MFA and remaining foundation work. Mitchell chose Railway for the backend and explicitly deferred hosting setup; do not block independent local work on provider/domain configuration. Hosting-specific controls remain release gates.

## 2. Businesses and the public directory — core workflows implemented locally

- [x] Create real business records with owner links, contacts, categories, location and descriptions.
- [x] Add draft, preview, publish and archive workflows with an audit history and conflicting-edit protection.
- [x] Connect published records to the existing public directory without losing current approved content, photographs or styling.
- [ ] Add safe image management; preserve attribution and distinguish illustrative photographs from actual business imagery.
- [x] Verify staff permissions and that drafts/private contact details cannot leak through public endpoints or exports.

Local CRUD/public-directory permission and privacy checks passed; no export is implemented. Approved existing image choices are available; uploads and attribution management remain open. GitHub Pages still uses its approved static snapshot until authorized hosting integration. Evidence: [business management review](reviews/2026-10-13/business-management.md). Add unsaved-edit protection for dashboard section navigation alongside other forms.

## 3. Inquiry follow-up — implemented locally

- [x] Add responsible administrator, open/in-progress/closed status, private notes and follow-up dates.
- [x] Show accurate attention counts and filters based on actual follow-up state. Overview now counts Open and In progress inquiries and due dates; it does not infer unread/replied state.
- [x] Track delivery failures and retries separately from whether an inquiry has been answered.

Evidence: [inquiry follow-up review](reviews/2026-10-13/inquiry-followup.md). Due dates use UTC calendar days. Replies are handled through the administrator’s email app; closure is a manual follow-up decision. No reminder emails or reply synchronization are implemented.

## 4. Applications and invitations — partially implemented

- [x] Intake, saved submissions, reviewer assignment, New/Reviewing/Waiting states, private notes, history, idempotent retries and concurrent-edit protection.
- [x] Link an administrator's explicit invitation action to the originating application with duplicate prevention and status history.
- [ ] Verify end-to-end delivery, acceptance, expiry and revocation with the production mail configuration.
- [ ] Implement membership decisions only after the team confirms eligibility, approval/decline policy and membership rules.

Local handoff is implemented and verified, including preserved invitation generations, concurrent/idempotent sends, acceptance/revocation history and separate membership status. Evidence: [application invitations](reviews/2026-10-13/application-invitations.md).

An application review status must not automatically create an account or grant membership. Account invitations and cooperative membership standing are separate concepts. Fees/dues remain deferred; do not invent financial balances or membership policy.

## 5. Documents — pending

- [ ] Add document records, clear audience/access rules and private object storage.
- [ ] Validate file sizes, actual formats, safe names and authorized downloads; introduce scanning appropriate to accepted types.
- [ ] Add versions, archive behavior, audit history and short-lived authorized access.
- [ ] Keep the operating agreement and handbook private unless the team explicitly approves publication.

## 6. Team permissions — pending

- [ ] Define capabilities for business editing, application review, inquiries, documents, reporting and account administration.
- [ ] Enforce them on every relevant backend operation, with matching navigation and explicit denied states.
- [ ] Add safe administrator onboarding/offboarding, last-administrator protection and auditable role changes.

## 7. Reports and operational overview — implemented locally

- [x] Provide date-filtered reports from real records: application pipeline, follow-up workload, directory activity and account status. Clearly separate period intake/actions from current all-date snapshots.
- [x] Add administrator-checked CSV exports and guard spreadsheet exports against formula injection. Export summaries and bounded assignee workload, excluding private messages/notes/contacts.
- [x] Give unavailable/empty/loading states accurate labels; do not present unsupported membership or finance metrics.

Evidence: [operational reports](reviews/2026-10-13/reports.md). UTC ranges are inclusive and capped at 366 days; workload detail shows up to 50 groups with explicit coverage. End-of-period historical statuses, historical account growth and financial/membership standing are not inferred. Browser download-start feedback and HTTP CSV content passed; final browser file completion was not independently observed. Staging and broader access/audit controls remain release work.

## 8. Release verification — pending

- [ ] Establish the actual staging/hosting configuration and deployment authorization before external writes.
- [ ] Verify migrations on a restored snapshot, backup/recovery procedure and rollback plan.
- [ ] Run cross-role workflow checks, abuse/security checks and desktop/phone browser verification against staging.
- [ ] Verify real email delivery, production origin/cookie behavior, monitoring and restore procedures.
- [ ] Release authorized changes, check the deployed version, document remaining operational responsibilities.

## Definition of done for each feature

Data persists after reload; backend permissions and validation are enforced; double submissions and conflicting changes are handled; history is sufficient to explain sensitive actions; loading, empty, failure and retry states work; phone/desktop controls are usable; relevant isolated checks pass; documentation records what was actually verified. No fixture data is presented as real business activity. Existing user records are preserved.

Product decisions that remain necessary: membership policy, detailed staff responsibilities, and publication/access rules for private documents. Railway is selected for the future backend, with hosting setup deferred by Mitchell. Revisit deployment credentials/domain configuration when that milestone is resumed, without blocking independent local work.
