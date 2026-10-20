# Mobile People / Capital / Communities

Reference: https://calendly.com/ — Scheduling product showcase, visually inspected at 393 × 852. Mobile uses icon selectors above one light rounded panel, copy/action above the image, and a soft gradient surround.

WisConnect adaptation: existing shared icons and photography; labeled People, Capital and Communities controls; lilac/gold surround, warm white card, purple serif headings. Single shared card footprint avoids layout changes during selection. No autoplay or scroll capture. Existing desktop stacking remains.

Checks:
- LAN-origin production export and TypeScript compilation passed; whitespace check passed.
- 393px and 320px: all three selections, loaded images, no document overflow.
- Direct taps between cards preserved scrollY and the section's top position exactly.
- Tab then Space selected Capital; Tab then Enter selected Communities. Only the selected card is visible and reachable.
- Desktop 1440px: three visible two-column cards retain computed position: sticky; no overflow.
- Existing reduced-motion CSS disables the new short opacity transition; OS preference was not modified for testing.
- Browser console capture contained no warnings or errors.

Screenshots: people-393.jpg, capital-393.jpg, communities-393.jpg, communities-320.jpg, desktop.jpg.

Changes remain local. No production publish, external messages or data mutations.
