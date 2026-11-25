'use strict';
// Production-source contract checks. The VM below has no network or browser APIs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rootPath = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(rootPath, file), 'utf8');
const home = read('index.html');
const projectSlugs = ['captured-by-karmen', 'eastland', 'store', 'order-fulfillment',
  'precision-fabrication', 'customer-follow-up', 'pizzeria', 'bike-repair', 'orchard',
  'repair-cafe', 'print-review', 'missys-squishies', 'inventory-tracker', 'job-capacity',
  'receipt-tracker', 'staffing-coverage'];
const demoSlugs = ['store', 'precision-fabrication', 'pizzeria', 'bike-repair',
  'orchard', 'repair-cafe', 'print-review'];
const projectPaths = projectSlugs.map(slug => `portfolio/projects/${slug}/index.html`);
const demoPaths = demoSlugs.map(slug => `portfolio/${slug}/index.html`);
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

for (const file of ['index.html', 'website-creation/index.html', ...projectPaths, ...demoPaths]) {
  const html = read(file);
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${file}: one main landmark`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one first-level heading`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: unique IDs`);
  assert.match(html, /<html\b[^>]*lang="en"/, `${file}: document language`);
  assert.match(html, /name="viewport"[^>]*width=device-width/, `${file}: responsive viewport`);
  assert.doesNotMatch(html, /PRIVATE DESIGN PREVIEW|LIVE SITE UNCHANGED|owner.only preview|rh38-qa|\.openai\/|localhost|127\.0\.0\.1|100\.102\.57\.95|docs\.google\.com|drive\.google\.com|script\.google\.com|TURNSTILE_SECRET_KEY|RECEIVER_SHARED_SECRET/i, `${file}: no private preview, document or receiver references`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.notEqual(attr(tag, 'alt'), undefined, `${file}: every image has an alt attribute`);
    assert.ok(Number(attr(tag, 'width')) > 0 && Number(attr(tag, 'height')) > 0, `${file}: image reserves dimensions`);
  }
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(attr(tag, 'rel') || '', /\bnoopener\b/, `${file}: new-tab opener protection`);
  }
}

for (const file of ['index.html', 'website-creation/index.html']) {
  const html = read(file), main = html.match(/<main\b[^>]*>/)?.[0];
  assert.ok(attr(main, 'id'), `${file}: main target has an ID`);
  assert.ok(html.includes(`href="#${attr(main, 'id')}"`), `${file}: skip link reaches main`);
  assert.match(html, /data-menu-toggle/, `${file}: production accessible menu retained`);
  assert.match(html, /aria-controls="primary-navigation"/);
  assert.match(html, /data-navigation/);
  assert.match(html, /assets\/js\/site\.js(?:\?v=snapshot-analytics-20261108)?"/);
  assert.match(html, /G-MK4TVD3CYT/, `${file}: approved analytics integration retained`);
}

const work = read('our-work/index.html');
const redirects = [...home.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.includes('location.replace'));
assert.equal(redirects.length, 1);
function redirect(project) {
  const calls = [];
  vm.runInNewContext(redirects[0], { URLSearchParams, location: {
    search: '?project=' + encodeURIComponent(project), replace(path) { calls.push(path); }
  } }, { timeout: 1000 });
  return calls;
}
for (const [i, slug] of projectSlugs.entries()) {
  const paired = {'order-fulfillment':'store', 'customer-follow-up':'precision-fabrication'};
  const anchor = paired[slug] || slug;
  assert.deepEqual(redirect(slug), ['/our-work/#' + anchor]);
  assert.deepEqual(redirect(String(i + 1)), ['/our-work/#' + anchor]);
  assert.ok(work.includes('id="' + anchor + '"'));
}
for (const invalid of ['0','17','-1','1.5','NaN','https://example.com','__proto__','<script>']) {
  assert.deepEqual(redirect(invalid), [], 'unknown query cannot redirect');
}

for (const file of demoPaths) {
  const html = read(file);
  assert.match(html, /example/i, `${file}: visible example demonstration disclosure`);
  assert.doesNotMatch(html, /fetch\s*\(|XMLHttpRequest|sendBeacon\s*\(|WebSocket\s*\(|https?:[^"'<>\s]*(?:stripe|paypal|checkout)|localStorage|sessionStorage|document\.cookie/i, `${file}: no real transaction, submission or persistence API`);
  for (const [tag] of html.matchAll(/<form\b[^>]*>/g)) assert.ok(!attr(tag, 'action'), `${file}: no remote form action`);
}

// These two fragments carry only bounded fictional state, not anchor IDs or PII.
// Run the actual receiving scripts, including hostile/ambiguous inputs, offline.
function handoff(slug, hash) {
  const html = read(`portfolio/projects/${slug}/index.html`);
  const sources = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const source = sources.find(s => s.includes('new URLSearchParams(location.hash.slice(1))'));
  assert.ok(source, `${slug}: explicit fragment-state receiver`);
  assert.doesNotMatch(source, /innerHTML|fetch\s*\(|localStorage|sessionStorage|sendBeacon|XMLHttpRequest/);
  const value = { textContent: '' }, preview = { hidden: true };
  vm.runInNewContext(source, { URLSearchParams, location: { hash },
    document: { getElementById(id) { assert.ok(['handoff-value', 'handoff-preview'].includes(id)); return id === 'handoff-value' ? value : preview; } } }, { timeout: 1000 });
  return { value: value.textContent, shown: !preview.hidden };
}
for (const [value, label] of [['sheet', 'Sheet metal'], ['assembly', 'Assembly'], ['prototype', 'Prototype']]) {
  assert.deepEqual(handoff('customer-follow-up', '#quote-process=' + value), { value: label, shown: true });
}
for (const value of ['', 'constructor', '__proto__', 'unknown', '<script>']) {
  assert.deepEqual(handoff('customer-follow-up', '#quote-process=' + value), { value: '', shown: false });
}
for (const value of ['1', '120']) assert.deepEqual(handoff('order-fulfillment', '#order-units=' + value), { value, shown: true });
for (const value of ['', '0', '-1', '121', '1.5', 'NaN', '<script>']) {
  assert.deepEqual(handoff('order-fulfillment', '#order-units=' + value), { value: '', shown: false });
}
assert.match(read('portfolio/store/index.html'), /href="\.\.\/projects\/order-fulfillment\/#order-units='/);
assert.match(read('portfolio/precision-fabrication/index.html'), /\.\.\/projects\/customer-follow-up\/#quote-process=/);

console.log('Premium portfolio: 16 preserved legacy project destinations, bounded redirect VM checks, 7 fictional local-only demos, bounded handoff parsers and public privacy boundaries passed.');
