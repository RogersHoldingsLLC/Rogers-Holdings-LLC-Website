# Rogers Holdings Homepage Final Production Baseline

> **AUTHORITATIVE RULE**
>
> **Do not redesign the homepage from scratch. Improve against the 22efc3e production baseline. Existing approved work must be preserved unless a future scope explicitly authorizes replacement.**

## Approval and authority

- Project: Rogers Holdings LLC public website
- Authoritative production commit: `22efc3e` (`22efc3e6866af0c1544cb27918a45dce4b3eb79c`)
- Production ref at freeze preparation: `origin/main` points to `22efc3e`
- Checked-out HEAD at freeze preparation: `22efc3e` on `audit/visual-message-repetition`
- Status: human approved, production approved, and visually approved
- Operation: documentation-only production baseline freeze
- Supersession: `22efc3e` supersedes all earlier homepage visual and message baselines and is authoritative.

No production HTML, CSS, JavaScript, asset, copy, layout, responsive behavior, Business Snapshot behavior, integration, analytics, metadata, deployment configuration, or backend behavior is changed by this freeze.

## Approved production history

1. `401c5c1` (`401c5c114648eed76b1e6028d587255293dc1b4e`) — Clarify homepage value messaging
2. `4ac6ed5` (`4ac6ed54d47b791d01ca6bfb3e31f3399dcbe01d`) — Refine homepage visual hierarchy and reduce repetition
3. `0f849ca` (`0f849ca859580774411ac3ea87a68971c867bb20`) — Align homepage section accent rules
4. `22efc3e` (`22efc3e6866af0c1544cb27918a45dce4b3eb79c`) — Polish homepage capability flows and accents

## Final approved homepage architecture and concept ownership

1. **Header/navigation** — site orientation and access to the approved routes and homepage sections.
2. **Hero V2.1** — plain-English positioning, primary business outcomes, approved photography, and the primary Business Snapshot conversion point.
3. **Four-problem recognition strip** — customer recognition of recurring business problems.
4. **Eastland First Church of God client proof** — authentic client evidence and the approved visual proof treatment.
5. **How Rogers Holdings Works** — the continuous Assess → Prioritize → Improve method Rogers Holdings uses to approach problems.
6. **What Happens Next** — the customer journey and what a prospect or client should expect when working with Rogers Holdings.
7. **How We Can Help** — specific customer problems grouped into Customer Growth, Time + Organization, and Direction + Technology.
8. **Business Optimization Platform** — continuity from evidence and findings through priorities and implementation; it is an internal operating system, not client SaaS.
9. **Owner-led founder/accountability section** — direct accountability, trust, plain-English reasoning, and owner-led delivery.
10. **Final Business Snapshot CTA** — the closing conversion promise and Free Business Snapshot starting point.
11. **Footer** — approved navigation, contact information, legal identification, and closing site structure.

Future work must avoid duplicating these responsibilities across sections. The Method and Customer Journey remain separate concepts: one explains Rogers Holdings' working approach; the other explains the client's engagement path.

## Approved visual systems

The following visual systems are frozen at `22efc3e`:

- Hero V2.1 photography, source selection, scrim, composition, and responsive treatment
- Four-problem strip
- Eastland visual proof and responsive evidence imagery
- Light Method directional system
- Dark Customer Journey roadmap and responsive stepper
- Three capability outcome bands
- Capability live-text directional flows
- Business Optimization Platform dark composition and workflow
- Founder portrait and accountability composition
- Compact final CTA
- Current gold editorial accent treatment
- Current desktop, tablet, and mobile behavior

### Final hotfix state

- Method and Capabilities gold editorial rules sit outside the headline columns.
- The approved desktop relationship is approximately 19px of horizontal rule-to-headline separation and approximately 20px of eyebrow-to-rule vertical separation.
- The responsive horizontal accent treatment is preserved at stacked breakpoints.
- Capabilities contain three desktop outcome bands with two needs per band.
- Capability directional flows are preserved and optimized for left-to-right reading on desktop and tablet.
- Mobile flow wrapping is allowed where needed for readability; horizontal overflow is not allowed.
- The authoritative founder portrait renders correctly. The earlier blank proof was a QA capture-state issue, not a production failure.

## Approved copy architecture

- Hero copy owns the concise positioning and primary outcomes.
- Problem-strip copy owns recognizable symptoms and does not attempt to explain the method or services.
- Eastland copy stays factual and evidence-led; it must not introduce unsupported performance claims.
- Method copy owns Assess, Prioritize, and Improve.
- Customer Journey copy owns the canonical engagement sequence: Free Business Snapshot, Executive Brief, Discovery Conversation, Digital Business Assessment, Improvement Plan, Implementation Services, and Ongoing Optimization.
- Capabilities copy owns the six recognizable customer needs and the practical service connections within the three outcome bands.
- Business Optimization Platform copy owns operational continuity and retains the clarification that Rogers Holdings manages the system so the client does not receive another platform to learn.
- Founder copy owns business-value-first judgment, plain-English guidance, delivery accountability, and long-term usefulness.
- Final CTA copy owns the concise closing promise, personalized Executive Brief, and approved contact alternatives.

Approved production copy must remain plain, credible, client-focused, and free of unsupported claims. A future copy change requires explicit scope and must preserve the ownership boundaries above.

## Responsive expectations

- Preserve the current breakpoint behavior and responsive image selection.
- Maintain the approved reading order and content hierarchy at desktop, tablet, and mobile widths.
- Keep the Method as a horizontal directional system where space permits and a coherent stacked system on mobile.
- Keep the Customer Journey as a horizontal roadmap on desktop and a vertical stepper at responsive breakpoints.
- Keep paired capability needs readable within their three outcome bands; wrap or stack only as the approved responsive system requires.
- Keep the founder portrait adjacent to its accountability content and before that content in narrow-screen reading order.
- Preserve the compact final CTA, usable navigation, legible live text, and all approved tap targets.
- No horizontal page overflow, clipped essential content, overlapping journey items, or collapsed directional meaning is acceptable.

## Accessibility expectations

- Preserve exactly one homepage `h1` and the logical heading hierarchy beneath it.
- Preserve the semantic ordered lists used for Method and Customer Journey.
- Preserve meaningful live text for capability flows and labeled relationships for capability bands.
- Preserve descriptive image alternative text, including founder and Eastland evidence imagery.
- Preserve the skip link, keyboard navigation, visible focus states, mobile-menu focus behavior, and meaningful link labels.
- Preserve reduced-motion behavior and do not make motion necessary to understand content.
- Maintain readable contrast and do not use the gold accents as the sole means of conveying meaning.
- Preserve the deep links `#approach`, `#process`, `#capabilities`, `#about`, and `#contact`.

## Protected areas

The following must not be casually modified and require a new explicit scope:

- Hero V2.1
- Four-problem strip
- Eastland client proof
- Method
- Customer Journey
- Capabilities
- Business Optimization Platform
- Founder section and portrait
- Final CTA
- Navigation and footer
- Business Snapshot page, form, endpoint, Turnstile, validation, consent, confirmation, privacy behavior, and delivery contract
- Production integrations and backend behavior
- `assets/js/site.js`
- Analytics, canonical metadata, social metadata, structured data, favicons, robots, sitemap, Search Console verification, and deployment configuration

Future work must improve against this baseline rather than restart the design.

## Preservation checks

Freeze-preparation checks establish the following exact baseline evidence:

- Initial working tree: clean (`git status --short` returned no paths before documentation edits).
- HEAD: `22efc3e6866af0c1544cb27918a45dce4b3eb79c`.
- `22efc3e` is an ancestor of the checked-out HEAD; in fact, it is the exact HEAD.
- `origin/main` points to `22efc3e` in the repository refs available during freeze preparation.
- Homepage `index.html` SHA-256: `86d675d674e6726c7719b48b6ceecea7a238a97f1ea680ba1daab47dc7330fef`.
- Shared stylesheet `assets/css/site.css` SHA-256: `488733bc07e4de5eaf67677684bfa4475edfca9d7c7b4f64dfc5b8384217d526`.
- `assets/js/site.js` SHA-256: `332386545e19101beda15f3ac2ec9f271e0b5684dbbd0c6c72ab1d96d0e66330`.
- Business Snapshot tree object: `c172d782603b1b41e11c280e80b071b56e9ae72f`.
- `business-snapshot/index.html` Git blob: `d99ab52e3d08f1cc667f79f3a808f961483e9b39`.
- `business-snapshot/index.html` SHA-256: `88a497fbd53b51b98e66cc077daf23d3ed2c04bb92404c5fd96a0fe8b347dc23`.
- Founder portrait Git blob: `e645ada63bf93df213bbe710887831c3017dcbf6`.
- Founder portrait SHA-256: `9bb3f69903b49705abeb212f88bde0ad5200ee5cf60de289e2698a77c467c979`.

The documentation-only freeze manifest must contain no change to any of these production or protected files.

## Final QA state

The `22efc3e` homepage is the human-approved, production-approved, visually approved final QA state. The accepted state includes:

- Approved architecture and concept ownership
- Approved gold accent geometry and responsive transformation
- Approved three-band capability layout and directional flows
- No horizontal overflow in the approved responsive evidence
- Correct founder portrait rendering; the historical blank capture is classified as a QA capture-state issue
- Preserved Business Snapshot, navigation, footer, integrations, analytics, metadata, and backend behavior

This freeze operation does not regenerate screenshots or reopen visual approval. Final repository verification for the documentation change consists of inspecting the complete diff, confirming the manifest is documentation-only, confirming protected hashes remain stable, and running `git diff --check`.

## Evidence references

### Final production and message evidence

- `docs/production-hotfix3-1440.png`
- `docs/production-hotfix3-capabilities-founder.png`
- `docs/plain-english-homepage-1440.png`
- `docs/plain-english-homepage-390.png`
- `docs/plain-english-homepage-before-vs-after.png`
- `docs/plain-english-homepage-scan-test.md`
- `docs/repetition-cleanup-1440.png`
- `docs/repetition-cleanup-768.png`
- `docs/repetition-cleanup-390.png`
- `docs/repetition-cleanup-before-vs-after.png`
- `docs/repetition-cleanup-copy-diff.md`

### Approved source and prior freeze records

- `docs/design-source/PLAIN_ENGLISH_VALUE_MESSAGING_FINAL_APPROVED_FREEZE.md`
- `docs/design-source/REPETITION_CLEANUP_VISUAL_DIFFERENTIATION_FINAL_APPROVED_FREEZE.md`
- `docs/design-source/HOMEPAGE_COMPRESSION_FOUNDER_FINAL_APPROVED_FREEZE.md`
- `docs/design-source/HOMEPAGE_HERO_V2_1_FINAL_APPROVED_FREEZE.md`
- `docs/design-source/EASTLAND_FINAL_APPROVED_FREEZE.md`
- `docs/design-source/BUSINESS_SNAPSHOT_HERO_REUSE_FINAL_APPROVED_FREEZE.md`
- `docs/design-reference/founder/brian-keith-rogers-headshot-original.png`
- `docs/design-source/homepage-hero-v2.1-FINAL-AUTHENTIC-MASTER.png`
- `docs/design-reference/eastland-client-work-FINAL-REFERENCE.png`

These references provide supporting history and evidence. Where any earlier freeze differs from this document, the `22efc3e` production state and this final freeze are authoritative.

## Rule for future homepage changes

**Do not redesign the homepage from scratch. Improve against the 22efc3e production baseline. Existing approved work must be preserved unless a future scope explicitly authorizes replacement.**

Any future homepage change must:

1. Begin from `22efc3e` or a descendant that demonstrably preserves it.
2. Identify the exact protected area and receive explicit scope for that change.
3. Preserve unaffected approved work and concept ownership.
4. Demonstrate an improvement against this baseline with proportional desktop and mobile QA.
5. Reconfirm accessibility, Business Snapshot, founder portrait, analytics, metadata, integrations, and backend preservation as applicable.
6. Establish a new reviewed baseline rather than silently revising this freeze.

## Exact documentation-only freeze manifest

- `README.md` — identifies `22efc3e` as the authoritative approved homepage production baseline.
- `docs/design-source/HOMEPAGE_FINAL_PRODUCTION_BASELINE_22EFC3E.md` — records the final production baseline and preservation contract.

No production file belongs in this manifest.
