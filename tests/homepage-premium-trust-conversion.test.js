const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8');
const script = fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8');

const primaryCta = 'Get Your Free Business Snapshot';
assert.equal((html.match(new RegExp(primaryCta, 'g')) || []).length, 3);
assert.equal((html.match(/Complimentary written review · Human-reviewed · Typically within three business days/g) || []).length, 1);
assert.equal((html.match(/Free · Human-reviewed · Typically within three business days/g) || []).length, 1);

assert.match(html, /<section class="section phase3-method" id="process">/);
assert.doesNotMatch(html, /<section class="section phase3-process"/);
assert.match(html, /aria-label="Assess, Prioritize, Improve methodology"/);
assert.match(html, /aria-label="Free Business Snapshot through Ongoing Optimization customer journey"/);

for (const heading of [
  'Visibility &amp; Customer Experience',
  'Workflow &amp; Information Systems',
  'Operational Improvement'
]) {
  assert.match(html, new RegExp(heading));
}
for (const capability of [
  'Digital Optimization',
  'Websites',
  'Google Workspace',
  'Automation',
  'Responsible AI',
  'Operational Consulting'
]) {
  assert.match(html, new RegExp(`<h4>${capability}</h4>`));
}

assert.match(html, /Used internally to organize evidence and priorities\. Clients receive clear findings and next actions—not another platform to manage\./);
assert.match(html, /Visitors now have a clearer mobile path to essential information, ministries, and contact\./);
assert.match(html, /href="business-snapshot\/" data-report-link>Get Your Free Business Snapshot/);

assert.match(html, /<picture>/);
assert.match(html, /rh-executive-materials-01-480\.avif 480w/);
assert.match(html, /rh-executive-materials-01-768\.webp 768w/);
assert.match(html, /src="assets\/images\/brand\/rh-executive-materials-01-768\.jpg" width="768" height="512" loading="lazy"/);

assert.match(css, /\.home-page\.menu-open \.site-header[\s\S]*?backdrop-filter: none/);
assert.match(css, /\.home-page \.primary-nav\.is-open[\s\S]*?min-height: calc\(100dvh - 72px\)/);
assert.match(css, /Homepage primary and secondary composition — canonical reference-match system/);
assert.match(css, /\.homepage-value-strip \.phase3-problem-list[\s\S]*?grid-template-columns: repeat\(4/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.phase3-platform-cta[\s\S]*?transition: none/);
assert.match(script, /if \('IntersectionObserver' in window && !reduceMotion\.matches\)/);
assert.match(script, /if \(parallaxScenes\.length && !reduceMotion\.matches\)/);

assert.doesNotMatch(html, /workers\.dev|data-endpoint-configured|TURNSTILE_SECRET_KEY/);

for (const asset of [
  'assets/images/brand/rh-executive-materials-01-480.avif',
  'assets/images/brand/rh-executive-materials-01-768.avif',
  'assets/images/brand/rh-executive-materials-01-480.webp',
  'assets/images/brand/rh-executive-materials-01-768.webp',
  'assets/images/brand/rh-executive-materials-01-768.jpg'
]) {
  const bytes = fs.statSync(path.join(ROOT, asset)).size;
  assert.ok(bytes > 0, `${asset} must not be empty`);
  assert.ok(bytes < 300_000, `${asset} must remain below 300 KB`);
}

console.log('Homepage premium trust and conversion contract tests passed.');
