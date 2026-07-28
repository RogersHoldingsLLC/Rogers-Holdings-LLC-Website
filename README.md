# Rogers Holdings LLC Website

The public website for Rogers Holdings LLC. The site positions Rogers Holdings as a business optimization partner for small and growing service businesses.

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

## Business Snapshot lead delivery

The Business Snapshot page includes client-facing context, accessible validation, explicit consent, spam-control fields, analytics events, and an honest configuration-error state. A lead-delivery service has not been configured, so the page currently directs a validated submission to the published email and phone contact paths instead of claiming it was delivered.

To connect delivery:

1. Create a Google Sheet whose header row uses this exact order: `submittedAt`, `firstName`, `lastName`, `businessName`, `email`, `phone`, `website`, `primaryChallenge`, `notes`, `consent`, `formStartedAt`, `company`.
2. Create and deploy a Google Apps Script web app with a `doPost(e)` handler. The form uses a normal browser `POST` (`application/x-www-form-urlencoded`) and may navigate to the HTML response returned by Apps Script.
3. Treat `submittedAt` as a server-generated timestamp. Accept the remaining fields from the POST body in the order documented below.
4. Perform authoritative required-field, length, email, phone, and URL validation in Apps Script. Browser validation improves usability but is not a security boundary.
5. Require `consent` to equal `business-snapshot-contact-consent-v1`; record that exact value when accepted.
6. Treat `company` as a honeypot spam-control field, not a business-name field. Legitimate submissions use `businessName` and must leave `company` empty.
7. Parse `formStartedAt` as an ISO 8601 UTC timestamp (for example, `2026-07-27T14:05:30.123Z`) and compare it with the server time as part of the spam checks.
8. Add rate limiting, safe logging, Sheet writes, and lead notifications. Return a branded confirmation page only after an accepted write; return an honest branded error page otherwise.
9. In `business-snapshot/index.html`, set the form `action` to the production HTTPS Google Apps Script `/exec` URL and change `data-endpoint-configured="false"` to `"true"`. Both values are required; the client guard prevents submission while either is missing or insecure.
10. Submit production test leads and confirm accepted writes, rejected invalid data, empty and populated honeypot behavior, timing checks, consent capture, notifications, and both confirmation and error response pages.

### Form POST contract

The browser submits these fields:

| Field | Required | Contract |
| --- | --- | --- |
| `firstName` | Yes | Plain text, maximum 80 characters |
| `lastName` | Yes | Plain text, maximum 80 characters |
| `businessName` | Yes | Legitimate organization name, maximum 140 characters |
| `email` | Yes | Email address, maximum 254 characters |
| `phone` | Yes | Telephone number, maximum 30 characters |
| `website` | Yes | Absolute `http://` or `https://` URL, maximum 2048 characters |
| `primaryChallenge` | Yes | Plain text, maximum 2000 characters |
| `notes` | No | Plain text, maximum 3000 characters |
| `consent` | Yes | Exact value `business-snapshot-contact-consent-v1` |
| `formStartedAt` | Yes | Client-generated ISO 8601 UTC timestamp set when the form initializes |
| `company` | No | Honeypot; must be empty. This is never the legitimate business name. |

`submittedAt` is intentionally not sent by the browser. Apps Script must generate it from the server time before writing the row.

## Business Snapshot release

This release preserves the Phase 1.5 homepage and adds:

- A dedicated Business Snapshot intake route
- Clear expectations about audience, review scope, deliverable, and follow-up
- Required contact and business fields, optional notes, and plain-English consent
- Accessible client-side validation and honest success/error handling
- Direct email and phone paths for talking with Rogers Holdings
- A lead-form privacy policy
- Updated homepage assessment CTAs and sitemap entries

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

## Release checks

Before publishing a homepage change:

1. Check desktop and mobile layouts.
2. Test keyboard navigation, focus visibility, and the mobile menu.
3. Validate headings, links, image alternatives, and color contrast.
4. Confirm analytics, canonical metadata, social metadata, JSON-LD, favicons, and Search Console verification remain intact.
5. Verify email, telephone, and featured-project links.
6. Review Git status and the complete diff before committing.
