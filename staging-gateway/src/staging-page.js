const HTML_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'none'",
    "script-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "connect-src 'self' https://challenges.cloudflare.com",
    "style-src 'unsafe-inline'",
    "form-action 'self'",
    "base-uri 'none'",
    "frame-ancestors 'none'"
  ].join('; ')
};

function escapeAttribute(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function stagingPage(siteKey) {
  const safeSiteKey = escapeAttribute(siteKey);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>NON_PRODUCTION Business Snapshot Transport</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <script src="/staging.js" defer></script>
  <style>
    :root{font-family:system-ui,sans-serif;color:#17201f;background:#f4f1e9}
    body{margin:0;padding:32px}main{max-width:760px;margin:auto;background:white;padding:32px;border:1px solid #b9af93}
    h1{margin-top:0}.marker{color:#8b2e1f;font-weight:800;letter-spacing:.08em}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    label{display:grid;gap:6px;font-weight:650}.full{grid-column:1/-1}input,textarea{font:inherit;padding:10px;border:1px solid #817968}
    button{font:inherit;font-weight:750;padding:12px 18px;background:#17201f;color:white;border:0}button:disabled{opacity:.55}
    pre{white-space:pre-wrap;background:#eee9de;padding:16px;min-height:44px}@media(max-width:640px){body{padding:12px}main{padding:20px}.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
<main>
  <p class="marker">NON_PRODUCTION · SYNTHETIC DATA ONLY</p>
  <h1>Business Snapshot staging transport</h1>
  <p>This isolated page validates the production-style gateway path. Do not enter real client information.</p>
  <form id="snapshot-form">
    <div class="grid">
      <label>Full name<input name="fullName" maxlength="120" required value="NONPROD Phase D Contact"></label>
      <label>Business name<input name="businessName" maxlength="140" required></label>
      <label>Email<input name="email" type="email" maxlength="254" required></label>
      <label>Phone<input name="phone" maxlength="30" value="+1-555-0168"></label>
      <label class="full">Website<input name="website" type="url" maxlength="2048" value="https://example.invalid/phase-d"></label>
      <label class="full">Primary challenge<textarea name="primaryChallenge" minlength="20" maxlength="2000" required>NONPROD synthetic staging transport validation only.</textarea></label>
      <div class="full cf-turnstile" data-sitekey="${safeSiteKey}" data-action="business_snapshot"></div>
      <button id="submit" class="full" type="submit">Submit NON_PRODUCTION request</button>
    </div>
  </form>
  <pre id="result" role="status" aria-live="polite"></pre>
</main>
</body>
</html>`;
  return new Response(html, { status: 200, headers: HTML_HEADERS });
}

export function stagingScript() {
  const script = `(() => {
  const form = document.getElementById('snapshot-form');
  const result = document.getElementById('result');
  const submit = document.getElementById('submit');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    result.textContent = 'Submitting…';
    const values = new FormData(form);
    const payload = {
      schemaVersion: 'business-snapshot.v1',
      requestId: crypto.randomUUID(),
      fullName: values.get('fullName'),
      businessName: values.get('businessName'),
      email: values.get('email'),
      phone: values.get('phone') || '',
      website: values.get('website') || '',
      primaryChallenge: values.get('primaryChallenge'),
      consent: 'business-snapshot-contact-consent-v1',
      turnstileToken: values.get('cf-turnstile-response')
    };
    try {
      const response = await fetch('/api/business-snapshot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        credentials: 'omit',
        redirect: 'error'
      });
      const type = response.headers.get('content-type') || '';
      if (!type.toLowerCase().startsWith('application/json')) throw new Error('Gateway returned a non-JSON response.');
      const body = await response.json();
      result.textContent = JSON.stringify({status: response.status, body}, null, 2);
      if (window.turnstile) window.turnstile.reset();
    } catch {
      result.textContent = JSON.stringify({ok:false,environment:'NON_PRODUCTION',code:'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE',message:'The staging service is temporarily unavailable.'}, null, 2);
    } finally {
      submit.disabled = false;
    }
  });
})();`;
  return new Response(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
