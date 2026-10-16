# Three website example cards — final unpublished review

Owner approved this exact scope for publication after reviewing the previews and palette. This record describes the approved candidate and verification.

Base RH main: fa030cf2069e7f733085398227cecea59d5d3742. Existing GitHub Pages domain and controlled publishing workflow retained.

## Final scope

Three simple logo links on Our Work, in this order:
- Howl & Timber — fictional law-firm concept -> /examples/howl-and-timber/
- Cortez Capital — fictional website concept -> /examples/cortez-capital/
- Captured by Karmen — prelaunch owned project / A Rogers Holdings Company -> https://capturedbykarmen.rogersholdingsllc.com/

Prospective public URLs (NOT LIVE from this work):
- https://rogersholdingsllc.com/our-work/
- https://rogersholdingsllc.com/examples/howl-and-timber/
- https://rogersholdingsllc.com/examples/cortez-capital/
CBK's existing destination returned HTTP 200 on RCS-01. No CBK source, social or permission changes. No registered DBA or separate entity claims.

## Recovery and design provenance

Cortez uses recovered original private source/name/design. No original artwork deleted. Howl & Timber original HTML/layout could not be recovered. The files initially identified by historical Helmgood names were inspected and contain compass/H monograms, not husky/mountain scenes; none are included in the public adaptation. The authorized minimal fallback uses a NEW layout, NEW generated husky/mountain hero, NEW typographic SVG wordmark, and generated fictional Avery Howl/Rowan Timber team portrait. The page explicitly states the original layout was not recoverable. Do not claim original HTML or husky art preserved. Original assets remain untouched.

## Privacy and fictional boundaries

No Louie/family photo/bio/contact, old Helmgood art, personal metadata, real attorney credentials, case results or testimonials included. Source, served HTML/assets and metadata scanned for Louie/Louis/Helmgood/Helmberg/Helmget and contact/GPS metadata patterns; none found in Howl output. Only generated image assets and original new text/SVG are served there. No forms, inputs, iframes, mailto, tel or external contact links; no JSON-LD Person/LegalService/Organization claim. Prominent first-screen fictional disclosure, fictional team disclosure and generated-image labels. Metadata is fictional and noindex/nofollow/noarchive; RH robots disallows /examples/.

## Verification

All eight existing npm test suites pass. build:public succeeds with 68 explicitly allowlisted files (49 baseline + 19 added). git diff --check passes. Isolated RCS-01 headless Chrome at 1440x1000, 390x844, 320x568: exactly three cards, both local concept click-throughs work, CBK target/new-tab verified plus read-only HTTP 200, all law-firm anchor links and return-to-RH work, zero missing images/page errors/overflow, zero intake controls/real contact actions, fictional labels/meta verified. Desktop/mobile screenshots inspected. Mobile full hero and both faces corrected and rechecked. No shared financial browser touched.

## Exact deployment diff

Modified tracked files:
- `assets/css/our-work.css`
- `our-work/index.html`
- `robots.txt`
- `scripts/public-artifact.mjs`
- `tests/public-artifact.test.mjs`

New public files (only these exact additions are allowlisted):
- `assets/images/our-work/captured-by-karmen-wordmark.png`
- `assets/images/our-work/cortez-capital-concept-logo.png`
- `assets/images/our-work/howl-and-timber-wordmark.svg`
- `examples/cortez-capital/assets/Hero_Header_optimized.jpg`
- `examples/cortez-capital/assets/Main_Logo.png`
- `examples/cortez-capital/assets/Profile_Logo.png`
- `examples/cortez-capital/assets/icons/apple-touch-icon.png`
- `examples/cortez-capital/assets/icons/favicon-32.png`
- `examples/cortez-capital/assets/icons/icon-192.png`
- `examples/cortez-capital/assets/icons/icon-512.png`
- `examples/cortez-capital/index.html`
- `examples/cortez-capital/script.js`
- `examples/cortez-capital/site.webmanifest`
- `examples/cortez-capital/styles.css`
- `examples/howl-and-timber/assets/fictional-team.png`
- `examples/howl-and-timber/assets/husky-mountains.jpg`
- `examples/howl-and-timber/assets/wordmark.svg`
- `examples/howl-and-timber/index.html`
- `examples/howl-and-timber/styles.css`

Review documentation: this file only, excluded from public artifact. No homepage/offer content, Eastland/Missy prose or assets, existing CBK site, CNAME/DNS, analytics, intake/backend, dependency or deployment workflow changed.

Existing deployment runs only after main push or explicit workflow dispatch: npm test -> build:public -> upload _site -> GitHub Pages. Owner publication approval received. Publish only this scope through the existing workflow. No paid domain or additional hosting required.
