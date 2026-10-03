# Cooperative W scroll reveal — 3 October 2026

Release approved by Mitchell on 3 October 2026. Includes the final three-image correction and the approved business directory poster design.

Latest correction: Mitchell requested exactly three images, including the scroll sequence. The conference-room image is no longer rendered; the businesses, cooperative and community chapters retain all original copy across three scenes. The opening W and the scroll sequence use the same three photographs. Production build, TypeScript and static export passed after this correction. The browser confirmed exactly three distinct photos, three chapters and three progress markers.

## Design

Mitchell requested the oversized image-reveal idea from [Mammoth Brands](https://www.mammothbrands.com/) for “A cooperative of businesses”, with an original butterfly-like W and existing section copy over the imagery. The W occupies approximately 95% of the section width. Its three-photo opening composition expands on scroll and dissolves into three full-stage photographs with the businesses, cooperative and community copy, including the original model introduction. WisConnect lilac, plum and gold remain. Native scrolling drives the sequence in either direction; a Skip story link bypasses it.

The reference was inspected live with the browser Playwright API. Its image mask and layered photographic sequence informed this implementation; the W path and implementation are original. Header/navigation, business directory and other section dividers remain intact.

Reduced-motion preferences, viewports no taller than 500px and browsers without CSS masks use a normal vertical sequence. All text is present in the document. Decorative stock photography is labeled illustrative, not presented as actual members or premises.

## New photo sources

Mitchell requested new photographs from the existing stock source, Pexels, without reusing the site's other imagery. These three photo IDs were absent from the existing source ledgers and content. Each is saved locally at 640px and 1400px width as WebP. Total of all six files is approximately 641 KiB.

| Asset prefix | Photographer | Source |
| --- | --- | --- |
| `cooperative-model` | RDNE Stock project | [Cafe owner, 10375824](https://www.pexels.com/photo/portrait-of-smiling-female-owner-in-front-of-cafe-10375824/) |
| `cooperative-businesses` | merve emre | [Bakery, 14220308](https://www.pexels.com/photo/woman-working-in-bakery-14220308/) |
| `cooperative-community` | Victor Oluwayoju | [Market stall, 20068076](https://www.pexels.com/photo/vendor-at-the-market-stall-20068076/) |

The [Pexels license](https://www.pexels.com/license/) was checked on 3 October 2026. It permits website use and modification; the photographs do not imply endorsement and the W is a section treatment, not a trademark. Source pixels were downloaded from the linked Pexels image downloads, resized and encoded locally; CSS controls framing and the readability overlay.

## Verification

- Production compilation, TypeScript and static export passed after the three-image composition was added. The final short-height scroll-hint adjustment is CSS only.
- Live desktop (1280 × 720) and compact (614 × 510) inspection: photographs load, W fills the width, text fits and no horizontal overflow appears.
- Desktop progression and scroll reversal inspected before the final three-scene correction; new photos are distinct from the previously reused images.
- Fresh-load verification confirmed the three-photo collage fades completely before the model copy is fully visible, all scene images load, and Skip story navigates to the section endpoint.
- Dedicated phone viewport and reduced-motion emulation were not confirmed because viewport overrides did not target the working preview tab. Their responsive/fallback rules were reviewed in code; these are remaining manual checks.
- `git diff --check` passed. Next's generated `next-env.d.ts` change is outside the authored work.

The released opening screenshot is `cooperative-reveal/w-desktop.png`. Other local screenshots depict superseded iterations and are excluded from this release. The unused conference-room photo is retained locally and excluded from the release.
