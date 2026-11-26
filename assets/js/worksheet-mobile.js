document.addEventListener('click', event => {
  const jump = event.target.closest('[data-worksheet-jump]');
  if (!jump) return;
  const scroll = jump.parentElement.nextElementSibling;
  const edit = scroll?.querySelector('tbody input:not([disabled]):not([readonly]), tbody select:not([disabled])');
  if (!edit) return;
  if (event.detail === 0) edit.focus({ preventScroll: true });
  edit.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
});
