const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const homepage = read('index.html');
const snapshot = read('business-snapshot/index.html');
const brian = read('brian/index.html');
const privacy = read('privacy/index.html');
const sitemap = read('sitemap.xml');
const css = read('assets/css/site.css');
const visualSystem = read('docs/EXECUTIVE_VISUAL_SYSTEM.md');

const jsonLdSource = homepage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.ok(jsonLdSource, 'homepage must include JSON-LD');
const jsonLd = JSON.parse(jsonLdSource);
const organization = jsonLd['@graph'].find((entry) => entry['@id'] === 'https://rogersholdingsllc.com/#organization');
const founder = jsonLd['@graph'].find((entry) => entry['@id'] === 'https://rogersholdingsllc.com/#brian-keith-rogers');
const website = jsonLd['@graph'].find((entry) => entry['@id'] === 'https://rogersholdingsllc.com/#website');
assert.equal(organization.legalName, 'Rogers Holdings LLC');
assert.equal(organization.alternateName, 'Rogers Holdings');
assert.equal(organization.logo.url, 'https://rogersholdingsllc.com/assets/images/brand/rogers-holdings-logo.png');
assert.deepEqual(organization.founder, { '@id': 'https://rogersholdingsllc.com/#brian-keith-rogers' });
assert.deepEqual(organization.knowsAbout, [
  'Business optimization', 'Digital optimization', 'Website development',
  'Google Workspace', 'Workflow automation', 'Artificial intelligence',
  'Operational consulting'
]);
assert.equal(founder.name, 'Brian Keith Rogers');
assert.equal(founder.jobTitle, 'Founder');
assert.deepEqual(founder.worksFor, { '@id': 'https://rogersholdingsllc.com/#organization' });
assert.equal(website.alternateName, 'Rogers Holdings');

const snapshotJsonLdSource = snapshot.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.ok(snapshotJsonLdSource, 'Business Snapshot must include JSON-LD');
const snapshotJsonLd = JSON.parse(snapshotJsonLdSource);
const snapshotService = snapshotJsonLd['@graph'].find((entry) => entry['@id'] === 'https://rogersholdingsllc.com/business-snapshot/#service');
assert.equal(snapshotService.name, 'Free Business Snapshot');
assert.equal(snapshotService.provider['@id'], 'https://rogersholdingsllc.com/#organization');

const marketablePages = [homepage, snapshot, privacy];
for (const page of marketablePages) {
  assert.match(page, /<meta property="og:locale" content="en_US">/);
  assert.match(page, /<meta property="og:image:secure_url" content="https:\/\/rogersholdingsllc\.com\/assets\/images\/social\//);
  assert.match(page, /<meta property="og:image:type" content="image\/jpeg">/);
  assert.match(page, /<meta property="og:image:width" content="1200">/);
  assert.match(page, /<meta property="og:image:height" content="630">/);
  assert.match(page, /<meta property="og:image:alt" content="[^"]+">/);
  assert.match(page, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(page, /<meta name="twitter:title" content="[^"]+">/);
  assert.match(page, /<meta name="twitter:description" content="[^"]+">/);
  assert.match(page, /<meta name="twitter:image" content="https:\/\/rogersholdingsllc\.com\/assets\/images\/social\//);
  assert.match(page, /<meta name="twitter:image:alt" content="[^"]+">/);
}
assert.match(homepage, /rogers-holdings-home-share\.jpg/);
assert.match(snapshot, /business-snapshot-share\.jpg/);
assert.doesNotMatch(homepage + snapshot + brian + privacy, /brand-card\.jpeg/);

for (const page of [homepage, snapshot, brian, privacy]) {
  assert.match(page, /<link rel="icon" type="image\/png" sizes="64x64" href="\/favicon\.png">/);
  assert.match(page, /<link rel="shortcut icon" href="\/favicon\.ico">/);
  assert.match(page, /<link rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png">/);
  assert.doesNotMatch(page, /(?:favicon|apple-touch-icon)\.(?:png|ico)\?v=/);
}

function pngDimensions(relativePath) {
  const bytes = fs.readFileSync(path.join(ROOT, relativePath));
  assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function jpegDimensions(relativePath) {
  const bytes = fs.readFileSync(path.join(ROOT, relativePath));
  assert.equal(bytes.readUInt16BE(0), 0xffd8);
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = bytes.readUInt16BE(offset);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  throw new Error(`JPEG dimensions not found: ${relativePath}`);
}

assert.deepEqual(pngDimensions('favicon.png'), { width: 64, height: 64 });
assert.deepEqual(pngDimensions('apple-touch-icon.png'), { width: 180, height: 180 });
for (const asset of [
  'assets/images/social/rogers-holdings-home-share.jpg',
  'assets/images/social/business-snapshot-share.jpg'
]) {
  assert.deepEqual(jpegDimensions(asset), { width: 1200, height: 630 });
  assert.ok(fs.statSync(path.join(ROOT, asset)).size < 500_000, `${asset} must remain below 500 KB`);
}

assert.doesNotMatch(sitemap, /<priority>|<changefreq>/);
assert.match(sitemap, /<loc>https:\/\/rogersholdingsllc\.com\/<\/loc>\s*<lastmod>2026-08-22<\/lastmod>/);
assert.match(sitemap, /<loc>https:\/\/rogersholdingsllc\.com\/business-snapshot\/<\/loc>\s*<lastmod>2026-08-22<\/lastmod>/);

assert.match(snapshot, /<footer class="[^"]*site-footer[^"]*">[\s\S]*?rogers-holdings-logo-reversed\.png/);
assert.match(privacy, /<footer class="[^"]*site-footer[^"]*">[\s\S]*?rogers-holdings-logo-reversed\.png/);
assert.doesNotMatch(snapshot, /<footer[\s\S]*?rogers-holdings-logo\.png/);
assert.doesNotMatch(privacy, /<footer[\s\S]*?rogers-holdings-logo\.png/);
assert.equal((homepage.match(/rh-executive-materials-01-/g) || []).length, 0);
assert.equal((homepage.match(/assets\/images\/digital-business-card\/brian-keith-rogers\.jpg/g) || []).length, 1);
assert.match(homepage, /width="576" height="720" loading="lazy"/);
assert.match(css, /grid-template-columns: minmax\(380px, \.84fr\) minmax\(0, 1\.16fr\)/);
assert.match(css, /\.phase3-founder-portrait-frame[\s\S]*?aspect-ratio: 4 \/ 5/);
const founderSource = fs.readFileSync(path.join(ROOT, 'docs/design-reference/founder/brian-keith-rogers-headshot-original.png'));
assert.equal(crypto.createHash('sha256').update(founderSource).digest('hex'), '9bb3f69903b49705abeb212f88bde0ad5200ee5cf60de289e2698a77c467c979');
const optimizedFounderPortrait = fs.statSync(path.join(ROOT, 'assets/images/digital-business-card/brian-keith-rogers.jpg'));
assert.ok(optimizedFounderPortrait.size < 100_000, 'homepage founder portrait must remain below 100 KB');
assert.match(visualSystem, /Light backgrounds use/);
assert.match(visualSystem, /Dark or black backgrounds use/);

for (const asset of ['assets/images/brand/rogers-holdings-logo-reversed.png']) {
  const stat = fs.statSync(path.join(ROOT, asset));
  assert.ok(stat.size > 0, `${asset} must not be empty`);
}
for (const asset of [
  'assets/images/brand/rh-executive-materials-01-480.avif',
  'assets/images/brand/rh-executive-materials-01-768.avif',
  'assets/images/brand/rh-executive-materials-01-480.webp',
  'assets/images/brand/rh-executive-materials-01-768.webp',
  'assets/images/brand/rh-executive-materials-01-768.jpg'
]) {
  const stat = fs.statSync(path.join(ROOT, asset));
  assert.ok(stat.size > 0 && stat.size < 300_000, `${asset} must remain below 300 KB`);
}

console.log('Sitewide brand-asset contract tests passed.');
