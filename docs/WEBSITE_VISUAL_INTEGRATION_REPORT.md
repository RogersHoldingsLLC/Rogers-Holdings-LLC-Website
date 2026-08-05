# Website Visual Integration Report

Date: 2026-08-05

## Release identity

- Integration branch: `integrate/website-visual-release-2026-08-05`
- Integration worktree: `/private/tmp/rogers-website-visual-release-integration`
- `origin/main` base: `82b16903d84a898b50d155233fa5d0761c68b97c`
- Preservation source commit: `e60f874c1c04af1deee29b5ab228b55d457c9fd1`
- Preservation checksum source: `/private/tmp/rogers-website-visual-release-preservation/SHA256SUMS`

## Approved visual release integrated

- Replaced the Executive Snapshot document-stack hero with the approved photographic North Point Fitness portfolio scene.
- Added the restrained disclosure: “Fictional sample shown for demonstration. North Point Fitness is fictional.”
- Presented Eastland across laptop, monitor, tablet, and phone frames with Safari-style browser chrome.
- Retained the Eastland before-state, case narrative, conversion link, and digital-journey content from `origin/main`.
- Removed the redundant “Rogers Holdings visual standard” owner-image caption; “Executive Materials” remains.
- Limited homepage runtime proof references to the approved 37 assets: 9 North Point scene files and 28 Eastland files.

## Newer baseline behavior preserved

The following paths are byte-for-byte unchanged from `origin/main`:

- `README.md`
- `business-snapshot/`
- `privacy/`
- `assets/js/`
- `production-gateway/`
- `sitemap.xml`
- `robots.txt`
- `CNAME`
- `google048a9b51c2142520.html`

This preserves the current Business Snapshot production endpoint, intake and validation behavior, Cloudflare Turnstile configuration, consent/privacy handling, analytics, metadata, navigation, search files, and production gateway state.

## Runtime asset manifest

### North Point Snapshot scene (9)

- `assets/images/proof/north-point-snapshot-scene-desktop.avif`
- `assets/images/proof/north-point-snapshot-scene-desktop.jpg`
- `assets/images/proof/north-point-snapshot-scene-desktop.webp`
- `assets/images/proof/north-point-snapshot-scene-tablet.avif`
- `assets/images/proof/north-point-snapshot-scene-tablet.jpg`
- `assets/images/proof/north-point-snapshot-scene-tablet.webp`
- `assets/images/proof/north-point-snapshot-scene-mobile.avif`
- `assets/images/proof/north-point-snapshot-scene-mobile.jpg`
- `assets/images/proof/north-point-snapshot-scene-mobile.webp`

### Eastland responsive proof (28)

- `assets/images/proof/eastland-google-business-profile-1200.avif`
- `assets/images/proof/eastland-google-business-profile-1200.webp`
- `assets/images/proof/eastland-google-business-profile-480.avif`
- `assets/images/proof/eastland-google-business-profile-480.webp`
- `assets/images/proof/eastland-google-business-profile-768.avif`
- `assets/images/proof/eastland-google-business-profile-768.webp`
- `assets/images/proof/eastland-google-business-profile.jpg`
- `assets/images/proof/eastland-website-desktop-live-1200.avif`
- `assets/images/proof/eastland-website-desktop-live-1200.webp`
- `assets/images/proof/eastland-website-desktop-live-1440.avif`
- `assets/images/proof/eastland-website-desktop-live-1440.webp`
- `assets/images/proof/eastland-website-desktop-live-768.avif`
- `assets/images/proof/eastland-website-desktop-live-768.webp`
- `assets/images/proof/eastland-website-desktop-live.jpg`
- `assets/images/proof/eastland-website-mobile-safari-1200.avif`
- `assets/images/proof/eastland-website-mobile-safari-1200.webp`
- `assets/images/proof/eastland-website-mobile-safari-480.avif`
- `assets/images/proof/eastland-website-mobile-safari-480.webp`
- `assets/images/proof/eastland-website-mobile-safari-768.avif`
- `assets/images/proof/eastland-website-mobile-safari-768.webp`
- `assets/images/proof/eastland-website-mobile-safari.jpg`
- `assets/images/proof/eastland-website-tablet-live-1024.avif`
- `assets/images/proof/eastland-website-tablet-live-1024.webp`
- `assets/images/proof/eastland-website-tablet-live-480.avif`
- `assets/images/proof/eastland-website-tablet-live-480.webp`
- `assets/images/proof/eastland-website-tablet-live-768.avif`
- `assets/images/proof/eastland-website-tablet-live-768.webp`
- `assets/images/proof/eastland-website-tablet-live.jpg`

## Validation

- Root test suite: pass, 5/5 contract suites.
- Production gateway: pass, 26/26 tests.
- Staging gateway: not runnable because fetched `origin/main` contains no `staging-gateway/` directory; none was imported from the mixed source worktree.
- Preservation checksums: pass, 37/37.
- Asset references: pass, 50 local references resolved and exactly 37 proof assets referenced.
- Browser routes: pass for `/`, `/business-snapshot/`, and `/privacy/` at 1440×1000, 768×1024, and 390×844.
- Browser images: pass, no broken images and all images have `alt` attributes.
- Horizontal overflow: pass across all three routes and viewports.
- Navigation/hash links: pass; all homepage hash targets resolve.
- Business Snapshot: pass; production intake action, configured endpoint state, required fields, consent, privacy link, Turnstile, and submit control remain present.
- Privacy: pass; `/privacy/` renders the Privacy Policy.
- Metadata/search: pass; analytics, description, canonical URL, Open Graph image, favicon, `robots.txt`, `sitemap.xml`, `CNAME`, and Search Console verification file remain present.
- Accessibility smoke checks: pass; one `h1`, `main`, skip link, image alternatives, and no duplicate IDs across tested routes.
- Reduced motion: pass; the media query is honored and reveal content remains visible.
- JavaScript syntax: pass for `assets/js/site.js` and `production-gateway/src/worker.js`.
- HTML/CSS structural checks: pass; browser parse succeeds, tags are detected, IDs are unique, and CSS braces balance.
- `git diff --check`: pass.

## Visual evidence

- `docs/website-visual-integration-desktop.png`
- `docs/website-visual-integration-tablet.png`
- `docs/website-visual-integration-mobile.png`

Screenshots were captured with reduced-motion enabled after scroll-loading lazy imagery so all release content is visible in full-page evidence.

## Production status

Production was not touched. Nothing was pushed, merged, deployed, or written to `origin/main`.
