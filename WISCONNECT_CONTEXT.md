# WisConnect master context

Last consolidated: 2026-09-20; release snapshot for the carousels and Impact & proof redesign.

## Current publication — 2026-09-20

- Mitchell explicitly requested publishing all current homepage changes to GitHub Pages. The delivery includes both carousels, smaller enterprise heading, desktop enterprise hover/focus animation, the white Impact & proof section with the country map and illustrative metrics, and removal of the standalone global-reach section.
- Release commit subject: `Publish interactive carousels and impact map`. Use `git log` for its hash and check the matching `Deploy WisConnect to GitHub Pages` Actions run for deployment status. The existing workflow builds and publishes on pushes to `main`; no deployment configuration was changed.
- Pre-push verification: the seven-width Chrome regression, enterprise hover/focus/touch/reduced-motion checks, normal production build, and GitHub Pages production build passed. Exported map, CSS, and membership URLs use `/wisconnect-site/`; the SVG and `/join/` export exist. Browser checks were run locally; live verification is a separate step after deployment.
- Impact figures are explicitly illustrative, not verified results. Country locations show a connection vision, not confirmed offices or operations. These labels must remain until verified content replaces the samples.
- The “local/uncommitted/not deployed” statements and `de36ee6` release links below are pre-publication history, not the current release status. Do not undo the approved changes based on those older notes. Recheck `git status` and the current Actions run when resuming.

## Latest local update — Impact & proof

- Mitchell requested removal of the standalone “Local roots. Global reach.” section. Its copy, orbit graphic, and duplicate region controls are removed from the homepage; Stories now follows Impact & proof directly. Keep the interactive country map, its region state/copy, and country controls inside Impact & proof. The production build and exported-HTML assertions passed for this removal. Earlier notes below about preserving the neighboring global section are historical.
- Mitchell supplied a Stripe proof-band reference, then rejected the ice-white/blue glow, sans-serif typography, and abstract wireframe globe. He approved the serif typography and interactive map, but requested another background refinement. The current version uses clean white with no warm radial glow, retaining the site's Georgia serif heading with an italic purple second line, purple serif numbers, fine horizontal rules, and four evenly spaced metric cells. Phones retain an equal-height two-by-two layout, without nested card borders. Map label halos and marker outlines match the white surface.
- A recognizable dotted world map replaces the abstract globe. `public/assets/impact-world.svg` is a local, simplified Natural Earth 1:110m land asset (public domain; source and license URLs are retained in the SVG). It uses an equirectangular projection, with Antarctica omitted. No map service, runtime geographic library, or new dependency was added.
- Gold illustrative connections draw in once on scroll using the existing Motion library; reduced-motion users get an immediate reveal. Four accessible region buttons highlight routes and update a live description. They reuse the existing global-region state and copy. The map is expressly labelled as a vision, not verified operations; its decorative SVG is hidden from assistive technology while the controls and description remain accessible.
- Mitchell requested specific country names and locations: the impact map now labels Liberia, United States (his “America”), Brazil, and Vietnam. Its approximate country anchors replace the broad regional pins, with all three connection curves originating in Liberia. Country labels are visible on phones too. The existing region keys remain internal so the neighboring global section and its content are preserved; these pins do not claim verified office locations.
- Mitchell subsequently requested temporary numbers for the design. Existing categories now show clearly labelled illustrative samples: Members 250+, Member businesses 60+, Projects & programs 12, Community outcomes 30+. The visible note says “Illustrative figures for design preview only—not verified results.” These are not verified counts or approved targets; replace them with verified data before presenting them as real results.
- Styles are scoped in `app/page.module.css`. The neighboring global-reach layout, desktop member animation, and both carousels are unchanged. Geographic outlines are prebuilt into the asset; no trigonometric rendering remains in the component.
- Seven-width native Chrome checks passed, including equal metric cells, unclipped sample values, local map loading, all region controls/route highlights, existing interactions, and no console/hydration errors. Full-section desktop/mobile screenshots were inspected. The production build and TypeScript passed. These changes remain local, uncommitted, and not deployed.

## Latest local update — mobile visionary carousel

- Mitchell requested sideways sliding for “Meet the visionaries” on mobile. At 620px and below, the three existing portraits now form a native horizontal scroll-snap row with previous/next arrows. Matching cooperative-width cards, photo heights, names, and profile dialogs are preserved.
- Arrow keys and Home/End move focus between portrait cards; reduced-motion preferences disable smooth scrolling. Boundary tracking and arrow scrolling are shared with the existing enterprise carousel, with no new dependency.
- Desktop scroll-open choreography and non-phone layouts are unchanged. Seven-width native Chrome checks passed, including mobile navigation, profile focus restoration, enterprise controls, and desktop portrait spreading. Mobile/desktop screenshots were inspected; TypeScript and the production build passed.
- Changes remain local and uncommitted; no new deployment was requested. Real-device touch and Safari/Firefox validation remain outstanding.

## Latest local update — Member enterprises carousel

- Mitchell requested desktop hover animation. At 960px and above with a fine, hover-capable pointer and no reduced-motion preference, each card's photo lifts 3px with a soft shadow, the image zooms gently, the title rises, and the membership arrow moves diagonally. Keyboard focus receives the same feedback; the existing membership link has a small press response. This is CSS-only, with no layout shifts, additional click destinations, or changes to touch scrolling. Touch devices and reduced-motion users retain static cards.
- Hover delivery verification passed: native Chrome lift/zoom/arrow/reset checks, keyboard focus, touch-pointer and reduced-motion fallbacks, the seven-width homepage regression, TypeScript, and production build. Desktop hover screenshot inspected. Still local and not deployed.
- After the break handoff, Mitchell supplied a Stripe card-row screenshot and requested that layout for Member enterprises.
- The previous dark, tab-selected spotlight is replaced locally by a light horizontal row of all six existing sector photos. Tall, equal-sized images carry sector names, with descriptions and membership links underneath. No business stories or destinations were invented: “Explore membership” links to the existing `/join` page.
- Desktop shows three full cards and a peek at the next; tablet shows two and a peek. Phones show one cooperative-width card at a time, retaining the shared mobile photo height. Native horizontal scrolling and CSS scroll snap support touch/trackpad input without a carousel dependency or autoplay.
- Mitchell requested a smaller “Built by members. Backed by the cooperative.” heading. It now uses a section-only 32–52px responsive scale and balanced wrapping; wording, other headings, and carousel cards are unchanged.
- Previous/next controls reflect the scroll boundaries and resize state. The focusable list supports Left/Right and Home/End, and respects reduced-motion preferences. Card links remain keyboard-accessible.
- Implementation is in `app/page.tsx` and `app/page.module.css`; old spotlight-specific global styles are no longer used by this section. Other sections and earlier design decisions are unchanged.
- `scripts/check-home.mjs` now checks carousel arrows, keyboard navigation, end boundaries, all six cards, membership destinations, and mobile image/card dimensions instead of the old sector tabs. Seven-width browser checks, desktop/mobile screenshot review, TypeScript, and the production build passed.
- This update and the preceding handoff are **local, uncommitted, and not deployed**. The live release is still `de36ee6`. Do not push again without Mitchell requesting publication.

## Start here — next-session handoff

### Release and working state

- Live site: https://mitchell-travis.github.io/wisconnect-site/
- Branch: `main`; deployed commit: `de36ee6bdf6e4d6f1d2a10ea9c6921ec0a20635a` — `Refine homepage and unify mobile card layouts`.
- Deployment succeeded: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/35509230005
- The published homepage, latest mobile CSS, `/join/`, and optimized images were checked successfully over HTTP. The local browser checks described below were not rerun against the live URL.
- Working tree was clean immediately after deployment. The handoff and subsequent carousel update above are local and uncommitted; they have not been pushed or redeployed. Recheck `git status` at the start of the next session.
- The earlier migration is now committed (`13e4def`), followed by the Pages asset-path fix (`01abe67`) and this design release (`de36ee6`). Older notes describing an uncommitted migration are historical, not instructions to recreate or undo it.
- The requested carousel implementation is complete locally. Wait for Mitchell’s next direction; do not launch a new redesign, backend implementation, or deployment automatically.

### Design decisions to preserve

- Keep the supplied purple-and-gold hero portrait and textile. The textile spans the entire page, crossing the outer rails, at its original thickness (34–46px desktop, 30px phone). A thinner version was tried and rejected.
- Vertical rails visually stop at the textile; they must **not** run up through the navigation. That experiment was explicitly reversed. Hero content stays comfortably inset from the rails, and its ring must not intrude into the text.
- Keep the compact header: 76px desktop, 68px tablet, 64px phone, plus a 1px border. EN/FR is next to Join us on desktop but inside the expanded mobile menu. French is honestly labelled “Coming soon,” not a working translation.
- Keep the desktop scroll-open member portraits and accessible profile dialogs. On phones, use the newly aligned image cards and visible profile actions.
- Mobile cards use the cooperative section as the reference: consistent inset widths, matching photo-card minimum heights, 8px corners, 16px gaps, and no white frame around another frame. Text-card heights match within each family; do not force arbitrary content into clipped fixed-height boxes.
- The latest cleanup also reduced mobile section spacing, turned the business spotlight into one photo-and-copy card, simplified sector tabs, hid redundant business labels and the empty story-image block on phones, and tightened service/impact/participation layouts. Desktop layouts were retained.
- Preserve the deliberate portrait mapping: Chipo = shaved-head blue portrait; Elizabeth = red blouse; Priscilla = yellow headwrap. Do not swap images based on filenames or guesswork.

### Files and verification

- `app/page.tsx`: homepage sections, navigation/language picker, sector filters, member scroll state and native profile dialog.
- `app/page.module.css`: header, hero, member cards/dialogs, desktop choreography, and phone member-card styling.
- `app/globals.css`: existing section styling; the final mobile-card rhythm block handles cooperative/business/story/participation cards and compact rows. This file has layered historical overrides—inspect the cascade before editing; avoid unrelated cleanup.
- `scripts/check-home.mjs`: dependency-free Chrome DevTools smoke check, using an isolated Chrome instance with remote debugging on port `9222`. Run `node scripts/check-home.mjs [site URL]`; default is `http://localhost:3000`. Screenshots go to `/tmp/wisconnect-*.png` and are temporary, not repository assets.
- `scripts/optimize-home-images.mjs`: produces committed WebP derivatives; original images remain untouched. No need to regenerate unless imagery changes.
- Passed: `npm run typecheck`, `npm run build`, and `GITHUB_ACTIONS=true npm run build`, plus exported Pages asset/link assertions.
- Browser checks passed at 320, 390, 620, 768, 1024, 1440, and 1920px: mobile card alignment/height/text bounds, all six sector selections on phones, menu/language dismissal, dialogs/focus/scroll locking, desktop portrait spreading/reversal, and reduced motion. Relevant desktop/mobile screenshots were reviewed.
- No Playwright: Mitchell has asked not to use it unless he explicitly requests it again. Safari, Firefox, real-device touch, and enlarged-text/zoom verification are still outstanding; do not represent the Chrome checks as all-browser coverage.
- Local development used `npm run dev` on port `3000`. Check whether it is already running before starting another server. Temporary browser sessions may not survive between sessions.
- `.github/workflows/deploy-pages.yml` builds and deploys on pushes to `main`, using Node 22. `next.config.js` exports static files and enables `/wisconnect-site` as the base path when `GITHUB_ACTIONS=true`; continue using `assetPath()` for assets. Generated `out/` and `.next/` must not be committed. Build-generated `next-env.d.ts` changes were restored before committing.

### Open product work — not automatically authorized

- `/join` prepares an email for the applicant to review/send. It does not store or submit applications to a backend. A real submission endpoint and review workflow need approved requirements.
- French translations, verified impact metrics, real stories/events, legal/privacy content, and confirmation of public organizational/geographic claims remain outstanding. Do not invent figures, testimonials, translations, or operational coverage.
- Backend/API/database foundations exist; the contracted administration dashboard and its application workflows are not implemented. Publishing this public-site update does not complete the full platform scope.
- Preserve unrelated edits, read local Next.js documentation before coding, and keep further changes focused on Mitchell’s next request. Ask before changing deployment/domain setup or expanding into new services.

## Latest delivery — hero, navigation, and people

Mitchell approved implementing the first slice of the homepage improvement proposal: hero, navigation, and member profiles.

- The hero now leads with “Build your business. Share in what grows.” The full organization name remains above it, and the existing purple-and-gold portrait is preserved.
- Mitchell clarified that the Stripe-inspired vertical rails are an outer frame: content must have visible breathing room inside them. The hero now uses a 20–56px inset from those rails, smaller type and portrait sizing, and a more compact overall height. Keep artwork and captions inside that inset. Responsive Chrome checks and desktop/mobile screenshot review passed after this adjustment.
- Mitchell reversed the rail-through-navigation experiment: the existing full-height rails render behind the navigation again, visually stopping at the textile rather than extending up through the header. Their placement, subtle color, and non-interactive behavior are unchanged.
- The hero circle is a subtle, unrotated ring contained behind the portrait. Its soft background tint belongs to the entire hero, avoiding a visibly clipped image-panel edge. Do not extend the ring into the text column. Desktop/mobile screenshots and the responsive Chrome checks passed after this refinement.
- Mitchell requested restoring the original purple-and-gold textile ribbon beneath navigation, spanning the full page width across the frame. The ribbon is intentionally full-bleed; hero text and portrait retain their inset spacing. The 14–20px experiment was rejected: restore the original 34–46px thickness (30px on mobile). The EN/FR dropdown and later textile divider remain unchanged.
- Desktop hero refinement: at 960px and above, leave 28px below the textile, cap the portrait at 560px, and slightly reduce the headline and circle. Mobile sizing remains unchanged. Desktop screenshot review and responsive Chrome checks passed.
- The people section still follows the hero. Mitchell requested restoring the scroll-open portrait composition here: on viewports at least 760px wide and 720px tall, the portraits start stacked, gradually fan outward, and reveal centered copy in a sticky stage. Subtle background rings restore the earlier visual treatment. Phones, short windows, reduced-motion preferences, and pre-hydration rendering use the compact/static cards.
- Keyboard focus immediately opens the portrait arrangement, and it stays open while a profile dialog is active. Names and profile actions remain on the cards. Existing dialogs, image mappings, and optimized images are preserved. Native Chrome checks verify scroll movement/reversal, unobstructed copy, profile interaction/focus, and the reduced-motion fallback; desktop/tablet screenshots were reviewed.
- The original member-to-portrait mapping, biographies, and expertise remain unchanged.
- On phones (620px and below), “How the cooperative works” no longer puts its photos inside a second white frame: the editorial wrapper has no padding, background, corner radius, or shadow. Individual photos/captions, their spacing, and desktop/tablet styling remain intact.
- Latest mobile cleanup (620px and below): member, cooperative, and business photo cards share the cooperative's inset width, 340–430px responsive minimum height, 8px corners, and 16px gaps. Member names/actions and business descriptions sit on readable image overlays; member image `sizes` now accounts for the full-width cards. Cards can grow for larger text rather than clipping it. Desktop scroll-open profiles and layouts are unchanged.
- Mobile section spacing and type are calmer; sector tabs stay inside the rails with a simple active underline. Repeated business labels and the empty story-image placeholder are hidden on phones. Stories/participation cards have consistent sizing within their groups, service rows are tighter, and empty impact metrics use compact rows without fabricated values. All original content, images, profile dialogs, sector selections, and participation destinations remain intact.
- Profiles use a labelled native dialog, styled as a mobile bottom sheet, with a sticky close control, Escape dismissal, focus restoration, and background scroll locking.
- Navigation returns on upward scrolling and keyboard focus. The mobile menu closes on Escape, navigation, outside interaction, or resizing to desktop. Join remains visible beside the menu control.
- Navigation is slightly shorter: 76px desktop, 68px tablet, 64px phone, plus its 1px border. A shared CSS height keeps the hero/textile offset and mobile menu height synchronized. Buttons retain 44px tap targets; logo size, rails, and textile thickness are unchanged.
- Navigation and the business participation link now point to `#businesses` for business discovery. The EN / FR native dropdown sits immediately after Join us on desktop. Mitchell found the mobile header crowded, so below 960px the same dropdown now lives inside the expandable navigation, beneath the links. The mobile header retains only the logo, Join us, and menu button. English is selected; French is disabled and explicitly marked “Coming soon” because translated content does not exist yet. Escape closes the language dropdown first, then the mobile menu, restoring focus appropriately; outside interaction, selection, and focus leaving also dismiss it. No translation library was added.
- New styles for this slice live in `app/page.module.css`. The obsolete global member choreography styles were removed; unrelated global style layers remain.
- Responsive WebP derivatives for the hero and members, plus a smaller header logo, are generated by `node scripts/optimize-home-images.mjs`. Original image files are retained.
- A repeatable native Chrome check lives at `scripts/check-home.mjs`: start an isolated headless Chrome instance with remote debugging on port 9222, then run `node scripts/check-home.mjs [site URL]`. It covers seven widths from 320px to 1920px, card-width/height consistency and unclipped copy, all six sector selections on phones, profile-dialog focus and scrolling, mobile navigation, upward-scroll navigation, reduced motion, the original full-width ribbon sizing, and language-dropdown placement/dismissal. Screenshots are written to `/tmp/wisconnect-*.png`.
- No Playwright was used. Real-device and Safari/Firefox validation remain outstanding. Membership submission, remaining homepage content, and the backend are outside this delivery.
- Verification passed: TypeScript; normal and GitHub Pages production builds; exported base-path assets and links; native Chrome checks at 320, 390, 620, 768, 1024, 1440, and 1920 pixels. Desktop/mobile hero, member, profile, and cleaned-up section screenshots were inspected. Mitchell requested publishing this delivery through the existing main-branch GitHub Pages workflow.

## Source-of-truth rule

The current `wisconnect-site` working tree is the active website direction. The migration and latest design work are committed on `main`, with release `de36ee6` deployed to GitHub Pages. The working tree's current content, visual system, assets, structure, and interaction choices take priority over older concepts discussed in prior sessions.

Historical proposals, discovery notes, brand explorations, and plans below are retained as background and traceability. They must not be used to replace or revert the current site unless Mitchell explicitly asks for that change.

Before changing the project, inspect `git status`, read this file, and preserve any new uncommitted work. Do not reset, revert, or discard it.

## Membership journey context — retained from earlier handoff

The first version of the WisConnect membership journey is implemented at `/join`.

Product direction agreed with Mitchell:

- The primary `Join the Cooperative` action should lead to a dedicated `/join` page in the same tab, not a popup or email link.
- The page should explain who membership is for, member benefits, expectations, and the application process before presenting a short application.
- The initial application should request only useful qualification details: name, email, location, business or professional expertise, and what the applicant hopes to contribute.
- After submission, show a clear confirmation and next step, such as the expected review timeline or scheduling a conversation.
- The header `Join Us` action and the `Become a Member` participation card should also lead to `/join`.
- Partnership remains a separate path and should not be mixed into the membership application.
- The hero, header, participation card, and footer membership actions now lead to `/join` in the same tab.
- The page explains who membership is for, member benefits, participation expectations, and the three-step review process before the short application.
- Because the frontend is a static GitHub Pages export and no membership endpoint has been approved, the form prepares a complete email for the applicant to review and send. The page states that answers are not stored and does not claim the application was submitted.
- A future persistent submission flow requires an approved production API destination, data model, and review process; do not add those speculatively.
- The backend intentionally has no membership schema or submission endpoint yet. Do not invent persistence, approval states, legal consent, or notification behavior without first defining the minimum application requirements.

Current visual implementation to preserve:

- The hero uses optimized 640px/960px derivatives of `public/assets/hero-visionary.webp`. `image-gen-2(4).png` was briefly tested and rejected because the globe composition did not feel clean; the file remains available but is not used.
- The belief section presents “When women own, communities grow.” on the light supplied background treatment.
- The cooperative section uses editorial photography for People, Capital, and Communities, followed by the purple-and-gold textile divider.
- The members section uses the labelled responsive cards described in the latest delivery above. Profiles open in a desktop dialog and a mobile bottom sheet.
- Member-image mapping is deliberate: Chipo Nyambuya uses the shaved-head blue portrait, Elizabeth L. Carter uses the red-blouse portrait, and Priscilla Cadette uses the yellow-headwrap portrait.
- The member-enterprises section has six interactive sector views with real stock photography and concise sector-specific copy.
- Card corners and borders were reduced across the cooperative and business sections for a sharper, more modern mobile treatment.
- `What WisConnect does` now uses clearer ownership, opportunity, business-growth, and community-value language with intentionally generous whitespace.

Working preference for the next session:

- Do not use Playwright unless Mitchell explicitly asks to use it again.
- Preserve any new uncommitted work and make focused changes for Mitchell’s current request.

## Current working product

Repository: `https://github.com/Mitchell-Travis/wisconnect-site.git`

Current branch and commit:

- Branch: `main`
- Latest deployed commit: `de36ee6` — `Refine homepage and unify mobile card layouts`
- Migration/backend foundation: committed in `13e4def`; Pages asset-path correction: `01abe67`.
- Working tree: clean after deployment; only this handoff update is newly uncommitted at session close. Verify again next session.

Current implementation:

- Next.js 16.3.5, React 19.3.0, and TypeScript 7.0.2 responsive public landing page
- Tailwind CSS 4.3.3, CSS Modules, and Motion 13.4.0
- FastAPI 0.141.1 API foundation using SQLAlchemy 2.0.54, Pydantic 2.13.5, Alembic 1.20.0, psycopg 3.3.6, and Uvicorn 0.53.0
- PostgreSQL 17 local database through Docker Compose
- Redis and Celery or RQ are explicitly deferred until a real background-job requirement exists
- Static export configured for GitHub Pages
- GitHub Actions deployment on pushes to `main`, using Node 22 and `npm ci`
- Navigation that hides when scrolling down and returns when scrolling up or receiving keyboard focus
- Desktop, tablet, and mobile layouts
- Mobile navigation
- Real WisConnect logo and supplied/generated visual assets
- Interactive business-sector filters
- Interactive global-region storytelling
- Dedicated membership page with an email-prepared application; partnership remains a separate email path
- Accessibility basics including semantic navigation labels, reduced-motion handling, and responsive layouts

Current page story:

1. WisConnect institution and identity
2. Members
3. Belief: “When women own, communities grow.”
4. Cooperative model: People, Capital, Communities
5. Member businesses
6. Programs and services
7. Impact and proof
8. Global reach
9. Stories and events
10. Participation paths
11. Footer and future phases

Current hero:

- Organization name: `Black Women Business Development & Resource Center`
- Headline: `Build your business. Share in what grows.`
- Positioning: a worker-owned cooperative connecting women entrepreneurs, business opportunity, capital, and communities
- Primary action: Join the Cooperative
- Secondary action: Discover WisConnect
- Motion treatment: brief desktop entrance movement, a gold connection motif, and hover/tap feedback; content is visible from the first frame
- Accessibility: reduced-motion styling, a skip link, visible focus indicators, and touch-friendly actions

Current site messaging:

- Central belief: when women own, communities grow
- Cooperative model: people, capital, and communities connected through collective ownership
- Focus: women entrepreneurs, member businesses, professional growth, capital and opportunity, community development, and cross-border relationships
- Participation routes: membership, institutional partnership, and discovery of member businesses
- Phase 2 is foreshadowed through marketplace listings, a member portal, and mobile app references

Current visual system:

- Wisdom Purple: `#4B2E83`
- Unity Mauve: `#7B5AA6`
- Heritage Lilac: `#C8B4D9`
- Prosperity Gold: `#D4AF7C`
- Rooted Plum: `#2A1B3D`
- Sahara Sand: `#F5EFE9`
- Global Mist: `#E9E3F1`
- Editorial serif headings with a clean sans-serif interface/body system
- Generous whitespace, thin rules, quiet surfaces, purple/plum emphasis, and restrained gold accents

Current design references recorded in the repository:

- Navigation: Frontify
- Hero: Studio Freight
- Cooperative model: AngelList
- Members: Braintrust
- Businesses: Square
- Programs: OFF+BRAND
- Impact: COLLINS
- Global reach: Wise
- Stories: FARFETCH
- Closing CTA: SAP Good Energy
- Footer: Stripe

These references are for layout and interaction principles only. The site uses WisConnect’s own identity and content direction.

Current assets:

- Horizontal WisConnect logo
- WisConnect symbol
- Visionary hero portrait
- Smiling hero portrait
- 3D hero artwork in WebP and PNG forms
- Textile-flow artwork
- Light and dark background artwork

Current content safeguards:

- No invented public member profiles
- No invented impact statistics
- Member, business, story, and impact areas remain structured placeholders until WisConnect supplies verified and consented data
- Phase 2 marketplace language is present, but the marketplace is not implemented in this repository

Current technical boundary:

- The repository now contains the public front end plus a minimal API/database foundation
- The API currently exposes `/`, `/health`, and `/docs`; `/health` verifies the PostgreSQL connection
- No administration dashboard exists in the repository
- No approved application tables, authentication, staff permissions, payment tracking, project/document management, or reports exist yet
- `backend/app/models.py` intentionally contains no speculative domain models; tables should be introduced through Alembic after the dashboard data model is approved
- The `/join` application prepares an email client draft but does not persist or transmit data itself; no membership submission endpoint exists
- English/French is shown as a navigation affordance, but full bilingual content is not implemented
- Frontend dependencies are recorded in `package.json` and pinned by `package-lock.json`
- Backend dependencies are pinned in `backend/requirements.txt`
- GitHub Pages still hosts only the static frontend; the API and database require separate production hosting
- The frontend does not yet consume the API

Current local workflow:

- Requirements: Node.js 22+, Python 3.13+, and Docker
- Frontend: `npm run dev` at `http://localhost:3000`
- API: `npm run dev:api` at `http://localhost:8001`
- API documentation: `http://localhost:8001/docs`
- PostgreSQL: `npm run db:up`, bound to `127.0.0.1:5432`
- Migrations: `npm run db:migrate`
- API uses port 8001 because another local application occupied port 8000 during setup
- Environment defaults are documented in `.env.example`

Latest verification:

- `npm run typecheck` passed
- `npm run build` passed using the repository's `next build --webpack` script
- The static routes `/` and `/join` were prerendered successfully, including with the GitHub Pages base path
- Public images and CSS artwork use the configured base path and load from `/wisconnect-site/assets/` on GitHub Pages
- The frontend and API health endpoint both returned HTTP 200 during the local verification pass
- PostgreSQL was healthy and the API reported `database: connected`

Implementation cautions:

- `app/globals.css` contains accumulated responsive/design override layers from prior iterations; avoid broad cleanup without visual regression testing
- The new hero glow and portrait-motion wrapper are isolated in `app/page.module.css` so the existing responsive portrait positioning remains intact
- `AGENTS.md` contains a Next.js-generated rules block. Preserve it; `next dev` recreates that block

Codex and browser continuity:

- A global Playwright MCP server was added with `npx -y @playwright/mcp@latest`
- `/mcp` discovered Playwright with 25 tools, but the conversation active during installation did not receive those tools dynamically
- Start a fresh Codex CLI session from this repository to load Playwright; do not reinstall it
- In the fresh session, run `/mcp`, then ask Playwright to open `http://localhost:3000`
- Playwright is suitable for local visual and interaction testing but does not automatically share the user's signed-in everyday Chrome profile

## Organization and mission understanding

WisConnect has been described across project materials as a cooperative and economic-development platform focused on empowering Black women and women entrepreneurs, supporting member businesses, creating shared prosperity, and building sustainable communities.

The proposal’s closing description says the platform should help WisConnect:

- Reach more members
- Manage operations efficiently
- Enable member businesses to sell products and services
- Scale the Wisdom Connection Initiative across Liberia and beyond

The project involves both Liberia and a United States team. The invoice used a Chicago billing address, while the discovery project and intended community impact were centered on Liberia. The current website presents a broader international story.

Known naming variants found in project history:

- WisConnect Cooperative Inc.
- WisConnect Cooperative Inc. — Liberia
- WisConnect Holding Cooperative, LWCA
- Black Women Business Development & Resource Center
- Wisdom Connection Initiative

The current website’s organization name is the active website direction. The exact legal entity name remains something to verify before contracts, policies, payment pages, or legal footers are finalized.

## Original discovery evidence

The December 2025 proposal was based on six responses from:

- Chipo
- Salvation
- Meleh
- Ade Wede
- Jennima
- Davidetta

Requested components:

- Online marketplace: 6 of 6
- Public website: 5 of 6
- Admin dashboard: 5 of 6
- Mobile app: 5 of 6
- Member portal: 4 of 6

Operating situation recorded in the proposal:

- Domain: `wisconnect.co`
- Current membership: approximately 5–10
- Expected membership within one year: approximately 15–70
- Current tools: email, WhatsApp, Signal, and paper records
- Existing member database: none
- Team members reported that a logo and colors were available

Products and services expected in a marketplace:

- Food and beverages, including juices and produce: 5 of 6
- Consulting services: 5 of 6
- Agricultural products, including raw materials and seeds: 4 of 6
- Textiles and apparel: 2 of 6
- Handmade crafts: 2 of 6
- Training: 2 of 6

Requested payment methods:

- Mobile money, including Orange Money and MTN: 5 of 6
- Bank transfer: 5 of 6
- Credit/debit cards: 5 of 6
- Cash on delivery: 3 of 6

Stated priorities:

- Accessibility for ordinary people
- Ease of access
- Strong user experience and messaging
- Security
- Mobile usability

`faire.com` was named as marketplace inspiration.

## Contracted platform phases

### Phase 1 — Foundation

Original price: $2,000

Original estimate: 6–8 weeks

Public website scope:

- Home page and hero
- About and WisConnect story
- Mission and values
- Services
- Member directory
- News
- Events
- Gallery
- Contact
- Membership application
- English and French structure
- Mobile-responsive design

Administration dashboard scope:

- Secure login
- Multi-user staff access with permission levels
- Member management
- Member-business tracking
- Payment and investment tracking
- Project and document management
- Financial reports
- Sales reports
- Membership reports
- Activity reports
- Impact reports

Delivery obligations recorded in the proposal:

- Initial development and deployment
- Testing and bug fixes during development
- Documentation and training
- One month of support after the phase launch

### Phase 2 — Commerce

Original price: $2,000

Original estimate: 6–8 weeks

Marketplace:

- WisConnect sells on behalf of members; four of six respondents preferred this model
- Product and service categories
- Shopping cart and checkout
- Mobile-money, bank-transfer, card, and cash-on-delivery payments
- Shipping and order tracking
- Sales reports

Member portal:

- Member login and profile
- Online membership dues
- Documents and training materials
- Member-to-member messaging
- Investment information
- Marketplace selling

### Phase 3 — Mobile

Original price: $1,000

Original estimate: 4–6 weeks

- Native iOS and Android application
- Marketplace browsing and purchasing
- Member-portal access
- Push notifications
- Mobile payments
- Order tracking
- Multilingual support

Five of six original respondents said mobile was critical. Phase 1 was expected to be mobile responsive even before a dedicated app.

### Total commercial outline

- Total development: $5,000
- Original total estimate: 16–22 weeks
- Payment structure: 50% upfront and 50% on delivery for each phase
- Maintenance after launch: $100/month
- Estimated hosting and infrastructure: approximately $35–$55/month, paid separately by WisConnect

Maintenance was described as covering monitoring, security updates, patches, bug fixes, minor content updates, database backups, and technical support by email/WhatsApp.

Additional paid work was defined as new features, major post-approval design changes, languages beyond English/French, unspecified third-party integrations, custom reports or analytics, and extra training.

## Commercial and contract issues to resolve

The proposal says Phase 1 is $2,000, split into $1,000 upfront and $1,000 on delivery.

The August 10, 2026 invoice charged $2,000 as the combined upfront installments for Phases 1 and 2: $1,000 for each phase. Payment evidence was later received, while WisConnect’s subsequent direction was to begin with Phase 1 only. An internal project status file described the entire $2,000 as the Phase 1 payment.

This creates an unresolved accounting question: whether the second $1,000 is the Phase 1 delivery balance or the Phase 2 deposit. It should be confirmed in writing before final Phase 1 billing or Phase 2 work.

The invoice refers to a Services Agreement / Exhibit A, but the reviewed session found only the proposal, invoice, receipt, and email trail—not a signed services agreement. The following were therefore insufficiently documented:

- Final acceptance criteria
- Intellectual-property and source-code ownership
- Revision limits
- Change control
- Termination
- Warranties
- Handling client delays and missing content
- Final payment triggers
- Production support boundaries

Payment routing and account details are intentionally omitted from this general project context.

## Discovery and project-management process

The agreed process was to deliver short, reviewable increments instead of stretching work across an arbitrary calendar.

Working principles:

- No feature enters development until its requirement and acceptance criterion are understood
- Decisions, risks, questions, feedback, approvals, and changes are recorded
- Client feedback is classified as a defect, agreed revision, clarification, or new scope
- Kujo Systems owns technical delivery
- WisConnect owns organizational facts, content approval, and business decisions

Planned milestones:

1. Discovery complete
2. Requirements approved
3. Website structure approved
4. Website increment accepted
5. Dashboard foundation accepted
6. Dashboard operations accepted
7. Phase 1 launched, trained, and handed over

The original Phase 1 workspace contained or planned:

- Project status
- Action log
- Change-request log
- Decision log
- Risk/assumption/issue/dependency log
- KoboToolbox survey
- Survey deployment guide
- Requirements register
- Milestone register
- Meeting-note template
- Survey invitation email
- Kickoff and Discovery Pack
- UX/design workspace
- Development records
- Test and review records
- Launch and handover records
- Client deliverables
- Archive for superseded material

The old local `WisConnect projects` workspace referenced in the sessions is no longer present at its original path. Its contents survive in session records, Google Drive/Gmail attachments, Figma links, and the current GitHub repository.

## US-team discovery survey

Platform: KoboToolbox

Survey link: `https://ee.kobotoolbox.org/x/YFLegIa4`

Survey project name: `WisConnect US Team Discovery Survey — Phase 1`

Survey description: independent US-team input on organizational priorities, public website requirements, member profiles, dashboard workflows, reporting, risks, approvals, and Phase 1 success criteria.

- Sector: Information and Communication Technology
- Country: Liberia
- Intended completion time: approximately 15–20 minutes
- Intended response model: one independent response per selected team member
- Original requested deadline: September 9, 2026

The survey covered:

- Respondent role and responsibilities
- Mission understanding
- Audiences and visitor actions
- Public pages
- Member-directory information and privacy
- Membership application and approval
- Dashboard users and responsibilities
- Staff roles and permissions
- Member and business records
- Payments and investments
- Reports and metrics
- Documents
- English/French ownership
- Branding and design preferences
- Accessibility and mobile use
- Security and privacy
- Existing tools and migration
- Priorities and deferrals
- Launch success criteria
- Risks and concerns

A separate member-profile form was recommended rather than mixing profiles into the US-team discovery survey. It was intended to collect:

- Biography
- Photograph
- Cooperative role
- Contact information
- Business information
- Visibility preferences
- Permission/consent to publish

## Information requested from WisConnect

Organization:

- Official legal name and registration details
- Mission, vision, values, and history
- Office and contact details
- Leadership and team biographies
- Programs and services
- Target communities and geographic coverage
- Partners, donors, and affiliations
- Approved impact claims

Brand and content:

- Original editable logo files
- Official colors and fonts
- Brand guidelines
- Approved photographs and captions
- Brochures and presentations
- Website copy
- Testimonials and publication permission
- Social links
- English and French content
- Named content approver

Membership:

- Categories and eligibility
- Application questions
- Review and approval workflow
- Fees and renewal schedule
- Required member fields
- Directory visibility and privacy choices
- Existing member records
- Consent language and terms

Operations:

- Staff users and roles
- Data access by role
- Member and business fields
- Payment and investment processes
- Project workflow
- Document categories
- Reports and exports
- Approval and audit requirements
- Existing data to import

Technical and administrative access:

- Domain registrar for `wisconnect.co`
- Existing website/hosting access
- Official email accounts
- Analytics
- Storage/Workspace needs
- Owner for each external account
- Backup expectations
- Privacy policy, terms, and cookie requirements

## Known people and working relationships

- Mitchell Sherman — Founder and CEO of Kujo Systems; delivery lead
- Chipo Nyambuya — described in the proposal as a WisConnect founder; also Mitchell’s mentor and the person who connected him to the team
- Sikola Adams — principal recipient for the kickoff/discovery correspondence and responsible for distributing materials to the team
- Elizabeth Carter — WisConnect contact involved in payment and project correspondence
- Original discovery participants — Chipo, Salvation, Meleh, Ade Wede, Jennima, and Davidetta

Project roles still needing explicit confirmation in the historical record:

- WisConnect project lead
- Final approver
- Materials/content coordinator
- Technical/domain contact
- Translation owners

## Communication history and standing preference

### December 2025 to August 2026

- December 2025 proposal prepared from the first six survey responses
- Proposal sent to the team in a `WisConnect Digital Platform Proposal Ready + Next Steps` email
- Chipo later sent biography and photo options
- Proposal PDF was sent again in June 2026
- Invoice for Phase 1 and Phase 2 upfront installments was prepared in August 2026
- Payment receipt was received August 31, 2026

### September 2, 2026

- Phase 1 Kickoff and Discovery Pack sent to Sikola
- Elizabeth and Chipo copied
- KoboToolbox survey link included
- September 9 requested as the response deadline
- Team asked to confirm respondents, project lead, final approver, and materials coordinator
- Chipo privately congratulated Mitchell; Mitchell thanked her for the mentorship and committed to over-delivering

### September 5, 2026

- Follow-up sent because no reply had been received
- Sikola reported that she had not received the materials
- Discovery Pack and survey were resent to Sikola, with Elizabeth and Chipo copied
- A separate note asked Sikola to confirm receipt
- Sikola replied: `Received. Thank you`

Standing communication rule from the sessions:

> Prepare emails and follow-ups as drafts for Mitchell’s review. Do not send until Mitchell explicitly approves.

This rule was established after two messages were sent before review.

## Delivery timing history

The original Phase 1 estimate was 6–8 weeks. A later practical estimate was 8–10 weeks after requirements and content approval, potentially 10–12+ weeks if content, translation, workflow decisions, or approvals were delayed.

Mitchell then set a target to launch Phase 1 by September 30, 2026. The compressed plan assumed:

- Discovery and scope approval by September 9
- Website work by approximately September 15
- Core dashboard work by approximately September 22
- Tracking, documents, and essential reports by approximately September 26
- Testing, client acceptance, training, and corrections by September 29
- Production launch September 30
- One empowered approver
- Complete content by September 9
- Feedback within 24 hours
- Frozen scope

As of the current September 19 repository state, the public landing page and a minimal API/database foundation exist, but the contracted dashboard and its application capabilities are absent. The historical September 30 target therefore does not match the full remaining Phase 1 scope without an explicitly revised release definition.

## Brand and design history

### Current website direction

The current repository’s purple/mauve/lilac/gold/plum/sand design system, editorial presentation, real WisConnect logo assets, and existing page composition are the active direction.

### Historical current-site audit

On September 2, the then-live `wisconnect.co` site was assessed as having:

- Repeated sections and imagery
- Excessive empty space
- Small, low-contrast text
- No clear navigation or main call to action
- Portuguese cookie/footer text
- Outdated 2024 copyright
- Weak pathways for entrepreneurs, partners, investors, and community stakeholders
- A template-like presentation that undersold the mission

This was a point-in-time audit and may not describe the current live site.

### Logo history

The logo downloaded from the old live website was only a 300 × 204 WebP reference. The sessions requested original AI, SVG, EPS, PDF, or high-resolution PNG files.

The identity was understood to include purple, a circular connection motif, and emphasis on Black women. The old website copy of the mark was judged difficult to read at small sizes.

A complimentary brand-foundation refresh was proposed, with a Liberia-based designer supporting execution while Kujo Systems owned strategy, client communication, creative direction, quality control, and website implementation.

Proposed brand deliverables included:

- Primary horizontal logo
- Stacked logo
- Icon
- Full-color and one-color versions
- Light/dark-background versions
- Color and typography system
- Photography direction
- Graphic patterns and shapes
- Website UI styles
- Social, print, presentation, and document applications
- Mini brand guide
- SVG, PDF, PNG, JPG, and editable source files

### Historical concept V1

- Connected-people/W symbol
- Purple, gold, plum, cream, and charcoal
- Poppins headings and Source Sans 3 body
- `Connection Creates Shared Prosperity`
- `Community • Ownership • Growth`
- Horizontal, stacked, and icon-only logo concepts

### Historical concept V2

- Clearer W
- Woven connection motif
- Stronger wordmark
- Cleaner applications

### Later research territories

The connected-people-around-a-W direction was later rejected during exploration. Three other territories were researched:

1. The Shared Table — warm, editorial, serious, people-led
2. Common Thread — restrained interwoven detail with documentary storytelling
3. The Cooperative Seal — ownership/provenance seal for members, products, documents, and marketplace listings

The Shared Table was recommended at that time, with the ownership seal as a secondary device. References included Harambeans, PAPSS, Chicago Market, and Moja.

These are historical explorations only. They do not supersede the current website direction.

## Figma and research history

Figma design file:

`https://www.figma.com/design/6vFRVUiiYmSJeXJYRwDyfM`

FigJam audience journeys:

`https://www.figma.com/board/GuIx8bJMhPZ8q8VH7PX6ap`

The initial Figma workspace included:

- Research and moodboards
- Brand foundations
- Sitemap and journeys
- Low-fidelity wireframes
- Components
- High-fidelity desktop/mobile UI
- Prototype and client-review areas
- Developer handoff planning
- Existing logo and early concept board
- Desktop header
- Initial hero
- Planned homepage sections
- Audience journeys for entrepreneurs, funders, partners, and community stakeholders

At that time, the Figma hero had overlapping text and the Starter-plan MCP limit prevented immediate correction. The session explicitly said not to share that incomplete file with the team then. The current codebase, not that old Figma state, is the active website source of truth.

Mobbin references mentioned during early exploration included Mercury, Ramp, Superpower, Origin, Luma, and FOLLOW.ART. The current repository’s `DESIGN_NOTES.md` contains the later working reference list that governs the present implementation.

## Key risks and unresolved facts

- Survey responses after the September 9 deadline are not present in the recovered session history
- The exact client-approved Phase 1 requirements and acceptance criteria are not present
- The exact legal name differs across proposal, invoice, and website copy
- The current website’s `worker-owned cooperative` description should be verified against WisConnect’s legal/operating structure
- Brazil and Vietnam appear in current global-region storytelling but need client confirmation before being presented as established activity
- `hello@wisconnect.co` is used in current calls to action and should be confirmed as the correct public inbox
- Published member data requires consent and verification
- Impact statistics must remain empty until verified
- English/French content ownership and translation workflow remain undefined
- Original editable logo files and brand-usage rights need confirmation
- The Phase 1/Phase 2 payment allocation needs written clarification
- A signed agreement or replacement scope/acceptance document is needed
- The administration dashboard and backend application features remain unimplemented; only the API/database foundation and health check exist
- Marketplace implementation remains Phase 2 even though the public site correctly anticipates it
- Full Phase 1 cannot be considered complete based on the current public-site repository alone

## Recommended next decisions

These are consolidation findings, not changes to the current site:

1. Keep the current repository as the website source of truth.
2. Obtain the completed survey data and discovery decisions.
3. Confirm the official legal/brand name and current public positioning.
4. Confirm the Phase 1 payment allocation in writing.
5. Replace the missing Services Agreement/Exhibit A with a signed scope and acceptance document if necessary.
6. Confirm the authoritative project lead, final approver, materials coordinator, and translation owners.
7. Confirm every public claim currently represented by placeholders or global-region copy.
8. Define whether September 30 means public-site launch only or the full contracted Phase 1 platform.
9. Approve the dashboard data model, then build the administration dashboard on the existing FastAPI/PostgreSQL foundation without disturbing the public-site direction.

## Session source ledger

Primary WisConnect sessions recovered:

- 2026-09-02 — `01a060c5-af53-7373-a14e-0d6868d6673e` — Google Drive access, proposal review, Phase 1 planning, discovery workspace, Kobo survey, kickoff email, website audit, branding, Figma, and marketplace clarification
- 2026-09-03 — `01a06732-7f08-7950-9606-3b6603d1b5a0` — adjacent Chipo introduction correspondence; retained only for relationship context
- 2026-09-03 — `01a06763-8003-7980-b323-b256c2b27db0` — Kujo strategy work noting WisConnect was in discovery
- 2026-09-05 — `01a07238-ae58-79e2-9098-b176293d8dd4` — recent kickoff email lookup and follow-up
- 2026-09-05 — `01a072a3-ea25-7e40-952b-9a1880debd14` — resend/receipt confirmation, brand review, contract review, timing, and research direction
- 2026-09-19 — `01a0bb8d-04b6-7f62-9fb0-698bd90a546a` — repository download and move to Desktop
- 2026-09-19 — `01a0bb92-288f-7bf1-af46-aec7181f99c1` — this consolidation
- 2026-09-19 — current CLI work — Next.js/TypeScript/Tailwind/Motion migration, FastAPI/PostgreSQL foundation, local verification, hero animation pass, Playwright MCP setup, and context refresh

Duplicate approval-review logs and unrelated Kujo/product sessions were inspected but excluded as sources because they repeated other transcripts or contained no additional WisConnect facts.

## Important links

- Current organization site: `https://wisconnect.co/`
- Current code repository: `https://github.com/Mitchell-Travis/wisconnect-site.git`
- Original proposal Google Doc: `https://docs.google.com/document/d/16HaYCbfvbSKdMCLGimmI4Kkmw3-bxq171P3PK1jW8GE/edit`
- KoboToolbox discovery survey: `https://ee.kobotoolbox.org/x/YFLegIa4`
- Figma design file: `https://www.figma.com/design/6vFRVUiiYmSJeXJYRwDyfM`
- FigJam audience journeys: `https://www.figma.com/board/GuIx8bJMhPZ8q8VH7PX6ap`
