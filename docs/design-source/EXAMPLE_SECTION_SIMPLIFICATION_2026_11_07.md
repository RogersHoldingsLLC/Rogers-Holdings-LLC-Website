# One clear set of website examples

Status: private preview only. Production remains unchanged.

The owner noted that the About the design examples disclosure repeated the three links shown immediately below it. The redundant disclosure and its separate gallery have been removed. The section now has one visible card per example, combining the existing logo, factual status label and destination in a single keyboard-accessible link.

Howl & Timber remains labeled Fictional law-firm concept; Cortez Capital remains Fictional website concept; Captured by Karmen remains Prelaunch owned project and A Rogers Holdings Company. The existing disclaimer makes clear that no client results are claimed. Captured by Karmen retains its new-tab notice and safe external-link attributes.

The section has a direct `#website-examples` target. The remaining ten main-site expandable sections retain the clearer disclosure treatment. The previously tested mobile menu fix is unchanged.

Validation: all eight test suites and the 90-file public build pass. Regression guards require exactly three example links, unique destinations, a single occurrence of every example logo, preserved disclosures and no hidden duplicate gallery. The Tailscale preview's updated HTML, stylesheet and all three logo assets return HTTP 200 and match the staged build bytes. Chrome desktop and 390px phone visual review passed. The updated responsive fixture passed 308 checks with zero failures across 320, 390, 768 and 1440px, including unique example links, keyboard focus and no horizontal overflow.

## Follow-up: Karmen first and seamless Howl card

The owner asked to lead with Captured by Karmen and to make the full Howl & Timber card match its logo background. Card order is now Captured by Karmen, Howl & Timber, then Cortez Capital in both the document and keyboard order. All labels, destinations, logo assets and external-link protections remain unchanged.

The Howl logo's actual SVG rectangle uses `#17262b`. The more-specific card CSS had overridden that color with brown; it now uses exactly `#17262b`, with `#f4f0e6` cream text. Text contrast is 13.68:1; the unchanged logo's brass detail has 7.42:1 contrast. No image generation or asset edits were needed.

All eight test suites, the 90-file allowlisted build and whitespace checks pass. The private Tailscale route returns HTTP 200 with exact staged HTML, stylesheet and logo bytes. Chrome desktop and 390px phone visual review passed. The responsive disclosure/card fixture passed 348 checks with zero failures across 320, 390, 768 and 1440px. The separate menu fixture passed all 95 checks again. This remains private-preview only; no remote changes or publication.


## Follow-up: matching client-project cards

The owner also requested the upper Eastland and Missy logo links use the same card style. Both now use the example cards' cream surface, brass border, 8px corners, 28px inset, 112px artwork area, clear status line and bold project title. They retain their exact original logos, text and project anchors. The pair stacks on narrow screens, with native keyboard links and visible focus indicators. Desktop and 390px phone visuals passed; the responsive fixture compares their computed surfaces, borders, corner radius and spacing directly with the Karmen card, checks keyboard access and verifies no horizontal overflow.

## Follow-up: brand-matched backgrounds and larger Eastland logo

The owner clarified that card backgrounds should blend with the logos, then specifically requested Missy's patterned backdrop be stripped away and replaced with plain pink. Eastland uses `#fefefe`, sampled from its original near-white JPG edges. Howl remains exactly `#17262b`. Cortez now uses near-black `#030303`, close to its sampled edge pixels. Karmen's existing PNG already has a transparent background.

Missy's original file is retained unchanged. A separate background-removal edit was made with the built-in image editing tool, without Magnific credits or API fallback. The new `assets/images/our-work/missy-logo-transparent.png` is a 1675×939 RGBA PNG with actual transparent background. It preserves the three-line wording, colorful lettering and purple script while removing the decorative patterned rectangle. It sits on a solid `#f3e1e9` pink card with `#58236c` text (8.95:1 contrast). The superseded edge-to-edge patterned-art treatment was removed.

Edit prompt: Extract the original Missy's / SQUISHIES / -and More- lettering and its small heart detail onto genuine transparency. Preserve wording, original letter shapes, positions, purple script, colorful middle lettering, outlines and intentional highlights. Remove the entire patterned pink/lavender rectangle, border, scattered background hearts, stars, sparkles and surrounding glow. Do not redesign or rearrange the wordmark. Leave modest clear padding for use on a solid pale-pink website card.

The owner also requested a larger Eastland mark. The client artwork area and image maximum height increased from 112px to 190px; natural width and height preserve the original image proportions at all screen sizes. The high-resolution source remains untouched. Client destinations and labels, Karmen-first ordering, the navigation fix and disclosure improvements are retained.

Validation: all eight test suites and the 91-file allowlisted build pass. The new PNG's chunk checksums, dimensions and alpha were verified. Updated HTML, CSS and transparent-logo bytes are served exactly by the private Tailscale preview. Desktop and 390×844 phone visual review passed, including full lettering, no patterned box, enlarged undistorted Eastland art, readable text and visible project links. Final responsive fixture results are recorded below.

Final browser results: 360 responsive disclosure/card checks and 95 navigation checks passed with zero failures. Nothing was pushed or published.
