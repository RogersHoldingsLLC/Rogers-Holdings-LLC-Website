const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('tests/approved-public-manifest.json'));
const sitemap=read('sitemap.xml'),robots=read('robots.txt');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,urls.length);
const titles=new Set();
for(const url of urls){
 assert.ok(url.startsWith('https://rogersholdingsllc.com/'));
 const file=new URL(url).pathname.slice(1)+'index.html',html=read(file);
 assert.ok(manifest.includes(file));
 assert.ok(html.includes(`<link rel="canonical" href="${url}">`),`${file}: self canonical`);
 assert.match(html,/<meta name="robots" content="index, follow">/);
 assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length,1,`${file}: single H1`);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title);assert.ok(!titles.has(title));titles.add(title);
 assert.match(html,/<meta name="description" content="[^"]+">/);
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
}
const examples=manifest.filter(p=>p.startsWith('examples/')&&p.endsWith('.html'));
assert.deepEqual(examples,['examples/cortez-capital/index.html','examples/howl-and-timber/index.html']);
assert.doesNotMatch(robots,/Disallow:\s*\/examples\//);
for(const file of manifest.filter(p=>(p.startsWith('examples/')||p.startsWith('portfolio/'))&&p.endsWith('.html'))){
 assert.match(read(file),/<meta name="robots" content="noindex[, ]/);assert.ok(!urls.includes('https://rogersholdingsllc.com/'+file.replace(/index\.html$/,'')));
}
for(const file of ['index.html','services/index.html']){
 const html=read(file);for(const key of ['description','og:description','twitter:description']){
 const text=html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]+)"`))?.[1];assert.ok(text?.includes('automation'));
 }
}
assert.match(read('index.html'),/rogers-holdings-make-work-easier-share\.jpg/);
console.log('PASS SEO metadata: 10 canonical sitemap pages, single headings, valid schema, unique titles, all fictional pages noindex, /examples/ crawlable for noindex.');

// Local service clarity on the existing canonical page, not a doorway-page clone.
const website = read('website-creation/index.html');
const localTitle = 'Small Business Web Design in Mount Sterling, KY | Rogers Holdings LLC';
assert.ok(website.includes(`<title>${localTitle}</title>`));
for (const key of ['og:title', 'twitter:title']) assert.match(website, new RegExp(`<meta (?:name|property)="${key}" content="${localTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`), key);
const h1Text = website.match(/<h1 id="title">([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
assert.equal(h1Text, 'Small Business Web Design in Mount Sterling, KY');
assert.match(website, /remote customers across the U\.S\./);
const demo = website.match(/<section class="example" id="form-field"[\s\S]*?<\/section>/)?.[0];
const eastland = website.match(/<section class="local-project" aria-labelledby="eastland-project">[\s\S]*?<\/section>/)?.[0];
assert.match(demo, /Featured project demo[\s\S]*?Form \/ Field[\s\S]*?Example demo\. It doesn’t send quotes or write to Google Sheets/);
assert.doesNotMatch(demo, /eastlandfirstchurchofgod\.com/);
assert.match(eastland, /Real client project[\s\S]*?<h2 id="eastland-project">Eastland First Church of God<\/h2>[\s\S]*?Mount Sterling church/);
assert.match(eastland, /href="https:\/\/eastlandfirstchurchofgod\.com\/">Visit the church website/);
assert.match(eastland, /href="\.\.\/portfolio\/projects\/eastland\/">Read the Eastland project story/);
assert.match(eastland, /eastland-520\.webp" width="520" height="270" loading="lazy"/);
assert.ok(manifest.includes('portfolio/showcase/responsive/eastland-520.webp'));
assert.equal((website.match(/<article><p class="kicker">0[12] ·/g) || []).length, 2, 'two existing starter options');
assert.match(read('index.html'), /href="\/website-creation\/">explore small-business web design and refreshes/);
assert.match(read('services/index.html'), /href="\.\.\/website-creation\/">Explore small-business web design and refreshes/);
assert.match(read('services/index.html'), /Based in Mount Sterling, Kentucky, and available nationwide/);
const websiteGraph = JSON.parse(website.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
assert.equal(websiteGraph.find(x => x['@type'] === 'WebPage').name, localTitle);
assert.equal(websiteGraph.find(x => x['@type'] === 'WebPage').description, website.match(/<meta name="description" content="([^"]+)"/)[1]);
console.log('PASS local web-design copy: aligned metadata, real project vs demo, remote reach, descriptive internal links and two starter options.');
