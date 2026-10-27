# Service details, Chamber loading and Snapshot — local review

Baseline: `3a26e307d11ad1be9160b221b00d559fdd48315d`. Local branch: `review/service-details-chamber-snapshot-2026-10-26`.

This is a local review revision. No push, PR, merge or deployment is authorized or performed for this revision. Proposed starting prices remain in a separate local review document outside the website repository; none are included in public source or the allowlisted build.

## Reproduced Chamber defect

The fully loaded card remained within its bounds at 1440px and 1024px. During natural lazy loading at 1440px, however, the card grew from 93.05px to 185px and moved its profile button from 29px to 149px from the card's left edge and from 29px to 85.41px from the top. The 390px card similarly grew from 93.05px to 188.44px and shifted/reflowed the button.

The card now renders its company/member text statically and reserves a 96px square for the optional official logo widget. The widget's duplicate injected name/text are hidden; its official logo source and destination are retained. The member-profile link and explanatory note keep their grid positions while loading. An unavailable widget leaves a readable text placeholder and working profile link.

Measured before/after loading in the revised card:

| Width | Card height before/after | Profile left before/after | Profile top before/after |
| --- | --- | --- | --- |
| 1440 | 185 / 185px | 149 / 149px | 85.41 / 85.41px |
| 390 | 188.44 / 188.44px | 149 / 149px | 76.34 / 76.34px |

The diagnosis is the reproduced loading-related shift; no claim is made about an additional unseen browser-specific defect.

## Service entry points

The service list now leads to pricing/scope details. The two large, duplicated homepage pricing panels are removed. Their existing complete service pages retain the approved prices and terms.

| Service | Destination |
| --- | --- |
| Websites | `/website-creation/` |
| Spreadsheets | `/services/#spreadsheets`, with a link to `/spreadsheet-repair/` |
| Forms & Intake | `/services/#forms-intake` |
| Documents & Templates | `/services/#business-documents` |
| SEO & Local Search Foundations | `/services/#seo-local-search` |

These are ordinary accessible links with usable direct URLs, keyboard focus and browser Back/Forward behavior. The old `/#website-creation` and `/#spreadsheet-repair` anchors remain on the relevant service-list entries. Native anchor positioning also works with the site navigation script blocked. The new scope page is included explicitly in the allowlist and sitemap.

SEO copy now reads beneath its heading in the same order as the other services. Its scope retains review before recommending, eligible-business-only Google Business Profile work, included website basics staying included, a separate agreed scope/quote and no ranking guarantee.

## Snapshot content

The homepage now explains the customer decision, what to share, what is delivered, the established three-business-day timing and what the customer can do next. It remains free, optional and separate from paid work. The fictional Executive Brief sample/disclosure remains unchanged. The intake hero and deliverable labels use matching evidence/goal language, while the pre-field introduction stays within the existing 120-word limit.

Exact revised headings and copy are retained in the separate local copy-review record. No outcome claims, guaranteed business results, new delivery deadlines, compulsory call or paid-work commitment are added.

## Verification

- All eight repository suites passed; public build contains 76 explicitly allowlisted files. Diff and JavaScript syntax checks passed. No dedicated lint script is configured.
- Eight routes at 1440/1024/768/390/375/320px: 48 checks without visible overflow. Final Snapshot/service typography also received 12 targeted checks after refinement.
- Five service paths at 1440/390/375/320px: 20 keyboard, visible-focus, Back, Forward and reload checks. Eight legacy-fragment checks, direct section positioning, and the native-link fallback passed.
- Chamber before/after loading has zero measured layout shift at 1440 and 390px. Unavailable-widget fallback was inspected at 320px.
- Snapshot CTA, required fields, lengths, consent, blank-form validity and the mobile menu/Escape path passed; zero intake POSTs. No production form was submitted.
- Existing local image bytes, hero sculpture/geometry and finite-motion script, delivery/validation JavaScript, approved service-page content/prices, contact destinations, HEW and owner checkout are preserved. The existing script and approved image bytes substantiate motion/asset preservation; this revision does not introduce new animation.

Checks used headless Chrome responsive emulation. Physical Safari and production intake delivery are not claimed as tested. Screenshots and machine-readable checks are retained locally; prior Library/local-file display restrictions were not retried or bypassed.

## Remaining decisions

Brian should review the copy and proposed starting-price packages separately. The proposed amounts and scope caps require approval before any public pricing change. Publication of this revision remains a separate approval gate.

## Exact changed files

- `README.md`
- `assets/css/site.css`
- `business-snapshot/index.html`
- `docs/design-source/SERVICE_DETAILS_CHAMBER_SNAPSHOT_LOCAL_REVIEW_2026_10_27.md`
- `index.html`
- `our-work/index.html`
- `privacy/index.html`
- `scripts/public-artifact.mjs`
- `services/index.html`
- `sitemap.xml`
- `spreadsheet-repair/index.html`
- `tests/business-snapshot-frontend.test.js`
- `tests/homepage-premium-trust-conversion.test.js`
- `tests/public-artifact.test.mjs`
- `tests/visual-storytelling.test.js`
- `tests/whole-site-refinement.test.js`
- `website-creation/index.html`
