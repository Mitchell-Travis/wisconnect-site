# FAQ visual redesign

Mitchell approved three visual question cards and an accordion, asking for a strong visual with a good background. Local preview: `http://localhost:3000/#faq`. This change is not pushed.

## Design and behavior

- Mitchell subsequently requested a plain white background. The FAQ now uses `#fff`, with the textile image and gradient removed. Existing outer rails remain. The saved screenshots show the earlier background treatment.
- Three photographic buttons introduce the people, cooperative ownership and first steps. Each opens the corresponding answer and moves keyboard focus to its summary.
- Six native details elements retain every original answer exactly. A shared `name` groups them into an exclusive accordion. Plus/minus indicators reflect the open state. Links still go to `/join` and `/contact`.
- `#languages` remains the French availability anchor. Direct question hashes open the corresponding answer.
- Desktop uses three image cards and a two-column answer/contact area. Phones use horizontal scroll snapping with a visible next-card edge and swipe hint; keyboard users can tab to all cards. Answers stack below.
- Reduced motion disables image zoom/transition and uses instant answer scrolling. No dependencies added.

References inspected: [Airbnb Hosting — Your questions, answered](https://www.airbnb.com/host/homes) for visual question cards and a support action; [Webflow Pricing — Frequently asked questions](https://webflow.com/pricing) for spacious question rows and plus controls.

## Image provenance

Reuses existing local responsive WebPs; no downloads or generated images. The visible credit identifies imagery as illustrative. Source records also remain in `app/page.tsx`'s editorial story data.

- `story-enterprise-{640,1400}.webp`: [Joaquin Reyes Ramos / Pexels](https://www.pexels.com/photo/african-woman-sewing-fabric-with-vintage-machine-37409120/).
- `story-ownership-{640,1400}.webp`: [Christina Morillo / Pexels](https://www.pexels.com/photo/photo-of-women-listening-during-discussion-1181624/).
- `story-skills-{640,1400}.webp`: [Christina Morillo / Pexels](https://www.pexels.com/photo/photography-of-women-talking-to-each-other-1181717/).

## Verification

- Production build/static export and TypeScript passed; all 14 routes remain.
- Chromium checks at 1440/1024/760/390/320px: no page overflow, all three images decoded, six answers present.
- All cards activate the matching answer at desktop and 390/320px. Exactly one answer opens; focus transfers to the matching summary. Enter/Space toggles summaries. Keyboard Enter also activates all three cards.
- Final card-title fitting checked at 1440/390/320px. `#languages` opens the French answer; membership and Contact links reach their pages.
- Automated comparison against the previous commit confirms all six answers, including the French paragraph, are unchanged. No runtime errors observed.
- Screenshots: [desktop](faq/desktop.png), [phone](faq/mobile.png), [open answer at 320px](faq/answer-mobile.png).
