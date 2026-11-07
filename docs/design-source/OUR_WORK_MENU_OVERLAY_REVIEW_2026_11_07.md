# Our Work menu overlay review

Status: local review only. Not pushed, merged or deployed.

Baseline: approved production commit `a362f84ca9164a51acda413f4d0d6033cee69b0e`.

## Problem and bounded fix

On the live Our Work page at 390×844, opening navigation showed only Services in a narrow scrollable strip. The scrolled header's `backdrop-filter` made it the containing block for its fixed-position navigation.

The page-scoped mobile fix removes that filter only while the menu is open, positions the menu directly below the existing 72px header plus its 1px border, and sizes it to the remaining viewport. Dynamic viewport units have a `vh` fallback. The menu preserves safe-area padding, its own vertical scrolling on unusually short screens, and non-shrinking link targets. Existing navigation, focus trapping, Escape handling and desktop layout remain unchanged.

Only the Our Work stylesheet and its cache version affect production behavior. The browser fixture and regression assertions are development-only and excluded from the allowlisted public build. No content, branding, metadata, integration or example-site change is included.

## Validation

- All eight `npm test` suites pass, including the added CSS regression guards.
- `npm run build:public` succeeds with 90 allowlisted files.
- `git diff --check` passes.
- Live clipping reproduced in Chrome at 390×844 before changes.
- Local Chrome responsive and keyboard fixture: 95 passed, 0 failed across seven mobile/tablet/short-screen viewports and two desktop widths. All four choices are visible without scrolling at tested heights of 390px or greater. At 240px, menu scrolling and last-link focus remain usable.

Run local browser checks with a static server at the repository root and visit `/tests/our-work-menu-browser.html`. The fixture covers 320×568, 390×844, 680×600, 768×1024, 960×600, 844×390 and 667×240, plus desktop widths 961 and 1440. It checks viewport bounds, visible choices, short-screen access, focus entry, Tab wrapping, Escape, repeated toggles, mid-page opening, link-close and desktop resize cleanup.
