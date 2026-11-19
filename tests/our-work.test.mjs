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
assert.match(home, /href="#work">Our Work/);
assert.match(home, /href="\/our-work\/">Project stories/);
assert.match(home, /href="\/portfolio\/projects\/eastland\/"/);
const eastlandDetail=read('portfolio/projects/eastland/index.html');
assert.match(eastlandDetail, /href="https:\/\/eastlandfirstchurchofgod\.com\/"/);
assert.match(home, /href="\/portfolio\/projects\/missys-squishies\/"/);
const missyDetail=read('portfolio/projects/missys-squishies/index.html');
assert.match(missyDetail, /href="\/our-work\/#missys-squishies"/);

// v68 replaces service cards with fourteen paired, accessible project previews.
const panels = [...home.matchAll(/<figure class="rh-orbit-panel[^>]*>[\s\S]*?<\/figure>/g)].map(m=>m[0]);
assert.equal(panels.length,14);
assert.equal(panels.filter(p=>p.includes('href="/portfolio/projects/eastland/"')).length,1);
for (const panel of panels) {
 const front=panel.match(/<a[^>]*class="rh-orbit-frame[^"]*"[^>]*>[\s\S]*?<\/a>/)?.[0];
 assert.ok(front);
 assert.match(front,/aria-label="[^"]+"/);
 assert.match(front,/href="\/portfolio\/projects\/[^"]+\/"/);
 const back=panel.match(/<div class="rh-orbit-back" aria-hidden="true">([\s\S]*?)<\/div>/)?.[1];
 assert.ok(back);
 assert.equal(front.match(/src="([^"]+)"/)[1],back.match(/src="([^"]+)"/)[1]);
 assert.match(back,/alt=""/);
 assert.doesNotMatch(back,/<a\b|tabindex/);
}
assert.equal((home.match(/missy-workbook-redacted\.png/g) || []).length, 0);
assert.equal((work.match(/missy-workbook-redacted\.png/g) || []).length, 0);
const website = read('website-creation/index.html');
assert.doesNotMatch(home + work + website, /eastland-product-family/);
assert.match(home, /portfolio\/showcase\/eastland\.webp/);
assert.match(work, /portfolio\/showcase\/eastland\.webp/);
assert.match(website, /portfolio\/showcase\/fabrication\.jpg/);
// The approved service redesign features one visible end-to-end fictional workflow.
// The complete sixteen-item portfolio and seven demos are tested independently.
const serviceExamples=website.match(/<section class="example" id="form-field"[\s\S]*?<\/section>/)?.[0];
assert.ok(serviceExamples,'Website Creation needs a visible workflow example');
assert.doesNotMatch(serviceExamples,/<details|<iframe|<form/);
assert.ok(website.indexOf('id="form-field"')<website.indexOf('id="package"'),'evidence precedes long service detail');
assert.match(serviceExamples,/href="\.\.\/portfolio\/precision-fabrication\/"/);
assert.match(serviceExamples,/href="\.\.\/portfolio\/projects\/customer-follow-up\/"/);
assert.match(serviceExamples,/Example demo/);
assert.match(serviceExamples,/doesn’t send quotes or write to Google Sheets/);
for(const key of ['howl-and-timber','cortez-capital','captured-by-karmen']) {
 assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/'+key+'-website-preview.jpg'), 'existing reviewed portfolio assets remain preserved');
}
for(const [,closed]of work.matchAll(/(<details(?![^>]*\bopen\b)[^>]*>[\s\S]*?<\/details>)/g))assert.doesNotMatch(closed,/class="website-example-card/,'example links must not be hidden in closed details');
assert.ok(PUBLIC_MANIFEST.includes('assets/images/social/website-creation-examples-share.jpg'));
assert.ok(PUBLIC_MANIFEST.includes('assets/images/social/rogers-holdings-brand-share.jpg'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/images/social/rogers-holdings-brand-share.jpg'))).digest('hex'),'c7885d45a5212ddceb9fd588a57e9dfebd4e29e900b20c7aaea4aa1ef0197d6f','brand share image must be the approved transparent-logo version 2');
const webpage=JSON.parse(website.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find(x=>x['@type']==='WebPage');
assert.equal(webpage.primaryImageOfPage.width,1200);assert.equal(webpage.primaryImageOfPage.height,630);
assert.equal(webpage.primaryImageOfPage.url,'https://rogersholdingsllc.com/assets/images/social/rogers-holdings-eastland-website-share.jpg');
assert.deepEqual(webpage.hasPart.itemListElement.map(x=>x.url),[
 'https://rogersholdingsllc.com/portfolio/precision-fabrication/',
 'https://rogersholdingsllc.com/portfolio/projects/customer-follow-up/'
]);
assert.match(website,/<meta property="og:image:type" content="image\/jpeg">/);
assert.match(website,/A screenshot of the Eastland First Church of God website/);
assert.doesNotMatch(home, /missy-artwork-extracted|missy-workbook-redacted/);
// Only the reviewed, flattened actual dashboard derivative may enter active proof.
for(const page of [home,work,missyDetail]) {
 assert.match(page, /missy-redacted\.png/);
 assert.doesNotMatch(page, /data-workbook-demo|portfolio-workbook|Representative workbook layout|missy-workbook-redacted\.png|\.private-missy|image\(20261106/);
}
assert.match(missyDetail,/Redacted capture of the real workbook. No customer order data is shown here/);
assert.match(missyDetail,/Only redacted examples are shown; the operational workbook stays private/);
assert.match(missyDetail,/<img[^>]*alt="Redacted view of the Missy’s Squishies inventory and fulfillment workbook"/);
assert.match(home, /portfolio\/showcase\/missy-redacted\.png/);
assert.match(missyDetail, /The live workbook is not shared/);
assert.match(missyDetail, /Redacted capture of the real workbook/);
assert.deepEqual(fs.readFileSync(path.join(root,'portfolio/showcase/missy-redacted.png')), fs.readFileSync(path.join(root,'assets/images/our-work/missy-dashboard-redacted.png')), 'new carousel copy must retain exact reviewed flattened redaction');
const redactedBytes=fs.readFileSync(path.join(root,'assets/images/our-work/missy-dashboard-redacted.png'));
assert.equal(crypto.createHash('sha256').update(redactedBytes).digest('hex'),'0071940d13c8fc6050e597eed02bb919d5745526740e0eb518f1147edbd05715','sanitized dashboard must remain the reviewed flattened derivative');
assert.equal(redactedBytes.readUInt32BE(16),1189);assert.equal(redactedBytes.readUInt32BE(20),780);assert.equal(redactedBytes[24],8);assert.equal(redactedBytes[25],2,'RGB without alpha');
const redactionChunks=[];for(let p=8;p<redactedBytes.length;){const length=redactedBytes.readUInt32BE(p);redactionChunks.push(redactedBytes.toString('ascii',p+4,p+8));p+=12+length}
assert.deepEqual(redactionChunks,['IHDR','IDAT','IEND'],'no metadata, embedded original or extra frames');
assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/missy-dashboard-redacted.png'));
assert.equal(PUBLIC_MANIFEST.some(p=>/source\.png|image\(20261106|\.private-missy|ocr-source|redact\.py/.test(p)),false);
assert.doesNotMatch(home.match(/<section class="rh-orbit[\s\S]*?<\/section>/)[0], /<input|<form|<table/);
assert.doesNotMatch(home, /class="eastland-story-timeline"|class="eastland-live-proof"/);
assert.equal((work.match(/<h1\b/g) || []).length, 1);
assert.match(work, /<link rel="canonical" href="https:\/\/rogersholdingsllc\.com\/our-work\/">/);
assert.match(work, /aria-current="page">Our Work/);

// The approved gallery has sixteen visible stories, including both fictional concepts.
const expectedProjects=['eastland','precision-fabrication','captured-by-karmen','missys-squishies','store','pizzeria','bike-repair','orchard','repair-cafe','print-review','inventory-tracker','job-capacity','receipt-tracker','staffing-coverage','howl-and-timber','cortez-capital'];
const exhibits=[...work.matchAll(/<article class="work-exhibit" id="([^"]+)" aria-labelledby="([^"]+)">([\s\S]*?)<\/article>/g)];
assert.deepEqual(exhibits.map(m=>m[1]),expectedProjects);
for(const [,id,heading,body] of exhibits) {
 assert.ok(body.includes('<h2 id="'+heading+'">'));
 assert.equal((body.match(/<img\b/g)||[]).length,1);
 assert.match(body,/<img[^>]*alt="[^"]+"/);
 const links=[...body.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(links,['/portfolio/projects/'+id+'/','/portfolio/projects/'+id+'/']);
 assert.match(body,/aria-label="View [^"]+ project"/);
 assert.match(body,/<span class="sr-only">:/);
 assert.doesNotMatch(body,/<details|<iframe|<form/);
}
assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/missy-logo-transparent.png'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/images/our-work/missy-logo-transparent.png'))).digest('hex'),'8a7163bb97ef4873126bfa1b4d33efb85a09544e2b7ed83f6bc05d03a9eed912','reviewed transparent logo is preserved');
assert.ok(read('assets/css/our-work.css').includes('.project-logo-eastland { background: #fefefe; }'));
assert.ok(read('assets/css/our-work.css').includes('.project-logo-missy { background: #f3e1e9; color: #58236c; overflow: hidden; }'));

// Detailed disclosures now live at the linked project destinations, not hidden gallery stories.
const howl=read('portfolio/projects/howl-and-timber/index.html');
const cortez=read('portfolio/projects/cortez-capital/index.html');
const cbk=read('portfolio/projects/captured-by-karmen/index.html');
assert.match(howl,/No legal services, attorney credentials, client relationships or case results are represented/);
assert.match(cortez,/No investment or advisory services, real holdings, transactions, operating history or client results are represented/);
for(const [page,key] of [[howl,'howl-and-timber'],[cortez,'cortez-capital']]) {
 assert.match(page,/Example concept · Website design demonstration, not a client-results case study/);
 assert.match(page,/Example content and imagery, not an operating business/);
 assert.ok(page.includes('href="../../../examples/'+key+'/"'));
}
assert.match(cbk,/The current contact path is email only, not a booking form/);
assert.match(cbk,/not an automatic booking/);
assert.match(cbk,/href="https:\/\/capturedbykarmen\.rogersholdingsllc\.com\/"/);
// Any new-tab project destination must retain opener isolation.
for(const page of [work,howl,cortez,cbk]) for(const [link] of page.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(link,/rel="noopener noreferrer"/);

assert.match(work, /href="\.\.\/services\/"/);
assert.match(read('services/index.html'), /href="[^"]*spreadsheet-repair\/"/);
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
const missy = missyDetail.match(/<main[\s\S]*?<\/main>/)[0];
assert.doesNotMatch(work + home, /Local review|Proposed website adaptation|await owner-approved|Story awaiting approval|Demonstration image pending/i);
assert.match(missy,/No customer order data is shown here/);
assert.equal((missy.match(/<img\b/g)||[]).length,1);
assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/missy-artwork-extracted.webp'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/images/our-work/missy-artwork-extracted.webp'))).digest('hex'), '7c46fd3e8a18ce7fe7b845e66545871dc75790d4af213b9572ac44640b23e596', 'approved extracted illustration changed');
assert.equal(PUBLIC_MANIFEST.includes('docs/design-reference/missys-squishies/missy-story-source.jpg'), false);
assert.doesNotMatch(missy, /await owner-approved copy|Story awaiting approval/);
assert.doesNotMatch(missy, /Demonstration image pending|<iframe|<blockquote|<q\b|docs\.google|drive\.google|\$|\bpaid\b|\bfree\b|\d+%|hours? saved|revenue|testimonial/i);

const pages = PUBLIC_MANIFEST.filter(f => f.endsWith('.html'));
for(const f of ['index.html','business-snapshot/index.html','privacy/index.html','spreadsheet-repair/index.html','our-work/index.html']) {
  const html = read(f);
  const prefix = f === 'index.html' ? '' : '../';
  if(f === 'index.html') {
    assert.match(html, /href="#work">Our Work/);
    assert.match(html, /href="\/our-work\/">Project stories/);
  } else if(f === 'spreadsheet-repair/index.html') {
    assert.match(html,/href="\.\.\/#work">Our Work/);
    assert.match(html,/href="\.\.\/our-work\/">Project stories/);
  } else if(f !== 'our-work/index.html') {
    const workLinks=[...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>Our Work<\/a>/g)]
      .filter(([,href])=>new URL(href,`https://rogersholdingsllc.com/${f}`).pathname==='/our-work/');
    assert.equal(workLinks.length,2,`${f} header/footer navigation must reach Our Work`);
  }
}

// Validate internal destinations AND fragment targets throughout the allowlisted site.
for(const page of pages) {
  const html = read(page);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length, new Set(ids).size, `duplicate IDs in ${page}`);
  const markup=html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'');
  for(const [, raw] of markup.matchAll(/\bhref="([^"]+)"/g)) {
    const href = raw.replaceAll('&amp;','&');
    if(/^(mailto|tel|sms|data):/.test(href)) continue;
    const url = new URL(href, `https://rogersholdingsllc.com/${page}`);
    if(url.origin !== 'https://rogersholdingsllc.com') continue;
    const target = href.startsWith('#') ? page : referenceToManifestPath(page, href);
    if(!target) continue;
    assert.ok(PUBLIC_MANIFEST.includes(target), `${page}: target not allowlisted ${href}`);
    if(url.hash && target.endsWith('.html')) {
      // Exact, bounded fictional handoff state is tested by executing its parser in premium-portfolio.test.cjs.
      if(target==='portfolio/projects/customer-follow-up/index.html' && /^#quote-process=(sheet|assembly|prototype)$/.test(url.hash)) continue;
      assert.ok(read(target).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${page}: broken fragment ${href}`);
    }
  }
}
assert.ok(PUBLIC_MANIFEST.includes('our-work/index.html'));
assert.ok(PUBLIC_MANIFEST.includes('assets/css/our-work.css'));
assert.equal(PUBLIC_MANIFEST.some(f => f.startsWith('docs/our-work-review/')), false);
console.log('Our Work migration, approved assets, evidence boundary and internal links passed.');

// The mobile menu must be viewport-sized, not trapped by the blurred header.
const workCss = read('assets/css/our-work.css');
assert.match(workCss, /@media \(max-width: 960px\)/);
assert.match(workCss, /\.our-work-page\.menu-open \.site-header\s*\{\s*-webkit-backdrop-filter: none;\s*backdrop-filter: none;/);
const workMenu = workCss.match(/\.our-work-page\.durable-site \.primary-nav\.is-open\s*\{([^}]+)\}/)?.[1];
assert.ok(workMenu, 'Our Work needs a scoped full-viewport menu');
for (const declaration of ['top: var(--work-menu-top)', 'bottom: auto', 'height: calc(100vh - var(--work-menu-top))', 'height: calc(100dvh - var(--work-menu-top))', 'max-height: none', 'overflow-y: auto', 'overscroll-behavior-y: contain']) assert.ok(workMenu.includes(declaration), declaration);
assert.match(workCss, /padding-bottom: calc\(24px \+ env\(safe-area-inset-bottom, 0px\)\)/);
assert.match(workCss, /\.our-work-page \.primary-nav > a \{ flex-shrink: 0; \}/);
assert.match(workCss, /--work-menu-top: 73px/);
assert.match(work, /our-work\.css\?v=natural-client-stories-20261107/);
console.log('Our Work menu viewport, overflow, safe-area and cache guards passed.');

assert.equal(website.split('portfolio/showcase/fabrication.jpg').length-1,1,'featured workflow screenshot is not duplicated');
assert.match(website,/Up to five mobile-friendly pages/);
assert.match(website,/two rounds of in-scope revisions/);
assert.match(website,/Domains, hosting, support, copywriting, extra pages, booking, payments and integrations are quoted separately/);
assert.doesNotMatch(website,/<section class="section website-evidence"/);

// Owner-requested cleanup: examples remain distinct from real client work, without the old labels.
for (const file of PUBLIC_MANIFEST.filter(f => /\.(html|webmanifest)$/.test(f) || f.endsWith('howl-and-timber-wordmark.svg') || f.endsWith('assets/wordmark.svg'))) {
 const presentation = read(file).replace(/<!--[^]*?-->/g,'').replace(/<(style)\b[^>]*>[^]*?<\/\1>/gi,'').replaceAll('fictional-team','example-team');
 assert.doesNotMatch(presentation,/\bfictional\b|AI-generated|AI-assisted/i,`${file}: no old presentation labels`);
}
assert.match(home,/\.gallery-home \.rh-orbit\.all-work::before\{content:none\}/);
assert.doesNotMatch(home,/left:157px/,'no fixed-position rule through Our Work');
assert.match(home,/\.rh-orbit-stage:focus-visible\{outline:3px solid #f2c679/,'carousel keyboard focus remains visible');
console.log('Our Work decorative rule removed; example disclosures and keyboard focus preserved.');
