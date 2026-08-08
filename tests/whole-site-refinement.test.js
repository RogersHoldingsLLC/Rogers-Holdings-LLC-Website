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
  assert.ok(html.includes('>Business Snapshot</a>'), `${name} missing product navigation label`);
  assert.match(html, /site\.js\?v=whole-site-refinement-1/);
}

assert.match(home, /site\.css\?v=target-matching-rebuild-1/);
assert.match(snapshot, /site\.css\?v=whole-site-refinement-1/);
assert.match(privacy, /site\.css\?v=whole-site-refinement-1/);

assert.ok(home.includes('Get Your Free Business Snapshot'));
assert.ok(snapshot.includes('Get Your Free Business Snapshot'));
assert.ok(home.includes('homepage-hero-media'));
for (const viewport of ['desktop', 'tablet', 'mobile']) assert.ok(home.includes(`homepage-hero-v2-${viewport}.avif`));
assert.doesNotMatch(home, /visual-proof-pair|north-point-assessment-|north-point-plan-|phase3-snapshot-proof/);

for (const term of ['Free Business Snapshot', 'Executive Brief', 'Discovery Conversation', 'Digital Business Assessment', 'Improvement Plan', 'Implementation Services', 'Ongoing Optimization']) {
  assert.ok(home.includes(term), `homepage missing canonical journey term: ${term}`);
}

assert.match(snapshot, /action="https:\/\/intake\.rogersholdingsllc\.com\/api\/business-snapshot"/);
assert.match(snapshot, /data-endpoint-configured="true"/);
assert.match(snapshot, /data-turnstile-widget/);
assert.match(snapshot, /name="consent"[^>]*value="business-snapshot-contact-consent-v1"/);
assert.match(snapshot, /name="company"[^>]*tabindex="-1"/);
assert.match(js, /result\.environment === 'production'/);
assert.match(js, /result\.requestId === requestId/);
assert.match(js, /typeof result\.retry === 'boolean'/);

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
