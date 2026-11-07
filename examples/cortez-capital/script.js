/* A progressively enhanced, keyboard-operable concept index. No forms or network calls. */
(() => {
  const header = document.querySelector('[data-demo-header]');
  const syncHeader = () => header?.toggleAttribute('data-scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
  const explorer = document.querySelector('[data-focus-explorer]');
  if (!explorer) return;
  const controls = explorer.querySelector('[data-focus-tabs]');
  const tabs = [...controls.querySelectorAll('button')];
  const panels = [...explorer.querySelectorAll('[data-focus-panel]')];
  controls.setAttribute('role', 'tablist');
  controls.setAttribute('aria-orientation', 'vertical');
  explorer.querySelector('.focus-panels').setAttribute('data-enhanced', '');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', e => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) next = (index + 1) % tabs.length;
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) next = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); select(next); tabs[next].focus(); }
    });
  });
  function select(index) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  }
  select(0);
  controls.hidden = false;
})();
