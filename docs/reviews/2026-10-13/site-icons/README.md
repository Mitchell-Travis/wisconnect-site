# Shared public-site icons — 13 October 2026

Mitchell requested the approved rounded dashboard icons throughout the entire site, including the homepage.

`app/site-icon.tsx` is now the shared source. `app/dashboard/workspace-icon.tsx` re-exports it so existing dashboard consumers continue to use the same shapes. Public pages now use the shared component for arrows, menu/close, chevrons, search, location, profile rotation, checkmarks, sparkle bullets and plus/minus states. The component uses a 24-unit viewBox, 1.3-unit rounded strokes, `currentColor`, hidden decorative semantics and configurable size/className. Existing button/link accessible names remain intact.

Migrated homepage and public content components, Contact, Join, login and recovery, signup feedback, newsletter, story pages and shared entry headers. Logo/brand drawings, maps and illustrations remain artwork rather than interface icons. No public palette or content changes.

Verification:

- LAN-origin production export and TypeScript compilation passed. An initial reserved filename conflict (`app/icon.tsx`) was corrected to `app/site-icon.tsx`; no new metadata route remains.
- Actual homepage: 119 shared SVGs, all computed 1.3px strokes. The seven remaining SVGs are four support illustrations, directory threads, cooperative artwork and the connection map.
- FAQ open/close icon state and business directory 4→11→4 expansion checked.
- 320px homepage/menu, Contact, Join and Roseland story: no horizontal overflow. Mobile navigation changes menu→close and back. Contact topic select remains usable with its shared chevron; no form submitted.
- Dashboard: 59 shared SVGs, no unshared SVGs, no horizontal overflow.
- Captured browser warnings/errors empty; viewport override reset.

Screenshots: `homepage.jpg`, `homepage-phone.jpg`, `faq.jpg`, `contact-phone.jpg`.

No deployment, backend edits, migrations, external messages or real record writes.
