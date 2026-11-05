(() => {
  'use strict';
  const variant = new URLSearchParams(window.location.search).get('hero');
  if (variant === 'rh') document.documentElement.classList.add('hero-rh-preview');
  if (variant === 'rh' || variant === 'listening') return;

  document.addEventListener('DOMContentLoaded', () => {
    const art = document.querySelector('[data-clear-path]');
    const video = document.querySelector('[data-clear-path-video]');
    const toggle = document.querySelector('[data-clear-path-toggle]');
    if (!art || !video || !toggle) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let completed = false;
    let failed = false;
    let userPaused = false;
    let manualPlay = false;
    let inView = true;
    let pending = false;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = false;
    toggle.hidden = false;

    const update = () => {
      art.dataset.motion = reduce.matches ? 'reduced' : 'normal';
      toggle.textContent = failed ? 'Still artwork' : completed ? 'Animation complete' : video.paused ? 'Play animation' : 'Pause animation';
      toggle.setAttribute('aria-disabled', String(completed || failed));
    };
    const play = async () => {
      if (completed || failed || pending || !inView || document.hidden || (reduce.matches && !manualPlay)) return;
      pending = true;
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      try {
        await video.play();
        if (document.hidden || !inView || userPaused || (reduce.matches && !manualPlay)) video.pause();
      } catch {
        // Autoplay refusal leaves the settled image and an ordinary Play button.
        art.dataset.state = 'still';
      } finally {
        pending = false;
        update();
      }
    };
    toggle.addEventListener('click', () => {
      if (completed || failed) return;
      if (video.paused) {
        userPaused = false;
        manualPlay = true;
        play();
      } else {
        userPaused = true;
        video.pause();
      }
    });
    video.addEventListener('playing', () => {
      art.dataset.state = 'playing';
      update();
    });
    video.addEventListener('pause', update);
    video.addEventListener('ended', () => {
      completed = true;
      art.dataset.state = 'complete';
      update();
    });
    video.addEventListener('error', () => {
      failed = true;
      art.dataset.state = 'still';
      update();
    });
    reduce.addEventListener('change', () => {
      manualPlay = false;
      if (reduce.matches) {
        video.pause();
        art.dataset.state = completed ? 'complete' : 'still';
      }
      // A preference change never restarts or rewinds the story.
      update();
    });
    const resume = () => {
      if (!userPaused) play();
    };
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause();
      else resume();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) video.pause();
        else resume();
      }, { threshold: .1 }).observe(art);
    }
    update();
    play();
  }, { once: true });
})();
