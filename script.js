/**
 * ABHISHEK JC — PORTFOLIO INTERACTIONS
 * One consolidated script. Loaded with `defer`.
 *
 *  1. Scroll-reveal       — one IntersectionObserver, fires once per element
 *  2. Nav shadow          — adds .scrolled to <nav> on scroll
 *  3. Active nav link     — highlights the section currently in view
 *  4. Smooth scroll       — for in-page anchor links
 *  5. Scroll progress bar — thin line at the top of the page
 *  6. Image modal         — click any chart image to view full-size
 *  7. Back to top         — appears after scrolling past the hero
 */

(function () {
  'use strict';


  /* ── 1. SCROLL REVEAL ───────────────────────────────────────
     Reveals each element once, then stops observing it, so
     scrolling back up never re-triggers the animation.
  ─────────────────────────────────────────────────────────────── */
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Older browsers: just show everything.
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }


  /* ── 2. NAV SHADOW ON SCROLL ─────────────────────────────── */
  function initNavShadow() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    function update() {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ── 3. ACTIVE NAV LINK ──────────────────────────────────── */
  function initActiveNav() {
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!navLinks.length) return;

    var sections = Array.from(navLinks)
      .map(function (link) {
        var id = link.getAttribute('href').slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    function update() {
      var scrollY = window.scrollY + 120;
      var current = sections.reduce(function (found, section) {
        if (section.offsetTop <= scrollY) return section;
        return found;
      }, sections[0]);

      navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        if (current && current.id === id) link.classList.add('active');
        else link.classList.remove('active');
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ── 4. SMOOTH SCROLL FOR NAV LINKS ──────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || !href) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var offset = 64;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }


  /* ── 5. SCROLL PROGRESS BAR ──────────────────────────────── */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ── 6. IMAGE MODAL ──────────────────────────────────────── */
  function initImageModal() {
    var images = document.querySelectorAll('.chart-block img');
    if (!images.length) return;

    var modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = '<button type="button" aria-label="Close image">&times;</button><img src="" alt="">';
    document.body.appendChild(modal);

    var modalImg = modal.querySelector('img');
    var closeBtn = modal.querySelector('button');

    function open(src, alt) {
      modalImg.src = src;
      modalImg.alt = alt || 'Project image';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      modalImg.src = '';
    }

    images.forEach(function (img) {
      img.addEventListener('click', function () {
        open(img.src, img.alt);
      });
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
  }


  /* ── 7. BACK TO TOP ──────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.innerHTML = '&uarr;';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    function update() {
      if (window.scrollY > 500) btn.classList.add('show');
      else btn.classList.remove('show');
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ── INIT ────────────────────────────────────────────────── */
  function init() {
    initReveal();
    initNavShadow();
    initActiveNav();
    initSmoothScroll();
    initScrollProgress();
    initImageModal();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
