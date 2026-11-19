# Portfolio status and Snapshot copy accuracy

Prepared against published main `167b40ace3b860f966b1431aa5ce77ed78594348`. This is an owner-approved copy correction candidate, not a production release.

## Bounded changes

- Label every homepage carousel entry as In-house project, Client project or Sample project. Classification is visible in the existing subtitle and available in static link names, live announcements and the no-script list. All 14 project identities and destinations remain unchanged.
- Carousel executable behavior is byte-identical after replacing its project-description string table for comparison. No new elements, CSS, rotation/focus/keyboard logic, scale, timings, imagery or network behavior.
- Missy's CTA now says See the short project overview and retains the existing overview destination. Our Work promises a story, preview or working example rather than a working example for every project.
- Correct six small grammar/duplicate-label defects in existing fictional examples.
- Snapshot reassurance now references the existing Privacy Policy without the inaccurate claim that information is used only for reviewing/responding. No policy, consent scope, provider, purpose, form field, endpoint or processing behavior changed. Contact permission still applies only to the Snapshot request, not marketing.
- Remove unsupported typical-three-business-day delivery specificity from all three Snapshot locations. Available records repeated the old public wording but did not establish typical delivery performance. The offer still promises human review and an emailed Executive Brief. The separate spreadsheet-repair payment deadline is unchanged.
- Preserve the owner's confirmed Eastland Google Business Profile attribution and all other client narratives.

## Verification

- Full npm test: all 11 test groups pass, including actual carousel VM keyboard/wrap/route checks and isolated in-memory Snapshot submission tests. No real request was submitted.
- npm run build:public: 224 allowlisted files. git diff --check passed.
- Exact comparison to base confirms the form body differs only in the approved assurance paragraph. The form fingerprint was updated for that paragraph; the shared JavaScript fingerprint remains unchanged.
- Browser QA: 51/51 checks across 320, 390 and 1280 CSS-pixel iframe widths. All 14 selected carousel labels at every width match the correct status, remain within their caption bounds, and do not overlap the project title or cause horizontal overflow. Snapshot, Our Work and Missy's detail also pass width checks.
- Phone and desktop visual review confirmed readable classification and reassurance text. Actual Missy CTA navigation reaches /our-work/#missys-squishies. End selects the last sample; right-arrow wraps to the in-house first project.
- Testing used Chromium iframe widths, not a physical iPhone/Safari. The local QA fixture blocked connections/form actions, was removed before final build, and is not committed or published.
- Shared styles, privacy policy, forms JavaScript, integrations, deployment workflow, original assets and Eastland detail source remain unchanged.

## Release and rollback

Draft PR only. Explicit publication approval is required before merge. Revert this focused commit to roll back.
