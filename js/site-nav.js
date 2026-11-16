/* AMK Digital Agency Website: shared navigation behaviour (pairs with css/nav.css).
   Loaded in <head> so html.amk-js is set before the page paints (the phone menu never flashes open).
   Desktop: dropdowns open on hover/focus through CSS; this script adds tap-to-open, Escape, outside-click
   and keeps aria-expanded truthful. Phone: the menu button opens the menu, each section opens by tap. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('amk-js');

  function setup() {
    var nav = document.querySelector('[data-amk-nav]');
    if (!nav) return;
    var burger = nav.querySelector('.amk-burger');
    var dds = Array.prototype.slice.call(nav.querySelectorAll('.amk-dd'));
    var desktop = window.matchMedia('(min-width: 980px)');

    function setDD(dd, open) {
      dd.classList.toggle('is-open', open);
      dd.classList.remove('is-closed');
      var b = dd.querySelector('.amk-caret');
      if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function closeAll(except) { dds.forEach(function (dd) { if (dd !== except) setDD(dd, false); }); }
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      if (burger) {
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
      if (!open) closeAll();
    }

    if (burger) burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });

    dds.forEach(function (dd) {
      var caret = dd.querySelector('.amk-caret');
      if (caret) caret.addEventListener('click', function (e) {
        e.preventDefault();
        var open = !dd.classList.contains('is-open');
        closeAll(dd);
        setDD(dd, open);
      });
      // keep aria-expanded in step with hover on desktop
      dd.addEventListener('mouseenter', function () { if (desktop.matches && caret) caret.setAttribute('aria-expanded', 'true'); });
      dd.addEventListener('mouseleave', function () {
        if (!desktop.matches) return;
        dd.classList.remove('is-closed');
        if (!dd.classList.contains('is-open') && caret) caret.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var openDD = dds.filter(function (dd) { return dd.classList.contains('is-open') || dd.matches(':hover') || dd.contains(document.activeElement); })[0];
      if (openDD) {
        setDD(openDD, false);
        openDD.classList.add('is-closed');
        var link = openDD.querySelector('.amk-nl');
        if (link && openDD.contains(document.activeElement)) link.focus();
      } else if (nav.classList.contains('is-open')) { setMenu(false); if (burger) burger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) { closeAll(); if (!desktop.matches) setMenu(false); }
    });
    desktop.addEventListener('change', function () { setMenu(false); });

    // shadow under the bar once the page scrolls
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { root.classList.toggle('amk-scrolled', window.scrollY > 8); ticking = false; });
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();
