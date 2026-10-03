# Business portfolio — October 2, 2026

Mitchell approved adapting Mammoth Brands' Our Brands interaction to WisConnect, using comparable tile sizes inside the existing rails and a centered section. This supersedes the preceding list layout. The restored homepage navigation and textile placement are unchanged.

## Reference

Inspected https://www.mammothbrands.com/ on desktop (1440px) and phone (390px). Two columns, a centered odd tile, logo-to-photo hover, a full-screen detail in the selected brand color, side-by-side desktop detail and stacked mobile detail. Observed opening/closing and the image moving between the tile and detail presentation. Reference overlay uses a 300ms fade; hover imagery uses a 500ms fade with 200ms delay.

## Implementation

- Centered heading, introduction and browsing controls within the existing shell. Two tile columns on desktop and phones; tile height is 30vw capped at 600px, with narrower width to respect WisConnect's rails. A final odd business is centered.
- Original business symbols/name marks in plum, lilac, gold/sand and rose. Known owners' existing portraits reveal on hover and appear in the detail. The other businesses use original vector artwork. No reference imagery or fabricated business photographs were added; marks remain directory concepts rather than verified official logos.
- Native full-screen dialog with the selected tile's palette, full supplied description, category/location, known person/role, Contact action and biography action where available. Photos are contained to preserve full portraits.
- Opening combines a 300ms color-surface fade, 650ms image translation/scale from the selected tile and delayed detail reveal. Closing fades text, moves the image back toward the tile and fades the surface. Uses Web Animations; reduced-motion preference skips those animations and hover fades.
- Native dialog focus containment, Escape cancellation, explicit close, focus return, scroll locking and cleanup. Biography handoff closes business details before opening the existing profile.
- Existing location/sector filters, normalized search, empty reset and repeated filtered anchors are retained. All eleven source records remain unchanged.

## Validation

Production build/typecheck/static export and whitespace checks passed. Browser checks covered 1440, 390 and 320px, full-screen details, no horizontal overflow, original portraits, owner biography handoff, focus return and scroll unlock, combined Chicago + Food (three), Tracy search (Momentum), empty reset, and repeated filtered Bunnyland anchors. Reduced-motion and Escape handling were code-reviewed; no automated media-preference emulation is claimed.

Screenshots are in `business-portfolio/`. Local preview only; no commit, push or deployment. The original source documents and other unrelated working-tree files remain untouched.
