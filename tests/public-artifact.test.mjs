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
assert.deepEqual(PUBLIC_MANIFEST, JSON.parse(fs.readFileSync(new URL('./approved-public-manifest.json', import.meta.url), 'utf8')), 'reviewed v68 production manifest plus approved homepage share image and MONOFORM project route');
assert.equal(PUBLIC_MANIFEST.length, 351);

for (const [route, slug] of [
  ['our-work/monoform/index.html', 'monoform-tour-v1'],
  ['portfolio/projects/precision-fabrication/index.html', 'form-field-tour-v1']
]) {
  const page = fs.readFileSync(path.join(REPOSITORY_ROOT, route), 'utf8');
  assert.match(page, /id="walkthrough"/);
  assert.match(page, /<video hidden controls playsinline muted loop preload="none"/);
  assert.doesNotMatch(page.match(/<video[^>]*>/)[0], /\bsrc=/, 'do not fetch the walkthrough before a click');
  assert.ok(page.includes(`href="/assets/media/${slug}.mp4" data-tour-fallback`));
  assert.ok(fs.statSync(path.join(REPOSITORY_ROOT, `assets/media/${slug}.webp`)).size < 80_000);
  const media = fs.readFileSync(path.join(REPOSITORY_ROOT, `assets/media/${slug}.mp4`));
  assert.equal(media.subarray(4, 8).toString(), 'ftyp');
  assert.ok(media.indexOf('moov') > 0 && media.indexOf('moov') < media.indexOf('mdat'), 'streamable MP4');
}

const aboutPortrait = 'assets/images/about/keith.webp';
assert.ok(PUBLIC_MANIFEST.includes(aboutPortrait));
assert.ok(fs.statSync(path.join(REPOSITORY_ROOT, aboutPortrait)).size < 100_000);
assert.match(fs.readFileSync(path.join(REPOSITORY_ROOT, 'about/index.html'), 'utf8'), /<img src="\.\.\/assets\/images\/about\/keith\.webp\?v=[a-f0-9]{12}" width="1040" height="1300"/);

assert.match(fs.readFileSync(path.join(REPOSITORY_ROOT, 'about/index.html'), 'utf8'), /alt="Brian Keith Rogers, founder of Rogers Holdings LLC, wearing a white Rogers Holdings polo"/);

const samplePdf = 'assets/samples/north-point-fitness-executive-brief.pdf';
assert.ok(PUBLIC_MANIFEST.includes(samplePdf));
const samplePdfBytes = fs.readFileSync(path.join(REPOSITORY_ROOT, samplePdf));
assert.equal(samplePdfBytes.subarray(0, 5).toString(), '%PDF-');
const firstBuild = buildPublicArtifact();
assert.deepEqual(firstBuild, PUBLIC_MANIFEST);
assert.deepEqual(fs.readFileSync(path.join(OUTPUT_ROOT, samplePdf)), samplePdfBytes);

for (const relativePath of PUBLIC_MANIFEST) {
  assert.ok(fs.existsSync(path.join(OUTPUT_ROOT, relativePath)), `missing artifact file: ${relativePath}`);
}

const publicTextFiles = firstBuild.filter((entry) => /\.(?:css|html|js|svg|txt|vcf|xml)$/i.test(entry));
const publicText = publicTextFiles
  .map((relativePath) => fs.readFileSync(path.join(OUTPUT_ROOT, relativePath), 'utf8'))
  .join('\n');
assert.doesNotMatch(publicText, /docs\.google\.com|drive\.google\.com|script\.google\.com|PRIVATE DESIGN PREVIEW|LIVE SITE UNCHANGED|rh38-qa|\.openai\//i, 'public artifact must not expose private documents, receiver URLs or preview controls');
assert.doesNotMatch(publicText, /call or text/i);
// Owner-approved public pricing boundary applies to metadata and JSON-LD too.
assert.doesNotMatch(publicText, /\$\s*(?:2,?000|250)\b|starting\s+(?:at|from)\s+\$|minimum\s+(?:project\s+)?price|"priceCurrency"/i);
const packages = fs.readFileSync(path.join(OUTPUT_ROOT, 'packages/index.html'), 'utf8');
assert.match(packages, /id="business-presence"/);
assert.match(packages, /id="business-systems"/);
assert.match(packages, /recommend only the work you need/);
assert.match(packages, /free, optional and separate/);
assert.match(packages, /You retain ownership of your business content and accounts/);
assert.match(packages, /Domain registration, hosting, third-party services and ongoing support are discussed separately/);
assert.match(packages, /Later additions need their own agreement/);
assert.doesNotMatch(packages, /<form\b|<input\b|Starter|Enhanced|Complete tier|\$[0-9]/i);


const publicSmsFiles = publicTextFiles.filter((relativePath) => (
  /sms:/i.test(fs.readFileSync(path.join(OUTPUT_ROOT, relativePath), 'utf8'))
));
assert.deepEqual(publicSmsFiles, ['brian/index.html'], 'only the digital business card may contain an SMS action');
assert.equal((publicText.match(/sms:/gi) ?? []).length, 1, 'public artifact must contain exactly one SMS URI');

const homepage = fs.readFileSync(path.join(OUTPUT_ROOT, 'index.html'), 'utf8');
assert.match(homepage, /href="\/about\/"/);
const vcard = fs.readFileSync(path.join(OUTPUT_ROOT, 'brian/brian-keith-rogers.vcf'), 'utf8');
const businessPhone = vcard.match(/^TEL;TYPE=CELL,VOICE:(\+1\d{10})\s*$/m)?.[1];
assert.ok(businessPhone, 'public vCard must contain a valid US business number');
const [area, prefix, local] = businessPhone.slice(2).match(/^(\d{3})(\d{3})(\d{4})$/).slice(1);
const businessDisplay = [area, prefix, local].join('-');
assert.ok(homepage.includes(`href="tel:${businessPhone}">Call (${area}) ${prefix}-${local}</a>`));
const homepageJsonLd = homepage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(homepageJsonLd, 'homepage structured data is required');
const homepageGraph = JSON.parse(homepageJsonLd[1])['@graph'];
const organization = homepageGraph.find((node) => node['@type'] === 'Organization');
assert.equal(organization.telephone, businessPhone);
assert.equal(organization.contactPoint[0].telephone, businessPhone);

const repairPage = fs.readFileSync(path.join(OUTPUT_ROOT, 'spreadsheet-repair/index.html'), 'utf8');
assert.match(repairPage, /<link rel="canonical" href="https:\/\/rogersholdingsllc\.com\/spreadsheet-repair\/">/);
assert.match(homepage, /href="\/services\/"/);
assert.match(fs.readFileSync(path.join(OUTPUT_ROOT,'services/index.html'),'utf8'), /id="spreadsheets"/);
assert.match(fs.readFileSync(path.join(OUTPUT_ROOT,'services/index.html'),'utf8'), /A new Custom Tracker is scoped and quoted separately from repair work/);
for(const retired of ['assets/css/clear-path-hero.css','assets/js/clear-path-hero.js','assets/media/clear-path.mp4','assets/media/clear-path-settled.jpg']) assert.ok(!PUBLIC_MANIFEST.includes(retired),'retired media must stay outside the active artifact');
assert.match(repairPage, /<h1 id="repair-service-heading">Excel &amp; Google Sheets Repair<\/h1>/);
assert.match(repairPage, /href="mailto:[^"@]+@rogersholdingsllc\.com\?subject=[^"]+">Email about a spreadsheet repair<\/a>/);
assert.doesNotMatch(repairPage, /<form\b|<input\b|<iframe\b|\sdownload(?:=|>|\s)/i);
assert.match(repairPage, /50% after written scope approval and before work/);
assert.match(repairPage, /Balance within three business days of written acceptance/);
assert.match(repairPage, /One consolidated in-scope review round within seven calendar days/);
assert.match(repairPage, /Full rebuilds, macros\/VBA, Apps Script, Power Query, external connections\/integrations/);

assert.equal(firstBuild.some((entry) => entry.startsWith('docs/review/')), false);
assert.equal(firstBuild.includes('assets/images/homepage/brian-smiling-portrait.png'), false, 'full-resolution smiling portrait must stay outside the public build');

const snapshotPage = fs.readFileSync(path.join(OUTPUT_ROOT, 'business-snapshot/index.html'), 'utf8');
assert.ok(snapshotPage.includes(`or call <a href="tel:${businessPhone}">${businessDisplay}</a>`));

const emailSignature = fs.readFileSync(path.join(OUTPUT_ROOT, 'email-signature/index.html'), 'utf8');
assert.equal(emailSignature.match(/id="phoneInput"[^>]*value="([^"]+)"/)?.[1], businessDisplay);
assert.deepEqual(emailSignature.match(/id="sigPhone" href="tel:([^"]+)"[^>]*>([^<]+)<\/a>/)?.slice(1), [businessPhone, businessDisplay]);
assert.ok(emailSignature.includes(`fields.phone.value = '${businessDisplay}'`));


const digitalCard = fs.readFileSync(path.join(OUTPUT_ROOT, 'brian/index.html'), 'utf8');
assert.ok(digitalCard.includes(`href="tel:${businessPhone}"`));
assert.ok(digitalCard.includes(`href="sms:${businessPhone}" aria-label="Text Brian Keith Rogers at ${businessDisplay}"`));
assert.equal((digitalCard.match(/href="sms:/gi) ?? []).length, 1, 'digital card must contain exactly one SMS action');
assert.ok(digitalCard.includes(`>${businessDisplay}</a>`));

const dormantHew = fs.readFileSync(path.join(REPOSITORY_ROOT, 'hew-gates-garage/index.html'), 'utf8');
assert.ok(dormantHew.includes(`href="tel:${businessPhone}">${businessDisplay}</a>`) || dormantHew.includes(`href="tel:${businessPhone}">Call ${businessDisplay}</a>`));
assert.equal(firstBuild.includes('hew-gates-garage/index.html'), false);
assert.ok(firstBuild.includes('business-snapshot/index.html'));
assert.ok(firstBuild.includes('email-signature/index.html'));

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
// These two fictional print-demo photographs are public artwork, not private QA proof.
const approvedPrintMaterials = new Set([
  'portfolio/media/proof-materials-1280.webp',
  'portfolio/media/proof-materials-640.webp'
]);
assert.deepEqual(firstBuild.filter((entry) => /(?:proof|rollback)/i.test(entry)), [...approvedPrintMaterials].sort());
for (const relativePath of approvedPrintMaterials) {
  const image = fs.readFileSync(path.join(OUTPUT_ROOT, relativePath));
  assert.equal(image.subarray(0, 4).toString(), 'RIFF');
  assert.equal(image.subarray(8, 12).toString(), 'WEBP');
}
assert.match(fs.readFileSync(path.join(OUTPUT_ROOT, 'portfolio/print-review/index.html'), 'utf8'), /illustrative photograph/);

for (const requiredFile of [
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  'spreadsheet-repair/index.html',
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
  'assets/images/homepage/brian-smiling-portrait.webp',
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

assert.doesNotMatch(publicText,/https?:\/\/[^\s"']*(?:chatgpt\.(?:site|com)|openai\.com)/i, 'visitor-facing artifact has no ChatGPT or OpenAI destination');
