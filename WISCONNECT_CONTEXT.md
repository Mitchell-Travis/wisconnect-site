# WisConnect master context

Last updated: 2026-10-20. Read the active admin goal and backend review below first, then the dashboard/mobile and Applications/account updates. Dated entries further down retain historical decisions and verification.

## Full worktree release (20 October 2026)

- Published the accumulated dashboard/backend/CI work and the homepage and directory changes as `b5b71d0` on `origin/main`. GitHub Actions: [Pages deployment](https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/39471161948).
- Both frontend builds, TypeScript, `npm audit`, `git diff --check` and all 13 backend suites passed. GitHub Actions passed its backend and frontend checks, built the Pages export and deployed successfully.
- Post-deployment request verified the live homepage exposes “Land · Capital · Communities,” Momentum Coffee and BDavis Designs. Gallery implementation and source details: `docs/reviews/2026-10-20/business-directory-galleries.md`; release record: `docs/reviews/2026-10-20/release.md`.

## Official business directory galleries (20 October 2026, published)

- Added three official photos to Momentum Coffee and BDavis Designs detail panels. Directory cards keep their brand treatments; photos remain lazy-loaded until a detail panel opens. Momentum uses its CDN's responsive 640px/960px sizes and automatic format selection. BDavis photos are local WebP in 640px/1200px variants (about 323 KiB total).
- Linked both businesses to their official websites in the static catalog and added migration `0013_official_business_websites` for database-backed records. Alt text and fixed image dimensions are included. Source and image processing details: `docs/reviews/2026-10-20/business-directory-galleries.md`.
- Gallery photos are lazy-loaded only in the expanded detail panels. Published in the 20 October release above.

## ILAVA business directory entry (20 October 2026, published)

- Confirmed Sikola’s 15 October forwarded email, “Ilava’s logo,” containing Rahel Mwitula Williams’s signature as Founder of ILAVA: It Can Be Done, with `myilava.com`. Added ILAVA to the public catalog as a Chicago ethical fashion and lifestyle business and linked Rahel’s existing founder profile.
- Used the official website from the signature. Left Rahel’s phone number and email out of the public listing. Added an SVG recreation of the supplied logo mark and tagline from the email preview.
- Added a new `0012_ilava_business` migration so the database-backed directory receives the same published listing. The historical `0008_businesses` migration seed remains untouched. The initial listing work preceded the release documented above.
- On Mitchell’s feedback, set the ILAVA directory tile to show its logo on a warm neutral card. The expanded business details now show a three-photo gallery sourced from ILAVA’s official website. Updated the published-listing migration and API’s exact-image allowlist for the gallery’s primary photo. Published in the 20 October release above.

## Land · Capital · Communities section (20 October 2026, published)

- Mitchell asked to replace the former “People, Capital, Communities” framing with the new “Land · Capital · Communities” tagline. Updated the home hero, cooperative pillar section, mobile selector and related navigation/story labels. The first pillar now describes land and commercial space as an aspiration, not an existing guarantee.
- Replaced the People portrait with a Pexels stock photo of a rural woman farmer standing in a sunlit field, by Mehmet Turgut Kirkgoz ([photo](https://www.pexels.com/photo/woman-standing-on-farm-11576236/), [license](https://www.pexels.com/license/)). This is a new photo, distinct from the agriculture image already used by the Enterprise rooted in place story. The Land pillar currently uses responsive sizes from Pexels' image CDN; the sandbox could not resolve the CDN host to download a local copy.
- Published in the 20 October release above. The Land image uses responsive sizes from Pexels' image CDN.

## Homepage and account updates published (14 October 2026 UTC)

- Mitchell requested the push. Released the 19 approved frontend files as `8217fe3` on `origin/main`: hero wording/spacing, directional desktop navigation, lighter people-section background, shared account chrome/glow, three-step Contact, compact Join application and new licensed Contact/Join photos. This supersedes the local-only status in the entries immediately below.
- Exact isolated release passed the GitHub Pages production build and TypeScript with `GITHUB_ACTIONS=true`; whitespace passed. Deployment succeeded: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38510749949.
- Live Chrome verification confirmed the new homepage heading and pale people-section gradients, enabled Contact drafting and three-step progress, loaded Contact/Join photos, and shared glow animations on Contact, Join and Login. No form or email submitted. Screenshots: `docs/reviews/2026-10-14/accounts-release/live-people.png` and `live-contact.png`. Live site: https://mitchell-travis.github.io/wisconnect-site/.
- The larger dashboard/backend/CI migration, notes, drafts and associated assets were included in the 20 October release documented above.

## Lighter people-section background (14 October 2026 UTC, local)

- Mitchell requested a lighter background for “People behind the businesses.” Changed the MemberStories color field to near-white cream with pale lilac at the edges, and reduced the thread texture opacity from 0.4 to 0.16. Portraits, text and scroll/rotation behavior unchanged.
- Production build/TypeScript and whitespace passed. Chrome checked revealed desktop portraits and mobile background/no horizontal overflow. Screenshot: `docs/reviews/2026-10-14/people-lighter/desktop.png`. Viewport reset. Local only, not pushed; earlier work preserved.

## Account photography replaced (14 October 2026 UTC, local)

- Mitchell disliked the Contact/Join photographs and asked for better imagery. Searched Pexels and replaced them with candid-style business scenes: RDNE Stock project’s woman at a sunlit café window with laptop/phone (10376295), and PICHA Stock’s three women sharing ideas with notebooks/laptop (3894383). Optional candid/editorial preference question received no response; proceeded with stated candid direction.
- New `account-contact-cafe-{640,1200}.webp` and `account-join-conversation-{640,1200}.webp` assets, ~335 KiB total, retain original source pixels and use CSS framing. Updated accurate alt text and visible illustrative-photo credits. Contact remains 440px tall on its first desktop step; membership welcome image now has a compact 1.18 aspect ratio preserving all three faces. Images stay hidden on mobile and later steps. Old assets preserved.
- Pexels source/license verified and provenance saved in `docs/reviews/2026-10-14/account-photos/sources.json`. These are illustrative photos, not identified cooperative members. Production build/TypeScript and whitespace passed. Chrome verified both loaded images at 1440px, Join sizing at 1024px, and both hidden at 390px with no overflow. Viewport reset. Screenshots `contact.png` and `join.png` in the same review directory. Local only, not pushed.

## Visible shared account background motion (14 October 2026 UTC, local)

- Mitchell reported the glow still did not look animated and asked for it on all pages with the account nav/footer. Inspection confirmed old Contact overlays were running but faint; AccountShell had no glow. Replaced overlays with a full moving purple/gold color field plus light layer, using 12s/9s transform cycles and negative delays so motion is underway at first paint.
- One shared BackgroundGlow now serves Contact, Join and AccountShell (Login, Signup and Password reset). Removed Join’s separate pseudo-element implementation. Foreground cards stay stationary above the background. Desktop >=960px only; mobile and reduced-motion keep static backgrounds.
- Mitchell explicitly asked to remove the play/pause icon. Removed the control and its state entirely; decorative animation is now automatic. This supersedes earlier pause-control notes.
- Production build/TypeScript and whitespace passed. Chrome verified all five desktop routes have the same two animations, all five 390px routes have no animation/control/overflow, and final Login has zero background controls. Timed samples confirmed actual changing transforms (~132px horizontal movement between samples) while the card rectangle stayed fixed. Reduced-motion condition code-reviewed. Screenshots in `docs/reviews/2026-10-14/shared-glow/`, final `login-final.png`. Viewport reset; Login preview left open. Local only, not pushed; prior work preserved.

## Contact shortened to three steps (14 October 2026 UTC, local)

- Mitchell said Contact’s form and image were too long and requested steps. Replaced the single form with Your details (name/email), Your message (topic/message), and Review with edit/back controls. Answers persist between steps; each step validates its fields and moves heading/error focus. Desktop photo is capped at 440px on the first step only; subsequent steps use a centered 608px card. Mobile has no photo.
- The 127.0.0.1/production preview previously disabled all fields when its API was unavailable. It now permits local drafting and prepares an email only at Review, with copy/plain-text fallback and honest “nothing submitted” messaging. API availability gates, POST payload, request ID, timeout, busy state and success receipt remain; no backend configuration was changed. Existing sector-prefill preserved.
- Mitchell’s “not working” followed the glow request: glow had only been installed on Join. Added desktop-only Contact glow through `app/background-glow.tsx` and CSS module with pause/resume, static mobile/reduced-motion fallback. Join’s prior glow remains.
- Production build/TypeScript and whitespace passed. Chrome exercised empty/invalid-email/message validation, forward/back/edit answer retention, Review email URL, sector prefill, 320/390px no overflow, desktop pause/resume and mobile hidden glow. No email or API message submitted; fictional test answers cleared. Viewport reset; clean Contact preview left open. Screenshots: `docs/reviews/2026-10-14/contact-steps/`. Local only, not pushed; prior work preserved.

## Desktop membership background glow (14 October 2026 UTC, local)

- Mitchell requested a gently moving glow in the background, with no animation on mobile. Added two broad lilac/gold radial overlays to Join only, drifting with transform/opacity on 18s and 23s alternate cycles. White form/card stays stationary. Animation and its small pause/resume control are enabled only at >=960px and `prefers-reduced-motion: no-preference`; mobile/reduced-motion retain the original static gradient.
- Chrome verified correctly sized glow layers, running/paused/resumed state, image-free application card, and 390px hidden layers/no animation/no control/no overflow. Reduced-motion condition code-reviewed. Production build/TypeScript passed; final layer sizing fix browser-verified; whitespace passed. Screenshot: `docs/reviews/2026-10-14/join/desktop-glow.png`. Viewport reset. Local only, not pushed.

## Join page matches login and contact (14 October 2026 UTC, local)

- Mitchell requested the same treatment on `/join/`. Reused AccountHeader/AccountFooter with membership skip-link target and no invitation-only footer note; added the same purple/gold background, white card, rounded controls and purple focus rings.
- IMPORTANT follow-up: Mitchell rejected imagery while applying. Photo now appears only on the desktop welcome screen. All question/review/receipt steps use a centered 608px white card without imagery; mobile hides imagery even on the welcome screen and omits its extra introductory paragraph. Existing multi-step behavior, validation, review/edit/cancel, direct submission gates and email fallback are preserved.
- Production build/TypeScript passed; final CSS adjustment verified in Chrome, whitespace passed. Exercised required-field errors, filled fictional preview answers through review, edit/cancel retention and correct email-draft contents without opening/sending email. Checked 390px and 320px for overflow, desktop image-free form, and skip-link focus. Cleared test answers; preview left at first question, viewport reset. Screenshots: `docs/reviews/2026-10-14/join/`. Local only, not pushed; earlier homepage/contact and backend/dashboard work preserved.

## Contact page matches login (14 October 2026 UTC, local)

- Mitchell requested login styling, navigation and footer on Contact, with imagery on desktop and a direct mobile experience. Contact now reuses AccountHeader/AccountFooter, the login purple/gold color field, white rounded card, input borders/focus rings and button styling. Desktop uses the existing phone-conversation photograph beside the form; below 960px it is hidden, and below 620px the extra intro copy is also hidden.
- Shared chrome accepts optional skip-link target/label and invitation-note visibility; login defaults are unchanged. Contact skip link focuses its H1 and its footer omits the account invitation note. Form submission, validation, sector prefill and existing unavailable/email fallback logic remain unchanged.
- Production build/TypeScript and whitespace passed. Chrome verified desktop loaded imagery and footer, 390px and 320px without horizontal overflow, mobile menu open/close, contact skip focus, and unchanged login skip/invitation defaults. Existing preview has submissions disabled with the email fallback visible; no message sent. Viewport reset. Screenshots: `docs/reviews/2026-10-14/contact/{desktop,mobile}.png`. Local only, not pushed. Prior homepage changes and backend/dashboard migration preserved.

## Desktop directional navigation (14 October 2026 UTC, local)

- Mitchell approved hiding the desktop header on downward scroll and revealing it on upward scroll; mobile navigation is already fine and remains unchanged. Applied only at >=960px. Always visible near the top (first 160px); ignores small movement, hiding after 32px downward travel and revealing after 8px upward travel. Passive scroll listener is batched through requestAnimationFrame.
- Open menus/language controls and keyboard focus keep navigation available; focusing a hidden header reveals it immediately. Desktop transition is 240ms, removed for reduced motion. Header stays in layout so content does not jump.
- Production build/TypeScript and whitespace passed. Chrome verified desktop hide/show (header y=-120/0), keyboard-open submenu persistence during downward scrolling, and mobile sticky header/menu open-close at 390px. Reduced-motion CSS was code-reviewed. Viewport reset; screenshots in `docs/reviews/2026-10-14/desktop-navigation/`. Local only; not pushed, along with the hero text/spacing changes below. Backend/dashboard migration preserved.

## Hero identity wording (14 October 2026 UTC, local)

- Artwork spacing follow-up: Mitchell asked for a little more space around the hero imagery. Added a responsive 24–36px desktop column gap (32.4px at 1440px); reduced the desktop headline cap from 66px to 64px to preserve its three-line composition. Mobile artwork top spacing increased from 16px to 32px, keeping its full 342px width at a 390px viewport. Desktop artwork remains contained at 561 × 660px; verified mobile no-overflow and 32px gap. Local only.
- Mitchell clarified that “Black Women Business Development & Resource Center” must replace the large headline. Corrected the H1 to that exact wording and moved “Build your business. Share in what grows.” into the small identity label above it, following his original request to move that copy there. The earlier label-only interpretation is superseded.
- Preserved typography, with “& Resource Center” in the existing purple italic style. Checked desktop plus 390px and 320px wrapping without overflow; whitespace passed. Screenshot: `docs/reviews/2026-10-14/hero-wording/corrected-desktop.png`. Viewport reset. Local only, not pushed.

## Selective entrances published (14 October 2026 UTC)

- Mitchell requested the push. Released only `app/page.tsx`, `app/section-entrance.tsx` and its CSS module as `0d7badf` on `origin/main`. Existing backend/dashboard/CI migration and unrelated assets remain local and preserved.
- Isolated release build with `GITHUB_ACTIONS=true`, TypeScript and whitespace passed. GitHub Pages build/deployment succeeded: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38504663456.
- Live homepage verified in Chrome: all three Purpose word groups use the new word entrance, and all three participation steps use the step entrance. Screenshot: `docs/reviews/2026-10-14/section-entrances/live.png`. Live site: https://mitchell-travis.github.io/wisconnect-site/.

## Selective Link-inspired entrances (14 October 2026 UTC, now published above)

- Mitchell approved subtle Link.com-inspired entrances specifically in two sections, stressing that the effect must not appear everywhere. Added word-by-word upward fades only to the Purpose introduction and mission/vision body copy; added sequential upward entrances only to the three participation steps in “Start with what you bring.” Existing headings, photos, hero, W, portraits and final invitation retain their motion/layout.
- `app/section-entrance.tsx` and its CSS module provide once-per-visit IntersectionObserver triggers, 7px/480ms word movement with at most 650ms stagger, and 24px/600ms step movement with 110ms stagger for steps entering together. Each paragraph/step observes its own visibility for mobile. No scroll locking or looping. Server/no-JS content remains readable; reduced motion stays static and preference changes stop the effects. Continuous screen-reader text is separate from the aria-hidden animated words.
- Production build/TypeScript and whitespace passed. Browser checked desktop word/step animation styles, complete copy, mobile wrapping at 390px without overflow, offscreen steps without active animations on fresh load, and final readable states. Reduced-motion behavior was code-reviewed, not OS-emulated. Evidence: `docs/reviews/2026-10-14/section-entrances/`. Viewport reset; preview left open at http://127.0.0.1:3000/. Local only, not pushed; active backend/dashboard work preserved.

## Homepage release published (14 October 2026 UTC)

- Mitchell requested pushing the current changes. Committed and pushed the six homepage files as `2dcbfee` to `origin/main`: restored original cooperative photographs and approved eight-second hero performance, playing once and holding its final frame. No closing bridge was generated; its separate upload/credit permission remains pending.
- An isolated copy of the exact release passed the GitHub Pages production build and TypeScript with `GITHUB_ACTIONS=true`; whitespace checks passed. GitHub Pages build/deploy succeeded: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38502766718.
- Verified https://mitchell-travis.github.io/wisconnect-site/ in Chrome: new hero video loaded with `loop=false`, and all three restored cooperative photos loaded. Live screenshot: `docs/reviews/2026-10-14/cooperative-restored/live.png`.
- Backend/dashboard/CI migration, context notes, drafts and unrelated asset changes remain uncommitted and preserved. Index clean after release.

## Original cooperative photographs restored (14 October 2026 UTC, now published above)

- Mitchell asked to add back the images in “A cooperative of businesses.” Restored the original storefront portrait, Urban Bread bakery and market-vendor photographs (`cooperative-model`, `cooperative-businesses`, `cooperative-community`) in the W collage, story chapters and static fallback. Kept the current W reveal, layout and pacing. Generated `cooperative-story-*` assets remain available but are no longer used here.
- Restored photo-specific crops and accurate intrinsic dimensions, including the portrait bakery image. Footer label is “Illustrative photography.”
- Production build/TypeScript and whitespace checks passed. Browser verified restored sources on desktop, the 390px mobile W, and loaded fallback photos with motion disabled at 844 × 390; no horizontal overflow at either responsive size. Screenshots: `docs/reviews/2026-10-14/cooperative-restored/`. Viewport reset. Local only; no commit, push or deployment. Active backend/dashboard migration and hero ending approval state below remain preserved.

## Approved hero performance; ending revision pending (14 October 2026 UTC)

- Mitchell liked the revised eight-second exchange (“nice”), so it was re-integrated locally. Native Higgsedit trial added a half-second dissolve back to the first frame; Mitchell then said the ending looked wrong. The dissolve visibly doubles faces/bodies and is rejected. Saved trial as `output/video/hero-rejected-dissolve.mp4`; edit script `output/video/hero-loop-edit.jsx` is historical, not approved.
- Removed the dissolve: `public/assets/hero-shared-enterprise-exchange.mp4` currently contains the approved original eight-second scene (12,410,218 bytes). `HeroAnimation` is connected and currently plays once, holds its last frame, and offers resume/replay. Automatic looping is removed pending a clean closing segment. Original still fallback, contain sizing and pause behavior remain.
- Proposed repair: three-second Kling 3.0 Pro physical return from last frame of approved scene to its first frame, exact MCP quote 5.25 credits. No bridge job submitted. Frame upload slots reserved: start `5f63fd50-3248-497c-9664-f4a0d84a321a`, end `55f59a7d-c003-4da0-b900-eb48bef773b6`, but uploads were blocked by automatic approval review because specific authorization for these extracted-frame uploads was required. Confirmation was unsuccessful; do not use these slots as confirmed media yet. Asked Mitchell for permission to send the two frames to Higgsfield and use 5.25 credits; answer pending. Do not bypass the rejection.
- The approved-exchange integration production build, TypeScript, desktop/390/320 playback/sizing/pause checks passed before ending feedback; temporary one-shot correction TypeScript and whitespace pass. No publish, push or backend changes. Prior generation history below is retained.

## Earlier hero rejection and revision (14 October 2026 UTC)

- Mitchell rejected the generated hero clip: it does not meet his creative expectations. Do not treat the prior technical QA or completed-local entry as creative approval.
- Disconnected `HeroAnimation` from the homepage and restored the intact 960px still at the existing dimensions. Draft component, video and provenance remain available for revision; nothing published or deleted.
- Mitchell selected a combination of clear natural exchange, more expressive/lively collaboration, and subtle motion with better realism. Submitted a new eight-second Kling 3.0 Pro silent take using the confirmed white reference only as the start frame (no locked end pose). Job `6c1992c2-5dbe-4703-bc91-aab329ea8cf6`, exact MCP quote 14 credits. Directed explaining gesture → seated response and gold-clad colleague joins → shared smile and return to work. Exact request in `output/video/hero-higgsfield-exchange-job.json`. Review the result with Mitchell before re-integrating; technical rendering alone is not creative approval.
- Revised take completed: `output/video/hero-higgsfield-exchange.mp4` (1288 x 1608, 24fps, 8.042s, silent, 12,410,218 bytes). Inspected one-second full-scene samples and closer face/hand samples. Clearly larger gestures and interaction from all three women; shared laughter and return toward the laptop. Full framing retained. Not a seamless loop: end pose differs. Needs Mitchell's creative review before optimization/loop treatment and re-integration. Generation widget and direct clip delivered; still remains on homepage. Still-restoration production build/TypeScript and whitespace checks passed; browser verified no video and loaded visible still. No deployment.

## Earlier Higgsfield hero animation trial (14 October 2026 UTC, rejected)

- Higgsfield MCP tools are now available. Generated a five-second silent Kling 3.0 Pro scene with identical start/end references. First job `6faa8819-0572-4308-abc6-3d9bfffe090c` rendered transparent pixels black and was rejected for integration. Composited the published reference onto white and generated corrected job `6ad3542f-c798-4e7a-a4e4-24a23ff2255c`. Each MCP quote was 8.75 credits (17.5 total quoted); initial balance 110 credits. No subscription/upgrade or website generation used.
- Reviewed sampled frames and first/last frame pair: gentle character movement, stable full-body/furniture framing, white background and closely matching loop poses. Originals, exact prompts/settings and job records are under `output/video/`. Optimized delivery: `public/assets/hero-shared-enterprise-loop.mp4`, H.264, 960 x 1200, 24fps, 5.042 seconds, no audio, 251,763 bytes. Higgsfield optimized media ID: `a98fc945-a521-4bd1-8f12-fa2751177b7b`.
- Added `app/hero-animation.tsx`: original 960px transparent still remains the initial/poster/reduced-motion/error fallback, muted inline looping, offscreen/hidden-tab pausing, and accessible 44px pause/resume control. Video blends into the existing sand/lilac/gold treatment. Full contain sizing preserved: desktop 576.93 x 660px at 1440px; mobile 342 x 427.5px at 390px and 280 x 350px at 320px. The pre-existing 640px `.webp` deletion and `.png` file remain untouched; inspection found the `.png` actually contains WebP data. Hero now uses the intact 960px still rather than the missing srcset asset.
- Final production build/TypeScript and whitespace checks passed. Chrome verified playback, pointer pause/keyboard resume, full-offscreen pause, desktop/390/320 sizing, 44px control and no horizontal overflow or captured warnings/errors. Reduced-motion/error fallback and hidden-tab handling were code-reviewed; OS preference and actual background visibility changes were not exercised. Screenshot: `docs/reviews/2026-10-14/hero-animation/desktop.png`.
- Local only; no commit, push or deployment. Preview server started at http://127.0.0.1:3000/ (session 80376); prior port 3001 preview was not running. Existing backend/dashboard/CI migration preserved. This entry supersedes the tool-availability blocker below.

## Earlier handoff: Higgsfield hero video (14 October 2026 UTC)

- Mitchell is starting a new chat so the newly installed Higgsfield plugin can load. Continue the hero animation task after reading `output/imagegen/hero-video-brief.txt`; do not start the website work over.
- Goal: animate the three women themselves as a short natural video, keeping their identities, outfits, full bodies and furniture in frame. No floating/parallax substitute. Integrate only after reviewing the generated clip, preserving the existing still as poster/reduced-motion fallback and the current desktop/mobile size.
- Higgsfield plugin installation verified (`plugin_asdk_app_6a3293e129088191abf0875820e839da`), but this chat exposes no callable Higgsfield tools. User reports free trial; browser account showed Plus Plan and 110 credits. **Trial features and credits work only through Higgsfield MCP**, explicitly confirmed by the website's generation-blocking upgrade modal. Do not ask user to reconnect again, retry website generation, or purchase a plan. Discover/use the plugin tools in the new chat and check the actual MCP cost before generating.
- Original source: `output/imagegen/hero-shared-enterprise.png` (1122 x 1402 transparent PNG). Published reference URL: https://mitchell-travis.github.io/wisconnect-site/assets/hero-shared-enterprise-960.webp . Source is photorealistic, not a flat illustration.
- Browser draft: https://higgsfield.ai/ai/video?model=kling3_0 ; user tab 307886441. Chrome browser ID changed from 1 to 2 after extension restart; discover fresh bindings in a new session. Uploaded PNG successfully after user enabled file URL access. Uploaded asset selector ID `d139030d-e964-492a-ab2e-7f7f84746652`; both starting and ending frames use it. Draft: Kling 3.0, 5 seconds, 1080p, audio off, prompt enhancement off, multi-shot off. Aspect control disappears with image input. Quoted browser cost 8.75 credits is NOT a verified MCP cost. Clicking Generate was blocked by the trial restriction; no video job was created and no website code was changed. Screenshot: `/private/tmp/wisconnect-higgsfield-trial-limit.png`.
- Motion: fixed camera, left woman makes a small pointing gesture toward notebook, seated woman nods and smiles, right woman gently nods; natural blinking/breathing, white background, return to initial pose for looping. Full prompt and earlier blockers saved in hero-video-brief. Runway had zero credits; Weave required paid plan. Do not send user through those services again.
- Preserve all active uncommitted backend/dashboard/CI work. Current git status also shows hero-shared-enterprise-640.webp deleted and hero-shared-enterprise-640.png untracked; these were observed before current video work, not changed by this task. Inspect before any future integration; do not silently revert them.

## Earlier hero video request (13 October 2026, Weave attempt)

- Mitchell requested motion for the hero and clarified: **animate the women as a short video scene**, not CSS floating/parallax on the still. Do not implement a floating-image substitute.
- Inspected the source `output/imagegen/hero-shared-enterprise.png`; prepared exact scene motion, identity/framing constraints and integration plan in `output/imagegen/hero-video-brief.txt`. No hero code changed, video generated, credits spent or new push performed.
- Available Figma/Weave video workflow discovery is blocked: tool reports Figma account must be linked to Weave in https://app.weavy.ai/settings?section=profile. After linking, discover the available image-to-video workflow/model, quote its cost, and follow its explicit per-run credit approval requirement. Preserve current still as poster/reduced-motion fallback, contain dimensions and full framing.
- Follow-up: Mitchell linked the account; the connection now works. No published Weave workflows are available. Discovered Veo 3.1 Image to Video (`fg6e8647-d90a-4bad-a845-69fdc102a14j`; estimate 90 credits). Prepared an 8s, 1080p, 9:16, silent Fast run with the published hero WebP as first and last frame, restrained gestures, stable identities/full framing, white background and fixed seed 42. A quote-only `weave_run_model` call (no `acknowledgedCost`) was rejected: “This is a video model. Video models are only available on paid plans.” No video generated, no credits spent, no site changes. A paid Weave plan is required before obtaining a usable quote and asking for the tool-required per-run credit approval.

## Connected cooperative story and directory revision (13 October 2026)

- Mitchell approved creating the three connected story scenes and explicitly requested they appear through the W on desktop and mobile. Built-in image_gen produced fictional Black women working in their businesses, planning together around a shared workspace plan, then serving and connecting with their community. Recurring people, brick workspace, warm light and plum/ivory/ochre palette connect the images. Originals: `output/imagegen/story-{strengths,ownership,community}.png`; full prompts and tool mode: `output/imagegen/cooperative-story-prompts.txt`.
- New optimized 640/1400px assets use the unique `cooperative-story-` prefix. Existing `story-ownership` and `story-community` assets used elsewhere are preserved. Opening collage now follows the W mask dimensions/position, including on phones, and fades into the first chapter as the W expands. W is constrained to fit the stage. Reduced-motion/short-screen fallback also has an image-filled W, replacing its solid purple silhouette. Three chapters, fast scroll pacing and gold progress line remain. Label: “Illustrative scenes · WisConnect’s vision”.
- Mitchell rejected the four-column directory and explicitly chose **two cards per row, wider but shorter than before**. This supersedes the entry below: desktop >=1100px retains two columns with 340px-high cards (593 × 340px at 1440px) and balanced 36–48px wordmarks. Original odd-last centering, mobile/tablet and dialog presentation remain.
- Mitchell requested pushing these changes, including the preceding approved hero, lighter People palette/mobile control and smaller footer logo. Release is scoped to public homepage code/assets; active backend/dashboard/CI work remains local.
- Committed and pushed as `f508b45` to `origin/main`. Local LAN and isolated GitHub Pages production builds/TypeScript passed, as did whitespace checks. Browser verified the three scenes, image-filled W at 390/320px, desktop chapter transitions, the image-filled short-screen fallback, 593 × 340px desktop directory cards, no horizontal overflow and no captured warnings/errors. Viewport restored. Evidence: `docs/reviews/2026-10-13/cooperative-story/`. Original generated PNGs remain local; optimized assets and full prompts are committed.
- GitHub Pages deployment succeeded: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38488753358. Live site: https://mitchell-travis.github.io/wisconnect-site/. Release excludes the active backend/dashboard/CI changes, which remain uncommitted and preserved.

## Compact desktop directory and story review (13 October 2026, superseded)

- Mitchell approved smaller desktop directory cards. At widths of 1100px and above, the grid now has four columns with 320px-high cards, compact wordmarks, padding and metadata. At 1440px, the four preview cards measure 289.5 × 320px each (previously 593 × 490px over two rows). Expanded and filtered lists retain equal card widths, including the last odd card. Mobile/tablet and dialog typography remain unchanged.
- LAN production build/TypeScript and whitespace passed. Browser checked desktop 1440px, expanded and single-result layouts at 1100px, business dialog open/close, and 390px mobile with no horizontal page overflow. Viewport reset; local only, not pushed. Screenshot: `docs/reviews/2026-10-13/directory-compact/desktop.png`.
- Mitchell also asked why the cooperative story imagery does not make a strong statement. Reviewed all three source images and their chapter copy. Current storefront portrait → generic bakery → market vendor does not communicate shared ownership or community outcomes. Recommended a cohesive three-scene sequence: women actively building their businesses → collaborating and making ownership decisions → a lively community benefiting from the work. Story images/code have not yet been replaced; this is the proposed creative direction.

## Footer logo refinement (13 October 2026, local)

- Mitchell requested the footer logo a little smaller, but still readable. Reduced its width from 144px to 124px (about 14%) on desktop and mobile, preserving aspect ratio and spacing. Local preview only; not pushed.

## People section lighter gold and compact control (13 October 2026, local)

- Latest refinement: Mitchell requested the gold a little lighter again. Gold glow is now `#f7efdc` with a `#faf5ea` base; lilac, texture, portraits and compact mobile control remain. Local only.
- Mitchell requested softer color and a smaller mobile pause button, then clarified that he likes the lilac/gold palette and only wants the gold lighter. Keep the original lilac, cream, curved-thread artwork and overall color treatment. Changed gold glow from `#ddbc7c` to pale champagne `#f0e3c4`, and the gold base from `#eae0cb` to `#f5eee0`. The brief neutral/off-white trial was superseded; do not restore it.
- On phones up to 620px, replaced the wide Pause/Resume portraits pill with an icon-only corner control. Retained a 44 × 44px tap target, explicit accessible label, title, pressed state and keyboard focus indicator; desktop retains the text label. Control is positioned outside normal flow, and the scroll hint no longer reserves a separate tall row for it. Portrait shadows are slightly softer; autoplay and business destinations remain.
- Final LAN production build/TypeScript and whitespace passed. Browser verified pause/resume and pressed state, keyboard access, 44px mobile control, hidden visual label, 390/320px layouts without horizontal overflow, and the final lighter-gold treatment. Viewport restored. Screenshot: `docs/reviews/2026-10-13/people-refined/mobile.png`. Local preview only; not pushed.

## Regenerated cooperative hero (13 October 2026, local)

- Approved-artwork prominence follow-up: Mitchell liked the regenerated scene and asked it to stand out on desktop and mobile. Enlarged desktop artwork from a 560px to 660px height cap and 92% to full column width (about 18% larger visible scene). Phones now use the full content width with natural image height instead of the small fixed-height frame: 390px viewport measures 342 × 427.5px versus 234 × 292.5px previously (about 46% larger). Added a soft, static lilac/gold glow behind the artwork without a visible circle or frame. The complete composition remains contained. This supersedes the prior request to keep the old hero dimensions.
- Prominence verification: final LAN production build/TypeScript and whitespace passed; desktop, 390/320px phones and 768px tablet checked with no horizontal overflow or captured console warnings/errors. Viewport restored. Screenshots: `docs/reviews/2026-10-13/hero-presence/desktop.png` and `mobile.png`. Local preview updated; not pushed.
- Mitchell still felt the prior source image was cropped and explicitly requested regeneration reflecting WisConnect’s values. Generated a new transparent editorial-style scene with the built-in image_gen tool: three fictional Black women entrepreneurs sharing ideas, a laptop, notebooks and textile samples around a complete worktable. Full bodies, shoes, chair/table legs and surrounding space are inside the composition; purple, ivory and gold reflect the existing brand. These are illustrative people, not actual cooperative members.
- Source saved at `output/imagegen/hero-shared-enterprise.png` (1122 × 1402 RGBA). Exact prompt and tool mode recorded in `output/imagegen/hero-shared-enterprise-prompt.txt`. Transparent 640/960px WebP delivery assets are in `public/assets/hero-shared-enterprise-*.webp`. Prior supplied artwork remains intact.
- Replaced the homepage hero image and changed the identity label to “Business development & resources / for Black women entrepreneurs.” Headline and supporting cooperative description retained. Removed the extra CSS inset from the previous framing workaround because the new artwork includes its own natural margin. Contain sizing and the original hero layout/dimensions remain (desktop 530.77 × 560px).
- Final LAN production build/TypeScript and whitespace checks passed. Desktop plus 390/320px phone layouts verified: loaded image, complete scene, no horizontal overflow or captured console warnings/errors. Viewport restored. Screenshots: `docs/reviews/2026-10-13/hero-regenerated/desktop.png` and `mobile.png`.
- This regeneration is local, not pushed. Preview: http://192.168.100.16:3001/. Latest published release remains `9417c82`. Existing backend/dashboard work preserved.

## Homepage and account styling release (13 October 2026)

- Published successfully: `8fd1d6c` and framing follow-up `9417c82` are on `origin/main`. Final GitHub Pages deployment passed: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38484975766. Live homepage verified at https://mitchell-travis.github.io/wisconnect-site/ with loaded new hero, contain sizing and 16/12/24px desktop inset. Account pages retain the existing public service-unavailable gates. Uncommitted dashboard/backend work remains preserved; index is clean.
- Hero framing follow-up: Mitchell said the new image felt cropped on both desktop and phone. Kept `object-fit: contain`, removed artwork-container clipping and added inner breathing room (desktop 16/12/24px; mobile 12/8/18px). Desktop image box remains 530.77 × 560px; phone frame remains 292.5px high at 390px viewport. Full supplied artwork stays visible; no source pixels were cropped or regenerated. LAN production build/TypeScript and desktop/mobile visual checks passed. Framing correction committed and pushed as `9417c82` after the main styling release `8fd1d6c`.
- Mitchell requested publishing the approved account-page work, then added final homepage changes before the push. Hero now uses the supplied `6FF9F42D-855C-4BB6-B9DF-2FF17D70EE05.PNG`, delivered as transparent 640/960px WebP files. Kept the exact prior hero CSS/dimensions (desktop measured 530.77 × 560px before and after; mobile retains its existing frame). Removed the decorative circle; footer logo reduced from 180px to 144px.
- People behind the businesses now has a lilac/cream/gold background retaining the requested curved-thread artwork. Four stable portrait slots crossfade every six seconds through Nikki, Tiffany, Kailyn, Brandi, Chipo and Ade Wede. Labels and business destinations change with the portraits. Rotation waits while scrolling and pauses offscreen, in background tabs, during hover/focus, with an open dialog, or under reduced motion. A Pause/Resume portraits control is available; existing scroll-driven spread remains.
- Release includes the shared login/activation/password-recovery styling, Google coming-soon placeholder, prior approved announcement refinements and faster cooperative story. Backend/dashboard migration, infrastructure and CI changes remain separate local work. Published account-service availability restrictions remain unchanged.
- Validation: local LAN build and an isolated GitHub Pages production export both passed TypeScript/build. Desktop and 390/320px layouts checked; same hero dimensions, no horizontal overflow or captured console warnings/errors. Observed automatic portrait changes without scrolling and verified the rotating Ade Wede portrait opens ZE’AD business details. Phone/desktop screenshots saved locally under `docs/reviews/2026-10-13/home-final/`. Viewport restored.

## Calendly-inspired login (13 October 2026, local)

- Account-page rollout: Mitchell requested carrying the approved login styling across the account pages. Login, invitation activation, reset-link request, new-password form, and their loading/error/unavailable/success states now use shared `app/account-shell.tsx`, `app/account-field.tsx`, and `app/account-chrome.tsx`/CSS (moved from `app/login/login-chrome.*`). Same sticky navigation/announcement, footer, color-only gradient, compact white cards, type and floating labels. Activation help is an in-card disclosure; recovery has a shared password visibility toggle. Authenticated dashboards keep their existing styling. Google coming-soon remains login-only.
- Accessibility: the shared skip link focuses the account heading without changing the URL hash, preserving invitation/reset token state. Existing auth API calls, invitation requirements and token handling remain. No accounts created, emails sent or credentials submitted during this styling pass.
- Verification: production LAN build/TypeScript and whitespace passed. Browser checked recovery request, malformed-link recovery, new-password presentation using a dummy token, visibility toggle, invitation-required/help state, sign-in regression/disabled Google, keyboard skip-link focus without hash changes, and 390/320px layouts without horizontal overflow. No captured console warnings/errors. Valid invitation activation and successful password submission were not exercised. Screenshots: `docs/reviews/2026-10-13/account-pages/`. Viewport restored; local preview updated at http://192.168.100.16:3001/reset-password/. No deployment.
- Compact spacing follow-up: Mitchell felt Google coming-soon created too much space. Moved the badge inside the Google button (inline on desktop, wrapping within the same control on narrow phones), tightened the divider/membership gaps, and reduced outer/card padding. Desktop card measured 636.9px → 546.9px, whole page 1021px → 883px. Google remains disabled with the same accessible name and coming-soon description. Production LAN build/TypeScript and whitespace passed; desktop and 390/320px layouts checked, no overflow. Screenshots: `docs/reviews/2026-10-13/login-compact/desktop.png` and `mobile.png`. Viewport restored; no deployment.
- Google coming-soon option: Mitchell requested Google login with its logo and “Coming soon.” Added an outlined “Continue with Google” button below the existing sign-in action and an “or” divider, with a lilac “Coming soon” badge below. Button is native disabled, type=button, and described by the badge; no OAuth integration, redirects or new authentication behavior. Official current full-color logo stored locally at `public/assets/google-g-logo.png`, downloaded from https://developers.google.com/static/identity/images/g-logo.png via the Google Identity branding guidelines. Existing email/password flow remains.
- Verification: production LAN build/TypeScript and whitespace passed; browser confirmed disabled state, accessible coming-soon description, loaded logo, desktop and 390/320px layouts without horizontal overflow. Screenshots: `docs/reviews/2026-10-13/google-coming-soon/desktop.png` and `mobile.png`. Viewport restored; local preview updated, no deployment.
- Image concept rejected: Mitchell asked to remove the photo and restore the color background. Removed the decorative photo and its CSS, restored the previous 48px mobile padding and retained the amethyst/lilac/gold gradients. Keep the login background color-only. The earlier image experiment is recorded in `docs/reviews/2026-10-13/login-image/`; original shared photo asset remains for its other uses. Navigation and forms remain unchanged.
- Latest visual pass: Mitchell requested a more imaginative background color treatment only. Replaced the flat purple-to-beige login backdrop with layered CSS gradients: deep amethyst at the lower left, lilac light across the upper left/center, violet at the upper right and a warm gold glow at the lower right. Kept the white card, layout, navigation and form behavior. Static CSS only; no image download, animation or dependency added. Production LAN build/TypeScript and whitespace passed; desktop and 390px mobile visually checked with no horizontal overflow. Evidence: `docs/reviews/2026-10-13/login-background/desktop.png` and `mobile.png`. Preview updated locally; no deployment.
- Latest correction: Mitchell asked to match Calendly's login **scrolling and clicked-field behavior**. Directly inspected the reference: full-width sticky header at top 0 with announcement inside it (108px desktop), square edges and subtle scrolling shadow; focused input uses a floating label and 4px soft ring. Login now matches that behavior with WisConnect colors. This explicitly supersedes the earlier floating-login-nav/scroll-away-login-announcement choice below; homepage navigation is unchanged.
- Email/password labels now sit inside empty fields, lift into the border on focus, remain raised for filled/autofilled values, and return when empty and blurred. Added purple focus halo, preserved red validation feedback, show/hide password and the existing email/password submission. Reduced motion removes field transitions. Password uses the compact label “Password” to fit 320px phones. Scroll margins keep focused errors/fields below the sticky header.
- Verification: final production LAN build/TypeScript and whitespace passed. Browser checked empty/focused/filled/blurred labels, validation-summary focus and field links, password toggle, announcement dismissal/focus, mobile menu while scrolled, 320/390px overflow and no console errors. At scroll, header and announcement stay at y=0 on desktop and mobile (108px/104px header heights). No credentials submitted. Evidence: `docs/reviews/2026-10-13/login-interactions/` desktop-focused, desktop-scrolled and mobile-focused PNGs. Viewport restored; local preview updated, no deployment.
- Follow-up: Mitchell requested the **full** styling, including navigation and footer. Added `app/login/login-chrome.tsx` and its CSS module: launch announcement with shared icon/font/movement, full WisConnect navigation with four working dropdowns, Contact/Membership actions, floating navigation on desktop and mobile, compact footer with language availability, existing legal/contact/membership links and copyright. Announcement scrolls away per the established preference. Added a globe to the shared icon set. Other pages retain their existing headers; signup keeps EntryHeader.
- Follow-up verification: production LAN build/TypeScript and whitespace passed. Browser checked desktop, 960px and 390/320px widths, mobile menu/submenu, Escape focus restoration, language popover, announcement scrolling away (bottom -53.5px) with header remaining at 8px, no horizontal overflow and no console warnings/errors. Every homepage anchor in the new navigation exists in the export. Screenshots: `docs/reviews/2026-10-13/login-full-styling/desktop.png` and `mobile.png`. Viewport reset; LAN preview remains running. No push/deployment.
- Mitchell requested the styling of https://calendly.com/login. Inspected its desktop/mobile layout and adapted the centered 464px white card, rounded full-width color backdrop, compact controls, soft shadow and in-card membership link to WisConnect's purple/gold palette and existing Georgia/sans fonts. Mobile retains both the card and gradient with an 8px outer inset.
- Updated only the returning-member presentation in `app/member-access.tsx` and `app/member-access.module.css`; signup styles, existing email/password authentication, invitation-only access, password reset, validation and API availability gates remain. No unsupported social sign-in options were added.
- Production LAN build/TypeScript and `git diff --check` passed. Browser verified desktop, 768px tablet and 390/320px phones; no horizontal overflow at narrow/tablet widths, empty-submit error focus and error links work, password visibility toggles correctly, no captured console warnings/errors. No credentials submitted. Viewport restored.
- Evidence: `docs/reviews/2026-10-13/login-refresh/desktop.png` and `mobile.png`. Local preview: http://192.168.100.16:3001/login/. Existing LAN server remains running; no push/deployment. Prior uncommitted work preserved.

## People emblem trial rejected (13 October 2026)

- After the rejected hero placement, Mitchell approved trying the people emblem beside the People / What we bring together heading. Tried a large emblem in a lilac visual panel in place of the orange-blazer photo. Mitchell then rejected it during review. Restored the original orange-blazer photo and removed the emblem panel CSS. Keep the emblem off the homepage; retain source/optimized assets. Earlier homepage work remains.

## Hero cooperative emblem (13 October 2026, local)

- **Superseded:** Mitchell rejected this placement. Removed the emblem from the hero and its desktop/mobile CSS, restoring the clean portrait composition. Original and optimized assets retained for a possible future placement; do not re-add the floating hero badge.

- Mitchell asked where to place `7F9135FA-D9F1-444C-87DE-AE6AF2485978.PNG` on the homepage. It is a transparent purple/gold glass people emblem. Added a small decorative accent beside the lower-left edge of the hero portrait, aligned with its existing gold circle; desktop 84–120px, mobile 76–90px. Headline, portrait, CTAs and rails remain.
- Original PNG unchanged. Generated a 320px transparent WebP delivery copy at `public/assets/hero-cooperative-emblem.webp` (21,252 bytes); decorative empty alt/aria-hidden, no interaction or animation.
- Production LAN build/TypeScript and whitespace passed. Browser verified desktop 1440px and phones 393/320px, image loaded with transparency, contained within artwork and no horizontal overflow/console warnings. Viewport restored. Evidence: `docs/reviews/2026-10-13/hero-emblem/desktop.png` and `mobile.png`.
- Local preview updated at http://192.168.100.16:3001/; no push/deployment or data changes. Prior active work preserved.

## Announcement position and font (13 October 2026, local)

- Mitchell requested Calendly’s announcement placement and font on desktop/mobile. Inspected the live reference: centered full-width desktop strip (40px minimum), left-aligned phone copy with icon at 24px/text at 48px; Geist Medium 14px desktop / 12px phone, 20px leading.
- Applied those type/spacing details with a locally bundled Geist Latin variable font scoped only to the announcement. Font copied from installed Next.js; OFL license retained in app/fonts/Geist-OFL.txt. Existing launch message, lilac color, 10-second movement, shared icon, dismissal and reduced-motion copy remain. No play control.
- Latest explicit correction: Mitchell does NOT want the announcement visible while scrolling. It scrolls away on BOTH desktop and mobile; only the existing navigation floats. This overrides Calendly’s sticky mobile banner. No announcement height is added to sticky section offsets.
- Production LAN build/TypeScript and whitespace passed. Browser verified 1440px desktop and 393/320px phones, correct computed type, banner outside viewport after scrolling, retained floating nav, mobile menu open/close, dismissal with focus returned to logo and no empty space, no horizontal overflow or captured console warnings/errors. Screenshots and reference notes: docs/reviews/2026-10-13/announcement-position/. Viewport restored.
- Local preview updated at http://192.168.100.16:3001/; existing authorized LAN server remains running. No push/deployment or data edits; prior active work preserved.

## Phone preview restored (13 October 2026)

- Mitchell explicitly requested fixing phone access after the previous turn used a computer-only preview. Diagnosis: only 127.0.0.1:3001 was listening; Wi-Fi address remains 192.168.100.16.
- Restored the existing LAN preview at http://192.168.100.16:3001/ with the configured 192.168.100.0/24 client restriction, exact host/origin checks and existing authenticated API protections. Approved restart under this explicit phone-access request; running exec session 88022. Computer-only static preview can coexist on its separate loopback binding.
- Verified homepage HTTP 200, health/database connected and 11 published businesses returned. Phone must share the Mac’s Wi-Fi; actual physical-phone browsing was not directly observed. No source changes, rebuild, deployment, migration or data edits.

## Cooperative member portrait reveal (13 October 2026, local)

- Replaced People behind the businesses with four real cooperative members: Nikki Bravo / Momentum Coffee, Tiffany Williams / Exquisite Kitchen, Kailyn Harrington / Bunnyland, Brandi Davis-Fitch / BDavis Designs. Inspired by the pinned stack-to-spread animation in Lovable’s “Simplify Your Invoicing Workflow.” Portraits separate around the centered copy as visitors scroll, and reverse on upward scroll. Existing WisConnect type, colors and rails remain.
- Latest steering: portraits open their business details directly through the existing directory dialog, with focus/scroll restored on close. Removed the “Meet the visionaries” CTA from this new section. Optional clarification about removing the separate visionaries section was unanswered; the separate section remains. Copy explicitly invites selecting a portrait to discover its business.
- Mitchell requested the reference’s background element. Downloaded its decorative curved-thread PNG to `public/assets/member-stories-threads.png`, layered subtly over the lilac glow. Source: https://webflow-to-wonder.lovable.app/assets/cta-bg-B9a_gErW.png (from https://webflow-to-wonder.lovable.app/). No font/image-generation dependency added.
- Production build/TypeScript and whitespace passed. Verified all four business destinations, keyboard Enter/Escape, focus and scroll restoration, mobile 320/393 and desktop 1440, reverse scrolling and 844×390 static fallback. Reduced-motion fallback reviewed in code, not OS toggled. Browser console clean. Screenshots in `docs/reviews/2026-10-13/people-reveal/`.
- Local only; no push. Network-preview restart was rejected by automatic approval review because of LAN API exposure. Used a safe static loopback preview at http://127.0.0.1:3001/ instead (session 88395), with published-catalog fallback; no backend/database interaction. Earlier backend/dashboard changes preserved.

## Faster cooperative story (13 October 2026, local follow-up)

- Mitchell disliked the textile in the story and requested the previous indicator plus faster pacing. Restored the original solid gold 3px bottom progress line using scaleX, removed the textile background/clip-path, and retained a single indicator.
- Shortened the scroll track from 520 to 360svh on desktop and from 540 to 380svh on mobile: roughly one-third less scrolling through the pinned story. Existing three chapters, transitions, sticky-nav clearance and reduced-motion/short-viewport fallback remain. This follow-up is local, after published commit `6e83b98`.

## Website published (13 October 2026)

- Published commit `6e83b98` to `origin/main`; GitHub Pages deployment succeeded: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38455764008. Live site: https://mitchell-travis.github.io/wisconnect-site/.
- Mitchell requested pushing the current website changes. Release scope is the public homepage/Contact/Join/story styling, shared icons, refreshed imagery, consistent rails/type, mobile pillar autoplay/bridge, floating desktop/mobile nav, animated launch announcement without playback button, mobile profile links and single textile story indicator.
- Earlier dashboard/backend/CI implementation remains local and is not part of this website release. Existing Pages account/API restrictions remain in place. No Railway deployment or database migration is performed.
- The Lovable “Simplify Your Invoicing Workflow” reference was inspected only: pinned portrait stack spreads outward with scroll and reveals the central CTA; no WisConnect section has been selected or implemented yet.
- Isolated GitHub Pages production export and TypeScript passed; 89 exported local asset/link destinations exist. Patched Next.js 16.3.8 and lockfile included. The existing main-branch Pages workflow publishes this release.

## Homepage navigation and story indicator (13 October 2026, local)

- Mitchell requested Calendly-inspired navigation while retaining WisConnect content and controls. Inspected Calendly's live desktop announcement, normal header and rounded floating navigation. Homepage now has a dismissible lilac announcement above the header, rounded floating desktop navigation on scroll, and refreshed dropdown surfaces. Existing logo, destinations, language control, Contact and Membership remain. Latest announcement: Mitchell asked to improve the launch message and add movement. Copy is “Something powerful is coming. WisConnect launches soon.” A gentle 10-second vertical loop displays each sentence with a reading pause. The shared megaphone stays in place. Mitchell subsequently requested removal of the announcement Play/Pause button; the message still moves and dismissal remains available. Hover/focus pauses motion, screen readers receive the complete message once, and reduced-motion visitors see static full copy. The earlier Explore link remains removed.
- Latest preference: Mitchell asked to restore the floating navigation on mobile too, superseding the earlier desktop-only request. Mobile now floats on scroll with an 8px top/side inset, 18px rounded corners and the shared soft shadow. Opening its full-screen menu still pins its controls to the viewport top and preserves the underlying document space; verified menu destinations and profile navigation.
- Removed the portrait “View bio” badge in Meet the visionaries. Mobile shows a small “View profile” link beneath the person's details; existing profile flip/full profile interaction remains.
- Cooperative story uses the existing purple/gold textile for its single bottom progress indicator at the original 3px height. Mitchell rejected having textile twice: removed the extra textile from chapter markers, retained plain desktop chapter labels and hid those markers on mobile. Sticky story stage accounts for the persistent navigation so its text and footer remain visible.
- Production build/TypeScript passed; verified 320px/393px mobile and 960px/1440px desktop navigation without horizontal overflow, mobile menu/submenu destination, profile flip/close, and story text/footer beneath the header. Final screenshots in `docs/reviews/2026-10-13/navigation-refresh/`. Local preview only; earlier uncommitted work preserved.

## Mobile pillar connector and autoplay (13 October 2026, local)

- Mitchell requested the active-icon-to-card connection from Calendly’s Scheduling showcase and automatic mobile progression in People / What we bring together. Inspected the live mobile reference: active icon has a curved bridge into its card; the active product cycles. Mitchell then asked for a WisConnect-specific treatment, and explicitly rejected the decorative wavy line between icons. Final design removes that line and the thin stem/dot inside the bridge; keep only the clean warm-sand bridge, purple selected icon, existing shared icons, labels and lilac frame.
- `app/page.tsx` rotates People → Capital → Communities every 7 seconds on mobile only, while at least 40% of the section is visible and the document is visible. Rotation is disabled for reduced-motion preference. Pause/Play uses new shared icons. Manual selection, keyboard focus inside the content and direct pillar links pause until explicit Play. Active-icon progress uses the same duration. Hidden cards retain equal footprint and stay out of keyboard navigation; desktop sticky cards remain unchanged.
- Final production LAN build and TypeScript/whitespace checks passed. Browser verified auto progression without changes to scroll position or section height, Pause holding the same card across more than one interval, off-screen stopping, manual selection/connector sync, no wavy line, and 320/393px mobile plus 1440px desktop layouts without horizontal overflow. Desktop nav hidden/all cards visible and sticky. Console warnings/errors empty; viewport restored. Reduced-motion guard reviewed in code (OS preference was not changed).
- Evidence: `docs/reviews/2026-10-13/connected-pillars/` (final mobile screenshot and verification JSON). Local preview only, prior uncommitted work preserved. No publishing, data changes or messages.

## Across the diaspora rail correction (13 October 2026, local)

- Mitchell identified a remaining visual mismatch in Across the diaspora. The prior width-only audit missed the square gradient pseudo-element and collapsed top margin: the heading touched the panel edge, and the map still used its old 1060px cap.
- In `app/page.module.css`, added `#impact` to shared section padding, inherited the surface radius on its gradient, removed legacy inner top margin/bottom padding and headline top padding, and let the map use the full shared content width.
- LAN production build (including TypeScript) and whitespace passed. Browser verified 1440/393/320 widths: shared surface/content rails, 120px desktop / 48px phone vertical padding, matching 40px / 28px background radius, no horizontal overflow. Brazil/Liberia controls still update their descriptions. No captured browser warnings/errors; viewport restored. Evidence: `docs/reviews/2026-10-13/diaspora-rails/`. Local preview only; earlier work preserved.

## Homepage rail alignment follow-up (13 October 2026, local)

- Mitchell flagged the cooperative overview and footer, then requested the same check across every homepage section. Completed the remaining rail alignment: cooperative heading/story/footer now share the 1200px content rail; cooperative, projects, diaspora, stories and page footer use the same 24px desktop / 8px phone outer surface inset as support/directory.
- Added shared `--rail-width` and `--surface-content-inset` tokens. Pillar and invitation frames now follow the outer surface rail while their copy aligns to the inner rail. Removed extra mobile directory-heading padding. The invitation textile strip clips with its rounded frame. Cooperative sticky animation, skip link and non-animated fallback retain their behavior; no ancestor overflow was introduced around its sticky track.
- Production LAN export, TypeScript and whitespace checks passed. Browser audit at 320/393/768/1440 found no horizontal overflow or clipped section headlines. All 18 mobile/tablet section headings start on the same rail (20/24/36px respectively); desktop left-aligned section headings/story copy start at 120px at 1440, with centered introductions retained. Outer panels/footer measure 8px phone and 24px desktop/tablet. Checked mobile pillar selection, sticky story/skip, 768×480 non-animated fallback, desktop invitation corners and footer. Captured console warnings/errors empty; viewport restored.
- Evidence: `docs/reviews/2026-10-13/rail-alignment/` (viewport audit and screenshots). Local preview only; no publishing, backend/data changes, or external messages. Existing uncommitted work preserved.

## Homepage rails and shared type scale (13 October 2026, local)

- Mitchell requested Calendly-inspired rails, typography hierarchy and use of color, retaining WisConnect’s fonts/palette and consistent section headline/supporting-copy sizes. Applied this as a homepage-only design pass, preserving hero hierarchy, desktop pillar stacking and the new mobile pillar selectors.
- Inspected live Calendly desktop/mobile DOM and screenshots: desktop feature headings 48px/1.1, supporting intro 18px, larger editorial headings 60px, 1200px content composition, 24px outer surface insets; mobile feature headings 28px and larger editorial headings 36px, with 8px surface insets. WisConnect deliberately consolidates its section headings into one scale per breakpoint: 48px desktop / 40px tablet / 32px phone; section introductions 18px desktop/tablet / 16px phone. Hero and smaller card/form/dialog type keep their hierarchy.
- Shared homepage rules live at the end of `app/page.module.css`, scoped to `data-home-system`. Explicit `data-section-headline`, `data-section-description` and `data-content-rail` hooks identify the relevant content in the homepage components. Georgia display and existing sans remain. No global/dashboard/account font changes.
- Content uses 1200px maximum width and common gutters; homepage decorative vertical rails/section divider lines are replaced by open alignment. Warm sand base, inset rounded mist support surface and lilac directory surface establish section boundaries. Mobile pillar and photographic invitation frames retain deliberate outer insets around their inner content.
- Final production LAN export, TypeScript and whitespace checks passed. Computed-style audit at 320/393/768/1440 confirmed a single heading size and introduction size per breakpoint, aligned content rails, no horizontal overflow and no clipped headings. Mobile menu, FAQ and pillar selection checked; inactive mobile panels maintain equal height. Browser warning/error capture empty, viewport restored. Evidence: `docs/reviews/2026-10-13/homepage-system/` including machine-readable viewport audit and screenshots.
- Local preview only. Earlier uncommitted work preserved; no backend/data modifications, publishing or external messages.

## Mobile cooperative pillars (13 October 2026, local)

- Mitchell requested a mobile adaptation of Calendly’s Scheduling showcase for People / Capital / Communities, retaining WisConnect styling and the approved desktop stack. Inspected the live reference at 393px: icon navigation above one rounded light card, copy and action above the visual, soft colored frame.
- Added mobile-only labeled icon selectors to the existing `#about` / `#cooperative` cards in `app/page.tsx` and `app/page.module.css`. Uses shared people/wallet/home icons, lilac/gold frame, warm white surface, purple serif headings and existing photos. All three cards occupy one shared grid area; inactive cards use visibility:hidden to preserve the section footprint while excluding them from keyboard/accessibility navigation. Short opacity transition follows the existing reduced-motion override. Mobile selectors replace the old inline belief buttons; mobile hides the repeated detail/tagline and secondary links, keeping each main description and introduction CTA.
- Desktop retains its three original two-column sticky cards, copy, actions and inline detail controls. The height observer now targets only cards, excluding the mobile navigation. Existing pillar hashes select the corresponding mobile card.
- Verified direct taps retain the exact scroll position, all three selections, Tab + Space/Enter keyboard activation, loaded photos, 393px/320px layouts without horizontal overflow, and desktop sticky positions. Browser console warnings/errors empty. Production LAN export and TypeScript passed; final typography refinement verified with the refreshed build. Review evidence: `docs/reviews/2026-10-13/mobile-pillars/`.
- Local preview only; no publishing, backend/data changes or external messages. Earlier uncommitted work preserved.

## Shared icons across the public site (13 October 2026, local)

- Mitchell clarified that the approved dashboard icons should be used everywhere, including the homepage. Promoted the drawings into `app/site-icon.tsx` and a small scoped CSS module; dashboard `workspace-icon.tsx` re-exports the shared component. Added matching check, pin, rotate, sparkle, minus and directional variants.
- Replaced public UI SVGs, text-symbol icons and CSS-drawn controls across homepage navigation/actions, FAQs, support/project toggles, business search/details, profile cards/dialogs, newsletter, Contact, Join, login/recovery/signup feedback, entry headers and story pages. Native browser controls remain native. Brand artwork, illustrations and maps are preserved. Public colors, content and layout remain the approved design.
- LAN-origin production build and TypeScript passed after naming the shared file `site-icon.tsx` (plain `icon.tsx` is reserved by Next.js metadata conventions). Browser confirmed 119 homepage interface SVGs share the 1.3-unit stroke; the remaining seven SVGs are illustrations/map/decorative artwork. FAQ plus/minus, directory 4→11→4, 320px menu/close, Contact dropdown, Join and story layouts verified without horizontal overflow. Dashboard still has 59 shared icons with no separate SVG set. Captured console warnings/errors empty; temporary viewport override reset. Evidence: `docs/reviews/2026-10-13/site-icons/`.
- Local preview rebuilt; no production push/deploy, backend/schema changes, submissions, external mail or real record edits. Prior uncommitted work preserved.

## Kole Jain dashboard surface styling (13 October 2026, local)

- Follow-up: Mitchell approved the icon direction and requested it throughout the dashboard, with Collapse sidebar at the top like the reference. Moved the control immediately after the logo in DOM/keyboard order. Completed the shared rounded icon set and switched all dashboard icon consumers (overview, member/application/invitation flows, profile, tabs, request states, previews and theme controls). Bell geometry and functionality retained with the shared thin stroke. Production LAN build/TypeScript and whitespace passed; live desktop/320px checks confirmed all 59 rendered overview SVGs use the shared set, top collapse/expand works, invitation-dialog icons are consistent, no overflow or console warnings/errors. User's current dark theme and Overview retained; normal viewport restored. Screenshots `desktop-unified-icons.jpg` and `phone-unified-icons.jpg` in the same review folder. No records changed or invitations sent.
- Mitchell supplied https://www.kolejain.com/ and requested its sidebar/workspace colors and icon styling. Inspected the actual page and computed styles: outer/sidebar `#f5f5f5`, workspace `#fafafa`, selected navigation `#ebebeb`, borders `#e0e0e0`, rounded fine-line icons. Applied those light-mode surfaces to the existing dashboard, including the phone menu, and softened the desktop workspace corners to 16px.
- Added `workspace-icon.tsx` with locally drawn navigation symbols inspired by the reference; these are adaptations for WisConnect's sections, not a downloaded icon pack. The original notification bell, WisConnect logo, purple action controls, current layout, role-aware navigation and workflows remain. Existing dark palette remains. User's phrase “keep my bill” was queried; no clarification received during implementation, so bell, layout and branding were all preserved.
- This authorizes the shared shell styling only; the reverted Home rebuild remains reverted. No backend/schema/record changes, deployment or external messages. Earlier uncommitted work preserved.
- LAN-origin production export and TypeScript compilation passed. Actual desktop and 320px browser checks verified sampled surface colors, 56px collapsed sidebar, Reports navigation, bell open/close, dark/light theme, phone menu and no horizontal overflow; captured console had no warnings/errors. Original light theme, expanded sidebar, Reports view and normal viewport restored. Current API process was left running and serves the rebuilt static export. Evidence: `docs/reviews/2026-10-13/kolejain-shell/`.

## Home implementation fully reverted (13 October 2026)

- Mitchell clarified that all changes from starting the dashboard home build should be reverted, not only the last styling pass. Restored the exact pre-build `workspace-home.tsx` and dashboard view from session output; removed the new home styles, icons, record-opening props, dashboard snapshot endpoint/test/CI entry and implementation screenshots. Earlier applications, business, inquiries, reports, team work and the HTML design references remain as they were before the home build.
- The existing additive 0011 team-permissions migration applied during the build remains installed because the pre-build team code already depends on it. No data or account changes were rolled back. Home implementation is no longer approved to continue without new direction.

## Dashboard flow research and review-first design (13 October 2026)

- **Account UI review 03:** Mitchell initially approved implementing dashboard home, then explicitly paused that work to review the account flow UI first and required real Mobbin inspiration. No application implementation was changed in those interrupted turns. Created `docs/design/dashboard-flow/WisConnect-Account-Flow.html`, linked from the dashboard blueprint: 14 connected screens for profile, password/access, sessions/sign-out, sign-in/invitation acceptance and password recovery/expiry, with phone/dark controls, simulated errors/loading, form validation, draft guard, sample saves and browser-local reviewer feedback/export. Source: `account-template.html`, `account.css`, `account.js`, regenerated by existing `build.py`.
- UI03 provenance: newly inspected/captured Square sign-in screen `91fca814-76a0-4e1c-8f4c-80b79ab778b3` on Mobbin plus previously verified Square recovery/check-email and Attio invitation screenshots. The HTML embeds all four sources with direct links and explicitly distinguishes adaptations from inspected product screens. Settings/session designs adapt the approved WisConnect system; no claim of fresh Mobbin settings research. Browser disconnected during further research and remained unavailable in Chrome and in-app browser; JavaScript syntax/build/asset checks passed, but rendered visual and interaction QA remain outstanding. HTML was queued in Codex for review. Dashboard implementation stays paused pending user direction.
- **UI review 02:** Mitchell asked to refine the actual visual styling before building. The same standalone HTML now opens on a polished Home + Application detail proposal using the saved Linear/Attio Mobbin references and approved WisConnect wordmark. Includes full-size focus mode, light/dark and desktop/phone controls, eight preview state combinations, clickable search/queues/detail tabs, notes, review editing, invitation confirmation, preserved failed-save drafts and conflict comparison. New source files `ui.css`/`ui.js`; build retains the original 53-screen flow map and embeds all assets. UI-specific review notes use separate keys and join the existing export.
- UI02 verification: desktop light/dark screenshots, 390px preview, actual 320px layout/state checks, note validation/save, review/history updates, search/no-results, invitation pending feedback, unsaved-note guard, error/conflict draft recovery and browser-local review persistence checked. JS syntax and captured console checks passed. Evidence added to `verification.json`; screenshots `ui-home-desktop.jpg`, `ui-detail-desktop.jpg`, `ui-detail-dark.jpg`, `ui-home-phone.jpg`. These are synthetic in-memory interactions, not production features or measured performance. Next step remains Mitchell’s visual review before implementation.
- Mitchell requested Mobbin research and a complete HTML dashboard screen map to review before implementing screens one by one. The current next step is his design review; do not treat the blueprint as approval to implement or deploy the dashboard.
- Created self-contained `docs/design/dashboard-flow/WisConnect-Dashboard-Blueprint.html`: 53 proposed screens/dialogs across 12 Phase 1 journeys, clickable layout studies with desktop/phone views, nine inspected Mobbin references from Attio/Linear/Square/Dropbox, 15 interactive feedback/recovery states, per-screen browser-local review notes with JSON export, and a seven-stage build order. Includes existing/new/policy-dependent labels and keeps account access separate from membership, financial tracking separate from money movement, and documents restricted pending audience approval.
- Source data/provenance in `docs/design/dashboard-flow/research.json`; editable HTML/CSS/JS and standard-library `build.py` regenerate the standalone file and `dist/index.html`. All font/reference-image assets are embedded in the deliverable; the HTML works without a server. Original Mobbin watermarks retained. Only synthetic data is used in proposed WisConnect layouts.
- Verification: all 53 previews rendered at desktop and 320px without preview/page overflow; all five chapters checked on phones; 15 feedback states rendered; validation/save/conflict interactions checked; nine images loaded; reference dialog Escape restored focus; review notes persisted after reload and exported JSON was read back. JavaScript syntax and captured console checks passed. Evidence: `docs/design/dashboard-flow/verification.json` and `blueprint-desktop.jpg`.
- This is a design review artifact, not production implementation or measured application performance. No actual accounts, records, permissions, emails, app styling, migration state or hosting were changed. Railway remains deferred. Full member portal, marketplace checkout, online dues and member messaging remain outside this Phase 1 staff-dashboard map.

## Consolidated Phase 1 checklist (13 October 2026)

- Mitchell requested one complete checklist against the original Phase 1 scope, showing completed work, remaining builds and team dependencies. Created the private Page [WisConnect Phase 1 completion checklist](https://chatgpt.com/space/page_334f0d63d850819192beefffdbb661a6); saved content read back and verified. This is the consolidated scope checklist; `docs/admin-roadmap.md` remains the narrower implementation roadmap.
- Distinguishes published website milestones, locally implemented workflows, unfinished original deliverables, production/handover obligations and ten team-input groups. Finance/investment tracking, projects, documents and all five original report categories remain in Phase 1 unless explicitly deferred. Later discovery details and technical release controls are identified separately from original scope. New team-permission code remains classified as in progress pending verified completion; membership rules, document audiences and other team decisions are not inferred.
- No team message, sharing change, deployment or application-code modification accompanied checklist creation. The Page is a 13 October snapshot and must be reconciled with later implementation and approved scope changes before final acceptance.

## Active admin completion goal and backend security (13 October 2026)

- Operational reports implemented locally: administrator-only date-filtered intake/action counts, current all-date inquiry workload/publication/account snapshots, safe authenticated CSV export, explicit UTC/date/coverage semantics, 366-day range limit, bounded 50-group workload detail, five-second query timeout and admin quotas. One SQL snapshot backs each response. No inferred historical account growth, membership/finance numbers, private message/note/contact exports. Reports moved to connected desktop/mobile navigation. Dedicated isolated reports check plus foundation/body-limit regressions, production LAN build, TypeScript, actionlint and whitespace passed; reports included in CI aggregate (now twelve suites). Browser verified synthetic loading/errors/date edits/export gating/phone table and actual desktop/320px report, seven-day preset and CSV-start feedback; final download file completion was not independently observed (download event timed out; browser policy blocks downloads page, no workaround). User theme unchanged, viewport reset, temporary fixture removed. No schema migration, real record edits, external mail, push or hosting setup. Private API restarted with reports at unchanged address, session `83471`. Evidence: `docs/reviews/2026-10-13/reports.md`, screenshots `reports/`. Goal remains active; next independent work includes security audit coverage/MFA and team safeguards, while document audience, staff responsibilities and membership policy need product decisions. Railway still deferred.

- CI/security milestone implemented locally: reusable pull-request/manual/weekly checks plus a gate on existing Pages deployment; disposable PostgreSQL/Mailpit, eleven sequential backend suites, npm/Python advisory scans, both frontend builds and TypeScript. Added full 26-package Python 3.14 hash lock preserving installed versions. Fresh hash-checked install, consistency/direct-requirement checks and final audit passed. npm audit identified three affected packages; patched Next.js 16.3.5→16.3.8 (kept current minor), sharp 0.35.4→0.35.5 and source-map-js 1.2.1→1.2.2. Final npm and Python scans report no known vulnerabilities. All eleven suites, both builds, TypeScript, actionlint and whitespace passed; local login/dashboard/health remain available, API process unchanged. No push/deployment/external mail or real record mutations. First GitHub-hosted execution and branch protection remain verification work. Evidence: `docs/reviews/2026-10-13/continuous-checks.md`. A pending async document-audience question asks whether explicitly shared files should be readable by all active member accounts, selected accounts, or administrators only; no answer received yet. Private documents must not be exposed without that decision. Continue independent safeguards/team/report work while membership/hosting decisions remain deferred.

- Application-to-account invitation handoff implemented locally: explicit confirmation from saved review, fixed application email, actor-bound retry IDs, version conflicts, cross-entry concurrent duplicate prevention, separate invitation rows per issuance, and linked send/revoke/accept history. Review status stays unchanged; no membership decision is implied. Existing-account/pending-invitation states shown; source application visible in Invitations. Migration 0010 applied after backup `.local/backups/20261013T135033550783Z.dump`, with the API stopped during the schema transition. Token/account values preserved; no prior provenance inferred. Dedicated lifecycle/auth/applications tests, production build/TypeScript and desktop/320px browser checks passed. Tests used owned synthetic Mailpit recipients; no real invitation/record mutations, external email or deployment. Final API session `60584`. Evidence: `docs/reviews/2026-10-13/application-invitations.md`. Production email and membership policy still deferred. Next independent work: remaining backend/admin safeguards and document/team/report capabilities, with document audience and staff responsibility decisions still needed.

- Inquiry follow-up implemented locally: active administrator assignment, Open/In progress/Closed states, UTC calendar follow-up dates, private append-only notes/history, safe retries and edit conflicts, search/status/assignment/date/delivery filters and pagination. Overview now counts active/due inquiries, independently of notification delivery. Closing is manual; email-app reply links do not send or track replies. Migration 0009 applied after backup `.local/backups/20261013T133847633662Z.dump`, preserving existing receipt/delivery content. Isolated inquiries/contact/foundation/security checks, production build/TypeScript and desktop/320px browser verification passed. No real inquiry writes or external mail; temporary fixture removed. Final API session `97376` at unchanged Wi-Fi address. Evidence: `docs/reviews/2026-10-13/inquiry-followup.md`. Next: application-to-invitation handoff, with membership decisions still deferred; other roadmap security/document/team/report work remains active.

- Business management implemented locally: real administrator CRUD, separate draft/published snapshots, preview, explicit publish, archive/restore, private owner/contact/notes, conflict protection, safe retry IDs and activity history. Existing eleven approved listings imported exactly by migration 0008 after backup `.local/backups/20261013T132607029606Z.dump`; no account assignments inferred. Local public directory now reads published records; original four-card preview, Explore all 11, photos/profile links and styling remain. GitHub Pages retains its static snapshot until hosting integration. Custom uploads/attribution management and cross-section unsaved-form guards remain open. Isolated business/security/auth checks, production build/typecheck, live desktop/320px, public directory and image checks passed. Sample UI mutations were isolated; no real listing changes or external messages/deployments. Private API now session `66771` at unchanged Wi-Fi address. Evidence: `docs/reviews/2026-10-13/business-management.md`. Next independent functional milestone: inquiry follow-up; continue tracking MFA, team permissions and remaining production gates.

- Hosting decision: Mitchell chose Railway for the backend, explicitly deferring hosting setup until later. Continue local security and functional admin work; do not keep asking for hosting/domain details or deploy now.
- Session security implemented: private own-session inventory/revocation, 30-minute server-enforced idle expiry, unchanged eight-hour maximum, ten-session cap, coarse client labels and sign-in/sign-out/revocation audit events. Migration 0007 applied after backup `.local/backups/20261013T125955575490Z.dump`, preserving existing tokens/absolute expiry. Private API restarted (session 68595); actual administrator browser session remained valid. Isolated sessions/auth/foundation checks passed; fixture UI checks covered loading/errors/confirmation/focus and 320px width without changing real sessions. Final build/TypeScript, whitespace and live desktop/phone checks passed; sample route/server removed. Fixed phone account-anchor offset and preserved user theme. Evidence: `docs/reviews/2026-10-13/session-security.md`. Next functional milestone: business management; MFA and production gates remain open.

- Follow-up: shared PostgreSQL rate limiting is implemented and verified, replacing process-local counters. Migration `0006_shared_rate_limits` applied locally after private backup `.local/backups/20261013T125136651030Z.dump`. Protected writes allow 600/IP/15 minutes, reads 600/IP/minute; stricter endpoint quotas unchanged. Counters survive workers/restarts, expire with database time and fail closed on storage errors. Dedicated multi-process/two-API checks plus auth/foundation/applications/body-limit/contact/newsletter regressions passed (seven suites), as did whitespace checks. Evidence: `docs/reviews/2026-10-13/shared-rate-limits.md`.
- Local website/API processes were found stopped; confirmed no port-3001 listener before restarting the private preview at the unchanged Wi-Fi address. It now includes shared throttling and bounded bodies; health/login/unsigned-session checks returned 200/200/401. Tool session at start: 83888. Existing `out/` build and account records preserved. No public deployment. Next: deployment configuration/admin protection plus functional work from the roadmap. The original audit entries below are historical where superseded by this follow-up.

- Mitchell explicitly requested a persistent goal to complete the functional admin platform and assess backend security/rate limiting. Goal created and active; the working roadmap is `docs/admin-roadmap.md`. This supersedes earlier historical statements that no persistent goal was running.
- Security baseline: password hashing, sessions, server-side roles, recovery/invitation tokens, origin checks and local throttling exist. The backend remains a local/LAN pilot, not production-ready. Shared rate limiting, production HTTPS/session/proxy configuration, admin MFA, complete security logging, CI dependency checks, off-machine backups/alerts and production email remain release work. Detailed evidence: `docs/reviews/2026-10-13/backend-security.md`.
- Fixed a concrete request-size weakness: the old check buffered the complete body before rejecting it. New ASGI middleware bounds buffering even without Content-Length, rejects declared oversize before reading, and preserves existing route limits. Local access/origin checks still precede body reads. API boundary rejections now include privacy headers.
- Added `npm run security:check` with eight passing boundary cases. Baseline foundation/auth/applications checks passed in isolated schemas; auth and applications checks passed again after the fix, including oversized-body and rejection-header assertions. Whitespace checks passed.
- Next milestone: shared rate limiting. Then progress through business directory management, inquiry follow-up, application/invitation handoff, documents, team permissions and reports, with production controls and release verification tracked separately. Membership approval/eligibility/fees/dues still await team policy; do not infer them from account access.
- Existing frontend styling and uncommitted migration preserved. No live records, accounts or memberships changed; no external emails or deployment. The long-running LAN preview was not restarted, so backend source changes take effect there on its next restart.

## Dashboard priorities and readability (13 October 2026, local)

- Mitchell approved refining the existing dashboard after a visual review. Overview now leads with “Needs your attention”: real new-application count, pending invitations and the contact inbox, followed by compact account totals. New applications opens Applications with the New filter; ordinary tab/sidebar navigation resets to all statuses. Contact count means all received messages, not unread/unanswered; the current API has no reply tracking.
- Added one admin-only GET to the existing `/auth/applications?status=new` endpoint, with loading, unavailable and refresh states. No backend, schema, auth, account or application-record writes. Existing migration work preserved.
- Increased record/action text readability, softened panel separation in light/dark, retained restrained purple accents and existing member identities. Grouped unfinished navigation under In development; mobile uses a menu icon and separates Your account. Existing section access and member/admin restrictions remain.
- Production LAN-origin build/TypeScript and whitespace checks passed. Browser verified the live new count against the filtered applications list, normal All statuses navigation, invitations/inbox destinations, mobile navigation/focus return, 390px/320px no overflow, light/dark rendering and no captured console errors/warnings. User’s dark theme and normal viewport restored. No real messages sent or records changed.
- Local only, not pushed. Review and screenshots: `docs/reviews/2026-10-13/dashboard-refinement/`.

## Distinct decorative imagery (13 October 2026, local)

- Replaced repeated decorative placements with eleven distinct Pexels photographs (six directory businesses, involvement, Contact, Join, WCI project and Liberia project). Sixteen optimized WebP assets include responsive sizes. Original mission/vision and sector photos now retain their own uses.
- Preserved actual member portraits, matching card/detail images, W-story imagery, logos and styling. Updated alternative text and credits; stock photos remain illustrative. No new image motion.
- Production mobile-origin export/TypeScript and whitespace checks passed. Browser verified all eleven directory images load; desktop/phone framing checked, with no horizontal overflow on homepage/Contact at 320px. Local only, not pushed. Source ledger and screenshots: `docs/reviews/2026-10-13/image-replacements/`.

## Decorative image motion removed (13 October 2026, local)

- Mitchell disliked the image animations and requested their removal. Removed entrance effects from founder portraits, directory tiles, support cards, sector cards, member stories, hero photo and closing gold artwork; removed portrait/card hover lifts, directory photo zoom, sector image stretching/shifting and cooperative photo scroll scaling. Support illustrations now switch without the sliding/scaling transition.
- Kept text entrances, button/arrow feedback, existing profile flip functionality, carousel navigation, support expansion and W storytelling. Shorter copy, spacing, compact FAQ and Explore all 11 businesses remain intact.
- Mobile-origin production build/TypeScript and whitespace checks passed. Browser confirmed directory cards/images have no animation or transform, portraits have no translate/transition, no image reveal markers, and directory still expands 4→11→4. Local preview updated; not yet pushed. Existing backend/dashboard migration preserved.

## Homepage refinement published (13 October 2026)

- Mitchell explicitly requested pushing the homepage refinements. Selectively committed fourteen homepage files as `cdcf37a` (`Refine homepage copy, spacing and interactions`) and pushed `main`. Includes shorter copy, tightened spacing, restrained motion, compact FAQ and the four-business preview with Explore all 11 businesses.
- Built an isolated snapshot of the exact staged release with `GITHUB_ACTIONS=true`; production export and TypeScript passed. Verified staged files equal the built files, correct GitHub Pages asset paths and public email-introduction copy. Local account/backend/dashboard migration and all local app file contents preserved; only public homepage changes committed.
- GitHub Pages build and deployment succeeded: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38392888175 . Chrome verified live revised support copy, compact FAQ, four preview tiles, Explore all 11 button and entrance animation styles. Screenshot: `docs/reviews/2026-10-13/apple-design/published-homepage.jpg`.
- Live website: https://mitchell-travis.github.io/wisconnect-site/ . Local mobile preview remains intact. No external messages sent.

## Homepage copy, spacing and motion (13 October 2026, local)

- Mitchell requested shorter copy, a spacing review and more life through microanimations. Used apple-design guidance while preserving the restored type, colors, artwork, expanding support cards, founder flips, sticky belief panels and W story. Kept the compact FAQ and four-business preview with Explore all 11 businesses.
- Shortened selected introductions and supporting passages from 484 to 310 words (36%); this is the edited-copy count, not total page copy. Founder biographies/titles and official mission/vision remain intact. Retained developing-service and membership qualifications.
- Tightened desktop section spacing from 80px to 72px, phone spacing from 56px to 52px, and selected heading/content gaps. Desktop default page height at 1440×812 is now 19,547px versus 20,049px before this pass; the W section remains 4,528px.
- Connected the existing once-only entrance observer to support headers/cards, founder cards, business tiles, stories and the closing invitation. Entrances use 18px/500ms on desktop and 12px/400ms on phones. Added small card lifts, directional link-arrow movement and immediate press feedback, all gated by reduced-motion preferences; hover movement is limited to fine pointers. Content remains visible without animation or hydration.
- TypeScript, production mobile-origin export and whitespace checks passed. Browser verified updated copy, active entrance CSS, no horizontal overflow at 1440/390/320px, support expansion, directory 4→11→4 with focus on the first revealed business, founder flip/close and FAQ expansion. Reduced-motion handling was reviewed in source; OS preference was not changed.
- Local preview: http://192.168.100.16:3001/ . Evidence: `docs/reviews/2026-10-13/apple-design/copy-motion-desktop.jpg` and `copy-motion-phone.jpg`. Local/uncommitted only; active migration preserved.

## Business directory preview restored (13 October 2026, local)

- Mitchell requested bringing back “Explore all 11 businesses.” Restored the four-business preview (Bunnyland, Jennima’s Juice, Momentum Coffee and ZE’AD), expand/collapse button, and preview result count. Kept original heading, copy, artwork, card dimensions and styling; only added button/hidden-tile styles and a preview-only last-tile alignment override. Full-directory odd-last-card centering remains.
- Filters/search include all businesses, and business hash links expand the directory and focus their destination. Expand moves focus to the first newly revealed business; collapse keeps the button in view. FAQ and revised support copy remain unchanged.
- Production mobile-origin build and TypeScript passed; whitespace check passed. Chrome verified 4 → 11 → 4, hidden-business deep link, Liberia’s five results, and four-card 2×2 layout at 390px; no overflow at 320px. Evidence: `docs/reviews/2026-10-13/apple-design/directory-explore-phone.jpg`. Local preview updated; no deployment or external messages.

## What WisConnect does — copy only (13 October 2026, local)

- Mitchell requested refining the copy in this section after restoring the original homepage styling. Changed only text in `app/what-wisconnect-does.tsx`: headline “Expertise, space and connections.”, a clearer introduction, Governance → Guidance (with cooperative governance retained in the expanded title), shorter practical summaries/descriptions and bullet points, “Talk about your business” CTA, and an availability note. Retained the Liberia consulting sectors and qualification that opportunities are developing.
- CSS, illustrations and card interaction markup verified byte-for-byte against the restored version. No layout, motion or other section changes. Compact FAQ retained.
- Mobile-origin production export and TypeScript passed; whitespace check passed. Browser verified headline and CTA on desktop, longest Growth description, and all four expanded cards at 320px without horizontal overflow or text/artwork overlap. Local preview updated; no publishing or external messages.

## Homepage styling restored; compact FAQ retained (13 October 2026, local)

- Mitchell asked to restore his previous styling everywhere except the new FAQ. Restored the eight homepage, support, visionary-card and directory TSX/CSS files exactly from the snapshot taken immediately before the apple-design refinement. This also restores flip-card biographies, the full directory, original support illustrations/hover interactions, large heading hierarchy, stacked People/Capital/Communities panels and original motion.
- Kept the compact FAQ component and styles unchanged, including all answers and local/public introduction behavior. Existing uncommitted account/backend work was already in the snapshot and remains preserved. The earlier apple-design refinement entry below is historical and superseded except for the FAQ.
- Production mobile-origin build and TypeScript passed; whitespace check passed. Browser confirmed the original support title/illustrations, nine flip-card controls, eleven businesses and three belief photographs, while the compact FAQ remains and its membership answer opens. No desktop page overflow. Evidence: `docs/reviews/2026-10-13/apple-design/restored-support.jpg`.
- Local change only; no commit, push, deployment or external messages.

## Apple-design homepage refinement (13 October 2026, local)

- Mitchell requested a critique using the apple-design skill, then authorized improving the homepage. Implemented clearer always-visible support descriptions, smaller practical-section headings, direct portrait-to-profile opening with summary in the existing dialog, and a single compact FAQ retaining all answers and hash links.
- Replaced the three sticky People/Capital/Communities panels with one three-column overview (stacked on phones), preserving their core copy and capital-development qualification. The W cooperative story, its 520/540svh track, all founder data, mission/vision, hero identity, approved logos and gold closing artwork remain unchanged.
- Directory initially shows four businesses spanning Chicago and Liberia; Explore all reveals all eleven. Search/filter operates over all businesses, deep links expand and focus the requested business, and Show fewer returns to the preview. Original details/profile connections retained. Removed the last-tile special placement so the four-card phone preview forms a regular grid.
- Sector carousel now uses a damped spring with release velocity. Profile transitions use short 18px travel; closing reads the current presentation value. Existing reduced-motion protections retained. No new glass effects or assets.
- Production mobile-origin export and TypeScript passed. Chrome checks at 1440, 760, 390 and 320px found no page overflow. Checked profile Escape/focus return and longest role, directory expansion/collapse, hidden-business deep links, location/search empty states, mobile search/detail dismissal, FAQ expansion, carousel next/previous, resolved anchors and loaded images. Desktop default page height at 1440×812 fell from 22,752px to 17,893px (about 21%); W section remains 4,528px. Browser console clean.
- Current built preview: http://192.168.100.16:3001/ . Screenshot evidence and review notes in `docs/reviews/2026-10-13/apple-design/`. All changes are local/uncommitted. Existing backend/account migration work preserved; no deployment, external messages or form submissions.

## Logo concepts and standalone review files (12 October 2026)

- Subsequent authorization: Mitchell explicitly requested sharing the two full-moon concept boards. Sent message `1a132b7ee821ef3d` in original team thread `1a0ebcd8ce63ac6b`, to Elizabeth with Sikola, Chipo, Brandi, Ade Wede, Salvation and Jennima copied. Attached ONLY `WisConnect-Option-1-Full-Moon-Study.png` and `WisConnect-Option-2-Shared-Vision-Recommended.png`, explained both, recommended Option 2, and requested feedback on moon, lettering, colors and the proposed Visionary Women tagline. Standalone files remain local; website logo unchanged.

- Elizabeth approved reviewing logo concepts in message `1a13296c6919ab28`; required a moon (`1a13298fc138c1f6`) and purple/lilac/violet (`1a1329a3a1798a09`). Mitchell reviewed and approved our acknowledgement; sent `1a132a065fa738eb` in the original thread with everyone copied. No concepts have been emailed/shared yet.
- Mitchell rejected the script-in-large-circle, serif-in-large-circle and crescent-style explorations. Explicitly wants the moon to avoid religious associations. Subsequently supplied the NEW exact tagline: “Connecting Visionary Women to Land, Capital, and Community.” This replaces “Marginalized” for future concepts; website tagline has not yet been changed.
- Latest comparison consists of full-moon study (organic tonal patches) and refined “A shared vision” (compact lilac full moon with simplified craters beside an aubergine serif wordmark inspired by navigation). Mitchell prefers the SECOND, cratered version and asked for standalone versions before sharing both concepts with Elizabeth with an explanation.
- Saved two comparison boards, full-color transparent PNG with tagline, compact full-color transparent PNG, and clean white-on-purple standalone in `docs/design/logo-concepts/2026-10-12/`, plus `wisconnect-logo-review.zip`. These are generated concept previews, not final vector artwork. The initial transparent-white generation had damaged text and was rejected; it is NOT in the package. Replacement is opaque white lettering on purple background.
- Built-in image_gen used; standalone prompts recorded in `generation-prompts.json`. A comparison email is drafted in chat for Mitchell to review before sending/sharing. Keep standing review-before-send preference. No website edits, commit, push or new cloud sharing in this concept round.

## Founder title release (12 October 2026)

- Mitchell approved publishing the full executive titles, Elizabeth’s Esq. suffix, and founder business names. Selectively committed only these homepage changes as `1f4cb41` (`Clarify founder titles and name their businesses`) and pushed `main`. All other active frontend/backend work remains local and preserved.
- Built an isolated snapshot matching the staged release with `GITHUB_ACTIONS=true`; production export and TypeScript passed, and all eight updated name/title strings were verified in the generated HTML. The local mobile preview build remains intact.
- Deployment run: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38325890600 . Build and deployment succeeded. The shared homepage returned HTTP 200 and all eight approved name/title strings were confirmed in its live HTML.

## Full executive titles and business names (12 October 2026, local)

- Mitchell approved the logo-redesign question and latest-feedback acknowledgment. Sent message `1a13295276cf400e` in original thread `1a0ebcd8ce63ac6b`, to Elizabeth with Sikola, Chipo, Brandi, Ade Wede, Salvation and Jennima copied. No logo redesign approved by the team yet.
- Mitchell then requested implementing the latest email changes. Mail search still returned Elizabeth’s messages `1a1328d783ce5030`, `1a13290d94327cc2` and `1a1329364ebb3e4e` as the newest feedback. Expanded CEO/COO to Chief Executive Officer/Chief Operating Officer in profile titles and related introduction text; added “Esq.” after Elizabeth’s name.
- Founder cards and full profiles now name the businesses: Nikki — Co-Founder & Owner of Momentum Coffee; Tiffany — Co-Founder & Owner of Exquisite Catering & Shared Kitchen (Elizabeth’s supplied wording); Brandi — Co-Founder & Owner of BDavis Designs; Kailyn — Co-Founder & Owner of Bunnyland Developmental Child Care Center; Rahel — Co-Founder & Owner of ILAVA. Applied Elizabeth’s requested business-name pattern using existing biographies for the remaining owners. Kept the established business-directory names and existing profile links unchanged.
- Sikola’s confirmed title is Chief Membership Officer; adding her profile awaits her photo and biography. No newer reply approving logo exploration was found; existing logos remain. Membership rules stay deferred.
- Mobile-origin production build and TypeScript passed; whitespace check passed. Browser verified all updated cards and the longest full-profile title at 320px without overflow. Screenshot: `docs/reviews/2026-10-12/founder-feedback/business-title-mobile.png`. This refinement is local/uncommitted, not included in the earlier published `5e01e2a` release. Existing backend work preserved.

## Team email and public website release (12 October 2026)

- Mitchell reviewed the update email, removed the request for Liberian member profiles, and explicitly approved sending it in the original thread with everyone copied. Sent Gmail message `1a1328b0e85f8cd1`, thread `1a0ebcd8ce63ac6b`, to Sikola with Elizabeth, Chipo, Brandi, Ade Wede, Salvation and Jennima copied. Confirmed completed local changes, requested every business logo and the missing ending of Rahel’s biography; membership rules remain deferred.
- Mitchell then authorized publishing these changes for team review. Commit `5e01e2a` (`Update founder profiles and approved WisConnect branding`) pushed to `main`: founder titles/locations, Rahel’s supplied portrait and biography, footer logo and favicon; original header wordmark retained.
- Selective staging preserved all other active frontend/backend work locally. Built an isolated snapshot of exactly the eight committed files plus prior HEAD with `GITHUB_ACTIONS=true`; production export/TypeScript passed and verified homepage content, base-path image/script references and header/footer assets. The local mobile build was not overwritten.
- GitHub Pages run: https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/38324951161 . Deployment succeeded. Verified the live shared page in Chrome: all nine cards and updated roles/locations are present; Rahel’s full profile opens and her portrait loads; retained header and supplied footer logo both load. Shared URL: https://mitchell-travis.github.io/wisconnect-site/ .

## Rahel profile supplied and added (12 October 2026)

- Sikola's new email `1a1327e638c81ea4` in the original team thread resends Rahel's photo and biography as Drive links. Mitchell asked to work on that email, so the earlier hold pending materials is now resolved.
- Photo: `4G3A1561.jpg`, Drive ID `10B7qn6TfdS2qynf-Wd05x0Jr9S7QI-mn`. Bio: `Rahel's Bio.docx`, Drive ID `1TVexq9VlTHslPqp85vXZhfT5zOLNsuf0`. Read through the Google Drive skill/connector; originals downloaded temporarily, cloud files left unchanged.
- Added Rahel Mwitula-Williams as the ninth visionary, with the confirmed Co-Founder & Clothing Business Owner title and Chicago, USA location. Bio and summary describe ILAVA, ethical fashion, ILAVA Gives Back, travel, innovation and community work using the supplied document. No business-directory entry or external link was invented.
- The actual Word document (verified from its XML, not just the connector preview) ends mid-sentence after “a deeply personal story of”. Omitted that incomplete sentence and retained the preceding complete sentence about her 2023 Kilimanjaro ascent. The missing ending can be added once supplied; do not invent it.
- Supplied portrait encoded as responsive WebP assets `rahel-studio-480.webp` and `rahel-studio-800.webp` (about 49/117 KB). Original composition is preserved in these assets and the full profile. Card framing uses CSS positioning/scaling to keep her face readable. No generated replacement portrait.
- Production mobile-origin build, TypeScript and whitespace checks passed. Live phone preview matched the updated export and both portrait sizes returned 200. Desktop full profile and 320px mobile card/profile checked; no horizontal overflow. Evidence: `docs/reviews/2026-10-12/founder-feedback/rahel-profile-desktop.png` and `rahel-card-mobile.png`. Membership rules remain deferred. No email sent, commit, push or deployment performed.

## Additional Chicago founder titles (12 October 2026)

- Elizabeth's follow-up message `1a1327af7520117e` supplied more founder titles. Mitchell authorized Nikki Bravo — Co-Founder & Cafe Business Owner; Tiffany Williams — Co-Founder & Chef/Shared Kitchen Business Owner; Brandi Davis-Fitch — Co-Founder & Screen Printing Business Owner. All three now show Chicago, USA on homepage cards and full profile headings.
- Rahel remains excluded pending her approved photo and biography, as Mitchell explicitly requested. No membership rules changed. No reply email or Git push performed.
- Desktop cards and Tiffany’s full profile at 320px checked; the longest title wraps without clipping. Mobile-origin build, TypeScript and whitespace checks passed. Export contains all three titles. Screenshots: `docs/reviews/2026-10-12/founder-feedback/chicago-founder-titles.png` and `tiffany-title-mobile.png`.

## Browser tab icon (12 October 2026)

- Mitchell requested the supplied WisConnect logo in the browser bar/tab. Root metadata now points the favicon at the original `wisconnect-logo-approved.png` with PNG MIME type, through the existing base-path-aware asset helper. Header wordmark and footer logo remain as approved.

## Header logo preference (12 October 2026)

- Mitchell prefers the earlier header wordmark. Restored `logo-nav.webp` and its previous sizing in the homepage and shared public entry headers. Keep Elizabeth’s supplied original logo in the footer. Founder title/location corrections and deferred membership rules are unchanged.

## Founder titles, locations and original logo (12 October 2026)

- Read the latest replies in Gmail thread `1a0ebcd8ce63ac6b`. Elizabeth's message `1a1326b130494d99` supplies four title/location corrections and requests WisConnect's original logo. Mitchell explicitly authorized those changes, while keeping membership policy deferred until final details arrive.
- Updated both homepage cards and full profile headings: Elizabeth L. Carter — Co-Founder & CEO, Chicago, USA; Chipo Nyambuya, Esq — Co-Founder & COO, Monrovia, Liberia; Kailyn Harrington — Co-Founder & childcare business owner, Chicago, USA; Priscilla Cadette — Co-Founder, Rio de Janeiro, Brazil. Related summaries/bios now agree with the confirmed roles. Preserved existing verified name spelling and business-specific roles/locations. No additional founder titles inferred for other members.
- Downloaded the actual embedded email logo: a 1600×1088 transparent PNG, despite the small email display size. Saved unmodified as `public/assets/wisconnect-logo-approved.png`. Added to homepage navigation/footer and shared public entry headers, preserving its colors and aspect ratio; dashboard branding is unchanged.
- Membership rules remain pending. Elizabeth confirms herself and Chipo as initial administrators, but no access/account changes were requested or made in this update. Operating agreement/handbook should remain private; approval requirements await their finalized documents. Sikola replied “Will do” to collection of business logos and news/events. No reply email sent.
- Visual checks: desktop founder cards, Elizabeth's full profile, Kailyn's full profile at 390px, header at 320px with document width equal to viewport and loaded original artwork. Screenshots in `docs/reviews/2026-10-12/founder-feedback/`. Production mobile-origin export, TypeScript and whitespace checks passed; the live phone homepage and logo matched the rebuilt files. Changes are local, not committed/pushed.

## Phone overview and navigation compatibility (12 October 2026)

- Mitchell reported overlapping Overview content and menu clicks doing nothing after phone sign-in. Found unconditional `hidePopover()` calls at the start of every view change. Browsers without the Popover API throw before navigation; the unrecognized popover attribute also leaves the notifications panel visible over content.
- Replaced account/notification native popovers with React-controlled visibility, explicit `[hidden]` CSS, anchor positioning, outside-click/focus dismissal and Escape focus restoration. Kept the existing mobile modal navigation and approved layout. No authentication or application data changes.
- Verified an isolated full DashboardView with sample data and both popover methods disabled: mobile menu opens and navigates to Members, Applications and Overview; notifications open/close; desktop account menu opens, Escape restores focus, and navigation dismisses notifications. Checked 390px and 320px layouts (320px document width exactly 320px), desktop 1280px, and no browser console warnings/errors. Sample route removed before final mobile build. Screenshot: `docs/reviews/2026-10-12/mobile-backend/overview-320.png`.
- Production mobile-origin build, TypeScript and whitespace checks passed. Live phone URL returned 200 and matched the rebuilt dashboard HTML; the temporary fixture is excluded from the export. Mitchell subsequently confirmed “works now” on his phone after the rebuild. This browser check simulated missing Popover methods, not the unknown phone OS/browser version.
- Applications follow-up remains pending: Mitchell answered “Review saved”, but the subsequent scoped database read of synthetic introduction #2 still showed New, no reviewer, version 0 and no matching phone note. Do not mark actual-phone persistence as verified or remove the sample until this discrepancy is resolved. The navigation compatibility failure may have prevented reaching the intended record; that is an inference, not a confirmed explanation.

## Phone Applications verification in progress (12 October 2026)

- Mitchell confirmed he changed his own password and logged in on his phone, then requested an Applications save test. Created synthetic introduction **#2, “Mobile review test — 12 October”** through the live mobile intake. Its owned fixture metadata is in ignored `.local/test-fixtures/mobile-review-d4095cff-d1e1-4636-9467-3389bf63f95a.json`. Do not treat it as a real applicant. User was asked to set Reviewing, assign himself and add “Saved from my phone”, then save. Verify persistence and note count after the actual phone action; do not substitute a direct database update.
- The user then reported “Try connecting again” on the phone. Server health and `/auth/me` were normal (200 health, 401 without a session); exact phone error/browser version was not supplied. Found a plausible compatibility issue: session checks relied on newer `AbortSignal.any`/`timeout`, whereas login has no parent cancellation signal. Replaced both static APIs with an AbortController/timer helper across account, introduction and newsletter requests. Parent cancellation, existing aborts, timeout and listener/timer cleanup passed with both static methods disabled. Mobile-origin build and TypeScript passed.
- Rebuilt `out/` for `http://192.168.100.16:3001`; existing mobile server serves that build. Mitchell reopened the login URL and confirmed **“The dashboard opens now.”** Phone connection recovery is confirmed. The real phone review save is still being tested: he was asked again to review #2, choose Reviewing, assign himself, add “Saved from my phone” and save. Last test record read before that action: New, no reviewer, version 0, one received event and zero matching notes. Keep the sample available until this test is finished; clean up only this exact owned fixture afterward if no longer needed.

## Authenticated phone preview (12 October 2026, local Wi-Fi)

- Mitchell explicitly requested dashboard sign-in and backend testing from his phone on the same network. The earlier read-only static preview has been replaced by a combined website/API process at `http://192.168.100.16:3001/login/`, using the same existing local database and accounts. No new user account/password was created or changed. Desktop localhost:3000 and localhost:8001 remain separate and available.
- Start/rebuild with `npm run dev:mobile -- --host 192.168.100.16 --network 192.168.100.0/24`; port defaults to 3001. This builds the current website with an exact mobile origin and serves it with FastAPI. Stop with Ctrl+C in its terminal. Mac must stay awake on the same Wi-Fi. Recheck its address if the network changes. The preview is a built snapshot; restart after edits or another build. The previous Python static server was stopped before replacement.
- New `backend/app/preview_config.py` validates an explicitly opted-in private IPv4 origin and /24 or smaller subnet. The mobile process binds only that Wi-Fi IP, checks client subnet and exact Host, and preserves write-Origin/header checks, password sessions, role checks and throttling. Forwarded IP headers are not trusted. Defaults remain loopback-only. This is temporary HTTP testing on a trusted private network, not production hosting. Database and Mailpit remain unexposed.
- Shared `app/local-api.ts` enables only localhost or the exact mobile-build origin and selects the correct API destination. Login, profile/recovery, Applications, Join, contact and newsletter use it. Request IDs now use cryptographic `getRandomValues` so review/introduction saves work on HTTP phones where `randomUUID` is unavailable. Public/base-path builds remain disabled for these APIs.
- Invitation, recovery and newsletter links generated by the mobile API use its configured origin. Test email still goes to Mailpit on the Mac; phone screens explain this instead of linking to the phone's localhost. No real email sent.
- Verified: `npm run mobile:check -- --host 192.168.100.16 --network 192.168.100.0/24` passed with a disposable schema: password login, cookies, administrator/member access, introduction/review writes, logout, exact Host/origin checks, subnet configuration and static-file isolation. Desktop auth/Applications/newsletter regressions passed. Mobile build, TypeScript and whitespace checks passed. Frontend checks covered exact-origin routing, public guards and UUIDs without randomUUID. Browser at 390px displayed the enabled sign-in form with no overflow or console errors; screenshot `docs/reviews/2026-10-12/mobile-backend/login.png`. Existing user's actual browser login was left for Mitchell; no password requested or entered by the agent.
- Runtime health confirmed database connected, and unauthenticated `/auth/me` returned 401 on both mobile and desktop APIs. All source changes remain local and uncommitted; release preparation and membership-policy deferral from the break handoff still apply.

## Break handoff — resume backend release preparation (12 October 2026)

Mitchell asked to save our place and take a break. On return, the priority is getting the working backend ready to push today (12 October). This handoff does not schedule background work. No commit, push or deployment was performed at the break.

The initial read-only phone preview after this checkpoint has been superseded by the authenticated mobile preview documented above. Mac Wi-Fi address: `192.168.100.16`; gateway/router: `192.168.100.1`.

### Saved checkpoint

- Branch: `main`; latest commit at checkpoint: `9f46d39` (`Complete homepage invitation and connect sector destinations`). The working tree contains substantial intentional, uncommitted frontend/workspace and backend foundation changes, including untracked source, migrations, review evidence and image assets. Preserve all of it; inspect and account for it before staging. Do not reset or discard it.
- Applications implementation is complete locally: saved five-answer introductions, receipt, administrator-only review, reviewer assignment, New/Reviewing/Waiting for information, private notes and activity history, safe retries and conflicting-edit protection. The detailed entry immediately below and `docs/reviews/2026-10-12/applications.md` record implementation and evidence.
- Existing local foundation includes invitation-based access, member directory and private profiles, reversible account access, password recovery, overview statistics, contact inquiries and newsletter subscription flows. Workspace styling and forms have been reviewed for consistency. This is not a claim that production email, hosting or every future administration feature is ready.
- Last completed checks: `npm run applications:check`, `npm run foundation:check`, `npm run auth:check`, `npm run build`, `npm run typecheck`, and `git diff --check` all passed. Applications API tests used a disposable schema. The live browser intake test record and temporary review preview route were removed. Administrator UI was tested with an isolated sample view because the browser workspace was signed out; actual authorization and writes were covered by API integration checks.
- Migration `0005_introductions` is applied to the preserved local database. Backup before that migration: `.local/backups/20261012T161245027182Z.dump`. Keep `.local/`, credentials and backups out of Git. Do not recreate storage or accounts to regain access.
- WisConnect homepage feedback document was shared and the email sent in the original team thread before backend work resumed. Await their content and membership-policy feedback. Document: https://docs.google.com/document/d/1mTjZtgSv7Wzw7ko-sfNmpL8HmCsaxtJAjyc5-3P1P2U/edit . No further email is requested at this checkpoint.

### Start here after the break

1. Read this handoff and inspect `git status`, the current diff, repository deployment configuration and existing hosting setup. Run `npm run local:check` to establish service/database state; use the documented startup commands only if needed. Sandbox network failures can misreport running localhost services as unavailable, so verify before attempting to start another database.
2. Review and prepare the current working foundation for a Git push: include required new source/migrations and supporting frontend changes, check that private/local artifacts are ignored, and retain the approved UI work. A Git push and a live backend deployment are separate milestones; establish which production configuration already exists before deciding the remaining release work.
3. For an online backend, address the hosted API/database, environment configuration, frontend API destination, HTTPS/session/cookie/origin settings, authorized email delivery, migrations and backup/recovery. Current APIs and account/submission clients deliberately support only the local pilot; do not expose it by simply removing the localhost protections. Public GitHub Pages currently retains email fallbacks.
4. Verify the resulting release configuration and relevant end-to-end flows, document remaining blockers, then complete the authorized push/release work. Do not imply the current local checks already prove production readiness.

### Scope to preserve

- Membership approval/decline rules, eligibility, fees and dues remain deferred until the WisConnect team confirms them. Review status must not grant membership or create an account.
- The future backend capability list discussed with Mitchell (member/application/invitation management, inquiries, subscriptions, content/events/calendar administration, activity visibility and member self-service) is the project direction, not a request to build every item before today's push. Focus the next session on releasing the working foundation.
- No active persistent goal existed when saving this checkpoint. Do not create one merely to resume ordinary work; the repository handoff is the continuity record.

## Applications intake and review tracking (12 October 2026, local)

- Mitchell requested working Applications, saved introductions and review tracking, explicitly deferring membership approval rules until team feedback. Local Join now saves all five answers with an idempotent submission key and receipt. Uncertain retries keep the original answers/key. The static public website retains its email-draft fallback.
- Administrator Applications now has search, status/assignment filters, 25-record pagination, original answers, active-administrator assignment, append-only internal notes and dated actor/change history with older-history pagination. Statuses are New, Reviewing and Waiting for information. No approve/decline, membership/account creation or applicant email. Version checks prevent overwritten reviews; retries avoid duplicate notes.
- Migration `0005_introductions` was applied to the existing local database after backup `.local/backups/20261012T161245027182Z.dump`. Existing data preserved. New `npm run applications:check` passes isolated PostgreSQL/API coverage including validation, admin-only access, pagination, duplicate submissions and concurrent review edits. Foundation/auth regressions and production export/type checks passed.
- Browser: live Join validation and synthetic submission saved all answers with receipt and initial activity; exact test record removed afterward. Workspace was signed out, so review UI testing used an isolated temporary sample route. Verified save, conflict/reload with note retention, unsaved-close confirmation, loading/error/empty, light/dark, 390px and 320px without overflow. Temporary route removed. Screenshots and evidence in `docs/reviews/2026-10-12/applications.md`. Local only; not committed, pushed or deployed.

## Member profile form consistency (12 October 2026, local)

- Mitchell requested matching the member profile to the approved invite form. Profile dialog now shares the divided header and icon close control. Personal details use a framed panel, aligned labels, inline optional labels, 44px fields, full-width biography, and a shaded save footer. Read-only email and administrator guidance remain clear. The shared component also updates the profile in Account settings.
- Access controls and account activity are framed separately with compact headers and divided activity rows. Loading skeletons mirror the form. Saving has a spinner/live status, error/reload stays inside the panel, and the initiating save control regains focus after completion. Existing account endpoints, version checks and role restrictions are preserved. Fields retain the approved muted purple inset focus accent.
- Workspace session was signed out. Verified light/dark, 390px and 320px layouts (no horizontal overflow), simulated loading/save success/save error/load error and read-only administrator restrictions in a temporary sample-data preview. No real accounts were changed. Preview removed afterward. Screenshot: `docs/reviews/2026-10-12/railway-link-workspace/member-profile.png`. Local only, not pushed.

## Subtle purple field accents (12 October 2026, local)

- Mitchell clarified that brand purple is welcome, but the previous heavy outer rings were excessive. Focused fields now use a shared muted purple (`--form-field-focus`: #8b759b; #a08daf on dark dashboard surfaces), with the existing thin inset treatment. Unfocused borders remain neutral. Applies to workspace, account entry/reset, contact, join and newsletter fields. Button styling is unchanged.
- Verified the rendered contact field uses a 1px muted purple inset outline with no outer halo. Screenshot: `docs/reviews/2026-10-12/railway-link-workspace/subtle-form-accent.png`. This supersedes the entirely neutral field-focus direction below. Local only, not pushed.

## Invite form consistency and neutral field borders (12 October 2026, local)

- Mitchell requested an Invite member form matching the workspace. The dialog now has a divided header, 24px body spacing, read-only Member role row, subdued local delivery note and shared branded buttons in a shaded action footer. Success/error/sending states follow the same frame. Success explicitly focuses Done; closing restores the trigger. Native email validation, duplicate-submit protection and existing APIs remain unchanged.
- Mitchell then requested removing the coloured outlines around forms. Dashboard fields now use a neutral inset focus border (theme-aware) without the purple outer halo; dashboard keyboard button outlines are neutral too. Login/signup/reset, contact, join and newsletter fields also use neutral default/focus borders. Branded action fills remain.
- Desktop light/dark and 320px phone layout reviewed. Required email validation and close/confirmation focus verified. An isolated temporary route tested sending, success and error states without sending real invitations; removed afterward. Screenshot: `docs/reviews/2026-10-12/railway-link-workspace/invite-form.png`. Local only, not pushed.

## Shared member navigation (12 October 2026, local)

- Mitchell flagged inconsistent Directory, Applications, Invitations and Invite member placement. All three now use one `MemberNavigation` component in the dashboard shell, replacing duplicated toolbars and the older Applications navigation/header action. Tabs share spacing, weight and active underline; Invite member retains the same leading plus icon and placement across pages.
- Mobile stacks the shared action beneath the tabs. Desktop switching and 390px mobile layout checked, with no horizontal overflow. Production build/static export, TypeScript and whitespace checks passed. Screenshot: `docs/reviews/2026-10-12/railway-link-workspace/member-navigation.png`. Local only, not pushed. Applications remains an explicitly labelled preview; backend behavior is unchanged.

## Invitations consistency and request states (12 October 2026, local)

- Mitchell approved Members and requested the same treatment for Invitations. Invitations now shares the Members tab/action toolbar, framed panel, padded header, shaded record headings, 76px desktop rows and grouped phone records. Refresh, recent count and local inbox link live within the panel. Footer explicitly identifies the latest 50 when the API limit is reached.
- Skeletons mirror recipient/status/expiry/actions and respect reduced motion. Empty state uses an email icon and working Invite member action; errors retain retry inside the frame. Status labels are Pending, Accepted (API `used`), Expired and Revoked. Existing invitation APIs and send dialog remain intact. Revocation feedback restores focus to the updated row; Refresh is disabled during revoke/loading.
- Real empty page and dialog open/cancel/focus were verified. Loading, populated statuses, error and simulated revoke success/focus were reviewed in an isolated temporary UI route with example.test data; no real invitation was sent or revoked. Preview route removed before production build. Desktop/mobile visuals and 320px overflow passed. Screenshot: `docs/reviews/2026-10-12/railway-link-workspace/invitations.png`. Local only, not pushed.

## Members directory consistency and request states (12 October 2026, local)

- Mitchell approved the overview direction and requested matching Members, loading and empty states. Directory now uses one 8px framed panel with 24px filter/header padding, shaded table headers, consistent record spacing, branded actions and an integrated pagination footer. Phones use the existing rounded panel language with grouped records.
- Loading skeletons match the real identity/role/status/action columns and stack like real phone records. Includes accessible loading status, hides decorative placeholders and respects reduced motion. Empty states distinguish no accounts, no matching filters and an empty later page; actions invite, clear filters or return to page one respectively. Errors retain retry within the same panel. Count hides while loading/errors; zero-result pagination omits irrelevant page buttons.
- Clear filters restores search focus; profile close still restores its directory action after refresh. Existing backend/account permissions preserved. Desktop/390px visual checks, 320px overflow, search/inactive-filter empty recovery and profile open/close passed. Loading and first-account empty components reviewed through a temporary local preview route, removed afterward. Production export/TypeScript passed. Previews: `docs/reviews/2026-10-12/railway-link-workspace/members-directory.png` and `members-empty.png`. Local only, not pushed.

## Overview summary — Railway Usage reference (12 October 2026, local)

- Mitchell explicitly selected `https://railway.com/workspace/usage` for overview stats. Inspected the authenticated reference: 24px framed-panel padding, 32px column gap, divided 14px breakdown rows, paired shaded 6px-radius tiles and centered 28px totals.
- Replaced the four-column stat strip with a Workspace summary: total/active/inactive account rows and View accounts action on the left, paired invitation/inquiry total tiles on the right. Mobile stacks the account breakdown above the tiles and retains the Link-inspired outer corners. Uses the existing real aggregate endpoint, WisConnect button branding and light/dark support. No usage costs, quota bars, forecasts or reference account data copied.
- Desktop and 390px visual checks completed. Build/static export and whitespace checks passed. Preview: `docs/reviews/2026-10-12/railway-link-workspace/usage-summary.png`. Local only; not pushed. Supersedes the stat strip below.

## Overview statistics (12 October 2026, local)

- Mitchell requested overview stats. Added a compact clickable summary: total accounts (including administrators), active accounts (sign-in access enabled), pending invitations (unexpired, unused, unrevoked), and all contact inquiries. Four columns on desktop, two on phones. Existing real record previews remain below.
- New administrator-only `GET /auth/overview` computes complete counts in one SQL statement; totals are independent of preview pagination. Loading/error use a dash rather than a false zero, with retry. Regular members do not request or receive stats. Stats refresh when overview mounts, invitation success changes or retry is requested.
- Extended isolated foundation checks: unauthenticated/member access denied, initial zero counts, 51 pending plus expired/used/revoked invitations, 26 inquiries and active count after deactivation. Foundation suite and build/static export passed. Browser checked desktop/390px/320px and invitation navigation; no narrow overflow. Screenshot: `docs/reviews/2026-10-12/railway-link-workspace/overview-stats.png`. Local only, not pushed.

## Dashboard buttons — homepage branding (12 October 2026, local)

- Mitchell requested the homepage brand for dashboard buttons. Shared `--brand-purple` now supplies the existing homepage purple (#563578) and dashboard primary actions. Dashboard action buttons use the homepage’s 6px control radius, 14px semibold labels, plum hover and outlined secondary treatment, at a compact 44px height. Phone action pills now follow the same brand shape. Dark surfaces retain lilac secondary labels and visible focus/borders; reduced-motion is respected.
- Checked desktop invitation dialog and 390px mobile overview. Actual computed button styling: #563578, 6px radius, weight 650, height 44px. Preview: `docs/reviews/2026-10-12/railway-link-workspace/branded-buttons.png`. Existing navigation layout and backend work preserved. Local only, not pushed.

## Railway desktop + Link mobile revision (12 October 2026, local)

- Mitchell said the Attio pass still felt off and explicitly selected Railway for workspace styling and Link for mobile. Inspected his actual signed-in Railway dashboard/People screen and Link home/account menu. No reference account data or screenshots copied into the project.
- Desktop now uses Railway’s 220px sidebar (collapsible to a 56px icon rail), 56px header, inset bordered workspace with 8px corners, 48px content padding on large screens, normal-weight 24px headings and purple actions. Existing light/dark preference remains supported.
- Phones use Link’s centered page context, circular navigation control, larger greeting, rounded content groups and a full-page account/navigation menu. Removed the floating bottom navigation. All role-appropriate sections remain reachable. Notifications preserve page scroll; menus close on resize; menu dismissal and profile dismissal restore focus.
- Real account/invitation/inquiry data and previous backend foundation remain intact. Production export/TypeScript and desktop/390px/320px browser checks passed. Review and previews: `docs/reviews/2026-10-12/railway-link-workspace.md`. Local only, not pushed; awaiting visual feedback. This supersedes the Attio shell below.

## Workspace UI correction — Attio reference (12 October 2026, local)

- Mitchell rejected the preceding UI as generic/AI-looking. The decorative purple banner, overlapping-circle artwork, marketing slogans, shortcut cards and illustrated placeholder panels have been removed. Do not treat that direction as approved.
- Inspected actual Attio CRM screens on Mobbin and followed their compact navigation, full-width records, small typography and subtle neutral dividers. New overview loads real member-account totals/first five alphabetical accounts, recent invitations and contact inquiries from existing administrator APIs. Each resource has separate loading/error/empty states; members never request these administrator endpoints. No fabricated metrics. Invitation success refreshes the overview.
- Directory search is compact, policy copy moves beneath the records, mobile rows remain readable and prior profile focus restoration is preserved. Operational sections now use short availability notices and planned table fields without decorative illustrations or promotional headings. Neutral light/dark surfaces preserve the existing theme setting. Prior backend work is untouched. Review: `docs/reviews/2026-10-12/workspace-revision.md`. Local only; not pushed.

## Workspace UI refinement — rejected direction (12 October 2026, local)

- Mitchell requested Mobbin research and a stronger dashboard/workspace UI before business-management implementation. Reviewed actual Mobbin screens from Asana, Coda, Hex, Gumloop, Supabase, Otter AI and Cal.com. Adapted Asana/Coda's grouped navigation and action-led workspace, and Supabase's team-directory hierarchy. Source links and checks: `docs/reviews/2026-10-12/workspace-ui.md`.
- Overview now contains a restrained lilac connection graphic, invitation shortcut, working member/invitation/inquiry shortcuts, clearly planned operational areas and public cooperative links. Sidebar groups Workspace, Community and Operations. Members gains identity initials, role labels, stronger filters/table surfaces and stacked phone records. Preview areas have tailored availability copy, category selection and planned field summaries instead of empty table scaffolding. No fabricated figures or operational records.
- Existing backend, account fields, authorization, invitations and recovery remain intact. Profile-dialog close now restores keyboard focus after the directory reload. Changes are local and unpushed; previous account-foundation work remains uncommitted alongside this pass.

## Account foundation and member management (12 October 2026, local)

- Mitchell requested a detailed review and implementation of the backend foundation/member management. Added private profile fields/versioning, paginated server search/filter, own-profile editing, administrator member editing, reversible access controls and activity records. Deactivation/reactivation revokes all sessions and reset tokens and never grants cooperative membership; administrator access is protected. Legacy name-only/delete APIs remain compatible; dashboard routine management uses deactivation.
- Added local password recovery: generic response, hashed single-use 30-minute links, token replacement, rate limits, SMTP rollback and complete session revocation on reset. New `/reset-password` page is linked from login/settings; static-hosted recovery remains unavailable. Shared account client preserves local-only boundaries. No real password was changed by tests.
- Migration `0004_account_foundation` applied after a private backup. Active native PostgreSQL data is now `.local/postgres`, Mailpit data `.local/mailpit/messages.db`, vendor runtimes `.local/runtime`, backups `.local/backups` (all ignored/private). Original temporary copies remain offline fallbacks. `npm run local:up` starts the preserved native services (Docker elsewhere) and migrates; `local:check` checks service/schema/storage readiness; `db:backup` creates private custom-format archives. Native cluster and test inbox were restarted successfully; backup restored and verified in an isolated database. Docker Mailpit gains a persistent named volume; Docker itself is not installed/tested here.
- Mitchell's local administrator account remains intact, with his existing password unchanged. Temporary browser-review member removed. Authentication, foundation, contact, newsletter, bootstrap validation suites and production export/TypeScript passed; real Chrome desktop/390px checks completed. Review: `docs/reviews/2026-10-12/account-foundation.md`. Not pushed. Public backend hosting, real email, member approval/fees, role/email changes and operational modules remain separate work.

## Homepage release approved (12 October 2026)

- Mitchell approved the final balanced gold artwork and continuous rails and requested pushing the changes. Release includes the closing invitation, newsletter form/local API and migration, confirmed sector-card destinations, contextual sector inquiries, and review records. Production build/static export of 15 routes passed on the final code; newsletter/contact/auth integration results are recorded below.
- Public GitHub Pages signup remains explicitly disabled/coming soon pending production API, database and email hosting. Unused supplied image alternatives, local Mobbin inspiration material and generated development route references are not release inputs. Earlier local-only entries document design history; check this release commit and GitHub Actions for publication status.

## Your next step — balanced gold artwork and continuous rails (12 October 2026, local)

- Mitchell approved the gold direction but requested less empty space on the right and the page rails continuing through this section. Balanced desktop columns, reduced their gap, increased the intact gold sculpture from a 490px cap to 620px, and shifted it slightly toward the text. Removed the section stacking override so the existing vertical rails run through it. The site's existing phone rail policy and phone layout remain unchanged.
- Desktop visual review and responsive overflow checks completed at 1100px and 390px. Latest preview: `docs/reviews/2026-10-12/next-step/desktop-gold-balanced-rails.png`. Local only, not pushed.

## Your next step — gold sculpture and integrated signup (12 October 2026, local)

- Mitchell supplied a community orb and a gold ribbon, then requested a preview of the recommended gold direction. Replaced the textile with his original transparent gold PNG (`next-step-gold-ribbon.png`), showing its complete shape at a restrained size on white. The main message and signup now share the left column; removed the separate signup card and duplicate invitation heading. Phone layout stacks the intact sculpture between the invitation and signup.
- Newsletter behavior and membership/contact destinations are preserved. TypeScript and desktop/phone visual checks passed. Screenshots: `docs/reviews/2026-10-12/next-step/desktop-gold.png` and `mobile-gold.png`. Local preview, not pushed; supersedes the textile layout below.

## Your next step — white background and smaller textile (12 October 2026, local)

- Mitchell felt the textile was too large and rejected the ivory background, then explicitly chose clean white. Set the section to `#fff`, reduced desktop artwork from 1180px to 880px (about 25%), and reduced/repositioned the tablet and phone artwork. Full-width rail treatment, copy, white signup panel and backend behavior remain unchanged.
- Desktop/phone visual fitting and whitespace checked. Latest screenshot: `docs/reviews/2026-10-12/next-step/desktop-white.png`. Local, not pushed. This supersedes the oversized ivory version below.

## Your next step — supplied textile ribbon (12 October 2026, local)

- Mitchell supplied `public/assets/0E72EE35-7D16-4212-AE45-008C1F8B6532.PNG` and requested it replace the drawn ribbons, then clarified it should have the same oversized, edge-cropped treatment. Removed the inline SVG and use the original transparent PNG, scaled through the right side and behind the signup, with CSS fading for readable text. Warm ivory palette and all signup functionality remain.
- Responsive image sizing explicitly overrides the global image max-width, preserving the decorative crop on phones. Desktop and phone layout/load checks and TypeScript/whitespace checks passed. Latest screenshot: `docs/reviews/2026-10-12/next-step/desktop-textile.png`. Other newly supplied PNGs remain untouched. Local, not pushed.

## Your next step — lighter palette (12 October 2026, local)

- Mitchell approved the full-width ribbon composition and requested a lighter background. Changed only this section to warm ivory with plum headings/body text, a muted purple italic line, plum primary action and white signup panel. Gold/lilac ribbons remain with reduced shadow opacity. Layout, rails treatment and newsletter behavior are unchanged.
- Desktop and phone visual checks completed; no horizontal overflow. Screenshot: `docs/reviews/2026-10-12/next-step/desktop-light.png`. Local and unpushed. This supersedes the dark palette below.

## Your next step — full-width graphic revision (12 October 2026, local)

- Mitchell rejected the inset photographic version because it clashed with the page rails and repeated an image used elsewhere. Replaced it with one full-width plum surface and original gold/lilac SVG ribbons. This section covers the fixed rails locally (z-index 89) while navigation remains above; the rest of the rail system is unchanged.
- Removed the community photo, image import, credit and separate lilac signup band. Oversized editorial copy, cream signup panel, membership/partnership/contact destinations and all existing signup behavior remain. Mobile uses a quieter cropped ribbon composition. No new raster assets, reused photographs, backend changes, external messages or deployment.
- Desktop/mobile review covers 1440/760/390/320px, full viewport width, rail interruption, readable controls and keyboard focus. Production export and TypeScript passed. Updated images: `docs/reviews/2026-10-12/next-step/desktop-ribbons.png` and `mobile-ribbons.png`. This supersedes the photographic design described below.

## Your next step — A + F and newsletter server (12 October 2026, local)

- Mitchell selected A + F (Zipline photography + GitBook signup panel), asked for a bold finish and then authorized building the email-list server because none existed. Added `next-step.tsx/.module.css`: existing credited community photograph, oversized cream/gold headline, membership action, lilac band with cream email signup and compact partnership/question links. Mobile preserves all four faces and stacks the signup. `#join` is preserved.
- Added a PostgreSQL subscriber model/migration and FastAPI subscribe, confirm, unsubscribe and administrator list endpoints. Unique normalized addresses, atomic resend claim, explicit consent, hashed tokens, 24-hour single-use confirmation, unsubscribe/resubscribe, validation, failure feedback and rate limits are included. Only confirmed addresses appear in the default admin API list; this is separate from cooperative membership. No campaign-sending or dashboard newsletter view was added.
- Local signup uses the existing API boundary and Mailpit capture only. GitHub Pages signup stays disabled with clear coming-soon text until API/database hosting and a verified sender are configured. No external emails, push or deployment. Operational details: `docs/design/newsletter-service.md`.
- Docker was absent in this environment, so an isolated temporary PostgreSQL 17 database and Mailpit were started on loopback using official downloads. Database lives at `/tmp/wisconnect-newsletter-pg`; Mailpit data at `/tmp/wisconnect-mailpit/messages.db`. This did not replace old records. The normal Docker compose volume remains the intended persistent local setup.
- Newsletter, contact and authentication PostgreSQL integration suites passed. Build/static export now includes 15 routes. Browser checks and screenshots are recorded in `docs/reviews/2026-10-12/next-step.md`. Previous sector-card changes remain intact and uncommitted.

## Your next step inspiration board (12 October 2026, local)

- Mitchell requested a visually striking closing “Your next step” section with a newsletter signup, and explicitly asked to research Mobbin and create an inspiration page before implementation. His later A + F selection is implemented above. The proposed Explore page is deferred while this section is designed.
- Mobbin connector searches timed out; after Mitchell signed in, reviewed the signed-in Chrome library and downloaded six full reference assets: Zipline, Cohere, Squarespace, Ramp, Seed (video), and GitBook. Board: `docs/design/next-step-inspiration/index.html`, served locally at `http://localhost:3100/`. Source links, provenance and restart command are in its README.
- Board includes original references, adaptation/signup notes, enlarge controls and browser-local shortlisting. Recommended A + F (Zipline photography + GitBook signup panel), with B (Cohere sculptural purple) as the strongest abstract alternative. Mitchell subsequently selected A + F and authorized a custom email-list backend; see the implementation entry above.
- Static assets, links, anchors and JavaScript syntax checked. Browser control became unavailable at final board preview, so rendered-page checks remain pending. No homepage design changes, live subscription, commit, push or deployment for this task. Existing sector-card edits remain intact.

## Sector cards and business destinations (12 October 2026, local)

- Mitchell requested sector cards that lead to the right businesses. Coffee shops now links to Momentum Coffee, Day care to Bunnyland, and Shared kitchens to Exquisite Kitchen. Links reveal the directory tile, clear any filters that hide it, highlight it and transfer keyboard focus; the tile opens its existing details.
- The five remaining Chicago sectors use “Ask about this sector” with a contextual contact link. Supplied descriptions establish catering and apparel production, but do not establish a restaurant, clothing store or screen-printing service; Jennima’s Juice is listed in Liberia. These were not treated as confirmed Chicago sector matches.
- A shared sector list validates contact query parameters. The contact page prefills Member enterprises and a Chicago-sector inquiry, including the hosted email fallback. Generic contact behavior is preserved. No messages were sent and no backend or membership changes were made.
- Production static export (14 routes), TypeScript and whitespace checks passed. Browser checks covered the three directory destinations and dialogs, repeat links with a filtered-out target, all five contextual inquiries, generic contact defaults, 1440/390/320px layouts, carousel arrows/keyboard/swipe and mobile navigation. Review/screenshots: `docs/reviews/2026-10-12/sector-links.md`. Not committed or pushed.

## Homepage clarity and biography previews (12 October 2026)

- Release approved on 12 October: Mitchell requested pushing this completed homepage pass and deferring membership-information work. Include the homepage changes, review notes and three screenshots. Check the release commit and GitHub Actions for publication status; the local-only notes below describe the review stage.
- Mitchell approved the first improvement pass after a local site review and created a goal for clearer flow, tighter introductory copy and shorter biography previews. The opening now runs hero → practical support → visionaries → business directory; purpose, the W cooperative model and People/Capital/Communities follow as deeper context. All fourteen visible sections and the hidden unfinished sections remain.
- The hero’s secondary action is now “Explore our support” and targets `#what-we-do`. Services name their four existing areas in plain language and retain an availability caveat. Purpose, people, belief and Chicago-sector introductions are shorter. Supplied mission/vision and all full biographies remain verbatim; no membership terms or availability claims were added.
- All eight flip cards now show factual short summaries; open cards size to their content without a nested biography scrollbar. Original portraits, role labels, flip controls and full-profile dialogs remain. W source, imagery, scroll timing and fallbacks are unchanged.
- Production static export (14 routes), TypeScript and whitespace checks passed. Production-browser checks covered all eight summaries at 320/390/760/1440px, all full-profile dialogs and focus return, desktop/phone navigation and filtering, support controls, FAQ, anchors, and W progression/reversal/skip. Review and screenshots: `docs/reviews/2026-10-12/homepage-clarity.md`. Local review only; no commit, push, deployment or backend changes.

## Homepage pacing and membership actions (8 October 2026)

- Release approved on 12 October (FAQ, stories and visionaries): Mitchell requested pushing all pending changes. Includes the white FAQ redesign, mobile project-story stacking and final frameless visionary cards with short role labels and flip biographies, plus review notes/screenshots. Final production build/static export of all 14 routes and TypeScript passed; browser verification is recorded in the individual reviews. The local-only labels below describe earlier review stages; check this release commit and GitHub Actions for publication status.
- Visionary card refinement (12 October, local): Mitchell liked the Mammoth interaction but rejected the plum framing and long front descriptions, then requested a little information beneath names. Fronts now use frameless original portraits, left-aligned names and short role labels (e.g. “Designer & educator”). Removed fixed front heights and changed biography backs to white; phones expand an opened card only as needed for readable biography scrolling. Full roles and biographies remain inside. Supersedes the plum/centered-card treatment below. Not pushed.
- Visionary gallery (12 October, local): Mitchell requested Mammoth Brands' Leadership styling while preserving our portrait background colours. Inspected the live reference on desktop and mobile. “Meet the visionaries” now has a centered serif heading, compact plum-framed cards, centered roles/names and a four-column desktop / two-column phone grid (three on tablets). All eight existing studio portraits remain unchanged. Cards flip to scrollable biographies; “Read full profile” retains the existing detailed dialog, expertise and business connections. Inactive faces are inert; keyboard focus transfers between faces, Escape returns to the portrait, and reduced motion disables the transition. Browser checked all eight profiles and focus return, 1440/900/760/390/320px layouts, long biographies, original loaded images and reduced motion; TypeScript and production export passed. Review: `docs/reviews/2026-10-12/visionaries.md`. Not pushed.
- Mobile project-story stack (12 October, local): Mitchell requested Stripe's scroll-stacking behavior for “The work taking shape.” Re-inspected Stripe at 390px: cards use sticky positioning with staggered top offsets. Our three white story cards now overlap progressively on mobile (up to 760px), using 48px steps to suit the existing type/badges. The top inset follows the navigation's visibility. A ResizeObserver enables stacking only when all cards fit the viewport; short screens, reduced motion and keyboard focus use normal flow. Desktop accordion and all story links remain. Browser checked forward/reverse scrolling, 320/390/760px, short-screen/reduced-motion/keyboard fallbacks and all three article links; TypeScript and production export checked. Review: `docs/reviews/2026-10-12/mobile-story-stack.md`. Not pushed.
- FAQ background refinement (12 October, local): Mitchell requested removing the background image, then specified white. FAQ now uses a plain `#fff` background with no textile or gradient; the three question photographs remain. Supersedes the background treatment described below. Not pushed.
- FAQ visual redesign (12 October, local): Mitchell approved combining Airbnb's visual question cards with a clean accordion, requesting a strong visual and background. New `frequently-asked-questions.tsx/.module.css` adds three existing editorial photographs, a lilac/ivory surface with a faint textile motif, large serif heading, native exclusive accordion and Contact action. Cards open and focus their matching answers; phones use a swipeable, keyboard-accessible card row. All six original answers remain verbatim; `#faq`, `#languages` and membership/contact destinations remain. Responsive fitting, card activation, accordion keyboard behavior, deep links, copy comparison, TypeScript and production export checked. Review: `docs/reviews/2026-10-12/faq.md`. Not pushed. The preceding stories/involvement release was pushed as `9de8d7e` and GitHub Pages deployment succeeded.
- Release approved on 12 October (stories and involvement): Mitchell requested pushing the accumulated homepage changes before researching FAQ inspiration. This release includes the restored cooperative scroll timing, slimmer navigation textile, Places/Ghana removal, white project-story accordion, Roseland image and three article pages, plus the photographic get-involved redesign and review evidence. Final production build/static export, TypeScript, responsive and keyboard checks passed. The local-only labels below describe the review stages; check the release commit and GitHub Actions for publication status. FAQ redesign remains unstarted.
- Get involved visual redesign (12 October, local): Mitchell requested a stronger visual after reviewing charity: water and Stripe Atlas references, then approved building a photographic invitation with a plum steps panel. Replaced the text-only three-column section with a large existing PICHA Stock collaboration photo, oversized serif heading, gold step numbers, a high-contrast introduction button and a slim textile edge within the existing rails. Phones stack the photo and steps; the photo keeps all three faces visible. Retained the five-question/manual-email journey, membership clarification and `/join` destination. Photo remains visibly credited as illustrative. Desktop/mobile fitting, keyboard navigation, TypeScript and production export checked. See `docs/reviews/2026-10-12/get-involved.md`. Not pushed.
- Roseland update and story pages (12 October, local): Mitchell supplied the original wisconnect.co Roseland RFQ update and requested its photograph plus a separate page for “Read the story.” Added Roseland as the first of three stories, preserving the Initiative and Liberia entries. All story actions now use links to `/stories/[slug]`, with three statically generated pages, responsive original imagery, metadata and return links; removed the temporary reading dialogs. Roseland keeps “prospective developer” and “proposed 60,000 sq ft” wording, Elizabeth Carter's local connection, and a link to the original update. Photo is the original site's Greater Roseland image, credited to Patrick L. Pyszka / © City of Chicago with embedded XMP retained. White section background remains. Browser checked all links/pages, refresh, return navigation and 390/320px fitting; build/static export includes all three pages. See `docs/reviews/2026-10-12/roseland-story.md`. Not pushed.
- Project section background (12 October, local): Mitchell requested white for “The work taking shape”; its section background is now `#fff`.
- Cooperative project stories (12 October, local): Mitchell requested adapting Stripe's enterprise customer-story accordion for “The work taking shape.” New `community-projects.tsx/.module.css` replaces the two text cards with two photo-led project stories: one expanded at a time on desktop, both stacked at widths up to 760px, location/stage/focus details and working “Read the story” dialogs. Existing Chicago development vision and Liberia content remain; no new progress claims or metrics. Reuses existing illustrative imagery. Production build/static export and TypeScript passed; browser checked desktop/760/390/320px, keyboard switching, dialogs, Escape/close/focus return, scroll restoration and reduced motion. See `docs/reviews/2026-10-12/cooperative-stories.md`. Not pushed.
- Ghana removed from diaspora section (12 October, local): After previewing a Ghana connection, Mitchell requested removing Ghana and its name. Removed its map pin, label, route, country selector, detail text and mention in the section introduction. Liberia, United States, Brazil and Vietnam remain. Not pushed.
- Local roots section removed (12 October, local): Mitchell requested removing “Local roots · A wider network / Different places. A shared purpose.” Removed the complete Places section, its Chicago/Liberia cards and Ghana/Vietnam note, plus its navigation/footer links and unused styles. The existing diaspora connections map and community projects remain. Not pushed.
- Navigation textile (12 October, local): Mitchell clarified that the requested reduction was the textile ribbon beneath the navigation, not the text. Restored all navigation font sizes and reduced only the homepage ribbon to 16px (12px at widths up to 620px), from 34–46px desktop / 30px phone. Pattern, logo and navigation behavior remain. Not pushed.
- Cooperative section restoration (12 October): Mitchell rejected the experimental serif W, which was fully removed, then requested restoring only “A cooperative of businesses” to its state before the pacing release. Its original W, photos and chapter behavior remain; the scroll track is restored to 520/540svh (desktop/phone). Other homepage spacing and membership actions remain as released. This restoration is local and has not been pushed; the shortened-track measurements below describe the earlier release.
- Mitchell requested a homepage review and created a goal to refine pacing, spacing and membership actions while preserving the current design/content. Local changes shorten the W scroll track from 520/540svh to 380/400svh (desktop/phone), keep all three photographs/chapters, reduce homepage section spacing and cooperative-card gaps, and tighten the support introduction spacing. Rails, photos, directory sizing, navigation behavior and hidden unfinished sections remain.
- Main membership actions now say “Introduce yourself”; the header uses “Membership”. The hero explains the five-question introduction and manual email send. Existing Join behavior and all destinations remain; no new submission service or membership approval is implied.
- At 900px viewport height, the production homepage is 22,935 → 21,243px tall at 1440px width, 25,894 → 24,370px at 390px, and 27,340 → 25,802px at 320px. Profiles appear 1,341–1,388px sooner. All fifteen visible sections remain in their original order.
- TypeScript, production build/static export and whitespace checks passed. Chromium checks cover desktop/phone rendering, filters, dialog Escape/focus return, navigation, support cards, FAQs, all three W chapters, forward progression and scroll reversal, skip link and reduced-motion/short-viewport fallback. No broken loaded images, unresolved homepage anchors or horizontal page overflow at 1440/390/320px. See `docs/reviews/2026-10-08/homepage-pacing.md` for evidence and limitations.
- Release approved on 12 October: Mitchell requested committing and pushing this homepage refinement, review notes and three screenshots. Check the release commit and GitHub Actions for publication status. Earlier local-only notes describe the review stage. Website/API background processes were started during the October 8 session; database/Mailpit setup was still awaiting the container runtime installation. This refinement does not complete the unfinished Phase 1 dashboard workflows.

## Source-based structure and temporary hiding (latest updates)

- Mobile business imagery restored (3 October): Mitchell requested visible images on the mobile directory cards. Supersedes the name-only mobile treatment: all eleven existing business images now fill their compact tiles, with a dark overlay, light name marks and a 4px brand-color lower edge. Two-column sizing, filtering and animated details remain. Browser verified all eleven images loaded at 390px, no overflow at 320/390px, and detail opening/closing at 320px. CSS-only change; whitespace check passed. Screenshot: `docs/reviews/2026-10-03/directory-mobile/gallery-images-390.png`. Mitchell approved committing and pushing this update on 3 October; check its release commit and GitHub Actions for publication status.

- Mobile W spacing (3 October): Mitchell requested bringing the cooperative heading and W closer on phones before pushing the dialog fixes. The mobile mask now starts at the top of its stage, then moves toward the center as it expands. The scroll hint follows the opening W height; the static fallback also loses its extra top padding. Desktop positioning and all three images/chapters remain. Browser checked 390px opening/expansion/story, 320px fit and 1440px mask centering. Included with the approved dialog-control release; check its commit and deployment for publication status.

- Dialog controls (3 October): Mitchell noticed decoration around the X controls and focus color around cards after closing, in both the business directory and Meet the visionaries. Removed the business close border and visionary close background; kept 44px targets. Added narrowly scoped pointer/tap focus decoration suppression for these dialog controls, restoring normal focus indicators on keyboard input without removing focus or changing dialog focus return. Browser checks confirmed click-close restores focus without a ring, while Tab/arrow navigation, Enter and Escape keep visible keyboard focus in both sections. TypeScript and whitespace checks passed. Mitchell approved pushing these fixes on 3 October, together with the mobile W spacing adjustment.

- Directory mobile layout (3 October): Mitchell requested matching Mammoth's mobile Our Brands gallery. Compared the live site at a 390px viewport: two compact columns, 30vw tile height, 5px gaps, centered name marks on solid colors and a centered last odd tile. Applied this below 761px within WisConnect's rails; photos remain in the animated full-screen details. Mobile search/location/sector controls now expand from a Search & filter button. Desktop posters and always-visible filters remain. Browser checks at 320/390/760px found no horizontal overflow; filtering, empty-state reset and detail opening/closing checked, and 1440px desktop confirmed. Production build, TypeScript/static export and whitespace checks passed. Review: `docs/reviews/2026-10-03/directory-mobile.md`. Mitchell approved committing and pushing this update on 3 October; check the release commit and GitHub Actions for publication status.

- What WisConnect does (3 October): Mitchell selected Calendly's “Built for people whose work runs on meetings” connected expanding-card section and clarified this is the target section. Added `what-wisconnect-does.tsx/.module.css` with centered introduction/Contact action, four original illustrated cards, WisConnect color tokens, desktop hover/click/focus expansion and stacked small-screen activation. Original full service titles, descriptions and availability note remain. Browser checked desktop selection/keyboard and a 390px component preview; temporary review routes were removed. Review: `docs/reviews/2026-10-03/support-cards.md`. Mitchell approved committing and pushing this update on 3 October. Final production build, TypeScript, static export and whitespace checks passed; check GitHub Actions for publication status. Prior directory/three-image W release `c11e6eb` was pushed and deployed successfully.

- Release approval (3 October): Mitchell requested pushing the directory poster redesign and final cooperative W with exactly three images/chapters. Production build, TypeScript and static export passed. Include the authored components/styles, five business images, six cooperative WebPs, source/review notes and final opening/directory screenshots. Keep generated `next-env.d.ts`, original client source documents/portraits, unused image masters, unused conference-room assets and superseded screenshots local. Check the release commit and GitHub Actions for publication status; local-only entries below describe the review stages.

- Cooperative scroll reveal (3 October): Mitchell requested Mammoth's oversized image mask idea in “A cooperative of businesses”, using a butterfly-like W, existing copy over images, comparable width and new photos from the existing stock source. Added `cooperative-overview.tsx/.module.css`: original W at approximately 95% visible section width, three-photo opening composition, exactly three scroll-driven scenes, skip link and static reduced-motion/short-viewport/no-mask fallback. Three new Pexels photos replace reused images, with responsive local WebPs and documented sources. Desktop and compact browser checks and production build/typecheck/export passed; dedicated phone and reduced-motion browser emulation remain unconfirmed. Review: `docs/reviews/2026-10-03/cooperative-reveal.md`. Mitchell clarified exactly three images total: removed the fourth conference-room photo from the rendered section, combined the model copy into the businesses/cooperative scenes, and retimed all three chapters. All current directory/navigation work remains. Local only, not pushed.

- Business posters: Mitchell approved the researched direction after reviewing Mammoth and Pentagram. Directory now shows business imagery immediately, with individual print, arch, editorial, split, citrus and full-photo compositions and varied name typography. Kept two columns, search/filters and full-screen detail animations, now anchored to each visible image. Tightened the introduction and filter spacing. Mitchell liked the result and requested a lighter background: now `#f4eff6`, with subtle curved threads. No owner portraits or extra logo symbols. Existing sector imagery/provenance remains; no new assets generated. Build/typecheck/export passed before the final background and location-label CSS tweaks; mobile detail/Escape and fitting checks passed. Local only, not pushed.

- Blended tile palette: Mitchell asked to mix WisConnect colors into the Mammoth palette. Eight tiles now use the site's purple, gold, plum, lilac and mauve; cobalt (CZL), orange (Jennima's) and indigo (Momentum) remain as reference accents. Matching detail palettes update with the tiles. The lilac background and curved pattern remain. Local preview only.

- Mammoth tile palette: Mitchell requested the actual inspiration site's business colors. Read the live Mammoth brand-card computed styles: Harry's `#1f35a9`, Flamingo `#280d66`, Lume `#ff5100`, Mando `#000000`, Coterie `#0000c0`. Applied that five-color sequence across eleven directory tiles and matching details, with white name marks and dark small text on orange for contrast. The lilac section background, curved-line variation and scoped divider treatment remain. Local only, not pushed.

- Current directory background: Mitchell chose the Meet the visionaries treatment with a new variation of its purple/gold flowing SVG lines, then requested a slightly darker base. Directory uses pale lilac `#eee7f1` with 24 subtle curves; no background image. Removed horizontal rules only at the directory's boundaries; other section dividers and vertical rails stay. This supersedes the background experiments below. Brand-colored tiles, business imagery and interactions remain; local only, not pushed.

- Softer-background iteration: Mitchell also disliked the plain white directory backdrop. Trying the existing `bg-light.webp` with a translucent cream wash, fading into the site's sand color below the first rows. Kept plum text, light controls, brand tile colors, imagery and animations. Local preview; replaces the plain-white trial below.

- White-background correction: Mitchell rejected the dark directory backdrop and requested white again. Removed the directory background-image binding and restored white with plum/purple headings, muted copy and light search/filter surfaces. Brand-colored business tiles, sector imagery and interactions remain. Local preview only; supersedes the dark-background decision below.

- Palette correction: Mitchell requested the existing `bg-dark` (or `bg-light`) project image and a return to WisConnect brand colors. Directory now uses `bg-dark.webp` with a plum readability overlay; tiles and expanded details use the site's purple, plum, mauve, lilac, gold and sand tokens. Kept business-sector imagery and names without symbols. Desktop/390px browser checks confirmed the background, all eleven tiles, no horizontal overflow or broken loaded images, and the coffee detail image/palette. Production build, TypeScript, static export and whitespace checks passed. Screenshots in `docs/reviews/2026-10-02/business-portfolio/brand-*.png`. Local only, not pushed. This supersedes the nine-color palette below.

- Latest portfolio refinement: Mitchell liked the interaction and requested a darker section, brighter varied tile colors, visuals representing the businesses instead of owners' faces, and no symbol above the names. Applied dark plum section styling with nine saturated tile colors and text-only name marks. Replaced all directory portraits with existing sector photography and five newly generated conceptual sector images (coffee, catering, professional workspace, crops and minerals), optimized into `public/assets/business-*.webp`. Business details identify imagery as illustrative; original owner biographies remain available. Image provenance and exact prompts: `docs/reviews/2026-10-02/business-portfolio-imagery.md`. Preserved layout, animations, records and navigation. Local only, not pushed.

- Portfolio implementation: Mitchell approved the Mammoth-inspired directory, asking for comparable tile size within WisConnect's rails and a centered section. Replaced the interim list with a two-column logo gallery on desktop/phone, 30vw tile heights (600px cap), centered odd tile, original brand colors/marks, owner-portrait hover reveals and graphic artwork for businesses without photos. Click opens a native full-screen dialog with animated image movement and color fade, desktop columns/mobile stack, supplied business details, Contact and existing biography handoff. Preserved filters/search, eleven records/anchors and the restored navigation/textile behavior. Browser checks and build/typecheck/export passed; details in `docs/reviews/2026-10-02/business-portfolio.md`. Local only, not pushed. Earlier list and reference-only notes below are historical.

- New reference inspection (not implemented): Mitchell proposed Mammoth Brands' Our Brands section (`https://www.mammothbrands.com/`) for the directory, with matching desktop/mobile click animations in WisConnect colors. Inspected live at 1440px and 390px with the browser Playwright API; opened Harry's on desktop and Flamingo/Lume on mobile, and checked closing. Reference uses two columns on both widths, centered final odd tile, large colored logo tiles, desktop hover photo reveal, and a fixed full-screen detail surface in the selected brand color. Desktop detail is two columns (logo/photo and story/link); mobile stacks logo/photo/story/link. The overlay fades opacity/background over 300ms with cubic-bezier(.4,0,.2,1); card photo hover has a 500ms opacity transition and 200ms delay. Observed photo repositioning during the transition and detail content disappearing before close completes. Match the experience with original business marks, WisConnect palette and supplied business content; do not treat the reference's imagery as assets for our businesses. This turn only researched the interaction; directory implementation remains the list below, and the restored navigation behavior must be preserved.

- Follow-up correction: Mitchell asked to put the navigation back the way it was. Restored the released header/hero markup and CSS exactly, including hide-on-down/reveal-on-up navigation and the textile inside the hero only. The textile no longer follows the navigation down the page. Retained the new business list and adjusted its anchor clearance for the restored header. This supersedes the navigation change described below; the saved list screenshots show that earlier navigation experiment.

- Latest correction after directory release `1071f77`: Mitchell requested a lean list rather than cards, renewed research, and the textile visible with navigation. Inspected the live Y Combinator directory; rebuilt the directory as one column with small original symbols, thin dividers, existing descriptions, owner links and Connect actions. Search, combined filters, all eleven source records and business anchors remain. Moved the original textile from the hero into the fixed header so it accompanies navigation when scrolling back; updated hero/anchor/menu clearance and dropdown stacking. Checked 1440/900/390/320px, filters, search, empty reset, biography, repeated filtered anchors and desktop/phone menus. Build/typecheck/static export and whitespace checks passed; final dropdown layering was visually checked in development. Details/screenshots: `docs/reviews/2026-10-02/business-directory-list.md`. This correction is local and not pushed; earlier card-design notes below are historical.

- Directory release approval: Mitchell subsequently requested pushing the completed directory redesign on October 2. Include the directory components/data, review notes and three preview screenshots. Check Git/Actions for the release commit and publication status; the local-only statements below describe the review stage. Source documents, unused image masters and generated `next-env.d.ts` edits remain excluded.

- Subsequent directory design pass: Mitchell selected Contra/Airbnb inspiration and clarified that logos means business-name marks for listings. Live Contra People and Airbnb Services were inspected with the in-app browser's Playwright API. Directory now uses original vector name marks, cards, portraits, location/sector filters and search. Existing business records/anchors remain; details and verification are in `docs/reviews/2026-10-02/business-directory.md`. This subsequent design pass is local, after release `c37e0b4`; do not assume it has been pushed. The new marks are directory design concepts, not supplied official logos.
- Directory validation: final production build/typecheck/static export passed; browser checks covered 1440/900/390/320px, combined filters/search, empty-state recovery, keyboard activation, profile dialogs and repeated filtered deep links. All eleven data records match the released source exactly; no broken loaded directory images or browser errors observed.

- Mitchell subsequently authorised restructuring from the reviewed emails/documents and **temporarily hiding unfinished sections while retaining their source**. This supersedes the earlier keep-every-section-visible correction below. Preserve the existing design and active work.
- Public flow now includes a holding-cooperative explanation, eleven alphabetical business entries with location filters, eight profiles (Kailyn added, Chipo expanded), concrete service summaries, WCI/Liberia project context, Chicago/Liberia business lists, a map with Ghana added, and three member stories drawn from biographies. Existing hero, mission/vision, cooperative stack, Chicago carousel and short Join flow remain.
- The old empty/proposed/editorial sections, impact placeholders and duplicate contact block remain in `app/page.tsx` behind `showUnfinishedSections=false`; the active navigation/footer omit those destinations. Restore individually when content is ready, not by indiscriminately enabling all legacy fallbacks.
- Mobbin About and Showcase collections were accessible and visually inspected. Adapted spacing, information hierarchy and browsing patterns to existing WisConnect styling. Research, evidence, restoration notes and checks: `docs/reviews/2026-10-02/content-structure.md`.
- Source corrections from the preceding correspondence review: current members approve by consensus; Jennima's ZIP still needs Drive access. Older contract-status notes require rechecking against the correspondence and are not current evidence.
- Final production build/typecheck/static export and diff whitespace checks passed. Browser verified 1440/1280 desktop, 614 compact and 390/320 phone layouts, filters, repeated directory links, biography/story links, navigation and hidden sections. Screenshots are in the review folder.
- Mitchell reviewed the result and authorised committing and pushing it on October 2. This release includes the website, two optimized Kailyn portraits and review documentation; original source documents, unused images and generated `next-env.d.ts` changes stay local. Check Git/Actions for the release commit and deployment outcome. Historical local-only notes below describe earlier stages. Further content and dashboard operating details remain later work.

## Focused homepage copy and journey (2026-10-02)

- Correction after the initial preview: Mitchell explicitly rejected getting rid of the other content. Restored every omitted section to the rendered homepage, including directory, services, programs, resources, community work, impact/map, interactive stories, news, events, gallery and Contact information. Their original copy and interactions are restored. Navigation/footer links are restored alongside the new Get involved menu. Keep the clearer hero/cooperative/team/business copy, supplied mission/vision/bios, new membership steps and FAQs. Do not remove content again as a shortcut to shortening the page. The eight-section and shorter-page results below describe only the superseded first preview.
- Mitchell requested a focused homepage and clearer copy based on existing supplied material, preserving the current visual direction. Eight sections now cover hero, purpose/mission/vision, cooperative model, visionaries, Chicago sectors, membership-interest steps, FAQs and a closing membership/partnership/contact invitation. Navigation/footer match this flow.
- Retained hero/textile artwork, purple/gold palette, mission/vision photography, cooperative stack, seven profiles and eight-sector carousel. Source comparison confirms mission/vision statements, all profile data and sector names are unchanged. New copy is a review draft; no new client approval, guarantees, funding services, program schedules or acceptance timing is implied.
- Pending directories, programs, resources, community initiatives, impact figures/map, editorial previews, news, events and gallery are deferred from the homepage. The broader Phase 1 content needs remain in docs/phase1-website-content.md. Email-based Join behavior and local-only Contact/auth boundaries are unchanged.
- Build/typecheck and Playwright desktop/mobile checks passed. At 1440px the homepage is about 43% shorter; phone layout fits at 390/320px. Checked navigation, anchors, cooperative detail, profile dialog, carousel, FAQ, Join and partnership Contact destinations without submissions or account changes. Added Next.js's documented smooth-scroll HTML attribute for route transitions. Preview screenshots and detail: docs/reviews/2026-10-02/REVIEW.md.
- Local only: no commit, push or deployment. Existing untracked source assets are preserved. Next.js regenerated next-env.d.ts type paths during build/dev checks; this generated file is outside the authored change. Local frontend/API were started; existing per-user Docker Desktop installation required access outside the sandbox, and PostgreSQL/Mailpit containers plus migrations and API/database health were verified. Frontend localhost:3000, API localhost:8001, Mailpit localhost:8025.

## September 29 forms and homepage release

- Mitchell authorized committing and pushing the accumulated work after the Join background update. Scope: Contact, Login and Join design/flows; local Contact inbox/backend/migration; homepage team spacing, mobile rails, directory simplification and eight Chicago business sectors; related checks and documentation.
- Include the 16 optimized sector WebP assets. Unreferenced original portraits, generated studio masters, PDF and DOCX source documents remain local and are excluded from this release. Generated next-env.d.ts changes are excluded.
- GitHub Pages publishes the static frontend only. Hosted login and direct Contact submissions remain intentionally unavailable; Join prepares an email draft. Backend storage and Mailpit notification checks have passed locally. Real SMTP delivery and production API/database hosting remain future configuration.
- The release is a feedback preview. Historical “local/unpublished” notes below describe earlier stages. Check Git/Actions for the release commit and final deployment status. The team email is a draft, not an automatically sent message.

## Join visual redesign (2026-09-29)

- Follow-up: use Contact’s pale purple/sand/gold background and rounded desktop surround, with its vertical fade on mobile. Keep the simplified photograph/layout, hidden rails and removed caption.
- Mitchell chose to keep the short five-question introduction for now. The supplied full business-asset questionnaire remains deferred. Read docs/join-redesign-2026-09-29.md.
- The first collage direction was rejected as feeling generic. Current Join uses one uncropped community photograph (purpose-community), a white background, direct copy and a simple introduction button. Removed decorative plum/gold panel, chef overlay, flourish, numbered benefits and slogans. The user also requested no rails and no visible photography caption; source/license notes remain in docs. Mobile keeps the photo on welcome and hides it during entry. Shared typography remains.
- Three counted steps: About you, Your contribution and Review. Added example fields, linked error summary, inline validation, focused step headings, validated review edits and cancel-edit restoration. Email draft/copy/manual text remain the delivery path; no automatic submission or membership approval. Contact’s backend submission does not apply to Join.
- Build passed. Browser exercised validation and the review flow; responsive and image checks completed. Standalone Join/entry scripts updated and syntax-checked; not run. No external email, push or deployment.

## Login flow refinement (2026-09-29)

- Built the returning-member design from the existing forms research: narrower 480px card, soft purple/gold frame, Welcome back, email example, inline Show/Hide, one Sign in action, visible help link and separate membership exploration. Mobile keeps shared typography and 24px gutters without a nested card; signup styling stays separate.
- New app/login/login-form.tsx provides focused field-error summary and credential/service errors, preserves entries after failures, disables controls while submitting, supports autocomplete/paste, and does not impose signup password rules on login. Connection retry keeps the form mounted. Shared account calls now time out after 15 seconds; mutation actions prevent concurrent duplicate starts.
- Browser checked empty/malformed fields, Show/Hide, generic incorrect credentials, successful sign-in to the member dashboard, already-signed-in state and sign-out. Confirmed the temporary member session was revoked and removed that owned test account. Desktop/390px screenshots and 320px fitting checks passed. Non-local-origin access guard verified; no production access enabled. Backend authentication logic unchanged.
- Production build passed. Existing scripts/check-auth.mjs login expectations updated (syntax check only); browser verification used the in-app Browser. Recovery assistance remains Contact; automated password reset is not implemented. API outage/timeout behavior was code-reviewed, not simulated in this browser pass. No push or deployment.

## Contact submission and redesign (2026-09-29)

- Contact now has name, email, topic (defaults to General inquiry), message and one Submit button. Removed draft/copy controls and optional business/country questions. Existing desktop photograph, mobile composition and type tokens remain.
- POST /contact saves an inquiry in PostgreSQL before attempting email. Additive migration 0002_contact_inquiries is applied locally. Admin dashboard has Contact inquiries, pagination and failed-email retry; ordinary members cannot read or retry inquiries. UUID retries prevent duplicate records and serialize notifications. No account or membership is created.
- Default delivery is local Mailpit only (8025). Real hello@wisconnect.co delivery is NOT configured. SMTP credentials/verified sender are still required; public MX records point to Google, but the user does not know the provider. Server-only settings are in .env.example; the launcher does not automatically load .env. Preserve localhost/Pages guards. Hosted submission still needs production API/database hosting.
- Build, contact integration suite and existing auth suite passed. Browser verified actual local submission/receipt, retained answers during API failure, mobile validation/focus and fitting at 320/390px, and desktop layout. The unique synthetic browser inquiry and Mailpit notification were removed. Admin access/pagination/retry were API-tested in an isolated schema; the admin inbox UI was not independently browser-tested. No external email, push or deployment.
- Read README and docs/contact-redesign-2026-09-29.md for current behavior. Earlier email-draft descriptions below are historical. Join and account designs remain subsequent work.

## Chicago business sectors (2026-09-29, after release)

- Re-read Elizabeth’s September 26, 11:22 AM email: coffee shop, day care, shared kitchen, restaurant, wellness (yoga/aesthetics/spa), juice bar, clothing store, screen printing. Replaced the homepage’s six survey sectors with these eight; Chicago is explicit. New stock photos include Black children for day care as Mitchell requested. Existing type system and carousel remain. See docs/business-sectors-2026-09-29.md for source and photography. Local and not pushed.

## Member directory simplification (2026-09-29, after release)

- Removed the duplicate homepage member directory and its menu entry; the footer now links to Meet the visionaries. Moved the introduction link below the seven portrait cards. A dedicated member directory remains future work when the wider approved roster is available. Preserved profile dialogs, mobile swipe and Business directory. Production build passed; browser checks at 390px and 1440px found no page overflow, the seven profiles remain, the bio dialog opens, the introduction link reaches Contact, and homepage anchors resolve. Local and not pushed.

## Mobile decorative rails (2026-09-29, after release)

- Hide the global vertical page rails and navigation rail ticks at 760px and below. Shared content gutters, section separators and desktop/tablet rails above this breakpoint are preserved. Local and not pushed.

## Team section spacing alignment (2026-09-29, after release)

- Aligned Meet the visionaries with the shared section/shell/section-heading layout. Replaced the independent 1200px container and 36–56px heading scale with the existing shell and `--type-section`; section padding and heading-to-portrait gap now use `--section-space-y` / `--section-content-gap`. Mobile swipe gutters use `--content-gutter`. Original flowing background, seven portraits, horizontal mobile rail and bio popup are preserved. Local changes after release 5b0a372; not yet pushed.

## September 29 release

- Mitchell authorized committing and pushing the accumulated work to `main`: seven team profiles and portraits, responsive team grid/swipe layout, supplied Purpose statements and stock photography, section-boundary refinement, mobile cooperative card overlap, desktop rail extension, and Windows backend launcher/loopback fixes.
- Include the 12 new optimized website WebP assets. Unreferenced source portraits, generated master PNGs, PDFs and membership DOCX remain local; they are not part of this release. The portrait optimization script requires those local source files.
- The entries below record work as it was completed; their “local/unpublished” labels predate this release authorization. The existing push-to-main workflow deploys the static frontend to GitHub Pages only. Backend authentication remains a local pilot. Check Git/Actions for the release commit and deployment result.

## Desktop cooperative card extension (2026-09-29)

- The user approved Clay-like desktop panels outside the rails. Above 980px, the cooperative stack extends up to 48px beyond each rail, reducing to 8px on smaller desktops with a 16px minimum screen inset. Heading/body content stays aligned with the surrounding page content. Panels paint over the rails while navigation remains above them. Existing sticky scrolling, typography and the mobile connected stack remain intact. See docs/cooperative-mobile-stack-2026-09-29.md for verification.

## Mobile cooperative card stack (2026-09-29)

- Following the Clay mobile comparison, the People/Capital/Communities panels now meet the page rails below 761px. Removed the shell's nested horizontal padding for this stack only. Panels overlap by 48px with rounded tops; a reserved bottom tail keeps photos and controls clear. Scrolling remains native, and desktop sticky behavior and typography are unchanged. See docs/cooperative-mobile-stack-2026-09-29.md.

## Purpose & identity design (2026-09-29)

- Refined Purpose into two complementary photographic panels: a warm mission panel with laptop collaboration, and a plum vision panel with a group discussion image. New PICHA Stock / Pexels photographs illustrate connection, technology and community; exact supplied mission/vision text is preserved. The section uses the existing `--type-section`, display/sans fonts, 28px subheading, 16px body text and card-radius token. Phones stack mission then vision with both photographs first, wider cards, reduced nested padding and secondary labels hidden. Original image proportions and 16px body text are preserved; the approved desktop composition is unchanged. Sources, research and checks: docs/purpose-design-2026-09-29.md. Local and unpublished.

## Section boundary refinement (2026-09-29)

- Homepage section dividers are suppressed at explicit color transitions via data-divider=background. Same-color adjacent sections keep their separator. This includes the team, service, impact/story, participation and footer transitions; internal card/list borders and vertical rails are preserved. Browser computed-style checks verified all 19 section boundaries.

## Team portraits and biographies (2026-09-29)

- Replaced Elizabeth's displayed portrait and biography; added Nikki Bravo, Tiffany “Chef Mama” Williams and Brandi Davis-Fitch using supplied biographies and photographs. Seven profiles now appear together in an equal portrait grid: four above three centered cards on desktop, two columns on tablet, and a horizontal swipe rail on phones. The original flowing purple/gold line background is restored. The biography popup is preserved; floating animation and paging were removed. Directory entries share the same profile data.
- Distinct new studio backgrounds, optimized WebP sizes, full square dialog portraits and paragraph-formatted biographies. See `docs/team-profiles-2026-09-29.md` for asset sources, prompt specifications and verification.
- Production build and typecheck passed. In-app browser checks covered all seven dialogs, paging, keyboard/focus behavior and desktop/tablet/phone fitting, including 320px width. Local and unpublished.

## Windows local backend startup (2026-09-29)

- Python 3.14.7 is installed at `C:\Python314\python.exe`. Created the project's `.venv` and installed `backend/requirements.txt`. Password and bootstrap validation checks passed.
- Docker Desktop is running. Started the configured PostgreSQL and Mailpit containers; both reported healthy. Applied migration `0001_member_access`. The local API's `/health` returned `status: ok` and `database: connected`; Mailpit on port 8025 returned HTTP 200.
- `npm run auth:check` passed against its disposable schema, covering invitations, SMTP rollback, redemption concurrency, revocation/expiry, role boundaries, member deletion, sessions, validation, CSRF, throttling and local opt-in. Its test data was cleaned up; no browser suite was run.
- PostgreSQL connection through `localhost` hung on this Windows machine. Using `127.0.0.1` succeeded; updated the database fallback, Alembic configuration and `.env.example` accordingly. `npm run db:migrate` also passed without an environment override afterward.
- Frontend: `http://localhost:3000`; API: `http://localhost:8001`; API docs: `http://localhost:8001/docs`; local invitation inbox: `http://localhost:8025`. Check existing processes before starting duplicates. No real administrator was created; Mitchell must run `npm run auth:admin` in his own terminal to choose private credentials. Nothing was pushed or deployed.

## Windows checkout update (2026-09-28)

- Active checkout: `C:\Users\champ\Desktop\wisconnect-site`, freshly cloned from the existing GitHub repository at `dead46f` (`Style terms and conditions page`), on `main` tracking `origin/main`. All 134 commits were downloaded and `git fsck --full` passed. This does not independently verify the live deployment.
- The prior source-archive copy and incomplete Git metadata are preserved at `C:\Users\champ\Desktop\wisconnect-site-backup-20260928`. All 230 original source files matched the downloaded archive before applying the Windows changes to the fresh checkout.
- Backend npm commands now use `scripts/python.mjs`, selecting `.venv/Scripts/python.exe` on Windows and `.venv/bin/python` on macOS/Linux. The API command sets its existing local-auth flag through the child environment. Startup security boundaries are unchanged. The auth browser check now saves screenshots in the operating system's temporary directory.
- README includes platform-specific environment creation and Docker guidance. Launcher checks passed for Windows interpreter selection, working directory, arguments with spaces, local-auth opt-in, missing-environment guidance, and child exit-code propagation. These checks used an isolated Python 3.12 environment only to exercise the launcher; the application's Python 3.13+ requirement is unchanged.
- Node.js is installed at `C:\Program Files\nodejs`; frontend dependencies were installed with `npm ci`. Python 3.13+ and Docker were not found in the checked locations or session PATH. Full API/database/auth verification requires those prerequisites and a project virtual environment. No real accounts, database records, commits, pushes, or deployments were created by this repair.
- Frontend verification: `npm run build` and `npm run typecheck` passed on Windows. Generated `next-env.d.ts` changes were restored to the downloaded version. No browser interaction or database-backed checks were run for this command-portability change.


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


### Logo poll prepared — 12 October 2026

- Elizabeth requested a poll of Original logo, Option 1 and Option 2 in email `1a132bb1c11b9e46` (original team thread `1a0ebcd8ce63ac6b`). User asked to create it; standing review-before-sharing preference retained.
- Created Google Form **WisConnect logo preference**, owner Mitchell Sherman (`mitchellsherman01@gmail.com`). Editor: https://docs.google.com/forms/d/1cqo9IQLyEyBSITblI-2E_6u2YYtRt2hJNr5bV7oRFOk/edit . Preview: https://docs.google.com/forms/d/1cqo9IQLyEyBSITblI-2E_6u2YYtRt2hJNr5bV7oRFOk/preview .
- Three neutrally labelled images embedded in required single-choice question; optional paragraph for comments/refinements. Primary moon + wordmark only, no tagline or presentation boards. No email collection, no sign-in requirement; no quiz.
- **UNPUBLISHED**, not accepting responses, no team email sent. User should review before publishing/sharing. Verified in browser preview that all three images and comment field render. No vote submitted.
- Chrome local upload remained blocked even after user enabled file-URL access. Google Drive upload initially auto-review rejected (unverified destination); verified root ownership and sole-owner permission with metadata, retried successfully to explicit private My Drive root `0AE8C8GhKdgipUk9PVA`. Browser then inserted images using Drive picker. No sharing permissions changed.
- Drive image IDs: Original `18aKV6mYxZaBfKC68Q-Euure6QGaIPwF1`; Option 1 `1oFweftlxjBmioFyZz8jS0vrE_LuSYWdT`; Option 2 `1r2xCMwlLNNcOi-dQh_IhaP2XFiiWG8GK`.
- Option 1 standalone extracted with built-in image_gen: `docs/design/logo-concepts/2026-10-12/option-1-poll-transparent.png`; prompt in `poll-extraction-prompt.txt`. Option 2 uses existing `wisconnect-compact-transparent.png`; original uses `public/assets/wisconnect-logo-approved.png`.
- Screenshot: `docs/design/logo-concepts/2026-10-12/logo-poll-preview.png`. No website code/deployment changed.


### Logo poll revision — exact emailed concept sheets

- Mitchell requested the poll use the versions sent in the email. Replaced both standalone concept images with the exact full presentation boards from sent message `1a132b7ee821ef3d`; retained Original logo. Verified attachment names and byte sizes match local sources (1,206,914 and 1,198,963 bytes).
- Updated form introduction to explain each emailed board is one direction with logo variations. Same required vote + optional comments. Form remains unpublished; nothing sent to team.
- Private Drive copies: Option 1 emailed sheet `1MB06QrTllc50sVpE2MPMjNuU9Zm68__9`; Option 2 emailed sheet `1-xp-dHKDFgIawfpvtHFsoOsiAmiBhZ5L`.
- Existing Google Form unchanged: `1cqo9IQLyEyBSITblI-2E_6u2YYtRt2hJNr5bV7oRFOk`.


### Logo poll published and emailed — 12 October 2026

- Mitchell approved publishing and sending the poll in the original thread with everyone copied. Published Google Form; responder access is Anyone with the link. Verified live form displays all three images, required vote, optional comment and enabled Submit. No test vote submitted.
- Live poll: https://docs.google.com/forms/d/e/1FAIpQLSfLpowHL4ub8iwql2TDQiawnlXICxhNR6hud0J9CK8vnMV-Ug/viewform?usp=header
- Sent Gmail message `1a132d116533e9d1`, original thread `1a0ebcd8ce63ac6b`, replying to Elizabeth's poll request `1a132bb1c11b9e46`. To Elizabeth; CC Sikola, Chipo, Brandi, Ade Wede, Salvation and Jennima. Verified SENT label, thread and recipient headers.
- Email links to poll, confirms same emailed concept sheets plus original, invites vote and optional refinements, explains variations, asks one response per person. No sign-in required or email collection.
- Screenshot: `docs/design/logo-concepts/2026-10-12/logo-poll-published.png`. Earlier unpublished notes are superseded.
