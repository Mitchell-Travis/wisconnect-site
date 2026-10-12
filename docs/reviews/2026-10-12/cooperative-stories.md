# Cooperative project stories — 12 October 2026

Superseded reading behavior: Mitchell subsequently requested dedicated story pages and the original Roseland update/image. There are now three entries with real page links; the dialogs described below were removed. See [Roseland story and pages](roseland-story.md).

Follow-up: Mitchell requested a white section background. The section now uses `#fff`; the screenshots below show the earlier sand background.

Mitchell requested the enterprise customer-story treatment inspected on [Stripe's homepage](https://stripe.com/) for “The work taking shape.” The existing Chicago and Liberia project descriptions now appear in an accordion with large images, compact headline rows, location/stage/focus details, and reading dialogs. WisConnect typography, colors, rails, section heading and project status wording remain.

Desktop starts with Chicago expanded. Selecting a headline opens that project and closes the previous one; selecting the open headline can collapse it. At widths up to 760px both stories stack with their images and reading actions visible. Motion respects reduced-motion preferences. Dialogs use native modal behavior, Escape and close controls, scroll locking and focus return.

The reading views use existing project and affiliate information. These remain development directions, not reports of completed projects. No dates, metrics or new achievements were invented. Publishing/member-authored stories are outside this presentation change.

## Images and reference

- Chicago: existing `purpose-community-{640,1400}.webp`, PICHA Stock / Pexels. Provenance: `docs/purpose-design-2026-09-29.md`.
- Liberia: existing generated `business-agriculture.webp`. Provenance: `docs/reviews/2026-10-02/business-portfolio-imagery.md`.
- Both are visibly labeled “Illustrative imagery.” No Stripe imagery or brand assets are copied.

## Verification

- Production build, TypeScript and static export passed; whitespace check passed.
- Playwright checked desktop accordion selection by keyboard, opening both reading views, Escape/close, focus return and restored page scrolling.
- Checked stacked stories and dialogs at 760, 390 and 320px, with no page/dialog horizontal overflow; both images load.
- Checked resizing back to desktop and reduced-motion expansion. No browser runtime errors.
- Screenshots: [Desktop](cooperative-stories/1440.png), [Phone](cooperative-stories/390.png). Captures isolate the section and hide the fixed navigation overlay for review only.

Local preview only; no commit, push or deployment. Earlier local changes (cooperative W timing restoration, thinner textile, removed Places section and Ghana map removal) remain.
