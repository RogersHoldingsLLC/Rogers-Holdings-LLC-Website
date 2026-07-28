# Rogers Holdings LLC Website

The public website for Rogers Holdings LLC. The site positions Rogers Holdings as a business optimization partner for small and growing service businesses.

## Architecture

The production site is intentionally framework-free and is hosted through GitHub Pages.

- `index.html` contains the homepage content, metadata, and structured data.
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

The Free Website Report workflow is not implemented yet. Report CTAs intentionally remain non-navigating placeholders until the secure intake flow is built.

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

## Release checks

Before publishing a homepage change:

1. Check desktop and mobile layouts.
2. Test keyboard navigation, focus visibility, and the mobile menu.
3. Validate headings, links, image alternatives, and color contrast.
4. Confirm analytics, canonical metadata, social metadata, JSON-LD, favicons, and Search Console verification remain intact.
5. Verify email, telephone, and featured-project links.
6. Review Git status and the complete diff before committing.
