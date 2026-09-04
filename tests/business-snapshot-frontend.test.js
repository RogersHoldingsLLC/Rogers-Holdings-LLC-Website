const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'business-snapshot/index.html'), 'utf8');
const homepage = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const privacy = fs.readFileSync(path.join(ROOT, 'privacy/index.html'), 'utf8');
const source = fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8');
const productionLanguage = [homepage, html, privacy, source].join('\n');

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
  return match ? match[1] : null;
}

function hasAttribute(tag, name) {
  return new RegExp(`(?:^|\\s)${name}(?:\\s|=|>|$)`, 'i').test(tag);
}

function descriptionIds(tag) {
  return (getAttribute(tag, 'aria-describedby') || '').split(/\s+/).filter(Boolean);
}

const formStart = html.indexOf('<form class="lead-form"');
const formEnd = html.indexOf('</form>', formStart);
assert.ok(formStart >= 0 && formEnd > formStart, 'Business Snapshot form markup must be present');
const formMarkup = html.slice(formStart, formEnd + '</form>'.length);
const visibleFormText = formMarkup
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const heroStart = html.indexOf('<section class="intake-hero snapshot-hero">');
const heroEnd = html.indexOf('<section class="section intake-section"', heroStart);
assert.ok(heroStart >= 0 && heroEnd > heroStart, 'compact Snapshot hero must precede the form section');
const heroMarkup = html.slice(heroStart, heroEnd);
const preFieldMarkup = html.slice(html.indexOf('<main'), html.indexOf('<label for="full-name">') + '<label for="full-name">'.length);
const preFieldWords = preFieldMarkup
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g) || [];
const approvedHeroCopy = {
  eyebrow: 'Free Business Snapshot',
  heading: 'Tell us what isn’t working. Get a clear next step.',
  lede: 'Describe the challenge. Rogers Holdings will review your information and visible public evidence, then typically within three business days send a concise, human-reviewed Executive Brief.',
  cta: 'Request Your Free Business Snapshot',
  trust: 'Free <span aria-hidden="true">·</span> Human-reviewed by Brian Rogers <span aria-hidden="true">·</span> Typically within three business days'
};
for (const copy of Object.values(approvedHeroCopy)) {
  assert.ok(heroMarkup.includes(copy), `Snapshot hero missing approved copy: ${copy}`);
}
assert.equal((heroMarkup.match(/<a\b[^>]*class="[^"]*\bbutton\b[^"]*"[^>]*>/g) || []).length, 1);
assert.match(heroMarkup, /<a class="button button-gold" href="#snapshot-form">Request Your Free Business Snapshot/);
assert.doesNotMatch(heroMarkup, /snapshot-hero-secondary|See What the Executive Brief Includes/);
assert.doesNotMatch(heroMarkup, /<picture\b|<img\b|homepage-hero-v2\.2|north-point-|mockup/i);
assert.match(heroMarkup, /<section class="snapshot-summary" id="snapshot-deliverable" aria-labelledby="snapshot-deliverable-heading"/);
assert.match(heroMarkup, /<h2 id="snapshot-deliverable-heading">Your Executive Brief<\/h2>/);
for (const deliverable of [
  'The clearest visible issue',
  'What deserves attention first',
  'A practical recommended next step, with plain-English reasoning'
]) {
  assert.equal(heroMarkup.split(deliverable).length - 1, 1, `${deliverable} must appear once before the form`);
}
assert.equal(heroMarkup.split('Focused initial review—not a full audit or consulting engagement.').length - 1, 1);
assert.doesNotMatch(html, /snapshot-value-strip|This is a focused initial review/);
assert.match(html, /<\/section>\s*<section class="section intake-section" aria-labelledby="snapshot-section-heading">/);
assert.ok(preFieldWords.length <= 120, `pre-field content must remain at most 120 words; found ${preFieldWords.length}`);
assert.doesNotMatch(heroMarkup, /testimonial|endorsement|guarantee|\b\d+(?:\.\d+)?%/i);

for (const viewport of ['desktop', 'tablet', 'mobile']) {
  assert.ok(homepage.includes(`homepage-hero-v2.2-${viewport}.avif`));
  assert.ok(homepage.includes(`homepage-hero-v2.2-${viewport}.webp`));
  assert.ok(homepage.includes(`homepage-hero-v2.2-${viewport}.jpg`));
}
assert.ok(homepage.includes('Illustrative Executive Brief sample — North Point Fitness is a fictional business. Shown to demonstrate the format and level of detail.'));

const fieldContract = [...formMarkup.matchAll(/<(input|textarea)\b[^>]*>/gi)].map((match) => ({
  tag: match[1].toLowerCase(),
  id: getAttribute(match[0], 'id'),
  name: getAttribute(match[0], 'name'),
  type: getAttribute(match[0], 'type'),
  required: hasAttribute(match[0], 'required')
}));

assert.deepEqual(fieldContract, [
  { tag: 'input', id: 'full-name', name: 'fullName', type: 'text', required: true },
  { tag: 'input', id: 'business-name', name: 'businessName', type: 'text', required: true },
  { tag: 'input', id: 'email', name: 'email', type: 'email', required: true },
  { tag: 'input', id: 'phone', name: 'phone', type: 'tel', required: false },
  { tag: 'input', id: 'website', name: 'website', type: 'url', required: false },
  { tag: 'textarea', id: 'challenge', name: 'primaryChallenge', type: null, required: true },
  { tag: 'input', id: 'consent', name: 'consent', type: 'checkbox', required: true },
  { tag: 'input', id: 'company', name: 'company', type: 'text', required: false }
]);

const emailInput = formMarkup.match(/<input\b[^>]*\bid="email"[^>]*>/i)?.[0] || '';
const challengeTextarea = formMarkup.match(/<textarea\b[^>]*\bid="challenge"[^>]*>/i)?.[0] || '';
const consentInput = formMarkup.match(/<input\b[^>]*\bid="consent"[^>]*>/i)?.[0] || '';

const detailedFieldContract = [...formMarkup.matchAll(/<(input|textarea)\b[^>]*>/gi)].map((match) => ({
  id: getAttribute(match[0], 'id'),
  name: getAttribute(match[0], 'name'),
  type: getAttribute(match[0], 'type'),
  required: hasAttribute(match[0], 'required'),
  autocomplete: getAttribute(match[0], 'autocomplete'),
  inputmode: getAttribute(match[0], 'inputmode'),
  minlength: getAttribute(match[0], 'minlength'),
  maxlength: getAttribute(match[0], 'maxlength'),
  value: getAttribute(match[0], 'value'),
  tabindex: getAttribute(match[0], 'tabindex'),
  describedby: getAttribute(match[0], 'aria-describedby')
}));
assert.deepEqual(detailedFieldContract, [
  { id: 'full-name', name: 'fullName', type: 'text', required: true, autocomplete: 'name', inputmode: null, minlength: null, maxlength: '120', value: null, tabindex: null, describedby: null },
  { id: 'business-name', name: 'businessName', type: 'text', required: true, autocomplete: 'organization', inputmode: null, minlength: null, maxlength: '140', value: null, tabindex: null, describedby: null },
  { id: 'email', name: 'email', type: 'email', required: true, autocomplete: 'email', inputmode: 'email', minlength: null, maxlength: '254', value: null, tabindex: null, describedby: 'email-hint' },
  { id: 'phone', name: 'phone', type: 'tel', required: false, autocomplete: 'tel', inputmode: 'tel', minlength: null, maxlength: '30', value: null, tabindex: null, describedby: null },
  { id: 'website', name: 'website', type: 'url', required: false, autocomplete: 'url', inputmode: 'url', minlength: null, maxlength: '2048', value: null, tabindex: null, describedby: 'website-hint' },
  { id: 'challenge', name: 'primaryChallenge', type: null, required: true, autocomplete: null, inputmode: null, minlength: '20', maxlength: '2000', value: null, tabindex: null, describedby: 'challenge-hint challenge-count' },
  { id: 'consent', name: 'consent', type: 'checkbox', required: true, autocomplete: null, inputmode: null, minlength: null, maxlength: null, value: 'business-snapshot-contact-consent-v1', tabindex: null, describedby: 'consent-hint' },
  { id: 'company', name: 'company', type: 'text', required: false, autocomplete: 'off', inputmode: null, minlength: null, maxlength: null, value: '', tabindex: '-1', describedby: null }
]);

for (const fieldId of ['full-name', 'business-name', 'email', 'phone', 'website', 'challenge', 'consent']) {
  assert.match(formMarkup, new RegExp(`<label\\b[^>]*\\bfor="${fieldId}"`, 'i'));
}
assert.match(
  html,
  /Only the essentials\. Fields marked\s*<span aria-hidden="true">\*<\/span>\s*<span class="sr-only">with an asterisk<\/span>\s*are required\./
);
assert.match(visibleFormText, /Email address/);
assert.doesNotMatch(visibleFormText, /Work email/);
assert.equal(getAttribute(emailInput, 'placeholder'), 'you@example.com');
assert.match(visibleFormText, /A business or personal email is fine\./);
assert.ok(descriptionIds(emailInput).includes('email-hint'));
assert.equal(getAttribute(emailInput, 'data-description-id'), 'email-hint');
assert.match(formMarkup, /id="email-hint"[^>]*>A business or personal email is fine\.<\/span>/);
assert.match(visibleFormText, /02 About the challenge/);
assert.doesNotMatch(visibleFormText, /The decision in front of you/);
assert.match(visibleFormText, /Business website \(optional\)/);
assert.match(visibleFormText, /Include the full URL if your website is relevant to the challenge\./);
assert.match(visibleFormText, /A few sentences are enough\. Tell us what is happening now, what you want to improve, and anything you have already tried\. Do not include passwords or sensitive personal information\./);
assert.ok(descriptionIds(challengeTextarea).includes('challenge-hint'));
assert.ok(descriptionIds(challengeTextarea).includes('challenge-count'));
assert.deepEqual(
  (getAttribute(challengeTextarea, 'data-description-id') || '').split(/\s+/),
  ['challenge-hint', 'challenge-count']
);
assert.equal(getAttribute(challengeTextarea, 'maxlength'), '2000');
assert.match(visibleFormText, /This permission applies only to your Snapshot request\. It does not subscribe you to marketing\./);
assert.ok(descriptionIds(consentInput).includes('consent-hint'));
assert.equal(getAttribute(consentInput, 'value'), 'business-snapshot-contact-consent-v1');
assert.equal(hasAttribute(consentInput, 'required'), true);
assert.match(formMarkup, /<div class="honeypot-field" aria-hidden="true">[\s\S]*?<input\b[^>]*\bid="company"[^>]*\btabindex="-1"/);
assert.match(formMarkup, /<button\b[^>]*type="submit"[^>]*>[\s\S]*?Request My Free Business Snapshot[\s\S]*?<\/button>/);
assert.match(html, /class="form-progress"[\s\S]*?role="progressbar"[\s\S]*?aria-valuenow="0"/);
assert.match(formMarkup, /<p class="delivery-note" data-delivery-note hidden><\/p>/);
assert.match(formMarkup, /<div class="form-status" data-form-status role="status" aria-live="polite" tabindex="-1" hidden><\/div>/);
assert.match(formMarkup, /class="turnstile-shell"[\s\S]*?data-callback="businessSnapshotTurnstileSuccess"/);
assert.match(formMarkup, /class="submission-loader"[\s\S]*?Securing your request/);
assert.match(html, /class="submission-confirmation" data-submission-confirmation hidden[\s\S]*?id="confirmation-heading"/);
assert.match(html, />Schedule a Discovery Conversation<\/a>/);
assert.match(formMarkup, /href="mailto:briankeith@rogersholdingsllc\.com\?subject=Business%20Snapshot%20Request"/);
assert.match(formMarkup, /href="tel:\+18594044351">859-404-4351<\/a>/);

const noopClassList = { add() {}, remove() {}, toggle() {}, contains() { return false; } };
global.document = {
  activeElement: null,
  body: { classList: noopClassList },
  documentElement: { classList: noopClassList, style: {} },
  addEventListener() {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; }
};
global.window = {
  addEventListener() {},
  gtag: null,
  matchMedia() { return { matches: true, addEventListener() {} }; },
  scrollY: 0
};

const {
  BUSINESS_SNAPSHOT_ENDPOINT,
  BUSINESS_SNAPSHOT_TIMEOUT_MS,
  buildBusinessSnapshotPayload,
  businessSnapshotEndpointIsConfigured,
  businessSnapshotResponseIsAccepted,
  classifyBusinessSnapshotFailure,
  createBusinessSnapshotJourneyTracker,
  createBusinessSnapshotRuntimeErrorReporter,
  trackBusinessSnapshotEvent
} = require('../assets/js/site.js');

function request(values = {}) {
  const defaults = {
    fullName: 'Jordan Taylor',
    businessName: 'Example Service Company',
    email: 'jordan@example.com',
    phone: '',
    website: 'https://example.com',
    primaryChallenge: 'Lead follow-up needs a clear and consistent owner.',
    consent: 'business-snapshot-contact-consent-v1',
    company: ''
  };
  const fields = new Map(Object.entries({ ...defaults, ...values }));
  return { get(name) { return fields.get(name) ?? null; } };
}

assert.equal(BUSINESS_SNAPSHOT_ENDPOINT, 'https://intake.rogersholdingsllc.com/api/business-snapshot');
assert.equal(BUSINESS_SNAPSHOT_TIMEOUT_MS, 40000);
assert.match(html, /action="https:\/\/intake\.rogersholdingsllc\.com\/api\/business-snapshot"/);
assert.match(html, /data-endpoint-configured="true"/);
assert.match(html, /data-sitekey="0x4AAAAAAEFhF9RRNG4A4T1Q"/);
assert.match(html, /data-action="business_snapshot"/);
assert.doesNotMatch(html, /PUBLIC_PRODUCTION_TURNSTILE_SITE_KEY_NOT_CONFIGURED|TURNSTILE_SECRET_KEY/);
assert.doesNotMatch(html, /name="formStartedAt"|data-form-started-at/);
assert.match(html, /data-error-callback="businessSnapshotTurnstileError"/);
assert.match(html, /data-expired-callback="businessSnapshotTurnstileExpired"/);
assert.match(html, /data-timeout-callback="businessSnapshotTurnstileTimeout"/);
assert.match(html, /site\.css\?v=whole-site-refinement-1/);
assert.match(html, /site\.js\?v=whole-site-refinement-1/);
assert.match(html, /<p class="delivery-note" data-delivery-note hidden><\/p>/);
assert.doesNotMatch(html, /secure submission endpoint is not connected yet/i);
assert.doesNotMatch(html, /Secure submission is temporarily unavailable/);
assert.match(source, /const BUSINESS_SNAPSHOT_UNAVAILABLE_MESSAGE = 'Secure submission is temporarily unavailable\. Your answers have not been sent\. Please try again or contact Rogers Holdings directly\.';/);
assert.match(source, /retryable_service: BUSINESS_SNAPSHOT_UNAVAILABLE_MESSAGE/);

const canonicalJourney = [
  'Free Business Snapshot',
  'Executive Brief',
  'Discovery Conversation',
  'Digital Business Assessment',
  'Improvement Plan',
  'Implementation Services',
  'Ongoing Optimization'
];

const homepageHead = homepage.slice(0, homepage.indexOf('</head>'));
const homepageBody = homepage.slice(homepage.indexOf('<body'));
for (const term of canonicalJourney) {
  assert.match(productionLanguage, new RegExp(term));
  assert.match(homepageHead, new RegExp(term), `${term} must remain in homepage service metadata`);
}
for (const retiredJourneyLabel of canonicalJourney.slice(2)) {
  assert.doesNotMatch(homepageBody, new RegExp(retiredJourneyLabel), `${retiredJourneyLabel} must not be rendered on the homepage`);
}
assert.match(homepageBody, /id="process"/);
assert.match(homepageBody, /href="business-snapshot\/" data-report-link>Request Your Free Business Snapshot<\/a>/);

assert.match(html, /<title>Free Business Snapshot \| Rogers Holdings LLC<\/title>/);
assert.match(html, /Request Your Free Business Snapshot/);
assert.match(html, /Request My Free Business Snapshot/);
assert.match(source, /const defaultSubmitLabel = 'Request My Free Business Snapshot';/);
assert.doesNotMatch(productionLanguage, /Get Your Free Business Snapshot|Start Your Free Business Snapshot/);
assert.doesNotMatch(productionLanguage, /\b(?:Request (?:Your|My)|Start Your) Business Snapshot\b/);

for (const retiredTerm of [
  'Executive Snapshot',
  'Digital Opportunity Snapshot',
  'Website Audit',
  'Audit Report',
  'Proposal',
  'Rogers Holdings OS'
]) {
  assert.doesNotMatch(productionLanguage, new RegExp(retiredTerm, 'i'));
}

assert.match(privacy, /operational metadata/);
assert.match(privacy, /Do not submit passwords, payment information/);
assert.match(privacy, /Security incidents/);
assert.match(privacy, /delete or de-identify/);
assert.match(privacy, /separate optional consent/);

const disabledForm = {
  dataset: { endpointConfigured: 'false' },
  getAttribute() { return BUSINESS_SNAPSHOT_ENDPOINT; }
};
const configuredForm = {
  dataset: { endpointConfigured: 'true' },
  getAttribute() { return BUSINESS_SNAPSHOT_ENDPOINT; }
};
assert.equal(businessSnapshotEndpointIsConfigured(disabledForm), false);
assert.equal(businessSnapshotEndpointIsConfigured(configuredForm), true);

const payload = buildBusinessSnapshotPayload(
  request({ company: 'honeypot value' }),
  '123e4567-e89b-42d3-a456-426614174000',
  'turnstile-token'
);
assert.deepEqual(Object.keys(payload), [
  'schemaVersion', 'requestId', 'fullName', 'businessName', 'email', 'phone',
  'website', 'primaryChallenge', 'consent', 'turnstileToken', 'company'
]);
assert.equal(payload.company, 'honeypot value');
assert.equal(Object.hasOwn(payload, 'formStartedAt'), false);

const requestId = payload.requestId;
assert.equal(businessSnapshotResponseIsAccepted(
  { ok: true },
  { ok: true, environment: 'production', requestId, retry: false },
  requestId
), true);
assert.equal(businessSnapshotResponseIsAccepted(
  { ok: true },
  { ok: true, environment: 'production', requestId, retry: true },
  requestId
), true);
assert.equal(businessSnapshotResponseIsAccepted(
  { ok: true },
  { ok: true, environment: 'production', requestId: 'different', retry: false },
  requestId
), false);
assert.equal(businessSnapshotResponseIsAccepted(
  { ok: true },
  { ok: true, environment: 'production', requestId, retry: 'false' },
  requestId
), false);
assert.equal(businessSnapshotResponseIsAccepted(
  { ok: true },
  { ok: true, environment: 'production', requestId, retry: false, prospectId: '' },
  requestId
), true, 'public success must not depend on prospectId');

assert.equal(classifyBusinessSnapshotFailure({
  response: { ok: false },
  result: { code: 'BUSINESS_SNAPSHOT_VALIDATION', message: 'Invalid field.' }
}), 'user_validation');
assert.equal(classifyBusinessSnapshotFailure({
  response: { ok: false },
  result: { code: 'BUSINESS_SNAPSHOT_VALIDATION', message: 'Human verification failed. Please try again.' }
}), 'turnstile_rejected');
assert.equal(classifyBusinessSnapshotFailure({
  response: { ok: false },
  result: { code: 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE' }
}), 'retryable_service');
assert.equal(classifyBusinessSnapshotFailure({
  response: { ok: false },
  result: { code: 'BUSINESS_SNAPSHOT_RECONCILIATION_REQUIRED' }
}), 'administrative_review');
assert.equal(classifyBusinessSnapshotFailure({ error: { name: 'AbortError' } }), 'ambiguous_timeout');
assert.equal(classifyBusinessSnapshotFailure({ error: new TypeError('network') }), 'ambiguous_network');

assert.match(source, /if \(submissionPending\) return;/);
assert.match(source, /setAttribute\('aria-busy', String\(isPending\)\)/);
assert.match(source, /Sending your request securely\. Please wait\./);
assert.match(source, /confirmation\.focus\(\{ preventScroll: true \}\)/);
assert.match(source, /resetTurnstileForFreshToken/);
assert.match(source, /businessSnapshotTurnstileExpired/);
assert.match(source, /businessSnapshotTurnstileTimeout/);
assert.match(source, /businessSnapshotTurnstileError = \(\) => \{[\s\S]*?setTurnstileStatus\('error', businessSnapshotFailureMessages\.turnstile_error\);/);
assert.match(source, /const requestId = crypto\.randomUUID\(\);/);
assert.equal((source.match(/const requestId = crypto\.randomUUID\(\);/g) || []).length, 1);

const analytics = [];
window.gtag = (...args) => analytics.push(args);
trackBusinessSnapshotEvent('business_snapshot_submitted');
trackBusinessSnapshotEvent('business_snapshot_email_prepared');
trackBusinessSnapshotEvent('business_snapshot_submission_failed', 'ambiguous_network');
trackBusinessSnapshotEvent('business_snapshot_submission_failed', 'private-detail-must-not-pass');
trackBusinessSnapshotEvent('business_snapshot_abandoned', 'submit_attempted');
trackBusinessSnapshotEvent('business_snapshot_abandoned', 'private-stage-must-not-pass');
trackBusinessSnapshotEvent('business_snapshot_runtime_failed', 'window_error');
assert.deepEqual(analytics[0], ['event', 'business_snapshot_submitted', { event_category: 'lead' }]);
assert.deepEqual(analytics[1], ['event', 'business_snapshot_email_prepared', { event_category: 'lead' }]);
assert.deepEqual(analytics[2], ['event', 'business_snapshot_submission_failed', {
  event_category: 'lead',
  failure_category: 'ambiguous_network'
}]);
assert.deepEqual(analytics[3], ['event', 'business_snapshot_submission_failed', { event_category: 'lead' }]);
assert.deepEqual(analytics[4], ['event', 'business_snapshot_abandoned', {
  event_category: 'lead',
  journey_stage: 'submit_attempted',
  transport_type: 'beacon'
}]);
assert.deepEqual(analytics[5], ['event', 'business_snapshot_abandoned', { event_category: 'lead' }]);
assert.deepEqual(analytics[6], ['event', 'business_snapshot_runtime_failed', {
  event_category: 'lead',
  runtime_category: 'window_error'
}]);
assert.equal(JSON.stringify(analytics).includes(requestId), false);
assert.equal(JSON.stringify(analytics).includes('turnstile-token'), false);
assert.equal(JSON.stringify(analytics).includes('jordan@example.com'), false);
assert.equal(JSON.stringify(analytics).includes('private-stage-must-not-pass'), false);

const journeyEvents = [];
const journey = createBusinessSnapshotJourneyTracker((...args) => journeyEvents.push(args));
assert.equal(journey.currentStage(), 'not_started');
assert.equal(journey.start(), true);
assert.equal(journey.start(), false, 'form start is emitted once');
assert.equal(journey.submitAttempted(), true);
assert.equal(journey.fail(), true);
assert.equal(journey.abandon(), true);
assert.equal(journey.abandon(), false, 'abandonment is emitted once');
assert.deepEqual(journeyEvents, [
  ['business_snapshot_form_started'],
  ['business_snapshot_submit_attempted'],
  ['business_snapshot_abandoned', 'failed']
]);

const completedJourneyEvents = [];
const completedJourney = createBusinessSnapshotJourneyTracker(
  (...args) => completedJourneyEvents.push(args)
);
completedJourney.start();
completedJourney.submitAttempted();
completedJourney.complete();
assert.equal(completedJourney.abandon(), false, 'accepted forms are never abandoned');
assert.deepEqual(completedJourneyEvents, [
  ['business_snapshot_form_started'],
  ['business_snapshot_submit_attempted']
]);

const runtimeEvents = [];
const reportRuntimeError = createBusinessSnapshotRuntimeErrorReporter(
  (...args) => runtimeEvents.push(args)
);
assert.equal(reportRuntimeError('private-runtime-detail'), false);
assert.equal(reportRuntimeError('window_error'), true);
assert.equal(reportRuntimeError('unhandled_rejection'), false, 'runtime failure is emitted once');
assert.deepEqual(runtimeEvents, [
  ['business_snapshot_runtime_failed', 'window_error']
]);
assert.equal(JSON.stringify(runtimeEvents).includes('private-runtime-detail'), false);

assert.match(source, /business_snapshot_form_started/);
assert.match(source, /business_snapshot_submit_attempted/);
assert.match(source, /business_snapshot_abandoned/);
assert.match(source, /business_snapshot_runtime_failed/);
assert.match(source, /window\.addEventListener\('pagehide'/);
assert.match(source, /window\.addEventListener\('unhandledrejection'/);

console.log('Business Snapshot frontend contract tests passed.');
