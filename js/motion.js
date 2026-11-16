/* AMK Digital Agency Website: motion layer (pairs with css/motion.css).
   Loaded in <head> so the "mx" class is set before the page paints (no flash of content that then hides).
   Content is never hidden when the visitor asks for reduced motion, when IntersectionObserver is missing,
   or when this script does not run: the CSS only hides items under html.mx.

   Treatments (set in the HTML with data-mx, or chosen automatically):
     rise    headings, forms          fade + rise
     fade    descriptions, buttons    fade only
     scale   visuals, charts, bands   fade + grow from 0.95
     words   big statements           words light up one after another
     [data-mx-stagger] on a grid      its children rise one after another */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  root.classList.add('mx');

  var SKIP = '.amk-nav, .amk-chat, footer, .skip-link, [hidden], script, style, .mx-progress';
  var AUTO = ['.page-body > *', 'main > section > *', 'main .hero > *', 'main > h1', 'main > h2', 'main > p',
              '.tool-hero .container > *', '.tool-workspace .container > *', 'main .panel', 'main .notice:not([hidden])'];
  var GRIDS = ['.cards', '.sc-grid-cards', '.sc-stats', '.sc-charts', '.sc-ba-grid', '.sc-chips', '.tools-grid', '.compare-grid',
               '.x-cards', '.x-features', '[data-mx-stagger]', '.x-chips'];

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('mx-in');
      io.unobserve(e.target);
      countUp(e.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  function guess(el) {
    if (/^H[1-4]$/.test(el.tagName)) return 'rise';
    if (el.matches('p, ul, ol, .x-ctas, .runs-line, .meta')) return 'fade';
    if (el.matches('figure, img, svg, .sc-chart, .x-cta, .x-hero-visual, .sc-table-wrap, .x-toc')) return 'scale';
    return 'rise';
  }

  function mark(el, delay) {
    if (!el || el.classList.contains('mx-reveal') || el.closest(SKIP)) return;
    if (!el.getClientRects().length) return;   // not shown yet (for example tool results): never animate it later
    if (!el.hasAttribute('data-mx')) el.setAttribute('data-mx', guess(el));
    if (el.getAttribute('data-mx') === 'words') splitWords(el);
    el.classList.add('mx-reveal');
    if (delay) el.style.setProperty('--mx-d', delay + 'ms');
    io.observe(el);
  }

  // Wrap each word in a span (text stays in the page for search engines and screen readers).
  function splitWords(el) {
    var n = 0, walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span');
        s.className = 'mx-w';
        s.textContent = part;
        s.style.setProperty('--i', String(Math.min(n++, 40)));
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  // Stat numbers count up once, from 0 to the real value already written in the page.
  function countUp(el) {
    var list = el.matches('.sc-stat') ? [el.querySelector('b')] : [];
    list.forEach(function (b) {
      if (!b || !/^\d{1,6}$/.test(b.textContent.trim())) return;
      var end = parseInt(b.textContent, 10), t0 = null;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 900);
        b.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function setup() {
    var bar = document.createElement('div');
    bar.className = 'mx-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.setProperty('--mx-p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var hero = document.querySelector('main .x-hero') || document.querySelector('main .hero') || document.querySelector('.tool-hero') || document.querySelector('main.page-body');
    if (hero) hero.classList.add('mx-hero');

    // explicit treatments first, then grids (staggered), then everything else
    document.querySelectorAll('main [data-mx]').forEach(function (el) { mark(el, 0); });
    GRIDS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (grid) {
        if (grid.closest(SKIP)) return;
        Array.prototype.forEach.call(grid.children, function (child, i) {
          if (!child.hasAttribute('data-mx')) child.setAttribute('data-mx', 'rise');
          mark(child, Math.min(i, 7) * 90);
        });
      });
    });
    AUTO.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (GRIDS.some(function (g) { return el.matches(g); })) return;          // grids animate through their children
        if (el.querySelector('[data-mx], .mx-reveal')) return;                     // a wrapper whose parts animate on their own
        mark(el, 0);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();

  // Safety net: anything still hidden near the screen after load is shown.
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('.mx-reveal:not(.mx-in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('mx-in');
      });
    }, 4000);
  });
})();
