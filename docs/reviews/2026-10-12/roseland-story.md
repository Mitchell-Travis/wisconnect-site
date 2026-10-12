# Roseland update and dedicated story pages — 12 October 2026

Mitchell requested bringing the Roseland update and image from the [original WisConnect website](https://wisconnect.co/) into the new cooperative story section. Roseland is now the lead story, followed by the existing Wisdom Connection Initiative and Liberia entries. All “Read the story” actions navigate to dedicated pages; the temporary story dialogs have been removed.

## Content and image source

The supplied text matches the original site's “UPDATES Latest News Events, & Insights” section. Its wording has received light punctuation cleanup. The story retains the prospective-developer RFQ selection, proposed 60,000 sq ft development, Elizabeth L. Carter's residence in the area, and resident Black women-led redevelopment theme. It does not claim construction or completion, and no publication date was invented. The article links back to the original update.

The original page's `CONTENT_IMAGE1_RENDERED` image uses this [Greater Roseland photograph](https://img1.wsimg.com/isteam/ip/09271ae7-68f5-4cdc-ad61-2feeb8efb2e5/Greater%20Roseland.jpg/:/cr=t:0%25,l:5.2%25,w:89.61%25,h:100%25/rs=w:1240,h:620,cg:true). It is a 1240 × 620px rendition. Downloaded on 12 October for the explicitly requested migration; optimized local WebPs are `roseland-theatre-640.webp` and `roseland-theatre-1240.webp` (about 70/208 KiB). Original embedded XMP, including creator/rights information, is retained. Visible credit identifies Patrick L. Pyszka / © City of Chicago; this is not presented as stock or generated imagery. The other stories retain their illustrative-image labels and provenance.

## Implementation

- `cooperative-stories.ts` supplies homepage cards and article content from one dataset.
- `/stories/roseland-theatre/`, `/stories/wisdom-connection-initiative/`, and `/stories/enterprise-rooted-in-place/` are statically exported from `app/stories/[slug]/page.tsx` using `generateStaticParams` and asynchronous route params.
- Every article has its own title/description metadata, full image, project context, reading copy, Contact action and return links. Existing entry header, brand typography and white background are reused.
- Homepage keeps the desktop accordion and mobile stack. The introduction now describes cooperative stories, updates and development visions.

## Verification

Production build, TypeScript and static export passed. Playwright verified all three homepage links, expected article content/title, direct reload, return to `#community-projects`, and the Roseland text/image. At 390/320px, all three story actions are available and both homepage and article fit without horizontal overflow. No browser runtime errors. White article footer checked after overriding a global footer background.

Screenshots: [Section](roseland-story/section-desktop.png), [Desktop article](roseland-story/article-desktop.png), [Phone article](roseland-story/article-mobile.png). Section capture hides the fixed navigation overlay for review only.

Local only. No push or deployment. Other active homepage changes remain.
