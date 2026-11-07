const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const work = fs.readFileSync(path.join(root, 'our-work/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/site.css'), 'utf8');
const visualFirstWorkflow = fs.readFileSync(path.join(root, 'docs/ROGERS_HOLDINGS_VISUAL_FIRST_WORKFLOW.md'), 'utf8');
const eastlandFreeze = fs.readFileSync(path.join(root, 'docs/design-source/EASTLAND_FINAL_APPROVED_FREEZE.md'), 'utf8');
const homepageHeroFreeze = fs.readFileSync(path.join(root, 'docs/design-source/HOMEPAGE_HERO_V2_FINAL_APPROVED_FREEZE.md'), 'utf8');
const homepageHeroV22Refresh = fs.readFileSync(path.join(root, 'docs/design-source/HOMEPAGE_HERO_V2_2_EXECUTIVE_BRIEF_REFRESH.md'), 'utf8');
const homepageHeroV22Source = path.join(root, 'docs/design-reference/homepage-hero-v2.2/Executive Brief - North Point Fitness.pdf');
const homepageAssets = path.join(root, 'assets/images/homepage');
const eastlandReference = path.join(root, 'docs/design-reference/eastland-client-work-FINAL-REFERENCE.png');

function imageDimensions(filePath) {
  const bytes = fs.readFileSync(filePath);
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.avif') {
    const ispe = bytes.indexOf(Buffer.from('ispe'));
    assert.ok(ispe >= 0, `AVIF dimensions missing from ${filePath}`);
    return [bytes.readUInt32BE(ispe + 8), bytes.readUInt32BE(ispe + 12)];
  }
  if (extension === '.webp') {
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    const chunk = bytes.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
    if (chunk === 'VP8X') return [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1];
    if (chunk === 'VP8L') {
      const packed = bytes.readUInt32LE(21);
      return [(packed & 0x3fff) + 1, ((packed >>> 14) & 0x3fff) + 1];
    }
    assert.fail(`Unsupported WebP header in ${filePath}`);
  }
  if (extension === '.jpg') {
    let offset = 2;
    const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      if (sofMarkers.has(marker)) return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      offset += 2 + bytes.readUInt16BE(offset + 2);
    }
    assert.fail(`JPEG dimensions missing from ${filePath}`);
  }
  assert.fail(`Unsupported image format: ${filePath}`);
}

const families = [
  ['executive-snapshot-hero', 'desktop', 2560, 960],
  ['executive-snapshot-hero', 'tablet', 1600, 1200],
  ['executive-snapshot-hero', 'mobile', 960, 1280],
  ['homepage-hero-v2', 'desktop', 1536, 1024],
  ['homepage-hero-v2', 'tablet', 1600, 1200],
  ['homepage-hero-v2', 'mobile', 960, 1280],
  ['homepage-hero-v2.1', 'desktop', 1536, 1024],
  ['homepage-hero-v2.1', 'tablet', 1600, 1200],
  ['homepage-hero-v2.1', 'mobile', 960, 1280],
  ['homepage-hero-v2.2', 'desktop', 1536, 1024],
  ['homepage-hero-v2.2', 'tablet', 1600, 1200],
  ['homepage-hero-v2.2', 'mobile', 960, 1280],
  ['eastland-product-family', 'desktop', 2400, 1244],
  ['eastland-product-family', 'tablet', 1600, 957],
  ['eastland-product-family', 'mobile', 960, 757]
];

const files = fs.readdirSync(homepageAssets).sort();
const productionFiles = files.filter((file) =>
  !file.startsWith('homepage-hero-v2-desktop-proof.') && file !== 'brian-smiling-portrait.png'
);
assert.equal(productionFiles.filter(f => !['rh-monogram-mask.png', 'rh-original-gold-frame.png'].includes(f)).length, 46, 'homepage production directory must contain exactly 45 preserved production derivatives and the approved smiling founder portrait');
assert.ok(productionFiles.includes('brian-smiling-portrait.webp'));
assert.deepEqual(imageDimensions(path.join(homepageAssets, 'brian-smiling-portrait.webp')), [1040, 1300]);
for (const [family, viewport] of families) {
  for (const extension of ['avif', 'webp', 'jpg']) {
    const asset = `${family}-${viewport}.${extension}`;
    assert.ok(files.includes(asset), `missing homepage production derivative: ${asset}`);
    assert.ok(fs.statSync(path.join(homepageAssets, asset)).size > 0, `${asset} must not be empty`);
  }
}

const heroV22Dimensions = {
  desktop: [3840, 2560],
  tablet: [1600, 1200],
  mobile: [960, 1280]
};
for (const [viewport, expectedDimensions] of Object.entries(heroV22Dimensions)) {
  for (const extension of ['avif', 'webp', 'jpg']) {
    const asset = path.join(homepageAssets, `homepage-hero-v2.2-${viewport}.${extension}`);
    assert.deepEqual(imageDimensions(asset), expectedDimensions, `unexpected V2.2 ${viewport} ${extension} dimensions`);
  }
}


const snapshot=fs.readFileSync(path.join(root,'business-snapshot/index.html'),'utf8');
assert.doesNotMatch(html, /<figure class="snapshot-brief"/,'sample is secondary detail, not homepage proof');
assert.equal((snapshot.match(/<figure class="snapshot-brief"/g)||[]).length,1);
assert.match(snapshot,/North Point Fitness is a fictional business/);
assert.match(snapshot,/href="..\/assets\/samples\/north-point-fitness-executive-brief\.pdf"/);
for(const [page,asset] of [[html,'eastland-live-home.jpg'],[work,'eastland-live-mobile-services.png'],[fs.readFileSync(path.join(root,'website-creation/index.html'),'utf8'),'eastland-live-home.jpg']]) {
 assert.ok(page.includes(asset));assert.doesNotMatch(page,/eastland-product-family/);
}
assert.match(html,/Actual dashboard · Private business data and operational details redacted/);
assert.match(work,/Private business data and operational details redacted/);
assert.match(html,/I’m Brian Keith Rogers/);
assert.match(html,/My faith shapes how I work: be honest, help where I can and follow through/);
assert.doesNotMatch(html, /data-rh-sculpture|listening-hero|<canvas/);
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
assert.equal(hash(eastlandReference),'516d0b764d82f2ac1b451ca0194602da2abe7e3e57ea94d9218d1dde693acb62');
assert.equal(hash(homepageHeroV22Source),'08c20db2826dfb06cdbd5b52d5ec49e2915d072c90e8e746919f57089ea3a4cb');
console.log('Visual proof disclosure, original source preservation and asset contracts passed');
