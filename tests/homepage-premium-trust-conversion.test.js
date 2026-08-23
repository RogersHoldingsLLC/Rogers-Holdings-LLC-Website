const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8');
const script = fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8');

const primaryCta = 'Request Your Free Business Snapshot';
assert.equal((html.match(new RegExp(primaryCta, 'g')) || []).length, 2);
assert.equal((html.match(/<p class="phase3-hero-note">Free Business Snapshot · Human-reviewed · Executive Brief typically within three business days<\/p>/g) || []).length, 1);
assert.equal((html.match(/<p class="phase3-cta-assurance">Free Business Snapshot · Human-reviewed · Executive Brief typically within three business days · No sales call required<\/p>/g) || []).length, 1);

assert.match(html, /<section class="section phase3-method" id="approach"/);
assert.match(html, /class="phase3-method-sequence" id="process"/);
assert.doesNotMatch(html, /<section class="section phase3-process"/);
assert.match(html, /aria-label="Assess, Prioritize, Improve methodology"/);
assert.match(html, /aria-label="Free Business Snapshot through Ongoing Optimization customer journey"/);
assert.equal((html.match(/class="phase3-process-substage"/g) || []).length, 2);
assert.match(html, /<h2>Start free\.<\/h2><p class="phase3-method-sequence-subtitle">Continue with paid support only when it makes sense\.<\/p>/);
assert.match(html, /id="business-friction-heading">Does any of this sound familiar\?<\/h2>/);
assert.match(html, /Good systems should make business easier—not harder\./);
const journeyStart = html.indexOf('<ol class="phase3-process-sequence"');
const journeyEnd = html.indexOf('</ol>', journeyStart);
assert.equal((html.slice(journeyStart, journeyEnd).match(/<li data-reveal>/g) || []).length, 5);

for (const heading of [
  'I need more customers',
  'I’m wasting too much time',
  'My business is disorganized',
  'My website isn’t doing its job',
  'I want to use AI, but I don’t know where it actually helps',
  'I know something isn’t working, but I’m not sure what'
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
  assert.match(html, new RegExp(capability));
}

for (const band of ['Customer growth', 'Time + organization', 'Direction + technology']) {
  assert.ok(html.includes(band));
}
assert.match(html, /<h2>What can we help you fix\?<\/h2>/);
assert.doesNotMatch(html, /Business Optimization Platform|class="section phase3-platform"/);
assert.match(html, /<h2 id="eastland-client-work-heading">See our work in action\.<\/h2>/);
assert.match(html, /A real problem\. A practical fix\. A better way forward\./);
assert.doesNotMatch(html, /<h2 id="eastland-client-work-heading">Selected Client Work<\/h2>/);
assert.match(html, /class="eastland-project-links" aria-label="Eastland project links"/);
assert.doesNotMatch(html, /class="eastland-project-actions"/);
assert.match(html, /From a Facebook-first presence to a clear digital front door\./);
assert.match(html, /Eastland now has an owned digital front door that is easier to find, easier to use, and easier to maintain\./);
assert.match(html, /class="homepage-venture-showcase" id="ventures" aria-labelledby="hew-venture-heading"/);
assert.match(html, /<p class="eyebrow eyebrow-light">Rogers Holdings Venture<\/p>/);
assert.match(html, /class="container hew-venture-masthead" data-reveal/);
assert.match(html, /<h2 id="hew-venture-heading">HEW Gates &amp; Garage<\/h2>/);
assert.match(html, /<p class="hew-venture-logo-company">A Rogers Holdings LLC company\.<\/p>/);
assert.equal((html.match(/A Rogers Holdings LLC company\./g) || []).length, 1, 'HEW ownership label must appear once');
assert.doesNotMatch(html, /Built by Rogers Holdings\.|local-search foundation, and inquiry workflow working as one system/);
assert.match(html, /href="https:\/\/rogersholdingsllc\.com\/hew-gates-garage\/" target="_blank" rel="noopener noreferrer">View Live Site/);
assert.match(html, /class="hew-venture-preview-bar" aria-hidden="true"/);
assert.match(html, /aria-label="View the live HEW Gates and Garage site in a new tab"/);
for (const capability of ['Standalone identity', 'Mobile lead generation', 'Local discovery', 'Static delivery', 'Email inquiry flow']) {
  assert.ok(html.includes(capability), `missing HEW venture capability: ${capability}`);
}
const hewStart = html.indexOf('<section class="homepage-venture-showcase"');
const hewEnd = html.indexOf('</section>', hewStart);
const hewVenture = html.slice(hewStart, hewEnd);
assert.doesNotMatch(hewVenture, /client project|client work|testimonial|customers served|leads generated/i);
assert.match(css, /\.hew-venture-build \{[\s\S]*?grid-template-columns: repeat\(5/);
assert.match(css, /\.hew-venture-preview > a:focus-visible \{ outline: 3px solid var\(--color-champagne\)/);
assert.match(css, /\.home-page \.homepage-venture-showcase,/);
assert.match(html, /href="business-snapshot\/" data-report-link>Request Your Free Business Snapshot/);

assert.match(html, /class="phase3-founder-portrait"/);
assert.match(html, /src="assets\/images\/digital-business-card\/brian-keith-rogers\.jpg" width="576" height="720" loading="lazy"/);
assert.match(html, /<strong>Brian Keith Rogers<\/strong><span>Founder, Rogers Holdings LLC<\/span>/);
assert.match(html, /<h2><span>Christ-like service\.<\/span><span>Honest guidance\.<\/span><span>Personal accountability\.<\/span><\/h2>/);
assert.match(html, /My faith shapes how I do business: tell the truth, serve people well, keep my word, and steward every resource responsibly\./);
for (const commitment of ['Lead with integrity', 'Serve before selling', 'Own the work', 'Practice good stewardship']) {
  assert.match(html, new RegExp(commitment));
}

assert.match(css, /\.home-page\.menu-open \.site-header[\s\S]*?backdrop-filter: none/);
assert.match(css, /\.home-page \.primary-nav\.is-open[\s\S]*?min-height: calc\(100dvh - 72px\)/);
assert.match(css, /Homepage primary and secondary composition — canonical reference-match system/);
assert.match(css, /\.homepage-value-heading h2 \{ max-width: none;[\s\S]*?white-space: nowrap; \}/);
assert.match(css, /\.homepage-value-title-row \{ display: block; \}/);
assert.match(css, /\.eastland-showcase-intro[\s\S]*?text-align: center;/);
assert.match(css, /@media \(max-width: 360px\)[\s\S]*?\.eastland-showcase-intro h2 \{ font-size: 22px; \}/);
assert.match(css, /\.homepage-value-strip \.phase3-problem-list[\s\S]*?grid-template-columns: repeat\(4/);
assert.match(css, /\.eastland-story-timeline[\s\S]*?grid-template-columns: repeat\(4/);
assert.match(css, /\.eastland-showcase-intro[\s\S]*?padding-block: clamp\(30px, 3\.5vw, 50px\)/);
assert.match(css, /\.eastland-project-links \{[\s\S]*?position: absolute;/);
assert.match(css, /\.eastland-project-heading h2 \{ max-width: none;/);
assert.match(css, /@supports \(content-visibility: auto\)/);
assert.match(css, /Homepage responsive viewport calibration/);
assert.match(css, /@media \(min-width: 1600px\)[\s\S]*?\.home-page \{ --container: 1440px; \}/);
assert.match(css, /\.phase3-capabilities > \.container \{ display: block; \}/);
assert.match(css, /\.phase3-capabilities \.phase3-editorial-header[\s\S]*?text-align: center;/);
assert.match(css, /\.phase3-capabilities \.phase3-editorial-header h2[\s\S]*?white-space: nowrap;/);
assert.match(css, /\.phase3-method-sequence-heading \{ text-align: center; \}/);
assert.match(css, /\.phase3-method-sequence-heading h2[\s\S]*?max-width: none;[\s\S]*?white-space: nowrap;/);
assert.match(css, /@media \(min-width: 1101px\) and \(max-height: 820px\)[\s\S]*?\.phase3-hero-layout \{ padding-block: 108px 46px; \}/);
assert.match(css, /@media \(min-width: 961px\) and \(max-width: 1100px\) and \(orientation: landscape\)/);
assert.match(css, /@media \(min-width: 2201px\)[\s\S]*?\.eastland-workspace \{ max-width: 2200px/);
assert.match(html, /rel="preload" as="image" href="assets\/images\/homepage\/homepage-hero-v2\.2-desktop\.avif"/);
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
