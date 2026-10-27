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

const labels = ['Approach', 'Process', 'Services', 'Our Work', 'About', 'Contact'];
for (const [name, html] of [['homepage', home], ['Business Snapshot', snapshot], ['Privacy', privacy]]) {
  for (const label of labels) {
    const expected = label === 'Process' ? 'Free Business Snapshot' : label;
    assert.ok(html.includes(`>${expected}</a>`), `${name} missing ${expected}`);
  }
  assert.match(html, /site\.js\?v=whole-site-refinement-1/);
}

assert.match(home, /site\.css\?v=snapshot-pdf-20261027/);
assert.match(snapshot, /site\.css\?v=service-review-20261026/);
assert.match(privacy, /site\.css\?v=service-review-20261026/);

assert.ok(home.includes('Request Your Free Business Snapshot'));
assert.ok(snapshot.includes('Request Your Free Business Snapshot'));
assert.ok(snapshot.includes('Request My Free Business Snapshot'));
assert.ok(home.includes('class="snapshot-brief"'));
assert.doesNotMatch(home, /homepage-hero-v2\.2-(desktop|tablet|mobile)/, 'readable HTML sample replaces the desk-photo download');
assert.ok(home.includes('Illustrative Executive Brief sample — North Point Fitness is a fictional business. Shown to demonstrate the format and level of detail.'));
assert.doesNotMatch(home, /visual-proof-pair|north-point-assessment-|north-point-plan-|phase3-snapshot-proof/);
assert.doesNotMatch(snapshot, /homepage-hero-v2\.2|north-point-|<picture class="snapshot-hero__media"/);
assert.match(snapshot, /Get a second look at your next step\./);
assert.match(snapshot, /class="snapshot-summary"/);
assert.doesNotMatch(snapshot, /snapshot-value-strip|snapshot-hero-secondary/);
assert.match(snapshot, /<\/section>\s*<section class="section intake-section" aria-labelledby="snapshot-section-heading">/);

const homepageHead = home.slice(0, home.indexOf('</head>'));
const homepageBody = home.slice(home.indexOf('<body'));
for (const term of ['Free Business Snapshot', 'Executive Brief', 'Website Creation', 'Excel & Google Sheets Repair']) {
  assert.ok(homepageHead.includes(term), `homepage structured data missing canonical service term: ${term}`);
}
for (const retiredJourneyLabel of ['Discovery Conversation', 'Digital Business Assessment', 'Improvement Plan', 'Implementation Services', 'Ongoing Optimization']) {
  assert.ok(!homepageBody.includes(retiredJourneyLabel), `homepage must not render expanded journey label: ${retiredJourneyLabel}`);
}
assert.ok(homepageBody.includes('See what deserves attention before choosing a project.'));
assert.ok(homepageBody.includes('why the suggested next step makes sense'));

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
assert.match(css, /\.home-page \.phase3-hero::before\s*\{[^}]*display:\s*none/);
assert.match(css, /@media \(min-width:\s*1101px\)\s*\{\s*\.homepage-hero-media img\s*\{[^}]*left:\s*auto;[^}]*width:\s*92%/);
assert.match(css, /\.home-page section\[id\]\s*\{[^}]*scroll-margin-top:\s*92px/);
assert.match(css, /\.snapshot-page \.field-error\s*\{[\s\S]*?min-height:/);
assert.match(css, /\.legal-content\s*\{[\s\S]*?780px/);

const showcaseStart = home.indexOf('<picture class="homepage-eastland-picture"');
const showcaseEnd = home.indexOf('</picture>', showcaseStart);
const showcase = home.slice(showcaseStart, showcaseEnd);
assert.ok(showcase.includes('eastland-product-family-desktop'));
assert.ok(showcase.includes('eastland-product-family-tablet'));
assert.doesNotMatch(showcase, /eastland-product-family-mobile/);
assert.doesNotMatch(showcase, /facebook/i);

assert.doesNotMatch(home + snapshot + privacy, /localhost|workers\.dev|preview_url|TURNSTILE_SECRET_KEY/i);

console.log('Whole-site refinement contract tests passed');

for (const page of [home, snapshot, privacy]) { const nav = page.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)[0]; assert.equal((nav.match(/>Free Business Snapshot<\/a>/g) || []).length,1); assert.doesNotMatch(nav, />Business Snapshot<\/a>|>Free Snapshot<\/a>/); }
