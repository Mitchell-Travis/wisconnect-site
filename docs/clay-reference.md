# Clay reference — local design preview

Stacking correction: the initial minimum-height gate was removed after it disabled the effect in a 720px-tall browser. WisConnect now stacks at widths above 760px with a sticky offset based on measured card height and viewport height. Phone and reduced-motion fallbacks remain static.

Update 2026-09-21: Playwright inspection confirmed Clay's feature cards use `position: sticky` at a shared 72px desktop offset, letting successive cards cover earlier ones. WisConnect now uses the same native scrolling principle for People, Capital, and Communities, with its own responsive offset and accessible static fallbacks. New Capital/Communities surfaces use measured Clay peach `#fff3ed` and lime `#fcfee2`; their photos and wording come from the existing WisConnect cooperative section. The lime accent is darkened from `#808000` to `#686800` for text/button contrast.

Update 2026-09-21: the animation and poster are no longer displayed. At Mitchell's request, the belief panel now shows the supplied orange-blazer portrait. The reference files remain on disk; the notes below document the earlier preview.

At Mitchell’s explicit request to use the same treatment, the cooperative-belief section uses the palette measured on https://www.clay.com/: `#f0f8ff` background, `#001433` text, `#395afa` accent, `#bedffe` pale accents, and white secondary buttons. Uses Arial, Clay’s declared fallback; their commercial Roobert font has not been copied.

`public/assets/clay-data-reference.webm` is Clay’s original animation, downloaded from https://assets.clayrun.dev/Data%2006-16%201000px.webm on 2026-09-20. The `.webp` poster is a frame of the same video. These are third-party reference assets, not original WisConnect artwork or assets with verified redistribution rights. Keep this delivery local; obtain permission or replace them before publication.

The earlier original purple sculpture assets and their generation prompt remain available, but are no longer displayed. Cooperative copy, existing destinations, keyboard controls, and page rails remain. Video pauses offscreen, in hidden tabs, on user request, and for reduced-motion preferences.
