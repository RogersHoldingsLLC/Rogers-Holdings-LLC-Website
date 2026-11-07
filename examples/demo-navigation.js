/* Progressive navigation: links remain available without JavaScript. No tracking or storage. */
(() => {
  const header = document.querySelector('[data-demo-header]');
  const toggle = header?.querySelector('[data-menu-toggle]');
  const nav = header?.querySelector('[data-site-nav]');
  if (!header || !toggle || !nav) return;
  const mobile = matchMedia('(max-width: 760px)');
  header.setAttribute('data-enhanced', '');
  toggle.hidden = false;
  function close(restoreFocus = false) {
    header.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.firstChild.textContent = 'Menu ';
    if (restoreFocus) toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => {
    const open = !header.hasAttribute('data-open');
    header.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstChild.textContent = open ? 'Close ' : 'Menu ';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.hasAttribute('data-open')) {
      e.preventDefault(); close(true);
    }
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) close();
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('href') === '#') return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    close();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  header.addEventListener('focusout', e => {
    if (!header.contains(e.relatedTarget)) close();
  });
  mobile.addEventListener('change', () => close(nav.contains(document.activeElement) && mobile.matches));
  window.addEventListener('pageshow', () => close());
  window.addEventListener('hashchange', () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.hasAttribute('tabindex')) target.focus({ preventScroll: true });
  });
})();
