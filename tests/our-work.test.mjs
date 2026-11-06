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
assert.match(home, /href="our-work\/">See all work/);
assert.match(home, /href="our-work\/#eastland"/);
assert.match(home, /href="our-work\/#missys-squishies"/);

// Keep project evidence in the portfolio instead of repeating it in service cards.
const serviceCards = home.slice(home.indexOf('id="capabilities"'), home.indexOf('id="work"'));
assert.doesNotMatch(serviceCards, /eastland-product-family|missy-workbook-redacted/);
assert.equal((home.match(/class="homepage-eastland-picture"/g) || []).length, 1);
assert.equal((work.match(/class="homepage-eastland-picture"/g) || []).length, 1);
assert.equal((home.match(/missy-workbook-redacted\.png/g) || []).length, 0);
assert.equal((work.match(/missy-workbook-redacted\.png/g) || []).length, 0);
const website = read('website-creation/index.html');
assert.doesNotMatch(home + work + website, /eastland-product-family/);
assert.match(home, /eastland-live-home\.jpg/);
assert.match(work, /eastland-live-mobile-services\.png/);
assert.match(website, /eastland-live-visit\.png/);
// Prospects can see the examples on the service page without opening a disclosure.
const serviceExamples=website.match(/<section class="section website-preview-section"[\s\S]*?<\/section>/)?.[0];
assert.ok(serviceExamples,'Website Creation needs a visible examples section');
assert.doesNotMatch(serviceExamples,/<details|<iframe|<form/);
assert.equal((serviceExamples.match(/class="website-preview-card"/g)||[]).length,3);
assert.ok(website.indexOf('id="website-examples"')<website.indexOf('id="website-included-heading"'),'examples precede long service detail');
for(const [key,href,label]of [['howl-and-timber','../examples/howl-and-timber/','Fictional law-firm concept'],['cortez-capital','../examples/cortez-capital/','Fictional website concept'],['captured-by-karmen','https://capturedbykarmen.rogersholdingsllc.com/','Owned prelaunch project']]){
 assert.ok(serviceExamples.includes('href="'+href+'"')&&serviceExamples.includes(label));
 assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/'+key+'-website-preview.jpg'));
}
for(const [,closed]of work.matchAll(/(<details(?![^>]*\bopen\b)[^>]*>[\s\S]*?<\/details>)/g))assert.doesNotMatch(closed,/class="website-example-card/,'example links must not be hidden in closed details');
assert.ok(PUBLIC_MANIFEST.includes('assets/images/social/website-creation-examples-share.jpg'));
assert.ok(PUBLIC_MANIFEST.includes('assets/images/social/rogers-holdings-brand-share.jpg'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/images/social/rogers-holdings-brand-share.jpg'))).digest('hex'),'c7885d45a5212ddceb9fd588a57e9dfebd4e29e900b20c7aaea4aa1ef0197d6f','brand share image must be the approved transparent-logo version 2');
const webpage=JSON.parse(website.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find(x=>x['@type']==='WebPage');
assert.equal(webpage.primaryImageOfPage.width,1200);assert.equal(webpage.primaryImageOfPage.height,630);
assert.equal(webpage.primaryImageOfPage.url,'https://rogersholdingsllc.com/assets/images/social/rogers-holdings-brand-share.jpg');
assert.equal(webpage.hasPart.itemListElement.length,3);
assert.match(website,/<meta property="og:image:type" content="image\/jpeg">/);
assert.match(website,/Rogers Holdings LLC logo and company name on a black, cream and gold textured background/);
assert.doesNotMatch(home, /missy-artwork-extracted|missy-workbook-redacted/);
// Only the reviewed, flattened actual dashboard derivative may enter active proof.
for(const page of [home, work]) {
 assert.match(page, /missy-dashboard-redacted\.png/);
 assert.match(page, /Actual dashboard · Private business data and operational details redacted\./);
 assert.match(page, /View Missy’s redacted dashboard at full resolution \(opens in a new tab\)/);
 assert.doesNotMatch(page, /data-workbook-demo|portfolio-workbook|Representative workbook layout|missy-workbook-redacted\.png|\.private-missy|image\(20261106/);
}
const redactedBytes=fs.readFileSync(path.join(root,'assets/images/our-work/missy-dashboard-redacted.png'));
assert.equal(crypto.createHash('sha256').update(redactedBytes).digest('hex'),'0071940d13c8fc6050e597eed02bb919d5745526740e0eb518f1147edbd05715','sanitized dashboard must remain the reviewed flattened derivative');
assert.equal(redactedBytes.readUInt32BE(16),1189);assert.equal(redactedBytes.readUInt32BE(20),780);assert.equal(redactedBytes[24],8);assert.equal(redactedBytes[25],2,'RGB without alpha');
const redactionChunks=[];for(let p=8;p<redactedBytes.length;){const length=redactedBytes.readUInt32BE(p);redactionChunks.push(redactedBytes.toString('ascii',p+4,p+8));p+=12+length}
assert.deepEqual(redactionChunks,['IHDR','IDAT','IEND'],'no metadata, embedded original or extra frames');
assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/missy-dashboard-redacted.png'));
assert.equal(PUBLIC_MANIFEST.some(p=>/source\.png|image\(20261106|\.private-missy|ocr-source|redact\.py/.test(p)),false);
assert.doesNotMatch(serviceCards, /<img|<picture|<input|<form|<table/);
assert.doesNotMatch(home, /class="eastland-story-timeline"|class="eastland-live-proof"/);
assert.equal((work.match(/<h1\b/g) || []).length, 1);
assert.match(work, /<link rel="canonical" href="https:\/\/rogersholdingsllc\.com\/our-work\/">/);
assert.match(work, /aria-current="page">Our Work/);

const logoGroups = [...work.matchAll(/<nav class="project-logo-index[^"]*"[\s\S]*?<\/nav>/g)].map(m=>m[0]);
assert.equal((logoGroups[0].match(/<a /g)||[]).length,2,'real client proof must be distinct from concepts');
const logoIndex=logoGroups.join('');
assert.equal((logoIndex.match(/<a /g) || []).length, 5);
for (const [logo, destination] of [['eastland-official-logo.jpg','#eastland'],['missy-official-logo-extracted.png','#missys-squishies'],['howl-and-timber-wordmark.svg','../examples/howl-and-timber/'],['cortez-capital-concept-logo.png','../examples/cortez-capital/'],['captured-by-karmen-wordmark.png','https://capturedbykarmen.rogersholdingsllc.com/']]) {
 assert.ok(logoIndex.includes(logo) && logoIndex.includes('href="'+destination+'"'));
 assert.equal(work.split(logo).length - 1, 1, 'show each logo once on Our Work');
}
assert.ok(logoIndex.includes('Fictional law-firm concept') && logoIndex.includes('Fictional website concept') && logoIndex.includes('Prelaunch owned project'));

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
assert.match(missy, /Actual dashboard · Private business data and operational details redacted\./);
assert.equal((missy.match(/<img\b/g) || []).length, 1);
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
