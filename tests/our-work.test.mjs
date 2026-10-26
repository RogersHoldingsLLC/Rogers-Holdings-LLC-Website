import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { PUBLIC_MANIFEST, referenceToManifestPath } from '../scripts/public-artifact.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const home = read('index.html');
const work = read('our-work/index.html');
assert.match(home, /id="work"/);
assert.match(home, /href="our-work\/">Explore Our Work/);
assert.match(home, /href="our-work\/#eastland"/);
assert.match(home, /href="our-work\/#missys-squishies"/);
assert.doesNotMatch(home, /class="eastland-story-timeline"|class="eastland-live-proof"/);
assert.equal((work.match(/<h1\b/g) || []).length, 1);
assert.match(work, /<link rel="canonical" href="https:\/\/rogersholdingsllc\.com\/our-work\/">/);
assert.match(work, /aria-current="page">Our Work/);
assert.match(work, /href="\.\.\/spreadsheet-repair\/"/);
assert.match(work, /href="\.\.\/business-snapshot\/" data-report-link/);

// Preserve every byte of the approved four-screen composition derivatives.
const record = read('docs/design-source/EASTLAND_SCREEN_REFRESH_APPROVED_RELEASE.md');
const assetRows = [...record.matchAll(/\| `(eastland-product-family-[^`]+)` \| `([a-f0-9]{64})` \|/g)];
assert.equal(assetRows.length, 9);
for(const [, name, hash] of assetRows) {
  const bytes = fs.readFileSync(path.join(root, 'assets/images/homepage', name));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), hash, `approved scene changed: ${name}`);
}

// Approved story keeps its illustration disclosure and excludes internal review notes.
const missy = work.slice(work.indexOf('id="missys-squishies"'), work.indexOf('</section>', work.indexOf('id="missys-squishies"')));
assert.doesNotMatch(work + home, /Local review|Proposed website adaptation|await owner-approved|Story awaiting approval|Demonstration image pending/i);
assert.match(missy, /Formatting-derived workbook illustration with sample data; customer contents and operating logic are not shown\./);
assert.equal((missy.match(/<img\b/g) || []).length, 2);
assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/missy-artwork-extracted.webp'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/images/our-work/missy-artwork-extracted.webp'))).digest('hex'), '7c46fd3e8a18ce7fe7b845e66545871dc75790d4af213b9572ac44640b23e596', 'approved extracted illustration changed');
assert.equal(PUBLIC_MANIFEST.includes('docs/design-reference/missys-squishies/missy-story-source.jpg'), false);
assert.doesNotMatch(missy, /await owner-approved copy|Story awaiting approval/);
assert.doesNotMatch(missy, /Demonstration image pending|<iframe|<blockquote|<q\b|docs\.google|drive\.google|\$|\bpaid\b|\bfree\b|\d+%|hours? saved|revenue|testimonial/i);

const pages = PUBLIC_MANIFEST.filter(f => f.endsWith('.html'));
for(const f of ['index.html','business-snapshot/index.html','privacy/index.html','spreadsheet-repair/index.html','our-work/index.html']) {
  const html = read(f);
  const prefix = f === 'index.html' ? '' : '../';
  if(f !== 'our-work/index.html') assert.equal((html.match(new RegExp(`href="${prefix.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}our-work/">Our Work`, 'g')) || []).length, 2, `${f} header/footer navigation must reach Our Work`);
}

// Validate internal destinations AND fragment targets throughout the allowlisted site.
for(const page of pages) {
  const html = read(page);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length, new Set(ids).size, `duplicate IDs in ${page}`);
  for(const [, raw] of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = raw.replaceAll('&amp;','&');
    if(/^(mailto|tel|sms|data):/.test(href)) continue;
    const url = new URL(href, `https://rogersholdingsllc.com/${page}`);
    if(url.origin !== 'https://rogersholdingsllc.com') continue;
    const target = href.startsWith('#') ? page : referenceToManifestPath(page, href);
    if(!target) continue;
    assert.ok(PUBLIC_MANIFEST.includes(target), `${page}: target not allowlisted ${href}`);
    if(url.hash && target.endsWith('.html')) {
      assert.ok(read(target).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${page}: broken fragment ${href}`);
    }
  }
}
assert.ok(PUBLIC_MANIFEST.includes('our-work/index.html'));
assert.ok(PUBLIC_MANIFEST.includes('assets/css/our-work.css'));
assert.equal(PUBLIC_MANIFEST.some(f => f.startsWith('docs/our-work-review/')), false);
console.log('Our Work migration, approved assets, evidence boundary and internal links passed.');
