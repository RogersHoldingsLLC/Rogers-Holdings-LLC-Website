# Homepage Compression + Founder Final Approved Freeze

## Approval and baseline

- Project: Rogers Holdings LLC public website
- Branch prepared: `improve/homepage-compression-visual-upgrade`
- Baseline commit: `99e085c`
- Approval: Homepage Compression Pass 2 and the authentic founder portrait treatment are human approved.
- Scope: Homepage compression, final composition polish, and replacement of the Owner-led Executive Materials presentation with the authoritative founder portrait.

## Frozen homepage architecture

1. Header/navigation
2. Hero V2.1
3. Four-problem friction strip
4. Eastland client proof
5. How Rogers Holdings Works
   - Assess / Prioritize / Improve working method
   - Five-milestone canonical customer journey
6. Capabilities
7. Business Optimization Platform
8. Owner-led founder section
9. Final CTA
10. Footer

The standalone recurring-friction section and standalone principles section remain retired. They must not be restored without a new approved architecture change.

## Measured compression

| Viewport | Baseline height | Final height | Reduction |
| --- | ---: | ---: | ---: |
| 1440×900 | 9,214px | 6,356px | 31.02% |
| 390×844 | 12,489px | 9,595px | 23.17% |

The final height includes the approved founder portrait treatment. Measurements were taken from the browser document element after all responsive images loaded.

## Frozen visual preservation checks

- Hero V2.1 markup SHA-256: `de11dc728aebdd01f69bdfd7ca514b1278ec2ea2c781fea5366dcd7f32ad0237`
- Eastland section markup SHA-256: `9cdb4b2d189f1d40c381add3ad26c202ef29dca98f3d3d94d194a43da92c05b5`
- Business Optimization Platform section markup SHA-256 at freeze: `1f4caec44d8e029a60101930b92263d0e154456f9803692c2922e347e80a545e`
- Final CTA section markup SHA-256 at freeze: `eed7f08e88f7d1612bfdce55a5162ac639483f5c279cb77ffef3de321e34d318`

Hero V2.1 and Eastland markup match the approved baseline byte-for-byte within their section boundaries. Their assets, geometry, copy, disclosure, responsive sources, evidence, links, and journey presentation remain protected.

## Founder portrait freeze

- Authoritative source: `docs/design-reference/founder/brian-keith-rogers-headshot-original.png`
- Source dimensions: 1122×1402
- Source file size: 2,268,128 bytes
- Source SHA-256: `9bb3f69903b49705abeb212f88bde0ad5200ee5cf60de289e2698a77c467c979`
- Identification: Brian Keith Rogers — Founder, Rogers Holdings LLC

Approved treatment:

- Use the real source photograph directly.
- Do not regenerate, retouch, stylize, filter, color-grade, or alter the person.
- Do not create a body or environment.
- Use a responsive 4:5 CSS frame with `object-fit: cover` and `object-position: 50% 42%`.
- Preserve the cream mat, restrained border, soft shadow, small gold corner rule, and editorial identification beneath the portrait.
- Keep the portrait first on tablet and mobile.
- Preserve all four approved Owner-led principles exactly.

## Canonical customer journey

The five visual milestones preserve all seven canonical terms:

1. Free Business Snapshot — Receive an Executive Brief.
2. Discovery Conversation — Discuss the findings.
3. Digital Business Assessment — Complete a deeper assessment when useful.
4. Improvement Plan — Guides Implementation Services.
5. Ongoing Optimization — Continue when useful.

`#approach` and `#process` remain separate deep-link targets. Assess / Prioritize / Improve remains the working method; the Customer Journey remains the commercial relationship path.

## Capabilities preservation

All six capabilities and all three groupings remain present:

- Visibility & Customer Experience: Digital Optimization; Websites
- Workflow & Information Systems: Google Workspace; Automation
- Operational Improvement: Responsible AI; Operational Consulting

## BOP and conversion preservation

- The dark Business Optimization Platform section remains the tonal break.
- Evidence, Findings, Priorities, and Implementation remain the internal workflow.
- The internal-use distinction and “not another platform to manage” clarification remain intact.
- The BOP Business Snapshot CTA remains intact.
- The final CTA retains the Free Business Snapshot, Executive Brief, email, and telephone conversion paths.

## Accessibility and browser results

- Exactly one homepage H1.
- Logical H2/H3/H4 hierarchy retained.
- Method and Customer Journey remain semantic ordered lists.
- Five journey milestones and six capabilities detected at every final QA viewport.
- Founder identification and all four principles visible at 1440×900, 768×1024, 390×844, and 320×568.
- No horizontal overflow, missing anchors, broken images, runtime exceptions, or failed asset requests at those viewports.
- Visible focus, reduced-motion behavior, external-link behavior, responsive navigation, and non-color meaning remain unchanged.

## Test results

- `npm test`: passed
- `node --check assets/js/site.js`: passed
- `git diff --check`: passed
- Business Snapshot homepage-external contract: unchanged
- Business Snapshot file SHA-256 before/final: `0dbc90b5a35321c94da20e64ceefbc5bb7b8f29dc1c7162b40dd9a2676b078ae`
- `assets/js/site.js` SHA-256 before/final: `332386545e19101beda15f3ac2ec9f271e0b5684dbbd0c6c72ab1d96d0e66330`

## Protected areas

Do not change as part of this release:

- Hero V2.1
- Eastland visual and evidence system
- Navigation design and behavior
- Final footer
- Business Snapshot page and form
- Production endpoint, Turnstile, analytics, Privacy, JavaScript, backend, or deployment configuration
- Founder identity or authoritative source pixels
- Existing Executive Materials assets, which remain available but are no longer used in the Owner-led section

## Exact proposed commit manifest

Production implementation and tests:

- `README.md`
- `index.html`
- `assets/css/site.css`
- `tests/homepage-premium-trust-conversion.test.js`
- `tests/sitewide-brand-assets.test.js`
- `tests/visual-storytelling.test.js`

Permanent source and freeze record:

- `docs/design-reference/founder/brian-keith-rogers-headshot-original.png`
- `docs/design-source/HOMEPAGE_COMPRESSION_FOUNDER_FINAL_APPROVED_FREEZE.md`

Final release evidence:

- `docs/homepage-compression-founder-final-1440.png`
- `docs/homepage-compression-founder-final-390.png`
- `docs/owner-led-executive-materials-vs-founder.png`

No Pass 1, intermediate Pass 2, or standalone responsive Owner-led proof screenshots are part of the proposed release manifest.
