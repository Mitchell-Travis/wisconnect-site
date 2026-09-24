# Stories from the network

Inspected https://stripe.com/ with Playwright on 2026-09-21, specifically “What’s happening / See the latest from Stripe.” Desktop reference uses a canvas-based expanding image gallery, separate changing copy below, and previous/next controls above. At 1440px: 1232px gallery width, 460px height, approximately 16px gaps and 6px corners. Mobile switches to horizontal image cards.

WisConnect adaptation uses CSS flex expansion rather than a canvas: four real buttons, a shared description and native reader dialog. Desktop cards expand on selection; phones use native horizontal scroll snapping. Arrows, keyboard navigation, swipe, resizing, focus restoration and reduced motion are supported. No autoplay or added dependency. Ivory surface, purple controls, plum image shading and gold category labels retain the brand palette.

Four original editorial previews explore enterprise, cooperative ownership, knowledge exchange and community connections. They are expressly not verified member reports. No invented member names, event dates, metrics or achieved outcomes. Replace the `networkStories` entries in `app/page.tsx` as actual stories become available.

## Stock photographs

Downloaded from Pexels and optimized locally using the existing Sharp installation. Local `public/assets/story-{theme}-{640,1400}.webp` files; no runtime external image dependency. Photographer credits and source links are included in each reader. Pexels license: https://www.pexels.com/license/ (checked 2026-09-21).

- Enterprise: Joaquin Reyes Ramos — https://www.pexels.com/photo/african-woman-sewing-fabric-with-vintage-machine-37409120/
- Ownership: Christina Morillo — https://www.pexels.com/photo/photo-of-women-listening-during-discussion-1181624/
- Skills: Christina Morillo — https://www.pexels.com/photo/photography-of-women-talking-to-each-other-1181717/
- Community: Kold Shots — https://www.pexels.com/photo/vibrant-african-market-scene-with-women-33489791/

Images are illustrative stock photography, not identified as WisConnect members or endorsements. The page and readers make this distinction visible.
