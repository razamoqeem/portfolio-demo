/* AMK Digital Agency Website: Contact page form. Sends to the existing secure request endpoint (/v1/leads),
   with the bot check when it is switched on. All feedback is plain text. */
(function () {
  'use strict';
  function start() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var msg = document.getElementById('contact-msg');
    var btn = form.querySelector('button[type="submit"]');
    var say = function (text, kind) { msg.textContent = text; msg.className = 'x-form-msg' + (kind ? ' is-' + kind : ''); };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      if (!v('c-name')) { say('Please enter your name.', 'error'); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('c-email'))) { say('Please enter a valid email address.', 'error'); return; }
      if (!document.getElementById('c-consent').checked) { say('Please tick the box so we may contact you.', 'error'); return; }
      btn.disabled = true;
      say('Sending...', '');
      var token = (window.AMKBot && window.AMKBot.enabled) ? window.AMKBot.token() : Promise.resolve('');
      token.then(function (t) {
        return fetch('/v1/leads', {
          method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: v('c-name'), email: v('c-email'), website: v('c-site'), message: v('c-msg'),
            consent: true, company_site: v('c-company'), source: 'contact', turnstile_token: t })
        });
      }).then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (out) {
          if (out && out.ok) { form.reset(); say('Thank you. We have your message and will reply by email.', 'ok'); }
          else { say((out && out.error && out.error.message) || 'Your message could not be sent. Please try again later.', 'error'); }
          btn.disabled = false;
        })
        .catch(function () { say('The security check could not finish. Please reload the page and try again.', 'error'); btn.disabled = false; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
