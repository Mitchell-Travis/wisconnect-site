# Homepage pacing and membership actions — 8 October 2026

Mitchell requested improvements after the homepage review and created a goal to shorten the cooperative scroll sequence, tighten spacing and clarify membership actions. This pass preserves the existing visual identity, content, order, navigation behavior and unfinished-section flag. Mitchell approved the refinement and requested committing and pushing it on 12 October 2026. Check the release commit and GitHub Actions for publication status.

## Changes

- W track: 520 → 380svh on desktop; 540 → 400svh on phones. Same three chapters, photographs, transition progress points, skip destination and fallback behavior.
- Homepage-scoped section spacing: 96 → 80px on desktop, 80 → 64px on tablets and 64 → 56px on small phones. Content gaps are 40/32/28px respectively. Global layout tokens and entry pages are unchanged.
- Cooperative cards: smaller internal/outer gaps; remove unused minimum detail height from Capital and Communities while retaining it for the switchable People panel. Keep sticky behavior, rail extension and mobile overlap/photo proportions.
- Support heading: less desktop padding and a 48px heading-to-card gap instead of 64px.
- Hero, cooperative, sector, biography and membership-step actions use “Introduce yourself”. Header uses “Membership”, distinct from the Get involved navigation menu. Hero help text explains five questions and manual email sending; the main action references it with `aria-describedby`.

## Before and after

Chromium, 900px viewport height, motion enabled. Before is the unchanged `cd8f1e0` checkout measured during this session's review. After is the local production static export. Positions are rounded CSS pixels; these are scroll-distance measurements, not conversion or performance scores.

| Width | Page height before → after | Profiles start before → after | Directory start before → after |
| --- | --- | --- | --- |
| 1440px | 22,935 → 21,243 | 8,986 → 7,645 | 11,385 → 9,972 |
| 390px | 25,894 → 24,370 | 10,206 → 8,818 | 12,240 → 10,816 |
| 320px | 27,340 → 25,802 | 10,382 → 8,995 | 12,488 → 11,064 |

The hero gains a short explanatory line; the reductions come from the scroll sequence and spacing. All fifteen visible sections remain in order. Eight profiles, eleven business entries and all three cooperative chapters remain.

## Verification

- `npm run typecheck`, `npm run build` (webpack production compilation, TypeScript and static export), and `git diff --check` passed.
- Fresh development and production rendering at 1440/390/320px: no horizontal page overflow, broken loaded images or unresolved fragment links. Production CSS produced the same layout measurements as development (1px rounding difference at 320px).
- Directory: open details, Escape, trigger focus return, Liberia filter (five results), empty search and reset (eleven results). Profiles open/close; support-card selection exposes one panel; FAQ disclosure and desktop/mobile navigation submenu/Escape checks passed.
- W checked at 1440×900, 980×900, 760×900, 390×900 and 320×667: all three chapter texts fit above the footer, active markers match, forward/reverse scrolling works. Skip link resolves. Reduced motion exposes all chapter text; 390×480 uses the static short-viewport fallback.
- Desktop rails remain visible and phone rails hidden. Source review confirms rail positions, portrait/business assets, directory styles, hidden sections and backend/Join implementation are unchanged.
- Production checks include smallest-screen header fit, preserved profile/business counts, hidden unfinished sections, cooperative detail switching and navigation from the hero to the existing Join welcome screen. No forms or emails were submitted.

Screenshots: [desktop hero](homepage-pacing/desktop-hero.png), [phone hero](homepage-pacing/phone-hero.png), [phone chapter](homepage-pacing/phone-chapter.png).

## Limits

This is a local Chromium layout/interaction check, not a new Safari/Firefox, assistive-technology or production-network performance audit. No Pages deployment was made during the October 8 review; release was authorized on October 12. Contact/account hosting, translations, client content approvals and operational dashboard work remain outside this change.
