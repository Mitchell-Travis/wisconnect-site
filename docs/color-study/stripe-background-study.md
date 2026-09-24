# Background study — 2026-09-21

Study completed 2026-09-21. Mitchell subsequently approved the proposal, and it was implemented in the homepage CSS module. The observations and proposal below record the design rationale; see `WISCONNECT_CONTEXT.md` for implementation and verification details.

## Stripe observations

Source: https://stripe.com/, desktop 1440 × 900, inspected with Playwright and computed styles. This describes the live version observed, not every Stripe page or an official brand specification.

| Role | Observed treatment |
| --- | --- |
| Main content | White `#FFFFFF`: hero base, product section, enterprise/startup/platform stories, and news |
| Supporting surfaces | Pale blue-gray `#F8FAFD`: startup program cards, book feature, lower pricing/contact area |
| Borders/media fallback | Cool gray `#E5EDF5` |
| Dark chapter | Deep navy `#0D1738`: developer section; white headings and muted blue supporting text |
| Primary action | Violet `#533AFD` |
| Expressive moments | Multicolor hero artwork; gradients inside product illustrations and narrow borders; a large atmospheric gradient in the statistics section |

The statistics section observed was in its night state. Its visible gradient runs from dark blue through violet toward a bright lower focal point; its background is not simply the navy base. DOM contains additional time-of-day gradient variants. No claim that every variant was visually tested.

Interpretation: a small repeated surface palette establishes continuity. Saturated color is concentrated around artwork, actions, and selected major sections. Photographic case studies sit on white. Solid text surfaces keep content readable while color provides emphasis.

## WisConnect diagnosis

The homepage mixes inherited brand tokens, the belief card's purple/gold variants, and Clay's peach/lime accents. Current primary tokens resolve to purple `#563578`, plum `#291833`, gold `#B9955A`, mist `#F7F3F8`, and sand `#FAF8F5`; the belief panel separately uses `#4B2E83` / `#2A1B3D`. This is a consistency issue as well as a choice of colors.

The desktop visionaries section has a white base with two faint repeating elliptical line patterns. I recommend replacing those lines with one quiet surface, keeping the actual scroll composition and portraits.

## Proposed system

- White `#FFFFFF`: navigation, hero, photographic enterprises, impact/map.
- Soft lavender `#F7F3F8`: desktop visionaries and selected supporting surfaces.
- Warm ivory `#FAF8F5`: practical programs, stories, Capital card. Treat it as the pale member of the gold family.
- Deep plum `#291833`: belief/People focal card and footer. Reserve saturated purple gradients for this focal story.
- Purple `#563578`: primary actions, links, focused/selected states. Use one core purple consistently.
- Gold `#B9955A`: small rules, details, or fills with plum text. It is not suitable for small text on white (contrast about 2.8:1).
- Communities card: lavender surface with plum text, bringing it into the same palette. This would replace the borrowed lime only if the proposal is implemented; current approved colors remain intact.

Proposed sequence: white hero → lavender visionaries → plum / ivory / lavender cooperative cards → white enterprises → ivory programs → white impact → ivory stories → lavender Join → plum footer. Existing section dividers remain.

The interactive `wisconnect-backgrounds.html` is a contained background comparison using existing portraits, not a proposal to replace the site's scroll layout. It compares lavender, ivory, and a restrained lavender/gold glow. Quiet lavender is the preferred choice; the glow is the more expressive alternative.

Validation: measured foreground/background contrast; checked preview layout at desktop and phone widths and background switches. No production build required for this research-only change.
