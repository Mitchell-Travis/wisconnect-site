# Contact page reference — 2026-09-21

Reference: https://stripe.com/contact/sales, inspected live using Playwright at 1440×900 and 390×844. No form submission was made.

Mitchell requested starting with the rails and WisConnect logo, with Stripe’s form styling as the direction for subsequent work. The first pass created the white page frame and linked logo. The follow-up adds an interactive three-step form preview using the measurements below; sending remains disabled and visibly disclosed.

## Page frame

- Desktop header: 76px high, horizontal bottom rule. Reference body rails at x=87 and x=1353 for a 1266px central frame at 1440px. Logo starts approximately 16px inside the rail.
- Mobile header: 66px high. WisConnect retains visible 12px phone / 18px tablet rail insets consistent with the wider project.
- Contact rails reuse the global main pseudo-elements, scoped to the contact frame. White surface, existing WisConnect logo asset and purple focus outline. Logo links home.

## Form styling implemented in the preview

- Centered white card: maximum width 608px, 6px corners, desktop padding 32px 40px 40px. First screen is approximately 427px tall.
- Soft reference shadow: `0 20px 80px -16px rgba(0,55,112,.14), 0 10px 60px -16px rgba(0,59,137,.06)`; adapt the tint to WisConnect’s purple palette.
- Three understated progress steps, thin bottom lines and an active purple indicator.
- Desktop labels sit left of controls (roughly 192px / 336px in a 528px content area). Controls 48px tall; 16px field gaps; 40px between heading, fields and action row.
- Heading about 26px desktop / 20px phone, 14px labels, 16px inputs, 18px supporting copy. Use the existing system sans-serif rather than Stripe’s proprietary font.
- Mobile card: viewport minus 32px, 28px internal padding, labels above controls; first screen at y=146 (80px below its 66px header).
- Continue action at bottom right, 48px high, 4px corners. Reference primary purple is #533AFD; use WisConnect’s existing purple when implementing.

The initial Stripe screen asks for email and country/region. WisConnect’s preview now includes email/country, name/optional organization, and inquiry topic/message. Delivery remains unconnected.
