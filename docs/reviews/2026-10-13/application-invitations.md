# Application-to-account invitation handoff — 13 October 2026

Application review now includes an explicit account-invitation step. The administrator confirms the application email, Member account role, 24-hour single-use lifetime and local-only delivery. Unsaved review changes must be saved first. Sending, revoking and accepting a linked invitation adds private application history and updates its edit version. None of these actions changes the review status or makes a cooperative membership decision.

Invitations now retain separate rows for each issuance instead of overwriting the previous invitation for an email address. A transaction-scoped PostgreSQL advisory lock serializes issuance, revocation and acceptance for an email across API workers. Both the general invitation endpoint and application handoff reject an existing account or a pending invitation, including one originating elsewhere. An application cannot silently claim the provenance of a prior invitation.

Application sends use actor/application/version-bound request IDs. Lost-response retries return the current record without creating a second invitation or sending another email. Concurrent review changes cause a conflict before sending. Revocation is idempotent and does not deactivate accounts; accepted invitations must be handled through account management. Revoked and expired tokens remain unusable after a new invitation is issued. New account acceptance is single-use, audited and still requires a fresh sign-in.

Only the application's email is passed to invitation mail. Private expertise, contributions and notes are excluded. Tokens and hashes are not returned by the admin detail/list endpoints. Fixed Mailpit transport remains local; SMTP rejection rolls back the invitation, review version and new event. An SMTP-accepted message followed by a database commit failure remains an inherent limitation of the existing local transaction/mail design; durable production mail delivery is still a release gate.

Migration `0010_application_invitations` adds source application/request metadata, an email index and issue time, and removes the obsolete single-row-per-email constraint. Existing account and token values are preserved; previous sources are not inferred. Legacy issue time is derived from the old 24-hour expiry rule. Previously overwritten history cannot be reconstructed. Downgrade refuses to discard repeated invitation history to restore email uniqueness.

## Verification

- `npm run application-invitations:check` passed in a disposable schema: active administrator/CSRF/validation/version gates, actor-bound retries, simultaneous application sends, cross-entry duplicate prevention, independent review status, token/private-field exclusion, local email content, revocation, expiry, fresh invitation rows, single-use concurrent acceptance, linked activity, existing-account rejection and SMTP rollback/retry. Only owned synthetic Mailpit messages were generated and cleaned up.
- `npm run auth:check` passed invitation/authentication regressions, including local transport failure, expiry, revocation, account creation/deletion and sessions.
- `npm run applications:check` passed existing intake/review/assignment/search/pagination/history/conflict and privacy checks.
- Production LAN-origin build/TypeScript and whitespace checks passed. Temporary review route and development-generated route types removed before build.
- Browser fixture verified unsaved-review gating, explicit confirmation, simulated outage/retry, linked pending display, revocation confirmation/history, unchanged review status and focus restoration. Dark desktop and 320px phone checked; no page/dialog horizontal overflow or captured console warnings/errors.
- Actual local application read verified the new account-access panel, light desktop/phone rendering and unchanged receipt history. No invitation was sent and no real record was changed. User theme preserved; viewport reset.

The local migration ran after backup `.local/backups/20261013T135033550783Z.dump`, with the verified API stopped during the schema transition to avoid overlapping old/new invitation rules. Private preview restarted at the unchanged Wi-Fi address; final tool session `60584`. No public deployment, push or external email. Railway setup remains deferred.

Evidence: [actual desktop](application-invitations/live-desktop.png), [actual phone](application-invitations/live-phone.png), [sample pending invitation](application-invitations/pending-desktop.png), [sample revoked invitation](application-invitations/revoked-phone.png).

Production email/acceptance tests, full operational readiness and team membership policy remain open. This completes the local application handoff, not membership approval or the full admin goal.
