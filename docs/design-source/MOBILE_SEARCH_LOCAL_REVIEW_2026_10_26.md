# Mobile composition and search foundations — local review

Baseline: `65bb90f011586152e164310aaadd0639cd60bf87` (published PR #58). Branch: `review/mobile-and-search-foundations-2026-10-26`. Isolated checkout on RCS-01: `/Users/rogersadmin/Documents/Codex/2026-10-26/task/website`.

## Revision

- Put the existing sculpture after the headline in DOM order, at 176px wide on phones (160px at 320px), followed by a concise founder introduction and paired actions. Desktop retains the cream, black and original gold frame composition. Hero height follows content.
- Consolidate Eastland proof in the existing Our Work context. Project names, needs and case-study links lead their preview images. Remove compounded section/container padding and keep logos inside their allotted rows.
- Add the fifth service, **SEO & Local Search Foundations**. Review the website, business information and goals first. Any separately agreed work may cover titles/descriptions, useful structure/links, indexing/sitemap checks and Google Business Profile setup/cleanup only for eligible businesses. Included website basics stay included; no ranking guarantee, advanced-service claim, ads offer or implied Google approval.
- Use goal-first Snapshot headings and introduction, retaining the three-business-day timing and all existing intake behavior. Keep Eastland's evidence labeled **Current experience** and improve case-study reading hierarchy without adding results.
- Version shared CSS references for cache consistency. Existing image files, logos, sculpture geometry/motion script, production delivery JavaScript, metadata integrations, commercial terms and contact destinations remain intact. No images generated or credits used.

## Browser verification

Rendered in isolated headless Chrome, using responsive viewport emulation. No physical iPhone or Safari test is claimed.

42 route/width checks passed with no visible overflow. The intentionally clipped anti-spam honeypot stays hidden. Final fifth-service heading alignment also passed targeted checks at all six widths.

Seven routes checked: homepage, Our Work, Website Creation, Spreadsheet Repair, Business Snapshot, Brian's card and Privacy. Widths: 1440, 1024, 768, 390, 375 and 320; phone viewport height 844px. Final route results are in `../evidence/responsive-checks.json` relative to the checkout's parent task folder.

Phone first viewport, measured from page top:

| Width | Sculpture bottom | Both actions bottom |
| --- | --- | --- |
| 390 | 432px | 617px |
| 375 | 432px | 641px |
| 320 | 405px | 615px |

- Keyboard menu opening, first-link focus, forward/reverse focus trap, Escape return, anchor navigation, visible focus, contact and work paths passed at 390/375/320. Keyboard Enter inquiry/intake paths also passed at 1440.
- Fifth-service inquiry goes to the existing contact section. RH phone remains `859-404-4351`; email remains `briankeith@rogersholdingsllc.com`.
- Required fields, consent value, validation lengths, blank and valid synthetic local form states were checked without submitting. Zero POST requests observed. No email or phone app opened.
- Active sculpture settled in 4.525–4.558s at 1440/768/390/375/320. Final yaw zero; pixels unchanged and no continuing sculpture animation-frame scheduling. Reduced motion: immediate static, zero sculpture frames scheduled.
- All pre-existing image bytes, form/input/textarea/button attributes, consent markup and delivery/animation scripts match the baseline. HEW source and public contact page remain unchanged. Website starting price $2,000, focused existing-workbook repair minimum $250, and separate custom workbook scoping remain unchanged.

## Repository checks

`npm test`: all eight suites passed. `npm run build:public`: 75 allowlisted files. `git diff --check` and JavaScript syntax checks passed. There is no dedicated lint script in package.json. Existing contract assertions were updated for the reviewed copy, stylesheet version and fifth service; required-field, endpoint, consent and asset checks remain intact.

## Evidence and gate

Review screenshots and machine-readable results are in `/Users/rogersadmin/Documents/Codex/2026-10-26/task/evidence`. Representative files: `hero-1440.png`, `hero-390.png`, `hero-375.png`, `hero-320.png`, `search-service-390.png`, `project-card-390.png`, `eastland-story-1440.png`, `intake-320.png`, and `form-320.png`.

No push, PR, merge, publication, deployment, form submission, account/access change, BOP/accounting change or spending performed. Owner review and explicit publication authorization remain the next gate. Production intake delivery/Turnstile acceptance was deliberately not exercised; localhost validation does not verify production delivery.

Rollback for any future approved publication: revert this scoped revision through the established PR/Pages workflow. Baseline reference is the commit above. The owner's primary dirty checkout is preserved.

## Exact changed files

- `README.md`
- `assets/css/our-work.css`
- `assets/css/site.css`
- `business-snapshot/index.html`
- `index.html`
- `our-work/index.html`
- `privacy/index.html`
- `spreadsheet-repair/index.html`
- `tests/business-snapshot-frontend.test.js`
- `tests/homepage-premium-trust-conversion.test.js`
- `tests/visual-storytelling.test.js`
- `tests/whole-site-refinement.test.js`
- `website-creation/index.html`
- `docs/design-source/MOBILE_SEARCH_LOCAL_REVIEW_2026_10_26.md`
