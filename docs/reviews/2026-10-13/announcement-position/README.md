# Announcement placement and typography

Reference inspected on 13 October 2026: https://calendly.com/

- Desktop announcement: full-width strip above the navigation, 40px minimum height, centered content; Geist Medium 14px/20px.
- Phone announcement: icon at 24px left inset, text at 48px, left aligned; Geist Medium 12px/20px. Reference wraps its longer copy onto two lines.
- WisConnect retains its launch copy, lilac color, shared announcement icon, 10-second text movement and dismiss control. The animated single-line copy fits a 40px strip. Reduced motion retains the complete static message.
- Mitchell's latest instruction overrides the reference's sticky mobile announcement: the announcement must scroll away on both desktop and mobile. Only the existing navigation floats after scrolling.
- Geist Latin variable WOFF2 was copied from the installed Next.js distribution and loaded with next/font/local, scoped to the announcement. License saved in app/fonts/Geist-OFL.txt from https://raw.githubusercontent.com/vercel/geist-font/main/OFL.txt. No visitor requests to an external font provider.

Validation: production LAN build/TypeScript and git diff --check passed. Verified 1440px desktop and 393/320px phones, announcement scroll-away on both layouts, mobile menu, dismissal/focus restoration, no horizontal overflow or console warnings/errors. Preview server kept running; viewport reset. Screenshots: desktop.png, mobile.png, mobile-scrolled.png.
