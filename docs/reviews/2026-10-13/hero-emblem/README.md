# Hero cooperative emblem

**Superseded:** Mitchell rejected the hero placement. The emblem and its layout rules were removed, restoring the clean portrait. The source and optimized asset remain available; the original screenshots document the rejected experiment.

User-supplied source: public/assets/7F9135FA-D9F1-444C-87DE-AE6AF2485978.PNG.

Placed as a small decorative people emblem at the lower-left edge of the hero portrait, within the existing artwork area and rails. It shares the purple/gold palette while leaving the headline and calls to action clear. Mobile has its own smaller responsive size. Decorative only: no misleading control, extra tab stop or screen-reader duplication.

Original PNG is unchanged. A 320px transparent WebP delivery copy is 21,252 bytes versus the original 1.2MB. No new animation or dependency.

Validation: production LAN build and TypeScript passed; git diff --check clean. Desktop 1440px and phone 393/320px layouts checked: image loads, fits within artwork, no horizontal overflow, no captured browser warnings/errors. Viewport restored. Local preview only.
