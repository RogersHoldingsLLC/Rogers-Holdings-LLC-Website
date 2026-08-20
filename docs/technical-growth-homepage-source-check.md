# Technical Growth Homepage Source Check

Audit date: 2026-08-20

## Production baseline and publishing source

- Remote refreshed before edits: `origin/main` = `6b59253472f8182bdbb6bb40c83b40abff006541`.
- Latest GitHub Pages build record: status `built`, commit `6b59253472f8182bdbb6bb40c83b40abff006541`, created `2026-08-19T23:58:16Z`, updated `2026-08-19T23:59:04Z`.
- GitHub Pages source: branch `main`, path `/`.
- Pages URL and CNAME: `https://rogersholdingsllc.com/` / `rogersholdingsllc.com`.
- HTTPS enforcement: enabled.

## Public-page metadata inventory

| Page | Title | Meta description | Canonical | Robots |
| --- | --- | --- | --- | --- |
| Homepage | Business Optimization for Small Businesses \| Rogers Holdings LLC | Rogers Holdings helps small businesses get more customers, save time, stay organized, and run better with websites, automation, AI, Google Workspace, and practical business systems. | `https://rogersholdingsllc.com/` | `index, follow` |
| Business Snapshot | Free Business Snapshot \| Rogers Holdings LLC | Get a Free Business Snapshot from Rogers Holdings and receive an Executive Brief covering your stated challenge, visible business systems, and practical next priorities. | `https://rogersholdingsllc.com/business-snapshot/` | `index, follow` |
| Privacy | Privacy Policy \| Rogers Holdings LLC | Learn how Rogers Holdings LLC collects, uses, protects, and retains information submitted through this website. | `https://rogersholdingsllc.com/privacy/` | `index, follow` |

Every canonical is absolute, HTTPS, trailing-slash consistent, and present once in `sitemap.xml`. No public page contains `noindex`, a localhost/staging canonical, or a conflicting canonical.

## Social, favicon, and logo inventory

- Homepage Open Graph: type, site name, locale, title, description, URL, JPEG image, secure image URL, image type, and image alt.
- Homepage Twitter: large-image card, title, description, image, and image alt.
- Business Snapshot Open Graph: type, site name, title, description, URL, and image. It declares a Twitter large-image card and relies on Open Graph fallbacks for the remaining Twitter fields.
- Privacy Open Graph: type, site name, title, description, and URL. It has no explicit Open Graph image or Twitter fields.
- No social metadata was changed solely to make fields identical. The approved homepage descriptions remain intentionally distinct and consistent.
- All pages reference `favicon.png`, `favicon.ico`, and `apple-touch-icon.png`; the homepage also declares the 1024-pixel PNG as an icon.
- Header and footer markup uses the tracked normal/reversed Rogers Holdings logo assets. JSON-LD now uses the same normal logo asset as the visible header.

## Robots, sitemap, and exposure

- `robots.txt` allows all crawlers and declares `https://rogersholdingsllc.com/sitemap.xml`.
- The sitemap contains only homepage, Business Snapshot, and Privacy canonicals.
- Production HEAD checks returned HTTP 200 for all three canonical routes, `robots.txt`, and `sitemap.xml`.
- Public HTML does not link to development, proof, rollback, gateway, test, or email-signature pages. The approved founder image is intentionally loaded from `docs/design-reference/` as a production asset.
- Because Pages publishes the repository root, tracked non-page material is nevertheless addressable. HTTP 200 was confirmed for a rollback Markdown path and `/email-signature/`; the same deployment boundary includes `docs/`, `production-gateway/`, tests, and proof assets. These are not sitemap entries or canonical public pages, but root publishing does not make them private.

## Forbidden-reference scan

- No public page contains a localhost, staging, workers.dev, preview URL, internal proof canonical, or `noindex` mistake.
- `localhost` and preview/staging terms exist only in repository documentation/tests and an existing generic Turnstile failure sentence; they are not public canonical URLs.
- Current metadata contains no `Executive Snapshot` terminology. Legacy filenames under tracked assets and historical documentation remain non-canonical.

## Source-preservation result

No title, meta description, canonical, Open Graph tag, Twitter tag, favicon declaration, analytics tag, public navigation, page section, or visible homepage copy was changed in this pass.
