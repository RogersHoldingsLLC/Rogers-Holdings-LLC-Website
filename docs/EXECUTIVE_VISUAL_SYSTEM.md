# Rogers Holdings Executive Visual System

## Purpose

The executive visual system gives Rogers Holdings artwork a consistent editorial presentation without changing the structure of the website. Use it for executive documents, operating artifacts, dashboards, workshop scenes, and technology workspaces.

The system should always feel credible, quiet, useful, and connected to a real business engagement. It is not a decorative gallery treatment.

## Brand foundation

- Ivory is the primary paper and page material.
- Charcoal is the primary executive and technical material.
- Walnut is an occasional environmental accent, not a default background.
- Gold is reserved for rules, labels, priority markers, and small points of emphasis.
- Editorial spacing should leave enough room for each visual to read as evidence.
- Shadows should suggest physical depth without making the artwork appear to float.

### Logo contrast rule

- Light backgrounds use `assets/images/brand/rogers-holdings-logo.png`.
- Dark or black backgrounds use `assets/images/brand/rogers-holdings-logo-reversed.png`.
- The reversed asset contains the white RH mark and preserved gold frame. Do not
  use CSS filters as the permanent logo treatment.

## Canonical component

Use this structure for all executive artwork:

```html
<figure class="executive-scene executive-scene--landscape executive-scene--paper"
  data-reveal data-scene-parallax>
  <div class="executive-scene__frame">
    <div class="executive-scene__media">
      <picture>
        <source type="image/avif" srcset="example-480.avif 480w, example-768.avif 768w"
          sizes="(max-width: 680px) calc(100vw - 40px), 620px">
        <source type="image/webp" srcset="example-480.webp 480w, example-768.webp 768w"
          sizes="(max-width: 680px) calc(100vw - 40px), 620px">
        <img class="executive-scene__image"
          src="example-768.jpg" width="768" height="512"
          loading="lazy" decoding="async"
          alt="Plain-language description of the business artifact">
      </picture>
    </div>
  </div>
  <figcaption class="executive-scene__caption">
    <span>Scene Name</span>
    <small>Short factual context</small>
  </figcaption>
</figure>
```

Once the component is in place, a new piece of artwork requires only changing the image `src`, intrinsic `width` and `height` when needed, alternative text, and caption copy. Framing and behavior remain unchanged.

## Reusable classes

### Core

- `executive-scene`: component root and responsive boundary.
- `executive-scene__frame`: shared border, mat, lighting, shadow, and elevation.
- `executive-scene__media`: crop boundary and aspect-ratio owner.
- `executive-scene__image`: consistent image rendering and optional parallax transform.
- `executive-scene__caption`: editorial label and factual context.

### Aspect ratios

- `executive-scene--landscape`: 3:2; default for environmental and tabletop scenes.
- `executive-scene--wide`: 16:10; useful for workshop and workspace scenes.
- `executive-scene--document`: 4:5; useful for a report, assessment, or plan shown vertically.
- `executive-scene--dashboard`: 16:9; useful when screen legibility is the primary evidence.

Use one ratio per placement. Do not create a new ratio for an individual page unless the artwork genuinely cannot fit a supported format.

### Material variants

- `executive-scene--paper`: ivory archival mat; preferred default.
- `executive-scene--charcoal`: dark technical or screen-led presentation.
- `executive-scene--walnut`: restrained environmental presentation.
- `executive-scene--caption-hidden`: removes the visible caption when adjacent copy already provides the same context. The image still requires useful alternative text.

### Position adjustment

Set `--scene-object-position` on the component only when a focal point needs protection:

```html
<figure class="executive-scene executive-scene--wide executive-scene--charcoal"
  style="--scene-object-position: 62% center">
```

This variable is the approved escape hatch. Avoid page-specific crop selectors.

## Motion

### Reveal

Add `data-reveal` to opt into the established gentle fade and 12-pixel slide. Reveals run once and use the site’s existing intersection observer.

### Parallax

Add `data-scene-parallax` to opt into a maximum seven-pixel, scroll-linked image shift. Parallax belongs on large editorial scenes only. Do not apply it to small cards, repeated grids, forms, or interface controls.

### Hover

Fine-pointer devices receive a three-pixel frame lift and a slightly deeper shadow. Touch devices do not receive hover motion.

### Reduced motion

When `prefers-reduced-motion: reduce` is active, reveals are immediately visible, parallax is not initialized, the image is not oversized, and elevation transitions are removed. Never override these protections in page styles.

## Supported scene collection

| Scene | Preferred ratio | Material | Art direction |
| --- | --- | --- | --- |
| Executive Materials | 3:2 | Paper | Existing canonical tabletop brand scene |
| Business Snapshot Report | 4:5 or 3:2 | Paper | Bound report with a restrained executive summary visible |
| Executive Assessment | 4:5 | Paper | Marked assessment pages, scorecard, and priority annotations |
| Improvement Plan | 3:2 | Paper | Sequenced plan, milestone cards, and one gold priority marker |
| Process Mapping | 16:10 | Walnut | Facilitated working session with process map and neutral tools |
| KPI Dashboard | 16:9 | Charcoal | Legible executive dashboard on a dark screen; no invented claims |
| Strategy Session | 16:10 | Walnut | Owner-led working session, natural posture, no staged handshake |
| Automation Workspace | 16:9 | Charcoal | Workflow builder, documentation, and a practical operating context |

## Artwork production standard

- Create source artwork at a minimum of 2400 pixels on the long edge.
- Compose for the selected aspect ratio rather than relying on a severe crop.
- Keep important content inside the central 80 percent safe area.
- Use soft directional light, warm ivory paper, charcoal tools, subtle walnut, and minimal gold.
- Favor realistic business artifacts over decorative office props.
- Keep screens and document text sparse enough to avoid illegible or invented copy.
- Do not include unsupported performance claims, fabricated client names, awards, or metrics.
- Do not bake the Rogers Holdings logo into every scene. Use it only where a real report cover, folio, or branded material would naturally carry it.
- Export final web artwork as AVIF or WebP when browser support and the publishing workflow permit; keep a high-quality PNG master only as a source asset.
- Use descriptive filenames such as `rh-business-snapshot-report-01.webp`.

## Placement rules

- Prefer one primary executive scene per section.
- Let the scene support nearby copy; do not repeat the same information inside the image.
- Use `loading="lazy"` below the first viewport. A first-viewport scene may use `fetchpriority="high"` if performance testing supports it.
- Always supply intrinsic width and height to prevent layout shift.
- Prefer a `<picture>` source set with AVIF, WebP, and JPEG fallback. The
  Executive Materials scene uses 480px and 768px derivatives and a maximum
  display width of 620px.
- Write alternative text that describes the meaningful artifact, not its visual style.
- Do not put text or buttons over executive artwork.
- Do not combine the executive frame with an additional page-specific border or shadow.

## Responsive standard

- Desktop: retain the selected aspect ratio and full caption.
- Tablet: allow the scene to become a full-width column without changing its frame.
- Mobile: retain the scene ratio, reduce the mat, and stack caption context beneath the label.
- If fine details become unreadable on mobile, create a mobile crop of the same artwork and use `<picture>`; do not enlarge the whole page or introduce horizontal scrolling.

## Quality checklist

Before publishing a new scene:

1. Check it at desktop, tablet, and mobile widths.
2. Confirm the focal point remains visible at the component’s selected ratio.
3. Confirm intrinsic dimensions prevent layout shift.
4. Test with reduced motion enabled.
5. Check that hover does not suggest the image is a link when it is not interactive.
6. Confirm alternative text and caption are factual and non-duplicative.
7. Confirm there is no clipped content, horizontal overflow, or page-specific frame override.
8. Compare the scene with Executive Materials; they should feel like one visual family.
