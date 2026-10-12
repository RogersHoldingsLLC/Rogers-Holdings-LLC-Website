# Eastland portfolio screen refresh — approved release

Owner publication approval: 2026-10-11 (America/New_York).

This approval updates only the website content inside the laptop, tablet and
phone displays and the public Google Business Profile content inside the iMac
display. It supersedes the screen-content portion of the historical
`EASTLAND_FINAL_APPROVED_FREEZE.md`; the original reference, device frames,
desk, objects, lighting, artwork, approved crops and responsive mapping remain
preserved. No homepage copy, hero, layout, church website or Google listing is
changed by this release.

## Approval baseline and rollback

- Verified production parent / rollback revision:
  `c477711545a86ca45a473596193adbba62c9d224`.
- Original reference SHA-256:
  `516d0b764d82f2ac1b451ca0194602da2abe7e3e57ea94d9218d1dde693acb62`.
- Approved lossless composition SHA-256:
  `0cecc1974372e7b951ec0abd7c99f3bfa3de152e28c8c247c60678e418429ec8`.
- Zero changed pixels outside the four intended screen masks in the lossless
  composition; the iMac pass changes zero pixels inside the approved website
  screens or outside its own visible glass mask.

The authentic public Google Maps profile was reached through the repository's
established listing link and verified by church name, address
(`1706 Old Owingsville Rd, Mt Sterling, KY 40353`) and website
(`https://eastlandfirstchurchofgod.com/`). Its place identifier is
`0x884397ea97699efd:0xd679121b4cf7d404`. The public profile was captured, never
edited. All four captures and the exact lossless master remain preserved in
the existing local review directory; they are not part of the public artifact.

## Approved production derivatives

Files below are under `assets/images/homepage/`. Existing filenames, crop
dimensions, encodings and responsive picture mapping are retained. The six
existing picture URLs use `?v=0cecc197`, the approved master's hash prefix, to
invalidate pre-release browser caches. Production verification identified a
desktop tab retaining the previous image despite the server serving approved
bytes; this bounded reference update ensures the page requests the refresh.
The existing responsive-source assertion is updated to require that version.

| File | SHA-256 |
| --- | --- |
| `eastland-product-family-desktop.avif` | `5ae9c76ea058ec8de35d32da58caa71d27cb8710600f08d8283bdc44ac803a6d` |
| `eastland-product-family-desktop.webp` | `725249987cf3a78ded435f5453d412f020652fdf30d3f0b51d837abdab73331e` |
| `eastland-product-family-desktop.jpg` | `7a684c2f8455174484fc1d2764bfe66bf7026ca83c57d32711260b492fbff2e1` |
| `eastland-product-family-tablet.avif` | `15f7ef7a178f79947ecda23d849b2933af909343682e23e2505c7bcff757991e` |
| `eastland-product-family-tablet.webp` | `0dbfc4c0404a8a74d54fd11c00cf12b17f08f548c2adea3b80d1f7052d9dd504` |
| `eastland-product-family-tablet.jpg` | `40f445f35c365ae5bf08d8d6baec4634df7aab912455533bdb1f494142faae04` |
| `eastland-product-family-mobile.avif` | `0055195664a82c4591f14e4471b21dcd78befd1aeb2e49d75c5055292618dfde` |
| `eastland-product-family-mobile.webp` | `d6ff31b79e499c382f564534a49902425160ab32063055aba34e09c2dbdceb31` |
| `eastland-product-family-mobile.jpg` | `e3266ae4f1b73c983017e34f87bf77ced180fb64d4e3fc2cb00ce89467a9bda1` |

## Release validation and public boundary

Pre-release validation passed: all seven `npm test` suites,
`npm run build:public` (44 allowlisted files),
`node --check assets/js/site.js`, `git diff --check`, exact approved asset hash
verification, and desktop/mobile preview inspection. Protected production
`main` requires a pull request and a passing `validate` check; its merge
triggers `.github/workflows/deploy-pages.yml` to test, build and deploy the
allowlisted GitHub Pages artifact.

Only the nine image derivatives and versioned homepage references enter the
published site. This approval record,
local comparison pages, screen captures, masks, backups and review scripts are
excluded by the unchanged public manifest. Rollback should revert this bounded
release through the same pull-request workflow, preserving any later work.
