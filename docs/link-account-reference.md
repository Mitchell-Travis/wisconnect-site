# Link account menu and settings reference

Inspected the user's existing signed-in Chrome tab at `https://app.link.com/home` and `https://app.link.com/settings` on 2026-09-21. The isolated Playwright browser redirects to login. Read-only DOM inspection used Chrome's existing Apple Events support; opened the profile menu and Name dialog, then closed them without saving changes. No credentials, cookies, payment details or personal field values are retained here.

## Account menu

- Profile button: 224 × 48px on a 1440px viewport; 8px/12px padding, 12px gap, 10px corners.
- Menu opens 4px above it, 224px wide, with 4px padding, white background and 14px corners.
- Shadow: inset 0 0 0 .5px black/12%, 0 5px 15px ink/12%, 0 15px 35px ink/8%, 0 50px 100px ink/8%.
- Reference actions: Settings, Support submenu, Download app, Log out; 36px rows, 20px icons, 14px Inter.
- WisConnect uses Settings, Support and Sign out, connected to existing actions. Native auto popover handles outside dismissal and Escape; arrow/Home/End navigation, focus restoration and Tab dismissal are checked. Rows stay at least 44px. Phones use an avatar button and place the menu below it. No app-download action is invented.

## Settings

- At 1440 × 812px, the sidebar is 256px and the settings column is centered at 560px wide.
- Pane heading: 60px high, 24px horizontal padding, 20px/28px semibold title.
- Profile block: 40px vertical padding, 80px round avatar, 16px gap, 24px/32px semibold name and 16px/24px gray email.
- Groups: #f5f5f5 background, 14px corners, 4px padding, 16px separation. Rows use 12px horizontal padding, 20px icons, 14px/20px text and trailing values/chevrons.
- Reference groups: personal details; apps/passkeys/login activity; notifications; support/policies. Sign-out and deletion follow beneath them.
- WisConnect reuses its actual profile name, email, role and purple avatar. Name/email remain read-only; unsupported profile/security/preferences/legal/deletion actions are disabled and disclosed. Support and sign-out work. No policy documents, settings persistence, account deletion or new authentication capabilities are implied.

Verification: mocked-auth browser checks at 320/390/768/1440px cover menu positioning, keyboard controls, Escape/focus, outside/Tab dismissal, settings layout, disabled controls, support and logout. Desktop/mobile screenshots were reviewed. Existing native auth regression was updated for the menu and grouped settings; its full database-backed run was not repeated.

Follow-up: WisConnect's Name row now opens an editor backed by authenticated `PATCH /auth/me`. Other profile fields remain unchanged. Validation, cancel, errors/retry and persistence were checked; the disposable backend authentication suite passed.
