# Business portfolio color and imagery refinement — October 2, 2026

## Latest palette correction

Mitchell subsequently requested the existing `bg-dark` or `bg-light` image and a return to WisConnect brand colors. Used `public/assets/bg-dark.webp` with a plum overlay to retain text contrast. Tiles and expanded details now use the existing purple, plum, mauve, lilac, gold and sand tokens. The names-only treatment and business imagery below remain. This supersedes the initial saturated nine-color experiment.

Production build, TypeScript, static export and whitespace checks passed. Browser checked the background and palette at 1440px and 390px, all eleven tiles, no horizontal overflow or broken loaded images, and the mobile Momentum Coffee detail with its loaded sector image and plum/lilac palette. Screenshots: `business-portfolio/brand-background-desktop.png`, `business-portfolio/brand-background-mobile.png`, `business-portfolio/brand-coffee-mobile.png`. Local only; not pushed.

## Initial imagery refinement

Mitchell requested a darker section backdrop, brighter and more varied tile colors, business-related visuals instead of owner portraits, and removal of the symbol above each business name.

The section now uses dark plum with light typography and controls. Nine saturated tile colors cover violet, gold, blue, coral, teal, orange, plum, green and magenta. Name marks retain the business name and descriptor only. Existing rail widths, tile sizes, animations, source records, owner biography links and navigation are preserved.

## Image assets and provenance

The built-in image generation tool created five conceptual sector images, saved in the project as optimized 1200px WebP assets. Originals remain in the tool's generated-images directory. These are illustrative images, not verified photographs of the listed businesses; the detail view labels them as sector imagery.

| Subject | Saved project asset | Use |
| --- | --- | --- |
| Coffee | `public/assets/business-coffee.webp` | Momentum Coffee |
| Catering | `public/assets/business-catering.webp` | Exquisite Catering & Events |
| Professional workspace | `public/assets/business-professional.webp` | CZL, ZE’AD and WisInSup |
| Agriculture | `public/assets/business-agriculture.webp` | River Cess Agriculture |
| Mining | `public/assets/business-mining.webp` | River Cess Mining |

Existing licensed stock images supply BDavis (screen-printing process), Bunnyland (children playing), Exquisite Kitchen (commercial kitchen), and Jennima's (juice). Source and license records remain in `docs/business-sectors-2026-09-29.md`. No owner portraits are used in the directory tiles or business details; the separate existing biographies still retain their portraits.

## Exact generation prompt set

Each built-in call used this shared prompt, with the respective subject below substituted for `{subject}`:

> Create one premium wide landscape 16:9 editorial photograph-style website image for a business-directory hover and detail panel. Subject: {subject} This is conceptual sector imagery, not a depiction of any named business. Rich luminous colors, beautiful tactile detail, soft directional light, modern polished commercial photography. Fill the landscape frame, no montage, no borders, no typography, no logos, no watermark. Main subject centrally composed so it remains legible at small size.

1. Coffee: A ceramic cup of latte with beautiful leaf latte art on a deep plum cafe counter, roasted coffee beans, polished espresso machine softly out of focus, no people.
2. Catering: Elegant catered food spread: beautiful platters of roasted vegetables, small savory appetizers, fresh herbs, linen and warm golden tableware, lush editorial closeup, no people.
3. Professional: Sophisticated professional advisory desk, open blank ivory notebook, neatly arranged unmarked documents, fountain pen, brass balance scales subtly placed in the background, plum and teal accents, no people.
4. Agriculture: Lush cultivated tropical green fields at sunrise, rich soil and orderly rows of young crops, natural green leaves prominent in foreground, distant palm trees and warm sunlight, no buildings or people.
5. Mining: Macro editorial still life of natural rough mineral specimens and dark textured rock on a slate work surface, subtle golden mineral veins, geological hand lens off to side, no people.

No fallback CLI generation was used. The five optimized assets total approximately 860KB. Local preview only; no push or deployment.
