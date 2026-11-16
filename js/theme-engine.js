/* ============================================================
   AMK Digital Agency — THEME-ENGINE.JS
   Auto / Light / Dark theme. Runs in <head> before the page paints, so there is no flash.
   Auto follows the visitor's clock: light from 06:00, dark from 20:00 (checked again every
   10 minutes). Light or Dark chosen by hand is remembered and overrides Auto.
   Stored in localStorage "amk_theme" as auto | light | dark.
   ============================================================ */
(function () {
  var KEY = 'amk_theme';
  var DARK_FROM = 20, LIGHT_FROM = 6;

  function mode() {
    try {
      var v = String(localStorage.getItem(KEY) || '').toLowerCase();
      return v === 'light' || v === 'dark' ? v : 'auto';
    } catch (e) { return 'auto'; }
  }
  function clockDark() {
    var h = new Date().getHours();
    return h >= DARK_FROM || h < LIGHT_FROM;
  }
  function apply(m) {
    var dark = m === 'dark' || (m === 'auto' && clockDark());
    var root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-theme-mode', m);
    root.style.colorScheme = dark ? 'dark' : 'light';
    return dark;
  }
  apply(mode());

  var NEXT = { auto: 'light', light: 'dark', dark: 'auto' };
  var LABEL = { auto: 'Auto', light: 'Light', dark: 'Dark' };
  var HELP = { auto: 'changes with the time of day', light: 'always light', dark: 'always dark' };
  var ICON = { auto: '◐', light: '☀', dark: '☾' };

  function updateButtons() {
    var m = mode();
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', 'Theme: ' + LABEL[m] + ' (' + HELP[m] + '). Switch to ' + LABEL[NEXT[m]] + '.');
      btn.setAttribute('title', 'Theme: ' + LABEL[m] + ', ' + HELP[m]);
      btn.textContent = '';
      var ic = document.createElement('span'); ic.setAttribute('aria-hidden', 'true'); ic.textContent = ICON[m];
      var lb = document.createElement('span'); lb.className = 'theme-label'; lb.textContent = LABEL[m];
      btn.appendChild(ic); btn.appendChild(document.createTextNode(' ')); btn.appendChild(lb);
    });
  }

  function set(m) {
    m = String(m || '').toLowerCase();
    if (m !== 'light' && m !== 'dark') m = 'auto';
    try { localStorage.setItem(KEY, m); localStorage.setItem('amk_os_theme', m.toUpperCase()); } catch (e) {}
    apply(m);
    updateButtons();
  }
  function toggle() { set(NEXT[mode()]); }
  function bindAll() {
    updateButtons();
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      if (btn._themeBound) return;
      btn.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
      btn._themeBound = true;
    });
  }

  // Auto mode: switch at 06:00 and 20:00 without a reload.
  setInterval(function () { if (mode() === 'auto') apply('auto'); }, 600000);

  window.AMKTheme = { set: set, toggle: toggle, bindAll: bindAll, mode: mode };
  window.toggleAMKTheme = toggle;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindAll);
  else bindAll();
})();
