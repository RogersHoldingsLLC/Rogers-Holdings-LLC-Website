import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import vm from 'node:vm';
import { PUBLIC_MANIFEST, referenceToManifestPath } from '../scripts/public-artifact.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const home = read('index.html');
const work = read('our-work/index.html');
assert.match(home, /id="work"/);
assert.match(home, /href="#work">Our Work/);
assert.match(home, /href="\/our-work\/">Our Work/);
assert.match(home, /href="\/portfolio\/projects\/eastland\/"/);
const eastlandDetail=read('portfolio/projects/eastland/index.html');
assert.match(eastlandDetail, /href="https:\/\/eastlandfirstchurchofgod\.com\/"/);
assert.match(work, /href="\/portfolio\/projects\/missys-squishies\/"/);
const missyDetail=read('portfolio/projects/missys-squishies/index.html');
assert.match(missyDetail, /href="\/our-work\/#missys-squishies"/);

// Graphite promotes one client story and two clear working examples.
assert.match(home, /<section class="rh-selected" id="work" tabindex="-1" aria-labelledby="selected-title"/);
assert.match(home, /href="\/our-work\/">See all projects/);
for (const [name, destination] of [['MONOFORM', '/our-work/monoform/demo/'], ['Form / Field', '/portfolio/projects/precision-fabrication/']]) {
 const match = [...home.matchAll(/<article class="rh-project-card[^"]*">[\s\S]*?<\/article>/g)].map(m => m[0]).find(card => card.includes(name));
 assert.ok(match, name);
 const links = [...match.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
 assert.deepEqual(links.filter(href => !href.endsWith(".mp4")), [destination, destination]);
 assert.match(match, /<img[^>]*alt="[^"]+"/);
}
assert.equal((home.match(/missy-workbook-redacted\.png/g) || []).length, 0);
assert.equal((work.match(/missy-workbook-redacted\.png/g) || []).length, 0);
const website = read('website-creation/index.html');
assert.doesNotMatch(home + work + website, /eastland-product-family/);
assert.match(home, /assets\/media\/eastland-homepage-poster\.webp/);
assert.match(work, /portfolio\/showcase\/eastland\.webp/);
assert.match(website, /portfolio\/showcase\/fabrication-preview\.jpg/);
// The approved service redesign features one visible end-to-end fictional workflow.
// The complete seventeen-item portfolio and seven demos are tested independently.
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
const portfolioShareAsset = 'assets/images/social/rogers-holdings-form-field-site-and-sheet-share.jpg';
assert.ok(PUBLIC_MANIFEST.includes(portfolioShareAsset));
for (const property of ['og:image', 'og:image:secure_url', 'twitter:image']) {
  assert.ok(work.includes(`<meta ${property.startsWith('og:') ? 'property' : 'name'}="${property}" content="https://rogersholdingsllc.com/${portfolioShareAsset}">`));
}

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
for(const page of [work,missyDetail]) {
 assert.match(page, /missy-redacted\.png/);
 assert.doesNotMatch(page, /data-workbook-demo|portfolio-workbook|Representative workbook layout|missy-workbook-redacted\.png|\.private-missy|image\(20261106/);
}
assert.match(missyDetail,/Redacted capture of the real workbook. No customer order data is shown here/);
assert.match(missyDetail,/Only redacted examples are shown; the operational workbook stays private/);
assert.match(missyDetail,/<img[^>]*alt="Redacted view of the Missy’s Squishies inventory and fulfillment workbook"/);
assert.match(work, /portfolio\/showcase\/missy-redacted\.png/);
assert.match(missyDetail, /The live workbook is not shared/);
assert.match(missyDetail, /Redacted capture of the real workbook/);
assert.deepEqual(fs.readFileSync(path.join(root,'portfolio/showcase/missy-redacted.png')), fs.readFileSync(path.join(root,'assets/images/our-work/missy-dashboard-redacted.png')), 'gallery copy must retain exact reviewed flattened redaction');
const redactedBytes=fs.readFileSync(path.join(root,'assets/images/our-work/missy-dashboard-redacted.png'));
assert.equal(crypto.createHash('sha256').update(redactedBytes).digest('hex'),'0071940d13c8fc6050e597eed02bb919d5745526740e0eb518f1147edbd05715','sanitized dashboard must remain the reviewed flattened derivative');
assert.equal(redactedBytes.readUInt32BE(16),1189);assert.equal(redactedBytes.readUInt32BE(20),780);assert.equal(redactedBytes[24],8);assert.equal(redactedBytes[25],2,'RGB without alpha');
const redactionChunks=[];for(let p=8;p<redactedBytes.length;){const length=redactedBytes.readUInt32BE(p);redactionChunks.push(redactedBytes.toString('ascii',p+4,p+8));p+=12+length}
assert.deepEqual(redactionChunks,['IHDR','IDAT','IEND'],'no metadata, embedded original or extra frames');
assert.ok(PUBLIC_MANIFEST.includes('assets/images/our-work/missy-dashboard-redacted.png'));
assert.equal(PUBLIC_MANIFEST.some(p=>/source\.png|image\(20261106|\.private-missy|ocr-source|redact\.py/.test(p)),false);
assert.doesNotMatch(home.match(/<section class="rh-selected[\s\S]*?<\/section>/)[0], /<input|<form|<table/);
assert.doesNotMatch(home, /class="eastland-story-timeline"|class="eastland-live-proof"/);
assert.equal((work.match(/<h1\b/g) || []).length, 1);
assert.match(work, /<link rel="canonical" href="https:\/\/rogersholdingsllc\.com\/our-work\/">/);
assert.match(work, /aria-current="page">Our Work/);

// The approved gallery has seventeen visible stories, including both fictional concepts.
const expectedProjects=['eastland','missys-squishies','monoform','precision-fabrication','captured-by-karmen','store','pizzeria','bike-repair','orchard','repair-cafe','print-review','inventory-tracker','job-capacity','receipt-tracker','staffing-coverage','howl-and-timber','cortez-capital'];
const exhibits=[...work.matchAll(/<article class="work-exhibit" id="([^"]+)" aria-labelledby="([^"]+)">([\s\S]*?)<\/article>/g)];
assert.deepEqual(exhibits.map(m=>m[1]),expectedProjects);
const jump = work.match(/<nav class="work-jump-links"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
assert.deepEqual([...jump.matchAll(/href="#([^"]+)">([^<]+)/g)].map(m=>[m[1],m[2]]), [['eastland','Websites'],['missys-squishies','Spreadsheets'],['inventory-tracker','Web Apps']]);
assert.ok(home.indexOf('id="eastland-walkthrough"') < home.indexOf('id="missy-home-title"'));
assert.ok(home.indexOf('id="missy-home-title"') < home.indexOf('id="monoform-walkthrough"'));
assert.match(home, /Redacted preview\. No customer order data shown\./);
assert.match(home, /Email me a few lines about what’s taking too much time or not working right\./);
for(const [,id,heading,body] of exhibits) {
 assert.ok(body.includes('<h2 id="'+heading+'">'));
 const proof = {
  'precision-fabrication':['Website','Spreadsheet','responsive/fabrication-1040.webp','worksheet-proof/customer-follow-up-sheet.webp'],
  'store':['Website','Spreadsheet','responsive/store-1040.webp','worksheet-proof/order-fulfillment-sheet.webp'],
  'inventory-tracker':['Spreadsheet','Web app','worksheet-proof/inventory-tracker-sheet.webp','worksheet-proof/inventory-tracker-app.webp'],
  'job-capacity':['Spreadsheet','Web app','worksheet-proof/job-capacity-sheet.webp','worksheet-proof/job-capacity-app.webp'],
  'receipt-tracker':['Spreadsheet','Web app','worksheet-proof/receipt-tracker-sheet.webp','worksheet-proof/receipt-tracker-app.webp'],
  'staffing-coverage':['Spreadsheet','Web app','worksheet-proof/staffing-coverage-sheet.webp','worksheet-proof/staffing-coverage-app.webp'],
 }[id];
 const pictures=[...body.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
 if(proof){
  assert.equal(pictures.length,2,id);
  assert.deepEqual([...body.matchAll(/class="work-preview-label">([^<]+)/g)].map(m=>m[1]),proof.slice(0,2));
  pictures.forEach((img,i)=>{assert.ok(img.includes('src="/portfolio/showcase/'+proof[i+2]+'"'));assert.match(img,/loading="lazy"/);});
  assert.equal([...body.matchAll(/<source[^>]*srcset="([^"]+)"/g)].filter(m=>PUBLIC_MANIFEST.includes(m[1].slice(1))).length,2);
 }else{
  assert.equal(pictures.length,1);
  assert.match(body,/<img[^>]*alt="[^"]+"/);
 }
 const links=[...body.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 const target = id === 'monoform' ? '/our-work/monoform/' : '/portfolio/projects/' + id + '/';
 const expectedLinks = [target,target];
 if (id === 'monoform') expectedLinks.push('/#monoform-walkthrough');
 if (id === 'precision-fabrication') expectedLinks.push('/#form-field-walkthrough');
 assert.deepEqual(links, expectedLinks);
 assert.match(body,/aria-label="View [^"]+ project(?:: [^"]+ previews)?"/);
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
    assert.match(html, /href="\/our-work\/">Our Work/);
  } else if(f === 'spreadsheet-repair/index.html') {
    assert.match(html,/href="\.\.\/#work">Our Work/);
    assert.match(html,/href="\/our-work\/">Our Work/);
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

assert.equal(website.split('portfolio/showcase/fabrication-preview.jpg').length-1,1,'featured workflow screenshot is not duplicated');
assert.match(website,/Up to five mobile-friendly pages/);
assert.match(website,/two rounds of in-scope revisions/);
assert.match(website,/Domains, hosting, support, copywriting, extra pages, booking, payments and integrations are quoted separately/);
assert.doesNotMatch(website,/<section class="section website-evidence"/);

// Owner-requested cleanup: examples remain distinct from real client work, without the old labels.
for (const file of PUBLIC_MANIFEST.filter(f => /\.(html|webmanifest)$/.test(f) || f.endsWith('howl-and-timber-wordmark.svg') || f.endsWith('assets/wordmark.svg'))) {
 const presentation = read(file).replace(/<!--[^]*?-->/g,'').replace(/<(style)\b[^>]*>[^]*?<\/\1>/gi,'').replaceAll('fictional-team','example-team');
 assert.doesNotMatch(presentation,/\bfictional\b|AI-generated|AI-assisted/i,`${file}: no old presentation labels`);
}
assert.doesNotMatch(home, /<section class="rh-orbit|left:157px/);
assert.match(read('assets/css/homepage-graphite.css'), /focus-visible/);
console.log('Selected Graphite projects, gallery disclosures and keyboard focus preserved.');

const monoform=read('our-work/monoform/index.html');
assert.match(work,/href="\/our-work\/monoform\/"/);
assert.match(monoform,/rel="canonical" href="https:\/\/rogersholdingsllc\.com\/our-work\/monoform\/">/);
assert.match(monoform,/href="\/our-work\/monoform\/demo\/"/);
assert.doesNotMatch(monoform, /chatgpt\.(?:site|com)/i);
assert.match(monoform,/not a real sale/);
assert.doesNotMatch(monoform,/graphite\/|homepage-review|<iframe|<form/i);

// Form / Field public r24 lives at the stable demo route; the companion stays fictional.
const ffBase='portfolio/precision-fabrication/';
const ffPages=['index.html','capabilities/index.html','library/index.html','brief/index.html','tracker/index.html'];
for (const file of ffPages) {
 const page=read(ffBase+file);
 assert.match(page,/https:\/\/rogersholdingsllc\.com\/portfolio\/precision-fabrication\//);
 assert.doesNotMatch(page,/chatgpt\.(?:site|com)|docs\.google\.com|href="\/"|(?:src|href)="\/assets\//i);
 assert.match(page,/form-action 'none'/);
 assert.ok(PUBLIC_MANIFEST.includes(ffBase+file));
}
assert.match(read(ffBase+'brief/index.html'),/data-public-tracker/);
assert.match(read(ffBase+'site.js'),/customer-follow-up\/#quote-process=/);
assert.doesNotMatch(read('portfolio/projects/precision-fabrication/index.html'),/original single-page workflow|newer design preview/);

// The public browser worksheet and both of its captures follow the companion workbook palette.
const ffWorksheet=read('portfolio/projects/customer-follow-up/index.html');
assert.match(ffWorksheet,/\.quote-desk \.demo-brand\{background:#202723/);
assert.match(ffWorksheet,/form-field-workbook-palette/);
assert.doesNotMatch(ffWorksheet,/#(?:132b42|173b58|eaf1f7|dbe6ef)\b/i);

// Compact case pages offer the approved Sheets sample, Excel download and a separate app.
const approvedPublicSheets = JSON.parse(fs.readFileSync(new URL('./approved-public-sheets.json',import.meta.url),'utf8'));
const demoCases = new Map([
 ['customer-follow-up','form-field-quote-follow-up.xlsx'],
 ['inventory-tracker','second-shelf-inventory.xlsx'],
 ['job-capacity','benchline-job-capacity.xlsx'],
 ['receipt-tracker','paper-trail-receipt-register.xlsx'],
 ['staffing-coverage','clockwise-staffing-coverage.xlsx'],
 ['order-fulfillment','silt-ember-order-fulfillment.xlsx']
]);
function appEntrance(page, search, hash) {
 const script=page.match(/<script data-example-view>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script, 'case has a scoped app-mode initializer');
 const template={
  dataset:{},
  parentElement:{dataset:{}},
  after(value) {this.inserted=value;},
  content:{cloneNode(deep){assert.equal(deep,true);return {app:true};}},
 };
 vm.runInNewContext(script,{
  URLSearchParams,location:{search,hash},
  document:{getElementById(id){assert.equal(id,'example-app-template');return template}},
  requestAnimationFrame(f) {assert.equal(typeof f,'function');},
 },{timeout:1000});
 assert.equal(template.dataset.active==='true',!!template.inserted);
 assert.equal(template.parentElement.dataset.exampleMode==='app',!!template.inserted);
 return !!template.inserted;
}
for (const [project,file] of demoCases) {
 const page=read('portfolio/projects/'+project+'/index.html');
 const links=page.match(/<nav class="case-demo-links"[^>]*>[\s\S]*?<\/nav>/)?.[0];
 assert.ok(links,project);
 assert.deepEqual([...links.matchAll(/href="([^"]+)"/g)].map(m=>m[1]), [approvedPublicSheets['portfolio/projects/'+project+'/index.html'], '/portfolio/downloads/'+file, './?view=app']);
 assert.ok(links.includes('download>Download Excel (.xlsx)</a>'));
 assert.ok(links.includes('>Open in Google Sheets</a>'));
 assert.ok(links.includes('>Open web app</a>'));
 assert.match(page, /Google Sheets is view-only\. The Excel download and web app are separate/);
 assert.doesNotMatch(page,/project-workflow-proof|deliverable-proof|portfolio\/showcase\/workbooks\//);
 const main=page.slice(page.indexOf('<main'),page.indexOf('</main>'));
 const app=main.match(/<template id="example-app-template">[\s\S]*?<\/template>/)?.[0];
 assert.match(app, /class="(?:workbook|demo-workspace) /);
 assert.match(app, /href="\.\/">Back to the case study<\/a>/);
 assert.doesNotMatch(main.replace(app,''), /class="(?:workbook|demo-workspace) /);
 assert.match(main, /<section class="project-scope" data-case-only/);
 assert.equal(appEntrance(page,'',''),false);
 assert.equal(appEntrance(page,'?view=app',''),true);
 assert.equal(appEntrance(page,'?view=web-app',''),true);
 assert.equal(appEntrance(page,'','#book-title'),true);
 assert.equal(appEntrance(page,'','#worksheet-summary'),true);
 assert.equal(appEntrance(page,'?view=app-preview','#unknown'),false);
 assert.equal(appEntrance(page,'','#quote-process=assembly'),project==='customer-follow-up');
 assert.equal(appEntrance(page,'','#order-units=4'),project==='order-fulfillment');
 assert.equal(appEntrance(page,'','#quote-process=unknown'),false);
 assert.equal(appEntrance(page,'','#order-units=121'),false);
}
for (const [project,route,site] of [['precision-fabrication','customer-follow-up','precision-fabrication'],['store','order-fulfillment','store']]) {
 const page=read('portfolio/projects/'+project+'/index.html');
 assert.match(page, /rel="canonical" href="https:\/\/rogersholdingsllc\.com\//);
 assert.ok(page.includes('href="../'+route+'/?view=app">Open web app</a>'));
 assert.ok(page.includes('href="/portfolio/downloads/'+demoCases.get(route)+'" download>Download Excel (.xlsx)</a>'));
 assert.ok(page.includes('href="../../'+site+'/"'));
 const sheets = approvedPublicSheets['portfolio/projects/'+project+'/index.html'];
 const sheetLink = '<a href="'+sheets+'">Open in Google Sheets</a>';
 assert.ok(page.includes(sheetLink+'<a href="/portfolio/downloads/'+demoCases.get(route)+'" download>'));
 assert.doesNotMatch(page.replace(sheetLink,''), /<video\b|docs\.google\.com|chatgpt\.(?:com|site)|portfolio\/showcase\/workbooks\//i);
 const preview=page.match(/<div class="project-workflow-proof project-workflow-proof--website"[^>]*>[\s\S]*?<\/div>/)?.[0];
 assert.ok(preview,'standalone website preview preserved');
 assert.equal((preview.match(/<figure>/g)||[]).length,1);
}
assert.match(read('portfolio/projects/precision-fabrication/index.html'), /href="\/#form-field-walkthrough"/);
console.log('Compact cases, workbook and web app links, legacy app routing, and the standalone website previews passed.');

// Visitors see static case-study evidence; interactive controls belong to a deliberate demo view.
const allCases = new Set([...work.matchAll(/href="(\/portfolio\/projects\/[a-z-]+\/|\/our-work\/monoform\/)"/g)].map(m => m[1]));
assert.equal(allCases.size,17);
allCases.add('/portfolio/projects/customer-follow-up/');
allCases.add('/portfolio/projects/order-fulfillment/');
for (const route of allCases) {
 const file = route.slice(1)+'index.html';
 const page = read(file);
 const main = page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
 assert.ok(main,file);
 const caseView=main.replace(/<template\b[^>]*>[\s\S]*?<\/template>/g,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 assert.doesNotMatch(caseView,/<(?:iframe|video|form|canvas|object|embed|button|input|select|textarea)\b/i,file);
 const still = [...caseView.matchAll(/<img\b[^>]*\bsrc="(?!data:)([^"]+)"[^>]*>/g)];
 assert.ok(still.length>=1,file+' needs a static project screenshot');
 for (const [tag,src] of still) {
  assert.match(tag,/\balt="[^"]+"/,file);
  assert.ok(PUBLIC_MANIFEST.includes(referenceToManifestPath(file,src)),file+' screenshot is not in the public artifact');
 }
 const slug=route.split('/').at(-2);
 if(demoCases.has(slug)){
  assert.equal(still.length,2,file+' needs a spreadsheet and web app screenshot');
  assert.match(caseView,/<section class="worksheet-proof" aria-labelledby="worksheet-proof-title" data-case-only>/);
  assert.deepEqual(still.map((entry)=>entry[1]),['sheet','app'].map((kind)=>'/portfolio/showcase/worksheet-proof/'+slug+'-'+kind+'.webp'));
  for(const kind of ['sheet','app']){
   const mobile='/portfolio/showcase/worksheet-proof/'+slug+'-'+kind+'-mobile.webp';
   assert.ok(caseView.includes('srcset="'+mobile+'"'));
   assert.ok(PUBLIC_MANIFEST.includes(mobile.slice(1)));
  }
 } else if(slug==='precision-fabrication'||slug==='store'){
  assert.equal(still.length,3,file+' needs the website and both companion tool screenshots');
  assert.match(caseView,/<section class="worksheet-proof" aria-labelledby="worksheet-proof-title">/);
 }
}
console.log('All 19 portfolio case routes show static evidence and no inline interactive demos.');
