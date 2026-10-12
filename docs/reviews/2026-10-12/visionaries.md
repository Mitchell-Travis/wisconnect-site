# Meet the visionaries — leadership gallery

Mitchell requested the styling of [Mammoth Brands' Leadership section](https://www.mammothbrands.com/#leadership), keeping WisConnect's existing portrait background colours. Local preview: `http://localhost:3000/#members`.

Inspected the reference at 1440px and 390px: centered serif title, closely spaced rounded portrait cards, roles above names, upper-right biography cues and rotating cards with scrollable biographies. Adapted these features using WisConnect's plum cards and mist section background. Our eight square studio images, including their individual background colours, remain unchanged. The gallery has four columns on desktop, three on tablets and two on phones.

Cards now flip to biographies. A persistent “Read full profile” button opens the existing larger dialog for comfortable reading, expertise and business connections. Original biographies and destinations are preserved. Inactive card faces are inert and hidden from assistive technology. Focus moves to Close on opening, returns to the portrait on closing, and Escape closes the flipped face. Native Tab order reaches the scrollable biography and full-profile button. Reduced motion disables rotation transitions.

Verification:

- All eight cards flip, open the correct full profile, close with Escape and restore focus to the full-profile button, then back to the portrait.
- Checked 1440, 900, 760, 390 and 320px: no horizontal page overflow; all original portraits loaded.
- Keyboard End scrolls long biographies to their final paragraph on phone and tablet sizes. Close and full-profile actions stay outside the scroll area.
- Reduced-motion transition duration is zero; keyboard Enter and Escape work.
- No runtime errors during the browser checks. TypeScript, production build/static export (14 routes) and whitespace checks passed.

Screenshots: [desktop](visionaries/desktop.png), [biography](visionaries/desktop-bio.png), [phone](visionaries/mobile-390.png), [small phone](visionaries/mobile-320.png).

Local only; not pushed. Existing pending FAQ and mobile story-stack changes remain in the checkout.

## Follow-up refinement

Mitchell requested removing the coloured card frames and lengthy front descriptions, then adding a little information beneath the names. Fronts now have original unframed portraits, left-aligned names and short role labels. The full role remains in the biography. Removed the 320/300px minimum front heights; an open phone card expands to at least 300px so its scrollable biography remains readable. Backs now use white with plum text. Increased spacing between rows to separate the lighter cards. The gallery, portrait colours and flip/full-profile interactions remain.

Repeated responsive and interaction checks and TypeScript/whitespace checks for this refinement; the production export result above applies to the preceding gallery implementation. Screenshots updated to the refined treatment.

Release check: the final refined gallery also passed production build/static export (14 routes) and TypeScript on 12 October. Mitchell approved pushing all pending FAQ, mobile story-stack and visionary changes together. Earlier local-only labels describe the review stages.
