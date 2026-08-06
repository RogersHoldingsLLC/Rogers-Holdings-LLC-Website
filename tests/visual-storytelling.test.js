const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/site.css'), 'utf8');
const homepageAssets = path.join(root, 'assets/images/homepage');

const families = [
  ['executive-snapshot-hero', 'desktop', 2560, 960],
  ['executive-snapshot-hero', 'tablet', 1600, 1200],
  ['executive-snapshot-hero', 'mobile', 960, 1280],
  ['eastland-product-family', 'desktop', 2400, 1200],
  ['eastland-product-family', 'tablet', 1600, 1200],
  ['eastland-product-family', 'mobile', 960, 1200]
];

const files = fs.readdirSync(homepageAssets).sort();
assert.equal(files.length, 18, 'homepage production directory must contain exactly 18 derivatives');
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

for (const [markup, family] of [[hero, 'executive-snapshot-hero'], [eastland, 'eastland-product-family']]) {
  for (const viewport of ['mobile', 'tablet', 'desktop']) {
    const avif = markup.indexOf(`${family}-${viewport}.avif`);
    const webp = markup.indexOf(`${family}-${viewport}.webp`);
    const jpg = markup.indexOf(`${family}-${viewport}.jpg`);
    assert.ok(avif >= 0 && webp > avif && jpg > webp, `${family} ${viewport} sources must be ordered AVIF, WebP, JPG`);
  }
}

assert.match(hero, /width="2560" height="960" loading="eager" fetchpriority="high" decoding="async"/);
assert.match(eastland, /width="2400" height="1200" loading="lazy" decoding="async"/);
assert.match(eastland, /alt="Eastland First Church of God website shown across desktop, laptop, tablet, and phone"/);
assert.ok(html.includes('Fictional sample shown for demonstration. North Point Fitness is fictional.'));

for (const [family, viewport, width, height] of families) {
  assert.ok(html.includes(`${family}-${viewport}.avif`));
  assert.ok(width > 0 && height > 0);
}

const sectionOrder = [
  'class="hero phase3-hero"',
  'class="homepage-value-strip"',
  'class="homepage-eastland-showcase"',
  'class="homepage-proof-statement"',
  'class="section phase3-problem"',
  'class="section phase3-method"',
  'class="section phase3-capabilities"',
  'class="section phase3-platform"',
  'class="section phase3-case"',
  'class="section phase3-owner"',
  'class="section phase3-principles"',
  'class="section phase3-final-cta"'
].map((marker) => html.indexOf(marker));
assert.ok(sectionOrder.every((position) => position >= 0));
assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b), 'homepage sections must follow the approved primary and secondary order');

for (const copy of [
  'Where improvement begins', 'Assess, Prioritize, Improve methodology',
  'Inspect, Understand, Prioritize, Implement, Optimize supporting sequence',
  'Business Optimization Platform', 'previously relied on Facebook as its primary online presence',
  'Facebook community', 'Google Search', 'Google Business Profile', 'Official website',
  'Owner-led by design', 'Why Rogers Holdings', 'A clear place to begin'
]) assert.ok(html.includes(copy), `missing preserved secondary content: ${copy}`);

assert.ok(html.includes('Visitors now have a clearer mobile path to essential information, ministries, and contact.'));
assert.doesNotMatch(html + css, /eastland-device-stage|eastland-device-screen|eastland-device--|eastland-browser-bar|eastland-laptop-base|eastland-monitor-stand/);
assert.doesNotMatch(html, /north-point-snapshot-scene-|assets\/images\/proof\/eastland-website/);
assert.match(css, /Homepage primary and secondary composition — canonical reference-match system/);
assert.doesNotMatch(html, /Rogers Holdings gave our church|Draft testimonial copy/);
assert.doesNotMatch(html, /BOP interface|Family Vault|workers\.dev|localhost|staging/i);

const protectedHashes = {
  'robots.txt': '671cfddfc931a73ea482efb004a3393c7c211eb89d5ef8bd07e26c47701488fb',
  'sitemap.xml': 'db24a6759bf7536b9ded177f4031c7f27ea13ff5950dea46d6a5f9948cca4fab',
  'CNAME': 'eefe67c6afb63ba9787a143313c0586f94a1d4652efa3f0fcf2c90e9acd9aaf8',
  'google914083dd95ef8b05.html': 'ee0bb690b70173629818ade02dcde8cbd3949b9885370908e95471e15de23a2d',
  'privacy/index.html': 'ddf857991c425cbc0a78fb53cd6b8eddcc73b7e8c0fe5791b19ba5c3f4e65e1e',
  'business-snapshot/index.html': '1f798631161832ad9079aa254fc4adc80586d98f488acc61e0b5770901356e5a',
  'assets/js/site.js': 'c036ba92e0470daff3deb11d857fb30aca911c8c3e9c149ed62ff5e8fe09022a'
};
for (const [file, expected] of Object.entries(protectedHashes)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
  assert.equal(actual, expected, `protected operational file changed: ${file}`);
}

console.log('Visual storytelling contract tests passed');
