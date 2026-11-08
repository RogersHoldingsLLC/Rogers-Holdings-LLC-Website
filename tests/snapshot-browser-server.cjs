// Local-only QA server. Never deploy: all production files come from the built _site.
// CSP blocks external analytics, Turnstile, intake, and form navigation.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const built = path.join(root, '_site');
const mime = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp', '.avif':'image/avif', '.pdf':'application/pdf', '.ico':'image/x-icon'};
const csp = "default-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'self'; form-action 'none'; object-src 'none'";
http.createServer((req,res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.writeHead(405); return res.end('QA server never accepts submissions'); }
  if (url.pathname === '/__qa/bootstrap.js') {
    res.setHeader('Content-Type', 'text/javascript');
    return res.end(fs.readFileSync(path.join(root,'tests/snapshot-browser-bootstrap.js')));
  }
  if (url.pathname === '/__qa/snapshot/') {
    let html = fs.readFileSync(path.join(built,'business-snapshot/index.html'),'utf8');
    html = html.replace('<head>', '<head><base href="/business-snapshot/"><script src="/__qa/bootstrap.js"></script>');
    res.setHeader('Content-Type','text/html'); return res.end(html);
  }
  const testPages = ['/tests/snapshot-analytics-browser.html','/tests/disclosure-browser.html','/tests/our-work-menu-browser.html'];
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') + (url.pathname.endsWith('/') ? 'index.html' : '');
  const base = testPages.includes(url.pathname) ? root : built;
  const file = path.resolve(base, relative);
  if (!file.startsWith(base+path.sep)) { res.writeHead(403); return res.end(); }
  try { res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream'); res.end(fs.readFileSync(file)); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(4278, '127.0.0.1', () => console.log('Isolated built-site QA at http://127.0.0.1:4278/tests/snapshot-analytics-browser.html'));
