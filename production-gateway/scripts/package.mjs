import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'dist');
const FILES = ['package.json', 'src/worker.js', 'wrangler.jsonc'];

function hash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function assertInsideRoot(target) {
  const relative = path.relative(ROOT, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Package destination escapes the production gateway.');
  }
}

assertInsideRoot(OUTPUT);
fs.rmSync(OUTPUT, { recursive: true, force: true });
for (const name of FILES) {
  const source = path.join(ROOT, name);
  const destination = path.join(OUTPUT, name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

const inventory = FILES.map((name) => {
  const contents = fs.readFileSync(path.join(OUTPUT, name));
  return `${hash(contents)}  ${name}`;
}).join('\n') + '\n';
fs.writeFileSync(path.join(OUTPUT, 'PACKAGE_HASHES.sha256'), inventory, {
  encoding: 'utf8',
  mode: 0o600
});

process.stdout.write(`Packaged ${FILES.length} production gateway files.\n`);
