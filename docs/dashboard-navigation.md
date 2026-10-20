# WisConnect dashboard navigation

## Reports update — 13 October 2026

Reports now opens an administrator-only operational report instead of placeholder financial/membership categories. It sits with connected desktop navigation. UTC date filters cover received applications/inquiries and directory actions; a separate current snapshot covers outstanding inquiry workload, directory publication and account access. CSV export uses the same permission checks and deliberately omits private messages, notes and contact details. Historical descriptions below describe earlier previews.

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


## Connected account management — 12 October 2026

Members now uses `/auth/member-directory` with server-side search, active/inactive filtering and pagination. **View profile** opens private profile details, editing for member accounts, reversible account-access controls and recent activity. The existing destructive API remains for compatibility, but the directory no longer offers deletion as its routine action. Account settings uses the same profile editor for the signed-in user. Login/settings now link to local password recovery. Membership approval and dues remain unimplemented policy areas. Applications now provides local saved introductions, administrator assignment, internal notes and review history; see the update below.

## Mobbin workspace refinement — 12 October 2026

Overview replaces the Home label. Desktop navigation groups Community (Members, Contact inquiries, Businesses) and Operations (Finance, Projects, Documents, Reports), with Team & access and Help & support below. Overview leads with working shortcuts; unfinished areas are explicitly in preparation. Members has a consolidated filter surface, identity/role labels and stacked phone cards. Preview sections replace empty table scaffolding with availability copy and planned field summaries. The existing role restrictions, member-management APIs and invitation flow remain unchanged. This supersedes the prior shell sizing and preview-table treatment; see `docs/reviews/2026-10-12/workspace-ui.md` for Mobbin references.

## Attio correction — supersedes the preceding visual treatment

Mitchell rejected the banner/cards and marketing language. The current workspace uses a compact neutral shell based on actual Attio records screens from Mobbin. Overview reads actual account, invitation and inquiry records from the existing admin APIs. Directory filters are condensed; future sections show short availability notices and planned column headings. The preceding decorative overview and illustrated empty-state treatments have been removed. See `docs/reviews/2026-10-12/workspace-revision.md`.

## Railway desktop and Link mobile — current local revision

The latest explicit references replace the Attio shell. Desktop uses a 220px sidebar, collapsible to a 56px icon rail, a 56px context header and an inset bordered workspace. Mobile uses a centered context header and circular control opening a full-page account/navigation dialog. All role-visible sections, settings, support, theme and sign-out remain accessible. Selecting a section closes navigation and focuses the page heading; Escape restores focus to the opener. Notifications use the current desktop/mobile button position and preserve scroll. Viewport changes close transient menus. Real overview records and the connected account-management workflows remain unchanged. Sources, checks and screenshots: `docs/reviews/2026-10-12/railway-link-workspace.md`. Local review only; not approved or pushed yet.

## Applications intake and tracking — 12 October 2026

Members → Applications now loads `/auth/applications`, with name/email search, status and assignment filters, pagination, and matching loading/empty/error states. Review opens the original introduction, active-administrator assignment, New/Reviewing/Waiting for information status, append-only notes and paginated activity. Stale updates require a reload while preserving the unsaved note. The local Join form saves through `/introductions`; the public static build keeps its email fallback. No membership decisions, account invitations or applicant email are triggered.

## Priorities and availability — 13 October 2026

Overview leads with new applications and pending invitations, plus an explicitly total-count Contact inbox shortcut. Its application shortcut selects New; ordinary Applications navigation defaults to All statuses. Compact account totals follow the task list. Counts use existing admin APIs and do not imply membership approval or unread/reply tracking.

Desktop and mobile navigation group Businesses, Finance, Projects, Documents, Reports and Team & access under In development. The member menu similarly marks its preview sections. Account settings stays outside that group. Mobile navigation uses a menu icon. Typography/actions and light/dark surface hierarchy are refined without changing record permissions or workflows.
