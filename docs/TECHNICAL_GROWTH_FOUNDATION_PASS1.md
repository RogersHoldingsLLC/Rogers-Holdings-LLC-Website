# Technical Growth Foundation Pass 1

Audit and implementation date: 2026-08-20

## Baseline and production

- Exact refreshed `origin/main`: `6b59253472f8182bdbb6bb40c83b40abff006541` (`Auto-format signature phone number`).
- Latest production Pages build: successful build of the same exact commit.
- Production URL/CNAME: `https://rogersholdingsllc.com/` / `rogersholdingsllc.com`.
- GitHub Pages source: `main` branch, repository root (`/`), HTTPS enforced.
- Working branch: `improve/technical-growth-foundation`.
- Worktree was clean before edits.

## Indexability audit

- `robots.txt`: `User-agent: *`, `Allow: /`, and the absolute production sitemap URL.
- Public canonicals: homepage, Business Snapshot, and Privacy are absolute, distinct, trailing-slash consistent, index/follow, and present in the sitemap.
- Production response checks: HTTP 200 for all canonical pages, robots, and sitemap.
- No public canonical/meta tags contain localhost, staging, preview, proof, rollback, or internal-only paths.
- No public page contains an accidental `noindex` directive or conflicting canonical.
- Root Pages publishing exposes tracked non-page paths even when they are unlinked and absent from the sitemap. A rollback Markdown file and `/email-signature/` returned HTTP 200 in production. This is the remaining deployment-boundary blocker.

Full source inventory: `docs/technical-growth-homepage-source-check.md`.

## Business Snapshot fallback

Root cause: stale endpoint-disconnected text was natively hidden but server-rendered in form source, allowing source parsers/crawlers to read it. It could not normally flash or enter the accessibility tree because `hidden` applied at parse time. JavaScript revealed it only if the configuration flag or exact action failed the production endpoint check.

Correction: the server-rendered paragraph is empty/hidden. Only a proven configuration or retryable service failure creates the authorized failure sentence. Normal endpoint behavior is unchanged.

Full fallback evidence: `docs/technical-growth-business-snapshot-fallback-check.md`.

## Structured-data decisions

Baseline graph: Organization, WebSite, WebPage, Service, and Eastland CreativeWork.

Changes: explicit legal/brand names, approved organization description, visible-logo ImageObject, verified founder Person and reciprocal relationship, current public capability topics/service labels, and an aligned WebPage description. Existing IDs and service/project relationships remain coherent.

Full structured-data record: `docs/technical-growth-structured-data-check.md`.

## Metadata decisions

The current homepage title, meta description, canonical, Open Graph title/description, and Twitter title/description all accurately support the approved plain-English positioning. The social descriptions are intentionally concise rather than identical. No head metadata was changed.

Exact metadata-related changes were confined to JSON-LD:

- added Organization identity/description/founder details;
- aligned the JSON-LD WebPage description to the approved meta description;
- aligned structured service/topic labels to visible approved capabilities.

Business Snapshot and Privacy social-field gaps were inventoried but not changed because they are not stale, contradictory, inaccurate, or materially unclear.

## Sitemap decisions

- Canonical URL set remains exactly homepage, Business Snapshot, and Privacy.
- Homepage `lastmod` changed from `2026-08-07` to `2026-08-20` for the factual structured-data change.
- Business Snapshot `lastmod` changed from `2026-08-07` to `2026-08-20` for the factual fallback/source change.
- Privacy remains `2026-08-07` because its source/content was not changed.
- Frequencies and priorities are unchanged.

Search Console owner checklist: `docs/SEARCH_VISIBILITY_LAUNCH_CHECKLIST.md`. No Search Console owner action is claimed complete.

## Analytics inventory and event-gap matrix

Provider remains Google Analytics measurement ID `G-MK4TVD3CYT`. Default `gtag('config', ...)` page views and the existing custom events were not changed.

| Interaction/outcome | Recorded now | Distinguishable now | Evidence/gap |
| --- | --- | --- | --- |
| Homepage Business Snapshot CTA click | Yes | Partially | Every `[data-report-link]` emits `report_cta_selected`; event has no CTA-position label. |
| See How We Can Help click | No custom event | No | Anchor navigation only. |
| Business Snapshot page view | Yes | Yes | Default GA page view is distinguishable by page URL/path. |
| Form start | Yes | Yes | `business_snapshot_form_started`, once per journey. |
| Validation failure | Yes | Yes | `business_snapshot_submission_failed` with `failure_category=user_validation`. |
| Turnstile failure | Yes | Yes | Missing, rejected, error, expired, and timeout categories are distinguishable. |
| Successful submission | Yes | Yes | `business_snapshot_submitted`. |
| Phone click | No custom event | No | `tel:` links have no listener. |
| Email click | No custom event | No | Direct `mailto:` links have no listener; prepared-email fallback separately emits `business_snapshot_email_prepared`. |
| Eastland website click | No custom event | No | Safe external link, no analytics listener. |
| Eastland Google listing click | No custom event | No | Safe external link, no analytics listener. |
| Final CTA click | Yes | No | Emits the shared `report_cta_selected` event with no final-CTA identifier. |

Recommended later analytics pass: add privacy-safe location labels to the shared Snapshot CTA event and isolated click events for the secondary hero CTA, phone/email, and Eastland links. Do not change provider or send form values/PII.

## Protected areas and preservation

- Homepage design/copy sections, navigation, footer, image assets, CSS, and user-facing metadata: unchanged.
- Business Snapshot hero/process/form fields/order/endpoint/schema/validation/consent/honeypot/Turnstile/success/retry behavior: unchanged.
- Receiver, Business Optimization Platform, gateway contract, analytics provider, deployment configuration, and production assets: unchanged.
- Privacy source/content: unchanged.
- No commit, push, merge, or deployment performed.

## Accessibility and security

- Exactly one H1 rendered on each public page at both tested viewports.
- Logical heading/page structure, keyboard/focus code, reduced motion, labels, validation announcements, consent, Privacy links, and external-link safety attributes were preserved.
- Normal fallback node is empty, hidden, non-rendering, and absent from the accessibility tree.
- Failure text does not disclose endpoint, receiver, Turnstile secret, or internal implementation details.
- Security-related metadata and form transport/response constraints remain intact.

## QA results

- `npm test`: pass; five test suites passed.
- `node --check assets/js/site.js`: pass.
- `git diff --check`: pass.
- JSON-LD source/render parse: pass.
- Sitemap XML and canonical-route mapping: pass.
- Stale `Executive Snapshot` metadata scan: pass (none).
- Browser QA at 1440×900 and 390×844 for `/`, `/business-snapshot/`, `/privacy/`: pass.
- Browser console/runtime errors: none.
- HTTP error responses for page/local assets: none.
- Broken rendered images: none.
- Horizontal overflow: zero on every route/viewport.
- Canceled GA beacons during scripted route navigation were classified as navigation cancellations, not asset or application failures.

## Exact changes

- `index.html`: conservative entity/organization/founder JSON-LD improvements only.
- `business-snapshot/index.html`: removed stale fallback text from normal HTML source while retaining the hidden hook.
- `assets/js/site.js`: creates authorized fallback copy only after proven failure and uses it for retryable service failures.
- `sitemap.xml`: factual `lastmod` updates for changed canonical pages.
- `tests/business-snapshot-frontend.test.js`: fallback source/copy regression coverage.
- `tests/sitewide-brand-assets.test.js`: JSON-LD parsing and identity/founder regression coverage.
- Documentation: this report, launch checklist, and three focused evidence records.

## Remaining blocker

GitHub Pages publishes the repository root, so unlinked internal documentation, rollback/proof files, test/source material, and `/email-signature/` remain publicly addressable. `robots.txt` cannot provide confidentiality and disallowing paths alone does not remove public exposure. The next pass needs explicit approval to change the publishing boundary (for example, a production-only artifact/branch) while preserving CNAME, verification, analytics, assets, and canonical routes.
