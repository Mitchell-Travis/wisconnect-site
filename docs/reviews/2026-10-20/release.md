# 20 October 2026 release

## Published

- Commit: `b5b71d0` — “Release dashboard, backend, and public site updates” on `main`.
- GitHub Pages workflow: [39471161948](https://github.com/Mitchell-Travis/wisconnect-site/actions/runs/39471161948) — frontend checks, backend checks, static export and deployment all succeeded.
- Live site: [WisConnect](https://mitchell-travis.github.io/wisconnect-site/). After deployment, the served homepage included “Land · Capital · Communities,” Momentum Coffee and BDavis Designs.

## Verification

- `GITHUB_ACTIONS=true npm run build`
- `GITHUB_ACTIONS=false NEXT_PUBLIC_LAN_ORIGIN=http://192.168.100.16:3001 npm run build`
- `npm run typecheck`
- `npm run backend:check` — all 13 backend suites, using the local PostgreSQL and Mailpit services.
- `npm audit --audit-level=moderate` — zero vulnerabilities.
- `git diff --check`

The Momentum Coffee and BDavis Designs detail galleries use the photos and delivery approach documented in [business-directory-galleries.md](business-directory-galleries.md). BDavis images total about 323 KiB as responsive local WebP variants. Momentum's official image CDN provides responsive 640px/960px images and automatic format selection; all photos load lazily inside their business detail panels.
