/**
 * Moments by LP — lightweight media helpers.
 * Handles reduced-motion for muted BTS clips. No video framework.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyBtsPolicy(root) {
    var nodes = (root || document).querySelectorAll('[data-media-video="bts"]');
    nodes.forEach(function (figure) {
      var video = figure.querySelector('video[data-media-autoplay="true"]');
      var fallback = figure.querySelector('.media-video__fallback');
      if (!video) return;

      if (reduceMotion.matches) {
        video.pause();
        video.removeAttribute('autoplay');
        video.setAttribute('preload', 'none');
        video.hidden = true;
        if (fallback) fallback.hidden = false;
        figure.classList.add('is-static');
        return;
      }

      video.hidden = false;
      if (fallback) fallback.hidden = true;
      figure.classList.remove('is-static');

      // Play only when near viewport to keep performance high.
      if (!('IntersectionObserver' in window)) {
        video.setAttribute('autoplay', '');
        video.play().catch(function () {});
        return;
      }

      if (video.dataset.mediaObserved === 'true') return;
      video.dataset.mediaObserved = 'true';

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              video.muted = true;
              video.playsInline = true;
              video.play().catch(function () {});
            } else {
              video.pause();
            }
          });
        },
        { rootMargin: '100px 0px', threshold: 0.25 }
      );
      observer.observe(video);
    });
  }

  function onReady() {
    applyBtsPolicy(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  if (typeof reduceMotion.addEventListener === 'function') {
    reduceMotion.addEventListener('change', onReady);
  } else if (typeof reduceMotion.addListener === 'function') {
    reduceMotion.addListener(onReady);
  }
})();
