# Inquiry follow-up — 13 October 2026

Implemented a private administrator workflow around saved website inquiries. Assignment, Open/In progress/Closed status, a calendar follow-up date and append-only private notes are separate from email-notification delivery. Closing requires confirmation in the editor; reopening is supported. The original submitted message stays immutable.

The inbox provides name/email/topic search; status, assignment, due/overdue/unscheduled and delivery filters; accurate matching totals; and cursor pagination. Due dates use the UTC calendar day consistently across backend counts and UI labels. Closed inquiries are excluded from all due/overdue counts. The overview now displays active inquiry counts and how many are due, and opens the matching active inbox.

Saving uses row locking, a version check, actor-bound request IDs and payload fingerprints. Retries do not duplicate notes. Conflicting edits keep the entered form and require an explicit reload; the editor confirms discarding unsaved values. Notes and review data require active administrator access. Public submission responses remain receipt-only. Inquiry request buffering is capped at 16 KiB, enough for maximum-length UTF-8 notes; over-limit requests are rejected before parsing.

Migration `0009_inquiry_followup` was verified against an older populated schema, then applied locally after backup `.local/backups/20261013T133847633662Z.dump`. Existing inquiries start Open, unassigned and without a due date; original messages, delivery state and received timestamps are preserved. Historical receipt events are backfilled. New receipts create their initial history event in the same transaction.

## Verification

- `npm run inquiries:check`: existing-record migration, unsigned/member/inactive restrictions, active admin assignment, origin and field validation, idempotent concurrent saves, stale/reused request conflicts, status/assignment/date/delivery filters, cursor pagination, private history, public receipt privacy, overview counts and notification/follow-up independence. Also maximum-length Unicode notes and bounded-body rejection. All checks run in disposable schemas, with external email disabled.
- `npm run contact:check`: existing contact submission, validation, idempotency, durable receipt during SMTP failure, notification retry and local Mailpit capture still pass. Only synthetic owned messages were generated and cleaned up.
- `npm run foundation:check`: account/profile/reset regressions and full-data overview counts pass with the new fields.
- `npm run security:check`: all eight request-boundary tests pass, including the new inquiry route limit.
- Production LAN-origin build and TypeScript passed. Whitespace checks passed. Temporary review route and its generated development route types were removed before the build.
- Isolated browser fixture: assigned a sample admin, saved private notes, closed/reopened, verified active-list exclusion, retry after save failure, notification independence, native date editing, initial-load failure/retry, unsaved-back confirmation and explicit discard/reload. Editor and list fit 320px without horizontal page overflow. No captured fixture console errors/warnings.
- Real local dashboard: zero real inquiries accurately shown in both overview and active inbox, desktop and 320px layouts checked, no browser warnings/errors. Existing administrator session remains usable. No real inquiry mutations or external replies were made.

Final private API session: `97376`, at unchanged `http://192.168.100.16:3001`. Hosting stays deferred; Railway remains the chosen future backend. Nothing was pushed or deployed publicly.

## Remaining work

The workspace links to the administrator's email app; it does not send or observe replies. Status changes are manual follow-up records, never inferred from notification delivery. Dates do not send reminder emails. Granular staff permissions and the shared unsaved-form guard for dashboard section navigation remain separate roadmap work; editor Back and browser unload are protected. Production delivery, monitoring and retention policies remain release gates.

Evidence: [actual desktop](inquiry-followup/live-desktop.png), [actual phone](inquiry-followup/live-phone.png), [sample list](inquiry-followup/list-desktop.png), [sample editor](inquiry-followup/editor-desktop.png), [sample phone editor](inquiry-followup/editor-phone.png).
