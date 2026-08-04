# Business Snapshot Monitoring

This runbook separates operational monitoring from business analytics for the
production Business Snapshot flow:

`Website → Turnstile → Worker → Receiver → BOP`

It does not authorize synthetic submissions, provider changes, record changes,
or production deployment. Never test monitoring by sending a production intake
unless that submission has its own explicit approval.

## Privacy boundary

Frontend analytics and Worker logs must never contain:

- names, business names, email addresses, phone numbers, or challenge text;
- raw request IDs, Prospect IDs, operation keys, IP addresses, or user agents;
- Turnstile tokens, receiver URLs, secrets, credentials, or upstream bodies;
- arbitrary exception messages, stack traces, or provider diagnostics.

The Worker derives `request_ref` as the first 24 hexadecimal characters of the
SHA-256 digest of the UUID request ID. This allows an authorized operator to
correlate a known BOP operation offline without placing the raw identifier in
logs. Do not send `request_ref` to Google Analytics.

## Cloudflare Worker review

Open **Workers & Pages → rogers-holdings-business-snapshot-production →
Observability** and select the required time range. Use Query Builder against
the structured JSON log fields.

Run these views for the prior 24 hours:

| Purpose | Filter | Visualization / grouping |
| --- | --- | --- |
| Accepted requests | `event = request_accepted` | Count, grouped by `retry` |
| HTTP failures | `status >= 400` | Count, grouped by `status`, `code`, and `event` |
| Rate limits | `event = rate_limited` | Count |
| Turnstile failures | `stage = turnstile` and `status >= 400` | Count, grouped by `turnstile_category` |
| Receiver failures | `stage = receiver` and `status >= 400` | Count, grouped by `event` and `code` |
| Reconciliation required | `code = BUSINESS_SNAPSHOT_RECONCILIATION_REQUIRED` | Count; every result requires review |
| Retry trace | `request_ref = <approved hash>` | Ordered log rows; confirm `retry` transition |
| Latency | `event = request_accepted` | Distribution of `duration_ms` and `receiver_duration_ms` |

Worker invocation metadata remains the source for total request volume, path,
method, response status, runtime exceptions, and CORS preflight traffic. Custom
logs add the application outcome and must not replace invocation metrics.

### Structured fields

- `event`
- `environment`
- `code`
- `status`
- `stage`
- `request_ref`
- `retry`
- `duration_ms`
- `receiver_duration_ms`
- `turnstile_category`

Allowed stages are `configuration`, `origin`, `validation`, `rate_limit`,
`turnstile`, `receiver`, and `complete`. Turnstile categories are a fixed
allowlist; unknown provider diagnostics collapse to `unknown`.

## Turnstile review

Open **Turnstile → Rogers Holdings Business Snapshot — Production →
Analytics**. Review:

- challenges issued, solved, and unsolved;
- interactive and non-interactive solves;
- Siteverify requests and valid/invalid tokens;
- top hostname and top action;
- unexpected browser, country, ASN, or traffic spikes.

The only expected hostname is `rogersholdingsllc.com` and the only expected
action is `business_snapshot`. A hostname or action mismatch in Worker logs is
an immediate incident. Invalid-token detail is recorded only as an allowlisted
category; raw Turnstile responses are never logged.

## GA4 funnel

Create an exploration scoped to the Business Snapshot page with this sequence:

1. `page_view`
2. `business_snapshot_form_started`
3. `business_snapshot_submit_attempted`
4. `business_snapshot_submitted`

Use these diagnostics outside the primary success path:

- `business_snapshot_submission_failed` with `failure_category`;
- `business_snapshot_abandoned` with `journey_stage`;
- `business_snapshot_runtime_failed` with `runtime_category`;
- `business_snapshot_email_prepared` for the endpoint-disabled fallback.

Register only `failure_category`, `journey_stage`, and `runtime_category` as
event-scoped custom dimensions. Mark `business_snapshot_submitted` as the key
event. Do not create dimensions from form fields, identifiers, URLs containing
identifiers, or error text.

Client analytics is directional: browser privacy controls, blockers, offline
navigation, and page termination can prevent events from arriving. BOP records,
not GA4, remain the source of truth for accepted leads.

## Daily BOP reconciliation

For each unique `Business Snapshot Intake` Activity Feed operation:

1. Confirm one Master Prospect Tracker row for the Prospect ID.
2. Confirm exactly two Activity Feed rows for the Prospect ID:
   `Business Snapshot Intake` and `Follow-Up Created`.
3. Confirm one Follow-Ups row for the same Prospect ID.
4. Confirm the intake operation key is `INTAKE:<requestId>` and the follow-up
   operation key is `INTAKE:<requestId>:FOLLOWUP`.
5. Confirm no duplicate Prospect ID, operation key, request ID, email, or
   business record exists.
6. Review any accepted Worker request that lacks a complete four-record
   transaction after five minutes.

Also review Follow-Ups that are due or overdue and incomplete. Never repair,
archive, merge, or delete records during monitoring without separate approval.

## Recommended alerts

| Severity | Trigger |
| --- | --- |
| Critical | Page/TLS unavailable for two consecutive checks |
| Critical | Any configuration, environment, hostname, or action mismatch |
| Critical | Any `BUSINESS_SNAPSHOT_RECONCILIATION_REQUIRED` result |
| Critical | Any incomplete or duplicate canonical BOP transaction |
| High | Any Worker 5xx while production volume remains low |
| High | Any receiver timeout; escalate on two within 15 minutes |
| High | Accepted Worker request without four records after five minutes |
| Warning | More than five 429 responses in ten minutes |
| Warning | Invalid Turnstile rate above 20% with at least ten validations |
| Warning | Three sanitized runtime failures within 15 minutes |

Thresholds must be revisited after sufficient real traffic establishes a
baseline. Alert routing and scheduled health checks require separate approval.

## Retention and review cadence

- Workers Logs have short provider-controlled retention. Review them daily and
  use Worker metrics for longer trends.
- Verify GA4 event retention before relying on long-range explorations.
- Apps Script execution and Cloud Logging retention depend on the receiver's
  Google Cloud project configuration; verify this in Phase 2.
- BOP contains lead PII and requires a separately approved retention and
  archive policy.

Recommended cadence:

- Daily: Worker, Turnstile, BOP reconciliation, and due Follow-Ups.
- Weekly: GA4 funnel, failure categories, acquisition, and qualified leads.
- After deployment: no-submit page/runtime check and CORS preflight.
- Monthly: access, retention, thresholds, abuse patterns, and runbook review.

## Escalation and rollback

For a confirmed intake incident, preserve evidence and request approval to:

1. disable the website endpoint flag;
2. remove the Worker custom-domain mapping if traffic must be disconnected;
3. preserve DNS when it is healthy;
4. reconcile Receiver and BOP outcomes by known identifiers;
5. document the incident before restoring intake.

Monitoring alone never authorizes rollback or record modification.
