(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('site-nav');

  // Мобильное меню
  burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });

  // Закрываем меню по клику на ссылку
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
    }
  });

  // Шапка: тень при прокрутке
  var ticking = false;
  function updateOnScroll() {
    ticking = false;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateOnScroll);
    }
  }, { passive: true });
  updateOnScroll();

  // Появление блоков при прокрутке
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Счётчики в hero
  var nums = document.querySelectorAll('.stat-num');
  function animateNum(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / 1100, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduced) {
    var ioNums = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateNum(entry.target);
          ioNums.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) {
      el.textContent = '0';
      ioNums.observe(el);
    });
  }

  // Год в подвале
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
