/* AMK Digital Agency Website: small interactions. No libraries, strict-CSP safe (CSSOM only).
   1. Hero "growth stack": click or tap a broken block to fix it; the growth line rises.
   2. Cards: a soft light follows the pointer (mouse only).
   3. Buttons: a tap ripple at the touch point (touch and pen).
   Everything respects "reduce motion" and listens passively. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stack(root) {
    var blocks = [].slice.call(root.querySelectorAll('.x-block'));
    var count = root.querySelector('[data-stack-count]');
    var score = root.querySelector('.x-stack-score');
    var total = blocks.length;
    function update() {
      var n = blocks.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
      root.style.setProperty('--rise', String(0.3 + 0.7 * n / total));
      if (count) count.textContent = String(n);
      var done = n === total;
      root.classList.toggle('is-done', done);
      if (score) score.lastChild.textContent = done ? ' of ' + total + ' fixed. Stack complete.' : ' of ' + total + ' fixed';
    }
    blocks.forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        update();
        if (on && root.classList.contains('is-done') && navigator.vibrate && !reduce) { try { navigator.vibrate(10); } catch (e) {} }
      });
    });
    update();
  }

  function spotlight() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var frame = 0, card = null, x = 0, y = 0;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.x-card, .x-feature');
      if (!c) return;
      var r = c.getBoundingClientRect();
      card = c; x = e.clientX - r.left; y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(function () {
        frame = 0;
        if (card) { card.style.setProperty('--mx', x + 'px'); card.style.setProperty('--my', y + 'px'); }
      });
    }, { passive: true });
  }

  function ripple() {
    if (reduce) return;
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var b = e.target.closest && e.target.closest('.x-btn, .amk-cta, .x-block');
      if (!b) return;
      var r = b.getBoundingClientRect();
      var dot = document.createElement('span');
      dot.className = 'fx-ripple';
      dot.setAttribute('aria-hidden', 'true');
      dot.style.setProperty('--rx', (e.clientX - r.left) + 'px');
      dot.style.setProperty('--ry', (e.clientY - r.top) + 'px');
      b.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 650);
    }, { passive: true });
  }

  function start() {
    [].forEach.call(document.querySelectorAll('[data-stack]'), stack);
    spotlight();
    ripple();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
