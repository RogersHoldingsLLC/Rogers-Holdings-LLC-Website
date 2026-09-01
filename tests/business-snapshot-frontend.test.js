const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'business-snapshot/index.html'), 'utf8');
const homepage = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const privacy = fs.readFileSync(path.join(ROOT, 'privacy/index.html'), 'utf8');
const source = fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8');
const productionLanguage = [homepage, html, privacy, source].join('\n');

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
