# Business Snapshot Hero Reuse — Final Approved Freeze

## Approval and baseline

- Status: Human approved and frozen for release preparation
- Baseline commit: `2e08516`
- Working branch: `improve/business-snapshot-hero-reuse`
- Scope: Business Snapshot hero reuse, conversion consolidation, responsive behavior, and release evidence
- Further design changes require a separately identified QA defect or new human approval.

## Final page architecture

1. Protected header and navigation
2. Business Snapshot photographic hero
   - Approved responsive Homepage Hero V2.1 photography
   - Page-specific HTML copy
   - Primary CTA to `#snapshot-form`
   - Secondary CTA to `#snapshot-deliverable`
   - Complimentary, human-review, and timing reassurance
   - Owner-review credibility
3. Compact three-step deliverable/process block at `#snapshot-deliverable`
   - Tell us the constraint
   - We review the evidence
   - Receive your Executive Brief
   - Focused-review scope note
4. Existing production Business Snapshot form at `#snapshot-form`
   - Progress indicator
   - Existing fields and field order
   - Existing validation, consent, honeypot, and Turnstile
   - Existing direct-contact fallback and success/error behavior
   - Existing optional Discovery Conversation follow-up
5. Protected footer

## Exact approved hero copy

**Eyebrow**

> FREE BUSINESS SNAPSHOT

**H1**

> Know what deserves attention first.

**Supporting copy**

> Tell us what is not working as well as it should. Rogers Holdings reviews the challenge and visible evidence, then sends you a concise Executive Brief with the clearest priorities and a practical next step.

**Primary CTA**

> START YOUR FREE BUSINESS SNAPSHOT

Target: `#snapshot-form`

**Secondary CTA**

> SEE WHAT YOU RECEIVE

Target: `#snapshot-deliverable`

**Reassurance**

- Complimentary
- Human-reviewed
- Typically within three business days

**Owner credibility**

> Reviewed by a business owner—not an algorithm.

## Hero V2.1 asset reuse

The Business Snapshot hero directly references the approved responsive files already stored under `assets/images/homepage/`:

- `homepage-hero-v2.1-desktop.avif`, `.webp`, and `.jpg`
- `homepage-hero-v2.1-tablet.avif`, `.webp`, and `.jpg`
- `homepage-hero-v2.1-mobile.avif`, `.webp`, and `.jpg`

No source asset was copied, renamed, regenerated, recolored, recropped, reconstructed, or modified. Baseline and current SHA-256 values match for all nine files.

## Approved responsive behavior

### Desktop — 1440 × 900

- Selects `homepage-hero-v2.1-desktop.avif` in the verified browser.
- Approved photographic composition, geometry, copy, and CTA hierarchy are locked.
- Hero bottom measured at `874.17px`.
- No horizontal overflow, broken images, failed requests, or browser console errors.

### Tablet — 768 × 1024

- Selects `homepage-hero-v2.1-tablet.avif` in the verified browser.
- Preserves the approved full-bleed photographic treatment.
- Hero bottom measured at `786.06px`.
- No horizontal overflow, broken images, failed requests, or browser console errors.

### Mobile — 390 × 844

- Selects `homepage-hero-v2.1-mobile.avif` in the verified browser.
- Presents a clean dark text-safe region before the photograph.
- Photograph starts at `738.97px` from the document top.
- Owner-review block ends at `710.97px`.
- Text/photo separation is exactly `28px`.
- The Executive Brief becomes recognizable as photography begins.
- No text/image overlap, horizontal overflow, broken images, failed requests, or browser console errors.

### Mobile — 320 × 568

- Selects `homepage-hero-v2.1-mobile.avif` in the verified browser.
- Preserves the approved content order and clean text-safe region.
- Photograph starts at `750.98px` from the document top.
- Owner-review block ends at `722.98px`.
- Text/photo separation is exactly `28px`.
- The photograph and Executive Brief remain recognizable upon scrolling to the photographic region.
- No text/image overlap, horizontal overflow, broken images, failed requests, or browser console errors.

## Form preservation

The complete `<form>` block is byte-identical to baseline `2e08516`.

Baseline and current form SHA-256:

`de775576080c1be45d27ebf52921c5dba29fc4fc1c335078594d61f5cf4a90ae`

The production field sequence remains:

1. `fullName`
2. `businessName`
3. `email`
4. `phone`
5. `website`
6. `primaryChallenge`
7. `consent`
8. `company` honeypot

The browser-created `cf-turnstile-response` field remains managed by Turnstile and is not an authored contract change.

## `site.js` preservation

`assets/js/site.js` is byte-identical to baseline `2e08516`.

Baseline and current SHA-256:

`332386545e19101beda15f3ac2ec9f271e0b5684dbbd0c6c72ab1d96d0e66330`

## Endpoint and Turnstile preservation

- Form endpoint: `https://intake.rogersholdingsllc.com/api/business-snapshot`
- `data-endpoint-configured="true"`
- Turnstile site key: `0x4AAAAAAEFhF9RRNG4A4T1Q`
- Turnstile action: `business_snapshot`
- Existing success, error, expired, and timeout callbacks remain present.
- Receiver, BOP, credentials, and deployment configuration were not changed.

## Accessibility and functional results

- Exactly one H1 at all four tested viewports.
- Logical heading hierarchy retained.
- Deliverable steps use a semantic ordered list.
- Primary and secondary anchors resolve to existing targets.
- Privacy link resolves successfully with HTTP 200 in local QA.
- New CTA targets retain at least 44px height.
- Existing visible-focus and reduced-motion behavior remains intact.
- Mobile text and photography do not overlap.
- No horizontal overflow at 1440, 768, 390, or 320 pixels.

## Final test results

- `npm test`: passed all five suites
  - Business Snapshot frontend contract
  - Homepage premium trust and conversion contract
  - Sitewide brand-asset contract
  - Visual storytelling contract
  - Whole-site refinement contract
- `node --check assets/js/site.js`: passed
- `git diff --check`: passed
- Browser QA at 1440 × 900, 768 × 1024, 390 × 844, and 320 × 568: passed
- Broken images: none
- Failed requests: none
- Browser console errors: none
- Privacy response: HTTP 200

## Protected areas

The following remain protected and unchanged:

- Production endpoint and receiver contract
- Form fields, field order, validation, consent, and honeypot
- Turnstile configuration and callbacks
- BOP
- `assets/js/site.js` production behavior
- Privacy page and consent language
- Analytics and metadata
- Navigation and footer
- Homepage and Eastland work
- Homepage Hero V2.1 source assets
- Deployment configuration

## Release-file classification

### A. Required production change

- `business-snapshot/index.html`
- `assets/css/site.css`

### B. Required freeze/documentation

- `README.md`
- `docs/design-source/BUSINESS_SNAPSHOT_HERO_REUSE_FINAL_APPROVED_FREEZE.md`

### C. Required final release evidence

- `docs/business-snapshot-hero-reuse-1440.png`
- `docs/business-snapshot-mobile-final-390.png`
- `docs/business-snapshot-mobile-final-320.png`
- `docs/business-snapshot-mobile-before-vs-final.png`

### D. Temporary/intermediate evidence — exclude from the final commit

- `docs/business-snapshot-hero-reuse-390.png`
- `docs/business-snapshot-before-vs-after.png`

These files remain in the worktree pending explicit cleanup authorization.

## Exact proposed commit manifest

```text
README.md
assets/css/site.css
business-snapshot/index.html
docs/design-source/BUSINESS_SNAPSHOT_HERO_REUSE_FINAL_APPROVED_FREEZE.md
docs/business-snapshot-hero-reuse-1440.png
docs/business-snapshot-mobile-before-vs-final.png
docs/business-snapshot-mobile-final-320.png
docs/business-snapshot-mobile-final-390.png
```

No commit, push, merge, deployment, or file deletion is authorized by this freeze preparation.
