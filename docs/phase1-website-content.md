# Phase 1 website content alignment — September 24, 2026

Source: the public website inventory and Elizabeth Carter comment summaries in `WISCONNECT_CONTEXT.md`, with the story order from `DESIGN_NOTES.md`. This pass uses that recorded inventory; it does not independently re-read or approve the original presentation comments. Current client approval gaps remain visible. No publication or production service changes are included.

## Step 1 — existing content

Before: Hero → Visionaries → Belief/cooperative stack → Enterprise sectors → What we do → Impact/map → Stories → Participation.

After: Hero → Belief/cooperative stack → Visionaries → Enterprise sectors → What we do → Impact/map → Stories → Participation.

- Replaced overlapping Our story / The cooperative / Our people / Businesses menus with About / Our people / Our work / Updates.
- Removed repeated dropdown destinations and duplicate featured/footer links within each dropdown. Retained the existing dropdown layout, images, hover dismissal, keyboard controls and mobile submenu behavior.
- Corrected “Stories & Events,” which previously led only to stories. Distinguished visionary profiles and business sector examples from complete directories.
- Removed future-phase promotional footer items and the unlinked “Privacy · Terms” label; step 2 provides a real privacy-information destination.
- Preserved existing local work, artwork, interactions and content. TypeScript passed at the step 1 checkpoint.

## Step 2 — completed website structure

Hero → Purpose/mission/vision/values → Belief/cooperative model → Visionaries → Member directory → Business sectors → Business directory → Services → Proposed programs → Resources/videos → Community work → Impact → Diaspora/map → Stories → News → Events → Gallery → FAQs → Participation → Contact information → Privacy information.

Impact and diaspora remain in the existing shared map section, with separate anchor destinations. FAQs include language availability. Header menus contain 16 distinct destinations; remaining supporting destinations are accessible through the footer and relevant content links.

| Inventory area | Representation | Content or decision still needed |
| --- | --- | --- |
| Identity, purpose, mission, vision, values | `#purpose`, existing hero and cooperative stack; draft text clearly marked | Official legal/public name, organizational history, approved mission/vision/values and cooperative claims |
| Focus on Black women business owners | Purpose section and expandable explanation | Approved rationale in members’ own words |
| Cooperative model and membership offer | Existing People/Capital/Communities stack, services, participation, Join | Confirm benefits, eligibility, fees and membership rules |
| Leadership/about | Existing four portraits and full profile sheets preserved | Confirm final biographies and publication permissions; no newly received portraits published |
| Member directory | `#member-directory` reuses existing profiles, bios and expertise, with profile buttons | Complete register, approved locations, preferred contact links and consent |
| Business directory | `#business-directory`, honest empty state with intended listing information | Approved business/owner names, sectors, descriptions, images/logos and contact links |
| Services/programs | Existing service direction marked for review; `#programs` distinguishes proposals | Named services, availability, eligibility, owners and approved descriptions |
| Webinars/tutorials/coffee meetings | Three cards explicitly marked Proposed | Whether to proceed, topics, hosts/presenters, frequency, format and dates |
| Resources and videos | `#resources`, separate materials/video empty states | Approved resources, download/video links, credits, captions and transcripts |
| Community contributions | `#community-work`, contribution route to Join | Member initiatives, motivations, talents/assets, contributors, outcomes and permissions |
| Impact evidence | Existing interactive band/map; sample numbers replaced with dashes | Verified figures, sources, reporting periods and permission to publish outcomes |
| Diaspora connection | `#global-reach`, draft rationale and existing interactive map | Approved geographic/partnership claims and lived-experience stories; map is a vision, not operational coverage |
| Stories | Existing editorial gallery/dialogs preserved and marked as stock/editorial previews; intro incorporates contributions and motivations | Approved member/community accounts, quotes, outcomes and media |
| News/announcements | `#news` empty state | Approved dated updates and owner/approver for ongoing publication |
| Events calendar | `#events` empty schedule with contact inquiry route | Confirmed dates/time zones, descriptions, venue/online links, hosts and RSVP destinations |
| Photo gallery | `#gallery`, clearly labelled image placeholders | Member/event/program/community images, captions, credits and consent |
| FAQs | `#faq`, native keyboard-accessible disclosures | Confirm membership decisions and replace provisional answers as agreed |
| Membership form | Existing location/experience/contribution flow preserved; privacy link added | Inquiry versus formal application, conditional/location-specific questions, reviewers, review timeline, saved submissions and acknowledgement |
| Contact | Existing email-draft form, `#contact-info`, direct email and privacy link | Confirm inbox, response owner, acknowledgement, social URLs, office/service-area details |
| English/French | Existing picker honestly marks French unavailable; `#languages` explains status | Translator/reviewer, approved French copy, launch timing; full translation is not delivered by this structure pass |
| Privacy | `#privacy` explains current form handling and explicitly identifies the missing approved policy; both forms link here | Approved policy, responsible organization/contact, received-message use/access/retention and rights process |

## Elizabeth’s comments

- Purpose and motivation are represented in the purpose section and story planning.
- The diaspora connection is explained beside the map as a draft perspective, without asserting verified operations.
- Member stories explicitly include talents, assets, contributions and impact; the community-work section invites those accounts without fabricating projects.
- Recurring activities remain proposals. No registration is advertised for an unconfirmed event.
- Staff role definitions remain dashboard decisions outside this website task. Social-media management/newsletter pricing remains a separate scope discussion; no paid maintenance service or newsletter subscription is implied.

## Verification

Passed: GitHub Pages production build (`GITHUB_ACTIONS=true npm run build`), `npm run typecheck`, `git diff --check`, and Chromium browser checks for navigation dismissal, visionary profiles/story dialogs, the impact map, Contact and Join. These include mobile layouts, keyboard/focus, reduced motion, and email-draft preparation without sending. A focused browser check also verified enterprise Next/End/Home controls.

The full legacy `scripts/check-home.mjs` run stopped at its historical mobile animation duration assertion (expected 0.55 seconds; the preserved September 24 design uses 0.3 seconds, confirmed against the pre-task source copy). That suite is not reported as passing. Its expectation needs reconciliation with the prior approved design pass; application styling was preserved.

New content/navigation regression: `scripts/check-phase1-content.js` (Playwright MCP; defaults to the local Pages preview). Existing homepage check expectations were updated only for the intentional navigation labels/link counts and replacement of sample statistics.
