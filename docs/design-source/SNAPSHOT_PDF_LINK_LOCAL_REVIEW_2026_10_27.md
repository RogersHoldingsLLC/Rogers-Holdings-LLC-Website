# Snapshot sample PDF link — local review, 2026-10-27

Brian requested that the fictional example open the actual PDF separately instead of expanding inline. This narrow revision starts at live/main `fcfe763f49e0d2987c02d1f367a20933425cd3fd`; publication is not authorized by the local-review request.

## Change

The readable HTML finding/recommendation and fictional disclosure stay in place. The full inline transcription is replaced by “View fictional sample brief (PDF)” with an external-link cue, visible “Opens in a new tab” text and an accessible description. The ordinary link uses `target="_blank" rel="noopener noreferrer"`; there is no popup script, automatic opening or download attribute. Browser preferences determine the new tab/window presentation.

The original source was not in the Pages allowlist. A byte-identical copy is added at `assets/samples/north-point-fitness-executive-brief.pdf`, increasing the public artifact from 76 to 77 files. Source remains `docs/design-reference/homepage-hero-v2.2/Executive Brief - North Point Fitness.pdf`. Both SHA-256 values are `08c20db2826dfb06cdbd5b52d5ec49e2915d072c90e8e746919f57089ea3a4cb`.

## Public suitability and fidelity

PDFKit inspection confirms one unencrypted page, no annotations, title “North Point Fitness - Executive Brief,” subject “Fictional website demonstration sample,” RH authorship and only the already approved fictional business/content plus public RH contact information. The document explicitly calls itself a fictional demonstration sample and uses `northpointfitness.example`. The raw PDF has no JavaScript, launch, embedded-file, form, annotation or automatic-action entries. Original bytes/content were not regenerated or edited.

## Validation

- All eight test suites pass; 77-file public build passes; `git diff --check` passes. No lint script is configured.
- Local HTTP PDF response is 200, `application/pdf`, 3,749 bytes, exact approved SHA-256, with no attachment Content-Disposition.
- Four real keyboard new-tab journeys at 1440×1000, 1366×768, 390×844 and 320×844 open the actual PDF viewer while retaining the original page URL and scroll position. The link has visible focus and a target at least 44px high. No homepage overflow or inline expansion remains. No POST requests.
- Actual page and PDF-tab screenshots inspected. The HTML excerpt remains readable on phones. The PDF is the unchanged fixed-layout original: desktop is legible at normal viewer zoom; phone fit-page views require normal viewer zoom for small body text. Native phone/Safari viewer behavior has not been physically tested.
- Normal-motion link remains static; reduced-motion screenshots checked. Pricing, services, other images, form/consent and integration scripts are unchanged. Owner primary checkout remains untouched.

Evidence is local, outside the public build: `../evidence/snapshot-pdf-link-20261027/` contains source inspection, HTTP PDF copy/hash, browser checks, screenshot views and test/build logs. Known Library transfer restrictions are not retried or bypassed. No push, merge, deployment or real intake submission occurs in this local review. Rollback baseline is `fcfe763f49e0d2987c02d1f367a20933425cd3fd`.
