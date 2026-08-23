import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY_ROOT = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));
export const OUTPUT_ROOT = path.join(REPOSITORY_ROOT, '_site');
export const PRODUCTION_ORIGIN = 'https://rogersholdingsllc.com';

export const PUBLIC_MANIFEST = Object.freeze([
  'CNAME',
  'apple-touch-icon.png',
  'assets/css/digital-business-card.css',
  'assets/css/hew-gates-garage.css',
  'assets/css/site.css',
  'assets/images/brand/rogers-holdings-logo-reversed.png',
  'assets/images/brand/rogers-holdings-logo.png',
  'assets/images/digital-business-card/brian-keith-rogers.jpg',
  'assets/images/homepage/eastland-product-family-desktop.avif',
  'assets/images/homepage/eastland-product-family-desktop.jpg',
  'assets/images/homepage/eastland-product-family-desktop.webp',
  'assets/images/homepage/eastland-product-family-mobile.avif',
  'assets/images/homepage/eastland-product-family-mobile.jpg',
  'assets/images/homepage/eastland-product-family-mobile.webp',
  'assets/images/homepage/eastland-product-family-tablet.avif',
  'assets/images/homepage/eastland-product-family-tablet.jpg',
  'assets/images/homepage/eastland-product-family-tablet.webp',
  'assets/images/homepage/homepage-hero-v2.2-desktop.avif',
  'assets/images/homepage/homepage-hero-v2.2-desktop.jpg',
  'assets/images/homepage/homepage-hero-v2.2-desktop.webp',
  'assets/images/homepage/homepage-hero-v2.2-mobile.avif',
  'assets/images/homepage/homepage-hero-v2.2-mobile.jpg',
  'assets/images/homepage/homepage-hero-v2.2-mobile.webp',
  'assets/images/homepage/homepage-hero-v2.2-tablet.avif',
  'assets/images/homepage/homepage-hero-v2.2-tablet.jpg',
  'assets/images/homepage/homepage-hero-v2.2-tablet.webp',
  'assets/images/hew-gates-garage/hew-farm-gate-garage-hero-1000.jpg',
  'assets/images/hew-gates-garage/hew-farm-gate-garage-hero.jpg',
  'assets/images/hew-gates-garage/hew-apple-touch-icon.png',
  'assets/images/hew-gates-garage/hew-favicon-64.png',
  'assets/images/hew-gates-garage/hew-favicon.svg',
  'assets/images/hew-gates-garage/hew-gates-garage-logo-v2-600.png',
  'assets/images/hew-gates-garage/hew-gates-garage-logo-v2.png',
  'assets/images/hew-gates-garage/hew-portfolio-preview.jpg',
  'assets/images/social/business-snapshot-share.jpg',
  'assets/images/social/rogers-holdings-home-share.jpg',
  'assets/js/digital-business-card.js',
  'assets/js/hew-gates-garage.js',
  'assets/js/site.js',
  'brand-card.jpeg',
  'brian/brian-keith-rogers.vcf',
  'brian/index.html',
  'business-snapshot/index.html',
  'docs/design-reference/founder/brian-keith-rogers-headshot-original.png',
  'favicon.ico',
  'favicon.png',
  'google914083dd95ef8b05.html',
  'hew-gates-garage/index.html',
  'index.html',
  'privacy/index.html',
  'robots.txt',
  'sitemap.xml'
].sort());

const MANIFEST_SET = new Set(PUBLIC_MANIFEST);
const EXPECTED_DIRECTORIES = new Set(['']);
for (const relativePath of PUBLIC_MANIFEST) {
  const segments = relativePath.split('/');
  for (let index = 1; index < segments.length; index += 1) {
    EXPECTED_DIRECTORIES.add(segments.slice(0, index).join('/'));
  }
}

function fail(message) {
  throw new Error(`Public artifact boundary: ${message}`);
}

export function resolveInside(root, relativePath) {
  if (typeof relativePath !== 'string' || !relativePath) fail('path must be a non-empty string');
  if (relativePath.includes('\\')) fail(`backslash path is not allowed: ${relativePath}`);
  if (path.posix.isAbsolute(relativePath)) fail(`absolute path is not allowed: ${relativePath}`);
  const normalized = path.posix.normalize(relativePath);
  if (normalized !== relativePath || normalized === '..' || normalized.startsWith('../')) {
    fail(`path traversal is not allowed: ${relativePath}`);
  }
  const resolved = path.resolve(root, ...relativePath.split('/'));
  const boundary = `${path.resolve(root)}${path.sep}`;
  if (!resolved.startsWith(boundary)) fail(`path resolves outside its root: ${relativePath}`);
  return resolved;
}

function assertNoSymlinkComponents(root, relativePath) {
  let current = path.resolve(root);
  for (const segment of relativePath.split('/')) {
    current = path.join(current, segment);
    let entry;
    try {
      entry = fs.lstatSync(current);
    } catch (error) {
      if (error?.code === 'ENOENT') fail(`missing allowlisted file: ${relativePath}`);
      throw error;
    }
    if (entry.isSymbolicLink()) fail(`symbolic link is not allowed: ${relativePath}`);
  }
}

export function assertSafeRegularFile(root, relativePath) {
  const absolutePath = resolveInside(root, relativePath);
  assertNoSymlinkComponents(root, relativePath);
  const entry = fs.lstatSync(absolutePath);
  if (!entry.isFile()) fail(`allowlisted path is not a regular file: ${relativePath}`);
  if (entry.nlink !== 1) fail(`hard-linked file is not allowed: ${relativePath}`);
  const canonicalRoot = fs.realpathSync(root);
  const canonicalFile = fs.realpathSync(absolutePath);
  if (!canonicalFile.startsWith(`${canonicalRoot}${path.sep}`)) {
    fail(`file resolves outside the repository: ${relativePath}`);
  }
  return absolutePath;
}

function decodeHtmlReference(value) {
  return value.replaceAll('&amp;', '&').trim();
}

export function referenceToManifestPath(sourceRelativePath, rawReference) {
  const reference = decodeHtmlReference(rawReference);
  if (!reference || reference.startsWith('#')) return null;
  if (/^(?:mailto|tel|data|javascript):/i.test(reference)) return null;

  let url;
  try {
    const sourceUrl = new URL(sourceRelativePath, `${PRODUCTION_ORIGIN}/`);
    url = new URL(reference, sourceUrl);
  } catch {
    fail(`invalid reference in ${sourceRelativePath}: ${rawReference}`);
  }
  if (url.origin !== PRODUCTION_ORIGIN) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    fail(`invalid encoded path in ${sourceRelativePath}: ${rawReference}`);
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const relativePath = pathname.replace(/^\/+/, '');
  resolveInside(REPOSITORY_ROOT, relativePath);
  return relativePath;
}

function collectJsonLdReferences(value, references) {
  if (typeof value === 'string') {
    if (value.startsWith(`${PRODUCTION_ORIGIN}/`) || value === PRODUCTION_ORIGIN) references.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonLdReferences(item, references));
    return;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectJsonLdReferences(item, references));
  }
}

export function collectHtmlDependencies(sourceRelativePath, html) {
  const references = new Set();
  const attributePattern = /(?:^|\s)(src|href|action|poster|content)\s*=\s*(["'])(.*?)\2/gis;
  for (const match of html.matchAll(attributePattern)) {
    const [, attribute, , value] = match;
    if (
      attribute.toLowerCase() === 'content'
      && !/^(?:https?:\/\/|\/|\.\.?\/)/i.test(value.trim())
    ) continue;
    references.add(value);
  }
  const srcsetPattern = /\bsrcset\s*=\s*(["'])(.*?)\1/gis;
  for (const match of html.matchAll(srcsetPattern)) {
    for (const candidate of match[2].split(',')) {
      const value = candidate.trim().split(/\s+/)[0];
      if (value) references.add(value);
    }
  }
  const jsonLdPattern = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(jsonLdPattern)) {
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch {
      fail(`invalid JSON-LD in ${sourceRelativePath}`);
    }
    collectJsonLdReferences(parsed, references);
  }

  return [...references]
    .map((reference) => referenceToManifestPath(sourceRelativePath, reference))
    .filter(Boolean);
}

export function collectCssDependencies(sourceRelativePath, css) {
  const dependencies = [];
  const pattern = /url\(\s*(["']?)(.*?)\1\s*\)/gi;
  for (const match of css.matchAll(pattern)) {
    const dependency = referenceToManifestPath(sourceRelativePath, match[2]);
    if (dependency) dependencies.push(dependency);
  }
  return dependencies;
}

export function assertDependencyAllowed(sourceRelativePath, rawReference) {
  const dependency = referenceToManifestPath(sourceRelativePath, rawReference);
  if (dependency && !MANIFEST_SET.has(dependency)) {
    fail(`local dependency is not allowlisted (${sourceRelativePath} -> ${dependency})`);
  }
  return dependency;
}

export function validateSourceBoundary() {
  for (const relativePath of PUBLIC_MANIFEST) {
    assertSafeRegularFile(REPOSITORY_ROOT, relativePath);
  }

  for (const relativePath of PUBLIC_MANIFEST.filter((entry) => entry.endsWith('.html'))) {
    const html = fs.readFileSync(resolveInside(REPOSITORY_ROOT, relativePath), 'utf8');
    for (const dependency of collectHtmlDependencies(relativePath, html)) {
      if (!MANIFEST_SET.has(dependency)) {
        fail(`local page dependency is not allowlisted (${relativePath} -> ${dependency})`);
      }
      assertSafeRegularFile(REPOSITORY_ROOT, dependency);
    }
  }

  for (const relativePath of PUBLIC_MANIFEST.filter((entry) => entry.endsWith('.css'))) {
    const css = fs.readFileSync(resolveInside(REPOSITORY_ROOT, relativePath), 'utf8');
    for (const dependency of collectCssDependencies(relativePath, css)) {
      if (!MANIFEST_SET.has(dependency)) {
        fail(`local stylesheet dependency is not allowlisted (${relativePath} -> ${dependency})`);
      }
      assertSafeRegularFile(REPOSITORY_ROOT, dependency);
    }
  }

  const sitemap = fs.readFileSync(resolveInside(REPOSITORY_ROOT, 'sitemap.xml'), 'utf8');
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const dependency = referenceToManifestPath('sitemap.xml', match[1]);
    if (!dependency || !MANIFEST_SET.has(dependency)) {
      fail(`sitemap URL is not an allowlisted route: ${match[1]}`);
    }
  }
}

function walkOutput(relativeDirectory = '') {
  const directory = relativeDirectory
    ? resolveInside(OUTPUT_ROOT, relativeDirectory)
    : OUTPUT_ROOT;
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
    const absolutePath = resolveInside(OUTPUT_ROOT, relativePath);
    const metadata = fs.lstatSync(absolutePath);
    if (metadata.isSymbolicLink()) fail(`symbolic link found in output: ${relativePath}`);
    if (metadata.isDirectory()) {
      if (!EXPECTED_DIRECTORIES.has(relativePath)) fail(`unexpected output directory: ${relativePath}`);
      files.push(...walkOutput(relativePath));
      continue;
    }
    if (!metadata.isFile()) fail(`non-file output entry: ${relativePath}`);
    if (metadata.nlink !== 1) fail(`hard-linked output file: ${relativePath}`);
    if (!MANIFEST_SET.has(relativePath)) fail(`unexpected output file: ${relativePath}`);
    files.push(relativePath);
  }
  return files;
}

function validateExistingOutputBeforeCleanup() {
  if (!fs.existsSync(OUTPUT_ROOT)) return;
  const rootMetadata = fs.lstatSync(OUTPUT_ROOT);
  if (rootMetadata.isSymbolicLink() || !rootMetadata.isDirectory()) {
    fail('_site must be a real directory');
  }
  walkOutput();
}

export function validatePublicArtifact() {
  if (!fs.existsSync(OUTPUT_ROOT)) fail('_site does not exist');
  const actualFiles = walkOutput().sort();
  if (actualFiles.length !== PUBLIC_MANIFEST.length) {
    fail(`output file count mismatch: expected ${PUBLIC_MANIFEST.length}, found ${actualFiles.length}`);
  }
  for (let index = 0; index < PUBLIC_MANIFEST.length; index += 1) {
    if (actualFiles[index] !== PUBLIC_MANIFEST[index]) {
      fail(`output manifest mismatch: expected ${PUBLIC_MANIFEST[index]}, found ${actualFiles[index] || '(missing)'}`);
    }
    const source = assertSafeRegularFile(REPOSITORY_ROOT, PUBLIC_MANIFEST[index]);
    const output = assertSafeRegularFile(OUTPUT_ROOT, PUBLIC_MANIFEST[index]);
    if (!fs.readFileSync(source).equals(fs.readFileSync(output))) {
      fail(`output differs from source: ${PUBLIC_MANIFEST[index]}`);
    }
  }
  return actualFiles;
}

export function buildPublicArtifact() {
  validateSourceBoundary();
  validateExistingOutputBeforeCleanup();

  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_ROOT, { recursive: false });
  for (const relativePath of PUBLIC_MANIFEST) {
    const source = assertSafeRegularFile(REPOSITORY_ROOT, relativePath);
    const output = resolveInside(OUTPUT_ROOT, relativePath);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL);
  }
  return validatePublicArtifact();
}
