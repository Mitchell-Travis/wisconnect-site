# Workspace UI review — 12 October 2026

Mitchell requested a Mobbin-informed improvement to the dashboard before continuing with business management.

## References inspected

- [Asana workspace](https://mobbin.com/screens/28c3b22f-c36a-4044-b8cd-675ec1d055da): grouped sidebar, contextual workspace header and prominent setup actions.
- [Coda home](https://mobbin.com/screens/a3ef1072-6ee5-4347-aafc-467de278ac50): resource cards above a more compact list of work.
- [Supabase team](https://mobbin.com/screens/70c3d7ee-8bed-48a2-8a37-1f40e7c6d63b): restrained search, visible invite action, readable identities and status labels.
- Also inspected [Hex](https://mobbin.com/screens/87ec1a97-32a1-4bee-b341-46277f3ad246), [Gumloop](https://mobbin.com/screens/83c49376-3176-4f86-b3a4-853536c14161), [Otter AI](https://mobbin.com/screens/4ac0dbb9-40fd-43f9-b9b3-6f5f9557814b) and [Cal.com](https://mobbin.com/screens/e752444b-4f9c-480a-821c-2bb90a605415).

Images were inspected through Mobbin's connector. No reference artwork or product screens were copied into the application.

## Changes

- A wider, consistent content area; grouped sidebar and stronger active states.
- Overview prioritizes invitations and functional member/invitation/inquiry shortcuts. Ordinary members get profile, membership-area and support shortcuts.
- Purple connection motif uses CSS and existing Feather icons; no new images or dependencies.
- Member directory uses initials, role labels, a consolidated filter surface and mobile cards. Existing search/filter/pagination and profile actions are preserved.
- Unavailable sections use a composed empty state with specific availability copy and planned record details. Categories remain selectable; no sample members, financial totals or fabricated operational data.
- Existing account profile layout remains connected. Fixed focus restoration after closing a profile and reloading the directory.

## Verification

- Production compilation, TypeScript and static export checked.
- Chrome desktop review of overview, directory, business category selection, payments/investments and invitation dialog.
- Search/no-match/clear flow verified against the real local API. Own administrator profile opened read-only; no personal data changed.
- Invite shortcut opens the existing form; Escape closes it and returns focus. No invitation sent.
- At 390px: overview, member card, profile modal, Escape/focus restoration, More navigation and settings inspected. Overview/settings/directory have no document overflow.
- Narrow 320px overview fitting checked. Light and dark surfaces inspected. Viewport override restored after verification.
- Local backend changes from the prior foundation pass are preserved; no backend behavior changed in this UI pass. Production hosting and operational modules remain separate work.

Evidence: `workspace-ui/overview-desktop.png`, `workspace-ui/overview-mobile.png`, `workspace-ui/businesses-desktop.png`.

Local review only; not committed or pushed.
