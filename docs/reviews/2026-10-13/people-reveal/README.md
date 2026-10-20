# Cooperative member reveal

Local verification, 13 October 2026.

Four portraits spread from a central stack on a pinned scroll stage. Each opens the existing corresponding business details. Center CTA removed; copy explains selecting a portrait. Reduced motion and short viewports render a static grid; keyboard focus reveals all portraits. Scroll anchoring is disabled within the animated section to prevent page jumps.

Reference: https://webflow-to-wonder.lovable.app/ — Simplify Your Invoicing Workflow.
Background asset explicitly requested by Mitchell: https://webflow-to-wonder.lovable.app/assets/cta-bg-B9a_gErW.png, saved as public/assets/member-stories-threads.png, shown at 30% opacity over WisConnect’s lilac glow.

Verified:
- Production build and TypeScript passed; git diff --check passed.
- Desktop 1440×900; mobile 320×740 and 393×852; no horizontal overflow observed.
- All four correct business dialogs; keyboard activation and Escape; closing restores portrait focus and scroll position.
- Scroll reveal reverses; 844×390 static layout enabled. Reduced-motion branch inspected, OS preference unchanged.
- No captured console warnings/errors.
- Final desktop.png and mobile.png show the revised section.

Preview used the public catalog snapshot at http://127.0.0.1:3001/. LAN API preview restart was blocked by automatic approval review; no backend exposure or data changes were made. Not published.
