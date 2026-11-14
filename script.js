/* AMK Digital Agency: static showcase. Page behaviour for the demo layer.
   ============================================================================
   EDIT THIS ONE LINE when the live website is deployed.
   Use the full address with https://, no trailing slash, for example
   "https://www.your-domain.com". While it is empty, the "Live Website & Tools"
   buttons show a short notice instead of leaving the page.
   ============================================================================ */
const LIVE_SITE_URL = "";

(function () {
  'use strict';

  /* ── Where is the demo's root folder? (works on any address or sub-folder) ── */
  var ME = document.currentScript && document.currentScript.src;
  var ROOT = ME ? ME.replace(/script\.js(\?.*)?$/, '') : location.href.replace(/[^/]*$/, '');
  var PAGE = location.href.split('#')[0].split('?')[0].slice(ROOT.length).replace(/index\.html$/, '');

  var live = /^https?:\/\/[^\s/]+/i.test(LIVE_SITE_URL) ? LIVE_SITE_URL.replace(/\/+$/, '') : '';
  var lastTyped = '';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ── A short message that fades away ── */
  function toast(message) {
    var t = document.querySelector('.demo-toast') || document.body.appendChild(el('div', 'demo-toast'));
    t.setAttribute('role', 'status');
    t.textContent = message;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 4500);
  }
  var NOT_SET = 'The live website address is not set yet. Edit LIVE_SITE_URL at the top of script.js.';

  /* ── Address of the same tool on the live website, with the visitor's entry ── */
  function liveToolUrl() {
    if (!live) return '';
    var url = live + '/' + PAGE;
    if (lastTyped) {
      var v = encodeURIComponent(lastTyped);
      url += '?url=' + v + (/domain-overview/.test(PAGE) ? '&domain=' + v : '');
    }
    return url;
  }

  function setLink(a, url) {
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.removeAttribute('aria-disabled'); }
    else { a.href = '#'; a.removeAttribute('target'); a.setAttribute('aria-disabled', 'true'); }
  }

  /* ── 1. Header button: "Live Website & Tools" (every page) ── */
  function addHeaderButton() {
    var a = el('a', 'demo-live-link', 'Live Website & Tools ↗');
    a.setAttribute('data-demo-live', 'home');
    setLink(a, live ? live + '/' : '');

    var list = document.querySelector('.nav-list');
    var topNav = document.querySelector('.top nav');
    var toolNav = document.querySelector('.tool-header-nav');
    var topBar = document.querySelector('.top-bar');
    var links = document.querySelector('.top .navlinks');

    if (list) {
      var li = el('li'); li.appendChild(a);
      var last = list.lastElementChild;
      list.insertBefore(li, last && last.querySelector('.theme-toggle-btn') ? last : null);
    }
    else if (topNav) topNav.appendChild(a);
    else if (toolNav) toolNav.appendChild(a);
    else if (topBar) { var tb = topBar.querySelector('.theme-toggle-btn'); topBar.insertBefore(a, tb || null); }
    else if (links) links.appendChild(a);
    else { var h = document.querySelector('header'); if (h) h.appendChild(a); }
  }

  /* ── 2. Sample banner (tool pages that show a sample report) ── */
  var SAMPLE_FIELDS = ['tool-url', 'ov-domain', 'cmp-d1', 'cmp-d2', 'ia-url', 'dom-url', 'aieo-url', 'seo-url', 'age-url', 'rank-url'];
  var SAMPLE_VALUE = { 'tool-url': 'https://example.com/', 'cmp-d2': 'example.org', 'ia-url': 'https://example.com' };

  function isSamplePage() {
    return SAMPLE_FIELDS.some(function (id) { return document.getElementById(id); }) ||
      document.getElementById('keywordNiche') || document.getElementById('articleTopic');
  }

  function addBanner() {
    if (!isSamplePage()) return;
    var box = el('div', 'demo-banner');
    box.setAttribute('role', 'note');
    box.appendChild(el('strong', '', 'Sample report: example data, not a live check.'));
    box.appendChild(el('span', '', ' The full tool runs on the live website.'));
    var a = el('a', 'demo-live-link demo-banner-link', 'Run Live Check ↗');
    a.setAttribute('data-demo-live', 'tool');
    setLink(a, liveToolUrl());
    box.appendChild(a);

    var main = document.querySelector('main');
    if (main) { main.insertBefore(box, main.firstChild); box.classList.add('in-main'); }
    else {
      var head = document.querySelector('header, .top-bar');
      if (head && head.parentNode) head.parentNode.insertBefore(box, head.nextSibling); else document.body.insertBefore(box, document.body.firstChild);
    }
  }

  /* ── 3. Remember what the visitor typed; run the sample on fixed example data ── */
  function remember(input) {
    var v = (input.value || '').trim();
    if (v && v !== SAMPLE_VALUE[input.id] && v !== 'example.com') lastTyped = v;
  }
  function useSample(input) {
    if (!input || SAMPLE_FIELDS.indexOf(input.id) === -1 || !input.value.trim()) return;
    remember(input);
    input.value = SAMPLE_VALUE[input.id] || 'example.com';
    refreshBannerLink();
  }
  function refreshBannerLink() {
    var a = document.querySelector('.demo-banner-link');
    if (a) setLink(a, liveToolUrl());
  }

  function wire() {
    document.addEventListener('input', function (e) {
      if (e.target && SAMPLE_FIELDS.indexOf(e.target.id) !== -1) { remember(e.target); refreshBannerLink(); }
    }, true);
    document.addEventListener('submit', function (e) {
      if (e.target && e.target.querySelectorAll) e.target.querySelectorAll('input').forEach(useSample);
    }, true);
    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('[data-demo-live]');
      if (link) {
        if (link.getAttribute('data-demo-live') === 'tool') setLink(link, liveToolUrl());
        if (!link.getAttribute('href') || link.getAttribute('href') === '#') { e.preventDefault(); toast(NOT_SET); }
        return;
      }
      var btn = e.target.closest && e.target.closest('button');
      if (btn && /run\w*(Tool|Audit)/.test(btn.getAttribute('onclick') || '')) {
        SAMPLE_FIELDS.forEach(function (id) { useSample(document.getElementById(id)); });
      }
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') useSample(e.target);
    }, true);
  }

  /* A picture that cannot load (for example a file not yet uploaded) is hidden, not shown broken. */
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.target.style.visibility = 'hidden';
  }, true);

  function start() { addHeaderButton(); addBanner(); wire(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
