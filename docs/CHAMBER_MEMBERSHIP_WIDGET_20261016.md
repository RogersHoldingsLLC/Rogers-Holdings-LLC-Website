# Chamber membership widget release

Owner supplied the Chamber embed and approved addition, then separately explicitly approved publishing once checks pass. Scope: homepage footer widget only. Base: 995be310f9eea21d3ab6bdd5a61b181db314b109.

## Identity and source

Official script https://mtsterlingchamber.chambermaster.com/Content/Script/Member.js inspected. Official JSONP response https://mtsterlingchamber.chambermaster.com/public/widgets/member?secure=true&memId=2908&jsonpcallback=verify returns Member Rogers Holdings LLC and Customer Mt Sterling-Montgomery County Chamber of Commerce. Official directory https://mtsterlingchamber.chambermaster.com/list/member/rogers-holdings-llc-2908 has matching title/name and rogersholdingsllc.com.

## Placement and implementation

Compact white panel under the existing homepage footer brand introduction. Preserves official 145px rendered Chamber logo, member name, Proud Member of wording, owner-supplied container ID, member ID and style template. Explicit HTTPS option. Local deferred loader waits until within 240px of viewport before asynchronously loading official script. Permanent direct profile link remains usable without script. Generated logo link gets noopener/noreferrer and uses verified HTTPS Chamber homepage rather than response HTTP URL. No form, credentials, integration settings or data submissions.

## Loading impact

Observed zero Chamber requests on initial page before approaching footer. On reveal: Member.js 6982 bytes, JSONP 284 bytes, official hosted JPG logo 9265 bytes, all HTTPS 200, total 16531 decoded bytes; local loader 1643 bytes. No Set-Cookie headers on these observed responses; inspected official script contains no cookie/storage APIs. Widget sends member ID and page hostname explicitly; normal browser network metadata also goes to ChamberMaster and its Azure image host. Third-party code remains the official hosted service, not a copied library.

## Verification and preservation

All eight existing npm test suites pass, build:public produces 69 exact allowlisted files, diff check passes. Browser at 1440/390/320: correct member/logo/link, no overflow, zero page errors, one script instance, no early external requests; blocked-script fallback remains visible/usable. Portfolio still has three cards. Desktop/mobile screenshots visually inspected. Homepage matches baseline byte-for-byte after removing ONLY widget markup, loader include and stylesheet cache suffix. Shared CSS only appends scoped chamber-membership selectors. No other page/portfolio/demo asset changed.

## Exact files

Modified: index.html; assets/css/site.css; scripts/public-artifact.mjs (one JS file allowance); tests/public-artifact.test.mjs (68 -> 69 exact public-file count).
Added public: assets/js/chamber-membership.js.
Added nonpublic documentation: docs/CHAMBER_MEMBERSHIP_WIDGET_20261016.md.
No DNS/accounts/security settings/paid services/deployment workflow/accounting changes.
