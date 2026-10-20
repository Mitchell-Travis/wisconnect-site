# Homepage rails and typography

Reference: https://calendly.com/ — desktop and 393px DOM/style inspection and screenshots, 13 October 2026.

Reference observations: 48px feature headings, 60px editorial headings, 18px introductory copy on desktop; 28px feature / 36px editorial headings on phones. Desktop 1200px content composition and 24px outer surface insets; mobile 8px insets. Soft rounded tinted sections establish hierarchy.

WisConnect adaptation: one section-heading scale (48 desktop, 40 tablet, 32 phone) and one introductory-copy scale (18 desktop/tablet, 16 phone); existing Georgia and sans fonts; 1200px content rail, responsive gutters; warm sand base with inset mist/lilac sections and existing purple/gold accents. Hero remains larger, while card titles, labels, forms and dialogs retain their distinct roles. Existing mobile pillar selector and desktop stacking remain.

Validation:
- Production static export with LAN origin and TypeScript passed; git diff --check clean.
- Final viewport-audit.json: 320, 393, 768 and 1440px; unified heading/copy sizes, no horizontal overflow, no clipped headings. Mobile card and photographic invitation surfaces intentionally extend beyond the body-text gutters.
- 320px mobile navigation opens/closes; FAQ opens/closes; Communities selection displays only its card, with equal panel heights.
- Browser console warning/error capture empty. Temporary viewport override reset.

Screenshots: desktop-support.jpg, desktop-directory.jpg, phone-support-393.jpg, phone-faq-320.jpg.

Homepage styling only. No production deployment, data changes or external communications.
