# Our Work — approved website release

Brian approved publication on 2026-10-12 (America/New_York) of the reviewed Our Work page, concise homepage preview, navigation and required image/styles.

## Scope and rollback

- Verified production parent and rollback revision: `dd0df6c78f2a07b4432e394af9d88c28a5d678df`.
- Preserved local rollback branch: `rollback/our-work-before-release-2026-10-12`.
- Release branch: `improve/our-work-local-review`.
- Production repository: `RogersHoldingsLLC/Rogers-Holdings-LLC-Website`.

The detailed Eastland narrative moves from the homepage to `/our-work/`, alongside Missy’s approved business need, spreadsheet work and practical-benefit story. The homepage retains `#work` as a concise two-project preview. Header/footer navigation on the homepage, Snapshot, privacy and spreadsheet-repair pages reaches Our Work. Existing services and Free Business Snapshot destinations remain.

The local review/adaptation label is removed from the public page. The approved story and exact disclosure **Project illustration; not the live workbook.** are preserved. No workbook data, customer/order information, private links, invented results, quotes, metrics or payment implications are added.

## Approved assets and presentation

All nine Eastland composition derivatives remain byte-identical to `EASTLAND_SCREEN_REFRESH_APPROVED_RELEASE.md`. All four refreshed screens, devices, desk, lighting and important objects are preserved. The page uses a reversible CSS blend confined to the empty top/bottom image edges, capped at 8 CSS pixels, with the composition spanning the page width.

Missy’s original logo and laptop are extracted using an antialiased contour mask. No artwork was regenerated or redrawn. The headline **Built around her business** is live HTML in the existing typography. The required lossless transparent WebP is `assets/images/our-work/missy-artwork-extracted.webp`, 984 × 392, 128,640 bytes, SHA-256 `7c46fd3e8a18ce7fe7b845e66545871dc75790d4af213b9572ac44640b23e596`. It preserves source RGB for every opaque extracted pixel. Source, masters, masks and previous derivatives remain local and outside the published artifact.

Both pages use the same content-hash CSS query version; Missy’s image uses its approved asset hash prefix. These versions prevent stale local-review styles or images from being reused.

## Validation and publication boundary

Release checks: all eight npm test suites; the 47-file allowlisted public build; JavaScript syntax and whitespace checks; responsive image/loading, keyboard/mobile navigation, links, headings, contrast and protected-integration checks. The migration tests preserve approved Eastland hashes, illustration disclosure, internal destination/fragment validity and the public/private boundary.

Only required website source/assets, existing test updates and this non-private release record are included in the release commit. Local comparison pages, review screenshots, backups, extraction masters, supplied source JPEG, previous presentation derivatives and temporary scripts are excluded from both the release commit and public artifact. The existing unrelated allowlisted site assets/integrations remain intact.

Publication uses a pull request to protected `main`, requiring the `validate` check. Its merge runs the existing GitHub Pages test/build/deploy workflow. Production verification must confirm the workflow’s exact merge revision and live page/asset bytes, desktop/mobile navigation and responsive presentation before reporting completion. Verification evidence remains local under `docs/our-work-review/release/`.

Rollback should revert the bounded release through the same pull-request and Pages workflow, preserving any subsequent production changes; do not force-push or reset production.
