# What WisConnect does — 3 October 2026

Mitchell selected Calendly's “Built for people whose work runs on meetings” section as the reference and clarified that the target is WisConnect's “What WisConnect does”. Inspected the [live reference](https://calendly.com/) with the browser Playwright API: centered heading/body/action above four connected rounded cards, one wider active card, expanded descriptive content, a soft gradient and illustration, with hover switching between cards.

Implemented an original interpretation in `app/what-wisconnect-does.tsx` and its CSS module. Four areas—Governance, Spaces, Growth and Connections—retain all four original full titles and descriptions. Added short summaries and concept lists derived from that copy, an existing Contact destination and four original inline SVG illustrations. Uses existing WisConnect plum, purple, mauve, lilac and gold tokens. No Calendly artwork or product claims are reused.

Desktop cards expand on mouse entry, click or keyboard focus. At 1150px and below they stack vertically and open by activation, without hover switching. Each button exposes its expanded state and controlled panel; decorative artwork is hidden from assistive technology. Motion is disabled for reduced-motion preferences. The original note about discussing available support and developing opportunities remains.

Checks: production build, TypeScript and static export; desktop four-card selection, single visible detail panel, keyboard Tab selection, original Contact link, no desktop horizontal overflow, and 390px component layout with tap selection and the longer Growth description. Phone review used a temporary same-origin iframe and component route, both removed before the final production build. Reduced-motion behavior was reviewed in CSS rather than browser-emulated. Screenshots are in `support-cards/`.

The prior directory and three-image W release is unchanged. Mitchell approved committing and pushing this design on 3 October 2026. Final production build, TypeScript, static export and whitespace checks passed. Generated files and unrelated local assets are excluded from this release.
