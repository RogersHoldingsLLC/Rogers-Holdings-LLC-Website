(() => {
  'use strict';
  if (new URLSearchParams(window.location.search).get('hero') !== 'listening') return;
  document.documentElement.classList.add('hero-listening-preview');
  document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('[data-listening-video]');
    const toggle = document.querySelector('[data-listening-toggle]');
    if (!video || !toggle) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = false;
    let inView = true;
    video.muted = true;
    video.defaultMuted = true;
    const update = () => {
      toggle.textContent = video.paused ? 'Play motion' : 'Pause motion';
      toggle.setAttribute('aria-label', video.paused ? 'Play listening video' : 'Pause listening video');
      video.dataset.motion = reduce.matches ? 'reduced' : 'normal';
    };
    const play = () => {
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.play().catch(update);
    };
    toggle.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        play();
      } else {
        userPaused = true;
        video.pause();
      }
    });
    video.addEventListener('playing', update);
    video.addEventListener('pause', update);
    video.addEventListener('error', () => {
      toggle.textContent = 'Video unavailable';
      toggle.disabled = true;
      video.dataset.state = 'poster-only';
    });
    reduce.addEventListener('change', () => {
      if (reduce.matches) video.pause();
      else if (!userPaused && inView && !document.hidden) play();
      update();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause();
      else if (!userPaused && !reduce.matches && inView) play();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) video.pause();
        else if (!userPaused && !reduce.matches && !document.hidden) play();
      }, { threshold: .1 }).observe(video);
    }
    update();
    if (!reduce.matches) play();
  }, { once: true });
})();
