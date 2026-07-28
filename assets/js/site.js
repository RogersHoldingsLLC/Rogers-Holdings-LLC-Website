const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
const header = document.querySelector('[data-site-header]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = 'Open navigation';
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.querySelector('.sr-only').textContent = willOpen ? 'Close navigation' : 'Open navigation';
    navigation.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
    if (willOpen) navigation.querySelector('a')?.focus();
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (!navigation.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      menuToggle.focus();
      return;
    }

    if (event.key !== 'Tab') return;
    const visibleLinks = [...navigation.querySelectorAll('a')].filter((link) => !link.hidden);
    const focusable = [menuToggle, ...visibleLinks];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 20 || document.body.classList.contains('interior-page'));
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  document.documentElement.classList.add('motion-ready');
  const revealItems = document.querySelectorAll(
    '.section-intro, .split-heading, .problem-card, .pillar-grid article, .process-list li, .services-grid article, .platform-copy, .platform-panel, .case-header, .case-image, .case-narrative article, .about-image, .about-copy, .why-statement, .why-principles li, .final-cta-inner'
  );
  revealItems.forEach((item, index) => {
    item.classList.add('reveal-item');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 55}ms`);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));

  const interfaceObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-active');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.assessment-shell, .platform-panel, .process-list').forEach((item) => interfaceObserver.observe(item));
}

if ('IntersectionObserver' in window) {
  const navigationLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]:not([href="#"])')];
  const sectionLinks = new Map(navigationLinks.map((link) => [link.getAttribute('href').slice(1), link]));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => link.removeAttribute('aria-current'));
      sectionLinks.get(entry.target.id)?.setAttribute('aria-current', 'location');
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sectionLinks.forEach((link, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

document.querySelectorAll('[data-report-link]').forEach((link) => {
  link.addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'report_cta_selected', { event_category: 'engagement' });
    }
  });
});

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const leadForm = document.querySelector('[data-lead-form]');

if (leadForm) {
  const formStatus = leadForm.querySelector('[data-form-status]');
  const formStartedAt = leadForm.querySelector('[data-form-started-at]');
  const fields = [...leadForm.querySelectorAll('[data-validate]')];

  if (formStartedAt) {
    formStartedAt.value = new Date().toISOString();
  }

  const validationMessages = {
    firstName: 'Enter your first name.',
    lastName: 'Enter your last name.',
    businessName: 'Enter your business name.',
    email: 'Enter a valid email address.',
    phone: 'Enter a phone number.',
    website: 'Enter a complete URL beginning with http:// or https://.',
    primaryChallenge: 'Tell us about your primary business challenge.',
    consent: 'Confirm that we may review your request and contact you.'
  };

  function errorElement(field) {
    return document.getElementById(`${field.id}-error`);
  }

  function setFieldState(field) {
    const error = errorElement(field);
    if (!error) return field.validity.valid;
    const isValid = field.validity.valid;
    const descriptionIds = field.dataset.descriptionId ? [field.dataset.descriptionId] : [];
    if (!isValid) descriptionIds.push(error.id);
    field.setAttribute('aria-invalid', String(!isValid));
    if (descriptionIds.length) {
      field.setAttribute('aria-describedby', descriptionIds.join(' '));
    } else {
      field.removeAttribute('aria-describedby');
    }
    error.textContent = isValid ? '' : (validationMessages[field.name] || field.validationMessage);
    return isValid;
  }

  fields.forEach((field) => {
    field.addEventListener('blur', () => setFieldState(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') setFieldState(field);
    });
    field.addEventListener('change', () => {
      if (field.getAttribute('aria-invalid') === 'true') setFieldState(field);
    });
  });

  leadForm.addEventListener('submit', (event) => {
    formStatus.hidden = true;
    formStatus.className = 'form-status';

    const invalidFields = fields.filter((field) => !setFieldState(field));
    if (invalidFields.length) {
      event.preventDefault();
      formStatus.textContent = 'Please review the highlighted fields and try again.';
      formStatus.classList.add('is-error');
      formStatus.hidden = false;
      invalidFields[0].focus();
      return;
    }

    const endpoint = leadForm.getAttribute('action')?.trim();
    const endpointConfigured = leadForm.dataset.endpointConfigured === 'true';
    let endpointIsSecure = false;

    try {
      endpointIsSecure = new URL(endpoint).protocol === 'https:';
    } catch {
      endpointIsSecure = false;
    }

    if (!endpointConfigured || !endpointIsSecure) {
      event.preventDefault();
      formStatus.innerHTML = 'Online delivery is being connected. Please email <a href="mailto:briankeith@rogersholdingsllc.com?subject=Business%20Snapshot%20Request">briankeith@rogersholdingsllc.com</a> or call <a href="tel:+18594047300">859-404-7300</a> so we can help now.';
      formStatus.classList.add('is-error');
      formStatus.hidden = false;
      formStatus.focus();
      return;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'business_snapshot_submitted', { event_category: 'lead' });
    }
  });
}
