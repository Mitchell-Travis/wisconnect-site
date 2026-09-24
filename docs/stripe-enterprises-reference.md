# Member enterprises carousel reference

Inspected https://stripe.com/ with Playwright on 2026-09-21, specifically “Build a foundation for your startup that enables faster growth.”

- Desktop reference: 332px cards, 332:448 image ratio, 16px gaps, 6px image corners, 16px/22.4px descriptions, and three complete cards with the next one partially visible. Narrow screens use a 358:373 image ratio and one full card.
- Hover expands the media horizontally by 1.036, shifts it left by 1.8%, and shifts neighboring media outward. The photo and title compensate for that scale; descriptions stay fixed. Transition: 800ms, cubic-bezier(.165,.84,.44,1).
- Arrows advance one card with a roughly one-second eased settle. Mouse dragging snaps after release; touch uses native scrolling. Home/End and left/right keys work when the row has focus. Reduced-motion navigation is immediate.
- WisConnect retains all six original sector titles, descriptions, images, membership destinations, section heading, typography, purple accents, and page rails. Buttons remain 44px for accessible targets rather than Stripe's 40px. Sector titles occupy the image overlay instead of customer logos. No Stripe assets, fonts, or source code copied; no new dependency.

Implementation: `app/page.tsx` and `app/page.module.css`. Browser regression: `node scripts/check-home.mjs` with an isolated local Chrome debugging session on port 9222.
