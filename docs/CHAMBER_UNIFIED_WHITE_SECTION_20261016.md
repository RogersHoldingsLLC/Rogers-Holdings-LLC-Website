# Latest Chamber visual correction — unified white section

Owner specifically requests the original ring/bell mark transparently on dark footer if cleanly feasible; otherwise the ENTIRE rectangular membership section must be white, not a small square or padding-only change.

Official website inspected: logo-footer.svg is transparent but is a different horizontal bell/wordmark design, not the membership API blue oval ring/bell badge. Supplied Member.js exposes no transparency setting and API supplies opaque JPG. Do not generatively recreate, recolor, filter, strip pixels or substitute a different mark. Use the explicitly authorized fallback.

The whole chamber-membership rectangle now has pure #FFFFFF background with dark name/body/profile-action text. All inner spacing, logo area, profile button and explanatory note share this white field; original JPEG white background visually blends into it. Official image, aspect ratio, colors and shapes remain untouched at 96px. Profile button and official logo retain the separately verified destinations.

Scope: widget-only CSS in assets/css/site.css; index.html stylesheet cache suffix; this nonpublic record. No JS, imagery, unrelated content, settings or emails changed. Base fd931fe6f79474994d5e5b64fdf8b6b3e2f7075b. Existing silent reel already created/saved separately; no duplicate render.

Verification: all eight existing suites, 69-file build and diff check pass. Preview computed background rgb(255,255,255), member text rgb(38,43,36), exact official image at 96px. Screenshots visually inspected at 1440/390; additional 320 layout checked. Real profile-button clicks resolve to exact member2908 URL with title/H1 Rogers Holdings LLC; official-logo clicks resolve to Chamber homepage. No page errors/overflow, script remains late-loaded, blocked-script fallback works, three portfolio cards remain.
