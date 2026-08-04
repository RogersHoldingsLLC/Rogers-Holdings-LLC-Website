import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRequest, __test } from '../src/worker.js';

const ORIGIN = 'https://production.example.invalid';
const API = `${ORIGIN}/api/business-snapshot`;
const RECEIVER = 'https://script.google.com/macros/s/test-only/exec';
const REQUEST_ID = '123e4567-e89b-42d3-a456-426614174000';

function payload(overrides = {}) {
  return {
    schemaVersion: 'business-snapshot.v1',
    requestId: REQUEST_ID,
    fullName: 'Synthetic Taylor Example',
    businessName: 'Synthetic Example Company',
    email: 'synthetic@example.invalid',
    phone: '+1-555-0100',
    website: 'https://example.invalid',
    primaryChallenge: 'Synthetic production gateway contract validation request.',
    consent: 'business-snapshot-contact-consent-v1',
    turnstileToken: 'fixture-turnstile-token',
    company: '',
    ...overrides
  };
}

function limiter(success = true) {
  return { limit: async () => ({ success }) };
}

function environment(overrides = {}) {
  return {
    BUSINESS_SNAPSHOT_RECEIVER_URL: RECEIVER,
    BUSINESS_SNAPSHOT_RECEIVER_SECRET: 'fixture-receiver-credential',
    BUSINESS_SNAPSHOT_ENVIRONMENT: 'production',
    BUSINESS_SNAPSHOT_ALLOWED_ORIGIN: ORIGIN,
    BUSINESS_SNAPSHOT_TURNSTILE_ACTION: 'business_snapshot',
    BUSINESS_SNAPSHOT_TURNSTILE_HOSTNAME: 'production.example.invalid',
    TURNSTILE_SECRET_KEY: 'fixture-turnstile-credential',
    BUSINESS_SNAPSHOT_RATE_LIMITER: limiter(),
    BUSINESS_SNAPSHOT_REQUEST_LIMITER: limiter(),
    ...overrides
  };
}

function request(body = payload(), options = {}) {
  const headers = {
    Origin: options.origin === undefined ? ORIGIN : options.origin,
    'CF-Connecting-IP': '192.0.2.20',
    'User-Agent': 'production-gateway-test'
  };
  if (options.contentType !== null) {
    headers['Content-Type'] = options.contentType || 'application/json';
  }
  return new Request(options.url || API, {
    method: options.method || 'POST',
    headers,
    body: ['GET', 'HEAD', 'OPTIONS'].includes(options.method) ? undefined :
      (typeof body === 'string' ? body : JSON.stringify(body))
  });
}

function fetchHarness(options = {}) {
  const calls = [];
  const fetcher = async (url, init) => {
    const call = { url: String(url), init };
    calls.push(call);
    if (call.url.includes('siteverify')) {
      if (options.turnstileUnavailable) throw new Error('private provider failure');
      if (options.turnstileMalformed) return Response.json({ unexpected: true });
      if (options.turnstileReject) {
        return Response.json({
          success: false,
          'error-codes': options.turnstileErrorCodes || ['private-provider-diagnostic']
        });
      }
      return Response.json({
        success: true,
        action: options.turnstileAction || 'business_snapshot',
        hostname: options.turnstileHostname || 'production.example.invalid'
      });
    }
    if (options.receiverTimeout) {
      return new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(new Error('private timeout')));
      });
    }
    if (options.receiverHtml) {
      return new Response('<html>private upstream page</html>', {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    if (options.receiverMalformedJson) {
      return new Response('{', { headers: { 'Content-Type': 'application/json' } });
    }
    const forwarded = JSON.parse(init.body);
    if (options.receiverShape) return Response.json(options.receiverShape);
    if (options.receiverError) {
      return Response.json({
        ok: false,
        environment: 'production',
        requestId: forwarded.requestId,
        code: options.receiverError,
        message: 'private upstream message',
        diagnostics: 'private upstream diagnostics'
      });
    }
    return Response.json({
      ok: true,
      environment: 'production',
      requestId: options.responseRequestId || forwarded.requestId,
      prospectId: 'PROS-SYNTHETIC',
      retry: Boolean(options.retry),
      internal: 'must-not-be-forwarded'
    });
  };
  return { calls, fetcher };
}

async function run(body = payload(), options = {}) {
  const harness = fetchHarness(options);
  const response = await handleRequest(
    request(body, options.requestOptions || {}),
    environment(options.env || {}),
    {},
    {
      fetch: harness.fetcher,
      receiverTimeoutMs: options.receiverTimeoutMs,
      now: options.now
    }
  );
  const raw = await response.text();
  return { response, body: JSON.parse(raw), raw, calls: harness.calls };
}

async function captureLogs(action) {
  const entries = [];
  const original = console.log;
  console.log = (entry) => entries.push(String(entry));
  try {
    const result = await action();
    return { result, entries: entries.map((entry) => JSON.parse(entry)) };
  } finally {
    console.log = original;
  }
}

test('valid production request transforms to the exact immutable receiver contract', async () => {
  const result = await run();
  assert.equal(result.response.status, 200);
  assert.deepEqual(result.body, {
    ok: true,
    environment: 'production',
    requestId: REQUEST_ID,
    retry: false
  });
  assert.equal(result.calls.length, 2);
  assert.equal(result.calls[1].url, RECEIVER);
  const forwarded = JSON.parse(result.calls[1].init.body);
  assert.deepEqual(Object.keys(forwarded).sort(), [
    'businessName', 'clientKey', 'consent', 'email', 'fullName', 'phone',
    'primaryChallenge', 'receiverSecret', 'requestId', 'schemaVersion', 'website'
  ]);
  assert.equal(forwarded.receiverSecret, 'fixture-receiver-credential');
  assert.match(forwarded.clientKey, /^[a-f0-9]{24}$/);
  assert.equal('acceptedAt' in forwarded, false);
  assert.equal('testSecret' in forwarded, false);
  assert.equal('testClientId' in forwarded, false);
  assert.equal('turnstileToken' in forwarded, false);
  assert.equal('company' in forwarded, false);
  assert.equal(result.raw.includes('PROS-SYNTHETIC'), false);
  assert.equal(result.raw.includes('internal'), false);
});

test('malformed, missing, typed, and unsupported input fails before external calls', async () => {
  for (const body of [
    '{',
    payload({ fullName: '' }),
    payload({ requestId: 'not-a-uuid' }),
    payload({ schemaVersion: 'business-snapshot.v2' }),
    payload({ fullName: 7 }),
    payload({ unexpected: 'value' })
  ]) {
    const result = await run(body);
    assert.equal(result.response.status, 400);
    assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_VALIDATION');
    assert.equal(result.calls.length, 0);
  }
});

test('consent failure and a populated honeypot fail closed', async () => {
  for (const body of [
    payload({ consent: 'declined' }),
    payload({ company: 'Automated submission' })
  ]) {
    const result = await run(body);
    assert.equal(result.response.status, 400);
    assert.equal(result.calls.length, 0);
  }
});

test('oversized body and fields are rejected', async () => {
  const body = await run(JSON.stringify(payload()) + ' '.repeat(__test.MAX_BODY_BYTES));
  assert.equal(body.response.status, 413);
  assert.equal(body.calls.length, 0);
  const field = await run(payload({ primaryChallenge: 'x'.repeat(2001) }));
  assert.equal(field.response.status, 400);
  assert.equal(field.calls.length, 0);
});

test('origin enforcement requires the exact configured HTTPS origin', async () => {
  for (const origin of ['', 'https://different.example.invalid']) {
    const result = await run(payload(), { requestOptions: { origin } });
    assert.equal(result.response.status, 403);
    assert.equal(result.calls.length, 0);
  }
  const malformed = await run(payload(), {
    env: { BUSINESS_SNAPSHOT_ALLOWED_ORIGIN: 'not-an-origin' }
  });
  assert.equal(malformed.response.status, 503);
  assert.equal(malformed.calls.length, 0);
});

test('Turnstile success is verified and private fields are never forwarded', async () => {
  const result = await run();
  const form = result.calls[0].init.body;
  assert.equal(form.get('response'), 'fixture-turnstile-token');
  assert.equal(form.get('idempotency_key'), REQUEST_ID);
  assert.equal(JSON.parse(result.calls[1].init.body).turnstileToken, undefined);
});

test('Turnstile rejection, mismatch, and outage block receiver invocation safely', async () => {
  for (const options of [
    { turnstileReject: true },
    { turnstileAction: 'wrong_action' },
    { turnstileHostname: 'wrong.example.invalid' },
    { turnstileUnavailable: true }
  ]) {
    const result = await run(payload(), options);
    assert.equal(result.calls.length, 1);
    assert.equal(result.raw.includes('private'), false);
  }
});

test('Turnstile is optional only when no Turnstile setting is configured', async () => {
  const result = await run(payload({ turnstileToken: '' }), {
    env: {
      TURNSTILE_SECRET_KEY: '',
      BUSINESS_SNAPSHOT_TURNSTILE_ACTION: '',
      BUSINESS_SNAPSHOT_TURNSTILE_HOSTNAME: ''
    }
  });
  assert.equal(result.response.status, 200);
  assert.equal(result.calls.length, 1);
  const incomplete = await run(payload(), {
    env: { TURNSTILE_SECRET_KEY: '' }
  });
  assert.equal(incomplete.response.status, 503);
  assert.equal(incomplete.calls.length, 0);
});

test('rate limiting rejects safely before Turnstile or receiver calls', async () => {
  for (const env of [
    { BUSINESS_SNAPSHOT_RATE_LIMITER: limiter(false) },
    { BUSINESS_SNAPSHOT_REQUEST_LIMITER: limiter(false) },
    { BUSINESS_SNAPSHOT_RATE_LIMITER: null }
  ]) {
    const result = await run(payload(), { env });
    assert.equal(result.body.code, env.BUSINESS_SNAPSHOT_RATE_LIMITER === null
      ? 'BUSINESS_SNAPSHOT_CONFIGURATION'
      : 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE');
    assert.equal(result.calls.length, 0);
  }
});

test('missing or malformed gateway configuration fails before external calls', async () => {
  for (const env of [
    { BUSINESS_SNAPSHOT_RECEIVER_URL: '' },
    { BUSINESS_SNAPSHOT_RECEIVER_SECRET: '' },
    { BUSINESS_SNAPSHOT_ENVIRONMENT: 'NON_PRODUCTION' },
    { BUSINESS_SNAPSHOT_RECEIVER_URL: 'https://example.invalid/receiver' }
  ]) {
    const result = await run(payload(), { env });
    assert.equal(result.response.status, 503);
    assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_CONFIGURATION');
    assert.equal(result.calls.length, 0);
  }
});

test('receiver timeout and malformed responses are deterministic safe failures', async () => {
  for (const options of [
    { receiverTimeout: true, receiverTimeoutMs: 5 },
    { receiverHtml: true },
    { receiverMalformedJson: true },
    { receiverShape: { ok: true, environment: 'production' } },
    { responseRequestId: '223e4567-e89b-42d3-a456-426614174000' }
  ]) {
    const result = await run(payload(), options);
    assert.equal(result.response.status, 503);
    assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE');
    assert.equal(result.raw.includes('private'), false);
  }
});

test('receiver authentication rejection and every approved typed error are sanitized', async () => {
  const cases = new Map([
    ['BUSINESS_SNAPSHOT_VALIDATION', 400],
    ['BUSINESS_SNAPSHOT_DUPLICATE_ENTITY', 409],
    ['BUSINESS_SNAPSHOT_LOCK_TIMEOUT', 503],
    ['BUSINESS_SNAPSHOT_CONFIGURATION', 503],
    ['BUSINESS_SNAPSHOT_TEMPORARY_FAILURE', 503],
    ['BUSINESS_SNAPSHOT_RECONCILIATION_REQUIRED', 409]
  ]);
  for (const [code, status] of cases) {
    const result = await run(payload(), { receiverError: code });
    assert.equal(result.response.status, status);
    assert.equal(result.body.code, code);
    assert.equal(result.raw.includes('private upstream'), false);
    assert.equal(result.raw.includes('diagnostics'), false);
  }
});

test('unknown receiver errors never cross the public boundary', async () => {
  const result = await run(payload(), { receiverError: 'PRIVATE_UNKNOWN_CODE' });
  assert.equal(result.response.status, 503);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE');
  assert.equal(result.raw.includes('PRIVATE_UNKNOWN_CODE'), false);
});

test('idempotent retry preserves the public request identity and retry flag', async () => {
  const result = await run(payload(), { retry: true });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.requestId, REQUEST_ID);
  assert.equal(result.body.retry, true);
});

test('success logs contain privacy-safe correlation, retry, stage, and durations', async () => {
  let clock = 1000;
  const { entries } = await captureLogs(() => run(payload(), {
    retry: true,
    now: () => {
      clock += 7;
      return clock;
    }
  }));
  assert.equal(entries.length, 1);
  const [entry] = entries;
  assert.equal(entry.event, 'request_accepted');
  assert.equal(entry.environment, 'production');
  assert.equal(entry.status, 200);
  assert.equal(entry.stage, 'complete');
  assert.match(entry.request_ref, /^[a-f0-9]{24}$/);
  assert.notEqual(entry.request_ref, REQUEST_ID);
  assert.equal(entry.retry, true);
  assert.equal(Number.isInteger(entry.duration_ms), true);
  assert.equal(Number.isInteger(entry.receiver_duration_ms), true);
  assert.equal(entry.duration_ms >= entry.receiver_duration_ms, true);
  assert.equal(entry.turnstile_category, '');
});

test('Turnstile logs expose only an allowlisted rejection category', async () => {
  const { result, entries } = await captureLogs(() => run(payload(), {
    turnstileReject: true,
    turnstileErrorCodes: ['timeout-or-duplicate', 'private-provider-diagnostic']
  }));
  assert.equal(result.response.status, 400);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].event, 'turnstile_rejected');
  assert.equal(entries[0].stage, 'turnstile');
  assert.equal(entries[0].turnstile_category, 'timeout_or_duplicate');
  assert.match(entries[0].request_ref, /^[a-f0-9]{24}$/);
  assert.equal(JSON.stringify(entries).includes('private-provider-diagnostic'), false);
});

test('receiver failures retain correlation and receiver duration without private detail', async () => {
  const { result, entries } = await captureLogs(() => run(payload(), {
    receiverTimeout: true,
    receiverTimeoutMs: 5
  }));
  assert.equal(result.response.status, 503);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].event, 'receiver_timeout');
  assert.equal(entries[0].stage, 'receiver');
  assert.match(entries[0].request_ref, /^[a-f0-9]{24}$/);
  assert.equal(Number.isInteger(entries[0].receiver_duration_ms), true);
  assert.equal(entries[0].retry, null);
  assert.equal(JSON.stringify(entries).includes('private timeout'), false);
});

test('logs contain no secret, client key, request identity, or personal fields', async () => {
  const { entries } = await captureLogs(() => run(payload({
      fullName: 'Unique Sensitive Fixture',
      businessName: 'Unique Fixture Business',
      email: 'unique-sensitive@example.invalid',
      phone: '+1-555-0199',
      website: 'https://unique-sensitive.example.invalid',
      primaryChallenge: 'Unique sensitive free-text challenge.',
      turnstileToken: 'unique-sensitive-turnstile-token'
  })));
  const logs = JSON.stringify(entries);
  for (const prohibited of [
    REQUEST_ID,
    'fixture-receiver-credential',
    'fixture-turnstile-credential',
    'Unique Sensitive Fixture',
    'Unique Fixture Business',
    'unique-sensitive@example.invalid',
    '+1-555-0199',
    'https://unique-sensitive.example.invalid',
    'Unique sensitive free-text challenge.',
    'unique-sensitive-turnstile-token',
    '192.0.2.20',
    'production-gateway-test',
    'clientKey',
    RECEIVER
  ]) assert.equal(logs.includes(prohibited), false);
  assert.match(logs, /"event":"request_accepted"/);
  assert.match(logs, /"request_ref":"[a-f0-9]{24}"/);
});

test('logs omit raw upstream bodies and private exception details', async () => {
  const malformed = await captureLogs(() => run(payload(), { receiverHtml: true }));
  assert.equal(malformed.result.response.status, 503);
  assert.equal(JSON.stringify(malformed.entries).includes('private upstream page'), false);

  const privateFailure = new Error('private stack trace marker');
  privateFailure.stack = 'private stack trace body';
  const unexpected = await captureLogs(() => run(payload(), {
    env: {
      BUSINESS_SNAPSHOT_RATE_LIMITER: {
        limit: async () => { throw privateFailure; }
      }
    }
  }));
  const unexpectedLogs = JSON.stringify(unexpected.entries);
  assert.equal(unexpected.result.response.status, 503);
  assert.equal(unexpectedLogs.includes('private stack trace marker'), false);
  assert.equal(unexpectedLogs.includes('private stack trace body'), false);
});

test('route, method, and preflight handling remain narrow and typed', async () => {
  const route = await handleRequest(request(null, {
    method: 'GET',
    url: `${ORIGIN}/`
  }), environment(), {});
  assert.equal(route.status, 404);

  const method = await handleRequest(request(null, { method: 'PUT' }), environment(), {});
  assert.equal(method.status, 405);

  const preflight = await handleRequest(request(null, { method: 'OPTIONS' }), environment(), {});
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});
