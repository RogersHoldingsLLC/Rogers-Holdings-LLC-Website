'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const patched = fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'business-snapshot/index.html'), 'utf8');
const production = 'https://rogersholdingsllc.com/business-snapshot/';
let passed = 0;
function check(name, run) { return Promise.resolve().then(run).then(() => { passed++; console.log('PASS ' + name); }); }
function element(extra = {}) {
  return Object.assign({ dataset: {}, style: { setProperty() {} }, hidden: false, disabled: false,
    classList: { add() {}, remove() {} }, setAttribute() {}, removeAttribute() {}, getAttribute() { return null; },
    querySelector() { return null; }, append() {}, replaceChildren() {}, focus() {}, scrollIntoView() {},
    addEventListener() {}, textContent: '' }, extra);
}
function fixture(source = patched, opts = {}) {
  const events = [], requests = [], handlers = {}, fieldHandlers = {};
  const field = element({ id: 'full-name', name: 'fullName', type: 'text', value: 'Fixture only',
    required: true, validity: { valid: opts.valid !== false },
    addEventListener(name, fn) { fieldHandlers[name] = fn; } });
  const status = element(), button = element(), shell = element(), widget = element({ dataset: { sitekey: 'fixture', action: 'business_snapshot' } });
  const turnstileStatus = element();
  const nodes = { '[data-form-status]': status, '[data-submit-button]': button,
    '[data-turnstile-shell]': shell, '[data-turnstile-widget]': widget, '[data-turnstile-status]': turnstileStatus };
  const form = element({ dataset: { endpointConfigured: 'true' },
    getAttribute(name) { return name === 'action' ? 'https://intake.rogersholdingsllc.com/api/business-snapshot' : null; },
    closest() { return null; }, querySelector(s) { return nodes[s] || null; },
    querySelectorAll(s) { return s === '[data-validate]' ? [field] : []; },
    addEventListener(name, fn) { handlers[name] = fn; } });
  const queue = [...(opts.fetchResults || ['success'])];
  const state = { resets: 0, resolver: null };
  const ctx = {
    window: { location: { href: opts.url || production }, gtag: (...a) => events.push(a),
      addEventListener() {}, setTimeout() { return 1; }, clearTimeout() {},
      turnstile: { render() { return 'fixture-widget'; }, reset() { state.resets++; } } },
    document: { querySelector(s) { return s === '[data-lead-form]' ? form : null; },
      createElement() { return element(); }, getElementById() { return null; },
      documentElement: { style: {} } },
    URL, AbortController, crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000001' },
    FormData: class { get(name) { return ({ fullName: 'Fixture only', businessName: 'Fixture business',
      email: 'fixture@example.invalid', primaryChallenge: 'Offline test data never transmitted.',
      consent: 'business-snapshot-contact-consent-v1' })[name] || ''; } },
    fetch: async (url, options) => {
      requests.push({ url, payload: JSON.parse(options.body) });
      const kind = queue.shift() || 'success';
      if (kind === 'network') throw new TypeError('Mock network failure');
      if (kind === 'timeout') { const error = new Error('Mock timeout'); error.name = 'AbortError'; throw error; }
      if (kind === 'pending') await new Promise(resolve => { state.resolver = resolve; });
      const payload = requests.at(-1).payload;
      return { ok: kind !== 'rejected', headers: { get: () => 'application/json' },
        json: async () => kind === 'rejected'
          ? { ok: false, code: 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE' }
          : kind === 'malformed' ? { ok: true }
          : { ok: true, environment: 'production', requestId: payload.requestId, retry: false } };
    },
    module: { exports: {} }
  };
  vm.createContext(ctx);
  // Execute the actual Snapshot implementation with fake DOM, gtag, timers and fetch.
  // No browser, Turnstile script, real network POST or Analytics client exists here.
  vm.runInContext(source.slice(source.indexOf('const BUSINESS_SNAPSHOT_ENDPOINT')), ctx, { timeout: 1000 });
  return { events, requests, state, ctx, fieldHandlers,
    submit: () => handlers.submit({ preventDefault() {} }),
    token: () => ctx.window.businessSnapshotTurnstileSuccess('offline-fixture-token'),
    issue: type => ctx.window['businessSnapshotTurnstile' + type](),
    count: name => events.filter(e => e[1] === 'business_snapshot_' + name).length };
}
function runBootstrap(url) {
  const scripts = [], dataLayer = [];
  const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const ctx = { URL, Date, location: { href: url }, dataLayer,
    document: { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } } };
  ctx.window = ctx;
  vm.runInNewContext(inline, ctx, { timeout: 1000 });
  return { scripts, dataLayer };
}
(async () => {
  await check('patched idle callbacks are separate diagnostics, capped once per category', () => {
    const f = fixture();
    for (let i = 0; i < 30; i++) for (const type of ['Error', 'Expired', 'Timeout']) f.issue(type);
    assert.equal(f.count('verification_issue'), 3);
    assert.equal(f.count('submission_failed'), 0);
    assert.equal(f.count('submit_attempted'), 0);
    assert.equal(f.count('form_started'), 0);
    assert.equal(f.requests.length, 0);
    assert.equal(f.state.resets, 60, 'security recovery remains intact');
  });
  await check('invalid input is blocked before POST and not mislabeled as submission failure', async () => {
    const f = fixture(patched, { valid: false }); await f.submit();
    assert.equal(f.count('submit_blocked'), 1);
    assert.equal(f.events.at(-1)[2].failure_category, 'user_validation');
    assert.equal(f.count('submission_failed'), 0); assert.equal(f.count('submit_attempted'), 0);
    assert.equal(f.requests.length, 0);
  });
  await check('missing verification token is blocked before POST', async () => {
    const f = fixture(); await f.submit();
    assert.equal(f.count('submit_blocked'), 1);
    assert.equal(f.events.at(-1)[2].failure_category, 'turnstile_missing');
    assert.equal(f.count('submission_failed'), 0); assert.equal(f.count('submit_attempted'), 0);
    assert.equal(f.requests.length, 0);
  });
  await check('accepted response records one attempt and one success', async () => {
    const f = fixture(); f.fieldHandlers.input(); f.token(); await f.submit();
    assert.equal(f.count('form_started'), 1); assert.equal(f.count('submit_attempted'), 1);
    assert.equal(f.count('submitted'), 1); assert.equal(f.count('submission_failed'), 0);
    assert.equal(f.requests.length, 1);
    const previous = f.events.length;
    for (const type of ['Error', 'Expired', 'Timeout']) f.issue(type);
    await f.submit();
    assert.equal(f.events.length, previous, 'no diagnostics or new submission after completion');
    assert.equal(f.requests.length, 1);
  });
  for (const kind of ['rejected', 'network', 'malformed', 'timeout']) {
    await check(kind + ' request outcome records one attempted POST and one error', async () => {
      const f = fixture(patched, { fetchResults: [kind] }); f.token(); await f.submit();
      assert.equal(f.count('submit_attempted'), 1); assert.equal(f.count('submission_failed'), 1);
      assert.equal(f.count('submitted'), 0); assert.equal(f.requests.length, 1);
      assert.equal(f.events.find(e => e[1] === 'business_snapshot_submission_failed')[2].failure_category,
        { rejected: 'retryable_service', network: 'ambiguous_network', malformed: 'ambiguous_response', timeout: 'ambiguous_timeout' }[kind]);
    });
  }
  await check('manual retry keeps request identity and counts each real request once', async () => {
    const f = fixture(patched, { fetchResults: ['network', 'success'] });
    f.token(); await f.submit(); f.token(); await f.submit();
    assert.equal(f.count('submit_attempted'), 2); assert.equal(f.count('submission_failed'), 1);
    assert.equal(f.count('submitted'), 1); assert.equal(f.requests.length, 2);
    assert.equal(f.requests[0].payload.requestId, f.requests[1].payload.requestId);
  });
  await check('repeat submit while pending does not create an extra request or attempt', async () => {
    const f = fixture(patched, { fetchResults: ['pending'] }); f.token();
    const first = f.submit(); await f.submit();
    assert.equal(f.requests.length, 1); assert.equal(f.count('submit_attempted'), 1);
    f.state.resolver(); await first; assert.equal(f.count('submitted'), 1);
  });
  await check('verification callbacks during an in-flight request do not mark that request failed', async () => {
    const f = fixture(patched, { fetchResults: ['pending'] }); f.token();
    const pending = f.submit();
    for (let i = 0; i < 3; i++) for (const type of ['Error', 'Expired', 'Timeout']) f.issue(type);
    assert.equal(f.count('verification_issue'), 3); assert.equal(f.count('submission_failed'), 0);
    assert.equal(f.requests.length, 1); assert.equal(f.count('submit_attempted'), 1);
    f.state.resolver(); await pending; assert.equal(f.count('submitted'), 1);
  });
  await check('blocked submission can recover with a fresh token and succeed', async () => {
    const f = fixture(); await f.submit(); f.token(); await f.submit();
    assert.equal(f.count('submit_blocked'), 1); assert.equal(f.count('submit_attempted'), 1);
    assert.equal(f.count('submitted'), 1); assert.equal(f.count('submission_failed'), 0);
    assert.equal(f.requests.length, 1);
  });
  const urls = [
    [production, true], ['https://www.rogersholdingsllc.com/business-snapshot/', true],
    ['http://rogersholdingsllc.com/business-snapshot/', false],
    ['http://localhost:4234/business-snapshot/', false],
    ['http://127.0.0.1:4234/business-snapshot/', false],
    ['http://100.102.57.95:4234/business-snapshot/', false],
    ['https://preview.example.invalid/business-snapshot/', false],
    ['https://rogersholdingsllc.com.example.invalid/business-snapshot/', false],
    [production + '?analytics=off', false]
  ];
  for (const [url, enabled] of urls) {
    await check('analytics gate ' + url, async () => {
      const f = fixture(patched, { url }); f.token(); await f.submit(); f.issue('Error');
      assert.equal(f.events.length > 0, enabled);
      assert.equal(f.requests.length, 1, 'analytics gating does not alter the delivery flow');
      const b = runBootstrap(url);
      assert.equal(b.scripts.length, enabled ? 1 : 0);
      assert.equal(b.dataLayer.length, enabled ? 2 : 0);
      if (enabled) assert.equal(b.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-MK4TVD3CYT');
    });
  }
  await check('events contain only allowlisted categories, not form data or verification tokens', async () => {
    const f = fixture(patched, { fetchResults: ['network'] }); f.token(); await f.submit(); f.issue('Error');
    const serialized = JSON.stringify(f.events);
    for (const privateValue of ['Fixture only', 'fixture@example.invalid', 'offline-fixture-token', '00000000-0000-4000-8000-000000000001'])
      assert.equal(serialized.includes(privateValue), false);
    const before = f.events.length;
    f.ctx.module.exports.trackBusinessSnapshotEvent('unapproved_event', 'private');
    assert.equal(f.events.length, before);
  });
  console.log('\n' + passed + ' tests passed. All submissions and GA calls used isolated in-memory stubs.');
})().catch(error => { console.error(error); process.exitCode = 1; });
