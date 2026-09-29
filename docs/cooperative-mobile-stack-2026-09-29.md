# Cooperative mobile card stack

## Reference and decision

Inspected https://www.clay.com/ at 390px, especially “Get data from the most complete data marketplace”, and scrolled through successive cards. Its mobile cards use normal document scrolling, align with the page rails and overlap by 48px. WisConnect previously placed the panels 20px inside the mobile rails, with 24px gaps. The user approved adopting the connected, wider treatment.

## Implementation

Only the mobile cooperative styles in app/page.module.css change. At 760px and below, the stack keeps its existing rail-aligned shell width but removes its inner horizontal padding and grid gap. Cards use normal relative positioning. Every non-final card has 48px extra bottom padding and -48px bottom margin, with square lower corners. The next panel covers that reserved tail, leaving the image and controls clear. The last panel retains its rounded bottom corners. Existing 20px/24px inner card padding, colors, font sizes, content, navigation and People/Capital/Communities controls remain intact. Desktop sticky rules are unchanged; no scroll animation or dependency was added.

## Verification

Browser checks at 320px, 390px and 760px confirmed no horizontal overflow, loaded photos and 48px overlap. At 390px, panels align at x=12px with the shell/rails, and each image ends 20px above the following card. All preceding controls remain above the overlapping panel. People/Capital selection was exercised and restored. At 1440px, desktop retains two columns, sticky positioning and 24px stack gap. Production build including TypeScript and git diff --check passed. Changes remain local and unpublished.

## Desktop extension follow-up

After inspecting Clay on desktop, the user approved extending the panels beyond the existing rails. At 1440px, Clay's panel extends 48px beyond each frame edge. WisConnect now uses an expanded cooperative shell above 980px, with a responsive 8–48px extension and minimum 16px screen clearance. Local copy padding compensates for the extension so headings align exactly with other section headings. Card z-index 89 covers the global rails at 88 while leaving the header at 100 above the panels. No global rail or type token changed.

Verified at 1440px: card x=24.4px, left rail approximately 72.5px, heading and Purpose heading both x=120.4px. Scrolling keeps the first card at its 92px sticky top while the next card covers it. At 1024px: card x=16px, rail x=24px, both section headings x=72px, no overflow. At 390px: card x=12px, normal relative positioning, 48px overlap and no overflow remain unchanged. Production build/TypeScript and whitespace checks passed. Local and unpublished.
