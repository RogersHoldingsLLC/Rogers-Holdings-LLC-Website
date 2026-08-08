# Homepage Hero V2 Desktop Proof Rollback

Recorded: 2026-08-07

Purpose: preserve the exact production homepage-hero baseline before the desktop-only Hero V2 browser proof. This record does not authorize tablet, mobile, production, or release changes.

## Git baseline

- Branch: `redesign/homepage-reference-match`
- Commit: `ead3edbe82d0e25303ed9f368125d350c505e808`

## Existing hero implementation

- Hero HTML-region SHA-256: `8511980cd7f9cd58427c938b495405413e89af6bece9ef26a73b17e229499af8`
- `index.html` SHA-256: `d47aa176e106a68574a2aceccda0598095ad148d04a99f01ca0af86b38c82a08`
- `assets/css/site.css` SHA-256: `ea1a9a4b877c36319c5c778a0a083e8898c1775024a1d11cd6066aa230d9c22c`

The baseline hero uses live HTML for its eyebrow, headline, supporting paragraph, two calls to action, trust line, sample disclosure, navigation, accessibility, and interaction.

## Existing desktop hero assets

All three baseline desktop assets are `2560 × 960` and remain preserved in place.

| Asset | SHA-256 |
| --- | --- |
| `assets/images/homepage/executive-snapshot-hero-desktop.avif` | `e566bc023169ae565a2b30c605c42370005e94332df5f63a612c60ad7225321d` |
| `assets/images/homepage/executive-snapshot-hero-desktop.webp` | `45097e426d84abde3ca89f180012c2285e8a2f90e19fcb64cb2e91bebdcbf64c` |
| `assets/images/homepage/executive-snapshot-hero-desktop.jpg` | `8530c854fd9795a269f57ad7ae410b83e4ea9f83a73e5a02edbe9be996f7ad12` |

## Existing tablet and mobile assets

The existing `executive-snapshot-hero-tablet.*` and `executive-snapshot-hero-mobile.*` image systems are outside this proof's change scope and must remain referenced at their current breakpoints.

## Rollback procedure

To abandon the desktop proof before any release action:

1. Restore the three desktop `<picture>` references in `index.html` to `executive-snapshot-hero-desktop.avif`, `.webp`, and `.jpg`.
2. Restore the desktop hero HTML-region and canonical hero CSS from commit `ead3edbe82d0e25303ed9f368125d350c505e808`.
3. Leave all tablet/mobile source elements and their assets untouched.
4. Remove the three untracked `homepage-hero-v2-desktop-proof.*` derivatives only after separate approval.
5. Re-run repository and browser validation.

No existing production hero source asset is overwritten by this proof.
