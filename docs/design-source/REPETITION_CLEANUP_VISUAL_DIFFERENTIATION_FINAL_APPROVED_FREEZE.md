# Repetition Cleanup + Visual Differentiation Final Approved Freeze

## Approval and baseline

- Project: Rogers Holdings LLC public website
- Branch: `audit/visual-message-repetition`
- Baseline commit: `401c5c1` (`401c5c114648eed76b1e6028d587255293dc1b4e`)
- Status: The repetition cleanup, visual differentiation, responsive fixes, copy ownership cleanup, and section-eyebrow micro-polish are human approved.
- Scope: Homepage Method, Customer Journey, Capabilities, Business Optimization Platform support copy and CTA ownership, founder principles and responsive treatment, final CTA compression, supporting contract tests, release documentation, and final evidence.

No further design or copy changes are authorized unless required to fix a real QA defect.

## Final architecture and concept ownership

1. Header and navigation — route access and primary site orientation.
2. Hero V2.1 — primary positioning, business outcomes, and the first Business Snapshot conversion point.
3. Four-problem friction strip — recognizable operational symptoms.
4. Eastland — factual client proof and visual evidence.
5. Method — the continuous Assess → Prioritize → Improve working system Rogers Holdings uses.
6. Customer Journey — the commercial relationship path from Free Business Snapshot through Ongoing Optimization.
7. Capabilities — six customer-recognized needs grouped into three outcome bands.
8. Business Optimization Platform — continuity of evidence, findings, priorities, and implementation; explicitly internal, not client SaaS.
9. Founder — owner-led accountability and the principles governing recommendations and delivery.
10. Final CTA — the concise Business Snapshot promise plus direct email and telephone alternatives.
11. Footer — navigation, contact, and company identification.

The standalone recurring-friction and principles sections remain retired. The Method and Customer Journey remain separate concepts and separate deep-link targets.

## Exact copy deleted

### Method support

> We look at what isn’t working, decide what matters most, and help put a practical solution in place.

The Assess, Prioritize, and Improve nodes now own how Rogers Holdings works.

### Capabilities support

> Start with the problem you recognize. We’ll help connect it to a practical next step.

The six customer-need headings and three outcome bands now own problem recognition.

### Business Optimization Platform CTA

> Start With a Free Business Snapshot →

The hero and final CTA remain the two primary Business Snapshot conversion points.

## Exact copy rewritten

### Capability 06 support

Previous:

> Help identify the problem, decide what matters most, and figure out the right next step.

Final:

> Get an outside view of the operation when the source of the problem is unclear.

### Business Optimization Platform support

Previous:

> We use our own Business Optimization Platform to keep what we find, what matters, and what needs to happen next connected throughout the work.

Final:

> Our internal platform keeps evidence, findings, priorities, and implementation connected throughout the work.

### Founder principle 02 support

Previous:

> Know what matters, why it matters, and what to do next.

Final:

> Every recommendation comes with plain-English reasoning.

### Founder principle 03 support

Previous:

> Recommendations should lead to action.

Final:

> The same owner who recommends the work remains accountable for helping deliver it.

### Final CTA support

Previous:

> Tell us what isn’t working as well as it should. We’ll review your business and send you a personalized Executive Brief showing the clearest problems we see, what deserves attention first, and the practical next step we’d recommend.

Final:

> Describe what isn’t working. We’ll send a personalized Executive Brief with the clearest issue, first priority, and recommended next step.

## Customer Journey final treatment

- Desktop uses a dark five-milestone horizontal roadmap with a continuous champagne connector, distinct nodes, and compact milestone content.
- Tablet and mobile use a vertical stepper with a continuous left rail and aligned nodes.
- Executive Brief and Implementation Services are nested in visually distinct substage panels so they remain subordinate to their parent milestones.
- Browser geometry found no journey-item overlap at 1440×900, 768×1024, 390×844, or 320×568.
- The semantic ordered list, `#process` deep link, and all seven canonical terms remain present:
  1. Free Business Snapshot
  2. Executive Brief
  3. Discovery Conversation
  4. Digital Business Assessment
  5. Improvement Plan
  6. Implementation Services
  7. Ongoing Optimization

## Method final treatment

- Assess, Prioritize, and Improve form a continuous light directional system rather than a generic card grid.
- Desktop and tablet use a rounded horizontal sequence with directional chevrons.
- Mobile stacks the three nodes in one rounded system with directional connectors and compact numbered alignment.
- The Method remains visually distinct from the dark Customer Journey at every tested viewport.
- The semantic ordered list and `#approach` deep link remain intact.

## Capabilities final treatment

The six customer needs are grouped into three semantic outcome bands:

1. **Customer growth** — “I need more customers” and “My website isn’t doing its job.”
2. **Time + organization** — “I’m wasting too much time” and “My business is disorganized.”
3. **Direction + technology** — “I want to use AI, but I don’t know where it actually helps” and “I know something isn’t working, but I’m not sure what.”

Each band contains a live heading relationship. Paired cards remain side by side where space permits and stack into one-column bands on mobile. All six live HTML/CSS flow explanations and service labels remain present.

## Business Optimization Platform final treatment

- The dark tonal break and existing Evidence → Findings → Priorities → Implementation workflow remain unchanged.
- Support copy now owns internal continuity in direct operational language.
- The client clarification remains: “We manage the system. You get clear recommendations and next steps—not another platform to learn.”
- The duplicate Business Snapshot CTA is removed so BOP no longer competes with the hero and final conversion section.

## Founder final treatment

- Desktop preserves the approved two-column portrait-and-copy composition.
- At 768px, the portrait and copy remain side by side with a 38.39px measured gap, keeping the identity and accountability message connected.
- At 390px and 320px, the portrait remains immediately before the copy with a 26px measured vertical gap.
- The principles use a compact editorial list rather than a separate card grid.
- Principle 02 now owns plain-English explanation; principle 03 now owns personal delivery accountability.

## Final CTA treatment

- The final Business Snapshot promise is shortened without changing the offer, Executive Brief deliverable, CTA, reassurance, email, or telephone paths.
- Homepage-scoped padding and headline sizing keep the section compact.
- Measured section height changed from 604.75px to 504.44px at 1440, 804.72px to 709.61px at 768, 834.94px to 673.44px at 390, and 887.97px to 732.25px at 320.

## Section-eyebrow micro-polish

Approved desktop rule:

```css
.phase3-method .phase3-editorial-header > div,
.phase3-capabilities .phase3-editorial-header > div { padding-left: 14px; }
```

Approved stacked-breakpoint rule:

```css
.phase3-method .phase3-editorial-header > div,
.phase3-capabilities .phase3-editorial-header > div { padding-left: 0; }
```

At 1440px, Method and Capabilities both have a measured 14px separation between the 1px × 72px vertical gold rule and their eyebrow content. At 768px, 390px, and 320px, the accent becomes a 72px × 1px horizontal rule and the horizontal inset resets to zero.

## Frozen preservation

### Hero V2.1

- Hero section markup is byte-identical to baseline `401c5c1`.
- Baseline/final section SHA-256: `37bae73e5f6d4d309048cc3d4005acc0531c63906edfc5357b2c02f9c400c812`.
- Browser QA selected the same approved desktop, tablet, and mobile V2.1 AVIF derivatives at their respective breakpoints.
- Copy, photography, source ordering, disclosure, geometry, scrim, CTAs, and responsive behavior remain unchanged.

### Eastland

- Eastland section markup is byte-identical to baseline `401c5c1`.
- Baseline/final section SHA-256: `9cdb4b2d189f1d40c381add3ad26c202ef29dca98f3d3d94d194a43da92c05b5`.
- Browser QA selected the same approved desktop, tablet, and mobile Eastland AVIF derivatives at their respective breakpoints.
- Visual presentation, factual evidence, live links, accessibility text, and responsive derivatives remain unchanged.

### Business Snapshot

- `business-snapshot/index.html` is unchanged from baseline.
- SHA-256: `88a497fbd53b51b98e66cc077daf23d3ed2c04bb92404c5fd96a0fe8b347dc23`.
- Form, endpoint, Turnstile, confirmation, privacy behavior, photography, responsive hero, and CTA behavior remain protected.
- `assets/js/site.js` is unchanged with SHA-256 `332386545e19101beda15f3ac2ec9f271e0b5684dbbd0c6c72ab1d96d0e66330`.

### Founder portrait

- Source: `docs/design-reference/founder/brian-keith-rogers-headshot-original.png`
- SHA-256: `9bb3f69903b49705abeb212f88bde0ad5200ee5cf60de289e2698a77c467c979`
- Source pixels, identification, 4:5 frame, object fit, object position, mat, border, shadow, and corner rule remain unchanged.

## Page heights

Measurements use `document.documentElement.scrollHeight` after fonts, responsive content, and lazy images load under identical headless-Chrome conditions.

| Viewport | Baseline `401c5c1` | Final approved | Change |
| --- | ---: | ---: | ---: |
| 1440×900 | 6,672px | 6,719px | +47px / +0.70% |
| 768×1024 | 8,577px | 8,127px | −450px / −5.25% |
| 390×844 | 9,988px | 9,585px | −403px / −4.03% |
| 320×568 | 10,418px | 10,066px | −352px / −3.38% |

The small desktop increase supports the differentiated Method/Journey treatments. Every stacked layout is shorter than baseline.

## Accessibility and browser results

- Exactly one homepage H1 at every tested viewport.
- Logical H1/H2/H3/H4 hierarchy preserved; capability band headings introduce their H4 need headings.
- Method and Customer Journey remain semantic ordered lists.
- Capability bands use labeled semantic sections.
- All seven canonical journey terms and all six customer-need headings remain meaningful live text.
- `#approach`, `#process`, `#capabilities`, `#about`, and `#contact` resolve at every viewport.
- Existing visible-focus, reduced-motion, external-link, and mobile-navigation behavior remain unchanged.
- Method and Capabilities eyebrow accents do not collide with their labels.
- Journey milestone boxes do not overlap.
- Founder portrait and copy remain adjacent in responsive reading order.
- No horizontal overflow at 1440×900, 768×1024, 390×844, or 320×568.
- No broken images, failed requests, browser error overlays, console errors, or runtime exceptions at any tested viewport.

## Test results

- `npm test`: passed all five suites.
- `node --check assets/js/site.js`: passed.
- `git diff --check`: passed.
- Browser QA: passed at 1440×900, 768×1024, 390×844, and 320×568.

## Protected areas

Do not change without separate human approval:

- All final copy and concept ownership recorded in this freeze
- Hero V2.1 imagery, markup, geometry, disclosure, source selection, CTAs, and responsive behavior
- Eastland visual treatment, factual evidence, links, accessibility text, and responsive derivatives
- Business Snapshot page, form, endpoint, Turnstile, confirmation, privacy behavior, photography, and CTA behavior
- Founder portrait source pixels, identity, and approved visual treatment
- Method directional system and separate Customer Journey roadmap/stepper
- Three Capabilities outcome bands and their six live flow explanations
- Business Optimization Platform workflow and internal-use clarification
- Navigation design and behavior
- Footer
- `assets/js/site.js`
- Analytics, canonical metadata, social metadata, structured data, favicons, robots, sitemap, search verification, and deployment configuration

## Release classification

### A. Required production change

- `assets/css/site.css`
- `index.html`
- `tests/homepage-premium-trust-conversion.test.js`

### B. Required freeze/documentation

- `README.md`
- `docs/design-source/REPETITION_CLEANUP_VISUAL_DIFFERENTIATION_FINAL_APPROVED_FREEZE.md`

### C. Required final evidence

- `docs/repetition-cleanup-1440.png`
- `docs/repetition-cleanup-768.png`
- `docs/repetition-cleanup-390.png`
- `docs/repetition-cleanup-before-vs-after.png`
- `docs/repetition-cleanup-copy-diff.md`

### D. Intermediate/exclude

- None in the repository worktree.
- Temporary browser profiles, comparison sources, QA scripts, and the extracted baseline remain outside the repository under `/tmp` and are not part of the proposed commit.

## Exact proposed commit manifest

```text
README.md
assets/css/site.css
docs/design-source/REPETITION_CLEANUP_VISUAL_DIFFERENTIATION_FINAL_APPROVED_FREEZE.md
docs/repetition-cleanup-1440.png
docs/repetition-cleanup-390.png
docs/repetition-cleanup-768.png
docs/repetition-cleanup-before-vs-after.png
docs/repetition-cleanup-copy-diff.md
index.html
tests/homepage-premium-trust-conversion.test.js
```

No commit, push, merge, deployment, or repository-file deletion is authorized by this freeze preparation.
