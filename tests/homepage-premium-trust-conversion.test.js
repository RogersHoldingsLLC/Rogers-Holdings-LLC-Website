const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const home = read('index.html');
const main = home.match(/<main[\s\S]*?<\/main>/)[0];
const hero = main.slice(0, main.indexOf('<section class="rh-selected"'));
// The approved Graphite redesign replaces the old carousel with selected projects.
// Preserve the destination, consent and honest-offer contracts, not old geometry.
for (const id of ['top', 'capabilities', 'work', 'about', 'contact', 'approach', 'process', 'website-creation', 'spreadsheet-repair']) {
  assert.ok(main.includes('id="' + id + '"'), `preserve existing deep link #${id}`);
}
assert.match(hero, /href="#contact">Discuss a project/);
assert.doesNotMatch(hero, /href="\/?business-snapshot/);
assert.match(main, /written scope and price before paid work starts/);
assert.match(main, /href="\/?website-creation\/"/);
assert.match(home, /href="\/?services\/"/);
// All existing services and the custom web app service remain reachable through the primary Services link.
const services = read('services/index.html');
for (const id of ['websites', 'spreadsheets', 'custom-web-apps', 'forms-intake', 'business-documents', 'seo-local-search']) {
  assert.ok(services.includes('id="' + id + '"'), `approved service ${id} remains available`);
}
assert.match(main, /href="mailto:briankeith@rogersholdingsllc\.com\?subject=[^"]+"/);
assert.match(main, /href="tel:\+18594044351"/);
assert.match(main, /Free Business Snapshot/);
assert.match(main, /optional and separate from paid work/i);
assert.match(main, /Please do not send passwords or confidential customer data/);
assert.doesNotMatch(home, /clear-path|<canvas|Play animation|Replay/, 'retired decorative media must not load');
assert.equal((home.match(/<video\b/g) || []).length, 3, 'only the three approved walkthroughs use homepage video');
assert.match(hero, /href="\/our-work\/">See our work/);
const visibleMain = main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
assert.doesNotMatch(visibleMain, /<form|<input|testimonial|[0-9]+%|hours saved|revenue increased/i);
console.log('Redesigned homepage routes, truthful scope, optional Snapshot and contact privacy contracts passed.');
require('./premium-portfolio.test.cjs');

assert.match(hero, /websites, spreadsheets and custom web apps/);
assert.match(main, /href="\/services\/#custom-web-apps">Explore custom web apps/);
assert.match(services, /connect it to a spreadsheet you already use or set up a new system/);
assert.match(services, /records update behind the scenes/);
assert.match(read('our-work/index.html'), /separate examples and do not sync/);
