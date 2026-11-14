/* ============================================================
   AMK Digital Agency — THEME-ENGINE.JS
   Universal Light & Dark Theme Persistence & Controller.
   Runs immediately in <head> to prevent FOUC / flash of white/dark.
   ============================================================ */
(function initTheme() {
  try {
    var root = document.documentElement;
    var saved = localStorage.getItem('amk_theme') || localStorage.getItem('amk_os_theme');
    var isDark = saved ? (saved.toLowerCase() === 'dark') : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  } catch (e) {}
})();

window.AMKTheme = (function () {
  function updateButtons(isDark) {
    var btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(function (btn) {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = isDark
        ? '<span aria-hidden="true">☀️</span> <span class="theme-label">Light</span>'
        : '<span aria-hidden="true">🌙</span> <span class="theme-label">Dark</span>';
    });
  }

  function set(themeStr) {
    var root = document.documentElement;
    var isDark = String(themeStr).toLowerCase() === 'dark';
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      try {
        localStorage.setItem('amk_theme', 'dark');
        localStorage.setItem('amk_os_theme', 'DARK');
      } catch (e) {}
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      try {
        localStorage.setItem('amk_theme', 'light');
        localStorage.setItem('amk_os_theme', 'LIGHT');
      } catch (e) {}
    }
    updateButtons(isDark);
  }

  function toggle() {
    var isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    set(isDark ? 'light' : 'dark');
  }

  function bindAll() {
    var isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    updateButtons(isDark);
    var toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(function (btn) {
      if (!btn._themeBound) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          window.AMKTheme.toggle();
        });
        btn._themeBound = true;
      }
    });
  }

  return { set: set, toggle: toggle, bindAll: bindAll };
})();

window.toggleAMKTheme = function () { window.AMKTheme.toggle(); };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { window.AMKTheme.bindAll(); });
} else {
  window.AMKTheme.bindAll();
}
