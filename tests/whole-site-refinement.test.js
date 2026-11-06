const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const root=path.resolve(__dirname,'..');const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const pages=['index.html','services/index.html','website-creation/index.html','spreadsheet-repair/index.html','packages/index.html','our-work/index.html','business-snapshot/index.html','privacy/index.html'];
for(const p of pages){const html=read(p);const nav=html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)[0];const labels=[...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m=>m[1]);assert.deepEqual(labels,['Services','Our Work','About','Discuss a project'],p);assert.match(html,/studio-review\.css/);assert.doesNotMatch(html,/localhost|workers\.dev|TURNSTILE_SECRET_KEY/);}
const snapshot=read('business-snapshot/index.html'),js=read('assets/js/site.js');const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(snapshot.match(/<form class="lead-form"[\s\S]*?<\/form>/)[0]),'669fbe5bb55d50f006d3499a6f74e092bace488df6fce37d7d176f1c87c733a6','intake fields, consent and native validation contract must be unchanged');
assert.equal(hash(js),'298a859cc05f265de6bc31ae6cda57154688d48064675a8f8c5cebd970a2e9df','existing intake, delivery, navigation and analytics behavior must remain unchanged');
assert.match(snapshot,/href="#snapshot-sample"/);assert.match(snapshot,/id="snapshot-sample"/);
assert.match(js,/result\.requestId === requestId/);assert.match(js,/result\.environment === 'production'/);assert.match(js,/typeof result\.retry === 'boolean'/);
assert.match(read('privacy/index.html'),/Privacy/);
console.log('Shared navigation, intake identity, production response and privacy contracts passed');
