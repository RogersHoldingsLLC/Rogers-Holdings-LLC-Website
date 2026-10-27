# Premium editorial homepage — local review, 2026-10-27

## Authorization and baselines

Brian authorized a visibly distinct premium implementation after inspecting the narrow hero preview. This branch starts at preserved review commit `9017d3ed54083bc5a760bd7bd73c18e40201869d`; live remains `13e5662edf4fac3178394afe538fabdb82fb8dad`. This is review work, not permission to push, merge, publish or change the existing temporary preview.

The homepage's only markup changes are an additional scoped body class and stylesheet reference. Removing those two additions reproduces the baseline HTML byte-for-byte. All wording, offers, prices/terms, links, ARIA, fictional disclosures, official logo and asset references are preserved. The other 76 existing public files are byte-identical, including every image, sculpture script, actual PDF, service page and intake/consent implementation. The owner primary checkout is untouched.

## Tangible visual changes

- A two-line desktop headline spans the content grid, with the existing RH sculpture presented below/right as a focused exhibit. At 1440px the headline is 93.6px, previously 77.76px; the sculpture is 360px wide, previously 560px. Its original silhouette, mask, gold frame asset and finite rendering code are unchanged.
- On phones, the sculpture and founder introduction form one paired signature row below the headline/service description. Headlines are 44px at 390/375 and 38px at 320; founder text is 15px. Both actions remain at least 50px high and in the first viewport. The 390px action row ends around 593px, previously 617px; at 375px around 589px, previously 641px; at 320px around 584px, previously 615px.
- One shared 1280px desktop grid/gutter system aligns header, hero and subsequent sections. Existing serif/sans roles, restrained rules and section spacing become consistent.
- Existing project evidence becomes large alternating image/text rows, with compact client logos, unaltered full image compositions and the original privacy-safe Missy disclosure. Phones use a straightforward stacked reading sequence.
- Services become a numbered editorial index beside a clear section introduction. Every existing scope link remains the entry to its dedicated information; no homepage pricing blocks are added.
- The method becomes a three-row numbered sequence. Snapshot pairs a larger readable sample with its existing input/deliverable/next-step explanation and actual PDF link. The closing contact panel uses warm cream and dark type before the original dark footer.
- Existing reveal transitions are shortened to 300ms with no stagger, and reduced-motion remains static. No new JavaScript, imagery, fonts or generated assets are introduced. The existing no-JavaScript mark fallback is kept inside its canvas box and its duplicate overlay is hidden.

These principles follow the actually inspected official BASIC/DEPT, Dropbox Brand and Active Theory references: typographic hierarchy, modular alignment, disciplined spacing and one focal brand moment. No distinctive reference layout/assets or award claims are copied.

## Validation and actual evidence

- Actual before/after screenshots at 1440×1000, 1366×768, 390×844, 375×844 and 320×844; final normal/reduced-motion states and lower sections inspected.
- Ten responsive/motion checks: first-viewport actions/reassurance, paired phone signature, finite/static artwork, visible keyboard focus and menu/contact/work navigation. No viewport or section overflow.
- Fifteen service-link/Back journeys and three non-submit intake checks. Required fields, consent and production action remain unchanged. Zero POSTs and no missing local resources.
- Two actual-PDF new-tab keyboard journeys (desktop/mobile), retaining original page and scroll. PDF response is `application/pdf` and matches approved SHA-256 `08c20db2826dfb06cdbd5b52d5ec49e2915d072c90e8e746919f57089ea3a4cb`.
- All eight suites and 78-file public build pass. No lint script exists; `git diff --check` passes.
- Observed initial-view CLS is 0 in all ten headless runs. The change adds one homepage-scoped CSS request (about 17.5 KB raw / 3.3 KB gzip); no JS/image payload change. Local timing measurements are not production performance claims.

Evidence is outside public source under `../evidence/premium-editorial-review-20261027/`: before/after views, normal-motion captures, `final-checks.json`, PDF results, no-JS smoke, preservation/payload record and logs. Reference observations remain separately under `../evidence/premium-reference-review-20261027/`.

## Tradeoffs and limits

Project rows and the single-column service index use more vertical space to make evidence and scope clearer. The sculpture is smaller on desktop/phones while remaining the signature artwork; the headline and content now have more prominence. Phone founder text is 15px instead of the prior 16px. Physical Safari, production form delivery and RWS reachability are untested. Fixed-layout PDF body text still needs normal viewer zoom on phones. Cookie banners limited some reference-page views; this was not a complete audit of those sites.

## Preview plan — not executed

The existing temporary listener at `100.102.57.95:8421` remains frozen to `9017d3e`, PID 70655, with original expiry `2026-10-27T06:04:58Z`. Its in-memory bytes cannot be changed by this build.

After owner approval, replace only that temporary process on the same Tailscale IP/port with explicitly allowlisted, frozen before/after builds. Keep `/` on the original before version; proposed `/before/` and `/after/` paths would clearly label the two revisions. Reverify response bytes, relative navigation, PDF and rejected private/traversal paths, without RWS operation, new bind, Funnel/Serve, ACL/firewall/security or persistence changes. Preserve the original absolute expiry; do not start a fresh two-hour lifetime. If that expiry passes before approval, stop and seek new lifetime authorization. These versioned paths do not exist yet.

No push, merge, public deployment, spend, generation, temporary-preview replacement or expiry extension is part of this review commit.
