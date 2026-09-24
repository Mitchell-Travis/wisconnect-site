# WisConnect browser and design review

**Subsequent clarification and implementation:** Mitchell confirmed that the content is intentionally placeholder. Content-removal/rewrite recommendations below are deferred; the approved design-only changes and verification are in [the before/after gallery](improvements/index.html). This report records the earlier state.

Reviewed September 24, 2026. [Open the screenshot comparison gallery](index.html).

**My assessment: WisConnect has a distinctive, credible visual starting point, but the whole experience still feels assembled from several references. The main weakness is the gap between polished presentation and specific, usable information.** The purple/gold identity, hero portrait, real leadership profiles, and restrained outer rails are worth keeping. More decoration would not solve the current problems.

“AI slop” here describes an impression, not a claim about how every asset or sentence was made. The strongest signals are interchangeable aspirational copy, repeated sections, stock imagery presented under member-oriented headings, and impressive-looking metrics that are only placeholders.

## Scope and evidence

- Reviewed the current local working tree at `http://localhost:3000`, preserving all existing modifications.
- Also visited the [published WisConnect site](https://mitchell-travis.github.io/wisconnect-site/) and its [member login](https://mitchell-travis.github.io/wisconnect-site/login/). The published homepage still contains the illustrative statistics and editorial previews. Published login explicitly says online member access is unavailable.
- Compared with the current [Stripe homepage](https://stripe.com/) and [Stripe sales contact page](https://stripe.com/contact/sales). Stripe observations concern its visible presentation; its business claims were not independently verified.
- Desktop comparison screenshots use 1440 × 1000 CSS pixels. Mobile comparison screenshots use 390 × 844. Additional WisConnect layout checks covered 320 and 820 pixels; the entry-flow suite covered 320, 390, 768 and 1440.
- Used actual Playwright clicks, keyboard dismissal, scrolling, field entry, review/edit flows and responsive viewports. Account/dashboard checks used isolated mocked API responses, explicitly labeled in screenshot filenames. The local backend/database were not started or audited, and no real messages or account changes were made.
- This is a visual/product review with targeted interaction checks, not a production performance, security, WCAG-conformance or cross-browser certification. No application source was changed.

## What is already working

The hero has more character than a generic SaaS landing page: recognizable purple/gold, an editorial serif, a strong portrait, a clear cooperative description, and a visible membership action. The mobile hero keeps its message and action readable. In the widths checked, the homepage had no horizontal page overflow or failed loaded images.

The outer frame is coherent: WisConnect's desktop rails sit at x=80 and x=1360 in a 1440-pixel viewport. Thin section rules meet that frame. Keeping the rails is reasonable; they are not the cause of the generic impression.

Several interactions are thoughtfully implemented. The member carousel advances, the map updates its regional explanation, stories open in a reader, and leadership profiles close with Escape and return focus to their trigger. Contact validates fields and preserves the message when returning to edit. The dashboard's compact table and search are appropriate for an administration tool.

## Priority findings

### 1. Remove the credibility mismatch before adding polish

The section is called **“Impact & proof”**, then displays 250+ members, 60+ businesses, 12 projects/programs and 30+ outcomes. An 11-pixel note says these are illustrative, unverified figures. The disclaimer is honest, but the visual hierarchy gives the numbers much more authority than the qualification. This is also present on the published site.

The map is similarly labeled as a vision rather than verified operations. The interaction works, but it does not provide operational proof. Stripe uses a similar statistics/map composition to present its published business metrics with defined labels, including a period for payment volume. WisConnect has copied the visual authority before having equivalent evidence.

**Recommendation:** remove unverified figures from public presentation until approved data exists. If the map remains, put it under an explicit future-vision heading. Use factual information already available—named leaders and their documented experience—without manufacturing substitute numbers. Evidence: `app/page.tsx:628`, screenshots `wisconnect-impact-desktop.png` and `stripe-impact-desktop.png`.

### 2. The public typography does not follow one hierarchy

Measured at 1440 pixels:

| Element | WisConnect computed type | Consequence |
| --- | --- | --- |
| Hero | Georgia, 66px, line-height 67.32px, tracking −3.63px | Distinctive but tightly packed; the negative spacing is aggressive for this serif. |
| Leadership | Georgia, 64px | Consistent with the editorial hero. |
| Cooperative belief | Arial, 48px | A separate visual voice begins. |
| Enterprises | Georgia, 51.84px | Returns to the original voice. |
| What WisConnect does | Georgia, 78px | A secondary heading is larger than the hero. |
| Impact | Arial, 56px, navy `#061b31` | Feels imported from Stripe. |
| Stories | System sans, 44px | Another section-heading treatment. |
| Participation | Georgia, 78px | Oversized relative to its supporting role. |

Stripe uses Söhne consistently in the sampled headings, with most section headings at 32px, the hero at 48px, and the impact heading at 56px. Variation has an obvious role instead of changing the typographic language section by section.

**Recommendation:** keep WisConnect's editorial identity. Use one serif for public display headings and one sans for body/UI, assign repeatable heading levels, and reduce the oversized supporting headings. Start by easing the serif tracking toward −0.02em and visually check the result. The dashboard can remain a denser sans-serif interface. Evidence: `app/page.module.css:64`, `:173`, `:397`, `:465`; `app/globals.css:33`.

### 3. The rails need a more consistent relationship to content

Stripe's sampled section container starts at x=87, is 1266px wide, and uses a 16px inner inset plus its border, putting headings and cards at x=104. Its hero deliberately moves to x=208, a recognizable column offset.

WisConnect has a 1280px outer frame, but content begins at roughly x=130.4 in the hero, x=136 in ordinary sections, x=104 in the impact heading container, and x=184 inside the belief card. The nested card inset is understandable; the mixed general-purpose insets are less systematic. The impact metric rules span the frame, while nearby content uses another inset.

**Recommendation:** keep the existing outer rails and choose one standard public content gutter; use a second inset only for clearly nested cards or deliberate grid offsets. Do not make every element touch a rail. The goal is a readable alignment system, not copying Stripe's exact width. Evidence: `app/globals.css:1167`, `:1263`; `app/page.module.css:59`.

### 4. The colors are good; their roles drift

WisConnect's plum `#291833`, purple `#563578`, gold `#B9955A`, mist `#F7F3F8` and sand `#FAF8F5` form a usable identity. The hero shows this well. The impact section switches to Stripe-like navy `#061b31` and blue-gray text; the form routes use large pastel purple/gold surfaces with much rounder corners than the homepage's principal controls.

Stripe also uses expressive gradients. What makes its sampled pages feel more coherent is the repetition of its type, ink, link color and small corner radius across the homepage, product dialog and contact form. Gradients themselves are not the problem.

**Recommendation:** give each WisConnect color a role: plum for primary text, purple for interaction, gold for limited emphasis, mist/sand for section surfaces. Bring impact back into those roles. Keep the calmer center of the current form background; reduce competing surface treatments before adding any new palette or effects.

### 5. The site repeats a promise instead of progressively explaining it

The hero, People/Capital/Communities cards, “What WisConnect does,” and Participation all restate ownership, opportunity, growth and community. The page is about 10,862px tall at 1440 × 1000 and 11,678px tall at 390 × 844 in this review. Length is not inherently bad; repetition without new information makes it feel long.

One particularly clear draft artifact is **“Different audiences need clear paths into the WisConnect ecosystem.”** That describes a designer's assignment rather than speaking to a prospective member. Other sections do not answer the practical questions their headings raise: what support is available today, who qualifies, what participation costs or requires, and what happens after applying. These facts need confirmation from WisConnect; they should not be invented.

**Recommendation:** replace the designer-facing sentence immediately in the next content pass. Consolidate overlapping mission sections and explain the actual membership journey and available support. Stripe's product sections give concrete examples of the services being offered; WisConnect needs its own equivalent level of specificity. Evidence: `app/page.tsx:687`, `wisconnect-support-desktop.png`.

### 6. “Member enterprises” and “Stories from the network” overstate specificity

Enterprise cards represent six sectors rather than named businesses. Every card leads to the same `/join/` route. A visitor expecting to discover a business gets the general membership introduction, without retaining the sector they clicked.

The story reader works, but the opened story is a conceptual essay with stock photography and an explicit editorial-preview note. Stripe's customer section names businesses and offers case-specific stories. A single approved, specific member story would contribute more credibility than four interchangeable essays.

**Recommendation:** until real businesses are supplied, call the section “Sectors we connect” or similar, with an accurate shared CTA. Publish member stories only when there is a named subject, permission, a concrete event or problem, and a factual account of what happened. Generic editorial content can remain under an honest “Our perspective” label. Evidence: `app/page.tsx:32`, screenshots for enterprises, stories and Stripe customers.

### 7. Animation asks for too much attention before revealing useful content

The leadership scene occupies 200svh: 2000px at the desktop viewport used here. At an intermediate scroll position, portraits are visible while the headline and actions are still nearly transparent. The full reveal is attractive, and pause/profile interactions work, but names are mostly revealed on interaction and the user spends substantial scroll distance reaching a small amount of content.

**Recommendation:** make the heading and identities available earlier and shorten the scroll sequence, especially on mobile. Preserve the portraits and profile sheets; reduce the amount of motion needed to reach them. The gallery includes both the intermediate and revealed states so a transitional frame is not mistaken for a permanent rendering defect.

### 8. The conversion flow is polished but still incomplete as a service

Contact has three input steps plus a review state, ending in an email-app link. Join has four steps and the same email handoff. Both disclose this, and neither claims an email was sent. Still, preparing a draft is not receipt by WisConnect, and Join explicitly does not save answers for later. A visitor without a configured email app has to use the copy fallback.

Stripe's contact page also starts with a staged email/country form, so copying the number of steps is not automatically an improvement. WisConnect's simpler inquiry may be served by a shorter form. Stripe's submission/delivery was not exercised.

**Recommendation:** prioritize a reliable inquiry/application receipt workflow before polishing further. If email drafts remain for now, make the handoff unmistakable and keep the direct email option prominent. Public member login is deliberately unavailable; this is an unfinished deployment capability, not a broken password field.

### 9. Navigation advertises breadth that the product does not yet have

The desktop mega-menus repeatedly route to the same few homepage sections. Stripe's comparable menu leads to a much broader product surface. WisConnect's mobile menu works, but is more elaborate than its current information architecture requires.

The language menu offers French as “Coming soon.” The footer's “Privacy · Terms” is plain text, not working links. “Stories & Events” reaches stories without an event listing. The footer advertises Marketplace, Member Portal and Mobile App as next-phase text. These are visible completeness gaps, even where honestly labeled.

**Recommendation:** simplify the public navigation to current destinations; publish the appropriate actual policy pages; make language availability unambiguous. In the dashboard, prioritize connected member/account tasks and clearly separate the current UI previews from usable functions.

## Dashboard assessment

The dashboard is a useful interface foundation: compact navigation, a bordered member table, search with an empty state, invitation dialog, responsive mobile shell and account controls. Its calmer visual density is appropriate and does not need to copy the marketing page's display typography.

The home screen mostly repeats account details and links back to the public site. Projects displays “UI preview” and says records/actions are not connected. Other planned sections are also described as previews in `app/dashboard/sections.ts`. The dashboard therefore needs completed workflows more than additional menu entries. Browser screenshots with `-mocked` in their name contain synthetic review accounts, not evidence of a working production backend.

## Interaction and check results

| Check | Result and limit |
| --- | --- |
| Desktop navigation | Menu opens; Escape dismissal exercised. |
| Mobile navigation | Opened Businesses, followed Food & Beverages, menu closed and reached `#enterprise-0`. |
| Enterprise carousel | Next advanced the strip from scrollLeft 0 to 321; Previous returned it. |
| Leadership | Pause changed to Resume; a profile opened; Escape closed it and restored trigger focus. |
| Cooperative selector | Capital changed the detail text correctly. |
| Impact map | Brazil changed the regional explanation. |
| Story reader | Selected the third story, opened it, read its preview disclosure and dismissed it. |
| Contact | Empty submission blocked; all three steps completed with synthetic data; review and edit retained the message; final link was `mailto:`. No email sent. |
| Join | Completed four steps on mobile with synthetic data; review and email handoff rendered. |
| Responsive homepage | No page-level horizontal overflow at 320, 390, 820 or 1440px; no broken loaded images in the explicit 320/820/1440 checks. |
| Dashboard spot check | With isolated GET-response mocks: home, member rows, search/no results, clear search, invite open/Escape and Projects preview worked; 390px layout fit; no page exceptions recorded in that check. |
| `scripts/check-entry-flows.js` | PASS in this Playwright session: responsive signup, token cleanup, activation states, password validation, invitation/service errors, sign-in states and all Join steps. Account responses mocked. |
| `scripts/check-member-deletion.js` | PASS: cancellation/focus, protected admin UI, pending/error/retry/success, mobile and dark-mode states. Deletion requests intercepted; no real accounts changed. |
| `scripts/check-dashboard-states.js` | FAILED at its header assertion. Line 57 expects Member/Role/Account status; the current table also contains Actions (`app/dashboard/members-directory.tsx:59`). This is a stale expectation after the deletion feature. The rest of that suite did not run to completion. |
| Stripe reference | Explored desktop/mobile homepage, product dialog, navigation and initial sales form. No sales inquiry or signup submitted. |

## Recommended next pass

1. Correct the public credibility gaps: remove unverified metrics; accurately name sector/editorial content; replace the internal planning sentence and incomplete footer items.
2. Agree on real membership facts and complete a dependable inquiry/application receipt workflow.
3. Unify the existing typography, content gutters, color roles and corner radii. Keep the hero identity and rails.
4. Shorten repetitive sections and the leadership reveal. Replace generic illustration with approved, specific member evidence as it becomes available.
5. Update the stale dashboard assertion and finish the next real dashboard workflow before expanding the UI surface.

These are recommended changes, not changes made during this review. The existing 2,546-line global stylesheet and 587-line homepage module contain several successive design passes; consolidate touched rules as the visual system is corrected rather than appending another override layer. A wholesale rewrite or new design-system dependency is unnecessary for this pass.
