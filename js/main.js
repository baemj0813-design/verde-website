/* =========================================================
   VERDÉ — Common UI Enhancements
   ========================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Header: scrolled state --- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* --- Mobile menu --- */
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* --- Scroll reveal --- */
  var revealSelectors = [
    '.section-head',
    '.intro-statement',
    '.philosophy-card',
    '.product-card',
    '.ingredient-card',
    '.article-card',
    '.tier-card',
    '.review-card',
    '.ugc-item',
    '.ingredient-widget',
    '.split-section .split-image',
    '.split-section .split-text',
    '.membership-banner .mb-content',
    '.gauge-wrap',
    '.line-banner',
    '.compare-table-wrap',
    '.newsletter .container > *'
  ].join(',');

  var targets = Array.prototype.slice.call(document.querySelectorAll(revealSelectors));

  if (!prefersReduced && 'IntersectionObserver' in window && targets.length) {
    /* stagger siblings inside the same parent */
    var groups = new Map();
    targets.forEach(function (el) {
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, 0);
      var i = groups.get(parent);
      el.style.setProperty('--reveal-delay', Math.min(i * 0.1, 0.4) + 's');
      groups.set(parent, i + 1);
      el.classList.add('reveal');
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach(function (el) { io.observe(el); });
  }

  /* --- Back to top --- */
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '맨 위로');
  btn.innerHTML = '&uarr;';
  document.body.appendChild(btn);

  window.addEventListener(
    'scroll',
    function () {
      btn.classList.toggle('show', window.scrollY > 600);
    },
    { passive: true }
  );

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  /* --- Newsletter feedback --- */
  var form = document.querySelector('.newsletter-form');
  if (form) {
    var success = document.createElement('p');
    success.className = 'newsletter-success';
    success.textContent = '구독 신청이 완료되었습니다. 첫 레터에서 만나요 🌿';
    form.insertAdjacentElement('afterend', success);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var value = (input.value || '').trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!valid) {
        form.classList.remove('error');
        void form.offsetWidth; /* restart animation */
        form.classList.add('error');
        input.focus();
        return;
      }
      form.classList.remove('error');
      form.style.display = 'none';
      success.classList.add('show');
    });
  }
})();
