# Directory mobile gallery — 3 October 2026

Mitchell requested the mobile presentation of [Mammoth's Our Brands section](https://www.mammothbrands.com/) for WisConnect's business directory.

## Live reference

Inspected the live reference in the in-app browser at a 390 × 844 viewport. Its mobile gallery uses two columns of compact landscape tiles, approximately 175px wide, 30vw high, with 5px gaps and 8px corner radii. Name marks sit in the center on solid backgrounds; the final odd tile is centered. Tapping Harry's opens a full-screen brand-colored detail with a close control, centered mark, image and story.

## Applied

- Below 761px, tiles use the reference's 30vw height, 5px gaps, centered marks and centered odd final tile, fitted inside WisConnect's existing rails.
- Hide tile photography and location metadata on mobile. Keep photography, business information and animated details accessible on tap.
- Retain the approved mixed brand palette, pale lilac background and curved lines.
- Reduce mobile introduction spacing. Collapse existing search, location and sector controls under an accessible Search & filter disclosure. Results and Clear filters remain available.
- Keep desktop poster compositions and visible filters.

## Verification

- Production build passed, including TypeScript and static export.
- No horizontal overflow at 320px, 390px or 760px. All eleven tiles fit; marks fit at 760px. Phone tiles measured approximately 138 × 92px at 320 and 173 × 113px at 390 (browser scrollbar reduces CSS viewport width).
- Filtering Liberia plus River Cess returned two businesses; an unmatched search returned the empty state; Show all businesses restored all eleven.
- Mobile detail opened with image and copy fitting the viewport. Close animation and focus return checked.
- At 1440px, desktop images remain visible, full filter controls remain available, and the mobile toggle is hidden.
- `git diff --check` passed. Existing generated next-env.d.ts and unrelated untracked assets preserved.

Screenshots: [gallery](directory-mobile/gallery-390.png), [detail](directory-mobile/detail-390.png).

Mitchell approved committing and pushing this update on 3 October. Check the release commit and GitHub Actions for publication status.
