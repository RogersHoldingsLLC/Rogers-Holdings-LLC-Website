const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const homepage = read('index.html');
const snapshot = read('business-snapshot/index.html');
const privacy = read('privacy/index.html');
const css = read('assets/css/site.css');
const visualSystem = read('docs/EXECUTIVE_VISUAL_SYSTEM.md');

assert.match(snapshot, /<footer class="site-footer">[\s\S]*?rogers-holdings-logo-reversed\.png/);
assert.match(privacy, /<footer class="site-footer">[\s\S]*?rogers-holdings-logo-reversed\.png/);
assert.doesNotMatch(snapshot, /<footer[\s\S]*?rogers-holdings-logo\.png/);
assert.doesNotMatch(privacy, /<footer[\s\S]*?rogers-holdings-logo\.png/);
assert.match(homepage, /<picture>[\s\S]*?rh-executive-materials-01-480\.avif 480w/);
assert.match(homepage, /rh-executive-materials-01-768\.webp 768w/);
assert.match(homepage, /src="assets\/images\/brand\/rh-executive-materials-01-768\.jpg" width="768" height="512" loading="lazy"/);
assert.doesNotMatch(homepage, /<img[^>]+src="assets\/images\/brand\/rh-executive-materials-01\.png"/);
assert.match(homepage, /sizes="\(max-width: 680px\)[^"]+620px/);
assert.match(css, /grid-template-columns: minmax\(420px, \.95fr\) minmax\(0, 1\.05fr\)/);
assert.match(css, /\.phase3-owner figure \{[\s\S]*?max-width: 620px/);
assert.match(visualSystem, /Light backgrounds use/);
assert.match(visualSystem, /Dark or black backgrounds use/);

for (const asset of [
  'assets/images/brand/rogers-holdings-logo-reversed.png',
  'assets/images/brand/rh-executive-materials-01-480.avif',
  'assets/images/brand/rh-executive-materials-01-768.avif',
  'assets/images/brand/rh-executive-materials-01-480.webp',
  'assets/images/brand/rh-executive-materials-01-768.webp',
  'assets/images/brand/rh-executive-materials-01-768.jpg'
]) {
  const stat = fs.statSync(path.join(ROOT, asset));
  assert.ok(stat.size > 0, `${asset} must not be empty`);
  if (!asset.endsWith('reversed.png')) assert.ok(stat.size < 300_000, `${asset} must remain below 300 KB`);
}

console.log('Sitewide brand-asset contract tests passed.');
