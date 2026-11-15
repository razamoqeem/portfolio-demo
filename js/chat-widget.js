/* AMK Digital Agency Website: growth assistant chat widget.
   Shows only when the server says the chat is switched on. All text from the server or the
   visitor is placed with textContent, never as HTML. Model names never reach this file:
   the visitor picks a friendly mode and the server maps it. */
(function () {
  'use strict';
  if (window.__amkChat) return;
  window.__amkChat = true;

  var MODES = [
    { id: 'fast', label: 'Fast Assistant' },
    { id: 'strategist', label: 'SEO & Growth Strategist' },
    { id: 'auto', label: 'Smart Auto Mode' }
  ];
  var STORE = 'amk_chat_v1';
  var MAX_LEN = 600;
  var state = { open: false, mode: 'fast', messages: [], usage: null, busy: false, limited: false };
  var el = {};

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function save() {
    try { sessionStorage.setItem(STORE, JSON.stringify({ mode: state.mode, messages: state.messages.slice(-20) })); } catch (e) { /* optional */ }
  }
  function restore() {
    try {
      var raw = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (raw && Array.isArray(raw.messages)) {
        state.messages = raw.messages.filter(function (m) { return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'; }).slice(-20);
        if (MODES.some(function (m) { return m.id === raw.mode; })) state.mode = raw.mode;
      }
    } catch (e) { /* start fresh */ }
  }

  function post(url, body) {
    return fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: { code: 'bad_response', message: 'The server sent an unreadable answer.' } }; }); });
  }

  function getToken() {
    if (window.AMKBot && window.AMKBot.enabled) return window.AMKBot.token();
    return Promise.resolve('');
  }

  /* ── Rendering ─────────────────────────────────────────── */
  function addBubble(role, text, cls) {
    var b = node('div', 'amk-chat-msg ' + (cls || (role === 'user' ? 'is-user' : 'is-bot')), text);
    el.log.appendChild(b);
    el.log.scrollTop = el.log.scrollHeight;
    return b;
  }

  function renderUsage() {
    var u = state.usage;
    if (!u) { el.usageText.textContent = 'Messages left today: checking'; return; }
    el.usageText.textContent = 'Messages left today: ' + u.remaining + ' / ' + u.limit;
    var pct = u.limit ? Math.max(0, Math.min(100, Math.round((u.remaining / u.limit) * 100))) : 0;
    el.barFill.style.width = pct + '%';
    el.bar.classList.toggle('is-mid', pct <= 50 && pct > 20);
    el.bar.classList.toggle('is-low', pct <= 20);
  }

  function setLimited(limited) {
    state.limited = limited;
    el.form.hidden = limited;
    el.lead.hidden = !limited;
    if (limited) {
      if (!el.log.querySelector('.amk-limit-note')) {
        var note = addBubble('bot', 'Daily free chat limit reached', 'is-note amk-limit-note');
        note.setAttribute('role', 'status');
      }
      el.leadName.focus();
    }
  }

  function renderAll() {
    el.log.textContent = '';
    if (!state.messages.length) {
      addBubble('bot', 'Hi! Ask me about SEO, AI search, paid ads or our free tools. I only know what is on this website.', 'is-bot');
    }
    state.messages.forEach(function (m) { addBubble(m.role, m.content); });
    renderUsage();
    setLimited(!!(state.usage && state.usage.remaining === 0));
  }

  /* ── Sending ───────────────────────────────────────────── */
  function send(text) {
    if (state.busy || state.limited) return;
    text = String(text || '').trim();
    if (!text) return;
    if (text.length > MAX_LEN) { addBubble('bot', 'Please keep your message under ' + MAX_LEN + ' characters.', 'is-error'); return; }
    state.busy = true;
    el.send.disabled = true;
    el.input.value = '';
    addBubble('user', text);
    var history = state.messages.slice(-6);
    var typing = addBubble('bot', 'Thinking...', 'is-bot amk-chat-typing');
    var done = function () { state.busy = false; el.send.disabled = false; };

    getToken().then(function (token) {
      return post('/api/chat', { message: text, mode: state.mode, history: history, turnstile_token: token });
    }).then(function (out) {
      typing.remove();
      if (out && out.usage) { state.usage = out.usage; renderUsage(); }
      if (out && out.ok) {
        state.messages.push({ role: 'user', content: text }, { role: 'assistant', content: out.reply });
        state.messages = state.messages.slice(-20);
        save();
        addBubble('assistant', out.reply);
        if (state.usage && state.usage.remaining === 0) setLimited(true);
      } else {
        var code = out && out.error && out.error.code;
        if (code === 'limit_reached' || code === 'busy') { setLimited(true); }
        else { addBubble('bot', (out && out.error && out.error.message) || 'That did not work. Please try again.', 'is-error'); }
      }
      done();
    }).catch(function () {
      typing.remove();
      addBubble('bot', 'The security check could not finish. Please reload the page and try again.', 'is-error');
      done();
    });
  }

  function submitLead(event) {
    event.preventDefault();
    var msg = el.leadMsg;
    msg.className = 'amk-lead-msg';
    msg.textContent = '';
    if (!el.leadConsent.checked) { msg.className = 'amk-lead-msg is-error'; msg.textContent = 'Please tick the box so we may contact you.'; return; }
    var btn = el.lead.querySelector('button[type="submit"]');
    btn.disabled = true;
    getToken().then(function (token) {
      return post('/v1/leads', {
        name: el.leadName.value, email: el.leadEmail.value, website: el.leadSite.value, consent: true,
        company_site: el.leadTrap.value, source: 'chat', turnstile_token: token
      });
    }).then(function (out) {
      if (out && out.ok) {
        el.lead.textContent = '';
        el.lead.appendChild(node('p', 'amk-lead-msg is-ok', 'Thank you. We have your request and will be in touch.'));
      } else {
        msg.className = 'amk-lead-msg is-error';
        msg.textContent = (out && out.error && out.error.message) || 'That did not work. Please try again.';
        btn.disabled = false;
      }
    }).catch(function () {
      msg.className = 'amk-lead-msg is-error';
      msg.textContent = 'The security check could not finish. Please reload the page and try again.';
      btn.disabled = false;
    });
  }

  /* ── Open and close ────────────────────────────────────── */
  function setOpen(open) {
    state.open = open;
    el.panel.hidden = !open;
    el.launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    el.launcher.setAttribute('aria-label', open ? 'Close chat assistant' : 'Open chat assistant');
    if (open) { renderAll(); (state.limited ? el.leadName : el.input).focus(); }
    else el.launcher.focus();
  }

  /* ── Build ─────────────────────────────────────────────── */
  function build() {
    var root = node('div', 'amk-chat');
    root.setAttribute('data-amk-chat', '');

    el.launcher = node('button', 'amk-chat-launcher');
    el.launcher.type = 'button';
    el.launcher.setAttribute('aria-controls', 'amk-chat-panel');
    el.launcher.setAttribute('aria-expanded', 'false');
    el.launcher.setAttribute('aria-label', 'Open chat assistant');
    el.launcher.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>';
    el.launcher.appendChild(node('span', '', 'Ask AMK'));

    el.panel = node('section', 'amk-chat-panel');
    el.panel.id = 'amk-chat-panel';
    el.panel.setAttribute('role', 'dialog');
    el.panel.setAttribute('aria-label', 'AMK Growth Assistant');
    el.panel.hidden = true;

    var head = node('header', 'amk-chat-head');
    var title = node('div', 'amk-chat-title');
    title.appendChild(node('strong', '', 'AMK Growth Assistant'));
    title.appendChild(node('span', '', 'AI assistant. Answers may be wrong.'));
    var modebar = node('div', 'amk-chat-modebar');
    var selLabel = node('label', '', 'Mode');
    selLabel.setAttribute('for', 'amk-chat-mode');
    el.mode = node('select', 'amk-chat-mode');
    el.mode.id = 'amk-chat-mode';
    MODES.forEach(function (m) { var o = node('option', '', m.label); o.value = m.id; el.mode.appendChild(o); });
    el.mode.value = state.mode;
    var close = node('button', 'amk-chat-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close chat');
    head.append(title, close);
    modebar.append(selLabel, el.mode);

    var usage = node('div', 'amk-chat-usage');
    el.usageText = node('div', 'amk-chat-usage-text');
    el.usageText.setAttribute('role', 'status');
    el.bar = node('div', 'amk-chat-bar');
    el.barFill = node('span');
    el.bar.appendChild(el.barFill);
    usage.append(el.usageText, el.bar);

    el.log = node('div', 'amk-chat-log');
    el.log.setAttribute('role', 'log');
    el.log.setAttribute('aria-live', 'polite');

    el.form = node('form', 'amk-chat-form');
    el.input = node('textarea', 'amk-chat-input');
    el.input.rows = 1;
    el.input.maxLength = MAX_LEN;
    el.input.placeholder = 'Ask about SEO, AI search or our tools';
    el.input.setAttribute('aria-label', 'Your message');
    el.send = node('button', 'amk-chat-send', 'Send');
    el.send.type = 'submit';
    el.form.append(el.input, el.send);

    el.lead = node('form', 'amk-chat-lead');
    el.lead.hidden = true;
    el.lead.noValidate = false;
    el.lead.appendChild(node('h2', '', 'Request a free audit or App invite'));
    el.lead.appendChild(node('p', '', 'Our free chat allowance for today is used up. Leave your details and we will get back to you.'));
    var field = function (label, type, name, required, auto) {
      var l = node('label', '', label);
      var i = node('input'); i.type = type; i.name = name; i.required = !!required; i.maxLength = name === 'email' ? 254 : 200; if (auto) i.autocomplete = auto;
      l.appendChild(i);
      el.lead.appendChild(l);
      return i;
    };
    el.leadName = field('Name', 'text', 'name', true, 'name');
    el.leadEmail = field('Work email', 'email', 'email', true, 'email');
    el.leadSite = field('Website address (optional)', 'url', 'website', false, 'url');
    var trap = node('label', 'amk-trap', 'Leave this empty');
    trap.setAttribute('aria-hidden', 'true');
    el.leadTrap = node('input'); el.leadTrap.type = 'text'; el.leadTrap.name = 'company_site'; el.leadTrap.tabIndex = -1; el.leadTrap.autocomplete = 'off';
    trap.appendChild(el.leadTrap);
    el.lead.appendChild(trap);
    var consent = node('label', 'amk-consent');
    el.leadConsent = node('input'); el.leadConsent.type = 'checkbox';
    consent.append(el.leadConsent, node('span', '', 'I agree to be contacted about this request. We use your details only to reply.'));
    el.lead.appendChild(consent);
    var submit = node('button', '', 'Send request'); submit.type = 'submit';
    el.leadMsg = node('p', 'amk-lead-msg'); el.leadMsg.setAttribute('role', 'status');
    el.lead.append(submit, el.leadMsg);

    el.panel.append(head, modebar, usage, el.log, el.form, el.lead);
    root.append(el.panel, el.launcher);
    document.body.appendChild(root);

    el.launcher.addEventListener('click', function () { setOpen(!state.open); });
    close.addEventListener('click', function () { setOpen(false); });
    el.panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    el.mode.addEventListener('change', function () { state.mode = el.mode.value; save(); });
    el.form.addEventListener('submit', function (e) { e.preventDefault(); send(el.input.value); });
    el.input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(el.input.value); } });
    el.lead.addEventListener('submit', submitLead);
  }

  /* ── Start: show the widget only when the server has the chat switched on ── */
  function start() {
    restore();
    fetch('/api/chat', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (info) {
        if (!info || !info.ok || !info.enabled) return;
        state.usage = info.usage;
        build();
        renderUsage();
      })
      .catch(function () { /* no chat on this host: show nothing */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
