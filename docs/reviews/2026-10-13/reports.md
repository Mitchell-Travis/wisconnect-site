# Operational reports

13 October 2026. Local administrator reporting for the active WisConnect admin goal. No hosting setup, push, external mail or real business/application/account mutations.

## Behavior and meaning

- Reports replaces the placeholder financial/sales/membership tabs. It is administrator-only in desktop/mobile navigation and on both backend endpoints (`GET /auth/reports`, `GET /auth/reports/export`). Inactive sessions and ordinary member accounts are denied.
- Defaults to the last 30 UTC calendar days. Presets cover 7 days, 30 days and this month. Custom inclusive ranges allow up to 366 days through today. A pending date edit must be applied before export.
- Applications/inquiries count records received in the selected period, grouped by their **current** statuses. These are not historical end-of-period states or approval/response-rate metrics.
- Directory activity counts events during the period (including repeated saves/publishes), with existing-listing imports distinct from new drafts. Current publication states and account access are separate all-date snapshots. Accounts have no creation timestamp, so no historical account-growth claim is made.
- Inquiry workload includes all currently open/in-progress records, regardless of receipt date. Due includes today and overdue; closed inquiries are excluded. Unassigned and inactive-assignee work stays visible. Detail is capped at 50 assignee groups, ordered by due count, active count and ID; the display/export disclose shown and total group counts. All summary counts include the complete data set.
- All aggregates and workload detail are returned by a single PostgreSQL SELECT, avoiding contradictory counts across sequential queries. Report statements have a five-second timeout and generic failure response. Additional administrator quotas are 60 report reads/minute and 20 CSV exports/15 minutes, alongside the shared IP limits.

## Export privacy and safety

CSV is generated through a fresh administrator-authorized request using the displayed date range. It includes aggregate counts, date/snapshot scope, generation time and the bounded assignee list. It excludes applicant identities, contacts, original messages, internal notes, account credentials and tokens. Snapshot values may have changed since the screen loaded; the UI explains that downloads generate a fresh report.

CSV uses UTF-8 with BOM and quotes every field. Formula-leading text, full-width formula prefixes and control/format characters receive a visible `Text: ` prefix, with controls replaced by spaces. This intentionally changes dangerous text in exports; names remain unchanged in the application. The CSV library escapes embedded delimiters and quotes. No claim is made about transformations performed by downstream importers. The approach was reviewed against [OWASP’s CSV injection guidance](https://community.owasp.org/attacks/CSV_Injection).

## Verification

- `npm run reports:check` passed against an owned disposable schema: anonymous/member/inactive denials on both endpoints, inclusive midnight boundaries, invalid/reversed/future/overlong dates, defaults, empty periods, complete aggregation, all-date workload, inactive assignees, 55-group truncation, private-field exclusions, CSV structure/formula cases, attachment/privacy headers and sanitized database failures.
- Added the suite to `npm run backend:check` (now twelve suites) and therefore the existing CI gate. Body-limit regressions and TypeScript passed. No schema migration is needed.
- Synthetic browser checks covered populated counts, date changes with native date events, export disabled until dates are applied, export error/retry UI, loading/failure recovery and 320px wrapping without horizontal overflow. Dark phone workload screenshot: `reports/sample-phone.png`. Temporary fixture/server removed before the production build.
- The fixture displayed download-start feedback, but the browser download-event observer timed out. Browser policy blocked inspection of `chrome://downloads`; no workaround was attempted. CSV response content and safety were verified by HTTP integration tests; final browser file completion was not independently observed.
- Production LAN-origin build and final TypeScript/whitespace checks passed after removing the fixture's stale generated type cache. Account-foundation regressions passed. Private API restarted at the unchanged address (session `83471`); no database migration was needed.
- Actual signed-in desktop/320px Reports showed one received introduction, no inquiries, eleven published listings, one existing draft-save event and one active administrator. The seven-day preset updated the displayed range; live CSV response reached download-start feedback. Mobile navigation lists Reports above In development. No horizontal overflow or captured console warnings/errors. User theme preserved and viewport reset. Screenshots: `reports/live-desktop.png`, `reports/live-phone.png`.

## Remaining scope

These are operational summaries, not financial, membership-standing or impact reports. Date-based historical account snapshots, cross-period comparisons and unrestricted bulk personal-record exports are not implemented. Granular staff capabilities, broader audit/monitoring, MFA, private documents and release/hosting checks remain on the active roadmap.
