/* AMK Digital Agency: Website Comparison.
   Runs the Domain Overview check on two domains and shows the results side by side.
   Uses callTool() and TOOLS_API from tools-client.js. Every value comes from the
   tools service; anything it could not find is shown as "Not available". */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var NA = 'Not available';

  function cleanDomain(input) {
    return (input || '').trim().toLowerCase()
      .replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  }

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Each function returns { text, value }. value is a number only when it is real, so
  // a missing value can never win a comparison.
  function health(d) {
    var s = d.site || {};
    if (!s.available || s.score == null) return { text: NA };
    return { text: s.score + ' / 100' + (s.grade ? ' (grade ' + s.grade + ')' : ''), value: Number(s.score) };
  }
  function rank(d) {
    var r = d.rank || {};
    if (!r.available || r.rank_score == null) return { text: NA };
    return { text: r.rank_score + ' / 10', value: Number(r.rank_score) };
  }
  function age(d) {
    var r = d.registration || {};
    if (!r.available || r.age_days == null) return { text: NA };
    var years = Math.floor(r.age_days / 365.25);
    var label = years >= 1 ? years + (years === 1 ? ' year' : ' years') : Math.floor(r.age_days / 30) + ' months';
    return { text: label + ' (registered ' + r.registered_on + ')', value: r.age_days };
  }
  function section(d, name) {
    var s = d.site || {};
    return s.available ? ((s.sections || {})[name] || {}) : null;
  }
  function security(d) {
    var s = section(d, 'security');
    if (!s) return { text: NA };
    if (!s.https) return { text: 'No HTTPS' };
    if (!s.ssl_valid) return { text: 'HTTPS on, certificate not valid' };
    return { text: 'Certificate valid' + (s.ssl_expires_in_days != null ? ' (' + s.ssl_expires_in_days + ' days left)' : '') };
  }
  function technology(d) {
    var t = section(d, 'tech_stack');
    if (!t) return { text: NA };
    return { text: (t.detected || []).length ? t.detected.slice(0, 4).join(', ') : 'Not recognised' };
  }
  function issues(d) {
    var s = d.site || {};
    if (!s.available || s.total_issues == null) return { text: NA };
    return { text: String(s.total_issues), value: Number(s.total_issues) };
  }
  function h1(d) {
    var o = section(d, 'on_page');
    if (!o || o.h1_count == null) return { text: NA };
    return { text: o.h1_count === 1 ? 'One' : o.h1_count + ' found' };
  }
  function structured(d) {
    var s = section(d, 'structured_data');
    if (!s) return { text: NA };
    return { text: s.blocks ? s.blocks + (s.blocks === 1 ? ' block' : ' blocks') + ((s.types || []).length ? ': ' + s.types.join(', ') : '') : 'None found' };
  }

  // rule: 'high' or 'low' wins, or null for rows that are not a contest.
  var ROWS = [
    ['On-page health (our check)', health, 'high'],
    ['Domain rank (Open PageRank)', rank, 'high'],
    ['Domain age', age, 'high'],
    ['Security', security, null],
    ['Technology found', technology, null],
    ['Issues found on the home page', issues, 'low'],
    ['Main heading (H1)', h1, null],
    ['Structured data', structured, null]
  ];

  function winner(a, b, rule) {
    if (!rule || a.value == null || b.value == null || a.value === b.value) return 0;
    return ((rule === 'high') === (a.value > b.value)) ? 1 : 2;
  }

  function summaryCard(label, a, b, names, rule) {
    var c = node('div', 'card');
    c.appendChild(node('div', 'label', label));
    var w = winner(a, b, rule);
    var bothMissing = a.value == null && b.value == null, oneMissing = a.value == null || b.value == null;
    c.appendChild(node('div', 'value ' + (w ? 'good' : 'muted'),
      w ? names[w - 1] : bothMissing ? NA : oneMissing ? 'Cannot compare' : 'Equal'));
    c.appendChild(node('div', 'note', a.text + ' vs ' + b.text));
    return c;
  }

  function render(names, data) {
    $('cmp-meta').textContent = names[0] + ' vs ' + names[1] + ' · checked ' + (data[0].checked_at || '') +
      ' · Domain rank source: Open PageRank (not a Google score)';

    var cards = $('cmp-summary-cards');
    cards.textContent = '';
    cards.appendChild(summaryCard('Higher on-page health', health(data[0]), health(data[1]), names, 'high'));
    cards.appendChild(summaryCard('Higher domain rank', rank(data[0]), rank(data[1]), names, 'high'));
    cards.appendChild(summaryCard('Older domain', age(data[0]), age(data[1]), names, 'high'));

    var grid = $('cmp-grid');
    grid.textContent = '';
    [0, 1].forEach(function (i) {
      var col = node('div', 'compare-col');
      var head = node('div', 'compare-col-header');
      head.appendChild(node('h3', '', names[i]));
      col.appendChild(head);
      ROWS.forEach(function (row) {
        var mine = row[1](data[i]), other = row[1](data[1 - i]);
        var r = node('div', 'compare-stat-row');
        r.appendChild(node('span', 'compare-stat-key', row[0]));
        var val = node('span', 'compare-stat-val', mine.text);
        if (winner(mine, other, row[2]) === 1) val.appendChild(node('span', 'winner-badge', 'BETTER'));
        r.appendChild(val);
        col.appendChild(r);
      });
      var site = data[i].site || {};
      if (!site.available && site.reason) col.appendChild(node('p', 'meta', 'Website check: ' + site.reason));
      grid.appendChild(col);
    });

    $('cmp-result').hidden = false;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = $('cmp-form');
    if (!form) return;
    if (!TOOLS_API) {
      $('tools-unavailable').hidden = false;
      $('cmp-run').disabled = true;
      return;
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var names = [cleanDomain($('cmp-d1').value), cleanDomain($('cmp-d2').value)];
      var errEl = $('cmp-error'), loading = $('cmp-loading'), btn = $('cmp-run');
      errEl.hidden = true;
      $('cmp-result').hidden = true;
      $('gate-panel').hidden = true;

      var problem = (!names[0] || !names[1]) ? 'Please enter both domain names.'
        : names[0] === names[1] ? 'Please enter two different domains.' : '';
      if (problem) { errEl.textContent = problem; errEl.hidden = false; return; }

      loading.hidden = false;
      btn.disabled = true;
      try {
        // One after the other, so a free-run limit reached on the first stops the second.
        var first = await callTool('domain-overview', { domain: names[0] });
        var second = await callTool('domain-overview', { domain: names[1] });
        render(names, [first, second]);
      } catch (err) {
        errEl.textContent = err.message || 'The comparison could not be completed. Please try again.';
        errEl.hidden = false;
      } finally {
        loading.hidden = true;
        btn.disabled = false;
      }
    });
  });
})();
