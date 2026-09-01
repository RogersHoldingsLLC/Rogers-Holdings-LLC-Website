# Production Publishing Boundary

Prepared: 2026-08-20

Current manifest verified: 2026-08-31

## Architecture

Production is assembled into ignored directory `_site/` by `scripts/build-public-site.mjs`. The builder copies individual regular files from a fixed allowlist; it never copies a directory wholesale and never moves or deletes source files.

Before copying, the builder validates every allowlisted source, parses the public pages and JSON-LD for same-origin dependencies, parses CSS `url()` dependencies, and checks sitemap routes. It rejects missing dependencies, dependencies outside the allowlist, path traversal, symbolic links, hard-linked files, and non-regular entries. Existing `_site/` content must already be a safe subset of the allowlist; unexpected entries fail the build instead of being silently published. The completed artifact is compared byte-for-byte with source and must contain exactly the manifest below.

This default-deny model keeps the source repository and its documentation intact while making the uploaded Pages artifact the only deployment payload.

## Security Boundary

The production artifact controls only what GitHub Pages publishes at `https://rogersholdingsllc.com/`. It does not make excluded repository content private.

The repository is currently public. Tracked documentation, gateway source, tests, utilities, and other source material remain publicly readable through GitHub even when the artifact excludes them from `_site/`. Secrets, credentials, private client information, and genuinely confidential internal material must never be stored in this repository.

Moving internal utilities and operational documentation into a private repository is a separate recommended follow-up. Do not change this repository's visibility without first confirming that the applicable GitHub plan supports the existing public GitHub Pages deployment and custom-domain requirements.

## Exact public manifest

The artifact contains exactly 42 files:

```text
CNAME
apple-touch-icon.png
assets/css/digital-business-card.css
assets/css/site.css
assets/images/brand/rogers-holdings-logo-reversed.png
assets/images/brand/rogers-holdings-logo.png
assets/images/digital-business-card/brian-keith-rogers.jpg
assets/images/homepage/eastland-product-family-desktop.avif
assets/images/homepage/eastland-product-family-desktop.jpg
assets/images/homepage/eastland-product-family-desktop.webp
assets/images/homepage/eastland-product-family-mobile.avif
assets/images/homepage/eastland-product-family-mobile.jpg
assets/images/homepage/eastland-product-family-mobile.webp
assets/images/homepage/eastland-product-family-tablet.avif
assets/images/homepage/eastland-product-family-tablet.jpg
assets/images/homepage/eastland-product-family-tablet.webp
assets/images/homepage/homepage-hero-v2.2-desktop.avif
assets/images/homepage/homepage-hero-v2.2-desktop.jpg
assets/images/homepage/homepage-hero-v2.2-desktop.webp
assets/images/homepage/homepage-hero-v2.2-mobile.avif
assets/images/homepage/homepage-hero-v2.2-mobile.jpg
assets/images/homepage/homepage-hero-v2.2-mobile.webp
assets/images/homepage/homepage-hero-v2.2-tablet.avif
assets/images/homepage/homepage-hero-v2.2-tablet.jpg
assets/images/homepage/homepage-hero-v2.2-tablet.webp
assets/images/social/business-snapshot-share.jpg
assets/images/social/rogers-holdings-home-share.jpg
assets/js/digital-business-card.js
assets/js/site.js
brand-card.jpeg
brian/brian-keith-rogers.vcf
brian/index.html
business-snapshot/index.html
docs/design-reference/founder/brian-keith-rogers-headshot-original.png
email-signature/index.html
favicon.ico
favicon.png
google914083dd95ef8b05.html
index.html
privacy/index.html
robots.txt
sitemap.xml
```

The only `docs/` file in production is the exact founder image referenced by `index.html`.

## Excluded paths and categories

- All internal documentation other than the exact founder image above.
- All tests and build/boundary scripts.
- `.github/`, repository configuration, and workflow source.
- `production-gateway/` and all Receiver/BOP-related source or fixtures.
- Dormant HEW venture source: `hew-gates-garage/`, `assets/css/hew-gates-garage.css`, `assets/js/hew-gates-garage.js`, and `assets/images/hew-gates-garage/`.
- `README.md`, `AGENTS.md`, `package.json`, and development configuration.
- Proof, rollback, approval, design-source, and screenshot material.
- `portfolio-assets/` and all unrelated project/source images.
- Unreferenced root images, including legacy logos and `favicon.svg`.
- Unused `assets/images/brand/`, `assets/images/proof/`, and legacy homepage derivatives.
- `_site/` itself is ignored and is never committed as source.

## Workflow design

### Read-only pull-request validation

`.github/workflows/validate-public-site.yml` runs only for pull requests targeting `main`. It checks out the proposed source, selects Node.js 24 without automatic package-manager caching, runs the complete test suite, and builds `_site/`. It has only `contents: read`, uses PR-specific concurrency that cancels superseded validation runs, and has no environment, Pages permissions, artifact upload, or deployment step.

### Main-only production build and deployment

`.github/workflows/deploy-pages.yml` runs on a push to `main` or manual dispatch. The build job checks out source, selects Node.js 24, runs the complete test suite, rebuilds `_site/`, configures Pages metadata, and uploads only `_site/`. It has `contents: read` and `pages: read` permissions. Pull requests cannot trigger this production workflow.

The separate deploy job needs the successful build, uses the `github-pages` environment, and has only `pages: write` and `id-token: write`. It uses the uploaded artifact with no branch-directory fallback. The workflow does not enable Pages or modify repository settings.

## GitHub Pages activation sequence

No step below was performed during implementation.

1. Commit and push the approved feature branch without merging it into `main`.
2. Review the complete feature branch, generated 42-file artifact, and workflow, then prepare the merge without completing it.
3. In repository **Settings → Environments**, configure the required branch and reviewer protection rules for the `github-pages` environment.
4. Confirm the existing custom domain and HTTPS settings in **Settings → Pages** before changing anything.
5. In **Settings → Pages → Build and deployment**, change **Source** from **Deploy from a branch** to **GitHub Actions** before merging the feature branch.
6. Immediately merge the approved feature branch into `main` during a supervised release window.
7. Allow or approve the resulting **Build and deploy allowlisted GitHub Pages site** workflow and its `github-pages` environment deployment.
8. Verify the homepage, Business Snapshot, and Privacy routes; all required assets; `CNAME` and the configured custom domain; HTTPS; `robots.txt`; `sitemap.xml`; the Google verification file; and the documented excluded-path 404 responses.

The `CNAME` file in the uploaded artifact preserves that artifact file; it does not configure or guarantee the repository's custom-domain setting. Confirm and manage the custom domain separately in **Settings → Pages**.

## Production verification checklist

- Workflow build and boundary tests passed.
- Uploaded artifact reports exactly 42 files.
- Deployment environment is `github-pages` and the reported URL is `https://rogersholdingsllc.com/`.
- `CNAME` is retained and the custom domain remains verified with HTTPS enforced.
- Homepage, Business Snapshot, Email Signature, and Privacy return HTTP 200 at their expected URLs.
- `robots.txt`, `sitemap.xml`, and `google914083dd95ef8b05.html` return HTTP 200.
- Favicons, Apple icon, both social cards, both visible logos, responsive Hero/Eastland media, CSS, JS, and founder image load successfully.
- Homepage and Business Snapshot remain visually correct at desktop and mobile sizes.
- Business Snapshot endpoint, Turnstile, validation, consent, success, and retry behavior remain unchanged.
- No console/runtime errors, failed local assets, or horizontal overflow appear.
- `/docs/TECHNICAL_GROWTH_FOUNDATION_PASS1.md`, `/tests/`, `/production-gateway/`, and `/hew-gates-garage/` return 404.
- View source contains the correct canonical/search metadata and valid JSON-LD.

Record the workflow run, deployment ID, production verification date, and reviewer in the release record.

## Rollback procedure

### Before activation

Leave the GitHub Pages source set to branch `main`/`/`. The current production behavior remains unchanged. If the boundary is rejected, use a reviewed source-control revert of only the boundary files; do not delete or move website source files.

### After activation

1. If the artifact deployment fails or production regresses, change **Settings → Pages → Build and deployment → Source** back to **Deploy from a branch**, branch `main`, folder `/ (root)`.
2. Confirm the previous site and custom domain are serving again. Returning to `main` and `/ (root)` restores the previous publishing mechanism, but it also re-exposes repository-root material through the public website.
3. Preserve the failed workflow run and artifact logs for diagnosis.
4. Revert or correct the boundary implementation through a reviewed commit; do not edit production files through the Pages interface.
5. Rerun the full local/CI validation and repeat the activation sequence only after approval.
