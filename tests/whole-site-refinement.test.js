const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const root=path.resolve(__dirname,'..');const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const pages=['index.html','services/index.html','website-creation/index.html','spreadsheet-repair/index.html','packages/index.html','our-work/index.html','business-snapshot/index.html','privacy/index.html'];
for(const p of pages){const html=read(p);const nav=html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)[0];const labels=[...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m=>m[1]);assert.deepEqual(labels,['Services','Our Work','About','Discuss a project'],p);if(!['index.html','website-creation/index.html'].includes(p))assert.match(html,/studio-review\.css/);else assert.match(html,/\.site-header \.primary-nav\.is-open\{display:flex\}/);assert.doesNotMatch(html,/localhost|workers\.dev|TURNSTILE_SECRET_KEY/);}
const snapshot=read('business-snapshot/index.html'),js=read('assets/js/site.js');const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(snapshot.match(/<form class="lead-form"[\s\S]*?<\/form>/)[0]),'2e09fd119a71c05d3133844de9321a3c4b161ac8d9d5fe88b400e74f66869811','intake fields, consent and native validation contract must be unchanged');
assert.equal(hash(js),'b274a00733ca5f32f820a3ae54707936a87a9f7ae6648b3fecde82349ecf39cc','reviewed shared behavior, including the approved Snapshot analytics correction, must remain unchanged');
assert.match(snapshot,/href="#snapshot-sample"/);assert.match(snapshot,/id="snapshot-sample"/);
assert.match(js,/result\.requestId === requestId/);assert.match(js,/result\.environment === 'production'/);assert.match(js,/typeof result\.retry === 'boolean'/);
assert.match(read('privacy/index.html'),/Privacy/);
console.log('Shared navigation, intake identity, production response and privacy contracts passed');

// Expandable sections share a visible native-summary invitation without new JS.
const disclosureCounts = {'services/index.html': 5, 'business-snapshot/index.html': 1, 'our-work/index.html': 0, 'spreadsheet-repair/index.html': 1, 'packages/index.html': 1};
const disclosurePages = Object.keys(disclosureCounts);
let disclosureCount = 0;
for (const page of disclosurePages) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  const summaries = [...source.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/g)];
  assert.equal(summaries.length, disclosureCounts[page], `${page}: exact reviewed native disclosure count`);
  for (const summary of summaries) {
    disclosureCount++;
    assert.match(summary[0], /<summary class="disclosure-summary">/);
    assert.match(summary[1], /class="disclosure-title"/);
    assert.match(summary[1], /class="disclosure-action" aria-hidden="true"/);
    assert.match(summary[1], /class="disclosure-view">View details/);
    assert.match(summary[1], /class="disclosure-hide">Hide details/);
    assert.doesNotMatch(summary[1], /<button|<a\s|role="button"|aria-expanded/);
  }
  assert.match(source, /studio-review\.css\?v=clear-disclosures-20261107/);
}
assert.equal(disclosureCount, 8, 'eight current service, scope and Snapshot disclosures remain');
// The approved minimal homepage moves the process to a fully visible About section.
const home = read('index.html'), about = read('about/index.html');
assert.match(home, /id="about"[^>]*>[\s\S]*?id="approach"[\s\S]*?href="\/about\/"/, 'both legacy founder/process anchors reach About');
const process = about.match(/<section[^>]*id="approach"[\s\S]*?<\/section>/)?.[0];
assert.ok(process, 'About retains the complete visible project process');
assert.match(process, /aria-labelledby="approach-heading"/);
assert.match(process, /<h2 id="approach-heading">How a project works<\/h2>/);
assert.equal((process.match(/<li>/g)||[]).length, 3);
for (const heading of ['Understand the work', 'Agree the scope', 'Complete and review']) assert.ok(process.includes(`<h3>${heading}</h3>`));
assert.match(process, /scope, quote and review criteria before paid work begins/);
assert.match(process, /Any further work is agreed separately/);
assert.doesNotMatch(process, /<button|<details|aria-expanded/, 'the moved process is visible without interaction');
console.log('Eight current native disclosures and the complete visible About process passed.');

const websiteDetails=read('services/index.html').match(/<section[^>]*id="websites"[\s\S]*?<\/section>/)[0];
assert.match(websiteDetails, /<details class="editorial-detail"><summary class="disclosure-summary">/);
assert.match(websiteDetails, /Website project details/);
assert.match(websiteDetails, /[Uu]p to five core pages/);
assert.match(websiteDetails, /two revision rounds/);
assert.match(websiteDetails, /Domain registration, hosting and ongoing maintenance are separate/);
assert.match(websiteDetails, /<\/details><a class="service-detail-link" href="\.\.\/website-creation\/">/);

assert.doesNotMatch(read('services/index.html'), /service-visual-marker/, 'service icons removed in favor of color and texture');

// Texture-only follow-up: no geometry, type, interaction or external-asset additions.
const textureCSS = read('assets/css/studio-review.css').split('/* Balanced site textures:')[1];
assert.ok(textureCSS, 'shared texture system exists');
const textureProperties = [...textureCSS.matchAll(/(?:^|[;{])\s*([a-z-]+)\s*:/gm)].map(m=>m[1]);
assert.ok(textureProperties.every(p=>p.startsWith('--material-') || ['background-image','background-size'].includes(p)), 'texture pass changes background paint only');
assert.doesNotMatch(textureCSS, /https?:|animation\s*:|transition\s*:/, 'textures have no remote assets or motion');
for (const file of ['services/index.html','our-work/index.html','spreadsheet-repair/index.html','business-snapshot/index.html','packages/index.html','privacy/index.html']) {
 assert.match(read(file), /texture=balanced-paper-20261107/, `${file} uses refreshed shared texture CSS`);
}
const luminance = c => c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
const contrast = (a,b) => {const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (x+.05)/(y+.05)};
const darkenedPaper=[232,221,196].map(v=>v*.898);
const lightenedInk=[56,56,54].map(v=>v*.945+255*.055);
assert.ok(contrast([77,73,65],darkenedPaper)>=4.5,'body text retains AA contrast under conservative texture maximum');
assert.ok(contrast([102,80,27],darkenedPaper)>=4.5,'small gold labels retain AA contrast under conservative texture maximum');
assert.ok(contrast([222,216,203],lightenedInk)>=4.5,'light reading text retains AA contrast under conservative dark-stone maximum');
console.log('Shared texture paint-only, cache, no-motion and conservative text contrast guards passed.');

assert.equal((read('assets/css/studio-review.css').match(/{/g)||[]).length,(read('assets/css/studio-review.css').match(/}/g)||[]).length,'shared stylesheet blocks balance');

// Services: preserve copy alignment while shifting the rule into the card gutter.
const servicesDetail = read('services/index.html');
assert.match(servicesDetail, /\.service-scope-page \.editorial-detail\[open\]::before\{[^}]*inset-inline-start:-12px;[^}]*width:2px;[^}]*pointer-events:none;/);
assert.doesNotMatch(servicesDetail, /box-shadow:inset 2px 0 0 #d4b77f/);
assert.match(servicesDetail, /\.service-scope-page\.durable-site \.service-introduction>\.eyebrow\{\s*font-size:13px;line-height:1\.6;letter-spacing:\.11em;/);
console.log('Service detail gutter and label hierarchy passed');

assert.match(read('our-work/index.html'), /story, preview or working example/);
assert.match(read('portfolio/projects/missys-squishies/index.html'), /href="\/our-work\/#missys-squishies">See the short project overview/);
for (const file of ['portfolio/projects/customer-follow-up/index.html','portfolio/projects/job-capacity/index.html','portfolio/projects/order-fulfillment/index.html','portfolio/projects/inventory-tracker/index.html','portfolio/orchard/index.html','portfolio/print-review/index.html']) {
  assert.doesNotMatch(read(file), /Example working example|[Aa]n planning example|A EXAMPLE PRINT-STUDIO CONCEPT/);
}
console.log('Portfolio classifications, overview links and bounded copy corrections passed');
