# WisConnect design improvements — September 24, 2026

[Before / after screenshots](index.html) · [Original Stripe comparison](../index.html)

Mitchell approved the design-only direction with “Let’s go.” Existing content is intentionally provisional; no copy or sections were removed. Purple/gold, the hero portrait, outer rails, cooperative stack, map and stories remain.

## Changes

- Shared Georgia display headings and sans-serif body/UI. At 1440px, major public headings now measure 51.84px; at 390px, 32px. Supporting headings previously reached 78px.
- Kept the 1280px frame. Standard inner gutters are 48px desktop, 28px tablet and 20px mobile. At 1440px, the hero, enterprise, support and story headings align at x=128; at 390px, x=32. Nested cards and compact navigation retain intentional insets.
- Reduced desktop section spacing from 128px to 96px. Supporting rows are smaller. Card corners and form controls share radius tokens.
- Replaced the impact section’s navy/Arial styling with WisConnect plum, purple and the shared serif. Existing illustrative data labels remain.
- Portrait scene reduced from 200svh to 160svh desktop / 140svh mobile. Portraits finish spreading before copy fades in, and the copy is fully visible by 55% of the sticky scroll. Names remain visible. Pause/resume, native profile dialogs and reduced-motion support are preserved.
- Contact, Join, Login and Signup use a 1280px outer panel, 608px form card, shared heading scale, 52px fields and small control corners. Mobile keeps its white form-only layout.

## Verification

- GitHub Pages production build and TypeScript passed.
- Playwright Chromium: layout alignment/no horizontal overflow at 320, 390, 768, 1024, 1440 and 1920px; navigation/Escape, enterprise/story controls, Contact required fields/review/edit and encoded email draft; earlier portrait reveal without copy overlap at 390, 820 and 1440px.
- Existing `scripts/check-visionary-profiles.js`: autoplay/pause/resume, four profiles, full supplied bio, focus restoration, responsive sheets, scroll locking, backdrop/Escape, animation, reduced motion and story regression passed. Added a reusable assertion for the earlier copy reveal.
- Existing `scripts/check-impact-map.js`: continuous pulses, visible dots/routes, touch selection, leave/re-enter, reduced motion and static fallback passed.
- Existing `scripts/check-entry-flows.js`: isolated mock account responses; responsive signup, password boundaries/feedback, validation/loading/success, invite handling, service retry, login states and all Join steps passed at 320–1440px.
- Twenty before and twenty after screenshots, with desktop/mobile visual inspection. Stills use reduced motion for stable comparison; animated behavior was tested separately.

This pass did not change or test real backend/database behavior. The previous dashboard test’s stale column assertion is outside this scope. Work is local and uncommitted; nothing was published.
