# Technical Growth Business Snapshot Fallback Check

Audit date: 2026-08-20

## Root cause

The stale fallback was in `business-snapshot/index.html` inside the production form, immediately after the honeypot and before the live form-status region. It had a native `hidden` attribute but contained complete “secure submission endpoint is not connected” copy in server-delivered HTML.

Normal browsers therefore did not render or expose the node to the accessibility tree, and the native `hidden` state existed before CSS or deferred JavaScript could run, so a visual flash was not expected. Crawlers and source parsers could still read and associate the stale text with ordinary page content.

`assets/js/site.js` determines availability with both conditions below:

1. `data-endpoint-configured` must equal `true`.
2. The form action must exactly equal `https://intake.rogersholdingsllc.com/api/business-snapshot`.

Before this pass, failure of either condition revealed the pre-rendered paragraph. Genuine submission failures were separately classified after the request.

## Correction

- The delivery-note paragraph remains in its exact form position but is empty and natively hidden in source.
- JavaScript inserts the authorized sentence only after endpoint/configuration failure is proven:

> Secure submission is temporarily unavailable. Your answers have not been sent. Please try again or contact Rogers Holdings directly.

- The same authorized sentence is used for a classified retryable submission-service failure.
- The existing prepared-email action remains available after a genuine failure.
- Regression tests assert that neither the stale copy nor the authorized failure sentence appears in normal Business Snapshot HTML source.

## Normal-state behavior

At 1440×900 and 390×844, with the exact configured endpoint/action:

- delivery-note text: empty;
- `hidden`: true;
- computed display: `none`;
- client rectangles: zero;
- present in body text: no;
- present in the accessibility tree: no;
- visual flash: no;
- form action, method, endpoint flag, fields, consent, honeypot, and Turnstile widget: unchanged.

## Failure-state behavior

- Endpoint/configuration mismatch: JavaScript writes and reveals only the authorized sentence, hides Turnstile, validates the unchanged fields, then exposes the prepared-email action without claiming submission.
- Retryable service response: form status is focused, marked as an error, and announces the authorized sentence through the existing `role="status"`/`aria-live="polite"` region; the prepared-email action is available.
- Ambiguous timeout/network/response states retain their distinct “not confirmed” language so the site does not falsely say the answers were definitely not sent.
- Success handling, response validation, retry identity, and confirmation behavior are unchanged.

## Contract preservation

Unchanged: endpoint, POST method, JSON payload schema, field names/order, validation, consent, honeypot, Turnstile contract and site key, accepted-response contract, retry behavior, Receiver, and Business Optimization Platform.
