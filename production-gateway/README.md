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

## Local verification

Run `npm run check`, `npm test`, and `npm run package`. Generate a provider
bundle only with `npm run deploy:dry-run`; this command must never be replaced
with a live deploy during local validation.

## Prepared release sequence

1. Reconfirm the production service does not already exist and staging is
   unchanged.
2. Validate this package and perform a provider dry run.
3. Create the production Worker from this package with no public route and no
   website connection.
4. Transfer the receiver endpoint and preserved receiver credential directly
   from their approved secure sources into the two encrypted Worker settings.
5. Verify key names and counts only.
6. Run separately approved unauthenticated and authenticated gateway probes.
7. Activate the website route only after those probes pass.

Before website activation, rollback removes only the new production Worker.
After activation, rollback first restores the previously recorded website
release with online submission disabled, then removes the new Worker if it is
no longer required.
