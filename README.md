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
- `time-tracker/` is a separate internal utility and is outside the public homepage scope.

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

The Business Snapshot page includes client-facing context, accessible validation, consent, analytics events, and complete loading, success, configuration, and delivery-error states. A lead-delivery service has not been configured, so the page currently directs a validated submission to the published email and phone contact paths instead of claiming it was delivered.

To connect delivery:

1. Create a production HTTPS form endpoint that accepts `multipart/form-data` via `POST`.
2. The endpoint must accept these fields: `firstName`, `lastName`, `businessName`, `email`, `phone`, `website`, `primaryChallenge`, `notes`, and `consent`.
3. Protect the endpoint with server-side validation, spam controls, rate limiting, secure storage or email delivery, and appropriate logging. Do not rely on the browser validation alone.
4. Return any `2xx` response when the lead has been accepted. Return a non-`2xx` response when it has not.
5. Set the empty `action` attribute on the form marked `data-lead-form` in `business-snapshot/index.html` to that endpoint URL.
6. Submit a production test lead and confirm receipt, the success state, the failure path, consent capture, and any provider-domain or CORS requirements.

The browser sends an `Accept: application/json` header and displays the success state only after the endpoint returns a successful response.

## Business Snapshot release

This release preserves the Phase 1.5 homepage and adds:

- A dedicated Business Snapshot intake route
- Clear expectations about audience, review scope, deliverable, and follow-up
- Required contact and business fields, optional notes, and plain-English consent
- Accessible client-side validation and honest success/error handling
- Direct email and phone paths for talking with Rogers Holdings
- A lead-form privacy policy
- Updated homepage assessment CTAs and sitemap entries

## Phase 1.5 visual elevation

Phase 1.5 preserves the Business Optimization strategy and static architecture while refining the homepage into a more premium executive experience. The release includes:

- A stronger hero composition and more credible business-assessment interface
- Editorial diagnostic, methodology, services, case study, and company layouts
- A clearer internal Business Optimization Platform workflow visualization
- A concise “Why Rogers Holdings” principles section
- Lightweight entrance, reveal, progress, hover, navigation, and header motion
- Reduced-motion support and improved mobile navigation focus behavior

## Release checks

Before publishing a homepage change:

1. Check desktop and mobile layouts.
2. Test keyboard navigation, focus visibility, and the mobile menu.
3. Validate headings, links, image alternatives, and color contrast.
4. Confirm analytics, canonical metadata, social metadata, JSON-LD, favicons, and Search Console verification remain intact.
5. Verify email, telephone, and featured-project links.
6. Confirm `time-tracker/` remains unaffected.
7. Review Git status and the complete diff before committing.
