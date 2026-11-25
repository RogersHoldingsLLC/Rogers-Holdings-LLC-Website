'use strict';
for (const tour of document.querySelectorAll('[data-portfolio-tour]')) {
  const button = tour.querySelector('button[data-tour-start]');
  const video = tour.querySelector('video');
  const fallback = tour.querySelector('[data-tour-fallback]');
  const status = tour.querySelector('[data-tour-status]');
  if (!button || !video || !fallback || !status) continue;
  button.addEventListener('click', () => {
    video.src = fallback.getAttribute('href');
    video.hidden = false;
    button.hidden = true;
    video.focus();
    video.play().catch(() => {
      status.hidden = false;
    });
  }, { once: true });
}
