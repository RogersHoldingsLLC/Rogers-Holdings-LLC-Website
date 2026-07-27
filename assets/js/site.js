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
    if (event.key === 'Escape') closeMenu();
  });

  navigation.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !navigation.classList.contains('is-open')) return;
    const focusable = [menuToggle, ...navigation.querySelectorAll('a')];
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
  const submitButton = leadForm.querySelector('[data-submit-button]');
  const formStatus = leadForm.querySelector('[data-form-status]');
  const successPanel = document.querySelector('[data-form-success]');
  const formCard = leadForm.closest('.form-card');
  const fields = [...leadForm.querySelectorAll('input, textarea')];

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
    field.setAttribute('aria-invalid', String(!isValid));
    field.toggleAttribute('aria-describedby', !isValid);
    if (!isValid) field.setAttribute('aria-describedby', error.id);
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

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.hidden = true;
    formStatus.className = 'form-status';

    const invalidFields = fields.filter((field) => !setFieldState(field));
    if (invalidFields.length) {
      formStatus.textContent = 'Please review the highlighted fields and try again.';
      formStatus.classList.add('is-error');
      formStatus.hidden = false;
      invalidFields[0].focus();
      return;
    }

    const endpoint = leadForm.getAttribute('action')?.trim();
    if (!endpoint) {
      formStatus.innerHTML = 'Online delivery is being connected. Please email <a href="mailto:briankeith@rogersholdingsllc.com?subject=Business%20Snapshot%20Request">briankeith@rogersholdingsllc.com</a> or call <a href="tel:+18594047300">859-404-7300</a> so we can help now.';
      formStatus.classList.add('is-error');
      formStatus.hidden = false;
      formStatus.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    leadForm.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(leadForm),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'business_snapshot_submitted', { event_category: 'lead' });
      }
      leadForm.hidden = true;
      formCard?.querySelector('.form-heading')?.setAttribute('hidden', '');
      successPanel.hidden = false;
      successPanel.focus();
    } catch (error) {
      formStatus.innerHTML = 'We could not send your request. Please try again, or contact us at <a href="mailto:briankeith@rogersholdingsllc.com?subject=Business%20Snapshot%20Request">briankeith@rogersholdingsllc.com</a> or <a href="tel:+18594047300">859-404-7300</a>.';
      formStatus.classList.add('is-error');
      formStatus.hidden = false;
      formStatus.focus();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Request My Business Snapshot';
      leadForm.removeAttribute('aria-busy');
    }
  });
}
