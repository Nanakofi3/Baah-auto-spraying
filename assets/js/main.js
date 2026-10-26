/*Baah Auto Spraying — site behaviour (shared by every page)*/

(function () {
  'use strict';

  var THEME_KEY = 'bas-theme';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (initial theme is set by theme.js) ---------- */
  function initTheme() {
    var buttons = document.querySelectorAll('#themeToggle [data-mode]');
    var systemDark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)');
    var mode = 'system';
    try { mode = localStorage.getItem(THEME_KEY) || 'system'; } catch (e) {}

    function apply() {
      var dark = mode === 'dark' || (mode === 'system' && systemDark && systemDark.matches);
      if (dark) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-checked', btn.getAttribute('data-mode') === mode);
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        mode = btn.getAttribute('data-mode');
        // "System" is stored as no preference so the OS setting wins
        try {
          if (mode === 'system') localStorage.removeItem(THEME_KEY);
          else localStorage.setItem(THEME_KEY, mode);
        } catch (e) {}
        apply();
      });
    });

    // Follow OS changes while on "System"
    if (systemDark && systemDark.addEventListener) {
      systemDark.addEventListener('change', function () {
        if (mode === 'system') apply();
      });
    }

    apply();
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var nav = document.getElementById('nav');

    document.getElementById('menuBtn').addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    // Close the menu after a link is chosen
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  /* ---------- Header shadow once the page scrolls ---------- */
  function initHeader() {
    var header = document.querySelector('header');

    function update() {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Fade elements in as they scroll into view ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Count the stats up when they come into view ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (reduceMotion || !counters.length || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = Number(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;

      function step(now) {
        if (!start) start = now;
        var progress = Math.min((now - start) / 1200, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .6 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.getElementById('yr').textContent = new Date().getFullYear();
  }

  /* ---------- Gallery tabs: Photos / Videos ---------- */
  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.gallery-tabs [role=tab]'));
    if (!tabs.length) return;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(tab);
        // Remember the tab in the address so it can be linked to
        history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
      });
      // Left/right arrows move between tabs
      tab.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        var next = tabs[(i + step + tabs.length) % tabs.length];
        next.click();
        next.focus();
      });
    });

    // Open the tab named in the address (e.g. /gallery#videos), else the first
    var fromHash = tabs.filter(function (t) { return '#' + t.getAttribute('aria-controls') === location.hash; })[0];
    select(fromHash || tabs[0]);
  }

  /* ---------- Lightbox: links with data-lightbox open in a viewer ---------- */
  function initLightbox() {
    var box = document.getElementById('lightbox');
    if (!box || !box.showModal) return;  // without <dialog>, links open the file directly
    var img = box.querySelector('img');
    var video = box.querySelector('video');
    var caption = box.querySelector('figcaption');
    var group = [];
    var index = 0;

    // Stop playback and drop the source so a large video stops downloading
    function stopVideo() {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }

    function show(i) {
      index = (i + group.length) % group.length;
      var link = group[index];
      var thumb = link.querySelector('img');
      var text = link.closest('figure').querySelector('figcaption');
      var isVideo = link.getAttribute('data-type') === 'video';

      stopVideo();
      img.hidden = isVideo;
      video.hidden = !isVideo;
      if (isVideo) {
        video.poster = link.getAttribute('data-poster') || '';
        video.src = link.getAttribute('href');
        video.muted = true;  // gallery videos play without sound
        video.play().catch(function () {});  // autoplay may be blocked; controls still work
      } else {
        img.src = link.getAttribute('href');
        img.alt = thumb ? thumb.alt : '';
      }

      // Join the caption's parts ("Title", "Date") with a separator
      caption.textContent = text ? Array.prototype.map.call(text.childNodes, function (n) {
        return n.textContent.replace(/\s+/g, ' ').trim();
      }).filter(Boolean).join(' · ') : '';
    }

    document.querySelectorAll('[data-lightbox]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var name = link.getAttribute('data-lightbox');
        group = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + name + '"]'));
        box.classList.toggle('single', group.length < 2);
        box.showModal();
        show(group.indexOf(link));
      });
    });

    box.addEventListener('close', stopVideo);
    box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
    box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });

    // Arrow keys step through (except when seeking a video); Escape closes (built into <dialog>)
    box.addEventListener('keydown', function (e) {
      if (e.target === video) return;
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    // Click on the dark backdrop closes
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.tagName === 'FIGURE') box.close();
    });
  }

  initTheme();
  initMenu();
  initHeader();
  initReveal();
  initCounters();
  initYear();
  initTabs();
  initLightbox();
})();
