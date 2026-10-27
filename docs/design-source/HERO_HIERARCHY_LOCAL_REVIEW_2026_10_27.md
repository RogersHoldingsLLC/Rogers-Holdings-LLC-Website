# Hero hierarchy — local review, 2026-10-27

## Scope and wording freeze

Brian authorized the narrow hero placement/wrapping pass, then directed that all current wording remain verbatim while premium references are studied separately. This revision starts at live/main `13e5662edf4fac3178394afe538fabdb82fb8dad`. The optional founder trim was reverted before final validation; no wording changed.

- Headline: “Make the next improvement fit your business.”
- Service description: “Websites, spreadsheets, forms, business documents and local search foundations.”
- Founder: “I’m Brian Keith Rogers. I start by understanding your business and what you want to accomplish.”
- Actions remain “Talk with Brian” and “See Our Work,” with their original destinations.
- Eyebrow, reassurance, all other copy, offers, prices, links, logos and images remain unchanged.

## Placement and wrapping

The unchanged service paragraph now immediately follows the headline in the DOM and visual reading order. Desktop retains two columns; mobile reads headline → service description → compact sculpture → founder → actions. Native balanced wrapping removes the desktop “foundations.” orphan and balances the founder paragraph without hard line breaks. At 320px, only CTA padding/letter spacing is tightened; text remains 12px, labels stay on one line and targets remain 48px high.

Headline typography/three-line wraps, sculpture markup and geometry are unchanged. The desktop sculpture stays at its exact prior position. Phone artwork moves down to follow the service description but keeps its 176×154px figure (160×140px at 320px). Existing section heights and first-viewport actions/reassurance are preserved.

## Final actual rendering and checks

- Actual before/after screenshots inspected at 1440×1000, 1366×768, 390×844, 375×844 and 320×844. Service description begins about 74px earlier on desktop, 228px earlier at 390px and 238px earlier at 320px.
- Ten browser checks cover those five widths in reduced and normal motion. No overflow, one H1, no hard copy breaks, correct DOM/visual order, single-line CTA labels, minimum 48px targets, visible keyboard focus, and working contact/work navigation. Zero POST requests.
- Reduced artwork is static; normal-motion artwork is settled and pixel-stable in captures taken after 5.2 seconds. Sculpture script/assets are unchanged.
- All eight test suites and 77-file public build pass. No configured lint script; `git diff --check` passes.
- Preservation comparison proves homepage markup is unchanged after accounting for moving the exact service paragraph and updating the CSS cache version. Snapshot/PDF, services/pricing, intake/consent, integrations and owner primary checkout remain unchanged.

Evidence outside the public build: `../evidence/hero-hierarchy-local-20261027/` contains final desktop/mobile and settled normal-motion screenshots, `final-checks.json`, `render-observations.json`, preservation checks and logs. Before captures remain under `../evidence/hero-visual-review-20261027/`.

## Review gate and limits

Local review only. No push, merge, publication, generation, new listener, network/access change or real intake submission. Physical Safari and production form delivery remain untested. Known Library transfer restrictions are not retried or bypassed. Broader reference-inspired design is a separate proposal, with no implementation in this commit. Rollback baseline: `13e5662edf4fac3178394afe538fabdb82fb8dad`.
