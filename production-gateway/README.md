# Business Snapshot Production Gateway

This isolated Cloudflare Worker is the production transport boundary between
the public Business Snapshot form and the separately deployed immutable Apps
Script receiver. It does not replace or modify `staging-gateway`.

The Worker accepts only `POST /api/business-snapshot` and CORS preflight for
the exact configured HTTPS origin. It validates and normalizes the public form
contract, rejects the honeypot, applies two Cloudflare rate-limit bindings,
optionally verifies Turnstile when its production configuration is present,
and forwards only the immutable receiver contract.

The receiver endpoint and shared authentication credential use exactly these
encrypted configuration keys:

- `BUSINESS_SNAPSHOT_RECEIVER_URL`
- `BUSINESS_SNAPSHOT_RECEIVER_SECRET`

`BUSINESS_SNAPSHOT_ALLOWED_ORIGIN` is required and must be an exact HTTPS
origin. Turnstile is enabled only when its secret or validation expectations
are configured; partial Turnstile configuration fails closed.

No endpoint, credential, account identifier, route, or environment-specific
value belongs in this directory. Configure private values through approved
provider controls using standard input, never command arguments or files.

## Review-only website activation state

The approved permanent public architecture uses a dedicated Worker custom
domain at `intake.rogersholdingsllc.com`. This repository records that planned
public hostname only; no custom-domain mapping, DNS change, nameserver change,
or Turnstile production setting has been applied.

The website activation contract remains deliberately disconnected:

- `routeEnabled` is `false`.
- The website keeps `data-endpoint-configured="false"`.
- `workers_dev` and preview URLs remain disabled.
- The tracked Turnstile site key is an unmistakable inactive placeholder.
- Receiver values, Worker secrets, provider credentials, and account-specific
  identifiers remain outside tracked source.

The public browser contract contains `company` for honeypot enforcement and
does not contain `formStartedAt` or any private receiver field. A successful
public response contains only `ok`, `environment`, `requestId`, and Boolean
`retry`; the receiver's internal prospect identifier is never returned by the
gateway.

## Local verification

Run `npm run check`, `npm test`, and `npm run package`. Generate a provider
bundle only with `npm run deploy:dry-run`; this command must never be replaced
with a live deploy during local validation.

## Prepared release sequence

1. Reconfirm the production service does not already exist and staging is
   unchanged.
2. Validate this package and perform a provider dry run.
3. Keep the production Worker without a public route and keep the website
   connection disabled.
4. Transfer the receiver endpoint and preserved receiver credential directly
   from their approved secure sources into the two encrypted Worker settings.
5. Verify key names and counts only.
6. Run separately approved unauthenticated and authenticated gateway probes.
7. Inventory and reproduce every existing DNS record in an active Cloudflare
   zone before requesting nameserver-migration approval.
8. After explicit infrastructure approval, migrate nameservers, verify the
   GitHub Pages website and mail-related DNS, configure the production
   Turnstile hostname/action/secret, and attach the custom-domain mapping.
9. Run public route, CORS, Turnstile, and no-secret verification without a
   Business Snapshot submission.
10. After a separate website-activation approval, change only the reviewed
    website flag to `data-endpoint-configured="true"` and deploy it.
11. Make the first controlled production submission only after its own explicit
    approval, then verify the complete four-record BOP transaction.

Rollback disconnects intake first by removing the Worker custom-domain mapping,
then restores the endpoint-disabled website release. It does not alter the
receiver deployment, BOP deployment, or existing production records.
