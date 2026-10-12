# Mobile cooperative-story stacking

Mitchell requested Stripe's mobile scroll-stacking effect for “The work taking shape.” Local preview: `http://localhost:3000/#community-projects`.

## Reference and implementation

Re-inspected [Stripe's enterprise stories](https://stripe.com/) at 390 × 844px. Each story is sticky within the story list, with successive top offsets of 0, 32, 64 and 96px. Following cards slide over previous cards while scrolling. The list releases at its end.

WisConnect now uses the same interaction at widths up to 760px, keeping white surfaces and using 48px offsets for its larger title/badge treatment. The first card's top inset is 0 when the navigation is hidden and 88px when it is visible. Header alignment keeps badges visible in the stack. Desktop continues to use the existing accordion.

A ResizeObserver measures card heights before enabling the effect. If any complete card plus navigation/stack clearance does not fit the viewport, all stories remain in normal document flow. Reduced motion also uses normal flow. Focusing a story link with the keyboard temporarily returns the list to normal flow so covered links remain reachable. No scroll listeners, scroll trapping, new dependencies or content changes were added; the existing navigation state supplies clearance through CSS.

## Verification

- Forward/reverse scroll geometry and screenshots checked at 390 × 844. Verified navigation inset changes from 0 to 88px on reversal.
- Stacking enabled at 320 × 720 and 760 × 1024; normal-flow fallback at 390 × 667. No horizontal page overflow.
- Reduced-motion fallback, keyboard-focus fallback and desktop accordion switching passed.
- All three mobile “Read the story” links reached their dedicated articles while stacking was enabled. No runtime errors observed.
- TypeScript, production build/static export and whitespace checks passed.

Screenshots: [scrolling down](mobile-story-stack/scroll-down.png), [scrolling up](mobile-story-stack/scroll-up.png).

Local only; not pushed. The pending FAQ redesign remains separate work in the same checkout.
