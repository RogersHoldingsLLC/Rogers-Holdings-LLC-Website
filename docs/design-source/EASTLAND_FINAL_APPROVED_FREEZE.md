# Eastland Final Approved Freeze

Approval date: 2026-08-06

Status: Human approved and frozen for production integration.

> **DO NOT RECONSTRUCT THIS VISUAL FROM CODE OR IMAGE GENERATION.**
>
> The authoritative reference image is the design itself, not merely inspiration for reconstruction.

## Authoritative visual

- Source: `docs/design-reference/eastland-client-work-FINAL-REFERENCE.png`
- SHA-256: `516d0b764d82f2ac1b451ca0194602da2abe7e3e57ea94d9218d1dde693acb62`
- Preservation rule: never overwrite, regenerate, reinterpret, or casually replace this file.

The production assets use this exact image as their sole visual source. No reconstructed device scene, runtime screen overlay, or generated replacement is approved for production.

## Approved production crops

Coordinates are stated in the authoritative source image's 1672 × 941 pixel coordinate space. The 74-pixel captured Rogers Holdings site-header region is omitted so the live site header remains the only visible navigation.

| Breakpoint asset | Source crop (`x, y, width, height`) | Export dimensions |
| --- | --- | --- |
| Desktop | `0, 74, 1672, 867` | `2400 × 1244` |
| Tablet | `0, 74, 1450, 867` | `1600 × 957` |
| Mobile | `0, 74, 1100, 867` | `960 × 757` |

These intentional crops preserve the approved composition without regenerating or reconstructing it.

## Production derivatives

| File | SHA-256 |
| --- | --- |
| `assets/images/homepage/eastland-product-family-desktop.avif` | `1525581890ab7596b26705038ff716219fdab2038f2cd3ad59e502d8d2b2fb61` |
| `assets/images/homepage/eastland-product-family-desktop.webp` | `8582b6fc7d97bf3171d86cb4f5226b7c6b6f908fce6387413e345b7c421986ed` |
| `assets/images/homepage/eastland-product-family-desktop.jpg` | `9e8125aca261ba96b46ac35cb96a1ca43bdbb4a7693faaf67facbb93efa11aa3` |
| `assets/images/homepage/eastland-product-family-tablet.avif` | `ee43aeaf18eb791b140aa609676758fff7592ba481e9dd5177aeabbc4d166f9d` |
| `assets/images/homepage/eastland-product-family-tablet.webp` | `58c622e5635de8de1f606e976cc04a277378ce07ebd96b481a595be90cac4b49` |
| `assets/images/homepage/eastland-product-family-tablet.jpg` | `4a44c359fab534d8352ab877f0d80c770affa4bda06bd38936ee0f7fd417355e` |
| `assets/images/homepage/eastland-product-family-mobile.avif` | `336defbe0ae279c7f5cdc81159dab7950fe9305aec69414bf6ed78a8213c7143` |
| `assets/images/homepage/eastland-product-family-mobile.webp` | `f1ee97b2ff3c937d10558a6b05aaac1c1886d68c3c42c053e3ca2f7f57904f35` |
| `assets/images/homepage/eastland-product-family-mobile.jpg` | `83087ed9898d3458f14b52a67eb7ac3687b0942c2ab15d7e80d10234444de2ef` |

These nine files are the only Eastland portfolio images approved for production references.

## Runtime implementation

The Eastland Selected Client Work feature is implemented in:

- `index.html`: semantic section structure, responsive `<picture>`, intrinsic dimensions, accessible alternative text, functional project links, and screen-reader-only structured journey content.
- `assets/css/site.css`: full-width image presentation, responsive link-target alignment, visible focus treatment, and the editorial evidence-band layout beneath the approved visual.
- `tests/visual-storytelling.test.js`: derivative existence and dimensions, authoritative-source checksum, responsive source mapping, alt text, link safety attributes, and protected hero behavior.

The image carries the approved visual presentation. The website does not reconstruct the desk, devices, embedded screen content, or Discovery Journey with runtime overlays.

## Functional links

- View Live Website: `https://www.eastlandfirstchurchofgod.com`
- View Google Listing: `https://www.google.com/maps/search/?api=1&query=Eastland+First+Church+of+God%2C+1706+Old+Owingsville+Rd%2C+Mt+Sterling%2C+KY+40353`

Both links use live HTML targets, open in a new tab, and include `rel="noopener noreferrer"`.

## Accessibility treatment

- The responsive image has descriptive alternative text identifying Eastland, the multi-device client-work presentation, the executive desk, and the Discovery Journey.
- The Selected Client Work label, Eastland heading, summary, and six Discovery Journey stages remain available as semantic screen-reader text without visually duplicating baked content.
- The two baked visual link labels are backed by minimum 44-pixel live HTML interaction targets.
- Link text announces that each destination opens in a new tab.
- Keyboard focus uses a visible champagne outline and offset against the dark artwork.
- The implementation adds no motion and remains compatible with the site's reduced-motion handling.

## Discovery Journey handling

The approved image already contains the complete six-stage Discovery Journey. A second visible HTML rendering is intentionally suppressed to prevent duplication. The same six stages remain in semantic HTML for assistive technology:

1. Discover
2. Audit
3. Strategy
4. Build
5. Optimize
6. Grow

The factual Challenge / Assessment / Solution / Outcome evidence remains in live HTML immediately after the visual.

## Protected main homepage hero

- Canonical main-hero HTML-region SHA-256: `8511980cd7f9cd58427c938b495405413e89af6bece9ef26a73b17e229499af8`
- The Eastland integration does not change the main hero's HTML, imagery, copy, controls, disclosure, or breakpoint behavior.

## Approval validation

The approved state was validated on 2026-08-06 at widths 320, 390, 768, 1366, 1440, and 1920 pixels. Validation covered responsive image selection, horizontal overflow, broken images, console errors, keyboard-sized external-link targets, mobile navigation, Business Snapshot, and Privacy. Repository validation includes:

- `npm test`
- `node --check assets/js/site.js`
- `git diff --check`

## Development-history cleanup manifest

Nothing in this manifest is deleted by the freeze commit. Cleanup requires a separate human-approved maintenance change.

### KEEP PERMANENTLY

- `docs/design-reference/eastland-client-work-FINAL-REFERENCE.png`
- `docs/design-source/EASTLAND_FINAL_APPROVED_FREEZE.md`
- `docs/ROGERS_HOLDINGS_VISUAL_FIRST_WORKFLOW.md`
- `docs/design-source/ROGERS_HOLDINGS_CLIENT_WORK_PHOTOGRAPHIC_STANDARD.md` as historical policy context, subordinate to this freeze where the two differ

### PRODUCTION REQUIRED

- `index.html`
- `assets/css/site.css`
- The nine `assets/images/homepage/eastland-product-family-*` AVIF/WebP/JPG derivatives listed above
- `tests/visual-storytelling.test.js`

### ARCHIVE

- `docs/design-source/rollback-eastland-2026-08-06/`
- `docs/design-source/rollback-eastland-final-reference-2026-08-06/`
- `docs/design-source/rollback-eastland-reference-delta-2026-08-06/`
- Historical provenance and coordinate documents matching `docs/design-source/EASTLAND_*PROVENANCE.md`, `EASTLAND_AUTHORITATIVE_REFERENCE_COORDINATES.md`, and `EASTLAND_AUTHORITATIVE_REFERENCE_MATCH.md`
- Historical browser evidence matching `docs/eastland-*-desktop.png`, `docs/eastland-*-tablet.png`, and `docs/eastland-*-mobile.png`
- Historical comparison and difference images matching `docs/eastland-*comparison*.png`, `docs/eastland-*side-by-side*.png`, `docs/eastland-*overlay*.png`, and `docs/eastland-*difference*.png`

### SAFE TO DELETE

Only after the archive is accepted and a separate cleanup is approved:

- Abandoned reconstructed or generated masters under `docs/design-source/` matching `eastland-*-master.png`
- Superseded screen-capture and viewport artifacts under `docs/design-source/` matching `eastland-*-capture-*.png` and `eastland-*-viewport-*.png`
- Superseded authentic-screen proof images under `docs/design-source/` whose names include `authentic-screens`
- Experimental build/comparison scripts under `scripts/` whose names begin with `build-eastland-` or `create-eastland-`
- Intermediate reference-resize images under `docs/` matching `eastland-authoritative-reference-*.png`

## Freeze rule

The Eastland visual is frozen. Future unrelated website work must not reopen, reconstruct, regenerate, screen-replace, re-crop, recolor, or redesign it. Any proposed change requires explicit human authorization that names this frozen feature and produces a new recorded approval baseline.
