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
    '[data-reveal], .section-intro, .split-heading, .problem-card, .pillar-grid article, .process-list li, .services-grid article, .platform-copy, .platform-panel, .case-header, .case-image, .case-narrative article, .about-image, .about-copy, .why-statement, .why-principles li, .final-cta-inner'
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

const parallaxScenes = [...document.querySelectorAll('[data-scene-parallax]')];

if (parallaxScenes.length && !reduceMotion.matches) {
  let parallaxFrame;

  const updateSceneParallax = () => {
    const viewportCenter = window.innerHeight / 2;

    parallaxScenes.forEach((scene) => {
      const bounds = scene.getBoundingClientRect();
      const sceneCenter = bounds.top + (bounds.height / 2);
      const normalizedDistance = Math.max(-1, Math.min(1, (sceneCenter - viewportCenter) / window.innerHeight));
      scene.style.setProperty('--scene-parallax-y', `${(normalizedDistance * -7).toFixed(2)}px`);
    });

    parallaxFrame = undefined;
  };

  const requestSceneParallax = () => {
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(updateSceneParallax);
  };

  window.addEventListener('scroll', requestSceneParallax, { passive: true });
  window.addEventListener('resize', requestSceneParallax, { passive: true });
  updateSceneParallax();
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

const BUSINESS_SNAPSHOT_ENDPOINT = 'https://intake.rogersholdingsllc.com/api/business-snapshot';
const BUSINESS_SNAPSHOT_TIMEOUT_MS = 40000;
const BUSINESS_SNAPSHOT_FAILURE_CATEGORIES = new Set([
  'user_validation',
  'turnstile_missing',
  'turnstile_rejected',
  'turnstile_error',
  'turnstile_expired',
  'turnstile_timeout',
  'retryable_service',
  'ambiguous_timeout',
  'ambiguous_network',
  'ambiguous_response',
  'administrative_review'
]);
const BUSINESS_SNAPSHOT_JOURNEY_STAGES = new Set([
  'started',
  'submit_attempted',
  'failed'
]);
const BUSINESS_SNAPSHOT_RUNTIME_CATEGORIES = new Set([
  'window_error',
  'unhandled_rejection'
]);
const BUSINESS_SNAPSHOT_ANALYTICS_EVENTS = new Set([
  'business_snapshot_form_started',
  'business_snapshot_submit_attempted',
  'business_snapshot_submitted',
  'business_snapshot_email_prepared',
  'business_snapshot_submission_failed',
  'business_snapshot_abandoned',
  'business_snapshot_runtime_failed'
]);

const businessSnapshotFailureMessages = {
  user_validation: 'Please review your information and try again. If the problem continues, use the prepared email below.',
  turnstile_missing: 'Complete the human verification and try the secure form again.',
  turnstile_rejected: 'Human verification was not accepted. Complete a fresh check and try again.',
  turnstile_error: 'Human verification could not start. Refresh the page or use the prepared email below.',
  turnstile_expired: 'Human verification expired. Complete the fresh check and try again.',
  turnstile_timeout: 'Human verification timed out. Complete the fresh check and try again.',
  retryable_service: 'The secure service is temporarily unavailable. Try again shortly or use the prepared email below.',
  ambiguous_timeout: 'We could not confirm whether your request was received. Wait a moment, then retry; this page will reuse the same request identity.',
  ambiguous_network: 'We could not confirm whether your request was received. Check your connection, then retry; this page will reuse the same request identity.',
  ambiguous_response: 'We could not confirm the request status. Wait a moment, then retry or use the prepared email below.',
  administrative_review: 'We could not confirm the final request status. Please use the prepared email instead of submitting repeatedly.'
};

function businessSnapshotEndpointIsConfigured(form) {
  return form?.dataset.endpointConfigured === 'true'
    && form.getAttribute('action')?.trim() === BUSINESS_SNAPSHOT_ENDPOINT;
}

function buildBusinessSnapshotPayload(request, requestId, turnstileToken) {
  return {
    schemaVersion: 'business-snapshot.v1',
    requestId,
    fullName: request.get('fullName'),
    businessName: request.get('businessName'),
    email: request.get('email'),
    phone: request.get('phone') || '',
    website: request.get('website') || '',
    primaryChallenge: request.get('primaryChallenge'),
    consent: request.get('consent'),
    turnstileToken: turnstileToken || '',
    company: request.get('company') || ''
  };
}

function businessSnapshotResponseIsAccepted(response, result, requestId) {
  return response?.ok === true
    && result?.ok === true
    && result.environment === 'production'
    && result.requestId === requestId
    && typeof result.retry === 'boolean';
}

function classifyBusinessSnapshotFailure({ error, response, result }) {
  if (error?.name === 'AbortError') return 'ambiguous_timeout';
  if (!response) return 'ambiguous_network';
  if (!result || typeof result !== 'object') return 'ambiguous_response';

  if (result.code === 'BUSINESS_SNAPSHOT_VALIDATION') {
    return /^Human verification\b/.test(String(result.message || ''))
      ? 'turnstile_rejected'
      : 'user_validation';
  }
  if (result.code === 'BUSINESS_SNAPSHOT_DUPLICATE_ENTITY') return 'user_validation';
  if (result.code === 'BUSINESS_SNAPSHOT_RECONCILIATION_REQUIRED') {
    return 'administrative_review';
  }
  if (
    result.code === 'BUSINESS_SNAPSHOT_LOCK_TIMEOUT'
    || result.code === 'BUSINESS_SNAPSHOT_CONFIGURATION'
    || result.code === 'BUSINESS_SNAPSHOT_TEMPORARY_FAILURE'
  ) return 'retryable_service';
  return 'ambiguous_response';
}

function trackBusinessSnapshotEvent(eventName, category) {
  if (
    !BUSINESS_SNAPSHOT_ANALYTICS_EVENTS.has(eventName)
    || typeof window.gtag !== 'function'
  ) return;
  const parameters = { event_category: 'lead' };
  if (
    eventName === 'business_snapshot_submission_failed'
    && BUSINESS_SNAPSHOT_FAILURE_CATEGORIES.has(category)
  ) parameters.failure_category = category;
  if (
    eventName === 'business_snapshot_abandoned'
    && BUSINESS_SNAPSHOT_JOURNEY_STAGES.has(category)
  ) {
    parameters.journey_stage = category;
    parameters.transport_type = 'beacon';
  }
  if (
    eventName === 'business_snapshot_runtime_failed'
    && BUSINESS_SNAPSHOT_RUNTIME_CATEGORIES.has(category)
  ) parameters.runtime_category = category;
  try {
    window.gtag('event', eventName, parameters);
  } catch {
    // Analytics must never interrupt the form experience.
  }
}

function createBusinessSnapshotJourneyTracker(trackEvent = trackBusinessSnapshotEvent) {
  let stage = 'not_started';
  let completed = false;
  let abandonmentReported = false;

  return {
    start() {
      if (stage !== 'not_started' || completed) return false;
      stage = 'started';
      trackEvent('business_snapshot_form_started');
      return true;
    },
    submitAttempted() {
      if (completed) return false;
      if (stage === 'not_started') this.start();
      stage = 'submit_attempted';
      trackEvent('business_snapshot_submit_attempted');
      return true;
    },
    fail() {
      if (completed || stage === 'not_started') return false;
      stage = 'failed';
      return true;
    },
    complete() {
      completed = true;
      stage = 'submitted';
    },
    abandon() {
      if (
        completed
        || abandonmentReported
        || !BUSINESS_SNAPSHOT_JOURNEY_STAGES.has(stage)
      ) return false;
      abandonmentReported = true;
      trackEvent('business_snapshot_abandoned', stage);
      return true;
    },
    currentStage() {
      return stage;
    }
  };
}

function createBusinessSnapshotRuntimeErrorReporter(
  trackEvent = trackBusinessSnapshotEvent
) {
  let reported = false;
  return (category) => {
    if (reported || !BUSINESS_SNAPSHOT_RUNTIME_CATEGORIES.has(category)) {
      return false;
    }
    reported = true;
    trackEvent('business_snapshot_runtime_failed', category);
    return true;
  };
}

let renderBusinessSnapshotTurnstile = () => {};
window.businessSnapshotTurnstileReady = () => renderBusinessSnapshotTurnstile();

const leadForm = document.querySelector('[data-lead-form]');

if (leadForm) {
  const formStatus = leadForm.querySelector('[data-form-status]');
  const submitButton = leadForm.querySelector('[data-submit-button]');
  const deliveryNote = leadForm.querySelector('[data-delivery-note]');
  const confirmation = document.querySelector('[data-submission-confirmation]');
  const formHeading = leadForm.closest('.form-card')?.querySelector('.form-heading');
  const fields = [...leadForm.querySelectorAll('[data-validate]')];
  const progressBar = leadForm.closest('.form-card')?.querySelector('[data-progress-bar]');
  const progressValue = leadForm.closest('.form-card')?.querySelector('[data-progress-value]');
  const challengeField = leadForm.querySelector('[name="primaryChallenge"]');
  const characterCount = leadForm.querySelector('[data-character-count]');
  const submissionLoader = leadForm.querySelector('[data-submission-loader]');
  const turnstileShell = leadForm.querySelector('[data-turnstile-shell]');
  const turnstileElement = leadForm.querySelector('[data-turnstile-widget]');
  const turnstileStatus = leadForm.querySelector('[data-turnstile-status]');
  const configuredEndpoint = leadForm.getAttribute('action')?.trim();
  const isConfigured = businessSnapshotEndpointIsConfigured(leadForm);
  const defaultSubmitLabel = isConfigured
    ? 'Request My Business Snapshot'
    : 'Prepare My Snapshot Request';
  const requestId = crypto.randomUUID();
  const journey = createBusinessSnapshotJourneyTracker();
  const reportRuntimeError = createBusinessSnapshotRuntimeErrorReporter();
  let submissionPending = false;
  let turnstileWidgetId = null;
  let turnstileToken = '';

  window.addEventListener('error', () => reportRuntimeError('window_error'));
  window.addEventListener('unhandledrejection', () => {
    reportRuntimeError('unhandled_rejection');
  });
  window.addEventListener('pagehide', () => journey.abandon());

  function setSubmitLabel(label) {
    if (!submitButton) return;
    const labelElement = submitButton.querySelector('span');
    if (labelElement) {
      labelElement.textContent = label;
    } else {
      submitButton.textContent = label;
    }
  }

  if (!isConfigured) {
    if (deliveryNote) deliveryNote.hidden = false;
    if (turnstileShell) turnstileShell.hidden = true;
    setSubmitLabel(defaultSubmitLabel);
  } else if (deliveryNote) {
    deliveryNote.hidden = true;
  }

  const validationMessages = {
    fullName: 'Enter your name.',
    businessName: 'Enter your business name.',
    email: 'Enter a valid email address.',
    website: 'Enter a complete URL beginning with http:// or https://.',
    primaryChallenge: 'Share at least a few specific sentences about what needs attention.',
    consent: 'Confirm that we may review your request and contact you.'
  };

  function errorElement(field) {
    return document.getElementById(`${field.id}-error`);
  }

  function setFieldState(field) {
    const error = errorElement(field);
    if (!error) return field.validity.valid;
    const isValid = field.validity.valid;
    const descriptionIds = field.dataset.descriptionId
      ? field.dataset.descriptionId.split(/\s+/).filter(Boolean)
      : [];
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

  function fieldHasProgress(field) {
    if (field.type === 'checkbox') return field.checked;
    const value = field.value.trim();
    if (!value) return !field.required;
    return field.validity.valid;
  }

  function updateProgress() {
    const requiredFields = fields.filter((field) => field.required);
    const completedRequired = requiredFields.filter(fieldHasProgress).length;
    const percentage = Math.round((completedRequired / requiredFields.length) * 100);
    if (progressValue) progressValue.textContent = String(percentage);
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(percentage));
      progressBar.querySelector('span')?.style.setProperty('width', `${percentage}%`);
    }
  }

  function updateCharacterCount() {
    if (!challengeField || !characterCount) return;
    characterCount.textContent = `${challengeField.value.length.toLocaleString()} / 2,000`;
  }

  function createEmailAction(request) {
    const emailBody = [
      'Business Snapshot request',
      '',
      `Name: ${request.get('fullName') || ''}`,
      `Business: ${request.get('businessName') || ''}`,
      `Email: ${request.get('email') || ''}`,
      `Phone: ${request.get('phone') || 'Not provided'}`,
      `Website: ${request.get('website') || 'Not provided'}`,
      '',
      'What needs attention:',
      String(request.get('primaryChallenge') || '')
    ].join('\n');
    const emailLink = document.createElement('a');
    emailLink.className = 'button button-dark form-email-action';
    emailLink.href = `mailto:briankeith@rogersholdingsllc.com?subject=${encodeURIComponent('Business Snapshot Request')}&body=${encodeURIComponent(emailBody)}`;
    emailLink.textContent = 'Continue in Your Email App';
    return emailLink;
  }

  function showDeliveryStatus({ heading, message, request, error = false }) {
    formStatus.replaceChildren();
    const statusHeading = document.createElement('strong');
    const statusMessage = document.createElement('span');
    statusHeading.textContent = heading;
    statusMessage.textContent = message;
    formStatus.append(statusHeading, statusMessage, createEmailAction(request));
    formStatus.className = `form-status ${error ? 'is-error' : 'is-ready'}`;
    formStatus.hidden = false;
    formStatus.focus();
  }

  function showPendingStatus() {
    formStatus.textContent = 'Sending your request securely. Please wait.';
    formStatus.className = 'form-status is-pending';
    formStatus.hidden = false;
  }

  function setPending(isPending) {
    submissionPending = isPending;
    leadForm.setAttribute('aria-busy', String(isPending));
    if (submissionLoader) {
      submissionLoader.hidden = !isPending;
      submissionLoader.setAttribute('aria-hidden', String(!isPending));
    }
    if (!submitButton) return;
    submitButton.disabled = isPending;
    setSubmitLabel(isPending ? 'Sending Securely…' : defaultSubmitLabel);
  }

  function setTurnstileStatus(state, message, focus = false) {
    if (!turnstileShell || !turnstileStatus) return;
    turnstileShell.dataset.state = state;
    turnstileStatus.textContent = message || '';
    turnstileStatus.hidden = !message;
    if (focus && message) turnstileStatus.focus();
  }

  function resetTurnstileForFreshToken() {
    turnstileToken = '';
    if (turnstileWidgetId !== null && window.turnstile?.reset) {
      window.turnstile.reset(turnstileWidgetId);
    }
  }

  window.businessSnapshotTurnstileSuccess = (token) => {
    turnstileToken = String(token || '');
    setTurnstileStatus('ready', 'Human verification complete.');
  };
  window.businessSnapshotTurnstileError = () => {
    turnstileToken = '';
    setTurnstileStatus('error', businessSnapshotFailureMessages.turnstile_error, true);
    trackBusinessSnapshotEvent('business_snapshot_submission_failed', 'turnstile_error');
  };
  window.businessSnapshotTurnstileExpired = () => {
    resetTurnstileForFreshToken();
    setTurnstileStatus('expired', businessSnapshotFailureMessages.turnstile_expired, true);
    trackBusinessSnapshotEvent('business_snapshot_submission_failed', 'turnstile_expired');
  };
  window.businessSnapshotTurnstileTimeout = () => {
    resetTurnstileForFreshToken();
    setTurnstileStatus('timeout', businessSnapshotFailureMessages.turnstile_timeout, true);
    trackBusinessSnapshotEvent('business_snapshot_submission_failed', 'turnstile_timeout');
  };

  renderBusinessSnapshotTurnstile = () => {
    if (!isConfigured || !turnstileShell || !turnstileElement || !window.turnstile?.render) return;
    const sitekey = turnstileElement.dataset.sitekey || '';
    if (!sitekey || sitekey.includes('NOT_CONFIGURED')) return;
    turnstileShell.hidden = false;
    if (turnstileWidgetId !== null) return;
    turnstileWidgetId = window.turnstile.render(turnstileElement, {
      sitekey,
      action: turnstileElement.dataset.action,
      callback: window.businessSnapshotTurnstileSuccess,
      'error-callback': window.businessSnapshotTurnstileError,
      'expired-callback': window.businessSnapshotTurnstileExpired,
      'timeout-callback': window.businessSnapshotTurnstileTimeout
    });
  };
  renderBusinessSnapshotTurnstile();

  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      setFieldState(field);
      updateProgress();
    });
    field.addEventListener('input', () => {
      journey.start();
      if (field.getAttribute('aria-invalid') === 'true') setFieldState(field);
      updateProgress();
      if (field === challengeField) updateCharacterCount();
    });
    field.addEventListener('change', () => {
      journey.start();
      if (field.getAttribute('aria-invalid') === 'true') setFieldState(field);
      updateProgress();
    });
  });
  updateProgress();
  updateCharacterCount();

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submissionPending) return;
    formStatus.hidden = true;
    formStatus.className = 'form-status';

    const invalidFields = fields.filter((field) => !setFieldState(field));
    if (invalidFields.length) {
      formStatus.textContent = 'Please review the highlighted fields and try again.';
      formStatus.classList.add('is-error');
      formStatus.hidden = false;
      invalidFields[0].focus();
      journey.fail();
      trackBusinessSnapshotEvent('business_snapshot_submission_failed', 'user_validation');
      return;
    }

    const request = new FormData(leadForm);

    if (!isConfigured) {
      showDeliveryStatus({
        heading: 'Your request is ready to send.',
        message: 'Secure online delivery is still being connected, so this form has not been submitted. Open the prepared email, review it, and send it to Rogers Holdings.',
        request
      });
      trackBusinessSnapshotEvent('business_snapshot_email_prepared');
      return;
    }

    if (!turnstileToken) {
      setTurnstileStatus('error', businessSnapshotFailureMessages.turnstile_missing, true);
      resetTurnstileForFreshToken();
      showDeliveryStatus({
        heading: 'Human verification is required.',
        message: businessSnapshotFailureMessages.turnstile_missing,
        request,
        error: true
      });
      trackBusinessSnapshotEvent('business_snapshot_submission_failed', 'turnstile_missing');
      journey.fail();
      return;
    }

    journey.submitAttempted();
    setPending(true);
    showPendingStatus();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), BUSINESS_SNAPSHOT_TIMEOUT_MS);
    const payload = buildBusinessSnapshotPayload(request, requestId, turnstileToken);
    let response;
    let result;

    try {
      response = await fetch(configuredEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit',
        redirect: 'error',
        signal: controller.signal
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.toLowerCase().startsWith('application/json')) {
        try {
          result = await response.json();
        } catch {
          result = null;
        }
      }

      if (!businessSnapshotResponseIsAccepted(response, result, requestId)) {
        const failureCategory = classifyBusinessSnapshotFailure({ response, result });
        const failure = new Error('business_snapshot_not_accepted');
        failure.failureCategory = failureCategory;
        throw failure;
      }

      leadForm.hidden = true;
      if (formHeading) formHeading.hidden = true;
      if (confirmation) {
        confirmation.hidden = false;
        const previousScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        confirmation.scrollIntoView({ behavior: 'auto', block: 'center' });
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        confirmation.focus({ preventScroll: true });
      }
      trackBusinessSnapshotEvent('business_snapshot_submitted');
      journey.complete();
    } catch (error) {
      const failureCategory = error.failureCategory
        || classifyBusinessSnapshotFailure({ error, response, result });
      resetTurnstileForFreshToken();
      setTurnstileStatus(failureCategory, businessSnapshotFailureMessages[failureCategory]);
      showDeliveryStatus({
        heading: failureCategory.startsWith('ambiguous_')
          ? 'Your request status is not confirmed.'
          : 'Your request was not sent.',
        message: businessSnapshotFailureMessages[failureCategory]
          || businessSnapshotFailureMessages.ambiguous_response,
        request,
        error: true
      });
      trackBusinessSnapshotEvent('business_snapshot_submission_failed', failureCategory);
      journey.fail();
    } finally {
      window.clearTimeout(timeout);
      setPending(false);
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BUSINESS_SNAPSHOT_ENDPOINT,
    BUSINESS_SNAPSHOT_TIMEOUT_MS,
    buildBusinessSnapshotPayload,
    businessSnapshotEndpointIsConfigured,
    businessSnapshotResponseIsAccepted,
    classifyBusinessSnapshotFailure,
    createBusinessSnapshotJourneyTracker,
    createBusinessSnapshotRuntimeErrorReporter,
    trackBusinessSnapshotEvent
  };
}
