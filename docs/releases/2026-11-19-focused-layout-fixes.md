# Focused Services, Eastland and carousel fixes

Based on public main `06c9c9689d69d49d56eb90d3e4b49131573bad04`.

## Requested changes

- Keep the Services expanded-detail brass rule, but move it 12px left into the card gutter. Text alignment is unchanged and the rule does not intercept input.
- Increase the five actual service-name labels from 10px to 13px. Benefit headlines remain primary and all copy is unchanged.
- Send only the Eastland portfolio's “Visit the live church website” CTA to the canonical church homepage without the service-times fragment. The church site itself is unchanged.
- Enlarge only the active homepage carousel card to 1.045 times its original size. Preserve 3D placement, ring behavior, controls, focus and reduced-motion treatment.

## Verification

- Complete `npm test` passes, including route/privacy, intake mock-only contracts, keyboard/wrap VM, metadata and 14 paired responsive image contracts. `npm run build:public` builds 224 allowlisted files.
- Cloud Chrome rendered responsive QA at 320, 390, 768 and 1280px iframe widths (content widths 305, 375, 753 and 1265px with the browser scrollbar). All five open Services details retain 10px rule-to-text clearance; the rule stays 5px inside phone cards and 13px inside wider cards. No document horizontal overflow or detail/label text overflow. Labels remain 13px against 30px phone / 41.6px desktop benefit headlines.
- All five disclosures close with Enter and reopen with Space at 320px. Repeated desktop click close/open also passes. Screenshots inspected for phone and desktop line placement.
- Clicked the exact edited Eastland CTA in a fresh 390px frame: final URL `https://eastlandfirstchurchofgod.com/`, no fragment, document scrollTop 0 and the church's initial hero visible. This isolated frame had site scripts disabled; no physical iPhone/Safari test was performed.
- Carousel rendered at all four widths. Settled front-card margin to stage edge remains at least approximately 25px below and 34px horizontally on phone, exceeding the existing 7px outline plus offset. Previous/Next buttons remain 44px on phone and 52px at larger widths and inside the stage. All 28 paired images are loaded, with exactly one front card.
- Fifteen consecutive Next clicks traverse all fourteen projects and wrap; Previous, End, ArrowLeft, Home and ArrowRight select the correct cards. Keyboard Tab reaches the active card's 3px visible outline. Settled screenshots at 320, 390 and 1280px show sharp front imagery, populated rear cards and no front/focus clipping after rotation.
- QA-only harness and restrictive network CSP existed solely in ignored `_site/__qa/`; they are not part of tracked source or the public artifact. No forms were submitted and no performance-score claim is made.

## Scope and release

No shared assets, production endpoints, analytics, metadata, search files, church source, copy, customer data or BOP code changed. The ordinary pull-request checks and protected GitHub Pages release process still apply. This note does not imply publication. Rollback is the focused commit revert; no migrations or runtime state changes are involved.
