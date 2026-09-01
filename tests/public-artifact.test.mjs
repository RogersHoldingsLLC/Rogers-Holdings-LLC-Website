import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  OUTPUT_ROOT,
  PUBLIC_MANIFEST,
  REPOSITORY_ROOT,
  assertDependencyAllowed,
  assertSafeRegularFile,
  buildPublicArtifact,
  resolveInside,
  validatePublicArtifact,
  validateSourceBoundary
} from '../scripts/public-artifact.mjs';

function artifactHashes() {
  return Object.fromEntries(PUBLIC_MANIFEST.map((relativePath) => {
    const bytes = fs.readFileSync(path.join(OUTPUT_ROOT, relativePath));
    return [relativePath, crypto.createHash('sha256').update(bytes).digest('hex')];
  }));
}

validateSourceBoundary();
const firstBuild = buildPublicArtifact();
assert.deepEqual(firstBuild, PUBLIC_MANIFEST);

for (const relativePath of PUBLIC_MANIFEST) {
  assert.ok(fs.existsSync(path.join(OUTPUT_ROOT, relativePath)), `missing artifact file: ${relativePath}`);
}

for (const excludedPrefix of [
  'tests/',
  'production-gateway/',
  'hew-gates-garage/',
  'assets/images/hew-gates-garage/',
  'portfolio-assets/',
  'scripts/',
  '.github/'
]) {
  assert.equal(firstBuild.some((entry) => entry.startsWith(excludedPrefix)), false, `${excludedPrefix} must be excluded`);
}
for (const excludedFile of [
  'README.md',
  'AGENTS.md',
  'package.json',
  'favicon.svg',
  'Profile Logo.png',
  'assets/css/hew-gates-garage.css',
  'assets/js/hew-gates-garage.js'
]) {
  assert.equal(firstBuild.includes(excludedFile), false, `${excludedFile} must be excluded`);
}
const publicDocs = firstBuild.filter((entry) => entry.startsWith('docs/'));
assert.deepEqual(publicDocs, ['docs/design-reference/founder/brian-keith-rogers-headshot-original.png']);
assert.equal(firstBuild.some((entry) => /(?:proof|rollback)/i.test(entry)), false);

for (const requiredFile of [
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  'google914083dd95ef8b05.html',
  'favicon.ico',
  'favicon.png',
  'apple-touch-icon.png',
  'brand-card.jpeg',
  'assets/images/social/business-snapshot-share.jpg',
  'assets/images/social/rogers-holdings-home-share.jpg',
  'assets/css/digital-business-card.css',
  'assets/images/brand/rogers-holdings-logo.png',
  'assets/images/brand/rogers-holdings-logo-reversed.png',
  'assets/images/digital-business-card/brian-keith-rogers.jpg',
  'assets/js/digital-business-card.js',
  'brian/brian-keith-rogers.vcf',
  'brian/index.html',
  'business-snapshot/index.html',
  'docs/design-reference/founder/brian-keith-rogers-headshot-original.png',
  'email-signature/index.html'
]) assert.ok(firstBuild.includes(requiredFile), `required public file is missing: ${requiredFile}`);

for (const dormantHewSource of [
  'hew-gates-garage/index.html',
  'assets/css/hew-gates-garage.css',
  'assets/js/hew-gates-garage.js',
  'assets/images/hew-gates-garage/hew-portfolio-preview.jpg'
]) {
  assert.ok(fs.existsSync(path.join(REPOSITORY_ROOT, dormantHewSource)), `dormant HEW source is missing: ${dormantHewSource}`);
}

const publicHewPattern = /\bHEW\b|Gates?\s*(?:&|&amp;)\s*Garage|hew-gates-garage/i;
for (const relativePath of firstBuild.filter((entry) => /\.(?:css|html|js|txt|vcf|xml)$/i.test(entry))) {
  const publicText = fs.readFileSync(path.join(OUTPUT_ROOT, relativePath), 'utf8');
  assert.doesNotMatch(publicText, publicHewPattern, `public HEW reference found in ${relativePath}`);
}
assert.equal(firstBuild.includes('hew-gates-garage/index.html'), false);
assert.doesNotMatch(fs.readFileSync(path.join(OUTPUT_ROOT, 'sitemap.xml'), 'utf8'), publicHewPattern);
assert.doesNotMatch(fs.readFileSync(path.join(OUTPUT_ROOT, 'index.html'), 'utf8'), publicHewPattern);

const brianPage = fs.readFileSync(path.join(REPOSITORY_ROOT, 'brian/index.html'), 'utf8');
assert.match(brianPage, /<link rel="canonical" href="https:\/\/rogersholdingsllc\.com\/brian\/">/);
assert.match(brianPage, /href="brian-keith-rogers\.vcf" download/);

const emailSignaturePage = fs.readFileSync(
  path.join(REPOSITORY_ROOT, 'email-signature/index.html'),
  'utf8'
);
assert.match(emailSignaturePage, /<meta name="robots" content="noindex,nofollow">/);
assert.match(emailSignaturePage, />Apple Mail<\/button>/);
assert.match(emailSignaturePage, />Gmail<\/button>/);
assert.match(emailSignaturePage, /function formatPhoneNumber\(value\)/);
assert.match(emailSignaturePage, /'text\/html': new Blob\(\[html\]/);

const firstHashes = artifactHashes();
const secondBuild = buildPublicArtifact();
assert.deepEqual(secondBuild, PUBLIC_MANIFEST);
assert.deepEqual(artifactHashes(), firstHashes, 'repeated builds must be byte-for-byte idempotent');

const unexpectedFile = path.join(OUTPUT_ROOT, 'unexpected.txt');
fs.writeFileSync(unexpectedFile, 'must fail');
assert.throws(() => buildPublicArtifact(), /unexpected output file: unexpected\.txt/);
fs.rmSync(unexpectedFile);
buildPublicArtifact();
assert.deepEqual(validatePublicArtifact(), PUBLIC_MANIFEST);

assert.throws(() => resolveInside(REPOSITORY_ROOT, '../outside'), /path traversal is not allowed/);
assert.throws(
  () => assertDependencyAllowed('index.html', 'assets/images/not-allowlisted.png'),
  /local dependency is not allowlisted/
);

const safetyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rogers-public-boundary-'));
try {
  fs.writeFileSync(path.join(safetyRoot, 'regular.txt'), 'safe');
  fs.symlinkSync('regular.txt', path.join(safetyRoot, 'symbolic.txt'));
  assert.throws(() => assertSafeRegularFile(safetyRoot, 'symbolic.txt'), /symbolic link is not allowed/);
  fs.rmSync(path.join(safetyRoot, 'symbolic.txt'));

  fs.linkSync(path.join(safetyRoot, 'regular.txt'), path.join(safetyRoot, 'hard-linked.txt'));
  assert.throws(() => assertSafeRegularFile(safetyRoot, 'regular.txt'), /hard-linked file is not allowed/);
  assert.throws(() => assertSafeRegularFile(safetyRoot, 'missing.txt'), /missing allowlisted file/);
} finally {
  fs.rmSync(safetyRoot, { recursive: true, force: true });
}

const workflow = fs.readFileSync(path.join(REPOSITORY_ROOT, '.github/workflows/deploy-pages.yml'), 'utf8');
assert.match(workflow, /push:\s*\n\s+branches: \[main\]/);
assert.match(workflow, /workflow_dispatch:/);
for (const action of [
  'actions/checkout@v6',
  'actions/setup-node@v7',
  'actions/configure-pages@v5',
  'actions/upload-pages-artifact@v5',
  'actions/deploy-pages@v5'
]) assert.ok(workflow.includes(action), `workflow missing ${action}`);
assert.match(workflow, /build:[\s\S]*?permissions:\s*\n\s+contents: read\s*\n\s+pages: read/);
assert.match(workflow, /deploy:[\s\S]*?permissions:\s*\n\s+pages: write\s*\n\s+id-token: write/);
assert.match(workflow, /environment:\s*\n\s+name: github-pages/);
assert.match(workflow, /path: _site/);
assert.doesNotMatch(workflow, /enablement:\s*true|write-all|contents: write/);

const validationWorkflow = fs.readFileSync(
  path.join(REPOSITORY_ROOT, '.github/workflows/validate-public-site.yml'),
  'utf8'
);
assert.match(validationWorkflow, /pull_request:\s*\n\s+branches: \[main\]/);
assert.match(validationWorkflow, /permissions:\s*\n\s+contents: read/);
assert.match(validationWorkflow, /actions\/checkout@v6/);
assert.match(validationWorkflow, /actions\/setup-node@v7/);
assert.match(validationWorkflow, /node-version: 24/);
assert.match(validationWorkflow, /package-manager-cache: false/);
assert.match(validationWorkflow, /run: npm test/);
assert.match(validationWorkflow, /run: npm run build:public/);
assert.match(validationWorkflow, /group: validate-public-site-\$\{\{ github\.event\.pull_request\.number \}\}/);
assert.match(validationWorkflow, /cancel-in-progress: true/);
assert.doesNotMatch(
  validationWorkflow,
  /pages: write|id-token: write|configure-pages|upload-pages-artifact|deploy-pages/
);

console.log(`Public artifact boundary tests passed (${PUBLIC_MANIFEST.length} files).`);
