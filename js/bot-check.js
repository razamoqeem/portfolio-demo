/* AMK Digital Agency Website: bot check helper (Cloudflare Turnstile).
   Switched on by setting turnstileSiteKey in js/config.js (the site key is public by design;
   the secret key stays on the server). Without a key, window.AMKBot.enabled is false and
   nothing is loaded. Each call to token() gives one fresh, single-use token. */
(function () {
  'use strict';
  var cfg = window.AMK_SITE || {};
  var siteKey = /^[0-9A-Za-z_-]{10,100}$/.test(cfg.turnstileSiteKey || '') ? cfg.turnstileSiteKey : '';
  var api = { enabled: !!siteKey, token: function () { return Promise.resolve(''); } };

  if (siteKey) {
    var loading = null, holder = null, widgetId = null, pending = null;

    var load = function () {
      if (loading) return loading;
      loading = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.onload = resolve;
        s.onerror = function () { loading = null; reject(new Error('load')); };
        document.head.appendChild(s);
      });
      return loading;
    };

    var settle = function (ok, value) {
      if (!pending) return;
      var p = pending; pending = null;
      if (holder) holder.classList.remove('amk-bot-visible');
      if (ok) p.resolve(value); else p.reject(new Error(value || 'failed'));
    };

    api.token = function () {
      return load().then(function () {
        return new Promise(function (resolve, reject) {
          if (pending) return reject(new Error('busy'));
          pending = { resolve: resolve, reject: reject };
          if (!holder) {
            holder = document.createElement('div');
            holder.className = 'amk-bot-slot';
            document.body.appendChild(holder);
          }
          var timer = setTimeout(function () { settle(false, 'timeout'); }, 60000);
          var done = function (ok, v) { clearTimeout(timer); settle(ok, v); };
          if (widgetId === null) {
            widgetId = window.turnstile.render(holder, {
              sitekey: siteKey, execution: 'execute', appearance: 'interaction-only',
              callback: function (t) { done(true, t); },
              'error-callback': function () { done(false, 'error'); },
              'expired-callback': function () { /* a new token is requested on the next call */ },
              'before-interactive-callback': function () { holder.classList.add('amk-bot-visible'); }
            });
          } else {
            window.turnstile.reset(widgetId);
          }
          window.turnstile.execute(widgetId);
        });
      });
    };
  }
  window.AMKBot = api;
})();
