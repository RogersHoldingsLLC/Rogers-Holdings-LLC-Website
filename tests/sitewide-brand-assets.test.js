const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const homepage = read('index.html');
const snapshot = read('business-snapshot/index.html');
const privacy = read('privacy/index.html');
const css = read('assets/css/site.css');
const visualSystem = read('docs/EXECUTIVE_VISUAL_SYSTEM.md');

assert.match(snapshot, /<footer class="[^"]*site-footer[^"]*">[\s\S]*?rogers-holdings-logo-reversed\.png/);
assert.match(privacy, /<footer class="[^"]*site-footer[^"]*">[\s\S]*?rogers-holdings-logo-reversed\.png/);
assert.doesNotMatch(snapshot, /<footer[\s\S]*?rogers-holdings-logo\.png/);
assert.doesNotMatch(privacy, /<footer[\s\S]*?rogers-holdings-logo\.png/);
assert.equal((homepage.match(/rh-executive-materials-01-/g) || []).length, 0);
assert.equal((homepage.match(/brian-keith-rogers-headshot-original\.png/g) || []).length, 1);
assert.match(homepage, /width="1122" height="1402" loading="lazy"/);
assert.match(css, /grid-template-columns: minmax\(380px, \.84fr\) minmax\(0, 1\.16fr\)/);
assert.match(css, /\.phase3-founder-portrait-frame[\s\S]*?aspect-ratio: 4 \/ 5/);
const founderSource = fs.readFileSync(path.join(ROOT, 'docs/design-reference/founder/brian-keith-rogers-headshot-original.png'));
assert.equal(crypto.createHash('sha256').update(founderSource).digest('hex'), '9bb3f69903b49705abeb212f88bde0ad5200ee5cf60de289e2698a77c467c979');
assert.match(visualSystem, /Light backgrounds use/);
assert.match(visualSystem, /Dark or black backgrounds use/);

for (const asset of ['assets/images/brand/rogers-holdings-logo-reversed.png']) {
  const stat = fs.statSync(path.join(ROOT, asset));
  assert.ok(stat.size > 0, `${asset} must not be empty`);
}
for (const asset of [
  'assets/images/brand/rh-executive-materials-01-480.avif',
  'assets/images/brand/rh-executive-materials-01-768.avif',
  'assets/images/brand/rh-executive-materials-01-480.webp',
  'assets/images/brand/rh-executive-materials-01-768.webp',
  'assets/images/brand/rh-executive-materials-01-768.jpg'
]) {
  const stat = fs.statSync(path.join(ROOT, asset));
  assert.ok(stat.size > 0 && stat.size < 300_000, `${asset} must remain below 300 KB`);
}

console.log('Sitewide brand-asset contract tests passed.');
