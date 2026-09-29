# Contact redesign — September 29, 2026

First implementation from the forms research. Scope is Contact only; Join, Login and invitation activation remain subsequent work.

## Design

- One page replaces three data-entry steps and a compulsory review screen. Name, email and message are required. Topic defaults to General inquiry; visitors can choose Membership, Partnerships or Member enterprises. Removed business/organization and country questions.
- Desktop: concise introduction and existing community photography beside a white form. The pale purple/sand/gold surround uses WisConnect's palette. Mobile: one column, compact introduction, no photograph or duplicate visible form heading, no decorative rails or nested card padding.
- Preserves `--type-form`, display/sans fonts and control/card/panel radius tokens. Labels stay outside the controls, inputs use 16px text, and buttons are at least 48px high.
- Reuses `purpose-connection-{640,1400}.webp`, PICHA Stock's photograph of three women collaborating. Credit and illustrative status are visible on desktop. Original source/license recorded in `purpose-design-2026-09-29.md`.

## Behavior

The user requested a real Submit action after the first design pass. Submit posts to the local API, persists the inquiry, then attempts an email notification addressed to hello@wisconnect.co. The administrator dashboard now has Contact inquiries, expandable message details, pagination, delivery status and retry. Members cannot read inquiries. No registration or membership is created.

A UUID is retained for an unchanged retry, avoiding duplicate records after a lost response. Concurrent delivery attempts serialize on the saved row. Email failure does not remove the message: the administrator can retry. SMTP acceptance is not confirmation of inbox delivery; an acceptance followed by a server/database failure can still cause a duplicate notification on retry.

Validation handles whitespace-only required fields and malformed email. Errors are linked, announced and summarized with focus. Answers remain during validation/network failures. Success shows a reference and moves focus to the confirmation. Reloading before submission loses the unsent answers. Buttons remain disabled until hydration; without JavaScript a direct email link is available.

The configured mode is local Mailpit capture only. The success screen makes that test status explicit. Real SMTP credentials and an authorized From address remain unconfigured; the public MX records point to Google but do not prove sending permissions. README and .env.example describe server-only configuration. The launcher does not automatically load .env. Hosted GitHub Pages submission remains disabled until an appropriately hosted backend is available.

## Research applied

- [Stripe Contact](https://stripe.com/contact/sales): separate a calm form surface from brand expression. WisConnect's general inquiry does not need Stripe's sales-routing structure.
- [NNGroup labels](https://www.nngroup.com/articles/form-design-placeholders/): retain labels and useful instructions outside fields.
- [W3C feedback](https://www.w3.org/WAI/tutorials/forms/notifications/): provide specific errors, a linked summary and appropriate focus/status feedback.
- [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/): justify each question and mark optional information. A single page is a context-specific decision for this short inquiry, not a universal rule against staged forms.

## Verification

The production build passed with TypeScript and static generation. The new `npm run contact:check` passed using a disposable database schema: additive migrations, validation/origin/body limits, admin-only inbox, concurrent duplicate protection, persistence through SMTP failure, admin retry, pagination, local mail capture and mocked TLS transport configuration. The existing `npm run auth:check` also passed.

In-app Browser verification exercised a real local form submission through to the saved receipt and Mailpit notification. The unique synthetic inquiry and its email were then removed, leaving other data untouched. An initial API route failure preserved answers; restarting the stale API allowed the same submission to succeed. Inspected desktop and 390px mobile views; 320px checks confirmed no page overflow and controls fitting at least 44px high. Empty-form validation focused the linked error summary. The first design pass had additionally checked tablet/wide desktop layout and malformed email behavior.

The administrator inbox endpoints were tested in the isolated integration suite, but its dashboard UI has not been independently browser-tested. Real external email delivery and screen-reader announcements were not tested. The standalone `scripts/check-contact.mjs` now checks responsive fitting and simplified form validation; syntax was checked but its CDP runner was not executed. Browser verification used the in-app Browser.

Local changes only; no commit, push or deployment.
