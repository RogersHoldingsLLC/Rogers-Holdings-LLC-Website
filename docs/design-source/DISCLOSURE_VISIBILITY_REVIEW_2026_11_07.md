# Expandable section visibility review

Status: local review only. Not published. Kept separate from the Our Work menu fix.

## Scope

Eleven native `details`/`summary` controls across Home (1), Services (4), Business Snapshot (1), Our Work (3), Spreadsheet Repair (1) and Combining Services (1).

The controls now have a warm-paper panel, brass border, stronger topic heading and explicit View details/Hide details cue with a plus/minus indicator. Four repeated Services headings now identify their actual topic. Existing Our Work descriptions remain visible. Touch targets are at least 80px tall, and keyboard focus has a distinct outline.

Native open/closed semantics remain intact, with no new JavaScript or nested interactive controls. The decorative action labels are hidden from assistive technology to avoid duplicating the native summary's expanded state. The CSS supports both open and closed states without JavaScript.

The approved fictional example sites retain their own design language and are unchanged. All main-site content outside the summary controls and stylesheet cache-version links is byte-identical to the menu-only baseline. Terms, forms, scripts, analytics, metadata and assets are unchanged.

## Validation

- Full eight-suite `npm test`: passed, including 11-control regression coverage.
- Allowlisted public build: passed, 90 files. Development-only fixtures stay excluded.
- Text contrast across default/hover backgrounds: title 12.68:1 minimum, description 6.90:1, cue 7.63:1.
- Local Chrome fixture: 308 passed, 0 failed across all eleven sections on all six pages at 320, 390, 768 and 1440px. Open/close cues, touch targets, focusability, repeated activation and horizontal overflow passed.
- Manual Chrome phone review: the panel hierarchy is visibly clearer. Enter opens the Eastland story, Space closes it, and focus stays on the summary. The corrected menu was also visually checked with all four choices visible.

Preview `/our-work/#eastland` or `/services/#spreadsheets` on the local server. Run `/tests/disclosure-browser.html` for all six pages at 320, 390, 768 and 1440px. Re-run `/tests/our-work-menu-browser.html` after styling changes to preserve the verified menu behavior.
