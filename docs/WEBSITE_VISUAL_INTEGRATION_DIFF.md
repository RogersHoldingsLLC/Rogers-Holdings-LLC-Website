# Website Visual Integration Diff

## Integration method

The approved visual release was ported section-by-section onto `origin/main` at `82b16903d84a898b50d155233fa5d0761c68b97c`. Whole preservation files were not copied over the newer baseline.

## Deliberate resolutions

1. **Executive Snapshot hero:** The baseline document-stack markup directly conflicted with the approved photographic hero. Only that figure was replaced. The newer baseline headline, calls to action, complimentary-review note, navigation, metadata, and scripts remain.
2. **Runtime proof scope:** The baseline homepage referenced 93 proof derivatives, including 56 North Point assessment/plan variants. The approved release requires exactly 37 runtime proof assets, so only the two out-of-scope visual-proof sections were removed. Their tracked source files were not deleted or altered.
3. **Eastland presentation:** The baseline already included the newer Eastland case narrative, before-state callout, journey, responsive source sets, and live-project link. Those were retained while only the four-device framing markup and scoped CSS were replaced with the approved browser-framed presentation.
4. **Owner caption:** Only the redundant “Rogers Holdings visual standard” text was removed. The “Executive Materials” label and owner-led content remain.
5. **Stylesheet integration:** Existing baseline CSS was retained. Approved hero/device styles were appended as narrowly scoped overrides, and only the homepage stylesheet cache key changed.
6. **Tests:** Existing visual contract tests were updated to enforce the integrated markup, the fictional disclosure, and exactly 37 runtime proof references. Functional Business Snapshot, brand, trust/conversion, and gateway coverage remains intact.
7. **README:** Preservation and baseline versions were compared. The baseline `README.md` was retained unchanged because copying the preservation version would regress newer operational documentation.
8. **Staging gateway:** No staging gateway exists in fetched `origin/main`. It was not copied from the unrelated mixed worktree, so no staging-gateway test could be run.

## Changed-file scope

- `index.html`
- `assets/css/site.css`
- `tests/visual-storytelling.test.js`
- `tests/whole-site-refinement.test.js`
- 9 `assets/images/proof/north-point-snapshot-scene-*` files
- `docs/WEBSITE_VISUAL_INTEGRATION_REPORT.md`
- `docs/WEBSITE_VISUAL_INTEGRATION_DIFF.md`
- `docs/website-visual-integration-desktop.png`
- `docs/website-visual-integration-tablet.png`
- `docs/website-visual-integration-mobile.png`

## Explicitly unchanged operational scope

- Business Snapshot pages, form scripts, intake configuration, and production endpoint
- Cloudflare Turnstile and production gateway code/configuration
- Privacy page and consent behavior
- Analytics and homepage metadata
- Navigation destinations and hash behavior
- Favicons, social image, `robots.txt`, `sitemap.xml`, `CNAME`, and Search Console verification
- Deployment configuration and production state

## Final target-matching rebuild scope

- Rebuilt only the problem, method, capabilities, and Eastland case-study presentation.
- Added CSS-only line marks, fine gold dividers, alternating warm surfaces, and editorial spacing; no new imagery or copy was introduced.
- Reworked the approved Eastland devices into realistic aluminum-style laptop, all-in-one desktop, tablet, and phone forms on one shared plane.
- Added Safari-style chrome to the phone so all four visible screens carry consistent browser framing.
- Preserved all 37 approved runtime proof references and every protected operational path.
- Updated the three existing integration screenshots for 1440px, 768px, and 390px review.
