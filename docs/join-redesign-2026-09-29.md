# Join introduction redesign — September 29, 2026

## Scope and sources

Mitchell explicitly chose to keep the short introduction, rather than build the full questionnaire from Wisconnect Membership Inerest Form.docx. The five existing questions remain: name, email, location, business/experience and contribution. The Word document informs the interest-not-approval wording; its full business-asset questionnaire remains future work.

The existing forms research informed the separate brand/form surfaces, persistent labels, short progress indicator and editable review. The photography is reused from already documented, locally optimized assets:

- PICHA Stock, four women in conversation: purpose-community-{640,1400}.webp. Source and license recorded in purpose-design-2026-09-29.md.

Photos are illustrative, not represented as WisConnect members or endorsements. No new asset downloads, fabricated testimonials, membership counts or outcome promises.

## Design and behavior

The user rejected the initial collage styling. The revised page uses one uncropped community photograph, white space and straightforward copy. Removed the plum panel, secondary portrait, gold flourish, numbered benefits and slogans. Desktop places the photograph beside the introduction; mobile shows it on welcome and hides it during form entry. Removed the decorative rails and, at the user’s request, the visible photography caption. Source/license attribution remains here and in purpose-design-2026-09-29.md. Existing display/sans fonts, --type-form and radius tokens remain. Fields use 16px text, 52px controls and 24px mobile gutters.

Welcome is no longer counted as a completed form step. The three steps are About you, Your contribution and Review. Examples appear in the fields. Required and malformed-email errors use linked summaries, inline feedback and focus. Back preserves answers; Save and review validates changes; Cancel edit restores the prior reviewed answers. Clipboard feedback is guarded against stale completion after navigation.

Delivery remains email-draft preparation, not a server submission. The final action opens a draft to hello@wisconnect.co; copy and selectable text fallbacks remain. Nothing is sent until the visitor sends the email. Answers exist only in component memory and disappear on reload. Membership still requires review and onboarding. No account, membership or backend record is created.

## Verification

Production build passed. Browser checks covered desktop and mobile composition, required fields, malformed email, the three-step journey, five-field review and encoded mailto contents. Review editing/cancellation and responsive fitting were checked separately. The existing Join and entry-flow test selectors were updated and syntax-checked; their external-browser runners were not executed. The in-app Browser was used for this pass. No real email was sent or external email client opened.

Local changes only; no commit, push or deployment.
