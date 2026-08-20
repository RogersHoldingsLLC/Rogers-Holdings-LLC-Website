# Technical Growth Structured Data Check

Audit date: 2026-08-20

## Baseline inventory

The homepage contained one valid JSON-LD `@graph` with:

- `Organization` — Rogers Holdings LLC identity, URL, logo, brand image, email, telephone, Kentucky/United States area, partial region/country address, contact point, and topics;
- `WebSite` — publisher relationship to the organization;
- `WebPage` — homepage relationship to the website and organization;
- `Service` — provider relationship, area served, customer journey/service types, and description;
- `CreativeWork` — Eastland First Church of God website project and creator relationship.

The baseline had no explicit `legalName`, brand-name alias, organization description, or founder relationship. The logo pointed to a separate root-level logo file instead of the logo asset used in visible site chrome. Some topic/service labels were older than the approved public capability wording.

## Improvements

- Preserved one canonical Organization `@id`: `https://rogersholdingsllc.com/#organization`.
- Added verified `legalName` (`Rogers Holdings LLC`) and `alternateName` (`Rogers Holdings`).
- Added the approved plain-English homepage positioning as the Organization description.
- Made the Organization and WebPage descriptions consistent with the approved homepage meta description.
- Changed the logo ImageObject to the visible 160×160 normal logo asset at an absolute production URL and supplied its dimensions/content URL.
- Added a Person node for Brian Keith Rogers with the verified Founder title.
- Connected Organization `founder` to the Person and Person `worksFor` back to the Organization.
- Aligned `knowsAbout` and service types to the approved public capability language: business/digital optimization, websites, Google Workspace, workflow automation, artificial intelligence, and operational consulting, while preserving the approved customer-journey terms.
- Kept the Website, WebPage, Service, and Eastland CreativeWork relationships intact.

## Verified facts used

- Legal name: Rogers Holdings LLC.
- Public brand name: Rogers Holdings.
- Production URL: `https://rogersholdingsllc.com/`.
- Logo: tracked visible Rogers Holdings logo asset.
- Founder: Brian Keith Rogers; title: Founder.
- Public email: `briankeith@rogersholdingsllc.com`.
- Public telephone: `+1-859-404-7300` / visible `859-404-7300`.
- Kentucky-based and serving businesses across the United States.
- Family-owned, family-operated, and privately held wording remains visible, but no nonstandard ownership schema claim was added.
- Approved Business Snapshot journey and current public capability descriptions.
- Eastland project details already present in visible production content.

## Deliberately omitted

No street address, locality, postal code, founding date, employee count, reviews, ratings, prices, social profiles, certifications, awards, unsupported service locations, unsupported business category, or rich-result markup was added. No `sameAs` links were added because no authoritative social-profile URLs exist in the approved sources reviewed.

## Validation

- JSON parses successfully in the contract test and the rendered browser.
- All identity and relationship URLs are absolute.
- Organization, Website, WebPage, Service, Person, and CreativeWork nodes use coherent IDs and references without a duplicate organization.
