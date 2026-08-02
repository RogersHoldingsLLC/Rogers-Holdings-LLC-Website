import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEBSITE = path.resolve(ROOT, '..');
const STAGING = path.join(WEBSITE, 'staging-gateway');

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

test('production and staging gateways remain structurally isolated', () => {
  const production = read('src/worker.js');
  const staging = fs.readFileSync(path.join(STAGING, 'src/worker.js'), 'utf8');
  const productionConfig = read('wrangler.jsonc');
  const stagingConfig = fs.readFileSync(path.join(STAGING, 'wrangler.jsonc'), 'utf8');
  const productionManifest = JSON.parse(productionConfig);
  const stagingManifest = JSON.parse(stagingConfig);
  assert.equal(production.includes("from './staging-page.js'"), false);
  assert.equal(production.includes('NON_PRODUCTION'), false);
  assert.equal(production.includes('testSecret'), false);
  assert.equal(production.includes('testClientId'), false);
  assert.equal(staging.includes('NON_PRODUCTION'), true);
  assert.equal(staging.includes('testSecret'), true);
  assert.match(productionConfig, /business-snapshot-production/);
  assert.match(stagingConfig, /business-snapshot-staging/);
  assert.notEqual(productionManifest.name, stagingManifest.env.staging.name);
  const productionNamespaces = new Set(
    productionManifest.ratelimits.map((binding) => binding.namespace_id)
  );
  assert.equal(
    stagingManifest.env.staging.ratelimits.some(
      (binding) => productionNamespaces.has(binding.namespace_id)
    ),
    false
  );
  assert.equal(productionManifest.workers_dev, false);
  assert.notEqual(hash(path.join(ROOT, 'src/worker.js')), hash(path.join(STAGING, 'src/worker.js')));
});

test('tracked production configuration contains no private values', () => {
  const files = [
    '.dev.vars.example',
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

test('current website public payload remains accepted by the production gateway', () => {
  const site = fs.readFileSync(path.join(WEBSITE, 'assets/js/site.js'), 'utf8');
  for (const field of [
    'schemaVersion', 'requestId', 'fullName', 'businessName', 'email', 'phone',
    'website', 'primaryChallenge', 'consent', 'turnstileToken'
  ]) assert.match(site, new RegExp(`\\b${field}\\b`));
  assert.equal(site.includes('receiverSecret'), false);
  assert.equal(site.includes('clientKey'), false);
});

test('deployment package inventory is fixed and identifier-free', () => {
  const packageScript = read('scripts/package.mjs');
  assert.match(packageScript, /\['package\.json', 'src\/worker\.js', 'wrangler\.jsonc'\]/);
  assert.equal(packageScript.includes('.dev.vars'), false);
  assert.equal(packageScript.includes('staging-gateway'), false);
});
