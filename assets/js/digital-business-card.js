(() => {
  'use strict';

  const shareButton = document.querySelector('[data-share]');
  const status = document.querySelector('[data-share-status]');
  const canonical = document.querySelector('link[rel="canonical"]');

  if (!shareButton || !status) return;

  const canonicalUrl = canonical?.href || window.location.href;
  const shareData = {
    title: 'Brian Keith Rogers | Rogers Holdings LLC',
    text: 'Connect with Brian Keith Rogers, Founder of Rogers Holdings LLC.',
    url: canonicalUrl
  };

  function announce(message) {
    status.textContent = '';
    window.setTimeout(() => {
      status.textContent = message;
    }, 40);
  }

  async function copyCanonicalUrl() {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(canonicalUrl);
      return;
    }

    const copyField = document.createElement('textarea');
    copyField.value = canonicalUrl;
    copyField.setAttribute('readonly', '');
    copyField.style.position = 'fixed';
    copyField.style.opacity = '0';
    document.body.appendChild(copyField);
    copyField.select();
    const copied = document.execCommand('copy');
    copyField.remove();
    if (!copied) throw new Error('Copy command was not available.');
  }

  shareButton.addEventListener('click', async () => {
    shareButton.disabled = true;

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
        announce('Business card shared.');
      } else {
        await copyCanonicalUrl();
        announce('Link copied to your clipboard.');
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        announce('Sharing canceled.');
      } else {
        try {
          await copyCanonicalUrl();
          announce('Sharing was unavailable. Link copied to your clipboard.');
        } catch {
          announce(`Could not share automatically. Copy this address: ${canonicalUrl}`);
        }
      }
    } finally {
      shareButton.disabled = false;
    }
  });
})();
