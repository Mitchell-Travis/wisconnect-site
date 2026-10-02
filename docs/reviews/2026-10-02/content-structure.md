# WisConnect content structure — October 2, 2026

Release update: Mitchell reviewed this result and authorised committing and pushing it on October 2. The implementation and verification below describe the completed local pass; check GitHub Actions for publication status.

## Request and preservation

Mitchell explicitly authorised restructuring the public website around the reviewed client material, keeping the existing visual identity and work, and temporarily hiding unfinished sections. This supersedes the earlier instruction to keep every unfinished section visible; it does not authorise deleting that work.

The hero artwork, typography, plum/lilac/gold palette, exact mission/vision statements, cooperative stack, existing seven profiles, Chicago's eight sectors, short Join flow and contact route remain. Kailyn is the eighth profile. Chipo's summary is expanded. Existing unrelated uncommitted work is preserved. No deployment, messages, database changes or dashboard implementation were performed.

## Visible flow

Hero → Purpose → Holding cooperative explanation → People/Capital/Communities → Eight visionaries → Chicago sectors → Alphabetical business directory → Services → Community projects → Chicago/Liberia → Connection map → Member stories → Membership-interest steps → FAQs → Participation → Footer.

- Eleven network businesses, with All locations / Chicago, US / Liberia filters (11 / 6 / 5).
- Each location lists its businesses. Business links reveal entries even when the directory is filtered to a different country.
- Available profiles and business entries link to each other. The directory says “network”; a person's professional practice is not automatically claimed as legally owned by the holding cooperative.
- Missing owners, street addresses, direct business contacts and commercial details are omitted. Introduction links use WisConnect's existing Contact page.
- Chicago's Wisdom Connection Initiative is a **development vision**, not a completed hub. Liberia copy describes the documented areas of work without turning forecast investment figures into results.
- Ghana and Vietnam are developing connections. Brazil remains a longer-term connection vision. The map is not an office locator or a claim of operating branches.
- Three short member stories use supplied biographies and portrait assets; they open the full profile. No invented interviews or testimonials.

## Temporarily hidden

Original programs, resources/videos, generic community-work placeholder, old editorial stock-photo stories, news, events, gallery, impact metric placeholders and duplicate contact-information block remain in `app/page.tsx`. The original directory fallback, navigation inventory and footer also remain in source. `showUnfinishedSections` is false. Navigation and the active footer point to available sections only.

Restore appropriate sections individually as their content arrives; do not simply enable all legacy fallbacks for a public release. Existing source assets, story data and styles are preserved.

## Content evidence

| Content | Evidence reviewed | Application |
| --- | --- | --- |
| Cooperative structure, Liberia affiliate, sectors, consulting, WCI | Client-shared `WisConnect Liberia Overview.pdf`, especially pp. 1–2, 7–11 | Plain cooperative explanation, services, Liberia/location and project summaries. Financial projections on p. 12 are not published. |
| Consensus governance; alphabetic business list by location | Chipo and Elizabeth's September 26 correspondence | Cooperative explanation, A–Z directory and country lists. |
| Chicago's eight sectors | Elizabeth's September 26 list | Existing sector carousel preserved. |
| Liberia now; Ghana/Vietnam later | September 29 website feedback | Active Liberia content, developing-connection labels for Ghana and Vietnam. |
| Kailyn and Bunnyland | Sikola's September 30 email and `IMG_4869.jpeg` | Supplied biography and authentic photograph; resized/encoded as WebP without generative retouching. Expansion/nontraditional-hours care remains an ambition. |
| Chipo and CZL | [Chipo's supplied Bios deck](https://docs.google.com/presentation/d/1v2erVFQBiWg8gKYkPfX8xuEmRASH_BiB_9kooS-jN_A/edit) | Expanded profile, omitting inconsistent experience-year counts across versions. |
| CZL Chicago location | [CZL's official contact page](https://czl-pc.com/contact/) | Chicago directory location; no private contact information added. |
| Nikki/Momentum, Tiffany/Exquisite, Brandi/BDavis | Client-supplied biographies already incorporated in the project | Brief business descriptions and member-story summaries; full bios preserved. |
| Ade/ZE’AD | Supplied `Profile_Ade Wede.docx`; [UNDP Liberia](https://www.undp.org/liberia/stories/undp-boosts-female-entrepreneurs) corroborates firm's Liberia context | Professional connection, partner role, Liberia location. |
| Jennima, WisInSup, River Cess businesses | Liberia overview p. 11 and project emails | Brief entries; no invented products, owner names or contact details. Jennima's inaccessible ZIP is not treated as read. |
| Membership introduction | Existing user-approved five-question flow and client membership documents | Preserved; no automatic approval or online dues introduced. |

## Research and design application

Research informed presentation, not proof that a particular layout will improve conversion.

- [Mobbin About collection](https://mobbin.com/search/sites?content_type=sections&sort=trending&filter=pageAndSectionPatterns.About), including [Duna](https://mobbin.com/sites/sections/cff185ce-b679-44ce-b533-0ac4cb901a18) and the visible Craft Agency team example: direct introductory statements, generous space and clear separation between introduction and supporting material. Adapted to the cooperative explanation and local-place cards using WisConnect's existing typography and colours.
- [Mobbin Showcase collection](https://mobbin.com/search/sites?content_type=sections&sort=trending&filter=pageAndSectionPatterns.Showcase+Section): inspected the visible Mora/Harvey examples and Mobbin's own labelled browse cards/filter controls. Applied consistent information hierarchy, local filters and restrained borders to the directory; no third-party artwork or code copied.
- [US Federation of Worker Cooperatives directory](https://www.usworker.coop/directory/) and its indexed directory entries: business discovery benefits from explicit name, location and business category. Adapted these fields to an A–Z list suited to this small roster. No search box needed for eleven entries.

## Verification

- Final production build, TypeScript and static export passed after the icon and repeated-link fixes (`npm run build`, exit 0). `git diff --check` passed.
- In-app browser inspected desktop (1280 and 1440), compact (614), and phone (390 and 320) layouts. No page-level horizontal overflow; new section copy wraps within the phone layout.
- Directory filters returned 11 total, 6 Chicago and 5 Liberia entries. Cross-country location links reset the filter and positioned the selected entry beneath the header; repeated links to the same hash were verified after a clean reload.
- Kailyn's dialog, supplied biography and business backlink checked. Expanded Chipo content checked against source. New story and directory controls reuse the existing accessible profile dialog.
- Phone menu opens with keyboard, mobile submenu reaches Community projects. Active navigation anchors resolve; hidden sections/metrics do not render. Existing Join/Contact links retain their routes.
- No broken loaded images or browser console errors observed.
- Saved views: `content-structure/cooperative-desktop.jpg`, `content-structure/directory-phone.jpg`, `content-structure/projects-320.jpg`. Additional final desktop and phone views may accompany these.

## Remaining content (outside this local restructuring)

Jennima's ZIP remains inaccessible. Further business photos/logos, detailed Liberia listings, additional current services, confirmed events, approved media/resources, impact evidence and French translations can enrich later releases. Membership operating rules and dashboard permissions remain later work. This local content pass does not claim client publication approval or production readiness.
