/* AMK Digital Agency Website — page behaviour.
   This file replaces the App scripts the pages used to load. The Website has
   no accounts and no sign-in: those live in the App (address from js/config.js). */
(function () {
  'use strict';

  var cfg = window.AMK_SITE || {};
  var appUrl = /^https?:\/\//.test(cfg.appUrl || '') ? cfg.appUrl.replace(/\/+$/, '') : '';

  function byId(id) { return document.getElementById(id); }

  /* A plain-text notice inside a container (never innerHTML). */
  function showNotice(container, message) {
    if (!container) return;
    container.textContent = '';
    var p = document.createElement('p');
    p.className = 'site-notice';
    p.setAttribute('role', 'status');
    p.textContent = message;
    container.appendChild(p);
    container.style.display = 'block';
  }

  var REBUILD_NOTICE = 'This tool is being rebuilt and is temporarily unavailable. Please try again soon.';

  /* ── Scroll reveal ─────────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('active'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ── Links to the App ──────────────────────────────────── */
  function initAppLinks() {
    document.querySelectorAll('[data-auth-open]').forEach(function (el) {
      var path = el.getAttribute('data-auth-open') === 'register' ? '/signup?ref=website' : '/login';
      if (!appUrl) {
        el.hidden = true;
        el.style.display = 'none';
        return;
      }
      el.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = appUrl + path;
      });
    });
    document.querySelectorAll('a[data-app-path]').forEach(function (el) {
      if (!appUrl) { el.hidden = true; el.style.display = 'none'; return; }
      el.href = appUrl + el.getAttribute('data-app-path');
    });
  }

  /* ── Contact form ──────────────────────────────────────── */
  function initContactForm() {
    var form = byId('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var note = byId('contact-form-note');
      if (!note) {
        note = document.createElement('div');
        note.id = 'contact-form-note';
        form.appendChild(note);
      }
      showNotice(note, 'Online booking is not switched on yet. Please use the contact details on this page.');
    });
  }

  /* ── Home page tools ───────────────────────────────────── */
  // The title generator runs in the browser. The other home-page tools need the
  // tools service, which is not built yet, so they show a clear notice instead
  // of failing.
  window.runTitleEngine = function () {
    var keywordInput = byId('focusKeyword');
    var output = byId('titleOutput');
    if (!keywordInput || !output || !window.AMKTitleGenerator) return;
    var keyword = keywordInput.value.trim();
    if (!keyword) { showNotice(output, 'Please enter a focus keyword.'); return; }

    var secondaryInput = byId('titleSecondaryKeywords');
    var secondary = secondaryInput && secondaryInput.value
      ? secondaryInput.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];

    var results = window.AMKTitleGenerator.generateTitles({
      keyword: keyword,
      audience: byId('titleAudience') ? byId('titleAudience').value : '',
      contentType: byId('contentType') ? byId('contentType').value : 'blog',
      secondary: secondary
    });
    output.style.display = 'block';
    window.AMKTitleGenerator.renderTitles(output, results);
  };

  window.runKeywordEngine = function () { showNotice(byId('titleOutput'), REBUILD_NOTICE); };
  window.runArticleEngine = function () { showNotice(byId('articleOutput'), REBUILD_NOTICE); };
  window.runHeroAudit = function () {
    var section = byId('growth-lab');
    if (section && section.scrollIntoView) section.scrollIntoView({ behavior: 'smooth' });
    showNotice(byId('auditOutput'), REBUILD_NOTICE);
  };
  window.runPlaygroundAudit = function () { window.runHeroAudit(); };

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initAppLinks();
    initContactForm();
  });
})();
