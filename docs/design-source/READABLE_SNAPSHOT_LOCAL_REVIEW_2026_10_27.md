# Readable Snapshot sample — local review, 2026-10-27

## Scope and baseline

Brian approved building the improved Snapshot section for review after the live visual audit identified the angled document photograph as weak evidence. This branch starts at live/main `f682453b01745083deb813b7384b4fe8c28c35dd`. It is local review work only; publication requires a separate owner instruction.

## Visual change

The Snapshot now presents a front-facing cream/black/gold HTML Executive Brief excerpt instead of the angled desk photograph. The actual sample finding and recommendation are selectable, accessible text:

> The path from interest to membership is not obvious

> Add one clear Start Membership button to the main navigation and homepage hero. Link it directly to membership options so visitors can act without searching.

The visible “Fictional sample” label and full approved North Point Fitness disclosure remain connected to the brief. A native keyboard-accessible disclosure reveals the remaining sample content, including evidence, reasoning, verification method, limits and next step. No PDF download or new public artifact is introduced.

On phones, the sample follows the benefit statement, then the existing request action and grouped explanation. On desktop, the introduction/action sit beside the brief, with the three expectations below. Repeated generic deliverable rows are removed; their substance remains in the unchanged “What you receive” explanation. The unused photo preloads are removed. Original photographs and the approved source PDF are preserved unchanged.

## Source fidelity

The sample is transcribed from the existing approved fictional source, inspected as rendered pixels:

`docs/design-reference/homepage-hero-v2.2/Executive Brief - North Point Fitness.pdf`

SHA-256: `08c20db2826dfb06cdbd5b52d5ec49e2915d072c90e8e746919f57089ea3a4cb`.

This is a fictional demonstration, not customer evidence or measured results. No RH BOP records, customer data, generation or paid assets are used.

## Validation

- All eight existing test suites pass; the public build still contains 76 allowlisted files. No lint script exists; `git diff --check` passes.
- Actual final screenshots inspected at 1440×1000, 1366×768, 390×844 and 320×844; 375×844 is also checked.
- Ten browser journeys cover five widths in normal/reduced-motion modes: no overflow, static sample, visible keyboard focus, Enter/Space disclosure operation, request link and browser Back. Zero POST requests.
- Phone finding text is 24px; recommendation text is 16px. New text color pairs exceed 4.5:1 contrast (minimum 6.74:1).
- At 390px the sample starts 292px into the section, previously 799px. At 320px it starts 348px in, previously 954px. Desktop section height is 896px, previously about 958px. Readable text makes the total phone section slightly taller: 1564px at 390px and 1816px at 320px; the evidence and action arrive before the long explanation.
- Homepage content outside this section is byte-equivalent after accounting for the removed preloads and CSS cache version. Services, prices, other images, form/consent, scripts, metadata and contacts are unchanged. Owner primary checkout status, HEAD and tracked-diff hash still match the preserved reference.

Evidence is retained outside public source under `../evidence/snapshot-readable-20261027/`: final viewport screenshots, expanded/focused states, `responsive-interaction-checks.json`, `preservation-checks.json`, test/build logs. Before evidence remains in `../evidence/visual-review-20261027/`.

## Limits and review gate

Headless Chrome only; physical Safari is untested. No real request was submitted. Known Library transfer failure was not retried or bypassed; screenshots are local evidence, not Library attachments. No push, PR, merge or deployment is authorized by this local-review instruction. Rollback baseline is `f682453b01745083deb813b7384b4fe8c28c35dd`.
