# Railway account settings

Inspected the user's signed-in `https://railway.com/account` tab on 2026-09-21 through read-only DOM measurements. No inputs were changed, saved or submitted.

At 1440×812, Railway places a 200px account navigation column at x=285 and its 826px account content at x=533, a 48px gap. Account/Account Settings headings are Inter 28px/38.5px regular; section headings are 20px/27.5px semibold. Inline forms use two columns with 24px gaps, 12px/18px semibold labels, transparent 42px inputs with 6px corners, and purple 34px Update Info actions. Additional sections cover public profile, integrations and deletion.

WisConnect adopts the layout and inline-form styling for its available Phase 1 controls: Account information, Account access and Support. Name editing reuses authenticated `PATCH /auth/me`; email is read-only and explains how to request a change. Account type and invitation-only access use actual session information. Sign-out and Support remain connected. Unsupported integrations/security/notification/deletion controls were removed from this page rather than presenting unavailable options.

Desktop uses the internal section menu beside the form; smaller widths put section links above it, and phones stack the fields with at least 44px controls. Sidebar/workspace backgrounds remain `#f5f5f5` and `#fdfdfd`. Existing Feather icons are retained. Validation, save/error/retry, successful name propagation, readonly email, navigation and sign-out were checked with mocked responses; the underlying backend was unchanged.
