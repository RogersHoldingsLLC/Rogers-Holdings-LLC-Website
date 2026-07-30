import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRequest, __test } from '../src/worker.js';

const ORIGIN = 'https://staging.example.test';
const API = `${ORIGIN}/api/business-snapshot`;
const RECEIVER = 'https://script.google.com/macros/s/nonproduction-test/exec';

function payload(overrides = {}) {
  return {
    schemaVersion: 'business-snapshot.v1',
    requestId: '123e4567-e89b-42d3-a456-426614174000',
    fullName: 'NONPROD Taylor Example',
    businessName: 'NONPROD Example Company',
    email: 'nonprod@example.invalid',
    phone: '+1-555-0100',
    website: 'https://example.invalid',
    primaryChallenge: 'NONPROD synthetic challenge for staging gateway validation.',
    consent: 'business-snapshot-contact-consent-v1',
    turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
    ...overrides
  };
}

function limiter(success = true) {
  return { limit: async () => ({ success }) };
}

function env(overrides = {}) {
  return {
    BUSINESS_SNAPSHOT_RECEIVER_URL: RECEIVER,
    BUSINESS_SNAPSHOT_RECEIVER_SECRET: 'receiver-secret-for-test-harness',
    TURNSTILE_SECRET_KEY: 'turnstile-test-secret',
    TURNSTILE_SITE_KEY: 'turnstile-test-site-key',
    BUSINESS_SNAPSHOT_ENVIRONMENT: 'NON_PRODUCTION',
    BUSINESS_SNAPSHOT_ALLOWED_ORIGIN: ORIGIN,
    BUSINESS_SNAPSHOT_TURNSTILE_ACTION: '',
    BUSINESS_SNAPSHOT_TURNSTILE_HOSTNAME: '',
    BUSINESS_SNAPSHOT_RATE_LIMITER: limiter(),
    BUSINESS_SNAPSHOT_REQUEST_LIMITER: limiter(),
    ...overrides
  };
}

function request(body = payload(), options = {}) {
  const contentType = options.contentType === undefined
    ? 'application/json'
    : options.contentType;
  const headers = {
    Origin: options.origin === undefined ? ORIGIN : options.origin,
    'CF-Connecting-IP': '192.0.2.20'
  };
  if (contentType) headers['Content-Type'] = contentType;
  return new Request(API, {
    method: options.method || 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

function fetchHarness(options = {}) {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, init });
    if (String(url).includes('siteverify')) {
      if (options.turnstileReject) {
        return Response.json({
          success: false,
          'error-codes': [options.turnstileCode || 'invalid-input-response']
        });
      }
      if (options.turnstileUnavailable) {
        throw new Error('private Turnstile outage');
      }
      return Response.json({
        success: true,
        hostname: options.hostname || 'staging.example.test',
        action: options.action || 'business_snapshot'
      });
    }
    if (options.receiverTimeout) {
      return new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => {
          const error = new Error('private timeout');
          error.name = 'AbortError';
          reject(error);
        });
      });
    }
    if (options.receiverHtml) {
      return new Response('<html>private login page</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    if (options.receiverError) {
      return Response.json({
        ok: false,
        environment: 'NON_PRODUCTION',
        requestId: payload().requestId,
        code: options.receiverError,
        message: 'private upstream message',
        diagnostics: { private: true }
      });
    }
    return Response.json({
      ok: true,
      environment: 'NON_PRODUCTION',
      requestId: payload().requestId,
      prospectId: 'PROS-NONPROD0001',
      retry: !!options.retry
    });
  };
  return { calls, fetcher };
}

async function run(body = payload(), options = {}) {
  const harness = fetchHarness(options);
  const response = await handleRequest(
    request(body, options.requestOptions),
    env(options.env),
    {},
    {
      fetch: harness.fetcher,
      now: options.now || (() => Date.parse('2026-07-29T20:00:00.000Z')),
      receiverTimeoutMs: options.receiverTimeoutMs
    }
  );
  const text = await response.text();
  return {
    response,
    body: JSON.parse(text),
    raw: text,
    calls: harness.calls
  };
}

test('valid submission verifies Turnstile then calls receiver with server acceptedAt', async () => {
  const result = await run();
  assert.equal(result.response.status, 200);
  assert.deepEqual(result.body, {
    ok: true,
    environment: 'NON_PRODUCTION',
    requestId: payload().requestId,
    prospectId: 'PROS-NONPROD0001',
    retry: false
  });
  assert.equal(result.calls.length, 2);
  assert.match(result.calls[0].url, /siteverify/);
  assert.equal(result.calls[1].url, RECEIVER);
  const receiverPayload = JSON.parse(result.calls[1].init.body);
  assert.equal(receiverPayload.acceptedAt, '2026-07-29T20:00:00.000Z');
  assert.equal(receiverPayload.testSecret, 'receiver-secret-for-test-harness');
  assert.equal('turnstileToken' in receiverPayload, false);
});

test('malformed JSON is rejected before external calls', async () => {
  const result = await run('{');
  assert.equal(result.response.status, 400);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_VALIDATION');
  assert.equal(result.calls.length, 0);
});

test('wrong content type is rejected', async () => {
  const result = await run(payload(), {
    requestOptions: { contentType: 'text/plain' }
  });
  assert.equal(result.response.status, 415);
  assert.equal(result.calls.length, 0);
});

test('missing Turnstile token is rejected', async () => {
  const result = await run(payload({ turnstileToken: '' }));
  assert.equal(result.response.status, 400);
  assert.equal(result.calls.length, 0);
});

test('invalid Turnstile token blocks receiver call', async () => {
  const result = await run(payload(), { turnstileReject: true });
  assert.equal(result.response.status, 400);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_VALIDATION');
  assert.equal(result.calls.length, 1);
});

test('expired or duplicate Turnstile token blocks receiver call', async () => {
  const result = await run(payload(), {
    turnstileReject: true,
    turnstileCode: 'timeout-or-duplicate'
  });
  assert.equal(result.response.status, 400);
  assert.equal(result.calls.length, 1);
  assert.equal(result.raw.includes('timeout-or-duplicate'), false);
});

test('Turnstile outage is a safe temporary failure', async () => {
  const result = await run(payload(), { turnstileUnavailable: true });
  assert.equal(result.response.status, 503);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE');
  assert.equal(result.raw.includes('private'), false);
});

test('Turnstile action and hostname mismatches block the receiver', async () => {
  const action = await run(payload(), {
    action: 'wrong_action',
    env: { BUSINESS_SNAPSHOT_TURNSTILE_ACTION: 'business_snapshot' }
  });
  assert.equal(action.response.status, 400);
  assert.equal(action.calls.length, 1);

  const hostname = await run(payload(), {
    hostname: 'wrong.example.test',
    env: { BUSINESS_SNAPSHOT_TURNSTILE_HOSTNAME: 'staging.example.test' }
  });
  assert.equal(hostname.response.status, 400);
  assert.equal(hostname.calls.length, 1);
});

test('receiver timeout is sanitized and deterministic', async () => {
  const result = await run(payload(), {
    receiverTimeout: true,
    receiverTimeoutMs: 5
  });
  assert.equal(result.response.status, 503);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE');
  assert.equal(result.raw.includes('private timeout'), false);
});

test('missing receiver secret is a configuration failure', async () => {
  const result = await run(payload(), {
    env: { BUSINESS_SNAPSHOT_RECEIVER_SECRET: '' }
  });
  assert.equal(result.response.status, 503);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_CONFIGURATION');
  assert.equal(result.calls.length, 0);
});

test('missing required field is rejected', async () => {
  const result = await run(payload({ fullName: '' }));
  assert.equal(result.response.status, 400);
  assert.equal(result.calls.length, 0);
});

test('malformed UUID is rejected', async () => {
  const result = await run(payload({ requestId: 'not-a-uuid' }));
  assert.equal(result.response.status, 400);
  assert.equal(result.calls.length, 0);
});

test('unsupported schemaVersion is rejected', async () => {
  const result = await run(payload({ schemaVersion: 'business-snapshot.v2' }));
  assert.equal(result.response.status, 400);
  assert.equal(result.calls.length, 0);
});

test('oversized body is rejected', async () => {
  const oversized = JSON.stringify(payload()) + ' '.repeat(__test.MAX_BODY_BYTES);
  const result = await run(oversized);
  assert.equal(result.response.status, 413);
  assert.equal(result.calls.length, 0);
});

test('oversized field is rejected after normalization', async () => {
  const result = await run(payload({ fullName: 'x'.repeat(121) }));
  assert.equal(result.response.status, 400);
  assert.equal(result.calls.length, 0);
});

test('unknown field and browser-supplied acceptedAt are rejected', async () => {
  for (const extra of [
    { unknown: 'value' },
    { acceptedAt: '2000-01-01T00:00:00.000Z' }
  ]) {
    const result = await run(payload(extra));
    assert.equal(result.response.status, 400);
    assert.equal(result.calls.length, 0);
  }
});

test('unapproved or missing Origin is rejected', async () => {
  for (const origin of ['https://evil.example', '']) {
    const result = await run(payload(), {
      requestOptions: { origin }
    });
    assert.equal(result.response.status, 403);
    assert.equal(result.calls.length, 0);
  }
});

test('typed receiver validation error is sanitized', async () => {
  const result = await run(payload(), {
    receiverError: 'BUSINESS_SNAPSHOT_VALIDATION'
  });
  assert.equal(result.response.status, 400);
  assert.equal(result.body.message, 'The submitted Business Snapshot data is invalid.');
  assert.equal(result.raw.includes('diagnostics'), false);
  assert.equal(result.raw.includes('private upstream'), false);
});

test('unknown receiver error is sanitized', async () => {
  const result = await run(payload(), {
    receiverError: 'PRIVATE_UNKNOWN_CODE'
  });
  assert.equal(result.response.status, 503);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE');
  assert.equal(result.raw.includes('PRIVATE_UNKNOWN_CODE'), false);
});

test('receiver non-JSON response is rejected safely', async () => {
  const result = await run(payload(), { receiverHtml: true });
  assert.equal(result.response.status, 503);
  assert.equal(result.raw.includes('login page'), false);
});

test('rate-limit response is safe and prevents external calls', async () => {
  const result = await run(payload(), {
    env: { BUSINESS_SNAPSHOT_RATE_LIMITER: limiter(false) }
  });
  assert.equal(result.response.status, 429);
  assert.equal(result.body.code, 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE');
  assert.equal(result.calls.length, 0);
});

test('idempotent retry preserves requestId and retry response', async () => {
  const result = await run(payload(), { retry: true });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.requestId, payload().requestId);
  assert.equal(result.body.retry, true);
});

test('method and route restrictions return JSON', async () => {
  const methodResponse = await handleRequest(new Request(API, {
    method: 'PUT',
    headers: { Origin: ORIGIN }
  }), env(), {});
  assert.equal(methodResponse.status, 405);
  assert.match(methodResponse.headers.get('Content-Type'), /^application\/json/);

  const routeResponse = await handleRequest(new Request(`${ORIGIN}/private`, {
    method: 'GET'
  }), env(), {});
  assert.equal(routeResponse.status, 404);
  assert.match(routeResponse.headers.get('Content-Type'), /^application\/json/);
});

test('staging page exposes only public test sitekey, never internal configuration', async () => {
  const response = await handleRequest(new Request(`${ORIGIN}/`), env(), {});
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.equal(html.includes('turnstile-test-site-key'), true);
  assert.equal(html.includes(RECEIVER), false);
  assert.equal(html.includes('receiver-secret-for-test-harness'), false);
  assert.equal(html.includes('Spreadsheet'), false);
});
