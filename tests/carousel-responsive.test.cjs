const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8');
const figures=[...html.matchAll(/<figure class="rh-orbit-panel[^\n]+/g)];assert.equal(figures.length,14);
for(const [i,f] of figures.entries()){
 const images=[...f[0].matchAll(/<img ([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]])));
 assert.equal(images.length,2);assert.equal(images[0].srcset,images[1].srcset);assert.equal(images[0].sizes,images[1].sizes);assert.equal(images[0].src,images[1].src);
 for(const [face,img] of images.entries()){
 assert.ok(fs.existsSync(root+'/'+img.src.split('?')[0]));assert.equal(img.decoding,'async');assert.notEqual(img.loading,'lazy');if(i!==0||face!==0)assert.equal(img.loading,'eager');
 let last=0;for(const part of img.srcset.split(', ')){const [asset,w]=part.split(' ');const width=parseInt(w);assert.ok(width>last);last=width;assert.ok(fs.existsSync(root+'/'+asset.split('?')[0]));}
 }
 if(i===0)assert.equal(images[0].fetchpriority,'high');
}
console.log('PASS responsive carousel: 14 paired source sets, existing fallbacks, eager loading, priority and valid asset candidates.');

const preload='<link rel="preload" as="image" href="assets/images/brand/rh-abstract-fold.svg" fetchpriority="high" media="not (prefers-contrast: more)">';
assert.equal(html.split(preload).length-1,1);
assert.ok(html.indexOf(preload)<html.indexOf('<style'));
assert.ok(html.includes('url("assets/images/brand/rh-abstract-fold.svg")'));
assert.ok(fs.existsSync(root+'/assets/images/brand/rh-abstract-fold.svg'));
assert.match(html,/@media\(prefers-contrast:more\)\{[^}]*background-image:none/);
console.log('PASS hero preload: single early exact CSS image URL with contrast opt-out; original front priority preserved.');

assert.match(html,/\.gallery-home \.all-work \.rh-orbit-panel\{transform:rotateY\(var\(--rh-angle\)\) translateZ\(var\(--rh-radius\)\) scale\(var\(--rh-active-scale,1\)\);transition:transform 850ms cubic-bezier\(\.22,\.7,\.18,1\),filter 650ms ease,opacity 650ms ease\}/);
assert.match(html,/\.gallery-home \.all-work \.rh-orbit-panel\.is-front\{--rh-active-scale:1\.20\}/);
assert.match(html,/@media\(prefers-reduced-motion:reduce\)\{\.rh-orbit-ring,\.rh-orbit-panel,\.rh-orbit-panel img,\.rh-orbit-arrow\{transition:none!important\}/);
console.log('PASS active-card emphasis: scale only at front, original placement and reduced-motion guard retained.');
