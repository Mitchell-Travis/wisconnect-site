# Dashboard shell reference — 13 October 2026

Requested reference: https://www.kolejain.com/ . Inspected in Chrome, including the live DOM and computed colors.

| Surface | Reference and applied light value |
| --- | --- |
| Sidebar / outer frame | `#f5f5f5` |
| Workspace | `#fafafa` |
| Selected navigation | `#ebebeb` |
| Neutral border token | `#e0e0e0` |

Desktop workspace corners are 16px. Locally drawn 24-unit SVG navigation icons use rounded caps/joins and 1.3-unit strokes at 22px, adapting the reference style to existing section meanings. They are not claimed as the site's original icon library. Bell and remaining Feather icons are preserved. WisConnect branding, layout, workflows and purple action buttons remain.

Verification: LAN-origin production build and its TypeScript compilation passed. Browser confirmed actual computed light colors, 16px corners, 22px/1.3px navigation symbols, 56px collapsed sidebar, section navigation, notification open/close, dark/light themes, and 320px reports/menu without horizontal overflow. Captured console warnings/errors were empty. Original light theme, expanded sidebar, Reports view and normal viewport restored. Existing local API was not restarted; it serves the rebuilt export.

Screenshots: `reference.jpg`, `desktop.jpg`, `dark.jpg`, `phone.jpg`, `phone-menu.jpg`.

No data writes, backend edits, migration, push, deployment or external communication. Home content remains the pre-rebuild implementation. “Keep my bill” remains unclarified; bell, branding and layout were all preserved.

## Approved follow-up: top collapse control and shared icons

Collapse sidebar now follows the logo in DOM and keyboard order (56px from the top at the verified desktop size). Completed all icon variants in the shared component; every dashboard consumer now imports it. Bell shape is retained, with the same 1.3-unit stroke as other icons. Existing section content and actions remain.

Production LAN build and TypeScript passed. Browser checks confirmed 59 of 59 overview SVGs use the shared component, collapse/expand remains functional, invitation-dialog icons use the shared stroke, and 320px layout has no horizontal overflow. Captured console contained no warnings/errors. Current user dark theme and Overview preserved; normal viewport restored. No invitation submitted or records edited.

Evidence: `desktop-unified-icons.jpg`, `phone-unified-icons.jpg`.
