# Repeated-image audit — 13 October 2026

Audit only; no website images changed. Checked current source, exported routes, rendered homepage, responsive asset families and image similarity across differently named files. The unpublished image-motion removal does not change these image assignments. Counts below refer to distinct content placements, not responsive sizes, hidden fallback markup or the same image requested twice by a browser.

## Reuse across different content

| Image / local asset family | Every active placement | Recorded original source |
| --- | --- | --- |
| Three women at a laptop — `purpose-connection-{640,1400}.webp` | Homepage: Purpose → Our mission; homepage: How to get involved; `/contact/` side photograph (hidden on smaller screens). **3 placements.** | [PICHA Stock / Pexels 3894378](https://www.pexels.com/photo/three-women-looking-at-the-computer-3894378/). |
| Four women talking around a coffee table — `purpose-community-{640,1400}.webp` | Homepage: Purpose → Our vision; homepage: The Wisdom Connection Initiative project panel; `/stories/wisdom-connection-initiative/` article image; `/join/` welcome image. **4 placements.** | [PICHA Stock / Pexels 3894375](https://www.pexels.com/photo/women-sitting-on-a-couch-3894375/). |
| Professional desk — `business-professional.webp` | Business directory: CZL P.C., WisInSup Inc., ZE’AD Advisors and Consultants; each business's details popup also repeats its tile image. **3 distinct businesses / 6 tile-and-detail placements.** | AI-generated for this project, 2 October; [generation provenance and prompts](../2026-10-02/business-portfolio-imagery.md). No external stock-photo source or verified business premises. |
| Tropical crop fields — `business-agriculture.webp` | River Cess Agriculture directory tile and details popup; homepage: Enterprise rooted in place project panel; `/stories/enterprise-rooted-in-place/` article image. **4 placements.** | AI-generated for this project, 2 October; [generation provenance and prompts](../2026-10-02/business-portfolio-imagery.md). Not a verified project-site photograph. |
| Children with blocks — `sector-day-care-{640,1000}.webp` | Bunnyland directory tile and details popup; Chicago business sectors → Day care. **3 placements.** | [Pexels 5471942](https://www.pexels.com/photo/cute-little-black-girls-playing-with-toys-on-floor-5471942/). |
| Commercial kitchen — `sector-shared-kitchen-{640,1000}.webp` | Exquisite Kitchen directory tile and details popup; Chicago business sectors → Shared kitchens. **3 placements.** | [Pexels 6375553](https://www.pexels.com/photo/a-stainless-table-in-the-kitchen-6375553/). |
| Orange juice — `sector-juice-bar-{640,1000}.webp` | Jennima’s Juice directory tile and details popup; Chicago business sectors → Juice bars. **3 placements.** | [Pexels 6529792](https://www.pexels.com/photo/glasses-of-fresh-orange-juice-6529792/). |
| Screen-printing process — `sector-screen-printing-{640,1000}.webp` | BDavis Designs directory tile and details popup; Chicago business sectors → Screen printing. **3 placements.** | [Pexels 34117503](https://www.pexels.com/photo/artisan-screen-printing-process-in-action-34117503/). |
| Nikki Bravo — `nikki-studio-{480,800}.webp` | Meet the visionaries card; full profile popup; Member stories → More than a place for coffee. **3 placements.** | Client-supplied headshot, studio background edited to powder blue using image generation. Recorded working master: `nikki-studio-source.png`. [Portrait provenance](../../team-profiles-2026-09-29.md). |
| Tiffany Williams — `tiffany-studio-{480,800}.webp` | Meet the visionaries card; full profile popup; Member stories → Room for another chef to grow. **3 placements.** | Client-supplied headshot, studio background edited to terracotta using image generation. Recorded working master: `tiffany-studio-source.png`. [Portrait provenance](../../team-profiles-2026-09-29.md). |
| Kailyn Harrington — `kailyn-studio-{480,800}.webp` | Meet the visionaries card; full profile popup; Member stories → A family legacy. A next chapter. **3 placements.** | Sikola's 30 September email attachment `IMG_4869.jpeg`; resized/encoded without generative retouching. [Source record](../2026-10-02/content-structure.md). |

Pexels links above were checked during this audit. Responsive suffixes are alternative resolutions of the same picture. Story panels and non-preview directory tiles may require expanding their controls to see them.

## Repeats that connect a preview to its detail

- **All nine visionary portraits** appear in their card and full profile popup. Besides Nikki, Tiffany and Kailyn above: Chipo (`chipo-studio-*`), Elizabeth (`elizabeth-carter-studio-*`), Priscilla (`priscilla-studio-*`), Ade Wede (`ade-wede-studio-*`), Brandi (`brandi-studio-*`) and Rahel (`rahel-studio-*`). The latter six each have two placements. Biography buttons elsewhere open the same popup, not an additional portrait instance.
- **Portrait provenance:** the continuity record identifies Chipo, Priscilla and Ade Wede as supplied portraits with studio-background edits. Elizabeth's supplied mauve portrait was used without a generated background edit; Brandi's supplied headshot received an ivory studio-background edit. See [team provenance](../../team-profiles-2026-09-29.md) and [master context](../../../WISCONNECT_CONTEXT.md). Rahel comes from supplied `4G3A1561.jpg`, Drive file ID `10B7qn6TfdS2qynf-Wd05x0Jr9S7QI-mn`, resized to WebP without generating a replacement. Original photographer credits are not recorded for these supplied portraits; do not infer them.
- **All eleven directory tiles** reuse their image in the corresponding business-details popup. In addition to the eight directory businesses covered above, Momentum Coffee uses `business-coffee.webp`, Exquisite Catering & Events uses `business-catering.webp`, and River Cess Mining uses `business-mining.webp`. All three are project-generated conceptual images, with [prompts and provenance](../2026-10-02/business-portfolio-imagery.md).
- **Roseland Theatre** uses `roseland-theatre-{640,1240}.webp` in its homepage project panel and `/stories/roseland-theatre/` article. Source: Patrick L. Pyszka / © City of Chicago, migrated from the original WisConnect site. The [source record and original image URL](../2026-10-12/roseland-story.md) document the exact file and retained embedded credit.

## W sequence and repeated branding

The W opening composition deliberately reuses its same three photographs in the full-screen chapters. A static fallback also exists in the DOM; it is an alternative rendering, not another live section. This reuse was explicitly requested in the [3 October design record](../2026-10-03/cooperative-reveal.md).

| W image family | Original source |
| --- | --- |
| `cooperative-model-*` — cafe owner | [RDNE Stock project / Pexels 10375824](https://www.pexels.com/photo/portrait-of-smiling-female-owner-in-front-of-cafe-10375824/) |
| `cooperative-businesses-*` — bakery worker | [merve emre / Pexels 14220308](https://www.pexels.com/photo/woman-working-in-bakery-14220308/) |
| `cooperative-community-*` — market vendor | [Victor Oluwayoju / Pexels 20068076](https://www.pexels.com/photo/vendor-at-the-market-stall-20068076/) |

- **Purple/gold textile:** `Royal Purple and Gold Ornamental Textile.png`, supplied existing artwork, appears in the narrow navigation/hero strip and beneath How to get involved. No external creator/source URL is recorded.
- **Header wordmark:** `logo-nav.webp` is a resized derivative of `logo-horizontal.webp`. Repeated in the homepage and shared headers on Contact, Join, Login, Signup, Newsletter, Terms and the three story pages; local Reset Password also uses it. `logo-horizontal.webp` appears in workspace/admin shells and desktop/mobile navigation variants. These are existing brand assets, not stock imagery.
- **Approved original logo:** `wisconnect-logo-approved.png` is reused in the homepage footer and site favicon. Source: Elizabeth's supplied original logo, recorded in [master context](../../../WISCONNECT_CONTEXT.md).

## Items excluded from active duplicate counts

- Current FAQ has no photographs. Removed FAQ photo cards are not active duplicates.
- Four menu feature images (`story-community`, `story-enterprise`, `story-skills`, `story-ownership`) each appear in one active desktop menu. The older stories gallery and its modal reuse those assets only in disabled code (`showUnfinishedSections = false`). The inactive Updates menu is also excluded.
- The gold artwork's original upload `270CE723-6F72-4DDE-8E8C-F96F31450A53.PNG` is identical to `next-step-gold-ribbon.png`, but only the latter is displayed, once.
- `member-food.jpg` and the `sector-coffee-shop-*` files depict the same photograph; only the sector version is currently rendered. Likewise `cooperative-meeting.jpg` and `member-consulting.jpg` are identical stored assets, not two active page placements.
- The hero portrait, orange-blazer portrait, capital/shop image and communities/market image have no separate repeated active placements found in the audited code. Different filenames and resolution variants were checked for near-identical image content.

## Implementation locations for the replacement pass

- `app/page.tsx`: mission/vision, involvement, sector cards, portrait data and full-profile image, menu features, textile and footer.
- `app/contact/page.tsx`, `app/join/join-visual.tsx`: Contact and Join images.
- `app/business-directory.tsx`: one image mapping supplies each tile and its details popup.
- `app/cooperative-stories.ts`: shared project image mappings used by homepage panels and full articles.
- `app/wisconnect-content.tsx`: three member-story portraits.
- `app/visionary-card.tsx`: shared portrait-card rendering.
- `app/cooperative-overview.tsx`: W scene/composition/fallback image reuse.

Suggested replacement priority: the two group photographs, the desk image shared by three unrelated businesses, and agriculture repeated across directory/project content. Then choose whether sector cards or directory cards should receive distinct photography. Keep identifying portraits consistent unless a different authentic image is supplied for a member story.
