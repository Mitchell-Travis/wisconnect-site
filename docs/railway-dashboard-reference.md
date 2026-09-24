# Railway dashboard reference

Inspected the user's existing signed-in `https://railway.com/workspace/people` tab on 2026-09-21 through read-only DOM/computed-style inspection. Viewport: 1440 × 812. The separate Playwright browser did not reach an authenticated dashboard. No account changes were made. Measurements below describe this desktop viewport, not a verified mobile layout.

## Observed layout rules

- White shell with a 220px sidebar. Sidebar has a 6px resize handle; its current width is not necessarily the default. Workspace selector at the top, primary navigation beneath, account control at the bottom behind a faint divider.
- Navigation inset 8px; rows 36px high, separated by 4px. Inner padding 8px 12px, icon size 16px, icon/text gap 12px, text 14px/20px regular Inter, corners 8px. Inactive text is `rgb(108,107,123)`; selected text is `rgb(19,17,28)` on black at 3% opacity.
- Workspace header is 56px tall, above the main panel. It shows workspace context and a notification control.
- Main panel starts at x=220/y=56, with 8px outer right/bottom clearance, a 1px black/12% border and 8px corners. It scrolls independently while the shell stays in place.
- Main content has 48px top and 64px horizontal padding at this viewport. Outer content maximum is 1120px; People uses a narrower centered inner column, measured at 826px here.
- Page title is 28px/38.5px regular. People/Security tabs and right-aligned Search/Invite controls sit above the table. Invite is 34px high, 6px corners, purple `rgb(133,59,206)`. Table columns are Person, Role, 2FA and actions; the observed row is 63px tall.
- Workspace selection and personal account actions are distinct controls. Utility links are separate from primary workspace navigation.

## Recommended WisConnect adaptation

Use this shell for the Phase 1 administration dashboard: narrow navigation, 56px context header, white bordered workspace and independent desktop scrolling. Keep the existing Phase 1 menu. Use Members → Directory/Applications/Invitations and Finance → Payments/Investments inside the workspace. Place page actions beside section tabs; use simple record tables and restrained borders instead of oversized cards.

Retain WisConnect's purple brand accent, working account/settings flows and larger mobile touch targets. Show WisConnect as a static workspace identity until multiple cooperatives are actually supported; notifications and sidebar resizing are not required for this first adaptation. This inspection does not authorize or implement new operational features. No UI changes were made during the study.

## Approved implementation

Icons follow-up: inspected SVG classes confirmed Feather (`feather-users`, `feather-search`, `feather-grid`, etc.) plus some custom Railway icons. WisConnect now uses official Feather v4.29.2 geometry in a shared local component, with two-pixel strokes and the existing 16px desktop navigation sizing. MIT license is retained in `public/licenses/feather.txt`; no icon runtime dependency was added.

Latest preference supersedes the earlier follow-up below: use Railway typography and People styling; preserve only sidebar/workspace background colors. People was inspected again, including its expandable 208×34px search field, 12px/18px semibold table headers with 12px/16px padding, and 63px data rows. Members now follows that toolbar/table hierarchy using local accounts, with WisConnect's existing gray shell and near-white panel.

Follow-up preference: keep this layout but use WisConnect's original Inter weights (500 navigation, 600 headings), gray shell, near-white panel and lavender active states. The reference's neutral selection and lighter type have been superseded by that explicit request.

Mitchell subsequently approved applying the reference. The local dashboard now uses the measured 220px sidebar, 56px workspace header, 8px bordered white panel, independent desktop scrolling, 36px navigation/16px icons and regular-weight labels. Existing account popover/settings remain functional. Page titles/subtitles, flatter cards, table controls and the member invitation shortcut follow the reference hierarchy while retaining WisConnect's palette. Mobile uses the existing disclosure navigation and larger touch targets. No new backend workflows, reference account mutations or publication.


## Interaction and data-state follow-up — 2026-09-21

Authenticated Railway became accessible through Playwright. Inspected People, its bottom profile menu and Invite dialog, then Templates under normal and throttled networking. No invitations were sent and no Railway settings were changed. This follow-up supersedes the initial Playwright access limitation above. The reference was in dark mode; WisConnect retains its approved light palette.

Observed patterns:

- Account popup: 280px wide, 4px padding, 6px corners, subtle border/shadow, a tinted identity card with a 48px avatar and grouped 36px menu rows. Account/workspace settings, current workspace, resources and sign-out are separated by rules. WisConnect maps those groups to existing destinations; it does not invent extra workspaces or theme controls.
- Invite: centered 448px dialog with 24px padding, 8px corners, a 20px semibold heading, close button, 12px labels and 42px fields. Railway also exposes role selection and plan restrictions; WisConnect's backend supports Member invitations only, so its role is static. The existing approval requirement and local delivery notice remain explicit.
- Loading: neutral pulsing shapes for avatar/text/navigation and a small inline spinner during requests. The completed Templates page shows “No templates found”, a short explanation and a create action. Empty is a completed state, not the initial render of a request.

Implemented foundation:

- Shared `DataState` for initial session, Members, Invitations and unconnected section previews. Loading uses skeleton rows; successful empty responses have a next action; errors have explicit retry. Search no-match has Clear search. Preview sections remain labeled as unconnected and make no invented requests.
- Members and Invitations fetch on entry, cancel their GET on exit and fetch fresh records on return. Sending an invite refreshes invitation history only if that view is mounted. No polling or speculative prefetch/cache was added. Session focus checks avoid concurrent requests and preserve the existing workspace on temporary network failures; 401 still clears authentication. Initial session failures provide retry.
- Native modal supplies focus containment and background inertness. Email receives initial focus, Escape/backdrop/Cancel dismiss when idle, and focus returns to the trigger. Pending submission disables duplicate actions/dismissal; failure retains the email; success stays visible with a local inbox link and Done. History refresh errors cannot turn a successful send into a failed-send message.
- Profile popup uses native popover dismissal, arrow/Home/End navigation, viewport clamping and scroll on short screens. Actions reflect the signed-in role. Sign-out and profile save expose pending labels; skeleton/spinner motion respects reduced-motion preferences.
- `scripts/check-dashboard-states.js` is executable through Playwright MCP `browser_run_code_unsafe` using its absolute filename. It mocks the local API in a separate tab and checks on-demand calls, slow/error/empty states, retries, invitation send/revoke, focus/dismissal, preserved colors, reduced motion, roles and sign-out at 320/390/768/1440px. It does not send real invitations. Existing database-backed auth browser selectors were updated for the new popup and menu wording.


## Notifications follow-up — 2026-09-21

Inspected the signed-in Railway workspace notification bell and open panel through Playwright. The bell sits at the header's far right; the dropdown is 380px wide with 6px corners, a subtle border/shadow, Notifications heading, stacked event cards, scrollable content and a separated footer. The dark reference has a three-dot actions control. Inspection opened and dismissed the panel without activating notification actions.

WisConnect now follows the bell placement and dropdown geometry in its existing light palette. With no notification API in the project, the panel explicitly says the feed is not connected yet and uses an empty state. Its header has a working close control; read/archive controls and unread counts are deferred until actual records exist. Native popover provides outside/Escape dismissal and mutual exclusion with the account popup; opening focuses the heading, and Escape restores bell focus. Responsive bounds and dismissal are covered by `scripts/check-dashboard-states.js`.


## Mobile dashboard follow-up — 2026-09-21

Observed in a separate authenticated browser tab at 390×844, then checked the breakpoint at 639/640/768px. Railway hides the sidebar below 640px. Its header is 56px high with workspace identity, bell and 24px avatar. The workspace begins at x=8/y=56 with 8px corners and a one-pixel perimeter. Mobile content uses natural page scrolling with 80px reserved below it.

A centered floating dock sits 16px above the bottom: 56px high, 16px corners, 18px icons and 10px labels. Four main destinations and a separated More action replace the sidebar. More opens a 220px menu above the dock (4px padding, 6px corners); the profile popup remains 280px and opens below the header. Desktop sidebar returns at 640px.

WisConnect adapts this structure to its own role-aware destinations and fixed cooperative identity, keeping the existing light palette. Bottom padding and dock offset include device safe areas. Popovers fit narrow/short viewports; mobile navigation resets page scroll and focuses the new heading. Table columns remain horizontally scrollable rather than dropping member/account information. All existing request states and modal flows remain connected to their previous APIs.


## Dark mode follow-up — 2026-09-21

Railway places a sun/moon action at the profile-menu footer next to Log out. Its label names the destination theme (“Light Theme” while dark, “Dark Theme” while light). Selecting it changes the palette and dismisses the menu. Inspected both states in a temporary tab and restored its original dark selection.

Measured dark tokens: background hsl(250,24%,9%) / #13111c; raised gray hsl(248,21%,13%); border hsl(246,11%,22%) / #33323e; secondary text rgb(161,160,171); white foreground; purple accent scale. WisConnect uses those neutral relationships with its own purple accent and unchanged approved light palette. Dark mode extends to every dashboard surface, including native top-layer popovers/dialogs and mobile navigation. Profile-menu toggle is available for both roles. Preference persists locally, defaults to the system when unset and is applied before page content paints. Public pages do not inherit dashboard colors.
