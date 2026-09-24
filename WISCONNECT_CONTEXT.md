# WisConnect master context

Last updated: 2026-09-24. Read the next-session handoff below first; dated entries further down retain historical decisions and verification.

## Start here — next WisConnect session (2026-09-24)

### Current release and local work

- September 24 release authorization: Mitchell requested committing and pushing the accumulated work after the Phase 1 content pass. Release scope includes public-site/entry/dashboard refinements, local-only auth/backend/migration code, checks and documentation. The Pages workflow publishes the static frontend only; hosted authentication remains disabled. Newly received Nikki/Tiffany/Elizabeth portraits, unused reference artwork/media and generated `next-env.d.ts` changes are excluded and retained locally. Check current Git/Actions for the release SHA and deployment outcome; the older uncommitted/unpublished descriptions below are historical snapshots. Password and bootstrap checks also passed before release; the legacy homepage animation-expectation limitation remains recorded below.

- September 24: Phase 1 public content alignment now exists locally. Read the latest Phase 1 entry and `docs/phase1-website-content.md`: navigation/section order is revised, missing inventory areas have sections, proposals and approval gaps are explicit, and illustrative impact totals have been replaced with unverified placeholders. Local and unpublished.

- September 24: Mitchell approved a design-only refinement after the Stripe/browser review. Placeholder content is intentional; preserve it until WisConnect supplies approved material. The local homepage and Contact/Join/Login/Signup now share typography, gutters, purple/plum colors and controls, with an earlier portrait reveal. See the latest design-pass entry below and `docs/reviews/2026-09-24/improvements/index.html` for before/after screenshots. Changes remain uncommitted and unpublished.

- Repository: `/Users/mac/Desktop/wisconnect-site`. Read `AGENTS.md`, inspect `git status`, and preserve all existing changes before working. Read the installed Next.js documentation before writing application code.
- Local HEAD verified for this handoff: `33f9996` — `Complete account entry states and strengthen the shared brand styling`. This is the last recorded published frontend release; the live deployment was not rechecked during this documentation update. Published URL: https://mitchell-travis.github.io/wisconnect-site/.
- The working tree is NOT clean. Calmer entry-page backgrounds/readability, administrator member deletion, improved password validation, backend/auth files, configuration, checks, assets, and documentation remain local/uncommitted. Preserve them; do not reset or recreate them. Details and prior test results are in the September 21 entries immediately below. No new build or application tests were run for this documentation-only handoff.
- GitHub Pages serves the static frontend. Online login is still intentionally disabled by the localhost-only account guard. A hosted API/database and production auth configuration are required before real online member access. Do not expose the local auth pilot through a tunnel or remove its guard as a deployment shortcut.
- A dashboard and local invitation/account/member-management flows DO exist now. Older passages saying there is no dashboard/authentication describe the earlier foundation, not today's working tree. The complete contracted administration platform is still unfinished.
- Local commands: `npm run dev` (3000), `npm run dev:api` (8001), `npm run db:up`, `npm run db:migrate`; inspect running services before starting duplicates. Prior checks include `npm run auth:check`, `scripts/check-entry-flows.js`, and `scripts/check-member-deletion.js`. Recheck their setup before running them; never exercise destructive checks against real member data.
- Playwright was subsequently explicitly requested and used for Chromium/WebKit verification. Earlier instructions below to avoid Playwright until requested have been superseded. Use isolated browser contexts and preserve the user's reference accounts/tabs.

### Product and visual decisions to preserve

- Keep the current WisConnect public-site design, purple/gold identity, restored hero portrait, section rules, cooperative stacking, enterprise carousel, interactive impact map, and story layout.
- Meet the visionaries has four supplied profiles, individual portrait backgrounds, floating/scroll behavior, profile sheets, the restored mist background, and a pause/resume control inside the desktop rails. Join the cooperative and Contact sit side by side. Elizabeth L. Carter has no Esq suffix; Chipo Nyambuya, Esq retains it.
- Login, Signup, Contact, and Join share the desktop purple/gold treatment with a calmer pale center and readable white form cards. Mobile remains white and form-only. Contact and Join currently prepare email drafts; they do not persist or deliver applications themselves.
- Preserve the Railway-inspired dashboard, compact navigation/typography/Feather icons, bordered searchable member table, invite dialog, account editing, loading/error/empty states, mobile layout, and dark mode. The notification panel exists, but a real notification feed is not connected.
- Administrator deletion and 15–128-character new-password validation are implemented locally. Passwords permit passphrases and use a local common-password blocklist; do not replace this with arbitrary mandatory symbol/case rules. See the detailed entries below for limits and tests.

### Member bios and portraits received (2026-09-23)

Sikola sent bios for Nikki Bravo, Tiffany Williams, and Elizabeth L. Carter. The portrait files are in `public/assets/`: `nikki bravo headshot.png`, `Tiffany Williams.jpg`, and `elizabeth-carter.jpg`.

- **Nikki Bravo** — Entrepreneur, business leader, and small-business advocate with more than 20 years across Chicago government, economic development, workforce development, and business ownership. Her bio notes senior City of Chicago and Public Building Commission roles, followed by nonprofit workforce leadership. She co-founded Momentum Coffee Holdings with Tracy Powell; Momentum operates Chicago cafes and supports workforce development and emerging food entrepreneurs through the Build Momentum Food Incubator.
- **Tiffany “Chef Mama” Williams** — Chicago chef, entrepreneur, and community builder raised in Woodlawn. She founded Exquisite Catering & Events in 2017 and later Exquisite Kitchen, a licensed shared commercial kitchen supporting local food entrepreneurs with workspace, mentorship, and operational guidance. Her bio emphasizes community partnerships, workforce opportunities, and second chances.
- **Elizabeth L. Carter** — WisConnect co-founder, inclusive redeveloper, co-op builder, community planner, and commercial real estate and finance attorney. Her bio describes her leadership of the Wisdom Connection Initiative: a planned 103,000-square-foot neighborhood system and cooperative business hub in Greater Roseland, Chicago, spanning community-owned groceries and renewable energy, affordable commercial space, community health, and youth opportunities through arts, sports, and entrepreneurship.

These are concise summaries of member-supplied bios, not independently verified claims. Verify public wording and obtain each member's publication authorization before using profile content or portraits publicly; the September 22 meeting action list calls for electronic profile-publication signatures.

Sources: [Nikki Bravo Bio and Headshot email](https://mail.google.com/mail/u/?authuser=mitchellsherman01%40gmail.com#all/1a0ce7ee22a16c79), [Tiffany Williams Bio and Headshot email](https://mail.google.com/mail/u/?authuser=mitchellsherman01%40gmail.com#all/1a0ce808d0b34bde), and [Sikola's forwarded Elizabeth Carter bio and headshot](https://mail.google.com/mail/u/?authuser=mitchellsherman01%40gmail.com#all/1a0ce82e70c37991).

### Website and dashboard content inventory (2026-09-24)

Use this as the working Phase 1 content and feature checklist in future website and dashboard sessions. It is based on the shared September 22 Phase 1 presentation, cross-checked against the compact v12 and integrated v11 decks, website discovery walkthrough v4, and discovery working review v7. It includes Elizabeth Carter's comments on slides 8, 11, and 15 of the shared deck. Discovery review notes were auto-generated and may contain errors; confirm final content, ownership, and scope with WisConnect before treating this inventory as approved acceptance criteria.

#### Public website

**Purpose and identity**
- Homepage introducing WisConnect, its cooperative model, purpose, mission, vision, and values.
- Explain why WisConnect exists, what motivates the work, and what membership offers.
- Explain the focus on Black women-owned businesses and the diaspora connection, including why those connections matter.
- Present services, programs, and resources using client-approved descriptions.
- Provide clear next steps to explore, connect, attend, contact, or apply.

**People and businesses**
- About and leadership profiles with approved biographies and portraits.
- Member directory with approved names, short bios, locations, expertise, and profile/contact links.
- Business directory with member-owned business names, sectors, descriptions, photos or logos, and contact links.
- Publish profiles and photos only with each person's authorization.

**Stories, programs, and updates**
- Member and community stories, including stories about WisConnect's purpose, impact, motivations, members' talents, assets, and contributions.
- Approved videos and real, verified impact figures; do not invent outcomes or statistics.
- Programs, resources, community work, news, announcements, and updates.
- Events calendar with dates, details, locations or online links, and an RSVP/registration route.
- FAQs and a photo gallery of approved member, event, program, and community images.
- Consider webinars, tutorials, coffee meetings, and regular engagement with Black women business owners as possible recurring content or activities. The team still needs to choose priorities, frequency, content owners, and presenters.

**Joining and contacting**
- Membership interest/application form with location-appropriate questions; discovery notes mention conditional questions. Confirm whether this is an inquiry or the formal application that starts membership review. Submission must not itself grant membership.
- Contact page with confirmed email/contact route, social links, and approved location or service-area information. Confirm the receiving inbox, saved submission flow, and acknowledgement; the current preview's Contact and Join forms prepare email rather than save submissions.
- English and French support, with the translation handoff and delivery timing agreed by the team. Extra languages require separate scope confirmation.
- Privacy policy and clear notices for information collected through forms.

**Experience and approval**
- Mobile-friendly layouts for phones, tablets, and desktop.
- WisConnect supplies or approves public copy, translations, profiles, photos, events, stories, policies, and impact figures. Confirm the legal/public name, mission, programs, and geographic claims before publishing.
- Agree who approves monthly news, events, and other ongoing updates.

#### Internal staff dashboard

**Access and membership**
- Secure staff sign-in and role-based permissions for at least four staff roles.
- Staff and role management, including who can view, add, change, approve, or export records.
- Membership application review queue: review, approve, decline, request more information, and retain the decision record.
- Member records with contact details, status, membership history, documents, and renewal information.

**Businesses and finance**
- Track businesses linked to members, their sectors and details, and approval status for public directory listing.
- Record dues and other payments with amount, date, reference, status, receipt, and member; Phase 1 tracking does not include online checkout.
- Track investment records and supporting documents, with access and reporting rules defined by WisConnect.
- Reports for financial, sales, membership, activity, and impact records, using data entered by staff.

**Projects and documents**
- Project records with owner, status, milestones, deadlines, outcomes, and supporting documents.
- Central document library for membership files, project documents, receipts, policies, and reports, with access controlled by staff role.

**Decisions still needed**
- Staff list, responsibilities, job descriptions, and exact view/change/approval permissions, including access to sensitive records and whether Liberia and USA teams share records.
- Membership rules and reviewers; one authoritative member register and owner for corrections; financial/investment rules, currencies, and source of truth; sample records; and report fields/calculations for each required report.
- Whether the Join form is an inquiry or formal application, how submissions are saved and acknowledged, which membership steps follow, and who owns the receiving inbox.
- Which languages launch when, who translates, and who approves translations.
- Whether WisConnect wants webinars, tutorials, coffee meetings, and regular member communications at launch or as ongoing activities, and who supplies and leads them.
- Elizabeth asked whether website maintenance could include social media and an email newsletter, and what both would cost. Treat this as a request to scope and price, not as included Phase 1 dashboard functionality or an agreed service.
- Phase 1 is described as the public website plus staff dashboard. Member accounts, online dues payments, and marketplace checkout are Phase 2 in the presentation. A business directory is not a marketplace.
- The dashboard's relationship to publishing public website content is not defined in the presentations; confirm whether staff need that workflow and who approves publication before building it.
- Confirm the public identity and current factual claims (legal name, mission, services, programs, locations), and name one final approver who consolidates feedback from both teams.

Sources: [shared Phase 1 talking-points v13](https://docs.google.com/presentation/d/1kz_4AXrmAWZ3Xo7L_JF6-3NK0IX6AtWBkwgxS-UKuQk/edit), [compact v12](https://docs.google.com/presentation/d/1AhZBWuE5x0spbfdZbdT6CG8HbcOPPrLDIPwDuORDzIE/edit), [integrated v11](https://docs.google.com/presentation/d/1NDD49PZJBJJX_2M_dU1Cn8bOKoQsxflmEu-0HVPG7-E/edit), [website discovery walkthrough v4](https://docs.google.com/presentation/d/1n3NTDDKXHtU2LMgWwvdJIEg2_oMagbPmVseH-crkfSo/edit), and [discovery working review v7](https://docs.google.com/presentation/d/1GygQ5G-BuIbUWGNXJoBQgB-bIcG6zFUmrF7BLhh9smU/edit), plus the September 22 discovery-review meeting notes. Elizabeth's comments on slides 8 (website content and engagement), 11 (staff roles), and 15 (maintenance/social/newsletter pricing) are linked in Drive comments on the shared deck.

### Planning discussed — not implemented or finally selected

- Mitchell wants a solid production foundation and an ongoing paid management relationship with WisConnect. Do not describe the current local pilot as production-ready or the full Phase 1 contract as complete.
- Production preparation should cover shared/persistent rate limiting, secure production authentication/session configuration, recovery and invitation delivery, server-side authorization, backups/restore, monitoring, and deployment configuration. The pilot already has bounded local throttling; it is not a complete production rate-limiting solution. A frontend information-exposure question was discussed, but no fresh security audit was performed in this handoff; do not claim one.
- Mitchell wants a separate owner/operator administration area for managing the platform, distinct from ordinary members' dashboard access. Exact permissions and operator access remain to be designed and enforced server-side; a separate URL alone is not access control.
- Desired future capabilities include member administration, CRM, content publishing, and real visitor analytics such as approximate country/city. Define the minimal workflows, data ownership, and privacy boundaries before building. CRM/contact records and public website content should have explicit publishing controls; private records must not automatically become public.
- Railway is Mitchell's stated hosting preference. Hosting, database, transactional email, media storage, monitoring, analytics, and a reusable design system were discussed; no new services were purchased, configured, or deployed in this session.
- Auth priorities are ease of use, control, and low cost. Auth0, Clerk, Supabase Auth, and Better Auth were discussed; Clerk was suggested as a managed option, but no provider choice or migration was authorized. Recheck current pricing/features and the existing architecture before choosing. Earlier cost estimates are planning estimates, not an approved budget.
- Resume with Mitchell's next WisConnect priority. Do not automatically launch an auth migration, build the owner console/CRM, buy services, or publish the outstanding local changes based only on these planning notes.

### Separate project boundary

- Mitchell explored a redesign pitch for Prinstine Academy at https://prinstineacademy.org/. It is explicitly separate from WisConnect. No Prinstine implementation or assets belong in this repository.
- Suggested separate folder: `prinstine-academy-concept`, with a new chat. The agreed concept stack is Next.js App Router, TypeScript, and Tailwind CSS. A starter prompt was provided; no folder or app was created here and no outreach was sent.
- This handoff update is documentation only. It does not authorize a commit, push, deployment, or contact with either organization.

## Latest Phase 1 website content alignment (2026-09-24)

- Mitchell explicitly requested two steps: reorganize existing navigation/sections first, then represent missing public website inventory areas. Read AGENTS, this context, DESIGN_NOTES, local Next.js page/client-component guides and the dirty working tree before editing. All prior local work is preserved; no commit, push or deployment.
- Step 1 moved the belief/cooperative stack before the existing visionaries, giving Hero → Belief/model → People → Businesses → Services → Impact/map → Stories → Participation. Replaced repeated menus with About / Our people / Our work / Updates; removed misleading Stories & Events wording and future-phase footer promotions. TypeScript passed at this checkpoint.
- Step 2 added purpose/mission/vision/values, a directory using the four existing public profiles, a separate business-directory empty state, proposed programs, resources/videos, community work, news, an empty events calendar, photo placeholders, native FAQs, contact/social-information and privacy-information sections. Header menus now have 16 distinct section destinations. Full content mapping and remaining client decisions: `docs/phase1-website-content.md`.
- Incorporated Elizabeth’s purpose, motivations, diaspora, member stories/impact, talents/assets and contributions themes from this file’s presentation-comment summary. Webinars, tutorials and coffee meetings explicitly remain Proposed. No newly supplied profiles/portraits or invented business listings/events were published. Existing editorial stories and sector imagery remain labelled previews. Sample impact numbers were replaced with dashes and an awaiting-verification notice while retaining the interactive map.
- Existing hero, cooperative stack, portrait playback/profile sheets, enterprise/story interactions, header behavior, styles and local account work are retained. Both Contact and Join link to truthful form-handling information; the full privacy policy, French translation, formal membership workflow and approved content are still outstanding. No new account/checkout features, dependencies, backend work or external messages.
- Verification: GitHub Pages production build and TypeScript passed; new `scripts/check-phase1-content.js` passed at 320/390/768/960/1440/1920px (section order, unique menus/IDs, anchors/routes, layouts, keyboard FAQ, directory profile/focus, approval placeholders, form privacy links). Existing Playwright navigation-dismissal, visionary-profile and impact-map checks passed in Chromium, including reduced-motion/static map behavior. Existing Contact regression passed at five layout widths; Join regression passed at eight widths (320–1920px), including validation, review/edit, encoded email handoff, clipboard/manual fallback and reduced motion. Enterprise next/End/Home controls also passed a focused browser check. Desktop/mobile screenshots reviewed; `git diff --check` passed. Existing `check-home.mjs` was updated for intentional nav labels/counts and impact placeholders, but its full run stops at a pre-existing stale animation assertion: 0.55s expected versus the approved local design’s 0.3s. That historical suite is not reported as passing.

## Latest hero cleanup (2026-09-24)

- Mitchell requested removing the hero caption “Rooted in community. Growing together.” and the horizontal rule directly beneath the portrait. Both are removed; the footer links and section boundary remain.
- After previewing, Mitchell asked to restore the decorative circle behind the portrait. Its original desktop/mobile styles are restored. Playwright verified both viewport sizes, the removed caption/rule and no horizontal overflow. Changes remain local and unpublished.

## Latest entry-header consistency (2026-09-24)

- Mitchell requested consistent “Back to website” navigation on Contact, Login, Signup and the application page, on desktop and mobile. Existing implementations differed in logo, height, label and arrow direction; Login/Signup and Join forced the label to wrap on phones.
- All three entry implementations now use `app/entry-header.tsx` and its scoped stylesheet: matching logo, left-pointing arrow before “Back to website,” single-line label, 44px link target, shared 76px desktop / 66px mobile header and consistent gutters. Removed the superseded per-page header styles. Signed-out admin/dashboard entry screens inherit it; signed-in dashboard navigation is unchanged.
- Playwright checked six entry routes at 320/390/768/1440px: identical header geometry, no wrapping/overlap/overflow, visible keyboard focus and actual homepage navigation. Account responses were isolated mocks. Production Pages build and TypeScript passed; production CSS checked separately. Local, uncommitted and unpublished.

## Latest desktop navigation fix (2026-09-24)

- Mitchell clarified that desktop dropdowns must close automatically when the pointer leaves the menu area, without requiring a click. The old hover boundary covered the entire header, so moving into blank navigation space kept a menu open.
- Moved the existing pointer enter/leave handlers onto each menu’s trigger-and-panel wrapper. Leaving closes after the existing 180ms grace period; entering the dropdown cancels the timer so its links remain reachable. Outside-click dismissal still works. Mobile retains its existing behavior.
- `scripts/check-navigation-dismissal.js` passed real Playwright pointer movement without clicks at 1024/1440/1920px for all four menus, including crossing the trigger/panel gap, menu switching, links, language, keyboard focus and mobile Back/Escape. Production Pages build and TypeScript passed. Local, uncommitted and unpublished.

## Latest design pass — public consistency (2026-09-24)

- Mitchell clarified that most public copy is placeholder, requested a goal and scope review before building, then approved the proposed design direction with “Let’s go.” Implemented visual/interaction changes only; no placeholder rewrites/removal, backend/auth changes, dependencies or deployment.
- Added shared display/form type and corner-radius tokens. Public headings now use Georgia at 32–52px, hero tracking is gentler, primary content gutters are 48/28/20px inside the existing outer rails, and desktop section spacing is 96px. Impact uses plum/purple instead of a separate navy/Arial system. The cooperative cards and story gallery retain their compositions.
- Portraits keep autoplay, pause/resume and profile sheets. The sticky scene is 160svh desktop / 140svh mobile, spread completes before copy appears, and copy is fully visible by 55% of its scroll. Names stay visible. Reduced motion and keyboard access remain supported.
- Contact, Join, Login and Signup share panel/card widths, heading scale and 52px fields with small control corners. Mobile remains white/form-only. Existing email handoff and local-only auth behavior remain unchanged.
- Production Pages build and TypeScript passed. Playwright Chromium passed: responsive alignment/no overflow at 320–1920px; navigation, enterprise/story controls, Contact review/edit; profile playback/sheets/focus/reduced motion; map animation/touch; isolated mocked account-entry and Join flows. Added an earlier-reveal assertion to `scripts/check-visionary-profiles.js`. No real account or database changes were exercised.
- Evidence: `docs/reviews/2026-09-24/improvements/index.html` (20 desktop/mobile before-after pairs) and `NOTES.md`. The original Stripe review remains a historical record; its content-removal recommendations were superseded by Mitchell’s placeholder clarification. Next discussion can use the screenshots to refine visual preferences; do not automatically replace copy or publish.

## Latest password validation (2026-09-21)

- Mitchell asked whether 15–128 is appropriate and requested better validation. Checked final NIST SP 800-63B-4 and OWASP Authentication guidance: 15 minimum for password-only login, maximum at least 64, no mandatory character mixtures. Retained 15–128 for new accounts; signup now shows live length/matching feedback, inline invalid styling and precise errors with focus. Counts Unicode code points consistently with Python; removed native password maxlength truncation. Spaces/paste/password managers remain supported. Existing login credentials are not subject to new-account blocklist rules.
- Added the unmodified Django 5.2.6 common-password gzip (19,640 entries, source/checksum/BSD license in backend/app/password_data) plus a few expected service/example passwords and single-character repeats. Shared AccountInput applies it to signup and bootstrap admin. Fixed safe rejection messages do not echo secrets. No new dependency, no external password transmission, and no live breach-check claim; this is a static local common-password list. Existing stored hashes are unchanged.
- Password boundary/Unicode/hash/redaction checks, bootstrap validation, full disposable PostgreSQL auth integration and extended Playwright entry flows passed. Browser covers short/overlong/Unicode inputs, no silent truncation, match feedback and common-password retry, plus existing activation/loading/error flows and 320–1440px layouts. Production build/TypeScript and diff check passed; mobile screenshot reviewed. Local, uncommitted.

## Latest member management — administrator deletion (2026-09-21)

- Mitchell requested that administrators can delete members. Added a Delete action to member rows and a native confirmation dialog identifying name/email, permanent deletion, session loss and re-invitation requirement. Cancel gets initial focus; Escape cancels before submission. Pending controls prevent duplicate submissions/dismissal; failures retain the row and allow retry; success updates the directory/count and announces completion. Desktop/mobile and light/dark styles use existing dashboard patterns.
- Added DELETE /auth/members/{member_id} behind existing server admin/origin checks. Locks the target row, protects all administrator accounts, deletes all member sessions and the account in one transaction, preserves used invitation history and returns a conflict if linked records prevent deletion. No schema migration needed. No real member accounts were deleted during tests.
- npm run auth:check passed against its disposable PostgreSQL schema, including permission/origin checks, self/other-admin protection, concurrent deletion, session removal, rejected old credentials/invitation and fresh re-invitation. New scripts/check-member-deletion.js passed isolated Playwright checks at 320/390/1440px for confirmation, cancel/focus, pending/failure/retry/success, reload, role UI and dark mode. Screenshots reviewed; production Pages build/TypeScript and git diff --check passed. Running local API exposes the new endpoint. Work remains local; earlier background commit/push was interrupted before execution and also remains uncommitted.

## Latest form readability — calmer background (2026-09-21)

- Mitchell liked the purple/gold color but found forms hard to read, then clarified to work on the background. Added a pale feathered center behind the cards and concentrated purple/gold along the outer edges in the shared entry gradient. Login, Signup, Contact and Join share it; mobile remains white/form-only. Also strengthened labels, helper text and field borders; Contact delivery/help notes now sit inside its white card. Join actions wrap on narrow screens.
- Pages production build/TypeScript passed. Existing isolated entry-flow browser suite passed, including all four Join steps at 320–1440px. Final production browser checks confirmed the new background on all four desktop routes, no gradients on mobile and no horizontal overflow. Desktop screenshot reviewed. Backend and account logic unchanged.

## Latest account journey — complete entry styling (2026-09-21)

- Mitchell requested consistent signup/account-entry styling and more prominent brand color. Strengthened the shared gradient with saturated WisConnect purple, violet and luminous gold; Login, Signup, Contact and the public Join application use it on desktop. Mobile ≤620px remains form-only on white. Join now uses a centered white application card, retaining its four-step content, validation, review/edit and email handoff. Fixed inherited dark footer styling on Join.
- Unified all signed-out account entries (including admin/dashboard fallbacks) with the current card layout; removed obsolete local-test/unfinished-dashboard copy. Added visible field labels, password visibility controls, clear loading/error/success states, invitation help and retry, service retry, and account help/membership links. Missing or expired invitations cannot expose activation forms. Whitespace-only names cannot submit; names are trimmed. Fresh invitation fragments revalidate on the same page and are removed from the URL; old activation responses cannot replace a newly opened invitation. Production still blocks local-only authentication and provides honest Contact/Join routes.
- Production Pages build/TypeScript passed. New runnable `scripts/check-entry-flows.js` passed in Chromium and WebKit using isolated mocked account responses: responsive signup, token URL cleanup, same-page fresh links, password visibility/mismatch, loading and successful activation, missing/expired links/retry, offline service/retry, login error/signed-in state, signed-out admin/dashboard entries and all Join steps at 320–1440px. Separately checked all six production entry routes at 390/1440px for no overflow, correct public-account guard and zero local-API requests. Screenshots reviewed. Backend remains unchanged and the full database-backed auth suite was not run. Frontend commit `33f9996` was pushed to `origin/main`. GitHub Actions API returned HTTP 403, but direct live browser verification confirmed the new activation screen, stronger desktop gradient, plain mobile surface and working public-account guard after deployment.

## Latest entry pages — Login and Contact (2026-09-21)

- Mitchell clarified the reference is https://webflow-to-wonder.lovable.app/signin and explicitly requested the layout on both Login and Contact. Inspected desktop/mobile: rounded outer gradient panel, smaller centered white card, soft shadow and white page margins. Applied that hierarchy using a shared purple/gold CSS gradient, 64px desktop/40px mobile outer corners and 30px/24px white cards. Login/signup share their existing presentation styles; authentication logic is unchanged. Removed the vertical lines within these entry panels to keep the rounded surfaces clean.
- Mitchell then requested forms only on mobile: at ≤620px both pages use a plain white surface, no gradient/panel/card shadow, and 24px form gutters. Desktop retains the rounded gradient panels.
- Finished the previously disabled Contact preview with required-field validation, review/edit, an encoded email draft to hello@wisconnect.co, clipboard copy and manual-copy fallback. Explicitly states delivery occurs through the visitor’s email app. No automatic email delivery/API endpoint was added. Added Back to website and direct contact links.
- Pages production build/TypeScript passed. Playwright checks passed for Contact at 320/390/768/1440/1920px and local Login at 320/390/768/1440px: nested surfaces, no horizontal overflow, validation including whitespace, retained edits, encoded draft fields, clipboard success/failure and manual fallback. Local login rendering and error feedback checked with isolated mocked API responses. Desktop/mobile screenshots reviewed. Existing runnable contact regression updated for the completed flow; full database auth suite not rerun for this presentation change.

## Latest name correction (2026-09-21)

- Removed “Esq” from Elizabeth L. Carter’s shared profile name, which supplies the portrait label, accessible name and profile-sheet heading. Chipo Nyambuya, Esq retains the suffix. Updated the existing profile browser check’s expected name. Text-only correction reviewed with `git diff --check`; committed and pushed as `fb0924b` to `origin/main` for automatic Pages deployment.

## Latest CTA — visionary Contact link (2026-09-21)

- Added Contact beside Join the cooperative in Meet the visionaries, linking to the existing contact page. Shared rounded button sizing, filled purple Join and outlined Contact, centered horizontal layout with compact phone spacing. Background, rails, portraits and playback remain unchanged.
- Pages build/TypeScript passed. Browser checks passed for side-by-side layout at 320/390/700/820/1440/1920px, touch-target sizing and real Contact navigation. Committed and pushed only the two frontend files as `1bc5d96` to `origin/main`; GitHub Pages deployment starts automatically.

## Latest portrait flow — floating visionaries (2026-09-21)

- Mitchell supplied desktop/mobile screenshots and https://webflow-to-wonder.lovable.app/ (“Simplify Your Invoicing Workflow”). Inspected its live section and public component: a 200vh sticky scene, spring-smoothed scroll, portraits spreading from the center, and late heading reveal. Rebuilt Meet the visionaries around that flow on desktop/tablet/mobile, retaining WisConnect typography and purple/gold palette. Fine curved SVG lines sit behind centered copy and a membership CTA.
- Created background-only studio variants from all four supplied portraits using imagegen: Chipo lavender, Elizabeth blush, Priscilla sage, Ade Wede warm gold. Optimized 480/800px WebPs are used in the section and profile sheets; original images remain available. Six positions fit each scene; adding profiles beyond six exposes previous/next scene controls. Current four people are not duplicated to fill empty positions.
- Mitchell then requested the earlier play/pause behavior back. Restored automatic three-second portrait cycling while stacked and the Pause portraits / Resume portraits control on mobile and desktop. Playback stops for interaction/open sheets, offscreen and hidden documents; Reduce Motion and short screens get the static spread. Playback-control focus keeps the stack closed; profile/CTA keyboard focus reveals the content.
- Pages-base-path build and TypeScript passed. Updated the homepage checks for the new layout; focused Chromium and WebKit checks cover scroll flow, unobstructed copy, all four sheets and supplied Ade Wede bio, image loading, native focus/scroll lock, reduced motion and story-dialog regression. Extended checks verify autoplay, pause and resume. Six-position geometry separately checked at 320–1920px without portrait/copy overlap or horizontal overflow. The full CDP homepage suite was not rerun in this session.
- Initial portrait-flow release `363aaae` pushed to main. Mitchell then requested restoring the original section color and keeping Pause/Resume within desktop rails. Restored `var(--mist)` (#F7F3F8) and positioned playback 16px inside the actual rail at all widths. Production build and browser checks at 390/820/1024/1440/1920/2560px passed.
- Full WebKit playback/profile regression passed after fixing the test navigation order: load the page before resizing, so viewport-triggered route prefetches are not aborted by an immediate reload. No application change was needed for that test race.
- Frontend fix `7d6682a` pushed to main; GitHub Pages run `35608635822` completed (success). Live browser verification at 1920px confirmed the original #F7F3F8 background and playback exactly 16px inside the right rail. Backend, local auth, configuration and earlier continuity work remain local.

## Latest profiles — Ade Wede and Stripe-style sheets (2026-09-21)

- Mitchell supplied `Ade-Wede-photo-option-2-soft-studio.png`, the name Ade Wede Wee-Wee Kekuleh and her biography. Added her as the fourth visionary with the complete supplied bio, role and expertise; generated 480/800px WebP portraits from the original without retouching. Original PNG stays local; production uses the optimized assets. Optimizer portrait list updated locally alongside earlier uncommitted work.
- Inspected Stripe homepage’s “Accept and optimize payments globally—online and in person” dialog on desktop/mobile. Reference: desktop 1184px white panel, 16px corners, 72px inner spacing, 100px top gap; mobile 95vh bottom sheet with handle; 0.8s cubic-bezier(.22,1,.36,1) entrance and pale backdrop. Adapted to WisConnect’s purple/serif typography using the existing native dialog, a sticky close button and separate profile-only styles. Added close animation, backdrop dismissal, Escape, scroll lock, Reduce Motion support and explicit trigger focus on open for Safari’s native focus restoration. Story dialogs retain their previous design.
- Four portraits spread into four corners around the section heading; static desktop/tablet grids and mobile carousel include Ade Wede. Counts derive from the profile array. Browser tests updated for four profiles and carousel End/ArrowLeft behavior.
- Pages-base-path production build/TypeScript passed. `scripts/check-visionary-profiles.js` passed in Chromium and WebKit at desktop, iPad and 320/390px phone widths: all four profiles/full bio/images, no overflow, keyboard/scroll/focus, close/backdrop, animations and reduced motion, four-card layout and story-dialog regression. Screenshots reviewed.
- Frontend commit `4a5a42b` pushed to main. GitHub Pages Actions run `35602065724` completed successfully. Full WebKit profile regression passed against the published site, including the new portrait and all four sheets. The browser check was subsequently adjusted locally to await image decoding for real network loads; that test-only correction is uncommitted.

## Latest map fix — iPad visibility and animation (2026-09-21)

- Mitchell reported missing animated dots on iPad on the published site. Current Chromium and WebKit iPad emulation render the map, but inspection confirmed the old pulse stops after 1.8 seconds and the pale markers/routes have poor contrast on the light background. Asked whether country markers or map texture were missing; no reply received before implementing the country-marker fix. Physical device/iPadOS version not available.
- Reused Motion with one HTML-container visibility observer instead of per-SVG-element observers. Four staggered country pulses continue while visible and stop offscreen/under Reduce Motion; route drawing replays on re-entry/selection. Static dots/routes remain available before hydration/without JavaScript. Increased dot size slightly and switched markers/routes/label ink to WisConnect purple for contrast; original dotted geography/background retained.
- Pages production build passed. `scripts/check-impact-map.js` passed in Chromium and WebKit 26.6 at 820×1180, 1180×820 and 390×844: all pulses still animate after the old timeout, touch selection, route completion, pause/re-entry, Reduce Motion, static fallback and no page errors/overflow. WebKit screenshot reviewed.
- Commit `55ee6d8cb43abefecc958954f6a72c8918378898` pushed to main for Pages; Actions run `35597894760` completed successfully. The same WebKit map regression passed against the published site after deployment.

## Latest frontend release — GitHub Pages (2026-09-21)

- Mitchell authorized publishing the frontend. Pushed commit `b1c2c9c66f7d4cd25332f6f756b91fd18282f920` to `origin/main`; GitHub Actions run `35595912162` completed build and deployment successfully. Live: https://mitchell-travis.github.io/wisconnect-site/.
- Published current landing/contact/join pages, member account/dashboard UI (including mobile and dark mode), required optimized assets/font/licenses and frontend browser checks. Backend/auth infrastructure, local package-script changes, continuity/design notes and unused reference artwork remain local and were not included in this frontend release.
- Pages login is intentionally disabled by the existing localhost-only guard. Online account access still requires a hosted API/database and production authentication configuration. No local accounts/data were published and no auth bypass was added.
- Verified the exact Pages-base-path production build and TypeScript, then live homepage/contact/join/login/dashboard at 1440px and 390px: HTTP 200, no failed resources, broken images, horizontal overflow or page errors; no requests to the local API. Earlier “unpublished” notes below describe historical states; the frontend listed above is now published.

## Latest local feature — dashboard dark mode (2026-09-21)

- Mitchell requested Railway's dark mode. Inspected the profile-menu footer action and toggled Light/Dark in a temporary Railway tab, restoring dark afterward. Added the same sun/moon theme action beside Sign out in WisConnect's existing profile menu on desktop/mobile. Selecting it closes the popup and restores profile focus.
- Dashboard dark palette follows Railway: #13111c shell/workspace, #181622 raised surfaces, #33323e borders, #a1a0ab secondary text and brighter purple accents. Covers sidebar, cards, tables, active selections, search, account fields, notifications, More menu, Invite/error/success states, skeletons and mobile dock. Logo becomes white. Original light styles are retained.
- Preference uses localStorage key `wisconnect-dashboard-theme`; absent a choice it follows OS appearance. A small head script selects the theme before content renders, including the loading shell. Cross-tab/system changes synchronize; blocked storage still permits switching. CSS is scoped to dashboard surfaces; login and public-site colors stay unchanged. No theme package or backend change.
- Production build/TypeScript passed. `scripts/check-dashboard-theme.js` checks initial dark loading, light/dark persistence/reload, cross-tab and system changes, unavailable storage, active text contrast, desktop/mobile surfaces, modal errors and public-page isolation with no hydration errors. Existing dashboard regression also passed at 320/390/639/640/768/1440px in an isolated light-mode context. Screenshots reviewed. Local and unpublished.

## Latest local styling — Railway mobile dashboard (2026-09-21)

- Inspected authenticated Railway People at 390px, its floating bottom navigation/More menu and profile popup, and confirmed its mobile breakpoint at 640px. WisConnect now uses one 56px top bar with logo, notification bell and circular profile control; a bordered workspace; and a fixed 56px bottom dock with safe-area clearance. The desktop sidebar returns at 640px.
- Admin dock: Home, Members, Finance, Projects, More. More contains Businesses, Documents, Reports, Team & access, Account settings and Support. Member dock: Home, Membership, Business, Documents, More; More only exposes account/support. Removed the old mobile Menu dropdown. Existing sections, colors, Inter, Feather, table horizontal scrolling and form functionality are retained.
- More uses the existing native-popover approach with arrow/Home/End navigation, Escape/outside dismissal, focus return and viewport limits. Section changes close popups and reset mobile page scrolling. Notification positioning now accounts for the profile button to its right. Disabled Next.js's local development badge because it obscured the dock; runtime/compile errors still surface normally.
- TypeScript and production build passed. Extended mocked Playwright regression passed at 320/390/639/640/768/1440px for responsive shell, both roles, all More destinations, scroll/reset, panel bounds, notifications/profile, invite, request states and sign-out. Mobile screenshots reviewed; a separate touch-device check passed at 390×480 for settings, profile scrolling and the dock. Existing database-backed auth browser navigation helper updated; full database-backed suite not rerun. Local and unpublished.

## Latest local UI — Railway-style notifications (2026-09-21)

- Mitchell requested Railway's notifications UI. Inspected its live top-right Feather bell and 380px dropdown, 6px corners, subtle border/shadow, scrollable content and footer. Added a matching bell and native popover panel to WisConnect's workspace header for both roles, preserving existing colors. Includes heading, close control, bell empty state and explicit notification-feed-not-connected copy. No backend notification model/feed exists; no fabricated alerts, badges, requests, loading delays or nonfunctional read controls were added.
- Panel adapts to mobile, closes on Escape/outside click, section changes and resize, and dismisses when the profile menu opens. Accessible dialog labeling, keyboard focus and expanded state are included. Reuses the existing Feather bell and popover approach; no dependencies.
- TypeScript, production build and extended mocked Playwright checks passed at 320/390/768/1440px, including panel bounds, dismissal, focus return and profile-menu coexistence. Desktop/mobile screenshots reviewed. Local UI only; real notification delivery remains unconnected.

## Latest local styling — circular sidebar profile restored (2026-09-21)

- Mitchell requested the circular profile icon alongside the name and three dots. Restored the initials avatar at a compact 24px size, kept name/dots on desktop and avatar/dots on mobile. Email remains inside the account popup. Browser checks passed at 320/390/1440px for the circle, dots, menu and overflow.

## Latest local styling — sidebar profile name and dots (2026-09-21)

- Mitchell requested a name-only sidebar profile with three dots beside it. Removed the trigger avatar/email, added Feather horizontal dots at the right, and retained the existing account popup and identity header inside it. Mobile uses the compact three-dot control with its full accessible name and 44px minimum target width.
- TypeScript and focused browser checks passed at 320/390/1440px for name/dots, menu opening, Escape/focus return and overflow. Desktop screenshot reviewed.

## Latest local styling — Members table border (2026-09-21)

- Mitchell clarified that the member rows need an enclosing border. Added a 1px neutral border and 8px rounded corners around the Members table, retaining row dividers and removing the doubled bottom edge. Scoped to Members; records, controls and workspace colors unchanged. Focused browser checks passed at 390/1440px for border, row dividers and no page overflow; desktop screenshot reviewed.

## Latest local fix — persistent Members table (2026-09-21)

- Mitchell pointed out the missing Members table. The previous request-state change hid the entire table while loading, on errors and with empty/search-no-match results. The Member / Role / Account status header and table now stay mounted in all states, with feedback below and actual account rows after a successful response. Search, retry and Invite popup remain intact.
- TypeScript and the existing mocked Playwright regression passed, including new assertions for persistent column headers during loading/error/empty/no-match states and desktop/mobile checks. No backend changes.

## Latest local foundation — Railway interactions and data states (2026-09-21)

- Playwright now reaches authenticated Railway. Inspected People, profile menu, Invite popup, loading skeleton/spinner and Templates empty state. No reference-account mutations. Details and reusable rules are in `docs/railway-dashboard-reference.md`.
- Added grouped 280px profile popup with identity header, existing account/workspace/resources actions and sign-out. Members, Applications and Invitations open a native 448px Invite modal. It reuses the existing Member-only API, validates email, prevents duplicate submission, retains errors/input, displays success and a local inbox link, and restores trigger focus. Pending operations visibly indicate progress.
- Added shared loading/empty/error states for the session, member directory and invitation history, with retry and search-clear actions. Data loads on view entry and pending GETs cancel on exit. Successful sends refresh history only when needed. Session focus checks are deduplicated; transient failures preserve the dashboard while 401 clears authentication. Unconnected areas remain honest previews, with no fake data or delays. Sidebar/workspace colors, Inter and Feather are retained.
- TypeScript and production build passed; comprehensive mocked-auth Playwright checks passed at 320/390/768/1440px for requests/states, invitation send/revoke/error/retry, modal/menu keyboard and focus, palette, reduced motion, role boundaries and sign-out. Screenshots reviewed. Runnable check: `scripts/check-dashboard-states.js` via Playwright MCP. Existing `scripts/check-auth.mjs` updated for modal/menu changes; full database-backed browser suite not rerun this pass. No backend or dependency changes. Local and unpublished.

## Latest local styling — Railway account settings (2026-09-21)

- Mitchell rejected the old Link-style settings and requested Railway `/account`, focusing on essential controls. Inspected the signed-in reference without editing any fields. Replaced centered avatar/gray grouped rows/dialog with a 200px account section menu, 48px column gap, Railway typography, two-column inline Name/Email fields (6px corners) and Update info action. Phones stack fields and wrap section links. Reference notes: `docs/railway-account-reference.md`.
- Scope: Account information (name saves through existing `PATCH /auth/me`; email read-only with administrator guidance), Account access (actual role, invitation-only access, sign-out), Support (existing support view). Removed unsupported phone/address/passkeys/integrations/notification/policy/delete controls. No new backend capabilities. Sidebar/workspace colors and Feather icons retained.
- Preserved blank/max-length validation, pending state, error retention/retry, success feedback and sidebar-name update; editing is now inline. Production build and TypeScript passed; mocked-auth browser checks at 320/390/768/1440px passed for layout/overflow/backgrounds, readonly email, section links/support, save/validation/retry/reload and sign-out. Desktop/mobile screenshots reviewed. Existing auth regression updated; full database-backed browser suite not rerun. Local and unpublished.

## Latest local styling — official Feather icons (2026-09-21)

- Mitchell requested replacing custom dashboard icons with Feather after confirming Railway uses Feather SVGs. Downloaded official v4.29.2 SVG geometry into shared `app/dashboard/feather-icon.tsx`, replacing the previous custom helper and separate search/plus/close/external-arrow glyphs across navigation, account/settings, Members and preview views. Uses Feather's 24px viewBox, two-pixel rounded strokes, existing rendered sizes and colors; SVGs are decorative/non-focusable and control labels remain intact.
- No runtime package dependency added. Upstream MIT attribution is distributed at `public/licenses/feather.txt`. Typography, sidebar/workspace backgrounds, layout and behavior are unchanged. Production build, TypeScript and focused browser checks passed at 320/1440px for SVG attributes, background preservation, search, invitations, account menu, profile dialog close and no overflow/page errors. Desktop screenshot reviewed. Local and unpublished.

## Latest local feature — Railway People styling in Members (2026-09-21)

- Mitchell requested Railway's People page for Members, including search and Railway typography throughout; clarified that only the sidebar and workspace background colors must stay. Those remain `#f5f5f5`/`#fdfdfd`. Inter is already installed locally; navigation/headings now use Railway's regular weights, neutral selection, text tones and brighter purple primary action. This supersedes the typography/selection restoration below.
- Re-inspected the signed-in People page and expanded search (208×34px desktop). Members now has a single toolbar with Members/count, Applications, Invitations, expandable search and Invite; a plain table with avatar/name/email, Role and Account status; no redundant filters, preview intro or fabricated records. Mobile controls wrap and retain larger touch targets.
- Asked whether to connect local records or keep a UI preview; no response received, proceeded with the stated local-record assumption. Added admin-only `GET /auth/members`, returning only id/name/email/role/active through existing authorization and local API guards. Search filters name/email case-insensitively with trimmed input. Includes loading, empty/no-match, error/retry and Escape/close focus restoration. Directory includes local member and administrator accounts, not an independent membership registry. Local-only list loads all accounts; paginate before production scale.
- Production build/TypeScript passed. Disposable PostgreSQL/Mailpit auth suite passed, with directory 401/403 checks and exact safe-field assertions. Mocked browser checks passed at 320/390/768/1440px for results/filtering/clear, preserved backgrounds, typography, no overflow, invitations, error/retry and member-role navigation. Empty state/mobile toolbar fit and live API route verified separately. Desktop/mobile screenshots reviewed. Existing auth browser regression updated; full database-backed browser suite not rerun. Local and unpublished.

## Latest local refinement — original dashboard typography and palette (2026-09-21)

- Mitchell requested keeping the Railway layout while restoring WisConnect's prior dashboard fonts/colors. Kept the existing local Inter font; restored 500-weight navigation and 600-weight headings, gray shell (`#f5f5f5`), near-white workspace (`#fdfdfd`), lavender selection (`#eae7ed`/`#422d5b`), gray fields and original neutral text colors. The 220px sidebar, header, spacing, table structure and behavior remain unchanged.
- Focused mocked-auth browser checks passed at 320/390/1440px for palette, font weights, retained layout, no horizontal overflow and invitation access. Existing auth regression typography expectation updated. CSS-only change; production build not repeated. Local and unpublished.

## Latest local styling — Railway dashboard shell (2026-09-21)

- Mitchell approved applying the Railway direction. Dashboard/admin now share a white 220px sidebar, static cooperative identity, compact 36px desktop navigation with 16px icons/neutral active fill, bottom account control, 56px workspace breadcrumb header, and an independently scrolling main panel with 1px border/8px corners. Existing Phase 1 menu and WisConnect purple are retained. No workspace switching, resizing or notification features were invented.
- Content uses a centered 826px desktop column, lighter 28px headings with separate 14px subtitles, flatter cards, underlined category controls and simpler table borders. Members/Applications has an Invite member action opening the existing invitation view. Local inbox remains inside Invitations; profile editor/settings and role boundaries are unchanged. Section changes reset workspace scroll and focus the heading. Phones keep the disclosure menu, natural page scrolling and 44px touch controls.
- Production build, TypeScript and mocked-auth Playwright checks passed for both roles at 320/390/768/1440px: every destination, layout dimensions, independent desktop scrolling, section scroll reset, invitation/inbox access, Finance selection, profile editor and mobile Escape; zero page errors or horizontal overflow. Desktop home/member table and mobile screenshots reviewed. Existing auth regression updated for Railway dimensions/scrolling. Full database-backed browser suite not rerun. Local and unpublished.

## Latest design study — Railway workspace (2026-09-21)

- Mitchell requested studying Railway's dashboard/sidebar/workspace as a possible better direction for WisConnect. Inspected the signed-in `/workspace/people` tab in the user's regular Chrome through read-only DOM measurements. Recorded findings and recommendations in `docs/railway-dashboard-reference.md`; desktop only, no reference account changes or WisConnect UI changes.
- Observed current 220px sidebar (resizable), 36px rows/14px text/16px icons, neutral active fill, 56px workspace header, independently scrolling white panel with 1px border/8px corners, and a centered People table with tabs/search/Invite above it. Recommended adapting this shell to existing Phase 1 navigation while retaining WisConnect purple and working account flows; avoid adding multi-workspace or notification behavior without an actual need.

## Latest local refinement — compact Phase 1 dashboard menu (2026-09-21)

- Mitchell rejected the long full-platform menu and requested Link-like compact styling with Phase 1 priorities. This supersedes the menu below. Admin: Home, Members, Businesses, Finance, Projects, Documents, Reports; Team & access below a divider. Members: Home, My membership, My business, Documents. Settings/Support/Sign out stay in the profile menu, without duplicated sidebar links.
- Members contains Directory/Applications/Invitations; Finance contains Payments/Investments. The local Email inbox link is inside Invitations. Later-phase menus are omitted. Existing functional invitations/profile remain connected; operational record pages are still labeled previews.
- Desktop fine-pointer rows are 36px with 20px icons and no group headings; touch targets remain 44px. Fixed mobile Escape handling when focus stays on the Menu trigger. Production build and TypeScript passed. Mocked-auth Playwright checks passed for both roles at 320/390/1440px, every destination, parent selection, invitation/inbox access, name dialog, mobile dismissal and overflow; zero page errors. Desktop screenshot reviewed. Existing auth regression updated; full database-backed browser suite not rerun. Local and unpublished.

## Latest local UI foundation — full dashboard menu (2026-09-21)

- Mitchell requested the real dashboard menu so UI planning can begin. Added role-aware navigation based on the contracted platform scope. Admin groups: Cooperative (Members, Applications, Businesses, Projects), Finance (Payments & dues, Investments, Reports), Resources (Documents, Website content), Commerce (Marketplace, Orders), Administration (Team & permissions, Invitations), Account and Local tools. Members get their membership/business/finance, documents/training/messages/news, commerce and account sections. Full mapping: `docs/dashboard-navigation.md`.
- Each new section opens an explicitly marked UI preview with scope copy, category selectors and empty table headings. Reports covers Financial/Sales/Membership/Activity/Impact; Website content covers Pages/News/Events/Gallery. No fake records or balances, new APIs or implied completed workflows. Existing invitations, profile editing, account menu, sign-out and local inbox remain functional.
- Desktop navigation scrolls separately from the logo/profile control. Mobile now has a Menu disclosure rather than an excessively long horizontal strip; selection closes it and focuses the heading, Escape closes it and returns focus. Wide table headers scroll independently of the readable empty state.
- Production build, TypeScript and mocked-auth browser checks passed for all 16 admin / 13 member destinations at 320/390/1440px, category changes, role visibility, mobile dismissal and no page overflow. Profile menu/name dialog preservation checked at 320px. Screenshots reviewed; existing auth regression now checks menu scope and report previews. Full database-backed browser suite not rerun. Local and unpublished.

## Latest local feature — editable profile name (2026-09-21)

- Mitchell asked to update his profile. Connected name editing first and asked an optional scope question about photo, sign-in email, or all profile fields; no answer received during implementation. Settings → Name opens a native dialog with current name, validation, cancel/Escape, pending state and retryable errors. Saving updates the database, profile heading, sidebar name and avatar initials.
- Added authenticated `PATCH /auth/me` for name only, reusing the signup name validator. The server derives the target user from the session and rejects extra fields, including email/role. Existing CSRF/local-only boundaries and a per-user throttle apply. No migration, new dependency or edits to Mitchell's real account.
- `npm run auth:check` passed against its disposable schema, including saved-name persistence, unauthorized/CSRF/invalid/extra-field denial and user isolation. Three-width browser checks with mocked responses passed for dialog fit, blank validation, cancel/Escape, failed-save retention/retry and save/reload. TypeScript passed; editor screenshot reviewed. Existing browser auth script now includes name persistence; full database-backed browser run not repeated.
- Production build passed. Email/photo/phone/address updates and other unavailable settings are still unconnected. Settings/help copy now accurately states that name editing works. Local and unpublished.

## Latest local styling — Link-style account menu and settings (2026-09-21)

- Inspected Mitchell's existing signed-in Link Chrome tab using process-specific ScriptingBridge/Apple Events; the isolated browser redirects to login. Reference measurements and scope are in `docs/link-account-reference.md`. The Name dialog was inspected and closed without saving; no reference account changes.
- Sidebar identity is now a profile button opening a native popover with Settings, Support and Sign out. Matched Link's 224px white menu, 14px corners and shadow, retaining 44px controls. Keyboard navigation, Escape/focus restoration, outside/Tab dismissal, resize closing and mobile placement work. Standalone sidebar sign-out moved into this menu.
- Settings opens the account view with a 60px pane header, centered 560px content, 80px purple avatar, name/email, and four compact gray groups. Includes personal details, security/connections, notifications and support/policy rows, plus sign-out/deletion. Actual name/email/role render; unsupported edits, security/preferences/legal/deletion actions are disabled, with a clear read-only/unavailable note. Support and sign-out retain their existing behavior.
- Production build, TypeScript and four-width mocked-auth browser checks passed with no uncaught browser errors; desktop/mobile screenshots reviewed. Existing auth regression updated for profile-menu navigation and settings. Full database-backed suite was not rerun; no real accounts or emails changed. Local and unpublished.

## Latest local update — invitations inside the dashboard (2026-09-21)

- Follow-up: added an administrator-only “Email inbox” shortcut in the dashboard menu, opening `http://localhost:8025` in a new tab. Asked optionally whether Mitchell meant the inbox or each invitation’s signup link; no reply before proceeding with the stated inbox assumption. Desktop/mobile link and overflow checks and TypeScript passed.
- Mitchell clarified that invitation management belongs inside the dashboard. Invitations is now an administrator-only dashboard tab, retaining the sidebar, profile, sign-out and workspace styling. Clicking it stays on `/dashboard/`; direct `/admin/` visits also render the dashboard shell with Invitations selected. Removed the separate invitation page banner, signed-in paragraph and redundant workspace link.
- Existing invitation creation, history and revocation API actions are reused. Members cannot access the form or invitation API through this UI; direct `/admin/` shows the denial within the dashboard. Server authorization is unchanged. Invitation delivery remains local Mailpit testing only.
- TypeScript and production build passed. Focused browser checks covered 320/390/768/1440px, tab navigation, required validation, mocked create/revoke, direct admin visits and member denial; no uncaught browser errors. Screenshots reviewed. Existing auth browser regression now checks in-dashboard invitation navigation; full database-backed suite not rerun. No real invitations sent. Local and unpublished.

## Latest local fix — sign-out returns to login (2026-09-21)

- Dashboard, administrator and signed-in login screens now share one sign-out handler. After the API confirms logout, it replaces the current route with `/login/`, instead of clearing React user state and exposing the old inline sign-in screen. Failed logout retains the screen and displays the error for retry.
- TypeScript and focused browser checks passed for all three entry points, including API failure/retry with mocked responses. Existing auth browser regression now requires `/login/` and the current login heading after sign-out; full database-backed suite not rerun. Local and unpublished.

## Latest local fix — dashboard after sign-in (2026-09-21)

- Administrator sign-ins incorrectly landed on the older `/admin/` invitation screen (“Member access · Local test / Invite a member”). Login submission and the already-signed-in Continue link now both open `/dashboard/` for either role. Administrators can still open Invitations explicitly from the dashboard menu.
- TypeScript and focused browser checks passed for administrator/member sign-in and Continue navigation using mocked auth responses; no real account changes or emails. Added the administrator landing/Continue regression to the existing `scripts/check-auth.mjs`; its full database-backed suite was not rerun for this routing-only change. Local and unpublished.

## Latest local styling — signup matches login (2026-09-21)

- Signup now reuses the login presentation: white surface, centered narrow content, rounded gray inputs, purple pill action, logo/header and Help footer. Removed the older signup textile/eyebrow presentation. Accessible field labels, password guidance, invitation gating and account creation logic remain.
- TypeScript and production build passed. Browser checks compared login/signup input styles at 320/390/768/1440px, checked overflow, labels, token removal, password mismatch and missing-invitation states; invitation lookup was mocked in a separate test tab, with no account creation or email. Desktop/mobile screenshots reviewed. Local and unpublished.
- Local API was restarted with `npm run dev:api`, alongside Colima and `npm run auth:up`; health reported database connected. Verify processes again when resuming.

## Latest local styling — contact form preview (2026-09-21)

- Mitchell moved on to the contact form. Implemented Stripe-style centered 608px white card, 6px corners, soft purple-tinted shadow, thin three-step progress lines, 48px controls, 26px desktop heading, and purple Continue action. Phones stack labels over fields inside the existing rails. White page background and logo remain.
- Three interactive steps: email/country, name/optional organization, then inquiry topic/message. Native validation, Back/completed-step navigation, post-render heading focus and in-tab answer retention work. Countries are formatted once on the server and passed into the client form to avoid browser/Node Intl naming differences causing hydration errors. No new dependency.
- Asked optionally whether this pass should also deliver messages; no answer before proceeding with the stated design-preview assumption. Message delivery is not connected: the Send button is disabled and a visible note says messages are not sent. No submission, email draft, storage or backend work was added.
- Production build/TypeScript passed; desktop/mobile screenshots reviewed; browser checks cover five layout widths, validation, three-step navigation, focus, retained answers and reduced motion. Runnable check: `node scripts/check-contact.mjs` with the existing isolated Chrome on port 9222. Local and unpublished.

## Latest local styling — contact rails and logo (2026-09-21)

- Mitchell supplied Stripe’s contact/sales page and requested setting up the rails and WisConnect logo first, with that form styling as the next direction. Inspected the live desktop/mobile page. `/contact/` now has a white frame, a 76px desktop / 66px mobile logo header, a thin horizontal header rule and full-height outer rails. Desktop rail width is 1266px; phone/tablet insets stay consistent with WisConnect. Logo links home.
- Main area stays empty for this first pass. Form measurements and intended styling are recorded in `docs/stripe-contact-reference.md`; no fields, step flow, delivery logic or background artwork added. CSS is scoped to contact and reuses the global rail pseudo-elements.
- Verified at 320/390/768/1440/1920px: loaded logo, aligned rails, correct header heights and no horizontal overflow. Desktop screenshot reviewed. Local and unpublished.

## Latest local update — empty contact page (2026-09-21)

- Mitchell clarified that Contact should navigate to a page, not open email, and explicitly requested an empty page. Added `/contact/` with Contact page metadata and no rendered content. Desktop/mobile Contact actions, the general-contact dropdown link and footer Contact now use that route. Partnership email links remain purpose-specific. Local and unpublished.

## Latest local styling — navigation Contact action (2026-09-21)

- Added an outlined Contact action immediately before Join us on desktop, with an 8px gap. Uses the existing `mailto:hello@wisconnect.co` destination. Compact desktop spacing keeps the navigation fitting at 960px; phones retain the existing Contact us action beside membership in the full-screen menu. Focused browser layout checks passed at 320, 390, 960, 1024 and 1440px. Local and unpublished.

## Latest local styling — Stripe-style navigation (2026-09-21)

- Mitchell requested Stripe’s navigation/dropdown styling and sizing with WisConnect’s own content. Inspected live desktop/mobile reference with Playwright; measurements are in `docs/stripe-navigation-reference.md`. Header is now 76px desktop / 66px mobile, with a 1262px maximum dropdown aligned at x=89/y=71 on a 1440px viewport. White surfaces, 32px desktop column insets, subtle rules, 6px corners, soft shadow and 5px page blur follow the reference. WisConnect logo, purple links, language picker and Join remain.
- Four existing primary labels are now disclosure buttons: Our story, The cooperative, Our people, Businesses. Each opens three content groups and a featured panel using the existing stock images. All destinations are existing homepage sections, membership or contact. Enterprise cards have stable `enterprise-0` through `enterprise-5` IDs so sector links scroll to the correct card. No future account/marketplace links were added.
- Supports click, desktop hover with a short leave grace period, arrow keys, Escape (including hover-only opening), outside dismissal, and reduced motion. Phones use a full-screen menu and separate submenu view with Back, fixed bottom actions, focus containment, inert background and scroll lock. Focus moves after React commits the submenu, avoiding a discovered requestAnimationFrame race. Dropdown height follows WisConnect content, as Stripe’s own menus also vary by content; buttons retain 44px touch targets.
- Verification: production build/TypeScript and full seven-width homepage regression passed, including four dropdowns, dimensions, phone focus/scroll handling, existing carousels, stories, sticky stack and navigation. Playwright confirmed desktop hover switching, hover Escape, Back, forward/reverse focus wrapping, reduced motion, 960×600 fit and direct navigation to the Training card. Desktop/mobile screenshots reviewed; no uncaught browser errors. Local and unpublished.

## Latest local styling — Stories from the network (2026-09-21)

- Mitchell requested the gallery styling of Stripe’s “What’s happening / See the latest from Stripe,” four original cooperative story concepts and stock photography. Inspected the live reference with Playwright. Replaced the old placeholder feature/news/event/gallery blocks with an expanding four-image gallery, changing copy, numbered navigation and a native “Read the story” dialog.
- New heading: “Good things grow together.” Stories cover enterprise, shared ownership, knowledge exchange and community connections. These are labeled editorial previews, with no invented member identities, dates or achieved outcomes. Stock photo credits and source links appear in each reader; provenance and reference measurements are in `docs/stripe-stories-reference.md`.
- Uses the existing ivory/purple/plum/gold palette, CSS flex transitions, installed Motion for copy, and native mobile scroll snapping. Arrows, keyboard Home/End/left/right, touch swiping, resizing, reduced motion and dialog Escape/focus restoration are supported. Eight locally optimized WebP assets cover 640/1400px widths. No new dependency or publication.
- Verification: production build/TypeScript passed; desktop/mobile screenshots and reader reviewed with Playwright; touch swipe and reduced-motion behavior confirmed. Full seven-width homepage regression passed, including all four story readers, navigation and reduced motion, with no uncaught browser errors. A pre-existing header test race was fixed by waiting for the scroll-to-top event before the next scroll assertion. Playwright also confirmed retained story selection across desktop/mobile resizing.

## Latest local styling — clean lavender impact background (2026-09-21)

- Mitchell rejected the remaining blue in Stripe's pre-dawn gradient. Replaced the blue/periwinkle and saturated violet stops with a restrained white-to-lavender gradient (`#FFFFFF`, `#FAF8FC`, `#EEE5F3`, `#DCCFE4`). Map colors and all interactions remain unchanged. This supersedes the exact pre-dawn palette below. Local and unpublished.

## Latest local styling — pre-dawn impact background (2026-09-21)

- Mitchell preferred Stripe's pre-dawn palette over the dark blue night version and explicitly kept the map colors. Selected Pre-dawn on live Stripe and measured its exact pale-lavender/violet radial gradient, dark `#061B31` heading/active text, and purple `#8A35DF` sliding indicator. Applied those to Impact; secondary text uses darker `#5B657C` for readability. Map asset, opacity, route/pin/label colors, controls, and animations remain unchanged; no theme switch.
- Verification: desktop/mobile Playwright confirmed background, dark heading, working statistic/country selection, retained map and no horizontal overflow; screenshots reviewed. Production build includes TypeScript. Existing regression palette expectation updated; full regression was not rerun for this CSS-only adjustment. Local and unpublished.

## Latest local styling — Stripe night impact section (2026-09-21)

- Mitchell explicitly requested the styling/effects of Stripe's “The backbone of global commerce,” keeping WisConnect's map and omitting the light/time-of-day switch. This supersedes the earlier white/serif impact design and the color study's white impact recommendation. Inspected live desktop/mobile reference; measurements and adaptations are in `docs/stripe-impact-reference.md`.
- Impact now uses the measured navy/violet radial night gradient, centered white sans-serif heading, 48px desktop metrics, thin rules, and sliding highlights. Native metric buttons preview the highlight on hover/focus and select on click/Enter. Selection retraces map routes and briefly pulses markers; reduced motion shows final states immediately. No new dependency or copied Stripe artwork/font; effects use CSS and installed Motion.
- Original `impact-world.svg`, geographic positions, country controls, content, and illustrative-result disclosures remain. Map routes glow white; the country caption has a pale backing for contrast. Mobile keeps a two-by-two metric grid and country controls. No theme switch was added.
- Verification: production build/TypeScript and full seven-width Chrome regression passed, including metric selection/keyboard, map controls, existing carousels/stacking and reduced motion. Playwright confirmed hover indicator movement, marker animation, immediate reduced-motion state, retained map and absent theme switch; desktop/mobile screenshots reviewed. No uncaught browser errors. Native test Enter helper now supplies its carriage-return text and waits for React state. Local and unpublished.

## Latest local styling — original hero portrait restored (2026-09-21)

- Mitchell requested restoring `hero-visionary-960.webp`. Hero now uses that original portrait and its existing 640px responsive variant; descriptive alt text and the image optimizer source follow the restored asset. White background, current color system, and layout remain. Replacement image files are retained. Local and unpublished.

## Latest local styling — shared homepage color system (2026-09-21)

- Mitchell approved implementing the background study. Desktop visionaries (761px+) now use a full-width quiet lavender surface; removed the concentric rings while preserving the scroll-open portraits. Phones retain their existing visionary background/layout.
- Homepage uses the existing shared tokens: white nav/hero/enterprises/impact, ivory programs/stories/Capital, lavender Join/Communities, plum footer, and a plum-to-purple People panel. Cooperative text/actions/selector states now use the same purple, lilac, white and gold tokens; Clay peach/lime/brown/green colors were replaced. Story cards stay white on the ivory section. Changes are scoped to `app/page.module.css`; content, photographs, layout, interactions and other routes remain intact.
- Verification: production build/TypeScript and full seven-width Chrome regression passed, including portraits, dialogs, enterprise interactions, stacking, keyboard, and reduced motion. Playwright desktop/mobile screenshots and section colors reviewed. Body/button contrasts are at least 4.91:1 across the checked pairs; the large gold heading has at least 3.45:1 on the brightest gradient endpoint. No uncaught browser errors. Local and unpublished.

## Latest design study — background color system (2026-09-21)

- Mitchell feels the desktop visionaries background and wider color system need direction; requested studying Stripe's backgrounds. Research only, no application styling changed or palette approved. Inspected live Stripe using Playwright: repeated white and pale blue-gray surfaces, navy developer section, violet actions, expressive hero artwork and a time-of-day statistics gradient.
- Findings and proposed section mapping: `docs/color-study/stripe-background-study.md`. Recommendation uses existing resolved WisConnect tokens: white, mist `#F7F3F8`, sand `#FAF8F5`, plum `#291833`, purple `#563578`, gold `#B9955A`. Proposes quiet lavender for desktop visionaries, removing rings; harmonizing the Clay peach/lime cards is a proposal only. Retain requested white nav/hero and existing layouts/animations if implementing later.
- Inline comparison `docs/color-study/wisconnect-backgrounds.html` uses real member portraits with lavender, ivory, and subtle lavender/gold glow options. Simplified comparison layout is not a proposed replacement for the scroll-open composition. Desktop/mobile switches, image loading, overflow and color contrast verified. Gold is decorative/on dark surfaces, not small text on white (2.8:1).

## Latest local styling — Stripe-inspired member enterprises (2026-09-21)

- Mitchell requested the cards, layout, hover motion, and slide interactions from Stripe's “Build a foundation for your startup that enables faster growth.” Inspected the live reference with Playwright; measurements are in `docs/stripe-enterprises-reference.md`. Existing six sector titles, descriptions, photographs, section copy, and membership destinations are preserved.
- Cards use tall 332:448 desktop media (358:373 on phones), 6px corners, 16px gaps, image-overlay sector titles, descriptions below, and square arrow controls. Hover/focus widens the media horizontally and shifts neighboring images while copy stays still; inverse scaling preserves photo/title proportions. Desktop shows three cards and a partial next card; phones show one.
- Arrows and keyboard navigation advance with the measured eased slide using installed Motion. Mouse drag includes a bounded momentum settle, prevents accidental link activation, and restores native snapping. Touch scrolling stays native. Reduced motion skips hover/slide animation. Controls retain 44px targets; no new dependency or copied Stripe assets.
- Verification: production build/TypeScript and full seven-width Chrome regression passed, including hover/neighbor geometry, stable copy, keyboard access, drag/link suppression, rapid clicks, reduced motion, and existing sticky stacks. Playwright touch swipe snapped to the next card; desktop/mobile screenshots reviewed. No uncaught browser errors. Local and unpublished.

## Latest local update — duplicate cooperative section removed (2026-09-21)

- Follow-up: Mitchell requested removing the textile beneath the stack. Removed that strip; Member enterprises now follows the stack directly. Playwright confirmed the strip is absent and the hero textile remains.
- Verification: production build/TypeScript, full homepage regression including adaptive stacking and mobile layouts, and Playwright anchor checks passed; no broken homepage anchors or uncaught browser errors.
- Mitchell requested removing the old “How the cooperative works / People. Capital. Communities.” section now that its content appears in the three-card stack. Removed that standalone photo section. The `#cooperative` anchor now belongs to the stack, preserving header, hero, and dashboard destinations. Card secondary actions progress to Capital, Communities, then Member enterprises. The textile divider remains before Member enterprises. Updated existing regression checks for the removed section; mobile card sizing now references the retained member cards. Local and unpublished.

## Latest local styling — People, Capital, Communities card stack (2026-09-21)

- Adaptive-height fix verification: production build/TypeScript and full homepage regression passed, including six added viewport checks down to 800 × 600. Playwright mouse-wheel input confirmed People → Capital → Communities and reverse scrolling at 1440 × 720. Reduced-motion/keyboard checks passed with no uncaught browser errors.
- Stacking follow-up: Mitchell reported that the effect worked in the test browser but not his window. Reproduced at 1440 × 720: the original 820px minimum-height query disabled it. Removed that height cutoff and lowered the width breakpoint to the existing two-column threshold (761px). A native ResizeObserver measures the card height; the sticky offset adapts to viewport height so lower content remains reachable. Phones and reduced-motion users still get the normal vertical layout; keyboard-visible focus still releases overlap. This supersedes the earlier short-window fallback note below.
- Verification: production build/TypeScript, full seven-width native Chrome regression including card order/overlap/reversal, source images/palette, keyboard focus, mobile/reduced-motion fallback, and contrast checks passed. Playwright also confirmed live desktop stacking and short-window fallback. Desktop/mobile new-card screenshots reviewed; native regression reported no uncaught browser errors.
- Mitchell explicitly requested Playwright inspection of Clay's scrolling feature cards, then asked for two more cards using the existing cooperative content/photos. The purple portrait card remains People; Capital reuses `cooperative-shop.jpg` and “Resources become enterprise,” while Communities reuses `cooperative-market.jpg` and “Local commerce strengthens local life.” Existing descriptions and real destinations are reused; the original cooperative section remains.
- Measured Clay's peach `#fff3ed` and lime `#fcfee2` surfaces directly in Playwright and used those for the new cards. Capital uses Clay's brown/orange text. Communities keeps its dark green text with a darker olive `#686800` accent for accessible button/label contrast. New text/button pairs pass at 5.31:1 or higher.
- Native CSS sticky cards cover one another on screens at least 1000px wide and 820px tall. Desktop rows match the tallest card, preserving readable content. Narrow/short screens and reduced-motion preferences use normal vertical cards; keyboard-visible focus releases the overlap so covered controls remain reachable. No new dependency. Existing People selectors, section dividers, and original assets remain. Local and unpublished.

## Latest local styling — section dividers (2026-09-21)

- Production build including TypeScript passed.
- Mitchell requested lines between every homepage section, starting with the hero. Each of the nine top-level sections now has one thin bottom rule aligned with the outer page rails; inconsistent section top/bottom borders are suppressed. Existing internal card/row lines and textile ribbons remain. Native Chrome checks passed for all nine dividers at eight widths from 320px to 1920px; desktop/mobile hero screenshots reviewed. Local and unpublished.

## Latest local styling — WisConnect belief colors (2026-09-21)

- Verification: production build/TypeScript, seven-width native Chrome regression, keyboard/reduced-motion checks, and contrast checks passed. Desktop/mobile section screenshots reviewed; no uncaught browser errors.
- Mitchell invited a bolder WisConnect color treatment for “When women own.” Replaced the Clay blue palette with a deep-plum-to-Wisdom-Purple gradient, warm-white heading, golden “communities grow” and primary action, and lilac selector states. The orange-blazer portrait, wording, layout, and destinations remain. Hover and focus colors follow the palette. Text contrast checks pass at 6.55:1 or higher across the chosen surface/text pairs. Local and unpublished.

## Latest local styling — cooperative belief portrait (2026-09-21)

- Verification: production build including TypeScript, browser-script syntax, and exported-image/background assertions passed. Browser regression was updated but not rerun for this swap.
- Mitchell requested `Confident portrait in orange blazer.png` in place of the belief-section animation while keeping the background. Copied the supplied image from Downloads into `public/assets/` and created 640px/1080px WebP derivatives. The pale blue panel, copy, selectors, actions, and responsive layout remain. Removed the unused video playback state/control; reference video files are retained but no longer displayed. Browser regression assertions now expect the portrait. Local and unpublished.

## Latest local styling — replacement hero portrait (2026-09-21)

- Mitchell supplied `public/assets/image-gen-5.png` and requested it as the hero image. Homepage now uses transparent 640px/960px WebP derivatives of that image; the existing optimizer targets the new source. Original image and previous hero assets are retained. Dimensions remain 1122 × 1402; white background and existing layout remain. Local and unpublished.

## Latest local styling — white hero background (2026-09-21)

- Follow-up clarification: Mitchell wants the navigation white too. Header now remains solid white while scrolling; mobile menu and language dropdown surfaces also use white. Focused CSS verification passed. Local and unpublished.
- Mitchell requested a white hero background, excluding the navigation. Set the homepage hero background to white and removed the mobile purple glow override. Navigation, textile, portrait, and layout are unchanged. Local and unpublished.
- Verification: focused CSS assertion and production build (including TypeScript) passed.

## Latest local styling — Clay-inspired cooperative belief

- Full-reference correction: Mitchell rejected changing only the background and explicitly requested the same Clay treatment. Applied measured navy `#001433`, vivid blue `#395afa`, pale blue `#bedffe`, white secondary button, 48px panel corners, and more generous visual height. Typography uses Arial (Clay’s declared fallback), not an unlicensed copy of Roobert. Replaced the warm generated artwork with Clay’s actual blue reference animation and a static poster; preserved the generated files. Source/provenance and the requirement to confirm reuse rights before publication are in `docs/clay-reference.md`. Local preview only. Native video playback pauses offscreen, in hidden tabs, for reduced motion, and via its visible control; no dependency added. Existing cooperative copy, selectors, destinations, and rail insets remain.
- Video verification exposed that the installed Motion reduced-motion hook snapshots the initial preference instead of subscribing to changes. Replaced that homepage preference source with a native `matchMedia` subscription and hydration-safe initial state; existing consumers share the corrected value. This also avoids server/client disagreement about rendering the video control.
- Full-reference verification passed: production build, TypeScript, seven-width native Chrome regression, measured palette assertions, video pause/resume, selectors, keyboard focus, live reduced-motion changes, and no uncaught browser errors. Reviewed refreshed desktop/mobile screenshots. No publication performed.
- Background follow-up: Mitchell requested Clay’s original section color. Changed only `.beliefCard` from lavender to the previously measured Clay pale blue `#f0f8ff`; purple accents, original artwork, layout, and interactions remain unchanged.
- Mitchell requested the styling of Clay’s “Get data from the most complete data marketplace” feature at https://www.clay.com/ for “The belief behind the cooperative.” Inspected the live desktop section and computed geometry in native Chrome. Replaced the old manifesto presentation with a rounded lavender two-column panel, layered eyebrow pill, compact sans-serif heading, lower selectors/actions, and a large right-hand illustration. Phones stack the copy and image; the panel and all content remain inset from the existing page rails.
- People, Capital, and Communities buttons switch cooperative-specific descriptions, with native keyboard activation, visible focus, pressed state, and a polite live region. Existing ownership messaging and working Join/cooperative destinations are retained. No Clay claims, customer logos, proprietary fonts, or artwork copied. No changes to authentication, dashboard, navigation, paused Join design, or other homepage sections.
- Created an original purple/gold ceramic-sculpture illustration with built-in ImageGen. Optimized local WebP assets are `public/assets/belief-sculpture-640.webp` (~19 KB) and `public/assets/belief-sculpture-1080.webp` (~49 KB); final prompt/provenance is in `docs/belief-artwork.md`. This is a still image with a one-time, reduced-motion-aware entrance, not Clay’s looping 3D video. Reused installed Motion, existing asset/base-path helper, native buttons, and scoped CSS; no dependency added.
- Production build, TypeScript, and the full native Chrome homepage regression passed at 320/390/620/768/1024/1440/1920px. Added assertions for belief rail insets, responsive layout, image loading, 44px targets, all selector descriptions, keyboard activation/focus, and action destinations. Desktop/mobile screenshots reviewed. Test harness now selects the requested local origin and brings its tab forward to avoid background animation throttling. No uncaught browser errors; physical devices and other browser engines remain untested.
- Local, uncommitted, and unpublished. Preserve all other active migration/member-access work. No push or deployment was requested for this change.

## Latest local styling — member dashboard workspace

- Sidebar Inter refinement: the sidebar already inherited the dashboard’s local font. Standardized all navigation labels and Sign out to 500 weight / 20px line height; profile name now uses 14px/20px at 500 instead of 13px/550. Original logo image is unchanged. No duplicate font loader or new dependency. Eleven-width native Chrome checks explicitly verify menu/profile/sign-out font-family matches the dashboard heading; navigation/auth flow and TypeScript passed. Local only.
- Font follow-up: Link’s live Home font metadata confirms loaded Inter (variable), 600-weight greeting and 500-weight card titles; Matter was registered but unloaded and was not copied. Previously the global CSS merely named Inter without supplying a font. Added the official unmodified Inter Variable 4.1 upright WOFF2 from https://rsms.me/inter/ with its SIL OFL license and source README under `app/dashboard/fonts/`. Existing `next/font/local` self-hosts/scopes it to the dashboard root; no font package or external runtime font service added. Matched observed letter spacing (-.015em body, -.021em greeting, -.006em card/row titles). Landing page and login typography are unchanged. Eleven-width native Chrome tests explicitly verify loaded local variable-font metadata/asset requests plus layout, keyboard focus, and auth behavior; build/typecheck passed and desktop/mobile screenshots reviewed. Local, unpublished.
- Card-detail follow-up: measured Link’s card descendants read-only, without transaction text. Applied its .5px / black 12% border, 24px corners (including mobile), 0 10px 20px / black 4% shadow, 36px icon tiles with 10px corners, and compact 14px/20px + 12px/16px resource text. Public-resource rows now have 52px minimum height, no dividers, and a subtle gray hover/keyboard-focus surface; only actual links appear interactive. Updates use an icon-and-copy row, account rows are tighter, and data/body text uses neutral tones. No content, account actions, global layout, or dependencies changed. Native Chrome eleven-width card geometry/touch/focus checks and full disposable auth regression passed; desktop/mobile screenshots reviewed; production build and typecheck passed. A pre-existing integration-test helper could select an older email when testing replacement invitations; it now selects only newly arrived message IDs. This is test-only, with no auth implementation change. Still local/unpublished.
- Link-measured correction (supersedes the generic spacing pass below): Mitchell rejected the prior proportions and asked to inspect his signed-in `https://app.link.com/home` Chrome tab. Read only DOM geometry/computed styles after he enabled JavaScript from Apple Events; no account actions, payment data, cookies, or credentials accessed. At 1440px Link has a 256px sidebar, 8px outer inset, 14px workspace radius, centered 800px content area, 28px/36px greeting, 48px heading-to-cards gap, 8px card gaps, and 20px card insets. Dashboard scoped CSS now follows those desktop proportions, with lighter 14px/500 card headings and more compact resource rows. WisConnect branding/content/auth remain intact; card heights stay content-driven. Mobile retains 16px card gaps and 44px navigation targets; desktop navigation is also at least 44px rather than copying Link’s 36px rows. Chrome disposable-auth regression and eleven-width checks passed, including assertions for measured desktop geometry; desktop/mobile screenshots inspected, production build and TypeScript passed. Local only, no publication. User may disable Chrome’s JavaScript-from-Apple-Events permission now. Chrome had two instances: default AppleScript targeted the test instance; process-specific Apple Events reached the actual Link tab. Re-discover processes/tabs next session rather than relying on old IDs.
- Spacing refinement: applied a consistent 4/8px-based rhythm informed by IBM Carbon spacing/grid guidance and GOV.UK fixed/responsive spacing. Dashboard CSS now uses 16px card gaps, 24px card padding (16px on phones), 64/32/24/16px responsive workspace insets, and 40/32px heading-to-card spacing. Heading and cards share a left edge; sidebar spacing and resource rows follow the same rhythm. Account labels/values stack below 481px for long email addresses; short desktop sidebars can scroll. No content, authentication, dependencies, or public-page changes in this pass. Chrome auth regression and dashboard spacing checks passed at 320/390/480/620/760/768/1024/1100/1280/1440/1920px; desktop/phone screenshots inspected. Research: https://carbondesignsystem.com/elements/spacing/overview/ and https://design-system.service.gov.uk/styles/spacing/.
- Mitchell supplied a Link dashboard reference and explicitly requested a different rail treatment from the landing page. Authenticated `/dashboard/` now has a pale gray sidebar/canvas and a rounded, thin-bordered white workspace. Landing-page fixed `main` rails are suppressed only in this workspace; content/cards remain inset. Mobile uses compact top navigation above the same rounded frame.
- Home, My account, and Help are functional local views, with active navigation and heading focus after selection. Profile name/email/role come from the existing authenticated `/auth/me` response, not mock member data. Account details are read-only. Home has an account summary, an explicitly unconnected cooperative-updates card, and working public-site links to the cooperative, visionaries, and member-enterprise sections. No balances, events, activity history, financial records, or membership metrics were invented.
- Reused existing session checks and server-side logout. `app/dashboard/dashboard-view.tsx` and its scoped CSS receive only the authenticated profile; no API/database/schema changes. Admins see an Invitations link; regular members do not. Admin invitation screen now has an Open member workspace link. The login, signup, public landing page, and paused Join designs are preserved.
- TypeScript, production build, and native Chrome flow checks passed. Tests cover the separate workspace perimeter, card insets and touch targets at 320/390/768/1440/1920px, Home/account/Help switching and focus, real test-profile data, public destinations, admin/member navigation differences, and removal of the workspace on logout. Desktop and mobile screenshots inspected. No Playwright, real devices, or other browser engines tested; no publication performed.

## Latest local styling — member login

- Focus refinement: either login input turns white while focused (click, touch, or keyboard), then returns to gray on blur. Thin filled-field border and keyboard-focus outline are retained; this is a scoped CSS-only change.
- Input refinement: login now shows “Email address” and “Password” hints inside the fields, with visually hidden real labels retained for accessibility. Empty fields use neutral gray fill/borders; nonempty fields use a thin mauve border via CSS, and keyboard focus is a restrained 1px outline. Clearing a field restores gray. No username authentication was added: Mitchell's “email and username” wording was queried, with email/password preserved pending clarification. Admin/signup fields and the backend are unchanged.
- Mitchell supplied a Link login screenshot and requested that direction for `/login`. Login now uses a white, spacious layout, small WisConnect logo, centered 440px form, compact sans-serif heading, rounded purple sign-in button, and a native Help disclosure near the bottom. Faint page rails/content insets remain. The textile and local-test eyebrow are removed only from login; the local/invitation-only disclosure remains in its footer. No placeholder legal links or public signup were introduced.
- Existing email/password authentication, autocomplete, validation, busy/error states, role destinations, and invite-only backend are retained. Login uses both fields together rather than introducing email lookup or a new multi-step flow. An already signed-in visitor gets a Continue to your account link plus Sign out. Admin, signup, dashboard, public landing page, and paused Join layouts remain unchanged.
- Reused the shared member-access component with scoped login CSS; no dependency added. TypeScript, production build, and disposable-account Chrome flow checks passed, with five-width login layout/touch-target checks, native Help disclosure, and retained admin/member authorization checks. Desktop/mobile screenshots were reviewed; corrected an inherited global dark-footer background. Nothing published.

## Latest local delivery — invite-only member access pilot

- Follow-up: bootstrap validation now exits with specific, credential-free guidance instead of a raw Pydantic traceback. Password policy remains 15–128 characters; invalid input does not reach the database. Shared auth input models also hide values when validation errors are formatted. `.venv/bin/python -m backend.check_bootstrap` checks short/long passwords, blank names, invalid email, mismatched confirmation, redaction, and valid creation using a mocked database (no real account is created).
- Mitchell approved starting the local invitation flow and asked whether a secure starting link or backend should come first. Implemented the smallest end-to-end backend-backed pilot, not a production authentication launch. Public homepage/navigation, marketplace placeholder, and rejected/paused Join work were not changed by this delivery.
- Local entry: `http://localhost:3000/admin/`. The first administrator must be created by Mitchell in his own terminal using `npm run auth:admin`; it prompts for name/email and a hidden 15–128-character password. No real administrator or permanent test credential was created. The command refuses a second administrator and does not promote existing users.
- `npm run auth:up` runs existing PostgreSQL plus loopback-only Mailpit (SMTP 1025, inbox `http://localhost:8025`). `npm run db:migrate` adds users, invitations, and opaque sessions. `npm run dev:api` enables the local auth flag, binds 127.0.0.1:8001, and ignores proxy headers. Colima, these containers, the Next dev server, and the API were started for this session; verify processes before restarting them.
- Admin signs in, invites an already-approved member, and can revoke a pending invitation. Mail is intercepted locally, never delivered externally. A 256-bit email-bound link `/signup/#token=…` expires in 24 hours and is consumed once with a PostgreSQL row lock. The fragment is removed after reading and is only retained in memory; reopen the email after refresh. Activation cannot choose a role or different email and creates only a member. After activation the member explicitly signs in at `/login/`, then sees a minimal `/dashboard/` account screen. The full member dashboard, application approvals, selling permissions, and marketplace remain unimplemented.
- API enforces active accounts, admin roles, hashed opaque eight-hour sessions, logout revocation, request Origin/header checks, generic credential failures, bounded local throttling, and salted scrypt password hashing (stdlib; no new Python/JS dependency). Invitation/session bearer tokens are hashed in PostgreSQL. Cookies are HttpOnly/SameSite=Strict; HTTP/non-Secure is restricted to this local pilot, not a production recommendation. API auth is off without `WISCONNECT_LOCAL_AUTH=1`, and the UI is off outside localhost:3000 or in Pages base-path builds. Do not tunnel/proxy this pilot to the internet.
- New UI uses a shared scoped `app/member-access.tsx`/CSS module for admin, signup, login, and account screens. Header/textile/page rails remain consistent and content stays inset. The public menu still has no account links. Static HTML contains no account data; the API is the access-control boundary.
- Verification: TypeScript and production static build passed. `npm run auth:check` uses a disposable PostgreSQL schema and only its own synthetic Mailpit messages; checks concurrent single-use redemption, expiry/revocation, SMTP rollback, validation/role injection, member/admin authorization, CSRF, expired/inactive/logged-out sessions, throttling, and explicit local opt-in. `npm run auth:check -- --browser` uses isolated native Chrome/CDP on 9222, not Playwright, and redirects API requests to its disposable server. Browser flow passed end-to-end plus 320/390/768/1440/1920px rail/touch-target checks; desktop admin and phone signup screenshots were inspected. Real devices and other browser engines remain untested.
- README contains startup, account setup, tests, security references, and launch gaps. Production needs separate API/database hosting, HTTPS/Secure cookies, real email, admin MFA/recovery, shared limits/audit logs, breached-password screening, and security review. None was provisioned or deployed. All edits remain local/uncommitted; prior homepage and Join edits remain intact.

## Latest direction — original menu restored

- Mitchell requested removing the new account/shop entries and restoring the original landing-page menu. Header now contains Our story, The cooperative, Our people, Businesses, the existing Join us button, and EN/FR. No dropdown grouping was introduced.
- `/signup`, `/login`, and `/marketplace` remain empty routes for later, but are not linked in the header. No account, marketplace, dashboard, or Join implementation was changed. The earlier simplified-navigation notes below are superseded.
- TypeScript and focused Chrome checks passed for restored destinations, menu fit, and mobile dismissal at 320, 390, 960, 1024, and 1440px. Still local and unpublished.

## Latest local update — public navigation

- Simplified the homepage navigation to About (`#about`), Marketplace (`/marketplace`), Sign in (`/login`), and the existing Join us button (`/join`). EN/FR retains its desktop/mobile placement. Reused the existing menu, spacing, and dismissal behavior; no homepage sections were removed.
- Marketplace and login are deliberately empty placeholder routes. `/signup` remains empty and available, but no longer appears as a separate header item. No authentication, shopping, or dashboard access is implemented; do not expose a public dashboard link or imply that creating an account grants membership.
- The discussed future model separates customer accounts from approved membership and selling permission. That remains a proposal, not implemented access control. Join redesign remains rejected/paused as noted below.
- Seven-width homepage Chrome checks, new navigation mapping/destination checks, and production build passed. Desktop/mobile navigation screenshots were inspected. All changes remain local and unpublished.

## Latest direction — Join paused; empty signup route

- Mitchell rejected the Join onboarding layout because it did not respect the established rails and content insets. Leave it unmodified and unpublished until he returns to it; the implementation notes below describe work done, not an approved design.
- He then explicitly narrowed the member-login request to only a link and an empty `/signup` page. Added “Sign up” to the homepage navigation (inside the menu on mobile) and a blank route. No form, account creation, authentication, or dashboard was implemented.
- Navigation/link checks passed at 320, 390, 960, 1024, and 1440px; the production build exports `/signup/`. Changes remain local and uncommitted.

## Latest local update — guided Join onboarding

- Mitchell approved replacing the long `/join` information page with a four-step application: Welcome, About you, Your contribution, Review. Desktop pairs a purple community-image panel with the form; phones show a compact welcome, then a focused single-step layout. The start button sits above the benefits, with email-delivery disclosure nearby. Membership expectations remain available in an expandable section.
- Reuses the five existing fields: name, email, location, expertise, and contribution. Answers remain in React memory between Back/Continue and review edits; no account, storage, backend, or dependency was added. Required/email/whitespace validation prevents empty progression. Step changes focus the current heading; reduced motion disables transitions. Review Edit buttons return directly to review after validation.
- Delivery remains explicitly email-based: “Open application email” prepares an encoded `mailto:` URL, not a server submission. The handoff message says to send in the email app and does not claim receipt or membership. Clipboard copying and a selectable read-only application-text fallback support unavailable email apps or denied clipboard access. No actual application was sent during testing.
- Implemented in `app/join/page.tsx` and `app/join/page.module.css`. `node scripts/check-join.mjs [join URL]` uses the same isolated Chrome/CDP approach as the homepage check, without Playwright; it prevents the email link's default action during verification.
- Passed checks at 320, 390, 620, 768, 900, 1024, 1440, and 1920px: all steps, required/email/whitespace validation, keyboard Tab/Enter and heading focus, retained answers, review edits, touch targets, email encoding, clipboard success/failure, and reduced motion, without browser errors. Desktop/mobile screenshots were inspected. TypeScript, normal production build, Pages production build, and exported base-path/no-JavaScript-fallback assertions passed. Physical devices and Safari/Firefox remain untested.
- Local and uncommitted, not deployed. The earlier homepage scroll and portrait changes remain intact and unpublished too. Do not push without Mitchell requesting publication.

## Latest local update — page-wide scroll rhythm

- Added one-time upward entrances to section headings, cooperative photos, enterprise cards, service rows, impact numbers, story cards, participation links, and footer columns. Desktop entrances use a short stagger; phones use shorter 12px movement without stagger delays. Existing hero, manifesto, visionary stack, and map-route animations are preserved.
- A native IntersectionObserver and scoped CSS coordinate the new entrances, without a scrolling library or scroll interception. Content stays visible before hydration or without JavaScript. Focused links skip the entrance, and reduced motion disables the new effects. Supported desktop browsers also get a gentle scroll-linked zoom settling on cooperative photos; other browsers retain static images.
- Replaced the cooperative's separate Motion entrance definitions with this shared rhythm. No dependencies added. Seven-width native Chrome regression, new desktop/mobile top-to-bottom motion checks, keyboard and reduced-motion checks, TypeScript, production build, and static-export visibility assertions passed. Desktop/mobile cooperative screenshots were inspected. Safari/Firefox and physical-device checks remain outstanding.
- This and the preceding portrait-stack delivery are local and uncommitted, not published. Do not push without Mitchell requesting deployment.

## Latest local update — stacked visionary portraits

- On animated desktop layouts, the visionary portraits now start perfectly aligned with no peeking cards or name panels. The visible portrait crossfades every three seconds while the collapsed stack is on screen. Rotation pauses during scroll spreading, profile hover/focus, open dialogs, hidden tabs, and offscreen viewing; a visible Pause/Resume portraits button gives manual control.
- Existing scroll-open positions remain intact. Names, profile actions, and number badges appear at the end of the spread. Keyboard focus on a profile still opens the composition immediately; focusing the playback control does not. Mobile sliding and static/reduced-motion layouts are unchanged.
- Reused the existing Motion scroll value, native interval, and scoped CSS; no dependency added. Seven-width native Chrome checks passed, including exact stack alignment, automatic switching, pause/resume, delayed labels, dialogs, mobile carousels, and reduced motion. Desktop collapsed/open screenshots were inspected; TypeScript and production build passed.
- These changes are local and uncommitted, not deployed. The preceding published release is `9c957f8` (successful Actions run `35513116038`). Do not publish again without Mitchell requesting it.

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

## Historical handoff — September 20 release

This snapshot is retained for traceability. Use the September 22 handoff at the top for current release, browser permissions, implemented features, and local-work status.

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

The current `wisconnect-site` working tree is the active website direction, including its uncommitted changes. See the dated handoff at the top for the latest verified commit and recorded publication status. The working tree's current content, visual system, assets, structure, and interaction choices take priority over older concepts discussed in prior sessions.

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

## Historical working-product snapshot — September 20

The implementation/release inventory below predates the account/dashboard work and subsequent frontend releases. It is background only; the current handoff and newer dated entries above take precedence.

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
