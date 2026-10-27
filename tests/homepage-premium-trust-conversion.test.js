const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const work = fs.readFileSync(path.join(ROOT, 'our-work/index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8');
const script = fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8');

const primaryCta = 'Request Your Free Business Snapshot';
assert.equal((html.match(new RegExp(primaryCta, 'g')) || []).length, 1);
assert.equal((html.match(/<p class="phase3-hero-note">Start with a short conversation\. Paid work begins with an agreed scope and quote\.<\/p>/g) || []).length, 1);
assert.match(html, /href="mailto:briankeith@rogersholdingsllc\.com\?subject=Project%20Inquiry">Email About Your Project/);
assert.ok(html.includes('We’re Rogers Holdings LLC. We start by understanding your business and what you want to accomplish.'));
const heroMarkup = html.slice(html.indexOf('<section class="hero phase3-hero"'), html.indexOf('<section class="homepage-eastland-showcase"'));
const readingOrder = ['<h1>', 'class="hero-services"', 'class="rh-sculpture"', 'class="hero-lede"', 'class="button-row"'].map(marker => heroMarkup.indexOf(marker));
assert.ok(readingOrder.every(position => position >= 0));
assert.deepEqual(readingOrder, [...readingOrder].sort((a, b) => a - b), 'the practical service line must follow the promise before artwork, founder and actions');
assert.doesNotMatch(heroMarkup, /<br\b/, 'hero copy must wrap responsively');

assert.match(html, /<section class="section phase3-method" id="approach"/);
assert.match(html, /<section class="section phase3-snapshot" id="process"/);
assert.match(html, /aria-label="Understand, Prioritize, Scope and review methodology"/);
assert.ok(html.includes('Optional Free Business Snapshot'));
assert.ok(html.includes('See what deserves attention before choosing a project.'));
assert.ok(html.includes('A website project, a workbook change or a better handoff starts with a decision. The Free Business Snapshot gives you a focused outside view of your goal, the visible evidence and a practical next step—before you agree to paid work.'));
for (const deliverable of [
  'what the visible evidence supports',
  'what deserves attention first',
  'why the suggested next step makes sense'
]) assert.ok(html.includes(deliverable), `missing compact Snapshot deliverable: ${deliverable}`);
const snapshotStart = html.indexOf('<section class="section phase3-snapshot"');
const snapshotEnd = html.indexOf('</section>', snapshotStart);
const snapshotSection = html.slice(snapshotStart, snapshotEnd);
assert.match(snapshotSection, /href="business-snapshot\/" data-report-link>Request Your Free Business Snapshot<\/a>/);
assert.ok(snapshotSection.includes('No sales call required. Use the brief on your own or continue only if further help makes sense.'));
assert.doesNotMatch(html, /class="homepage-value-strip"/, "avoid repeating capability problems before the offers");
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
  'class="hero phase3-hero"',
  'class="homepage-eastland-showcase"',
  'class="section phase3-owner"',
  'class="section phase3-method"',
  'class="section phase3-capabilities"',
  'class="section phase3-snapshot"',
  'class="section phase3-final-cta"'
].map((marker) => html.indexOf(marker));
assert.ok(sectionOrder.every((position) => position >= 0));
assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b));

const serviceOverview = html.slice(html.indexOf('class="service-category-grid"'), html.indexOf('class="service-scope-note"'));
assert.equal((serviceOverview.match(/<h3\b/g) || []).length, 5, 'exactly five service categories are authorized');
for (const heading of ['Websites', 'Spreadsheets', 'Forms &amp; Intake', 'Business Documents &amp; Templates', 'SEO &amp; Local Search Foundations']) {
  assert.ok(new RegExp('<h3(?: [^>]*)?>' + heading + '</h3>').test(serviceOverview), 'missing agreed service category: ' + heading);
}
assert.doesNotMatch(serviceOverview, /Business Tool Setup|Tech Support|Managed IT|AdGrants|Cybersecurity|<h3>[^<]*Workflow/i);
assert.ok(html.includes('If the project is a fit, we agree on the deliverables, price and review before work begins.'));
assert.match(html, /<h2>What do you want to work better\?<\/h2>/);
assert.doesNotMatch(html, /Business Optimization Platform|class="section phase3-platform"/);
assert.match(html, /<h2 id="eastland-client-work-heading">See our work in action\.<\/h2>/);
assert.match(html, /Two client projects, shaped around the work each needed to do\./);
assert.doesNotMatch(html, /<h2 id="eastland-client-work-heading">Selected Client Work<\/h2>/);
assert.match(work, /class="eastland-live-proof__links" aria-label="Eastland project links"/);
assert.doesNotMatch(html, /class="eastland-project-actions"/);
assert.match(work, /From a Facebook-first presence to a clear digital front door\./);
assert.match(work, /Current public experience: A responsive website with clear paths to service information, visit planning, ministries, messages, directions, and contact details\./);
assert.doesNotMatch(body, /easier to find, easier to use, and easier to maintain|free of charge|home church/i);
assert.ok(html.indexOf('Speak with Rogers Holdings') < html.indexOf('Explore more demos'), 'contact must be discoverable before project proof');
assert.match(work, /class="button button-dark" href="https:\/\/www\.eastlandfirstchurchofgod\.com"/, 'Eastland live proof must remain accessible on Our Work');
assert.doesNotMatch(html, /class="eastland-story-timeline"|class="eastland-live-proof"/, 'homepage must not duplicate detailed case studies');
assert.match(html, /href="our-work\/">Explore more demos/);
const publicHewPattern = /\bHEW\b|Gates?\s*(?:&|&amp;)\s*Garage|hew-gates-garage|hew-venture|homepage-venture-showcase/i;
assert.doesNotMatch(html, publicHewPattern);
assert.doesNotMatch(css, publicHewPattern);
assert.match(html, /href="business-snapshot\/" data-report-link>Request Your Free Business Snapshot/);

assert.match(html, /class="phase3-founder-portrait"/);
assert.match(html, /src="assets\/images\/homepage\/brian-smiling-portrait\.webp" width="1040" height="1300" loading="lazy"/);
assert.match(html, /<p class="phase3-owner-intro"><strong>I’m Brian Keith Rogers<\/strong><\/p><p class="phase3-owner-lede">/);
assert.match(html, /<figcaption><span>Founder, Rogers Holdings LLC<\/span><\/figcaption>/);
assert.ok(html.includes("Why a holding company?"));
assert.ok(html.includes('Rogers Holdings LLC was created with room to grow. Our vision extends beyond one service, with a long-term goal of building and supporting businesses and ventures under one company. Today, we help business owners make practical improvements through the services you see here.'));
assert.match(html, /<h2>You know your business\. I want to understand it\.<\/h2>/);
assert.match(html, /My faith shapes how I work: be honest, help where I can and follow through\./);
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
assert.doesNotMatch(html, /rel="preload"[^>]*homepage-hero-v2\.2/, 'retired desk photo must not consume an image preload');
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
