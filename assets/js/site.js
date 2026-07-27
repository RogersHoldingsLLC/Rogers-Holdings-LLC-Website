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

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });
header?.classList.toggle('is-scrolled', window.scrollY > 20);

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
  link.addEventListener('click', (event) => {
    event.preventDefault();
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'report_cta_selected', { event_category: 'engagement' });
    }
  });
});

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
