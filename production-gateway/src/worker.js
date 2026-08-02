const API_PATH = '/api/business-snapshot';
const SCHEMA_VERSION = 'business-snapshot.v1';
const CONSENT_VALUE = 'business-snapshot-contact-consent-v1';
const MAX_BODY_BYTES = 12 * 1024;
const TURNSTILE_TIMEOUT_MS = 5000;
const RECEIVER_TIMEOUT_MS = 28000;
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const FIELD_LIMITS = {
  fullName: { minimum: 1, maximum: 120, multiline: false },
  businessName: { minimum: 1, maximum: 140, multiline: false },
  email: { minimum: 3, maximum: 254, multiline: false },
  phone: { minimum: 0, maximum: 30, multiline: false },
  website: { minimum: 0, maximum: 2048, multiline: false },
  primaryChallenge: { minimum: 20, maximum: 2000, multiline: true }
};
const ALLOWED_FIELDS = new Set([
  'schemaVersion',
  'requestId',
  'fullName',
  'businessName',
  'email',
  'phone',
  'website',
  'primaryChallenge',
  'consent',
  'turnstileToken',
  'company'
]);
const SAFE_MESSAGES = {
  BUSINESS_SNAPSHOT_VALIDATION: 'The submitted Business Snapshot data is invalid.',
  BUSINESS_SNAPSHOT_DUPLICATE_ENTITY: 'A matching business or email already exists.',
  BUSINESS_SNAPSHOT_LOCK_TIMEOUT: 'The service is busy. Please retry shortly.',
  BUSINESS_SNAPSHOT_CONFIGURATION: 'The service is not configured correctly.',
  BUSINESS_SNAPSHOT_TEMPORARY_FAILURE: 'The service is temporarily unavailable.',
  BUSINESS_SNAPSHOT_RECONCILIATION_REQUIRED: 'The request requires administrative review.'
};
const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

class GatewayError extends Error {
  constructor(code, safeMessage, status = 400, event = 'request_rejected') {
    super(event);
    this.name = 'GatewayError';
    this.code = code;
    this.safeMessage = safeMessage;
    this.status = status;
    this.event = event;
  }
}

function jsonResponse(body, status, origin) {
  const headers = new Headers(JSON_HEADERS);
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function publicError(error, requestId, origin) {
  const known = error instanceof GatewayError && SAFE_MESSAGES[error.code];
  const code = known ? error.code : 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE';
  const message = known && error.safeMessage ? error.safeMessage : SAFE_MESSAGES[code];
  const status = known ? error.status : 503;
  return jsonResponse({
    ok: false,
    environment: 'production',
    requestId: String(requestId || ''),
    code,
    message
  }, status, origin);
}

function safeLog(event, metadata = {}) {
  console.log(JSON.stringify({
    event,
    environment: 'production',
    code: String(metadata.code || ''),
    status: Number(metadata.status || 0)
  }));
}

function requiredEnvironment(env) {
  const values = [
    'BUSINESS_SNAPSHOT_RECEIVER_URL',
    'BUSINESS_SNAPSHOT_RECEIVER_SECRET',
    'BUSINESS_SNAPSHOT_ENVIRONMENT',
    'BUSINESS_SNAPSHOT_ALLOWED_ORIGIN'
  ];
  if (values.some((key) => typeof env[key] !== 'string' || !env[key].trim())) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_CONFIGURATION',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_CONFIGURATION,
      503,
      'configuration_missing'
    );
  }
  if (env.BUSINESS_SNAPSHOT_ENVIRONMENT !== 'production') {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_CONFIGURATION',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_CONFIGURATION,
      503,
      'environment_mismatch'
    );
  }
  let receiver;
  try {
    receiver = new URL(env.BUSINESS_SNAPSHOT_RECEIVER_URL);
  } catch {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_CONFIGURATION',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_CONFIGURATION,
      503,
      'receiver_url_invalid'
    );
  }
  if (
    receiver.protocol !== 'https:' ||
    receiver.hostname !== 'script.google.com' ||
    !/^\/macros\/s\/[^/]+\/exec$/.test(receiver.pathname) ||
    receiver.username ||
    receiver.password ||
    receiver.search ||
    receiver.hash
  ) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_CONFIGURATION',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_CONFIGURATION,
      503,
      'receiver_url_invalid'
    );
  }
}

function allowedOrigin(request, env) {
  const configured = env.BUSINESS_SNAPSHOT_ALLOWED_ORIGIN;
  let expected;
  try {
    const parsed = new URL(configured);
    if (
      parsed.protocol !== 'https:' ||
      parsed.origin !== configured ||
      parsed.username ||
      parsed.password
    ) throw new Error('invalid origin');
    expected = parsed.origin;
  } catch {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_CONFIGURATION',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_CONFIGURATION,
      503,
      'origin_configuration_invalid'
    );
  }
  const provided = request.headers.get('Origin');
  if (!provided || provided !== expected) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'The request origin is not permitted.',
      403,
      'origin_rejected'
    );
  }
  return expected;
}

function normalizeSingleLine(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeMultiline(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .split('\n')
    .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseAndValidate(bodyText) {
  let raw;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Request body must contain valid JSON.',
      400,
      'json_invalid'
    );
  }
  if (!raw || Array.isArray(raw) || typeof raw !== 'object') {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Request body must be a JSON object.',
      400,
      'json_shape_invalid'
    );
  }
  if (Object.keys(raw).some((field) => !ALLOWED_FIELDS.has(field))) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Request contains unsupported fields.',
      400,
      'field_unknown'
    );
  }
  if (raw.schemaVersion !== SCHEMA_VERSION) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Unsupported schema version.',
      400,
      'schema_invalid'
    );
  }
  const requestId = normalizeSingleLine(raw.requestId).toLowerCase();
  if (!UUID_V4.test(requestId)) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Request identifier is invalid.',
      400,
      'request_id_invalid'
    );
  }
  const normalized = { schemaVersion: SCHEMA_VERSION, requestId };
  for (const [field, limits] of Object.entries(FIELD_LIMITS)) {
    if (raw[field] !== undefined && typeof raw[field] !== 'string') {
      throw new GatewayError(
        'BUSINESS_SNAPSHOT_VALIDATION',
        'Request fields must be strings.',
        400,
        'field_type_invalid'
      );
    }
    normalized[field] = limits.multiline
      ? normalizeMultiline(raw[field])
      : normalizeSingleLine(raw[field]);
    const length = normalized[field].length;
    if (length < limits.minimum || length > limits.maximum) {
      throw new GatewayError(
        'BUSINESS_SNAPSHOT_VALIDATION',
        'A request field has an invalid length.',
        400,
        'field_length_invalid'
      );
    }
  }
  normalized.email = normalized.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized.email)) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Email address is invalid.',
      400,
      'email_invalid'
    );
  }
  if (normalized.website && !/^https?:\/\/[^\s]+$/i.test(normalized.website)) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Website must be an absolute HTTP(S) URL.',
      400,
      'website_invalid'
    );
  }
  if (raw.consent !== CONSENT_VALUE) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Consent value is invalid.',
      400,
      'consent_invalid'
    );
  }
  if (raw.company !== undefined && typeof raw.company !== 'string') {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Request fields must be strings.',
      400,
      'honeypot_type_invalid'
    );
  }
  if (normalizeSingleLine(raw.company)) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'The submitted Business Snapshot data is invalid.',
      400,
      'honeypot_rejected'
    );
  }
  if (raw.turnstileToken !== undefined && typeof raw.turnstileToken !== 'string') {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Human verification is invalid.',
      400,
      'turnstile_invalid'
    );
  }
  if (String(raw.turnstileToken || '').length > 2048) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Human verification is invalid.',
      400,
      'turnstile_invalid'
    );
  }
  normalized.consent = CONSENT_VALUE;
  normalized.turnstileToken = String(raw.turnstileToken || '').trim();
  return normalized;
}

async function sha256Prefix(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 24);
}

async function fetchWithTimeout(fetcher, url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetcher(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyTurnstile(submission, request, env, fetcher) {
  const secret = String(env.TURNSTILE_SECRET_KEY || '').trim();
  const action = String(env.BUSINESS_SNAPSHOT_TURNSTILE_ACTION || '').trim();
  const hostname = String(env.BUSINESS_SNAPSHOT_TURNSTILE_HOSTNAME || '').trim();
  const configured = Boolean(secret || action || hostname);
  if (!configured) return;
  if (!secret || !action || !hostname) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_CONFIGURATION',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_CONFIGURATION,
      503,
      'turnstile_configuration_incomplete'
    );
  }
  if (!submission.turnstileToken) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Human verification is required.',
      400,
      'turnstile_missing'
    );
  }
  const form = new FormData();
  form.set('secret', secret);
  form.set('response', submission.turnstileToken);
  form.set('idempotency_key', submission.requestId);
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) form.set('remoteip', remoteIp);

  let response;
  try {
    response = await fetchWithTimeout(fetcher, TURNSTILE_URL, {
      method: 'POST',
      body: form
    }, TURNSTILE_TIMEOUT_MS);
  } catch {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      'Human verification is temporarily unavailable.',
      503,
      'turnstile_unavailable'
    );
  }
  if (!response.ok) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      'Human verification is temporarily unavailable.',
      503,
      'turnstile_unavailable'
    );
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      'Human verification is temporarily unavailable.',
      503,
      'turnstile_response_invalid'
    );
  }
  if (!result || result.success !== true) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Human verification failed. Please try again.',
      400,
      'turnstile_rejected'
    );
  }
  if (
    action &&
    result.action !== action
  ) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Human verification failed. Please try again.',
      400,
      'turnstile_action_mismatch'
    );
  }
  if (
    hostname &&
    result.hostname !== hostname
  ) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_VALIDATION',
      'Human verification failed. Please try again.',
      400,
      'turnstile_hostname_mismatch'
    );
  }
}

async function enforceRateLimits(submission, request, env) {
  if (
    !env.BUSINESS_SNAPSHOT_RATE_LIMITER ||
    !env.BUSINESS_SNAPSHOT_REQUEST_LIMITER
  ) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_CONFIGURATION',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_CONFIGURATION,
      503,
      'rate_limit_unconfigured'
    );
  }
  const clientSource = [
    request.headers.get('CF-Connecting-IP') || 'unknown',
    request.headers.get('User-Agent') || 'unknown'
  ].join('|');
  const clientKey = await sha256Prefix(clientSource);
  const [clientResult, requestResult] = await Promise.all([
    env.BUSINESS_SNAPSHOT_RATE_LIMITER.limit({ key: clientKey }),
    env.BUSINESS_SNAPSHOT_REQUEST_LIMITER.limit({
      key: `${clientKey}:${submission.requestId}`
    })
  ]);
  if (!clientResult.success || !requestResult.success) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      'The request limit has been reached. Please retry later.',
      429,
      'rate_limited'
    );
  }
  return clientKey;
}

async function callReceiver(
  submission,
  clientKey,
  env,
  fetcher,
  timeoutMs = RECEIVER_TIMEOUT_MS
) {
  const payload = {
    schemaVersion: submission.schemaVersion,
    requestId: submission.requestId,
    fullName: submission.fullName,
    businessName: submission.businessName,
    email: submission.email,
    phone: submission.phone,
    website: submission.website,
    primaryChallenge: submission.primaryChallenge,
    consent: submission.consent,
    receiverSecret: env.BUSINESS_SNAPSHOT_RECEIVER_SECRET,
    clientKey
  };
  let response;
  try {
    response = await fetchWithTimeout(fetcher, env.BUSINESS_SNAPSHOT_RECEIVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    }, timeoutMs);
  } catch {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_TEMPORARY_FAILURE,
      503,
      'receiver_timeout'
    );
  }
  const contentType = response.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    if (response.body) await response.body.cancel();
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_TEMPORARY_FAILURE,
      503,
      'receiver_non_json'
    );
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_TEMPORARY_FAILURE,
      503,
      'receiver_json_invalid'
    );
  }
  if (
    !result ||
    result.environment !== 'production' ||
    result.requestId !== submission.requestId ||
    typeof result.ok !== 'boolean'
  ) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_TEMPORARY_FAILURE,
      503,
      'receiver_contract_invalid'
    );
  }
  if (result.ok === false) {
    const code = SAFE_MESSAGES[result.code]
      ? result.code
      : 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE';
    const statusByCode = {
      BUSINESS_SNAPSHOT_VALIDATION: 400,
      BUSINESS_SNAPSHOT_DUPLICATE_ENTITY: 409,
      BUSINESS_SNAPSHOT_LOCK_TIMEOUT: 503,
      BUSINESS_SNAPSHOT_CONFIGURATION: 503,
      BUSINESS_SNAPSHOT_TEMPORARY_FAILURE: 503,
      BUSINESS_SNAPSHOT_RECONCILIATION_REQUIRED: 409
    };
    throw new GatewayError(
      code,
      SAFE_MESSAGES[code],
      statusByCode[code],
      'receiver_typed_error'
    );
  }
  if (
    typeof result.prospectId !== 'string' ||
    !result.prospectId ||
    typeof result.retry !== 'boolean'
  ) {
    throw new GatewayError(
      'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      SAFE_MESSAGES.BUSINESS_SNAPSHOT_TEMPORARY_FAILURE,
      503,
      'receiver_success_invalid'
    );
  }
  return {
    ok: true,
    environment: 'production',
    requestId: submission.requestId,
    retry: result.retry
  };
}

export async function handleRequest(request, env, _ctx, dependencies = {}) {
  const fetcher = dependencies.fetch || globalThis.fetch;
  const receiverTimeoutMs =
    dependencies.receiverTimeoutMs || RECEIVER_TIMEOUT_MS;
  const url = new URL(request.url);

  if (url.pathname !== API_PATH) {
    return jsonResponse({
      ok: false,
      environment: 'production',
      requestId: '',
      code: 'BUSINESS_SNAPSHOT_VALIDATION',
      message: 'Route not found.'
    }, 404);
  }
  if (request.method === 'OPTIONS') {
    try {
      requiredEnvironment(env);
      const origin = allowedOrigin(request, env);
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '600',
          'Vary': 'Origin'
        }
      });
    } catch (error) {
      return publicError(error, '', '');
    }
  }
  if (request.method !== 'POST') {
    return jsonResponse({
      ok: false,
      environment: 'production',
      requestId: '',
      code: 'BUSINESS_SNAPSHOT_VALIDATION',
      message: 'Method not allowed.'
    }, 405);
  }

  let requestId = '';
  let origin = '';
  try {
    requiredEnvironment(env);
    origin = allowedOrigin(request, env);
    const contentType = (request.headers.get('Content-Type') || '')
      .toLowerCase()
      .split(';')[0]
      .trim();
    if (contentType !== 'application/json') {
      throw new GatewayError(
        'BUSINESS_SNAPSHOT_VALIDATION',
        'Content-Type must be application/json.',
        415,
        'content_type_invalid'
      );
    }
    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      throw new GatewayError(
        'BUSINESS_SNAPSHOT_VALIDATION',
        'Request body is too large.',
        413,
        'body_too_large'
      );
    }
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > MAX_BODY_BYTES) {
      throw new GatewayError(
        'BUSINESS_SNAPSHOT_VALIDATION',
        'Request body is too large.',
        413,
        'body_too_large'
      );
    }
    const submission = parseAndValidate(new TextDecoder().decode(buffer));
    requestId = submission.requestId;
    const clientKey = await enforceRateLimits(submission, request, env);
    await verifyTurnstile(submission, request, env, fetcher);
    const result = await callReceiver(
      submission,
      clientKey,
      env,
      fetcher,
      receiverTimeoutMs
    );
    safeLog('request_accepted', {
      status: 200
    });
    return jsonResponse(result, 200, origin);
  } catch (error) {
    const response = publicError(error, requestId, origin);
    safeLog(error instanceof GatewayError ? error.event : 'unexpected_error', {
      code: error instanceof GatewayError ? error.code : 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',
      status: response.status
    });
    return response;
  }
}

export default {
  fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};

export const __test = {
  ALLOWED_FIELDS,
  FIELD_LIMITS,
  MAX_BODY_BYTES,
  RECEIVER_TIMEOUT_MS,
  TURNSTILE_TIMEOUT_MS,
  parseAndValidate
};
