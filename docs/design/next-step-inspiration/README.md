# Your next step — Mobbin inspiration board

Research requested by Mitchell on 12 October 2026. The scope is a visual reference page for the homepage closing section and email newsletter signup. Wait for Mitchell to choose a direction before implementing the homepage design.

## Open

Open `index.html` directly, or serve this folder:

```sh
python3 -m http.server 3100 --bind 127.0.0.1 --directory docs/design/next-step-inspiration
```

Local preview: http://localhost:3100/

## References

| Option | Reference | Role |
| --- | --- | --- |
| A | [Zipline](https://mobbin.com/sites/sections/7696ea22-ae92-4fa4-9a54-59aa007f478a) | People, photography and oversized type |
| B | [Cohere](https://mobbin.com/sites/sections/368bbb9d-dd0f-4d48-b4ff-07de548fd9fa) | Sculptural forms and purple background |
| C | [Squarespace](https://mobbin.com/sites/sections/fd1adc1e-242e-4c90-80af-9d2776d0be0d) | Dark background and prismatic light |
| D | [Ramp](https://mobbin.com/sites/sections/5c4f9ab7-540d-480e-ae19-39bc74210a8c) | Editorial collage and integrated signup |
| E | [Seed](https://mobbin.com/sites/sections/c5cdefa3-ea1d-44b4-baac-dc211960a770) | Organic texture, large lettering and motion |
| F | [GitBook](https://mobbin.com/sites/sections/835b95cf-00d3-4e20-b8ec-fe9cb43a9b70) | Distinct newsletter form panel |

Mobbin's connector timed out. After Mitchell signed in, the references were reviewed through his signed-in Chrome session. Assets were downloaded from each reference's main image/video using the browser's media-download API. Original image resolution and embedded Mobbin credits are retained. These are research materials, not licensed WisConnect production assets. No Mobbin collections or external content were modified.

The board presents five visual directions and one supporting signup composition. Recommended combination: A's photographic statement with F's clear signup panel. B is the strongest abstract alternative. All adaptation notes are proposals, not observations about the source designs.

The page has full-image dialogs, an embedded video, direct source links and browser-local shortlist controls. It has no subscription endpoint and collects no email addresses. The email-list provider, subscription copy, consent wording and integration remain to be confirmed during implementation.

Static checks passed for six cards, six source links, local media, anchors and JavaScript syntax. The browser connection became unavailable while opening the completed board, so final rendered-page and interaction checks could not be completed this pass. A Codex browser panel opening was queued.

No homepage implementation, commit, push or deployment was performed for this research task. Earlier sector-link changes remain uncommitted.

## Selected direction

Mitchell selected **A + F** on 12 October 2026. The homepage implementation combines large community photography with a cream signup panel. See `../newsletter-service.md` and `../../reviews/2026-10-12/next-step.md` for implementation and verification.
