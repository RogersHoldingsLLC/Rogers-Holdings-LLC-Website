const leadForm = document.querySelector('[data-hew-lead-form]');
const formNote = document.querySelector('[data-form-note]');

function fieldValue(form, name) {
  return form.elements[name]?.value.trim() || '';
}

function prepareLeadEmail(event) {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = fieldValue(form, 'name');
  const contact = fieldValue(form, 'contact');
  const location = fieldValue(form, 'location') || 'Not provided';
  const projectType = fieldValue(form, 'projectType') || 'Not sure yet';
  const details = fieldValue(form, 'details');
  const subject = `HEW Gates & Garage Repair Request - ${projectType}`;
  const body = [
    'New HEW Gates & Garage repair request',
    '',
    `Name: ${name}`,
    `Phone: ${contact}`,
    `Project location: ${location}`,
    `Project type: ${projectType}`,
    '',
    'Project details:',
    details,
    '',
    'Photos:',
    'Attach photos of the gate, door, fence, or repair area before sending.'
  ].join('\n');

  window.location.href = `mailto:hew@rogersholdingsllc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (formNote) {
    formNote.textContent = 'Your email app should open now. Add a few clear photos before sending.';
  }
}

leadForm?.addEventListener('submit', prepareLeadEmail);

function setupRevealAnimations() {
  const targets = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targets.forEach((target, index) => {
    target.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  });

  targets.forEach((target) => observer.observe(target));
}

setupRevealAnimations();
