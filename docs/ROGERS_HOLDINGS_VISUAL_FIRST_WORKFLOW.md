# Rogers Holdings Visual-First Website Workflow

This is the default production workflow for premium Rogers Holdings website sections whose design depends on highly composed visual storytelling.

## Phase 1 — Design in ChatGPT

Design the composition visually in ChatGPT first when a section depends heavily on:

- photographic composition
- premium art direction
- branded environments
- device scenes
- portfolio presentations
- visual storytelling
- complex lighting
- intentionally arranged props
- highly specific aesthetic direction

Iterate visually until a human explicitly approves the result. Do not ask Codex to independently reinterpret or reproduce an already-approved image unless there is a specific technical reason and explicit authorization.

## Phase 2 — Authoritative visual lock

Once a visual is approved:

1. Save the exact approved image.
2. Give it an authoritative filename.
3. Store it in `docs/design-reference/`.
4. Record its SHA-256 checksum.
5. Treat that exact file as the visual source of truth.

The approved image is no longer merely a design reference. It may become the actual production visual asset.

## Phase 3 — Production preparation

Create optimized production derivatives from the exact authoritative source:

- AVIF
- WebP
- JPG fallback
- desktop
- tablet
- mobile

Use cropping and resizing only unless a different treatment is explicitly approved. Do not regenerate the composition, reconstruct its components, or approximate it with CSS or device mockups.

Record crop coordinates, output dimensions, derivative paths, and derivative checksums so the production lineage is auditable.

## Phase 4 — Functional HTML around the visual

Use real HTML for anything that must remain functional, accessible, searchable, structured, or interactive, including:

- navigation
- forms
- buttons
- links
- accessibility semantics
- SEO-critical copy
- structured content
- interactive controls

When baked visual labels correspond to real actions, align accessible HTML interaction targets carefully or provide another clean semantic implementation. Avoid visually duplicating baked content. Ensure keyboard focus, target sizing, security attributes, alternative text, and assistive-technology context remain valid.

## Phase 5 — Responsive design

Treat the desktop-approved composition as authoritative. Create intentional tablet and mobile crops from the same source when practical.

Do not regenerate an entirely different scene merely to satisfy smaller screens unless a human explicitly approves that exception. Preserve important content, avoid awkward crops, define intrinsic dimensions, and verify responsive source selection at representative widths.

## Phase 6 — Freeze

After human visual approval:

- record the authoritative source checksum
- record production derivative checksums
- create permanent freeze documentation
- test desktop, tablet, and mobile behavior
- validate accessibility, performance, links, overflow, broken images, and console output
- commit the exact approved state
- do not casually reopen the visual during unrelated website work

Any later visual change needs a newly authorized scope and a new approval baseline.

## When not to use this method

The image-first method must not replace normal HTML for:

- entire websites
- long-form text
- forms
- dynamic data
- frequently changing information
- navigation
- tables
- dashboards requiring interaction
- SEO-critical content that must exist as readable HTML
- accessibility-critical instructions
- content users need to select or copy
- highly dynamic personalized content

## Governing standard

**REAL HTML FOR FUNCTION.**

**AUTHORITATIVE IMAGERY FOR HIGHLY COMPOSED VISUAL STORYTELLING.**

Image-first production is a focused art-direction method, not a substitute for semantic, accessible, maintainable web development.
