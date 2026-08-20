import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');

const html = read('brian/index.html');
const css = read('assets/css/digital-business-card.css');
const javascript = read('assets/js/digital-business-card.js');
const vcard = read('brian/brian-keith-rogers.vcf');
const headshot = fs.readFileSync(path.join(repositoryRoot, 'assets/images/digital-business-card/brian-keith-rogers.jpg'));
const canonicalUrl = 'https://rogersholdingsllc.com/brian/';

for (const content of [
  'Brian Keith Rogers',
  'Founder · Rogers Holdings LLC',
  'briankeith@rogersholdingsllc.com',
  '859-404-7300',
  'I help small and growing businesses use better websites, automation, AI, and practical systems to save time and grow.'
]) assert.ok(html.includes(content), `card is missing locked content: ${content}`);

for (const action of ['Save Contact', 'Call', 'Text', 'Email', 'Visit Website', 'Share']) {
  assert.ok(html.includes(`<span>${action}</span>`), `card is missing action: ${action}`);
}

assert.match(html, /href="brian-keith-rogers\.vcf" download/);
assert.match(html, /href="tel:\+18594047300"/);
assert.match(html, /href="sms:\+18594047300"/);
assert.match(html, /href="mailto:briankeith@rogersholdingsllc\.com"/);
assert.match(html, /href="https:\/\/rogersholdingsllc\.com\/"/);
assert.match(html, /<button class="action" type="button" data-share>/);
assert.match(html, /role="status" aria-live="polite" aria-atomic="true" data-share-status/);
assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalUrl.replaceAll('/', '\\/')}">`));
assert.match(html, /<meta property="og:type" content="profile">/);
assert.match(html, /<meta property="og:image" content="https:\/\/rogersholdingsllc\.com\/assets\/images\/digital-business-card\/brian-keith-rogers\.jpg">/);
assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0, viewport-fit=cover">/);
assert.doesNotMatch(html, /<form\b/i);
assert.doesNotMatch(html, /googletagmanager|google-analytics|fonts\.(?:googleapis|gstatic)|<iframe\b/i);

const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(jsonLdMatch, 'Person JSON-LD is required');
const person = JSON.parse(jsonLdMatch[1]);
assert.equal(person['@type'], 'Person');
assert.equal(person.name, 'Brian Keith Rogers');
assert.equal(person.jobTitle, 'Founder');
assert.equal(person.email, 'mailto:briankeith@rogersholdingsllc.com');
assert.equal(person.telephone, '+1-859-404-7300');
assert.equal(person.worksFor.name, 'Rogers Holdings LLC');

assert.match(css, /:focus-visible/);
assert.match(css, /min-height: 52px/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.doesNotMatch(css, /@import|https?:\/\//i);

assert.match(vcard, /^BEGIN:VCARD\r\nVERSION:3\.0\r\n/, 'vCard 3.0 is required');
assert.ok(vcard.includes('\r\n'), 'vCard must use CRLF line separators');
assert.doesNotMatch(vcard, /(?<!\r)\n/, 'vCard must not contain bare LF separators');
assert.doesNotMatch(vcard, /\r(?!\n)/, 'vCard must not contain bare CR separators');

for (const requiredLine of [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Rogers;Brian Keith;;;',
  'FN:Brian Keith Rogers',
  'ORG:Rogers Holdings LLC',
  'TITLE:Founder',
  'EMAIL;TYPE=INTERNET,WORK:briankeith@rogersholdingsllc.com',
  'TEL;TYPE=CELL,VOICE:+18594047300',
  'URL:https://rogersholdingsllc.com/',
  'END:VCARD'
]) assert.ok(vcard.split('\r\n').includes(requiredLine), `vCard is missing: ${requiredLine}`);

const unfoldedVcardLines = vcard.replace(/\r\n[ \t]/g, '').split('\r\n');
const photoProperty = unfoldedVcardLines.find((line) => line.startsWith('PHOTO;ENCODING=b;TYPE=JPEG:'));
assert.ok(photoProperty, 'vCard must include an embedded JPEG contact photo');
const embeddedPhoto = Buffer.from(photoProperty.slice(photoProperty.indexOf(':') + 1), 'base64');
assert.deepEqual(embeddedPhoto, headshot, 'embedded vCard photo must match the digital-card headshot');

function jpegDimensions(bytes) {
  assert.equal(bytes.readUInt16BE(0), 0xffd8, 'headshot must be a JPEG');
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error('invalid JPEG marker');
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) break;
    const segmentLength = bytes.readUInt16BE(offset);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5)
      };
    }
    offset += segmentLength;
  }
  throw new Error('JPEG dimensions were not found');
}

assert.deepEqual(jpegDimensions(headshot), { width: 576, height: 720 });
assert.ok(headshot.length > 0 && headshot.length < 150_000, 'headshot should be a reasonably sized web JPEG');

async function runShareScenario({ nativeShare, clipboard, secure = true, execCommand = true }) {
  let clickHandler;
  let sharedData;
  let copiedText;
  let appendedField;
  const shareButton = {
    disabled: false,
    addEventListener(type, handler) {
      assert.equal(type, 'click');
      clickHandler = handler;
    }
  };
  const status = { textContent: '' };
  const copyField = {
    value: '',
    style: {},
    setAttribute() {},
    select() {},
    remove() { appendedField = undefined; }
  };
  const navigator = {};
  if (nativeShare) {
    navigator.share = async (data) => {
      sharedData = data;
      return nativeShare(data);
    };
  }
  if (clipboard) {
    navigator.clipboard = {
      async writeText(value) {
        copiedText = value;
        return clipboard(value);
      }
    };
  }
  const document = {
    querySelector(selector) {
      if (selector === '[data-share]') return shareButton;
      if (selector === '[data-share-status]') return status;
      if (selector === 'link[rel="canonical"]') return { href: canonicalUrl };
      return null;
    },
    createElement(tagName) {
      assert.equal(tagName, 'textarea');
      return copyField;
    },
    execCommand(command) {
      assert.equal(command, 'copy');
      copiedText = appendedField?.value;
      return execCommand;
    },
    body: {
      appendChild(field) {
        appendedField = field;
      }
    }
  };
  const window = {
    isSecureContext: secure,
    location: { href: 'https://example.invalid/fallback' },
    setTimeout(callback) { callback(); }
  };

  vm.runInNewContext(javascript, { document, navigator, window, Error });
  assert.equal(typeof clickHandler, 'function', 'share handler was not registered');
  await clickHandler();
  assert.equal(shareButton.disabled, false, 'share button must be re-enabled');
  return { copiedText, sharedData, status: status.textContent };
}

const nativeResult = await runShareScenario({ nativeShare: async () => {} });
assert.equal(nativeResult.sharedData.url, canonicalUrl);
assert.equal(nativeResult.copiedText, undefined);
assert.equal(nativeResult.status, 'Business card shared.');

const clipboardResult = await runShareScenario({ clipboard: async () => {} });
assert.equal(clipboardResult.copiedText, canonicalUrl);
assert.equal(clipboardResult.status, 'Link copied to your clipboard.');

const fallbackResult = await runShareScenario({
  nativeShare: async () => { throw new Error('share failed'); },
  clipboard: async () => {}
});
assert.equal(fallbackResult.copiedText, canonicalUrl);
assert.equal(fallbackResult.status, 'Sharing was unavailable. Link copied to your clipboard.');

console.log('Digital business card tests passed.');
