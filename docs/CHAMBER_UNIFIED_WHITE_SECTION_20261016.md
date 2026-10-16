# Latest Chamber visual correction — unified white section

Owner specifically requests the original ring/bell mark transparently on dark footer if cleanly feasible; otherwise the ENTIRE rectangular membership section must be white, not a small square or padding-only change.

Official website inspected: logo-footer.svg is transparent but is a different horizontal bell/wordmark design, not the membership API blue oval ring/bell badge. Supplied Member.js exposes no transparency setting and API supplies opaque JPG. Do not generatively recreate, recolor, filter, strip pixels or substitute a different mark. Use the explicitly authorized fallback.

The whole chamber-membership rectangle now has pure #FFFFFF background with dark name/body/profile-action text. All inner spacing, logo area, profile button and explanatory note share this white field; original JPEG white background visually blends into it. Official image, aspect ratio, colors and shapes remain untouched at 96px. Profile button and official logo retain the separately verified destinations.

Scope: widget-only CSS in assets/css/site.css; index.html stylesheet cache suffix; this nonpublic record. No JS, imagery, unrelated content, settings or emails changed. Base fd931fe6f79474994d5e5b64fdf8b6b3e2f7075b. Existing silent reel already created/saved separately; no duplicate render.

Verification: all eight existing suites, 69-file build and diff check pass. Preview computed background rgb(255,255,255), member text rgb(38,43,36), exact official image at 96px. Screenshots visually inspected at 1440/390; additional 320 layout checked. Real profile-button clicks resolve to exact member2908 URL with title/H1 Rogers Holdings LLC; official-logo clicks resolve to Chamber homepage. No page errors/overflow, script remains late-loaded, blocked-script fallback works, three portfolio cards remain.

Latest owner polish: full white field retained; outer panel/profile button use existing RH --color-gold #A97B27. Added one restrained offset top-left gold corner matching founder portrait treatment (same color; scaled to 56px, offset 10px) and subtle shadow. No changes to official mark, image colors or click destinations. Silent reel already delivered; no re-render.

Final gold-trim verification: full background computed rgb(255,255,255); outer and corner borders rgb(169,123,39), exactly --color-gold #A97B27; member text dark rgb(38,43,36). Actual screenshots visually inspected. Real-click final member page identity verified again at 1440/390/320. No overflow/errors or image/branding changes.

Final breathing-room refinement: full-white card max width 430px, 28px internal padding, 24px logo/text gutter, 6px row gap. Latest owner clarifies same cohesive white-card/gold-trim direction applies to separate reel, which will be revised separately as v2. Original logo remains 96px on site, unmodified.
