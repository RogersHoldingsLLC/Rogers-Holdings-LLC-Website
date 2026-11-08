# Snapshot analytics correction — 2026-11-08

## Approved scope and baseline

This bounded release corrects Snapshot event semantics and prevents Snapshot preview/test analytics from reaching the production property. It changes two public files, assets/js/site.js and business-snapshot/index.html, from production commit 5f3e8e67329ec414d908c88cbf7a4938bc747ea3. The independently retrieved live versions matched that commit before integration.

The page design, form markup, consent, endpoint, payload, accepted-response checks, verification controls, fallback contact paths, all other public files, and analytics property configuration are unchanged. No real lead was submitted during verification.

## Event definitions after this release

- business_snapshot_submit_attempted: a request dispatch after validation and a verification token. It does not count every click.
- business_snapshot_submitted: the client received the existing accepted production response contract.
- business_snapshot_submission_failed: the attempted-request catch path. Network/timeout/response failures may remain ambiguous about server receipt.
- business_snapshot_submit_blocked: invalid input or a missing verification token before any request.
- business_snapshot_verification_issue: verification error, expiry or timeout, at most once per category per page lifetime and suppressed after submission completion.

Previously, idle or repeated verification callbacks used the submission_failed event. Do not compare its historical totals directly with the corrected metric or interpret them as failed customer deliveries. Record the actual deployment cutover from the GitHub Pages release receipt when reporting across this boundary.

## Analytics isolation

The Snapshot page's GA bootstrap and shared Snapshot event sender run only on exact HTTPS production hosts rogersholdingsllc.com and www.rogersholdingsllc.com. Adding ?analytics=off suppresses analytics on the current Snapshot page.

This is not sitewide preview isolation or an owner-traffic filter. The query flag is not persistent. It disables analytics only, not intake submission, and must not be treated as a submission sandbox. No sensitive form values, verification tokens, or request IDs are sent to analytics.

## Checks completed before publication

- All nine npm test suites, including 22 analytics regression cases, passed.
- The allowlisted build contains exactly 91 files. Only the two approved public files differ from the baseline. Tests, QA server, and this note are excluded.
- JavaScript syntax and git diff whitespace checks passed.
- Actual Chrome checks against the built artifact passed: 75 Snapshot assertions at 320/390/768/1440px, 1,048 shared disclosure/layout assertions at 320–1440px, and 95 mobile/desktop menu assertions. Zero failures.
- Snapshot tests cover idle callbacks, invalid input, missing token, accepted/rejected/malformed/network/timeout results, retries, in-flight and completed duplicate handling, pending verification callbacks, privacy allowlists, and production/preview/test host gates.

All request outcomes were mocked. The local QA server blocks external requests and form actions with a restrictive Content-Security-Policy. Real Turnstile issuance, real intake acceptance, downstream fulfillment, GA ingestion and actual-device Safari behavior are not claimed as tested.

## Reproduce local checks

Run npm test and npm run build:public, then node tests/snapshot-browser-server.cjs. Open http://127.0.0.1:4278/tests/snapshot-analytics-browser.html in Chrome. The server binds loopback only and serves production pages from _site, with its test-only fixtures outside the production artifact. The existing disclosure-browser.html and our-work-menu-browser.html harnesses are available under /tests/ through this server. Stop it when finished.

## Release and rollback

Use the existing pull-request validation and GitHub Pages main-branch deployment workflow. Confirm CI for the exact release commit, successful Pages deployment, and matching live file bytes before declaring release complete. Revert the release commit through the same reviewed workflow if a regression requires rollback; this restores the prior instrumentation semantics as well as the previous page bootstrap. Do not change analytics settings, the intake gateway, or security configuration as part of this release.
