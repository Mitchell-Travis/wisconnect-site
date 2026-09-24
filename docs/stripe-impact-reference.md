# Impact & proof — Stripe reference

Latest correction: Mitchell wanted the remaining blue removed. The background now uses only white and soft lavender stops (`#FFFFFF`, `#FAF8FC`, `#EEE5F3`, `#DCCFE4`); the exact Stripe pre-dawn stops below are historical. Map colors and interactions remain unchanged.

Follow-up: Mitchell selected the pre-dawn palette. Measured the live Pre-dawn option: `radial-gradient(103.24% 102.63% at 50% 102.63%, #486FFD 0%, #7F81F3 9.84%, #C489FF 20.83%, #DAC0FF 34.13%, #EADCFF 44.86%, #F9F6FF 58.59%, #F8FAFD 100%)`, dark `#061B31` heading/active text, and `#8A35DF` indicator. This replaces the night background described below. Secondary text is darkened to `#5B657C` for contrast. Map colors and effects remain as implemented.

Reference: https://stripe.com/, “The backbone of global commerce,” inspected with Playwright on 2026-09-21 at 1440 × 900 and a narrow viewport.

Observed desktop night styling: navy `#0D1738` base, white 56px/1.03 sans-serif heading, four statistics with 48px values and 16px descriptions, 40px vertical cell padding, and thin horizontal rules. Night background is a radial gradient from navy through violet to a bright lower focal point. Hover moves the rule highlight with a 400ms cubic-bezier(.4,0,.2,1) transition; clicking selects the statistic and changes the underlying visualization. Stripe uses a Three.js globe/data graphic and a time-of-day selector.

WisConnect implementation retains its existing `impact-world.svg`, geographic anchors, country controls, text, and explicitly illustrative figures. The night gradient and statistic treatment follow the reference. Native statistic buttons support pointer, touch, and keyboard input; hover previews the moving highlight and click selects a value. Selection retraces the existing map routes and briefly pulses its markers. These effects are decorative, not additional geographic data or metric-specific claims. Existing country selection still determines highlighted routes.

No time-of-day/light-mode selector, Stripe graphic, proprietary font, or new dependency. Arial is the available sans-serif substitute. Inactive statistic text is lighter than the reference for contrast. The caption has a pale backing for readability over the bright gradient. Phones retain four statistics in a two-by-two grid. Route and marker effects finish within 1.8 seconds; reduced motion renders their final state without movement and disables the moving rule transition.

Verification uses `scripts/check-home.mjs`, plus Playwright hover/selection/reduced-motion and desktop/mobile visual checks. The native Chrome key helper now sends Enter's carriage-return text, matching a real keyboard activation.
