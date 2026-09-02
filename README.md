# Rogers Holdings LLC Website

The public website for Rogers Holdings LLC. The site positions Rogers Holdings as a business optimization partner for small and growing service businesses.

## Authoritative homepage production baseline

The human-approved and production-approved homepage baseline is commit `22efc3e` (`22efc3e6866af0c1544cb27918a45dce4b3eb79c`). Preserve that baseline unless a future scope explicitly authorizes a change. The final freeze record is `docs/design-source/HOMEPAGE_FINAL_PRODUCTION_BASELINE_22EFC3E.md`.

## Architecture

The production site is intentionally framework-free and is hosted through GitHub Pages.

- `index.html` contains the homepage content, metadata, and structured data.
- `business-snapshot/index.html` contains the client-facing intake experience.
- `privacy/index.html` contains the privacy policy used by the intake form.
- `assets/css/site.css` contains the shared responsive design system.
- `assets/js/site.js` contains lightweight navigation and analytics behavior.
- `CNAME` preserves the `rogersholdingsllc.com` custom domain.
- `robots.txt`, `sitemap.xml`, and the Google verification file support search visibility.

## Local preview

From the repository root, start any static file server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Protected integrations

- Google Analytics measurement ID: `G-MK4TVD3CYT`
- Google Search Console verification: `google914083dd95ef8b05.html`
- Production domain: `rogersholdingsllc.com`

Do not remove or replace these integrations during routine design work.

## Phase 1 relaunch

The Phase 1 homepage organizes the company's services beneath Business Optimization and includes:

- Problem recognition and business assessment positioning
- Assess, Prioritize, Improve methodology
- Five-step optimization process
- Outcome-oriented service categories
- Internal Business Optimization Platform introduction
- Eastland First Church of God case study
- Family-owned company positioning and direct contact paths

Homepage assessment CTAs lead to the Business Snapshot intake page.

## Naming standard v1.0

Production-facing language uses these customer journey terms:

`Free Business Snapshot` → `Executive Brief` → `Discovery Conversation` →
`Digital Business Assessment` → `Improvement Plan` →
`Implementation Services` → `Ongoing Optimization`

`Business Snapshot` is the product name. `Free Business Snapshot` and
`Get Your Free Business Snapshot` are the approved marketing offer and call to
action. `Website Audit Tool API` is internal-only and must not be presented as
the customer offer.

## Business Snapshot lead delivery

The approved production architecture uses an isolated Cloudflare Worker gateway
at the planned public custom domain `intake.rogersholdingsllc.com`. The gateway
validates the public request, enforces origin, rate-limit, honeypot, and
Turnstile controls, authenticates privately to the production receiver, and
returns a deliberately narrow public response.

The production website posts to
`https://intake.rogersholdingsllc.com/api/business-snapshot` with
`data-endpoint-configured="true"` and the approved public Turnstile site key.
The prepared-email path remains available when secure online delivery cannot be
completed, and the browser shows confirmation only after validating the narrow
production response contract.

Receiver endpoints, shared credentials, Turnstile secrets, deployment
credentials, account identifiers, and BOP configuration must remain outside
tracked website source.

### Form POST contract

The browser submits these fields:

| Field | Required | Contract |
| --- | --- | --- |
| `fullName` | Yes | Plain text, maximum 120 characters |
| `businessName` | Yes | Legitimate organization name, maximum 140 characters |
| `email` | Yes | Email address, maximum 254 characters |
| `phone` | No | Telephone number, maximum 30 characters |
| `website` | No | When provided, an absolute `http://` or `https://` URL, maximum 2048 characters |
| `primaryChallenge` | Yes | Plain text, 20–2000 characters |
| `consent` | Yes | Exact value `business-snapshot-contact-consent-v1` |
| `company` | No | Honeypot; must be empty. This is never the legitimate business name and is never stored for accepted submissions. |

An accepted public response must contain `ok: true`, `environment: production`,
the exact submitted `requestId`, and Boolean `retry`. No prospect identifier or
private receiver value is returned to the browser.

Future gateway, DNS, Turnstile, endpoint, or receiver changes require separate
production review. Rollback must preserve the current public contract and avoid
exposing receiver credentials or private response data.

## Business Snapshot release

This release preserves the Phase 1.5 homepage and adds:

- A dedicated Business Snapshot intake route
- Clear expectations about audience, review scope, deliverable, and follow-up
- Essential contact and business fields, optional phone and website, and plain-English consent
- Accessible client-side validation and honest success/error handling
- Direct email and phone paths for talking with Rogers Holdings
- A lead-form privacy policy
- Updated homepage assessment CTAs and sitemap entries

## Premium Business Snapshot experience

The premium experience branch preserves the established form contract and
delivery architecture while elevating the customer-facing Snapshot journey.
It adds executive offer positioning, mobile-first layouts, live completion
progress, polished inline validation, restrained motion, a contained submission
state, a confirmation experience with an optional review-conversation CTA, and
clearer privacy, timing, scope, and human-review reassurance.

## Internal utility security

Internal utilities must not be stored in this public GitHub Pages repository.

Owner follow-up checklist:

- Disable the existing Google Apps Script web app deployment.
- Review the connected Google Sheet for unexpected or unauthorized records.
- Move the utility to a private repository or rebuild it with authenticated Google Workspace access.
- If the tracker is retained, create a new deployment URL restricted to authorized users only.

## Phase 1.5 visual elevation

Phase 1.5 preserves the Business Optimization strategy and static architecture while refining the homepage into a more premium executive experience. The release includes:

- A stronger hero composition and more credible business-assessment interface
- Editorial diagnostic, methodology, services, case study, and company layouts
- A clearer internal Business Optimization Platform workflow visualization
- A concise “Why Rogers Holdings” principles section
- Lightweight entrance, reveal, progress, hover, navigation, and header motion
- Reduced-motion support and improved mobile navigation focus behavior

## Phase 3 homepage restructure

Phase 3 reorganizes the production homepage around the approved executive consultancy direction while preserving the Phase 2 foundation, protected metadata, analytics, and lead path. The release includes:

- A shorter, positioning-led hero with Business Snapshot as the primary action
- Editorial business-problem framing and a clearer Assess, Prioritize, Improve methodology
- A connected five-step implementation sequence
- Grouped capabilities across digital optimization, websites, Google Workspace, automation, AI, and operational consulting
- A restrained Business Optimization Platform presentation
- A stronger evidence-led Eastland case study
- Refined owner-led accountability, operating principles, final CTA, and footer sections
- Homepage-scoped responsive styling and asset versioning for reliable deployment

## Phase 3.6 material depth

Phase 3.6 preserves the approved homepage structure, content, typography, branding, and interaction model while adding a restrained CSS-only surface system. The pass differentiates warm paper, elevated light, executive dark, graphite technical, inset, and evidence surfaces; refines section rhythm, case-study framing, and the owner image; and keeps grain, gradients, shadows, and hover depth intentionally subtle and dependency-free.

## Phase 3.7 premium material art direction

Phase 3.7 strengthens the approved CSS-only material system so its archival paper, smoked graphite, executive black, brass, inset, and evidence surfaces remain visibly distinct at normal viewing distance. The pass adds controlled architectural lighting, clearer edge definition, deeper panel framing, a canonical brass treatment for primary Business Snapshot calls to action, and more deliberate Eastland and owner-image matting without changing homepage structure, copy, branding, dependencies, or interaction behavior.

## Laptop space-efficiency pass

The laptop space-efficiency pass preserves the approved Phase 3.7 visual direction while making the homepage hero content-driven and introducing a reusable responsive spacing scale for section rhythm, content relationships, panel rows, and composition gaps. It reduces unnecessary vertical space on common laptop screens without changing homepage copy, structure, typography sizes, material treatments, or mobile navigation behavior.

## Homepage compression pass 1

The first homepage compression pass consolidates recurring-friction positioning, the Assess/Prioritize/Improve working method, and the seven-term customer journey into one composition; tightens the six capability descriptions and internal Business Optimization Platform explanation; and combines owner-led accountability with four engagement principles. The approved Hero V2.1, Eastland presentation, conversion paths, navigation, and footer remain unchanged.

## Homepage compression pass 2

The second homepage compression pass preserves the approved information architecture and copy while recomposing the post-Eastland method and capabilities areas into denser editorial systems. The method introduction and three-step framework now share one aligned composition with a connected customer journey, while the six capabilities form a compact grouped matrix with responsive paired cards on mobile.

## Homepage repetition cleanup and visual differentiation

The repetition cleanup assigns each recurring idea to one clear section, turns the client journey into a responsive roadmap/stepper, distinguishes the continuous Assess–Prioritize–Improve method from that journey, groups six needs into three outcome bands, keeps founder accountability visually connected to the portrait, and tightens the final conversion section. The approved Hero V2.1, Eastland presentation, Business Snapshot experience, workflow visual, navigation, footer, metadata, analytics, and production integrations remain unchanged.

## Desktop owner presentation

The desktop owner section gives the framed landscape image greater presence in its left column and aligns it with the main headline, while preserving the approved presentation at tablet and mobile widths.

## Executive visual design system

The executive visual system turns the approved Executive Materials scene into a reusable component for reports, assessments, plans, process maps, dashboards, strategy sessions, and automation workspaces. Shared framing, material variants, responsive aspect ratios, captions, restrained elevation, reveal behavior, optional slow parallax, and reduced-motion support are documented in `docs/EXECUTIVE_VISUAL_SYSTEM.md`.

## Homepage premium trust and conversion refinement

This refinement preserves the approved homepage visual system while improving mobile navigation reliability, Business Snapshot clarity, methodology rhythm, capability grouping, platform positioning, and featured-project specificity. It also replaces the large executive-materials download with responsive AVIF, WebP, and JPEG sources while retaining lazy loading and fixed image dimensions.

## Business Snapshot hero reuse and conversion pass

The Business Snapshot page now reuses the approved responsive Homepage Hero V2.1 photography behind conversion-focused HTML copy, followed by a compact three-step Executive Brief process and the existing production form. The form contract, validation, consent, Turnstile, delivery behavior, analytics, navigation, footer, and metadata remain unchanged.

## Homepage conversion compression

This incremental homepage pass clarifies the hero’s business-optimization positioning and replaces the expanded customer journey with one compact Free Business Snapshot section placed before the Assess–Prioritize–Improve method. It preserves the established visual system, Eastland presentation, conversion routes, structured data, integrations, and dormant HEW source.

## Business Snapshot form clarity

This accessibility-focused copy pass clarifies required fields, email guidance, challenge guidance, and consent scope while preserving the established form structure and submission contract.

## Eastland live proof

This focused credibility pass adds an owner-authorized live-project proof block to the existing Eastland case study and replaces unsupported comparative-result language with an objective description of the current public website.

## Release checks

Before publishing a homepage change:

1. Check desktop and mobile layouts.
2. Test keyboard navigation, focus visibility, and the mobile menu.
3. Validate headings, links, image alternatives, and color contrast.
4. Confirm analytics, canonical metadata, social metadata, JSON-LD, favicons, and Search Console verification remain intact.
5. Verify email, telephone, and featured-project links.
6. Review Git status and the complete diff before committing.
