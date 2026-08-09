# Homepage Hero V2.1 Final Approved Freeze

Date: 2026-08-08

Status: Final responsive integration proof passed. Prepared for approval freeze; not committed, pushed, merged, or deployed.

## Approved hierarchy

The authentic document shown in the Homepage Hero uses this approved hierarchy:

`BUSINESS SNAPSHOT`

`Executive Brief`

The naming relationship is:

- Free Business Snapshot = offer
- Executive Brief = deliverable

## Authoritative sources

- Corrected PDF: `docs/design-reference/homepage-hero-v2/Executive Brief.pdf`
  - SHA-256: `f21c5ad969324c1a210e9ee8817fa128636f0805d702ed0d80d707923e6cd4e2`
- Approved V2.1 master: `docs/design-source/homepage-hero-v2.1-FINAL-AUTHENTIC-MASTER.png`
  - SHA-256: `2e8cafbe18404221bce7765d990e2690c78cd848ddce481f40362aaad3b054af`

## Approved production derivatives

| Asset | SHA-256 |
| --- | --- |
| `assets/images/homepage/homepage-hero-v2.1-desktop.avif` | `196367f634c493684269032407f2363180c308a8cfc1241843134f01f9c41b57` |
| `assets/images/homepage/homepage-hero-v2.1-desktop.webp` | `8a556dd5224cd2228eb89b8af4e9ab9ddf7d467b22c71da4a674be72fb9829e9` |
| `assets/images/homepage/homepage-hero-v2.1-desktop.jpg` | `c56e27dd3a33910d6550b570a55bfd231903a070a76519509d28695faeba287e` |
| `assets/images/homepage/homepage-hero-v2.1-tablet.avif` | `f55519bdb028f2feacbe70591169598f8f17aaa5f6e2bb2286eea37039686eab` |
| `assets/images/homepage/homepage-hero-v2.1-tablet.webp` | `efe0629abaa7a6ea2908bcb551adb0f0c89ba11c75fbfa42745f9da1c6f80ca5` |
| `assets/images/homepage/homepage-hero-v2.1-tablet.jpg` | `d180aec4554b05a95642e02f41756abe252eac1e62d71b2234ce3f166150988b` |
| `assets/images/homepage/homepage-hero-v2.1-mobile.avif` | `6521a1f6a793cbb51f4d776a6df59ea3d637faf96e5a78f4f1809ac34870cec5` |
| `assets/images/homepage/homepage-hero-v2.1-mobile.webp` | `010d88db4ceb2b020bdba7176b51278876c8da5ba7a95f4f776af9a3c9a3e052` |
| `assets/images/homepage/homepage-hero-v2.1-mobile.jpg` | `287e3b9fce886308abb12c4711b2c4f008fb9eea75b9aca7a9c4126c7023899b` |

The prior `homepage-hero-v2-*` production derivatives remain preserved during this proof.

## Approved responsive geometry

The existing CSS, breakpoints, scrim, image positioning, and hero heights are unchanged. Browser proof confirmed:

| Viewport | Selected AVIF | Hero / rendered image geometry | Headline lines | Horizontal overflow |
| --- | --- | --- | ---: | --- |
| 1920 × 1080 | desktop, 1536 × 1024 intrinsic | 1920 × 960 | 4 | none |
| 1672 × 941 | desktop, 1536 × 1024 intrinsic | 1672 × 941 | 4 | none |
| 1440 × 900 | desktop, 1536 × 1024 intrinsic | 1440 × 900 | 4 | none |
| 1366 × 768 | desktop, 1536 × 1024 intrinsic | 1366 × 768 | 4 | none |
| 768 × 1024 | tablet, 1600 × 1200 intrinsic | hero 768 × 1000; image 768 × 570 at y=430 | 3 | none |
| 390 × 844 | mobile, 960 × 1280 intrinsic | hero 390 × 1020; image 390 × 420 at y=600 | 4 | none |
| 360 × 800 | mobile, 960 × 1280 intrinsic | hero 360 × 900; image 360 × 314 at y=586 | 3 | none |
| 320 × 568 | mobile, 960 × 1280 intrinsic | hero 320 × 938.19; image 320 × 352.19 at y=586 | 4 | none |

At 320 × 568, the approved gap between the trust line and photograph is 17.81 CSS pixels and remains intact.

At every viewport, Chrome reported the expected V2.1 AVIF as `currentSrc`, the image completed successfully, and there were no failed requests, HTTP error responses, console errors, error overlays, copy/document collisions, or horizontal overflow. The approved eyebrow, headline, paragraph, primary CTA, secondary CTA, trust line, disclosure, navigation, and responsive crop remained intact.

## Browser evidence

- `docs/homepage-hero-v2.1-FINAL-desktop-1440.png`
- `docs/homepage-hero-v2.1-FINAL-desktop-1672.png`
- `docs/homepage-hero-v2.1-FINAL-tablet-768.png`
- `docs/homepage-hero-v2.1-FINAL-mobile-390.png`
- `docs/homepage-hero-v2.1-FINAL-mobile-320.png`
- `docs/homepage-hero-v2.1-FINAL-responsive-comparison.png`

## Verification results

- `npm test`: passed (five contract suites)
- `node --check assets/js/site.js`: passed
- `git diff --check`: passed
- `/business-snapshot/`: HTTP 200
- `/privacy/`: HTTP 200

## Protected areas

The following remain unchanged from baseline `f8863fe`:

- Homepage CSS, scrim, breakpoints, hero heights, positioning, and all responsive geometry
- Eastland content, assets, evidence band, discovery journey, and external links
- Business Snapshot page and form
- Production intake endpoint and response contract
- Turnstile integration
- Privacy page
- `assets/js/site.js`
- Analytics and protected metadata
- Footer
- Business Optimization Platform section
- All unrelated homepage sections

Do not regenerate, reconstruct, recompose, or edit the approved V2.1 source or derivatives. Future changes require a separate review and new evidence. Do not delete the preserved V2 production assets until separately authorized.
