# Business directory design — October 2, 2026

Release update: Mitchell approved pushing this completed redesign on October 2. Check GitHub Actions for publication status. Local-preview statements below describe the original review stage.

Mitchell selected the Contra/Airbnb direction and requested implementation after inspecting the actual websites with Playwright. He clarified that the requested logos are business-name marks for the directory listings. The main WisConnect logo remains unchanged.

## References inspected

- [Contra Discover / People](https://contra.com/discover?view=people): inspected the live public discovery page, switched Projects to People, and reviewed the owner header, location, contact action and visual work examples. Adapted clear business identity and owner/contact hierarchy to WisConnect's smaller roster.
- [Airbnb Services](https://www.airbnb.com/services): inspected live service cards and opened the service-category selector. Adapted compact browsing controls, card proportions and scannable metadata.
- The earlier Mobbin references remain [Contra Discover](https://mobbin.com/flows/8826fef1-456f-40f4-9970-34a3219cb74d) and [Airbnb Services](https://mobbin.com/flows/c348592b-2194-4cc9-b8f7-2b397cb555a3).

No third-party code, logos or photography was copied. WisConnect retains its existing typography and palette. Ratings, paid rankings, booking, messaging and favourites are not introduced.

## Implementation

- Original vector symbols and typographic name marks for all eleven businesses, presented in lilac, sand, plum/gold and muted rose panels. These are directory artwork concepts, **not verified official business logos**. They can be replaced individually when approved logos arrive.
- Three columns on desktop, two on tablet, one on phones. Each card includes its supplied business description, category, location, known owner/representative and Contact link. Existing owner portraits open the original biography dialog. Nikki and Tracy's co-founder attribution is preserved.
- All/Chicago/Liberia filters, sector browsing and case-insensitive search across businesses, people, descriptions and locations. Filters combine; empty results provide a reset action. Search normalizes accents and curly apostrophes.
- Location/profile links reset all filters to reveal their target, including repeated links to an unchanged hash. Existing business IDs and all eleven records are retained. Data moved unchanged to `app/businesses.ts` and re-exported from its previous module.
- Keyboard-operable controls, visible focus, announced result counts, reduced-motion support and original semantic headings. Decorative name marks are hidden from assistive technology; business names are real text headings.

## Verification

Playwright checks: 11 all / 6 Chicago / 5 Liberia results; Chicago + Food & hospitality yields three; owner search for Tracy finds Momentum; no-results reset; combined-filter deep links and repeated same-hash links; Kailyn's biography; correct Contact destinations; keyboard filter activation. Checked 1440px desktop and 390/320px phones, with no horizontal page overflow, broken loaded directory portraits or browser errors. Screenshots are saved in `business-directory/`.

Final production build, TypeScript and static export passed (`npm run build`, exit 0). Diff whitespace checks passed. Tablet at 900px correctly uses two columns without page overflow. Source comparison confirms all eleven business records exactly match the released data. This update is a local preview; no further push is included in this design pass.
