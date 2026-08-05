# Business Snapshot Premium Experience

Date: July 30, 2026

## Scope

This release changes only the customer-facing Business Snapshot website
experience. The Business Snapshot Library, receiver architecture, security
model, staging transport, and production activation plan remain frozen and
unchanged.

## Experience changes

- Repositioned the offer as a complimentary executive review with a concise,
  evidence-led written deliverable.
- Rebuilt the first viewport around a strong decision-oriented promise, clear
  timing, human review, and an illustrative executive brief.
- Added a responsive expectation strip and clearer qualification, scope, and
  direct-contact guidance.
- Added live required-field completion progress without changing the form
  contract.
- Refined labels, hints, placeholders, consent language, character feedback,
  valid states, error states, and focus treatment.
- Added a contained secure-submission loading state.
- Rebuilt the accepted-submission view with a clear timeline and optional
  review-conversation call to action.
- Added reduced-motion behavior and preserved lightweight, dependency-free
  delivery.

## Verification

- JavaScript syntax and Git whitespace checks pass.
- Browser rendering passes at 1440 × 1100 and an emulated 390 × 844 viewport.
- The mobile viewport reports zero horizontal overflow.
- The page contains meaningful content and no framework error overlay.
- Empty submission focuses the first invalid field and reports all five
  required fields.
- A complete required-field set advances the progress indicator to 100%.
- The challenge counter updates correctly.
- The unconfigured delivery fallback and production-success guard remain
  intact.

## Production activation review patch

The review-only production patch prepares the premium form for the dedicated
`intake.rogersholdingsllc.com` Worker custom domain while keeping
`data-endpoint-configured="false"`. The retired staging endpoint is removed,
the browser contract includes the honeypot and omits `formStartedAt`, and the
success guard requires the approved production response shape without a public
prospect identifier.

The tracked Turnstile value remains an inactive production-site-key placeholder.
No DNS, nameserver, Worker route, custom domain, Turnstile setting, website
deployment, or production submission is part of this patch.

Final activation requires these separate approvals in order:

1. Complete DNS inventory and nameserver-migration approval.
2. Cloudflare custom-domain and production Turnstile configuration approval.
3. Public route/CORS/Turnstile verification with no intake submission.
4. Website approval to change the endpoint flag to `true`.
5. First controlled production-submission approval and four-record verification.

Rollback removes the custom-domain mapping first and restores the reviewed
endpoint-disabled website state without changing BOP or receiver deployments.

## Turnstile preview-host limitation

The production widget is restricted to `rogersholdingsllc.com`. Temporary
preview hosts, including `trycloudflare.com` tunnels, are intentionally not
authorized and can fail before human verification begins. That failure is
expected and must not be addressed by weakening the production hostname
restriction. The form presents a polished refresh-or-contact fallback when the
Turnstile API cannot initialize. Preview validation must not submit a lead;
production verification remains limited to the approved production hostname.

## Screenshots

- `business-snapshot-premium-desktop.png`
- `business-snapshot-premium-mobile.png`
- `business-snapshot-premium-success-mobile.png`
