import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { __test } from '../src/worker.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

test('production gateway contains no staging dependency or public route', () => {
  const production = read('src/worker.js');
  const productionConfig = read('wrangler.jsonc');
  const productionManifest = JSON.parse(productionConfig);
  assert.equal(production.includes("from './staging-page.js'"), false);
  assert.equal(production.includes('NON_PRODUCTION'), false);
  assert.equal(production.includes('testSecret'), false);
  assert.equal(production.includes('testClientId'), false);
  assert.match(productionConfig, /business-snapshot-production/);
  assert.equal(productionManifest.workers_dev, false);
  assert.equal(productionManifest.preview_urls, false);
  assert.equal(productionManifest.vars.BUSINESS_SNAPSHOT_ENVIRONMENT, 'production');
  assert.equal(
    productionManifest.vars.BUSINESS_SNAPSHOT_TURNSTILE_ACTION,
    'business_snapshot'
  );
  assert.equal(
    productionManifest.vars.BUSINESS_SNAPSHOT_TURNSTILE_HOSTNAME,
    'rogersholdingsllc.com'
  );
  assert.equal(Object.hasOwn(productionManifest, 'routes'), false);
  assert.equal(Object.hasOwn(productionManifest, 'route'), false);
  assert.equal(Object.hasOwn(productionManifest, 'custom_domains'), false);
  const namespaces = productionManifest.ratelimits.map(
    (binding) => binding.namespace_id
  );
  assert.equal(new Set(namespaces).size, namespaces.length);
});

test('planned custom domain remains review-only and disconnected', () => {
  const contract = JSON.parse(read('fixtures/website-activation-contract.json'));
  const productionManifest = JSON.parse(read('wrangler.jsonc'));
  assert.equal(contract.plannedCustomDomain, 'intake.rogersholdingsllc.com');
  assert.equal(contract.routeEnabled, false);
  assert.equal(contract.websiteEndpointConfigured, false);
  assert.equal(contract.turnstileSiteKeyConfigured, false);
  assert.equal(productionManifest.workers_dev, false);
  assert.equal(productionManifest.preview_urls, false);
  assert.equal(Object.hasOwn(productionManifest, 'routes'), false);
});

test('tracked production configuration contains no private values', () => {
  const files = [
    '.dev.vars.example',
    'fixtures/website-activation-contract.json',
    'README.md',
    'package.json',
    'scripts/package.mjs',
    'src/worker.js',
    'wrangler.jsonc'
  ];
  const text = files.map(read).join('\n');
  for (const key of [
    'BUSINESS_SNAPSHOT_RECEIVER_URL',
    'BUSINESS_SNAPSHOT_RECEIVER_SECRET'
  ]) assert.match(text, new RegExp(key));
  assert.doesNotMatch(text, /AKIA[0-9A-Z]{16}/);
  assert.doesNotMatch(text, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/);
  assert.doesNotMatch(text, /script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,}\/exec/);
  assert.doesNotMatch(text, /[a-f0-9]{32,}/i);
});

test('source URL policy permits only the Turnstile provider literal', () => {
  const source = read('src/worker.js');
  const urls = source.match(/https:\/\/[^'"`\s]+/g) || [];
  assert.deepEqual(urls, [
    'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  ]);
  for (const file of ['README.md', 'wrangler.jsonc', '.dev.vars.example']) {
    assert.equal((read(file).match(/https?:\/\//g) || []).length, 0);
  }
});

test('committed website and receiver activation contract is disabled and compatible', () => {
  const contract = JSON.parse(read('fixtures/website-activation-contract.json'));
  assert.equal(contract.routeEnabled, false);
  assert.equal(contract.schemaVersion, 'business-snapshot.v1');
  assert.deepEqual(
    [...contract.publicRequestFields].sort(),
    [...__test.ALLOWED_FIELDS].sort()
  );
  assert.deepEqual(contract.publicSuccessFields, [
    'ok', 'environment', 'requestId', 'retry'
  ]);
  assert.deepEqual(contract.receiverRequestFields, [
    'schemaVersion', 'requestId', 'fullName', 'businessName', 'email', 'phone',
    'website', 'primaryChallenge', 'consent', 'receiverSecret', 'clientKey'
  ]);
  assert.deepEqual(contract.receiverSuccessFields, [
    'ok', 'environment', 'requestId', 'prospectId', 'retry'
  ]);
  assert.equal(contract.publicRequestFields.includes('receiverSecret'), false);
  assert.equal(contract.publicRequestFields.includes('clientKey'), false);
  assert.equal(contract.publicRequestFields.includes('company'), true);
  assert.equal(contract.publicRequestFields.includes('formStartedAt'), false);
  assert.equal(contract.publicRequestFields.includes('acceptedAt'), false);
  assert.equal(contract.receiverRequestFields.includes('acceptedAt'), false);
  assert.equal(contract.receiverRequestFields.includes('testSecret'), false);
  assert.equal(contract.receiverRequestFields.includes('testClientId'), false);
});

test('deployment package inventory is fixed and identifier-free', () => {
  const packageScript = read('scripts/package.mjs');
  assert.match(packageScript, /\['package\.json', 'src\/worker\.js', 'wrangler\.jsonc'\]/);
  assert.equal(packageScript.includes('.dev.vars'), false);
  assert.equal(packageScript.includes('staging-gateway'), false);
});
