const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/site.css'), 'utf8');
const proof = path.join(root, 'assets/images/proof');

const requiredBases = [
  'north-point-assessment-cover', 'north-point-assessment-briefing', 'north-point-assessment-findings', 'north-point-assessment-roadmap',
  'north-point-plan-cover', 'north-point-plan-deliverables', 'north-point-plan-timeline', 'north-point-plan-next-steps',
  'eastland-facebook-presence', 'eastland-google-business-profile', 'eastland-website-desktop', 'eastland-website-mobile-detail'
];
for (const base of requiredBases) {
  for (const ext of ['jpg', '480.webp', '768.webp', '1200.webp', '480.avif', '768.avif', '1200.avif']) {
    assert.ok(fs.existsSync(path.join(proof, `${base}-${ext}`)) || fs.existsSync(path.join(proof, `${base}.${ext}`)), `missing proof derivative ${base}-${ext}`);
  }
}

assert.ok(html.includes('Inside a Business Assessment'));
assert.ok(html.includes('From assessment to action'));
assert.ok(html.includes('Illustrative example using fictional business information'));
assert.ok(html.includes('Behind every assessment is Rogers Holdings’ internal Business Optimization Platform'));
for (const label of ['Facebook community', 'Google Search', 'Google Business Profile', 'Official website', 'Visit / Ministries / Contact']) assert.ok(html.includes(label), `missing Eastland journey label: ${label}`);
assert.ok(html.includes('previously relied on Facebook as its primary online presence'));
assert.ok(html.includes('Visitors now have a clearer mobile path to essential information, ministries, and contact.'));
assert.ok(html.includes('eastland-laptop-mockup') && html.includes('eastland-iphone-mockup'));
assert.ok(html.includes('eastland-browser-proof') && html.includes('eastland-google-business-profile.jpg'));
assert.ok(html.includes('eastland-context-proofs') && !html.includes('eastland-proof-grid'));
assert.ok(!html.includes('Mobile-first client work'));
assert.ok(css.includes('.visual-proof-grid') && css.includes('.eastland-journey'));
assert.ok((html.match(/loading="lazy"/g) || []).length >= 10, 'proof images should lazy-load');
assert.ok(!/briankeith@|859-404-7300|api\.rogers|requestId|password|secret/i.test(fs.readdirSync(proof).join('\n')));
assert.ok(!/BOP interface|Family Vault|workers\.dev|localhost|staging/i.test(html), 'private or non-production references leaked into homepage');

console.log('Visual storytelling contract tests passed');
