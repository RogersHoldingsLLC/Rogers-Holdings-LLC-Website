const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/site.css'), 'utf8');
const proof = path.join(root, 'assets/images/proof');

const requiredBases = [
  'eastland-google-business-profile', 'eastland-website-mobile-safari'
];
for (const base of requiredBases) {
  for (const ext of ['jpg', '480.webp', '768.webp', '1200.webp', '480.avif', '768.avif', '1200.avif']) {
    assert.ok(fs.existsSync(path.join(proof, `${base}-${ext}`)) || fs.existsSync(path.join(proof, `${base}.${ext}`)), `missing proof derivative ${base}-${ext}`);
  }
}

assert.doesNotMatch(html, /north-point-assessment-|north-point-plan-/);
assert.ok(html.includes('Behind every assessment is Rogers Holdings’ internal Business Optimization Platform'));
for (const label of ['Facebook community', 'Google Search', 'Google Business Profile', 'Official website', 'Visit / Ministries / Contact']) assert.ok(html.includes(label), `missing Eastland journey label: ${label}`);
assert.ok(html.includes('previously relied on Facebook as its primary online presence'));
assert.ok(html.includes('Visitors now have a clearer mobile path to essential information, ministries, and contact.'));
assert.ok(html.includes('eastland-device--laptop') && html.includes('eastland-device--phone'));
assert.ok(html.includes('eastland-device--monitor') && html.includes('eastland-device--tablet'));
const stageStart = html.indexOf('<div class="eastland-device-stage"');
const journeyStart = html.indexOf('<div class="eastland-journey"', stageStart);
const eastlandStage = stageStart >= 0 && journeyStart > stageStart ? html.slice(stageStart, journeyStart) : '';
assert.ok(eastlandStage.includes('eastland-website-mobile-safari-1200.avif'));
assert.doesNotMatch(eastlandStage, /eastland-facebook|facebook-primary|facebook\.com/i);
assert.ok(eastlandStage.includes('eastland-website-desktop-live.jpg'));
assert.ok(eastlandStage.includes('eastland-website-tablet-live.jpg'));
for (const asset of [
  'eastland-website-desktop-live.jpg', 'eastland-website-desktop-live-768.avif', 'eastland-website-desktop-live-1200.webp',
  'eastland-website-tablet-live.jpg', 'eastland-website-tablet-live-480.avif', 'eastland-website-tablet-live-768.webp'
]) assert.ok(fs.existsSync(path.join(proof, asset)), `missing live viewport proof asset: ${asset}`);
assert.doesNotMatch(html, /Rogers Holdings gave our church|Draft testimonial copy/);
assert.ok(html.includes('phase3-snapshot-scene'));
for (const viewport of ['desktop', 'tablet', 'mobile']) {
  for (const extension of ['avif', 'webp', 'jpg']) {
    const asset = `north-point-snapshot-scene-${viewport}.${extension}`;
    assert.ok(html.includes(asset), `missing Executive Snapshot scene reference: ${asset}`);
    assert.ok(fs.existsSync(path.join(proof, asset)), `missing Executive Snapshot scene asset: ${asset}`);
  }
}
assert.ok(html.includes('Fictional sample shown for demonstration. North Point Fitness is fictional.'));
assert.ok(html.includes('snapshot-composite'));
const proofReferences = new Set([...html.matchAll(/(?:src|srcset)=["']([^"']+)["']/g)]
  .flatMap(([, value]) => value.split(',').map((entry) => entry.trim().split(/\s+/)[0]))
  .filter((value) => value.includes('assets/images/proof/')));
assert.equal(proofReferences.size, 37, 'homepage must reference exactly the approved 37 proof assets');
assert.doesNotMatch(html, /phase3-snapshot-report/);
assert.match(css, /phase3-method-sequence\s*\{[^}]*display:\s*block/s);
assert.match(css, /eastland-device-stage\s*\{[^}]*grid-template-columns:/s);
assert.match(css, /eastland-device--monitor \.eastland-device-screen[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
assert.match(css, /eastland-device--phone[^}]*border-radius/);
assert.match(css, /eastland-browser-bar[^}]*grid-template-columns:/);
assert.ok(html.includes('eastland-google-business-profile.jpg') && html.includes('eastland-website-tablet-live.jpg'));
assert.ok(!html.includes('eastland-context-proofs') && !html.includes('eastland-proof-grid'));
assert.ok(html.includes('eastland-before-callout'));
assert.ok(html.includes('primarily relied on Facebook as its online presence'));
assert.ok(!html.includes('eastland-facebook-presence'));
assert.ok(!html.includes('Mobile-first client work'));
assert.ok(css.includes('.eastland-journey'));
assert.ok((html.match(/loading="lazy"/g) || []).length >= 6, 'below-the-fold images should lazy-load');
assert.ok(!/briankeith@|859-404-7300|api\.rogers|requestId|password|secret/i.test(fs.readdirSync(proof).join('\n')));
assert.ok(!/BOP interface|Family Vault|workers\.dev|localhost|staging/i.test(html), 'private or non-production references leaked into homepage');

console.log('Visual storytelling contract tests passed');
