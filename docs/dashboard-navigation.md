# WisConnect dashboard navigation

The menu follows the contracted platform phases in `WISCONNECT_CONTEXT.md`. This pass establishes navigation and page structure for UI review, not the underlying business workflows.

| Area | Administrator menu | Member menu |
| --- | --- | --- |
| Start | Home | Home |
| Primary | Members, Businesses, Finance, Projects, Documents, Reports | My membership, My business, Documents |
| Secondary | Team & access | — |
| Profile menu | Settings, Support, Sign out | Settings, Support, Sign out |
| Within Members | Directory, Applications, Invitations | — |
| Within Finance | Payments, Investments | — |
| Within Invitations | Email inbox (local development) | — |

This compact Phase 1 menu supersedes the initial full-platform menu at Mitchell’s request. Reports contains Financial, Sales, Membership, Activity and Impact categories. Marketplace, orders, website publishing, training, messaging and news/events are omitted from navigation for now. Their earlier preview definitions remain unused. No new workflows were connected in this styling pass.

Existing functional features remain connected: authenticated profile, profile-name editing, invitations/revocation for administrators, logout and the local email inbox. Other sections contain a UI-preview label, descriptive scope, working category selectors and empty table headings; there are no fabricated people, balances, transactions, orders or reports. Administrative previews are hidden from members and guarded in the view. Real APIs will still require server-side authorization when implemented.

Members is now connected to local accounts through admin-only `GET /auth/members`: name/email, role and account-active status. Railway-style toolbar contains Members/count, Applications, Invitations, expandable name/email search and Invite. Empty/loading/error/retry states are explicit. Account status is not a claim about dues or approved membership standing. Other operational sections remain previews.

The approved Railway shell uses a 220px white sidebar, 36px rows for fine pointers, 16px icons and a neutral active background. A 56px workspace header sits above an independently scrolling panel with a thin border and 8px corners. Section changes reset panel scroll and focus the heading. Touch targets stay at least 44px. On phones, Menu opens a bounded list, page content scrolls naturally, and Escape returns focus to Menu. Parent navigation stays active when opening invitations/applications or investments. Members/Applications also exposes Invite member in the page heading, opening the existing invitation workflow.

Sources: contracted Phase 1 administration scope, Phase 2 commerce/member portal, and application-review/public-content requirements in the project handoff. Detailed record fields, operational permissions and approval rules remain subject to product definition.
