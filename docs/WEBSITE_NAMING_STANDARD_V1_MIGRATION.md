# Website Naming Standard v1.0 migration

Date: 2026-08-07

## Release basis

- Reconciled branch: `release/business-snapshot-v1.0-rc1-naming-v1-reconciled`
- Production base: `82b16903d84a898b50d155233fa5d0761c68b97c`
- Approved naming-intent source: `d80a0519840fecfe6d2f91c96140f62cfe89294a`
- Reviewed intent commits: `3cfb9b7`, `d736a96`, and `d80a051`

This migration applies approved customer-facing language to the current
production website. It does not copy or cherry-pick the obsolete RC1
implementation. The current homepage, premium Business Snapshot experience,
live intake endpoint, Turnstile integration, observability, production gateway,
visual storytelling, Eastland case study, navigation, footer, brand assets,
stylesheet, and test architecture remain in place.

## Canonical customer journey

`Free Business Snapshot` → `Executive Brief` → `Discovery Conversation` →
`Digital Business Assessment` → `Improvement Plan` →
`Implementation Services` → `Ongoing Optimization`

`Business Snapshot` remains the product name. `Free Business Snapshot` is the
marketing offer, `Get Your Free Business Snapshot` is the primary call to
action, and `Executive Brief` is the first deliverable.

## Production-facing changes

- Updated homepage calls to action, structured data, customer-journey copy, and
  visual-proof labels without changing the approved layout or assets.
- Updated Business Snapshot metadata, offer copy, consent language, submission
  label, confirmation language, and Discovery Conversation action without
  changing form fields, endpoint configuration, Turnstile, or submission logic.
- Updated the privacy policy to distinguish the free offer from the Executive
  Brief and to cover operational metadata, sensitive-data exclusions, incident
  response, periodic deletion or de-identification, and separate marketing
  consent.
- Updated the sitemap dates for the pages changed by this release.

## Compatibility and internal identifiers

The `/business-snapshot/` route, `business-snapshot.v1` schema,
`business_snapshot` Turnstile action, consent value, data attributes, endpoint,
public Turnstile site key, payload fields, analytics event names, gateway
response contract, and operational monitoring behavior are unchanged.

`Website Audit Tool API` is internal-only and is not presented as a customer
offer. Generic language explaining that the Free Business Snapshot is not an
audit remains because it defines scope rather than naming an audit product.

## Superseded RC1 artifacts

The old placeholder environment file, disabled endpoint configuration, release
test, package scripts, manifests, validation report, and checksums were not
restored. Current-main frontend and gateway tests are the release authority.
