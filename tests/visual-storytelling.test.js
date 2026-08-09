const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/site.css'), 'utf8');
const visualFirstWorkflow = fs.readFileSync(path.join(root, 'docs/ROGERS_HOLDINGS_VISUAL_FIRST_WORKFLOW.md'), 'utf8');
const eastlandFreeze = fs.readFileSync(path.join(root, 'docs/design-source/EASTLAND_FINAL_APPROVED_FREEZE.md'), 'utf8');
const homepageHeroFreeze = fs.readFileSync(path.join(root, 'docs/design-source/HOMEPAGE_HERO_V2_FINAL_APPROVED_FREEZE.md'), 'utf8');
const homepageAssets = path.join(root, 'assets/images/homepage');
const eastlandReference = path.join(root, 'docs/design-reference/eastland-client-work-FINAL-REFERENCE.png');

const families = [
  ['executive-snapshot-hero', 'desktop', 2560, 960],
  ['executive-snapshot-hero', 'tablet', 1600, 1200],
  ['executive-snapshot-hero', 'mobile', 960, 1280],
  ['homepage-hero-v2', 'desktop', 1536, 1024],
  ['homepage-hero-v2', 'tablet', 1600, 1200],
  ['homepage-hero-v2', 'mobile', 960, 1280],
  ['homepage-hero-v2.1', 'desktop', 1536, 1024],
  ['homepage-hero-v2.1', 'tablet', 1600, 1200],
  ['homepage-hero-v2.1', 'mobile', 960, 1280],
  ['eastland-product-family', 'desktop', 2400, 1244],
  ['eastland-product-family', 'tablet', 1600, 957],
  ['eastland-product-family', 'mobile', 960, 757]
];

const files = fs.readdirSync(homepageAssets).sort();
const productionFiles = files.filter((file) =>
  !file.startsWith('homepage-hero-v2-desktop-proof.')
);
assert.equal(productionFiles.length, 36, 'homepage production directory must contain exactly 36 production derivatives including preserved Hero V2 and final Hero V2.1 responsive assets');
for (const [family, viewport] of families) {
  for (const extension of ['avif', 'webp', 'jpg']) {
    const asset = `${family}-${viewport}.${extension}`;
    assert.ok(files.includes(asset), `missing homepage production derivative: ${asset}`);
    assert.ok(fs.statSync(path.join(homepageAssets, asset)).size > 0, `${asset} must not be empty`);
  }
}

const heroStart = html.indexOf('<figure class="homepage-hero-media"');
const heroEnd = html.indexOf('</figure>', heroStart);
const hero = html.slice(heroStart, heroEnd);
const eastlandStart = html.indexOf('<picture class="homepage-eastland-picture"');
const eastlandEnd = html.indexOf('</picture>', eastlandStart);
const eastland = html.slice(eastlandStart, eastlandEnd);

for (const [markup, family, viewport] of [
  [hero, 'homepage-hero-v2.1', 'mobile'],
  [hero, 'homepage-hero-v2.1', 'tablet'],
  [hero, 'homepage-hero-v2.1', 'desktop'],
  [eastland, 'eastland-product-family', 'mobile'],
  [eastland, 'eastland-product-family', 'tablet'],
  [eastland, 'eastland-product-family', 'desktop']
]) {
  const avif = markup.indexOf(`${family}-${viewport}.avif`);
  const webp = markup.indexOf(`${family}-${viewport}.webp`);
  const jpg = markup.indexOf(`${family}-${viewport}.jpg`);
  assert.ok(avif >= 0 && webp > avif && jpg > webp, `${family} ${viewport} sources must be ordered AVIF, WebP, JPG`);
}

assert.match(hero, /media="\(min-width: 1101px\)" type="image\/avif" srcset="assets\/images\/homepage\/homepage-hero-v2\.1-desktop\.avif"/);
assert.match(hero, /width="1536" height="1024" loading="eager" fetchpriority="high" decoding="async"/);
assert.match(eastland, /width="2400" height="1244" loading="lazy" decoding="async"/);
assert.match(eastland, /alt="Eastland First Church of God client-work presentation across desktop, laptop, tablet, and phone displays on a warm executive desk, with the digital discovery journey below"/);
assert.ok(html.includes('Fictional sample shown for demonstration. North Point Fitness is fictional.'));

for (const [, , width, height] of families) assert.ok(width > 0 && height > 0);

const sectionOrder = [
  'class="hero phase3-hero"',
  'class="homepage-value-strip"',
  'class="homepage-eastland-showcase"',
  'class="section phase3-method"',
  'class="section phase3-capabilities"',
  'class="section phase3-platform"',
  'class="section phase3-owner"',
  'class="section phase3-final-cta"'
].map((marker) => html.indexOf(marker));
assert.ok(sectionOrder.every((position) => position >= 0));
assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b), 'homepage sections must follow the approved primary and secondary order');

for (const copy of [
  'How Rogers Holdings works', 'Assess, Prioritize, Improve methodology',
  'Free Business Snapshot through Ongoing Optimization customer journey',
  'Business Optimization Platform', 'Facebook was the primary online presence, with no dedicated website',
  'The Digital Discovery Journey', 'Discover', 'Audit', 'Strategy', 'Build', 'Optimize', 'Grow',
  'Owner-led by design', 'Why Rogers Holdings', 'A clear place to begin'
]) assert.ok(html.includes(copy), `missing preserved secondary content: ${copy}`);

assert.doesNotMatch(html, /class="section phase3-problem"|class="section phase3-principles"/);

assert.ok(html.includes('Visitors now have a clearer mobile path to essential information, ministries, and contact.'));
assert.doesNotMatch(html + css, /eastland-case-intro|eastland-before-callout|Before Rogers Holdings/);
for (const fact of ['fragmented and difficult to find', 'limiting search visibility', 'service times, ministries, messages, giving, directions, and contact']) {
  assert.ok(html.includes(fact), `missing consolidated Eastland challenge fact: ${fact}`);
}
assert.doesNotMatch(html + css, /eastland-device-stage|eastland-device-screen|eastland-device--|eastland-browser-bar|eastland-laptop-base|eastland-monitor-stand/);
assert.doesNotMatch(html, /north-point-snapshot-scene-/);
assert.doesNotMatch(html, /phase3-case-client|phase3-case-logo|eastland-project-logo\.jpg|<span>Status<\/span>|<span>Location<\/span>|<span>Project<\/span>/);

const workspaceStart = html.indexOf('<figure class="eastland-workspace"');
const workspaceEnd = html.indexOf('</figure>', workspaceStart);
const workspace = html.slice(workspaceStart, workspaceEnd);
assert.doesNotMatch(workspace + css, /eastland-screen--|class="eastland-screen"/, 'runtime screen overlays must remain retired');
const eastlandReferenceHash = crypto.createHash('sha256').update(fs.readFileSync(eastlandReference)).digest('hex');
assert.equal(eastlandReferenceHash, '516d0b764d82f2ac1b451ca0194602da2abe7e3e57ea94d9218d1dde693acb62', 'authoritative Eastland reference changed');
assert.match(html, /class="eastland-discovery sr-only"/, 'the image-baked journey must not be duplicated visually');
assert.match(css, /\.eastland-project-links \{[\s\S]*position: absolute;/, 'functional Eastland links must overlay their image-baked labels');
assert.match(visualFirstWorkflow, /Design the composition visually in ChatGPT first/);
assert.match(visualFirstWorkflow, /Create optimized production derivatives from the exact authoritative source/);
assert.match(visualFirstWorkflow, /Use cropping and resizing only/);
assert.match(visualFirstWorkflow, /do not casually reopen the visual during unrelated website work/);
assert.match(eastlandFreeze, /sole visual source/);
assert.match(eastlandFreeze, /No reconstructed device scene, runtime screen overlay, or generated replacement is approved for production/);
assert.match(eastlandFreeze, /The image carries the approved visual presentation/);
assert.match(homepageHeroFreeze, /approved photographic master contains the authentic page 1 of the Rogers Holdings Executive Brief/);
assert.match(homepageHeroFreeze, /Production derivatives/);
assert.match(homepageHeroFreeze, /DO NOT REGENERATE, RECONSTRUCT, RECOMPOSE, OR EDIT THIS VISUAL/);

assert.match(html, /href="https:\/\/www\.eastlandfirstchurchofgod\.com" target="_blank" rel="noopener noreferrer">.*View Live Website/);
assert.match(html, /href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=Eastland\+First\+Church\+of\+God%2C\+1706\+Old\+Owingsville\+Rd%2C\+Mt\+Sterling%2C\+KY\+40353" target="_blank" rel="noopener noreferrer">.*View Google Listing/);
assert.equal((html.match(/class="eastland-evidence-icon"/g) || []).length, 4, 'Eastland evidence band must use four decorative circular icons');
assert.equal((html.match(/class="eastland-link-icon"/g) || []).length, 0, 'Eastland project links must use the reference editorial treatment');
assert.equal((html.match(/role="listitem"/g) || []).length, 6, 'Eastland journey must contain six reference stages');
assert.match(css, /Homepage primary and secondary composition — canonical reference-match system/);
assert.doesNotMatch(html, /Rogers Holdings gave our church|Draft testimonial copy/);
assert.doesNotMatch(html, /BOP interface|Family Vault|workers\.dev|localhost|staging/i);

const heroMaster = path.join(root, 'docs/design-source/homepage-hero-v2-FINAL-AUTHENTIC-MASTER.png');
const heroMasterHash = crypto.createHash('sha256').update(fs.readFileSync(heroMaster)).digest('hex');
assert.equal(heroMasterHash, '02238a7a536a004970a03a332ee083efaf80cecbcf8034f73ae6bf9bb34101bc', 'frozen Hero V2 master changed');

for (const term of [
  'Free Business Snapshot', 'Get Your Free Business Snapshot', 'Executive Brief',
  'Discovery Conversation', 'Digital Business Assessment', 'Improvement Plan',
  'Implementation Services', 'Ongoing Optimization'
]) assert.ok(html.includes(term), `missing canonical Business Snapshot term: ${term}`);

assert.doesNotMatch(html, /Request Your Business Snapshot|phase3-snapshot-proof|visual-proof-pair|eastland-visual-stage/);

console.log('Visual storytelling contract tests passed');
