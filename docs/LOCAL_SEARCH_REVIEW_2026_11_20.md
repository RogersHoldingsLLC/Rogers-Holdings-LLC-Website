# Local web-design search clarity

Prepared for review on 2026-11-20, based on main commit `2646e89097b74f54f85f3150109cd5174008e31b`. This is a staged copy and metadata change, not a publication or an indexing/ranking result.

## Scope

- Improve the existing `/website-creation/` title, main heading and description for small-business web design in Mount Sterling, Kentucky, while explicitly retaining remote service across the U.S.
- Keep Open Graph, Twitter and existing WebPage/Service metadata consistent with visible copy. No new schema types, location pages, address claims, reviews or ratings.
- Cite the real Eastland First Church of God project and its existing project story separately from the unchanged Form / Field fictional demonstration. Claims are limited to the documented website, service times, visitor information and directions.
- Use descriptive web-design link text on the homepage and Services page. Add local/nationwide context to the existing Services description and introduction.
- Preserve the homepage hero, layout, styles, assets, two starter options, written-scope/quote terms, demo behavior, contact paths, analytics and privacy/security protections.

## Verification

- `npm test`: all 11 test groups passed, including the existing analytics/privacy/public-artifact contracts and added local-copy regressions.
- `npm run build:public`: 224 allowlisted public files; this document and tests remain excluded.
- `git diff --check`: passed.
- Cloud Chromium rendered the actual built Website Creation and Services pages at 320, 390 and 1100 CSS-pixel iframe widths. Text was legible without horizontal overflow. This was responsive desktop-browser testing, not a physical-device test.
- The longer Website Creation heading and Eastland paragraph were inspected at narrow and desktop widths. The homepage descriptive link and Services descriptive link reached the existing Website Creation page; the Eastland story link reached its existing local project page. No forms were submitted.
- Existing Spreadsheet Repair metadata, canonical URLs, sitemap and honest Work/demo labels were reviewed; no broader change was needed for this bounded pass.

## Release boundary

The checked deployment workflow runs on `main` pushes or explicit manual dispatch. Pull requests to `main` run read-only validation, tests and the allowlisted build. A non-main draft PR does not itself publish this change. Review and a separately authorized merge are still required.

These changes help visitors and crawlers understand the business; they do not guarantee a Google position or indexing schedule. Search Console verification, recrawling and external business-profile work are separate.

Guidance: [Google Search Essentials](https://developers.google.com/search/docs/essentials) and [title-link guidance](https://developers.google.com/search/docs/appearance/title-link).

## Separate visual follow-up

The local copy and metadata above went live in PR #97. The follow-up visual candidate starts from that exact release (`0258c8a939a8e5a76c47a86b474af0439c714bf9`) and is staged separately. It breaks the existing single heading into balanced service and location lines, improves intro spacing and sets Eastland apart as a clearly labeled real client project before the starter options. It reuses the currently public 520 px Eastland screenshot with lazy loading and intrinsic dimensions. Form / Field, pricing scope, shared CSS, navigation, metadata, canonical, schema and existing scripts are unchanged.

Cloud Chromium comparison at 320, 390, 768 and 1100 CSS-pixel iframe widths showed legible line breaks and no horizontal overflow. The Eastland thumbnail loaded at its intended intrinsic size, the project link reached the existing case story, and the example link focused the Form / Field heading. No forms or external links were opened. All 11 test groups passed and the public build still has 224 files.
