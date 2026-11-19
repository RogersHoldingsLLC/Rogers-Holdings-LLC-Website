# Homepage carousel: stronger active-card emphasis

Prepared against published main `25896748130fb23006d53411eebafc13a1574add`.

## Scope

Change only the homepage active-card scale from `1.045` to `1.10`, plus its regression assertion. This is 10% over an unscaled card and approximately 5.34% wider than the currently published front card, not another 10% over the previous release. Side cards retain scale 1.

An exact source comparison verifies that every other byte of `index.html` is unchanged: copy, links, images/srcsets, ring placement, transitions, keyboard logic, focus styles, analytics, forms, metadata and reduced-motion guard.

## Verification

- Full `npm test`: all 11 test groups pass.
- `npm run build:public`: 224 approved public files.
- `git diff --check`: pass.
- Live baseline CSS was active (computed scale 1.045, CSS zoom 1), so this is not a cache diagnosis.
- Local managed preview used identical before/after documents at CSS widths 320, 390, 768 and 1280. The test iframe has a classic scrollbar, so layout content widths were about 15px narrower. It was not a physical-device or Safari test.
- Measured after each 850ms transition had settled. All 14 front positions at each width passed (56 total): one active front, all 28 front/back images loaded, no document horizontal overflow, and more than the 7px focus-outline allowance on every side. No side-card size change was measured.

| Test width | Published front width | Candidate front width | Candidate minimum clearance across rotations |
| --- | ---: | ---: | ---: |
| 320 | 235.92px | 248.49px | 28.25px |
| 390 | 282.46px | 297.55px | 21.40px |
| 768 | 452.01px | 476.38px | 32.78px |
| 1280 | 456.51px | 480.90px | 55.68px |

- Visual before/after review confirmed a stronger front card with unchanged surrounding cards.
- Actual Next-button rotation exercised all positions and wrap. Keyboard End selected 14/14; ArrowRight wrapped to 1/14; ArrowLeft returned to 14/14; Home selected 1/14.
- Tab focused the active card link with its existing 3px outline and 4px offset. Enter opened the correct local Captured by Karmen portfolio detail page.
- Local-only QA harness blocked external connections/forms. It was removed from the public output before the final build and is not part of the release.

## Release boundary and rollback

This document records candidate validation, not production deployment. Normal PR checks and owner release approval remain required. No performance improvement is claimed. No repository settings were changed. Roll back by reverting this focused commit (or restore the scalar and matching test to 1.045).
