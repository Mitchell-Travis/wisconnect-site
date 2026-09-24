# Navigation reference — 2026-09-21

Inspected https://stripe.com/ using Playwright at 1440×900 and 390×844. Desktop header is 76px tall, with a 64px navigation surface starting 6px from the top. At 1440px its dropdown runs from x=89 to x=1351 (1262px wide), beginning at y=71. Links use 14px type, roughly 24px between main navigation items, 32px dropdown column insets, subtle dividing rules, a 6px outer radius and a soft shadow. The background receives a 5px blur. Dropdown heights vary with content (Resources ~289px, Developers ~319px, Products ~697px); they are not a single fixed height.

On phones the header is 66px tall. The menu fills the remaining viewport with 16px outer insets and approximately 52px top-level rows. Selecting a category replaces that list with its links and a Back control. Bottom actions remain visible.

WisConnect retains its own logo, white header, purple/plum/lavender palette, four existing navigation labels, language picker and Join destination. The dropdown uses the measured desktop width/offset and column treatment, with height determined by WisConnect content. Each category contains three groups of relevant links and a featured panel using existing licensed stock photos. Business category anchors point to their real enterprise cards. No new account, marketplace or unsupported product destinations.

Interaction uses existing React/CSS, no added dependency: click and desktop hover opening, 180ms pointer-leave grace period, arrow-key navigation, Escape and focus restoration, outside dismissal, full-screen phone submenus with Back, scroll lock and focus containment, and reduced-motion support. Existing language menu behavior is preserved. Touch targets remain at least 44px (Stripe's desktop reference buttons are 40px).
