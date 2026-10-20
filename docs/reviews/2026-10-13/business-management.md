# Business management — local verification, 13 October 2026

The Businesses section now manages saved records and the local public directory. Migration `0008_businesses` imports the eleven existing approved listings with their exact public fields, profile links, distinctive photographs and card styling. It adds no accounts or owner assignments. Private backup before the local migration: `.local/backups/20261013T132607029606Z.dump`.

## Implemented behavior

- Administrator-only creation, editing, search, publication filters and pagination. Member and inactive-account requests are denied by the backend.
- Separate draft and published JSON snapshots. Saving edits leaves the published version unchanged; explicit publish updates it. Archive hides the listing without deletion. Restore returns it to a private draft, requiring another explicit publish.
- Private account owner links, internal contacts and notes; separate public contacts and HTTPS website. Links do not confer account permissions or cooperative membership.
- Version checks prevent conflicting saves; request IDs make retried writes safe. Row locks and database uniqueness protect concurrent writes. Events record actor, action and date, with paginated activity history.
- Approved photograph/profile choices and field limits; image paths and profile links are allowlisted. Custom image uploading remains unfinished.
- Public API serializes only allowed published fields. Local directory errors show a retry rather than falling back to potentially archived static listings. Public reads paginate at 100, admin lists and activity at 25.
- Phone list, desktop table, public-only form preview, explicit publication confirmations, failed-save value retention, discard/reload confirmation and Back-button unsaved-edit protection. Browser unload warns about dirty forms. Dashboard section navigation is not yet covered by an unsaved-form guard.
- Existing four-card preview, “Explore all 11 businesses”, public business-detail interactions, founder portraits (including Priscilla), and image assets are preserved. No new image animations.

## Verification

- `npm run businesses:check` passed in a disposable schema: exact eleven-record import, unsigned/member/inactive restrictions, origin/validation controls, active owner links, private/public separation, concurrent/idempotent create and edit, stale conflicts, publish/archive/restore, retry behavior, escaped search and public/admin/activity pagination.
- `npm run security:check` passed eight bounded-body tests, including the business request limit. `npm run auth:check` passed against the new migration chain.
- Production LAN-origin build, TypeScript and `git diff --check` passed. A stale development-generated route type from the temporary browser fixture caused the first build to fail; removing only that generated development type cache resolved it. The fixture route was removed before the successful build.
- Isolated browser fixture exercised create/save/publish/archive/restore, private-free preview, save failure, discard-and-reload, initial load failure/retry and unsaved-back confirmation. Fixed a phone table overflow and inherited footer background found during this review. Sample mutations were never written to the real database.
- Actual local administrator browser verified all eleven published rows, existing-record loading and migration history. Desktop and 320px layouts checked without horizontal page overflow. Public directory verified four-to-eleven-to-four navigation, published detail content and all eleven distinct images loaded. No captured warnings/errors on actual dashboard or public page.
- The private preview was restarted after verified shutdown of the prior process. Current tool session: `66771`, unchanged `http://192.168.100.16:3001`. Existing account remained usable. No real listing edits, external email, public deployment or Git push.

## Remaining boundaries

Railway is selected for the future backend, and Mitchell deferred hosting setup. The GitHub Pages export continues to use the approved static catalog; local database edits do not update that deployment or its build snapshot. Connecting the hosted directory to the backend is release work. Static founder/sector storytelling and profile associations remain separately authored content.

Custom uploads, image attribution management, granular staff capabilities, owner self-service, and comprehensive dashboard navigation guards remain open. Broader production controls (including MFA, HTTPS/cookies, monitoring, protected off-machine backups and production email) are tracked in the admin roadmap. This feature does not resolve membership policy.

Evidence: [live desktop](business-management/live-desktop.png), [live phone](business-management/live-phone.png), [sample editor desktop](business-management/editor-desktop.png), [sample editor phone](business-management/editor-phone.png), [sample list phone](business-management/list-phone.png), [public preview](business-management/public-directory.png).
