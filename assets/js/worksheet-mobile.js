document.addEventListener('click', event => {
  const jump = event.target.closest('[data-worksheet-jump]');
  if (!jump) return;
  const scroll = jump.parentElement.nextElementSibling;
  const edit = scroll?.querySelector('tbody input:not([disabled]):not([readonly]), tbody select:not([disabled])');
  if (!edit) return;
  if (event.detail === 0) edit.focus({ preventScroll: true });
  edit.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
});

// This phone editor borrows the worksheet's actual controls and change handlers.
function addPhoneWorksheetEditor() {
  const access = document.querySelector('.worksheet-mobile-access');
  const sheet = access?.nextElementSibling;
  if (!sheet?.classList.contains('worksheet-scroll')) return;
  const template = document.createElement('template');
  template.innerHTML = '<section class="worksheet-quick-edit" aria-label="Quick edit"><strong>Quick edit</strong><label>Choose a sample cell<select data-pick></select></label><label data-value hidden>New value<span></span></label><button type="button" hidden>Apply to sample</button><p data-result hidden></p></section>';
  const panel = template.content.firstElementChild;
  access.before(panel);
  const pick = panel.querySelector('[data-pick]');
  const field = panel.querySelector('[data-value]');
  const slot = field.querySelector('span');
  const apply = panel.querySelector('button');
  const result = panel.querySelector('[data-result]');
  const controls = () => [...sheet.querySelectorAll('tbody :is(input:not([readonly]),select):not([disabled])[aria-label]')];
  const lookup = () => controls().find(el => el.getAttribute('aria-label') === pick.value);
  function show() {
    const original = lookup();
    field.hidden = apply.hidden = !original;
    slot.replaceChildren();
    if (!original) return;
    const edit = original.cloneNode(true);
    edit.removeAttribute('id');
    edit.removeAttribute('name');
    edit.removeAttribute('aria-label');
    edit.removeAttribute('aria-invalid');
    edit.value = original.value;
    slot.append(edit);
  }
  function refresh() {
    const last = pick.value;
    pick.replaceChildren(new Option('Select a sample cell', ''), ...controls().map(el => {
      const name = el.getAttribute('aria-label');
      return new Option(name, name);
    }));
    if (lookupLabel(last)) pick.value = last;
    show();
  }
  function lookupLabel(name) { return [...pick.options].some(option => option.value === name); }
  pick.addEventListener('change', () => { result.hidden = true; show(); });
  apply.addEventListener('click', () => {
    const original = lookup();
    const edit = slot.firstElementChild;
    if (!original || !edit || !edit.reportValidity()) return;
    if (edit.value === original.value) return;
    original.value = edit.value;
    original.dispatchEvent(new Event('change', { bubbles: true }));
    if (original.getAttribute('aria-invalid') === 'true') {
      edit.setCustomValidity(document.querySelector('#demo-feedback')?.textContent.trim() || 'Check this value.');
      edit.reportValidity();
      edit.addEventListener('input', () => edit.setCustomValidity(''), { once: true });
      return;
    }
    result.textContent = document.querySelector('#demo-feedback')?.textContent.trim() || 'Sample updated.';
    result.hidden = false;
  });
  document.querySelector('#reset-demo')?.addEventListener('click', () => { result.hidden = true; });
  document.querySelector('#view-filter')?.addEventListener('change', () => { result.hidden = true; });
  const rows = sheet.querySelector('tbody');
  if (rows) new MutationObserver(refresh).observe(rows, { childList: true });
  refresh();
}

addPhoneWorksheetEditor();
