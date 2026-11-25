'use strict';
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  for (const tour of document.querySelectorAll('[data-portfolio-tour]')) {
    const button = tour.querySelector('[data-tour-toggle]');
    const video = tour.querySelector('video[data-src]');
    if (!button || !video) continue;

    let inView = false;
    let preference = null;
    let loaded = false;
    const syncButton = () => {
      const verb = video.paused ? 'Play' : 'Pause';
      button.textContent = verb;
      button.setAttribute('aria-label', verb + ' ' + button.dataset.tourName + ' walkthrough');
    };
    const play = () => {
      if (!loaded) {
        loaded = true;
        video.muted = true;
        video.src = video.dataset.src;
      }
      video.play().catch(syncButton);
      syncButton();
    };
    const update = () => {
      const permitted = preference === 'play' || (preference === null && !reduceMotion.matches);
      if (inView && !document.hidden && permitted) play();
      else {
        video.pause();
        syncButton();
      }
    };

    button.hidden = false;
    video.addEventListener('playing', () => { tour.classList.add('tour-loaded'); syncButton(); });
    video.addEventListener('pause', syncButton);
    video.addEventListener('error', () => { tour.classList.remove('tour-loaded'); syncButton(); });
    button.addEventListener('click', () => {
      if (video.paused) {
        preference = 'play';
        play();
      } else {
        preference = 'pause';
        video.pause();
        syncButton();
      }
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        update();
      }, { threshold: 0.25 });
      observer.observe(tour);
    }
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches && preference === 'play') preference = null;
      update();
    });
    document.addEventListener('visibilitychange', update);
  }
})();
