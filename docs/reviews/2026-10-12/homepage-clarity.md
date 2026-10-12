# Homepage clarity and biography previews

Mitchell approved a first pass focused on homepage flow, repeated introductory copy and readable biography previews. The local source at the start was clean on `main`, commit `dba5ed9`. This review describes uncommitted local changes.

## What changed

The first four sections are now hero, What WisConnect does, Meet the visionaries, and business directory. Purpose, the W cooperative model, People/Capital/Communities, Chicago sectors, project stories, diaspora connections, member stories, involvement, FAQ and the closing invitation follow. All fourteen visible sections remain. This improves the order in which visitors learn about the work; it does not substantially shorten the whole page.

The hero's secondary action now says “Explore our support” and links to the next section. The service introduction names the four existing areas of work, with a clear note that visitors should confirm availability with the team. Purpose, belief, people and sector introductions are tighter. The mission and vision statements are unchanged.

Each flip card has a short summary drawn from its existing profile. The original full biographies remain in the profile dialogs. Open cards grow to fit their summary; they no longer put biography text inside a narrow scrolling area. The front portraits, short role labels, flip transition, Close control and Read full profile action remain. Priscilla's summary stays brief because her supplied profile contains less information.

## Verification

- `npm run build`: passed, including static export of all 14 routes.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- Source comparison against `HEAD`: all eight complete biographies, supplied mission/vision and the set of inline section IDs match. W component and CSS have no changes. Existing business records, profile expertise, images and hidden unfinished sections remain.
- Inspected the production export served at `http://localhost:3100/` in the in-app browser.
- At 320, 390, 760 and 1440px widths: opened and closed all eight summaries. No horizontal page overflow, clipped summary content or internal summary scrolling. Escape closed each card.
- All eight full-profile dialogs opened to the correct person; Escape closed them and returned focus to Read full profile. Closing Chipo's flipped card returned focus to her portrait. Also checked full-profile access on a phone viewport.
- Desktop and phone navigation reached the moved directory and dismissed correctly. All homepage fragment destinations resolved.
- Directory: Liberia returned five businesses; adding “coffee” produced zero results; Show all businesses restored eleven. Momentum details opened and Meet Nikki reached her full profile. Phone search returned Momentum as one result.
- All four desktop support controls activated their matching panels. Phone Growth activation and the hero's revised support destination passed.
- W opening rendered at its new location. Scroll progress at approximately 0.37, 0.61 and 0.85 displayed the first, second and third chapters respectively; scrolling back returned to the second. Skip story reached its existing endpoint. Motion/fallback code and timing are unchanged; reduced-motion emulation was not repeated in this pass.
- FAQ image-card activation opened the membership answer. No browser warnings/errors or broken loaded images were observed in these checks.

At 1440 × 900, support starts around 806px, visionaries at 1,950px, and the directory at 3,195px. At 390 × 844, those positions are approximately 993px, 2,350px and 3,773px. Positions are for closed biography cards and may change as content opens.

## Review images

- [Desktop support](homepage-clarity/desktop-support.jpg)
- [Desktop visionaries](homepage-clarity/desktop-visionaries.jpg)
- [Phone summary](homepage-clarity/phone-summary.jpg)

No production backend, membership submission, account or deployment changes were made. Sector-card destinations and expanded project content remain separate future work. The build's generated `next-env.d.ts` import-path change was restored to its initial development form.

## Release approval

Mitchell approved committing and pushing this completed homepage pass on 12 October, including the review notes and three screenshots. Membership-information work is deferred. The local-only wording above records the verification stage; check this release commit and GitHub Actions for publication status.
