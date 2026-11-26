const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), html = fs.readFileSync(root + '/index.html', 'utf8');
const exists = p => fs.existsSync(path.join(root, p.split('?')[0]));
const preload = '<link rel="preload" as="image" href="assets/images/brand/rh-abstract-fold.svg" fetchpriority="high" media="not (prefers-contrast: more)">';
assert.equal(html.split(preload).length - 1, 1);
assert.ok(html.indexOf(preload) < html.indexOf('<style'));
assert.ok(exists('assets/images/brand/rh-abstract-fold.svg'));
const css = fs.readFileSync(root + '/assets/css/homepage-graphite.css', 'utf8');
assert.match(css, /@media\(max-width:860px\)/);
assert.match(css, /@media\(prefers-contrast:more\)/);

const region = html.match(/<section class="rh-selected"[\s\S]*?(?=<script>\n\(\(\) => \{\n  const legacy)/)?.[0];
assert.ok(region, 'selected projects region');
assert.doesNotMatch(region, /aria-roledescription="carousel"|<iframe|<form/);
const images = [...region.matchAll(/<img ([^>]+)>/g)].map(m => m[1]);
assert.equal(images.length, 3);
assert.equal(images.filter(img => img.includes('/portfolio/showcase/missy-redacted.png')).length, 1);
for (const image of images) {
 const src = image.match(/\bsrc="([^"]+)"/)?.[1];
 assert.ok(src && exists(src));
 assert.match(image, /\bwidth="[1-9]\d*" height="[1-9]\d*"/);
 assert.match(image, /\bloading="lazy" decoding="async"/);
}
const video = region.match(/<video\b[^>]*>[\s\S]*?<\/video>/)?.[0];
assert.ok(video);
assert.match(video, /controls muted playsinline loop preload="none"/);
assert.match(video, /data-src="\/assets\/media\/eastland-homepage-tour\.mp4"/);
assert.doesNotMatch(video, /<source src=/, 'do not fetch the homepage walkthrough before reaching it');
assert.match(video, /kind="chapters"[^>]*srclang="en"/);
assert.match(region, /<noscript><a href="\/assets\/media\/eastland-homepage-tour\.mp4"/);
assert.match(region, /IntersectionObserver/);
assert.match(region, /prefers-reduced-motion: reduce/);
for (const [, asset] of video.matchAll(/\b(?:poster|data-src|src)="([^"]+)"/g)) assert.ok(exists(asset), asset);
console.log('PASS Graphite homepage: responsive media, safe video timing, reduced-motion support and no-script access.');
