// Injected only by the local QA server. No real network submissions are possible.
const scenario = new URL(location.href).searchParams.get('scenario') || 'success';
window.__snapshotQA = { requests: [], resets: 0, errors: [], resolve: null };
window.addEventListener('error', e => window.__snapshotQA.errors.push(e.message));
window.addEventListener('unhandledrejection', e => window.__snapshotQA.errors.push(String(e.reason)));
window.turnstile = { render() { return 'fixture-widget'; }, reset() { window.__snapshotQA.resets++; } };
window.fetch = async (url, options = {}) => {
  if (options.method !== 'POST') throw new Error('Unexpected fixture fetch');
  const payload = JSON.parse(options.body);
  window.__snapshotQA.requests.push({url, payload});
  if (scenario === 'network') throw new TypeError('Mock network failure');
  if (scenario === 'timeout') { const e = new Error('Mock timeout'); e.name = 'AbortError'; throw e; }
  if (scenario === 'pending') await new Promise(resolve => { window.__snapshotQA.resolve = resolve; });
  const body = scenario === 'rejected' ? {ok:false,code:'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE'}
    : scenario === 'malformed' ? {ok:true}
    : {ok:true,environment:'production',requestId:payload.requestId,retry:false};
  return new Response(JSON.stringify(body), {status:scenario==='rejected'?503:200,headers:{'content-type':'application/json'}});
};
