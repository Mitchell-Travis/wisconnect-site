# Team profiles update — 2026-09-29

Updated the local homepage with Elizabeth L. Carter's new supplied portrait and biography, plus Nikki Bravo, Tiffany “Chef Mama” Williams and Brandi Davis-Fitch. Chipo, Priscilla and Ade Wede remain in place. Seven profiles appear in two groups (four and three), and the member directory uses the same biographies. Dialogs display full paragraphs and square portraits without cropping.

## Content sources

Elizabeth's supplied biography in the WisConnect discovery email; Nikki's supplied `Nikki_Bravo_Business_and_Personal_Bio_2026.pdf`; Tiffany's emailed Bio (1).pdf; and Brandi's September 25 business biography email. Roles and expertise summarize those supplied texts. Existing profile text for the other three members was preserved.

## Portrait assets and edit prompts

Used the built-in image generation tool, not the CLI. The three new backgrounds were edited from the supplied photographs. Elizabeth's supplied mauve portrait was used without a generated background edit. Existing lavender, sage and gold portraits remain.

Reproducible prompt specifications for each background edit: replace only the background with a clean studio backdrop; preserve the person's identity, facial features, expression, skin tone, hair, clothing, pose and original framing; do not add text, logos, props or other people. Use powder blue (#b6ccd9) for Nikki, warm terracotta peach (#cd9987) for Tiffany, and warm ivory (#e7dfd2) for Brandi. These are summarized prompt specifications rather than verbatim tool transcripts.

Saved sources under `public/assets/`: `Elizabeth L. Carter.png`, `nikki-studio-source.png`, `tiffany-studio-source.png`, `brandi-studio-source.png`. Website outputs: `elizabeth-carter-studio-{480,800}.webp`, `nikki-studio-{480,800}.webp`, `tiffany-studio-{480,800}.webp`, `brandi-studio-{480,800}.webp`.

Run `node scripts/optimize-team-images.mjs` to rebuild those WebP sizes. Original uploads remain intact; the homepage no longer references Elizabeth's old portrait.

## Verification

- Production build and TypeScript check passed.
- In-app browser checks at desktop, 820px tablet, 390px phone and 320px phone widths covered portrait fitting, paging, profile content, image loading and horizontal overflow.
- Checked all seven profile dialogs, long biography scrolling, close/focus restoration, directory-to-profile opening and keyboard navigation.
- Added extra stage space below 360px to avoid overlap with wrapped copy and paging controls.
- Updated the existing profile-check script for seven profiles; that standalone script was not executed. Browser verification used the in-app browser.
- Changes remain local; no commit, push or deployment.
## Portrait grid refinement — 2026-09-29

Replaced the floating, paged portrait stage with a static grid inspired by the Ragged Edge and 1Password references reviewed on Mobbin. Four equal cards sit above three centered cards on desktop, two columns on tablet, and one column on phones. Names, supplied roles and Read bio cues appear below each portrait; individual background colors remain. Removed the old scroll animation, autoplay and paging state. The existing biography popup remains, including Escape/close handling and focus restoration. Arrow/Home/End navigation now covers all seven cards and scrolls focused cards into view.

Production build (including TypeScript) passed. Browser checks verified all seven dialogs and image loading, plus non-overlapping layouts and no horizontal overflow at 820, 390 and 320px; Tiffany's phone dialog fits. The legacy profile check script was updated to remove obsolete paging/animation assertions but was not executed. Changes are local and unpublished.

## Mobile swipe refinement

Restored the original purple/gold SVG line background. Below 700px, portraits use a native horizontal scroll rail with snap alignment and a partial next-card preview. Desktop/tablet grids and biography dialogs remain. Browser checks verified horizontal overflow stays inside the rail, keyboard End reveals the final member, and Brandi's mobile dialog fits. Layout checks included 320px and desktop widths.
