# Workspace correction — 12 October 2026

Mitchell rejected the preceding banner/card treatment as generic and AI-looking. This revision removes that design rather than extending it.

## Actual reference

[Attio company records on Mobbin](https://mobbin.com/screens/83198786-3600-4684-bf04-7f20a97bc407), inspected through the Mobbin connector, is the primary reference: compact neutral sidebar, small section heading, tight toolbar, full-width records and subtle dividers. Also inspected its [filtered view](https://mobbin.com/screens/bbd875eb-f4c3-4600-bbd6-44da33761528) and [export-menu view](https://mobbin.com/screens/4e6934cc-b936-43f9-a098-f7d7868fadf6). No Attio assets or product data are copied into WisConnect.

## Changes

- Removed the welcome banner, connection artwork, slogans, promotional cards and illustrated unavailable sections.
- Compact sidebar, neutral surfaces, smaller typography, narrow dividers and restrained buttons in both theme styles.
- Overview now displays real member accounts, recent invitations and recent contact inquiries using existing local APIs. It labels accounts accurately, shows only the first five alphabetical accounts, and does not invent membership or financial figures.
- Each overview resource independently handles loading, errors and successful empty results; requests are aborted on navigation. Member-role overview never requests administrator records. Invitation success refreshes the displayed records.
- Directory search/status controls are condensed; explanatory policy copy is below the table. Phone rows remain stacked. Existing profile editing/access logic and keyboard focus return are preserved.
- Future operational areas use simple availability notices and planned column headings.

## Validation

- Production build, TypeScript and export of 16 routes passed.
- Real local API responses verified on overview (one existing administrator, no invitations or inquiries). Directory shortcut and records verified; no real account data changed.
- Desktop and 390px views inspected, with no page overflow; narrow 320px overview checked.
- Invitation dialog and invitation/inquiry navigation checked without sending messages. Existing role guards and abort handling reviewed in source.
- Temporary viewport override restored. Screenshots saved in `workspace-revision/`.

Not committed or pushed. The previous `workspace-ui.md` records the rejected design, not the current direction.
