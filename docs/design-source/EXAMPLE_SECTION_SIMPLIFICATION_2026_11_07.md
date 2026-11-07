# One clear set of website examples

Status: private preview only. Production remains unchanged.

The owner noted that the About the design examples disclosure repeated the three links shown immediately below it. The redundant disclosure and its separate gallery have been removed. The section now has one visible card per example, combining the existing logo, factual status label and destination in a single keyboard-accessible link.

Howl & Timber remains labeled Fictional law-firm concept; Cortez Capital remains Fictional website concept; Captured by Karmen remains Prelaunch owned project and A Rogers Holdings Company. The existing disclaimer makes clear that no client results are claimed. Captured by Karmen retains its new-tab notice and safe external-link attributes.

The section has a direct `#website-examples` target. The remaining ten main-site expandable sections retain the clearer disclosure treatment. The previously tested mobile menu fix is unchanged.

Validation: all eight test suites and the 90-file public build pass. Regression guards require exactly three example links, unique destinations, a single occurrence of every example logo, preserved disclosures and no hidden duplicate gallery. The Tailscale preview's updated HTML, stylesheet and all three logo assets return HTTP 200 and match the staged build bytes. Chrome desktop and 390px phone visual review passed. The updated responsive fixture passed 308 checks with zero failures across 320, 390, 768 and 1440px, including unique example links, keyboard focus and no horizontal overflow.
