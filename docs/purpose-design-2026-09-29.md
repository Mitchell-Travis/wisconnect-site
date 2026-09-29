# Purpose & identity — stock photography and typography refinement

## Content

Source: `public/assets/WisConnect MissionVision Statement (3).pdf`, page 1. Mission and vision remain verbatim. The PDF provides no separate values statement. The small editorial labels introduce each statement; they are not represented as supplied statements. No new impact claims or membership claims were added.

## Research and decisions

- [Girl Effect](https://girleffect.org/how-we-do-it/): inspected the live mission page. A substantial human photograph gives an abstract mission context; text has a separate readable surface.
- [SEWA Cooperative Federation](https://sewafederation.org/): inspected its live homepage. Women participating together communicate collective agency more directly than a solo portrait.
- [Daylight on Mobbin](https://mobbin.com/sites/sections/9281e9c7-703a-45bc-bc6b-f592206a38c8): inspected the About section. Its contained dark surface separates a purpose statement from surrounding content. Adapted surface contrast, not its typeface or scale.
- [Headspace on Mobbin](https://mobbin.com/sites/sections/4226ea62-9036-458a-a27c-1dfcd88cf97d): inspected and rejected for this section; it is a leadership directory, so its portrait grid is better suited to team content.

Compared individual enterprise, market, formal meeting and peer discussion photographs. Selected two photographs from the same PICHA Stock series: a close laptop collaboration for the mission's connectivity/technology, and an open group conversation for the vision's co-creation. The coherent casting, lighting and color connect the two statements. Stock imagery is illustrative and is not presented as WisConnect members or events. These design references are qualitative inspiration, not evidence of conversion performance.

## Final composition and type system

Two asymmetric columns: the wider mission panel leads with its photograph and uses a sand text surface; the vision panel leads with its statement on plum, followed by an inset group photograph. On phones the panels stack in reading order. Natural image proportions preserve faces, hands and the shared activity. No photograph has text layered over faces.

Existing `--type-section`, `--font-display`, `--font-sans`, `--radius-card`, sand/plum/purple tokens remain in use. Subheadings match the existing 28px editorial level, statements use 16px sans body text / 1.75 line height. Removed the previous custom 60px heading and oversized serif statement scale. No global typography or section-boundary changes.

## Photography and licensing

Downloaded September 29, 2026. Both by PICHA Stock:

- [Three Women Looking At The Computer](https://www.pexels.com/photo/three-women-looking-at-the-computer-3894378/), Pexels ID 3894378. Local assets `purpose-connection-{640,1400}.webp`.
- [Women Sitting On A Couch](https://www.pexels.com/photo/women-sitting-on-a-couch-3894375/), Pexels ID 3894375. Local assets `purpose-community-{640,1400}.webp`.

[Pexels license](https://www.pexels.com/license/) checked September 29, 2026: free website use and modification permitted, attribution optional, endorsement must not be implied. A visible illustrative-photography credit links both source pages. New assets are served locally, using responsive sizes, lazy loading and explicit dimensions. Sharp quality 84 WebP exports: 640px pair approximately 99 KiB total; 1400px pair approximately 371 KiB total. No dependency was added.

## Verification

Production `npm run build` passed, including TypeScript and all 11 generated pages. Browser checked the rendered statements against supplied text, loaded images, existing heading token and 16px body typography. Responsive checks at 1440, 820, 390 and 320px; no horizontal overflow. Desktop and phone screenshots inspected. `git diff --check` passed. Changes are local and unpublished.

## Mobile refinement after desktop approval

Mobile-only rules at 760px and below widen the cards 12px into each existing shell gutter. Inner copy padding becomes 20px, maintaining 16px text while reducing excessive wrapping. Both photographs lead their cards, and the vision image uses the full card width. Secondary editorial labels are hidden on phones; mission/vision headings and exact supplied statements remain. The heading wraps evenly, card spacing is 20px, and section spacing is 56px. Existing desktop rules and global typography tokens are unchanged.

At a 390px viewport, measured body-copy width increased from 263px to 295px; section height decreased from 1332px to 1234px. Browser inspection covered 320px, 390px, 760px and desktop. Images load, fit within cards, and keep their original proportions. No page overflow. Production build and TypeScript passed.
