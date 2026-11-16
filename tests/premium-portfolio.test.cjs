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

const figures = [...home.matchAll(/<figure\b[^>]*class="rh-orbit-panel\b[^>]*>[\s\S]*?<\/figure>/g)].map(m => m[0]);
assert.equal(figures.length, 16, 'carousel has exactly sixteen entries');
const destinations = figures.map(figure => attr(figure.match(/<a\b[^>]*>/)[0], 'href').replace(/^\//, ''));
assert.deepEqual(destinations, projectSlugs.map(slug => `portfolio/projects/${slug}/`), 'carousel route order and identity are explicit');
assert.equal(new Set(destinations).size, 16);
for (const figure of figures) assert.match(figure, /aria-label="View [^"]+ details"/, 'each carousel destination is named');
assert.match(home, /aria-roledescription="carousel"/);
assert.match(home, /class="rh-orbit-stage"[^>]*tabindex="0"[^>]*role="group"/);
assert.match(home, /data-rh-prev[^>]*aria-label="Previous project"/);
assert.match(home, /data-rh-next[^>]*aria-label="Next project"/);
assert.match(home, /role="status" aria-live="polite" aria-atomic="true" data-rh-status/);
const fallback = home.match(/<noscript>[\s\S]*?class="rh-orbit-fallback"[\s\S]*?<\/noscript>/)?.[0];
assert.ok(fallback, 'all carousel routes remain usable without JavaScript');
for (const href of destinations) assert.ok(fallback.includes(href));
const styles = [...home.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
assert.match(styles, /prefers-reduced-motion\s*:\s*reduce/, 'carousel respects reduced motion');

const scripts = [...home.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const carousel = scripts.filter(source => source.includes("querySelector('.rh-orbit-ring')"));
assert.equal(carousel.length, 1, 'exactly one carousel implementation');
assert.doesNotMatch(carousel[0], /setInterval|setTimeout|requestAnimationFrame|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage/, 'carousel is user-controlled and has no persistence or network');

function element() {
  const classes = new Set(), handlers = {}, attributes = {};
  return { handlers, attributes, dataset: {}, style: {}, textContent: '',
    classList: { add: value => classes.add(value), contains: value => classes.has(value),
      toggle(value, enabled) { enabled ? classes.add(value) : classes.delete(value); } },
    setAttribute(name, value) { attributes[name] = value; },
    addEventListener(name, handler) { handlers[name] = handler; } };
}
function runCarousel(search = '', hash = '') {
  const ring = element(), stage = element(), title = element(), kind = element(), status = element();
  const prev = element(), next = element();
  const panels = figures.map(() => {
    const panel = element(), link = element(), image = element();
    image.complete = true; image.naturalWidth = 1; image.parentElement = element();
    panel.link = link; panel.image = image;
    panel.querySelector = selector => selector === '.rh-orbit-screen-link' ? link : image;
    return panel;
  });
  const nodes = { '.rh-orbit-ring': ring, '.rh-orbit-stage': stage, '.rh-orbit-name': title,
    '.rh-orbit-kind': kind, '[data-rh-status]': status, '[data-rh-prev]': prev, '[data-rh-next]': next };
  const root = element(); root.classList.add('rh-orbit');
  root.querySelector = selector => { assert.ok(nodes[selector], selector); return nodes[selector]; };
  root.querySelectorAll = selector => selector === '.rh-orbit-panel' ? panels : panels.map(p => p.image);
  vm.runInNewContext(carousel[0], { document: { currentScript: { previousElementSibling: root } },
    URLSearchParams, location: { search, hash }, addEventListener() {} }, { timeout: 1000 });
  const selected = () => {
    const visible = panels.filter(panel => panel.attributes['aria-hidden'] === 'false');
    assert.equal(visible.length, 1, 'only one slide is exposed');
    assert.equal(panels.filter(panel => panel.link.tabIndex === 0).length, 1, 'only one slide link is tabbable');
    assert.equal(visible[0].link.tabIndex, 0);
    for (const panel of panels) {
      assert.equal(panel.classList.contains('is-front'), panel === visible[0]);
      assert.equal(Boolean(panel.image.alt), panel === visible[0]);
    }
    return panels.indexOf(visible[0]);
  };
  const key = key => { let prevented = false; stage.handlers.keydown({ key, preventDefault() { prevented = true; } }); return prevented; };
  return { selected, key, prev: () => prev.handlers.click(), next: () => next.handlers.click(), status, title };
}
const demo = runCarousel();
assert.equal(demo.selected(), 0);
for (let i = 1; i <= 16; i++) { demo.next(); assert.equal(demo.selected(), i % 16); assert.match(demo.status.textContent, new RegExp(`${i % 16 + 1} of 16\\.`)); }
demo.prev(); assert.equal(demo.selected(), 15);
assert.equal(demo.key('Home'), true); assert.equal(demo.selected(), 0);
assert.equal(demo.key('End'), true); assert.equal(demo.selected(), 15);
demo.key('ArrowRight'); assert.equal(demo.selected(), 0);
demo.key('ArrowLeft'); assert.equal(demo.selected(), 15);
assert.equal(demo.key('Tab'), false, 'carousel does not intercept Tab');
assert.equal(runCarousel('?project=16').selected(), 15);
for (const invalid of ['0', '17', '-1', '1.5', 'NaN']) assert.equal(runCarousel('?project=' + invalid).selected(), 0);
assert.equal(runCarousel('', '#spreadsheets').selected(), 3);
assert.equal(runCarousel('', '#eastland-work').selected(), 1);

for (const file of demoPaths) {
  const html = read(file);
  assert.match(html, /fictional/i, `${file}: visible fictional demonstration disclosure`);
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

console.log('Premium portfolio: 16 exact accessible carousel routes, keyboard/wrap VM checks, 7 fictional local-only demos, bounded handoff parsers and public privacy boundaries passed.');
