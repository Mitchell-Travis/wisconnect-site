# How to get involved — photographic invitation

Mitchell requested a strong visual and approved a large collaboration photograph, headline overlay, plum steps panel and slim textile accent. This replaces only the homepage's get-involved section. Local preview: `http://localhost:3000/#get-involved`.

## Design

- Photo occupies 60% of the desktop composition, contained within the existing rails. Oversized serif type and a gold italic final line establish the invitation; the photograph fades into a dark background underneath the heading.
- The plum panel presents three numbered steps and a full-width cream “Introduce yourself” button. It retains the five-question introduction, manual email handoff, and membership clarification.
- Below 901px, the image and steps stack. Phone images retain their natural proportions so all three faces remain visible. No new animation or dependency.
- A 12px strip reuses the existing textile asset. Navigation textile is unchanged.

## References and image

Reviewed [Stripe Atlas — How it works](https://stripe.com/atlas) for numbered steps and [charity: water — Starting a fundraiser is easy](https://www.charitywater.org/fundraise) for a welcoming visual process. The implemented photo-led composition follows Mitchell's subsequent preference for a stronger visual.

Reuses `purpose-connection-{640,1400}.webp`: [Three Women Looking At The Computer, PICHA Stock / Pexels](https://www.pexels.com/photo/three-women-looking-at-the-computer-3894378/). Source and license history: `docs/purpose-design-2026-09-29.md`. Visible illustrative-photo credit links the source; people are not identified as WisConnect members. No new image download.

## Verification

- TypeScript and production build/static export passed.
- Chromium checks at 1440, 1024, 900, 760, 390 and 320px: three steps present, image decodes, no horizontal overflow; final crop also reviewed at 1440/1024/900/390/320px.
- Button opens `/join/`; keyboard Tab/Shift+Tab shows a gold focus outline and Enter reaches the introduction page. Button height is 58px. No page errors observed.
- Final screenshots: [desktop](get-involved/desktop.png), [phone](get-involved/mobile.png).

Not pushed or deployed.
