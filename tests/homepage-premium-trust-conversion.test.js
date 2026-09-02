const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8');
const script = fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8');

const primaryCta = 'Request Your Free Business Snapshot';
assert.equal((html.match(new RegExp(primaryCta, 'g')) || []).length, 3);
assert.equal((html.match(/<p class="phase3-hero-note">Free Business Snapshot · Human-reviewed · Executive Brief typically within three business days<\/p>/g) || []).length, 1);
assert.equal((html.match(/<p class="phase3-cta-assurance">Free Business Snapshot · Human-reviewed · Executive Brief typically within three business days · No sales call required<\/p>/g) || []).length, 1);
assert.ok(html.includes('Rogers Holdings helps small and growing businesses work smarter by improving the websites, workflows, automation, practical AI use, and business systems behind everyday work. The goal is simple: clearer customer paths, less wasted time, better organization, and a business that is easier to run.'));

assert.match(html, /<section class="section phase3-method" id="approach"/);
assert.match(html, /<section class="section phase3-snapshot" id="process"/);
assert.match(html, /aria-label="Assess, Prioritize, Improve methodology"/);
assert.ok(html.includes('A practical place to start'));
assert.ok(html.includes('Get a clear outside view before spending money on the wrong fix.'));
assert.ok(html.includes('Tell us what is not working. Rogers Holdings will review the challenge and visible evidence, then typically within three business days send a concise, human-reviewed Executive Brief.'));
for (const deliverable of [
  'The clearest visible issue',
  'What deserves attention first',
  'A practical recommended next step, with plain-English reasoning'
]) assert.ok(html.includes(deliverable), `missing compact Snapshot deliverable: ${deliverable}`);
const snapshotStart = html.indexOf('<section class="section phase3-snapshot"');
const snapshotEnd = html.indexOf('</section>', snapshotStart);
const snapshotSection = html.slice(snapshotStart, snapshotEnd);
assert.match(snapshotSection, /href="business-snapshot\/" data-report-link>Request Your Free Business Snapshot<\/a>/);
assert.ok(snapshotSection.includes('No sales call required. Use the brief on your own or continue only if further help makes sense.'));
assert.match(html, /id="business-friction-heading">Does any of this sound familiar\?<\/h2>/);
assert.match(html, /Good systems should make business easier—not harder\./);
const body = html.slice(html.indexOf('<body'));
for (const retiredJourneyLabel of [
  'Discovery Conversation',
  'Digital Business Assessment',
  'Improvement Plan',
  'Implementation Services',
  'Ongoing Optimization'
]) assert.doesNotMatch(body, new RegExp(retiredJourneyLabel), `${retiredJourneyLabel} must not be rendered on the homepage`);
assert.doesNotMatch(body, /phase3-method-sequence|phase3-process-sequence|phase3-process-substage/);

const sectionOrder = [
  'class="homepage-value-strip"',
  'class="section phase3-snapshot"',
  'class="section phase3-method"',
  'class="homepage-eastland-showcase"',
  'class="section phase3-capabilities"'
].map((marker) => html.indexOf(marker));
assert.ok(sectionOrder.every((position) => position >= 0));
assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b));

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
assert.match(html, /class="eastland-live-proof__links" aria-label="Eastland project links"/);
assert.doesNotMatch(html, /class="eastland-project-actions"/);
assert.match(html, /From a Facebook-first presence to a clear digital front door\./);
assert.match(html, /Current public experience: A responsive website with clear paths to service information, visit planning, ministries, messages, directions, and contact details\./);
assert.doesNotMatch(body, /easier to find, easier to use, and easier to maintain|free of charge|home church/i);
assert.ok(html.indexOf(primaryCta) < html.indexOf('See the work on the live site'), 'Free Business Snapshot must remain the primary homepage offer');
assert.match(html, /class="button button-dark" href="https:\/\/www\.eastlandfirstchurchofgod\.com"/, 'Eastland live proof must remain visually secondary to the Snapshot offer');
const publicHewPattern = /\bHEW\b|Gates?\s*(?:&|&amp;)\s*Garage|hew-gates-garage|hew-venture|homepage-venture-showcase/i;
assert.doesNotMatch(html, publicHewPattern);
assert.doesNotMatch(css, publicHewPattern);
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
assert.match(css, /\.eastland-live-proof\s*\{[\s\S]*?grid-template-columns:/);
assert.match(css, /\.eastland-project-heading h2 \{ max-width: none;/);
assert.match(css, /@supports \(content-visibility: auto\)/);
assert.match(css, /Homepage responsive viewport calibration/);
assert.match(css, /@media \(min-width: 1600px\)[\s\S]*?\.home-page \{ --container: 1440px; \}/);
assert.match(css, /\.phase3-capabilities > \.container \{ display: block; \}/);
assert.match(css, /\.phase3-capabilities \.phase3-editorial-header[\s\S]*?text-align: center;/);
assert.match(css, /\.phase3-capabilities \.phase3-editorial-header h2[\s\S]*?white-space: nowrap;/);
assert.match(css, /\.phase3-snapshot-layout[\s\S]*?grid-template-columns:/);
assert.match(css, /\.phase3-snapshot-deliverables[\s\S]*?list-style: none;/);
assert.doesNotMatch(css, /phase3-method-sequence|phase3-process-sequence|phase3-process-substage/);
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
