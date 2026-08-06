const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const home = read('index.html');
const snapshot = read('business-snapshot/index.html');
const privacy = read('privacy/index.html');
const css = read('assets/css/site.css');
const js = read('assets/js/site.js');
const snapshotDoc = read('docs/BUSINESS_SNAPSHOT_PREMIUM_EXPERIENCE.md');

const labels = ['Approach', 'Process', 'Capabilities', 'Our Work', 'About', 'Contact'];
for (const [name, html] of [['homepage', home], ['Business Snapshot', snapshot], ['Privacy', privacy]]) {
  for (const label of labels) assert.ok(html.includes(`>${label}</a>`), `${name} missing ${label}`);
  assert.ok(html.includes('Request Your Business Snapshot'), `${name} missing normalized CTA`);
  assert.match(html, /site\.js\?v=whole-site-refinement-1/);
}

assert.match(home, /site\.css\?v=target-matching-rebuild-1/);
assert.match(snapshot, /site\.css\?v=whole-site-refinement-1/);
assert.match(privacy, /site\.css\?v=whole-site-refinement-1/);

assert.ok(home.includes('homepage-hero-media'));
assert.ok(home.includes('executive-snapshot-hero-desktop.avif'));
assert.ok(home.includes('executive-snapshot-hero-tablet.avif'));
assert.ok(home.includes('executive-snapshot-hero-mobile.avif'));
assert.doesNotMatch(home, /visual-proof-pair|north-point-assessment-|north-point-plan-/);

assert.match(js, /distance > window\.innerHeight \* 1\.35/);
assert.match(js, /history\.pushState/);
assert.match(js, /window\.location\?\.hash/);
assert.match(js, /link\.classList\.contains\('skip-link'\)/);
assert.match(js, /Secure human verification could not start in this browser or on this preview address/);
assert.match(snapshotDoc, /trycloudflare\.com/);
assert.match(snapshotDoc, /must not be addressed by weakening the production hostname\s+restriction/);

assert.match(css, /\.homepage-hero-media img\s*\{[\s\S]*?object-fit:\s*cover/);
assert.match(css, /\.home-page section\[id\]\s*\{[^}]*scroll-margin-top:\s*92px/);
assert.match(css, /\.snapshot-page \.field-error\s*\{[\s\S]*?min-height:/);
assert.match(css, /\.legal-content\s*\{[\s\S]*?780px/);

const showcaseStart = home.indexOf('<picture class="homepage-eastland-picture"');
const showcaseEnd = home.indexOf('</picture>', showcaseStart);
const showcase = home.slice(showcaseStart, showcaseEnd);
assert.ok(showcase.includes('eastland-product-family-desktop'));
assert.ok(showcase.includes('eastland-product-family-tablet'));
assert.ok(showcase.includes('eastland-product-family-mobile'));
assert.doesNotMatch(showcase, /facebook/i);

assert.doesNotMatch(home + snapshot + privacy, /localhost|workers\.dev|preview_url|TURNSTILE_SECRET_KEY/i);

console.log('Whole-site refinement contract tests passed');
