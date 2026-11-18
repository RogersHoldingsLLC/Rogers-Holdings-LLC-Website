# Our Work heading and example labels: 18 November 2026

Baseline: 94851ff8cf64aad2991500e3777d79aecd7ed504 (approved live SEO/mobile-delivery release).

Owner requested a desktop pass to remove the line through Our Work and remove fictional/AI labels. Subsequent owner direction: “Go ahead and publish.”

## Scope
- Removed the fixed 157px decorative rule crossing the responsive Our Work heading. Kept the smaller underline, composition, carousel controls and focus indicators.
- Changed presentation wording in HTML, alt text, metadata and active wordmarks to example/sample/concept language. Kept no-real-services, no-transactions, no-client-results and non-operating-business disclosures.
- Recaptured four affected screenshot thumbnails from the updated local pages: Form / Field, Red Fold, Howl & Timber and Cortez Capital. Regenerated the two carousel images’ 520/1040/1300px WebP variants.
- No changes to private customer data, forms, integrations, analytics, social share image, real-client claims or routing. Existing downloadable sample brief and unused archival illustrations remain untouched.

## Verification
- Full npm test, premium-portfolio standalone tests, public build: pass (224 allowlisted files).
- Desktop Chrome at 1316px: heading unobstructed; next-project and keyboard controls work.
- Mobile 390px iframe viewport (375px content with scrollbar): heading unobstructed, zero horizontal overflow, next-project and keyboard controls work.
- Inspected four refreshed desktop screenshots and checked old-label text in rendered public HTML.
- Added regression checks for the decorative rule, absence of old HTML labels, and preservation of keyboard focus.

This record describes QA; production state must be separately verified after the GitHub Pages owner approval gate.
