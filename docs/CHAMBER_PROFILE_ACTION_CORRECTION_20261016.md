# Chamber footer profile-action correction

User reported that clicking the badge opened the Chamber homepage and objected to the large white panel. Reproduced both existing real click paths on desktop/mobile: official logo opens Chamber homepage; secondary text link already opened the exact Rogers Holdings public profile. Earlier reporting failed to distinguish these and was premature as a claim about the badge destination.

Base: a16d1f7e9a7248e03a8430fb01edc948c5677ddf. Bounded correction under existing explicit widget publication approval.

## Correction

Make the adjacent profile action a clearly labeled gold-outlined primary button: View Rogers Holdings member profile. Retain official logo as a separate Chamber homepage link; visibly explain that behavior and label it accessibly. No nested links or official-brand link override. Remove large white container; render unchanged official image at 96px alongside membership text on the existing dark footer, with subtle separator and compact spacing.

Official Member.js options inspected: styleTemplate available, no transparency setting exposed in supplied script. Official response supplies opaque JPG. No transparent alternative or public-specific minimum-size requirement verified; no background removal, recoloring, distortion, image editing or substitution performed. Original hosted artwork/link/member ID and supplied style template retained.

## Verification

All eight existing suites and 69-file build pass; diff check passes. Actual preview clicks at 1440/390/320: profile button final URL https://mtsterlingchamber.chambermaster.com/list/member/rogers-holdings-llc-2908, title Rogers Holdings LLC | Business - Mt. Sterling-Montgomery County Chamber, H1 Rogers Holdings LLC. Official logo final URL https://www.mtsterlingchamber.com/ with Chamber homepage heading. No overflow/page errors, original logo loads, single late-loaded script, blocked-script profile fallback works. Three recent portfolio cards preserved. Desktop/mobile screenshots visually inspected.

## Exact source scope

index.html: explicit profile button text, destination note, asset cache suffixes.
assets/css/site.css: replace only widget-specific styles; compact dark-footer grid.
assets/js/chamber-membership.js: add accurate logo-link accessible label and observe containing panel because target uses display:contents.
This nonpublic review document.
No email, other site content, images, DNS, credentials, accounting, external account/settings or deployment workflow changes.
