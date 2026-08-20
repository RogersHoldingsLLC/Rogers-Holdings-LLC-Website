# Search Visibility Launch Checklist

Owner checklist for the Rogers Holdings LLC production site.

## Production URLs

- Property/domain: `rogersholdingsllc.com`
- Homepage: `https://rogersholdingsllc.com/`
- Business Snapshot: `https://rogersholdingsllc.com/business-snapshot/`
- Privacy: `https://rogersholdingsllc.com/privacy/`
- Sitemap: `https://rogersholdingsllc.com/sitemap.xml`
- Robots: `https://rogersholdingsllc.com/robots.txt`

Do not mark an item complete until the action has actually been performed in Google Search Console. Record the date, account owner, result, and follow-up in the action log.

## 1. Verify the Search Console property

- Add or open the Domain property for `rogersholdingsllc.com`.
- Complete DNS verification if the Domain property is not already verified.
- Confirm the verified property covers both `http`/`https` and all host variants.
- Confirm the existing Google verification file remains reachable at `https://rogersholdingsllc.com/google914083dd95ef8b05.html`; do not remove it even if DNS verification is used.

## 2. Submit the sitemap

- Open **Indexing → Sitemaps**.
- Submit `https://rogersholdingsllc.com/sitemap.xml`.
- Confirm Search Console reports that the sitemap can be read.
- Confirm the discovered URL count includes exactly the three intended canonical pages listed above.

## 3–5. Inspect every canonical page

Use **URL inspection** for each exact URL:

1. `https://rogersholdingsllc.com/`
2. `https://rogersholdingsllc.com/business-snapshot/`
3. `https://rogersholdingsllc.com/privacy/`

For each URL:

- Confirm the URL is available to Google.
- Open the tested page or live test.
- Review the page-fetch result and screenshot.
- Confirm the declared canonical exactly matches the inspected URL.
- Confirm the page is not blocked by `robots.txt` and does not contain `noindex`.

## 6. Request indexing

- Run **Test live URL** first.
- Resolve fetch, canonical, structured-data, or mobile-rendering errors before requesting indexing.
- Select **Request indexing** once for each changed canonical URL.
- Do not repeatedly request indexing; record the request date and wait for Search Console to process it.

## 7. Check rendered HTML

For the homepage, confirm the rendered HTML includes:

- the current title and plain-English meta description;
- canonical `https://rogersholdingsllc.com/`;
- one valid JSON-LD graph with the Rogers Holdings LLC organization, website, webpage, service, founder, and Eastland project entities;
- no `Executive Snapshot` metadata.

For Business Snapshot, confirm the rendered HTML includes:

- canonical `https://rogersholdingsllc.com/business-snapshot/`;
- the configured production form action;
- no visible or announced fallback message during normal operation;
- no “endpoint is not connected” wording in source or rendered content.

For Privacy, confirm the rendered HTML includes canonical `https://rogersholdingsllc.com/privacy/` and the current Privacy title and description.

## 8. Check canonical selection

For each URL inspection result, compare:

- **User-declared canonical**; and
- **Google-selected canonical**.

They should be the same exact HTTPS URL with the trailing slash shown above. Investigate redirects, duplicate URLs, or alternate hostnames if Google selects a different canonical.

## 9. Review indexing status

- Open **Indexing → Pages** after Google has processed the sitemap.
- Confirm all three canonical URLs are indexed or queued without blocking errors.
- Review “Crawled — currently not indexed,” “Duplicate,” redirect, soft-404, and blocked-resource groups.
- Export or record any affected URL before remediation.

## 10. Monitor search queries

In **Performance → Search results**, review:

- branded queries such as `Rogers Holdings LLC`, `Rogers Holdings Kentucky`, and `Brian Keith Rogers Rogers Holdings`;
- non-branded themes that accurately match the site, such as small-business optimization, workflow automation, business websites, Google Workspace organization, and practical AI help;
- clicks, impressions, click-through rate, and average position by page and query;
- unexpected queries that could indicate confusion with an unrelated company named Rogers Holdings.

Use comparisons over 28-day and 3-month periods. Do not treat rankings as guaranteed outcomes.

## 11. Check mobile usability and Core Web Vitals

- Review the HTTPS/Core Web Vitals reports for mobile and desktop.
- Test each canonical URL with the mobile live-test screenshot.
- Check for horizontal overflow, unreadable text, clipped controls, interaction delay, layout shift, and failed images.
- Record affected URL groups and validate fixes before closing them.

## 12. Action log

| Action | Exact URL/property | Owner | Date | Result | Follow-up |
| --- | --- | --- | --- | --- | --- |
| Property verification | `rogersholdingsllc.com` |  |  | Not yet recorded |  |
| Sitemap submission | `https://rogersholdingsllc.com/sitemap.xml` |  |  | Not yet recorded |  |
| Homepage inspection | `https://rogersholdingsllc.com/` |  |  | Not yet recorded |  |
| Homepage indexing request | `https://rogersholdingsllc.com/` |  |  | Not yet recorded |  |
| Business Snapshot inspection | `https://rogersholdingsllc.com/business-snapshot/` |  |  | Not yet recorded |  |
| Business Snapshot indexing request | `https://rogersholdingsllc.com/business-snapshot/` |  |  | Not yet recorded |  |
| Privacy inspection | `https://rogersholdingsllc.com/privacy/` |  |  | Not yet recorded |  |
| Privacy indexing request | `https://rogersholdingsllc.com/privacy/` |  |  | Not yet recorded |  |
| Rendered HTML review | All three canonical URLs |  |  | Not yet recorded |  |
| Canonical selection review | All three canonical URLs |  |  | Not yet recorded |  |
| Indexing-status review | Domain property |  |  | Not yet recorded |  |
| Query-performance review | Domain property |  |  | Not yet recorded |  |
| Mobile/Core Web Vitals review | All three canonical URLs |  |  | Not yet recorded |  |
