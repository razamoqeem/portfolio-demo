/* AMK Digital Agency Website: result layouts for the single-purpose tool pages.
   Each tool has its own layout below. Values are placed as plain text only. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var out;

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function num(v) { return Number(v || 0).toLocaleString('en-US'); }
  function plural(n, word) { return num(n) + ' ' + word + (n === 1 ? '' : 's'); }

  function heading(text) { out.appendChild(node('h2', '', text)); }
  function note(text) { out.appendChild(node('p', 'meta', text)); }
  function cards() { var c = node('div', 'cards'); out.appendChild(c); return c; }
  function panel() { var p = node('div', 'panel'); out.appendChild(p); return p; }
  function card(box, label, value, state, sub) {
    var c = node('div', 'card');
    c.appendChild(node('div', 'label', label));
    c.appendChild(node('div', 'value ' + (state || ''), value));
    if (sub) c.appendChild(node('div', 'note', sub));
    box.appendChild(c);
  }
  function row(box, key, value, state, why) {
    var r = node('div', 'row');
    r.appendChild(node('span', 'k', key));
    r.appendChild(node('span', 'v ' + (state || ''), value == null || value === '' ? 'Not set' : value));
    if (why) r.appendChild(node('span', 'why', why));
    box.appendChild(r);
  }
  function item(box, main, sub, tag, tagState, cls) {
    var i = node('div', 'item ' + (cls || ''));
    if (tag) i.appendChild(node('span', 'tag ' + (tagState || ''), tag));
    i.appendChild(node('span', '', main));
    if (sub) i.appendChild(node('span', 'sub', sub));
    box.appendChild(i);
  }
  function lengthState(n, min, max) { return n >= min && n <= max ? 'good' : 'warn'; }

  var LAYOUTS = {
    'meta-tags': function (d) {
      var m = d.meta;
      heading('Search result preview');
      var pv = node('div', 'preview');
      pv.appendChild(node('div', 'p-url', d.final_url));
      pv.appendChild(node('div', 'p-title', m.title || '(no title)'));
      pv.appendChild(node('div', 'p-desc', m.description || '(no description: the search engine will pick text from the page)'));
      out.appendChild(pv);
      note('A guide only. Search engines can rewrite titles and descriptions.');
      heading('Main tags');
      var p = panel();
      row(p, 'Title', m.title ? m.title_length + ' characters' : '✗ Missing', m.title ? lengthState(m.title_length, 30, 60) : 'bad', m.title ? m.title + ' · Aim for 30 to 60 characters.' : '');
      row(p, 'Meta description', m.description ? m.description_length + ' characters' : '✗ Missing', m.description ? lengthState(m.description_length, 120, 160) : 'warn', m.description ? m.description + ' · Aim for 120 to 160 characters.' : '');
      row(p, 'Canonical address', m.canonical, m.canonical ? 'good' : 'warn');
      var robots = [m.robots, m.x_robots_tag].filter(Boolean).join(' · ');
      row(p, 'Robots instructions', robots || 'None (the page can be listed)', /noindex/i.test(robots) ? 'bad' : 'good');
      row(p, 'Mobile viewport', m.viewport, m.viewport ? 'good' : 'bad');
      row(p, 'Language', m.language, m.language ? 'good' : 'warn');
      row(p, 'Character set', m.charset);
      [['Open Graph tags (social previews)', m.open_graph, 'og:'], ['Twitter tags', m.twitter, 'twitter:']].forEach(function (g) {
        heading(g[0]);
        var box = panel(), keys = Object.keys(g[1]);
        if (!keys.length) row(box, 'Result', 'None found', 'warn');
        keys.forEach(function (k) { row(box, g[2] + k, g[1][k]); });
      });
    },

    'headings': function (d) {
      var h = d.headings, c = cards(), levels = [];
      for (var n = 1; n <= 6; n++) card(c, 'H' + n, num(h.counts['h' + n]), n === 1 ? (h.counts.h1 === 1 ? 'good' : 'bad') : '');
      heading('Structure checks');
      var p = panel(), prev = 0, skipped = 0;
      h.outline.forEach(function (x) { if (prev && x.level > prev + 1) skipped++; prev = x.level; });
      row(p, 'Main heading (H1)', h.counts.h1 === 1 ? '✓ Exactly one' : h.counts.h1 === 0 ? '✗ Missing' : '✗ ' + h.counts.h1 + ' found', h.counts.h1 === 1 ? 'good' : 'bad', 'A page should have one H1 that says what the page is about.');
      row(p, 'First heading on the page', h.outline.length ? 'H' + h.outline[0].level : 'None', h.outline.length && h.outline[0].level === 1 ? 'good' : 'warn');
      row(p, 'Skipped levels', skipped ? plural(skipped, 'place') : 'None', skipped ? 'warn' : 'good', 'For example an H4 directly after an H2.');
      heading('Outline (' + plural(h.total, 'heading') + ')');
      var o = panel();
      if (!h.outline.length) row(o, 'Result', 'No headings found', 'bad');
      h.outline.forEach(function (x) { item(o, x.text || '(empty heading)', null, 'H' + x.level, x.level === 1 ? 'good' : '', 'lvl-' + x.level); });
      if (h.total > h.outline.length) note('Showing the first ' + h.outline.length + '.');
    },

    'images': function (d) {
      var im = d.images, c = cards();
      card(c, 'Images found', num(im.total));
      card(c, 'No alt text', num(im.missing_alt), im.missing_alt ? 'bad' : 'good');
      card(c, 'Empty alt text', num(im.empty_alt), '', 'Correct only for decorative images');
      card(c, 'No width and height', num(im.without_size), im.without_size ? 'warn' : 'good');
      var missing = im.items.filter(function (i) { return i.alt === null; });
      heading('Images with no alt text');
      var p = panel();
      if (!missing.length) row(p, 'Result', im.total ? 'Every image has an alt attribute' : 'No images on this page', 'good');
      missing.forEach(function (i) { item(p, i.src, i.has_size ? null : 'Also has no width and height', 'No alt', 'bad'); });
      var described = im.items.filter(function (i) { return i.alt; });
      if (described.length) {
        heading('Images with a description');
        var q = panel();
        described.slice(0, 50).forEach(function (i) { item(q, i.alt, i.src); });
      }
      if (im.total > im.items.length) note('Showing the first ' + im.items.length + ' images.');
    },

    'links': function (d) {
      var c = cards(), groups = { broken: [], blocked: [], unknown: [], ok: [] };
      d.checked.forEach(function (l) { groups[l.state].push(l); });
      card(c, 'Internal links', num(d.internal_total));
      card(c, 'External links', num(d.external_total));
      card(c, 'Marked nofollow', num(d.nofollow_total));
      card(c, 'Broken (of ' + d.checked_total + ' tested)', num(d.broken), d.broken ? 'bad' : 'good');
      if (d.not_checked > 0) note(plural(d.not_checked, 'link') + ' on this page were not tested. The free check tests the first ' + d.checked_total + ', internal links first.');
      [['Broken links', groups.broken, 'bad', 'No broken links among those tested'],
       ['Links that refuse automated checks', groups.blocked, 'warn', null],
       ['Links that gave no answer', groups.unknown, 'warn', null]].forEach(function (g) {
        if (!g[1].length && !g[3]) return;
        heading(g[0]);
        var p = panel();
        if (!g[1].length) row(p, 'Result', g[3], 'good');
        g[1].forEach(function (l) { item(p, l.url, (l.text ? 'Link text: ' + l.text + ' · ' : '') + l.kind + (l.reason ? ' · ' + l.reason : ''), l.status_code ? String(l.status_code) : 'No answer', g[2]); });
      });
      if (groups.blocked.length) note('Codes 401, 403 and 429 usually mean the other site blocks automated checks. Open these in a browser to be sure.');
      heading('Working links (' + groups.ok.length + ')');
      var ok = panel();
      if (!groups.ok.length) row(ok, 'Result', 'None', 'warn');
      groups.ok.forEach(function (l) { item(ok, l.url, l.text ? 'Link text: ' + l.text : null, String(l.status_code), 'good'); });
    },

    'redirects': function (d) {
      var c = cards(), ok = d.final_status < 400;
      card(c, 'Final status code', String(d.final_status), ok ? 'good' : 'bad', ok ? 'The page answers normally' : 'The page answers with an error');
      card(c, 'Redirects', num(d.redirects), d.redirects > 1 ? 'warn' : 'good', d.redirects > 1 ? 'More than one hop slows the visit' : '');
      card(c, 'Moves to https', d.http_to_https ? 'Yes' : (/^https:/.test(d.final_url) ? 'Already https' : 'No'), /^https:/.test(d.final_url) ? 'good' : 'bad');
      heading('Hop by hop');
      var p = panel();
      d.hops.forEach(function (h, i) {
        var code = h.status_code, state = code >= 400 ? 'bad' : code >= 300 ? 'warn' : 'good';
        item(p, h.url, i === d.hops.length - 1 ? 'Final address' : (code === 301 || code === 308 ? 'Permanent redirect' : 'Temporary redirect'), String(code), state);
      });
      heading('Details');
      var q = panel();
      row(q, 'Site name changes on the way', d.host_changed ? 'Yes' : 'No');
      row(q, 'Server software', d.server);
      row(q, 'Content type', d.content_type);
    },

    'robots-sitemap': function (d) {
      var r = d.robots, c = cards(), found = d.sitemaps.filter(function (s) { return s.found; });
      card(c, 'robots.txt', r.found ? 'Found' : 'Not found', r.found ? 'good' : 'warn');
      if (r.found) card(c, 'Blocks all search engines', r.blocks_all_crawlers ? 'Yes' : 'No', r.blocks_all_crawlers ? 'bad' : 'good');
      card(c, 'Sitemaps found', num(found.length), found.length ? 'good' : 'warn');
      card(c, 'Addresses in sitemaps', num(d.sitemap_url_total));
      if (r.found) {
        heading('Crawler groups (' + plural(r.rule_total, 'rule') + ')');
        var g = panel();
        r.groups.forEach(function (x) { row(g, x.agents.join(', '), x.allow + ' allow · ' + x.disallow + ' disallow' + (x.crawl_delay ? ' · delay ' + x.crawl_delay : '')); });
        heading('Rules');
        var p = panel();
        if (!r.rules.length) row(p, 'Result', 'No allow or disallow rules', 'good');
        r.rules.forEach(function (x) { item(p, x.path, 'For: ' + x.agent, x.rule, x.rule === 'Allow' ? 'good' : 'warn'); });
        if (r.rule_total > r.rules.length) note('Showing the first ' + r.rules.length + ' rules.');
      }
      heading('Sitemaps');
      var s = panel();
      if (!d.sitemaps.length) row(s, 'Result', 'No sitemap found at the usual addresses, and none is listed in robots.txt', 'warn');
      d.sitemaps.forEach(function (x) {
        item(s, x.url, !x.found ? 'Listed in robots.txt but could not be read' : x.type === 'index'
          ? 'Index of ' + plural(x.child_sitemaps, 'sitemap') + ' · ' + num(x.url_count) + ' addresses counted in the first ' + x.children_counted
          : num(x.url_count) + ' addresses', x.found ? 'Found' : 'Problem', x.found ? 'good' : 'bad');
      });
    },

    'ssl-check': function (d) {
      var c = cards();
      card(c, 'Certificate', d.valid ? 'Valid' : 'Not valid', d.valid ? 'good' : 'bad', d.host);
      if (!d.valid) { heading('Problem'); row(panel(), 'Reason', d.problem, 'bad'); return; }
      card(c, 'Days left', num(d.days_left), d.days_left > 30 ? 'good' : d.days_left > 14 ? 'warn' : 'bad', 'Ends ' + d.valid_until);
      card(c, 'Issued by', d.issuer || 'Not stated');
      heading('Details');
      var p = panel();
      row(p, 'Issued to', d.issued_to);
      row(p, 'Valid from', d.valid_from);
      row(p, 'Valid until', d.valid_until);
      row(p, 'Connection version', d.protocol, /1\.[23]/.test(d.protocol || '') ? 'good' : 'warn');
      row(p, 'Encryption method', d.cipher);
      row(p, 'Names covered (' + d.names_total + ')', d.names.join(', '));
    },

    'schema-social': function (d) {
      var sd = d.structured_data || {}, so = d.social || {}, og = so.open_graph || {}, tw = so.twitter || {}, c = cards();
      card(c, 'Structured data blocks', num(sd.blocks), sd.blocks ? 'good' : 'warn');
      card(c, 'Types', num((sd.types || []).length));
      card(c, 'Open Graph tags', num(Object.keys(og).length), Object.keys(og).length ? 'good' : 'warn');
      card(c, 'Twitter tags', num(Object.keys(tw).length));
      heading('Structured data');
      var p = panel();
      row(p, 'Types found', (sd.types || []).length ? sd.types.join(', ') : 'None', (sd.types || []).length ? 'good' : 'warn');
      (sd.parse_errors || []).forEach(function (e) { row(p, 'Block that could not be read', typeof e === 'string' ? e : JSON.stringify(e), 'bad'); });
      (sd.incomplete || []).forEach(function (e) { row(p, 'Missing recommended fields', typeof e === 'string' ? e : (e.type || '') + ': ' + (e.missing || []).join(', '), 'warn'); });
      [['Open Graph tags', og, 'og:'], ['Twitter tags', tw, 'twitter:']].forEach(function (g) {
        heading(g[0]);
        var box = panel(), keys = Object.keys(g[1]);
        if (!keys.length) row(box, 'Result', 'None found', 'warn');
        keys.forEach(function (k) { row(box, g[2] + k, String(g[1][k])); });
      });
    },

    'keyword-density': function (d) {
      var t = d.text, c = cards(), r = t.readability;
      card(c, 'Words', num(t.word_count), t.word_count >= 300 ? 'good' : 'warn');
      if (r) {
        var s = r.flesch_reading_ease;
        card(c, 'Reading ease (Flesch)', String(s), s >= 60 ? 'good' : s >= 30 ? 'warn' : 'bad', s >= 60 ? 'Easy to read' : s >= 30 ? 'Fairly hard to read' : 'Hard to read');
        card(c, 'Words per sentence', String(r.words_per_sentence));
      } else {
        card(c, 'Reading ease', 'Not available', 'muted', 'Worked out for English pages only');
      }
      if (r) note('Reading ease uses the standard Flesch formula and counts syllables by rule. Menus and buttons are part of the text, so treat it as a guide.');
      heading('Most used words');
      var p = panel();
      if (!t.top_words.length) row(p, 'Result', 'No text found', 'warn');
      t.top_words.forEach(function (w) { row(p, w.word, w.count + ' times · ' + w.percent + '%'); });
      heading('Repeated two-word phrases');
      var q = panel();
      if (!t.top_phrases.length) row(q, 'Result', 'None repeated');
      t.top_phrases.forEach(function (w) { row(q, w.phrase, w.count + ' times'); });
    },

    'technology': function (d) {
      var t = d.tech_stack || {}, s = d.security || {}, c = cards(), found = t.detected || [];
      card(c, 'Systems recognised', num(found.length), found.length ? 'good' : 'muted');
      card(c, 'HTTPS', s.https ? 'On' : 'Off', s.https ? 'good' : 'bad');
      card(c, 'Security headers set', num((s.headers_present || []).length), '', (s.headers_missing || []).length + ' missing');
      heading('Technology');
      var p = panel();
      row(p, 'Recognised systems', found.length ? found.join(', ') : 'Not recognised', '', 'Only common systems can be recognised from the page.');
      row(p, 'Server software', t.server_header || 'Not stated by the site');
      row(p, 'Generator tag', t.generator || 'Not stated by the site');
      heading('Security headers');
      var q = panel();
      (s.headers_present || []).forEach(function (h) { row(q, h, '✓ Set', 'good'); });
      (s.headers_missing || []).forEach(function (h) { row(q, h, '✗ Missing', 'warn'); });
    }
  };

  function init() {
    var form = $('tool-form');
    if (!form) return;
    var tool = form.dataset.tool;
    out = $('tool-result');
    if (!TOOLS_API) { $('tools-unavailable').hidden = false; $('tool-run').disabled = true; return; }
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var url = $('tool-url').value.trim();
      if (!url) return;
      $('tool-error').hidden = true; out.hidden = true; $('gate-panel').hidden = true;
      $('tool-loading').hidden = false; $('tool-run').disabled = true;
      try {
        var data = await callTool(tool, { url: url });
        out.textContent = '';
        if (data.final_url) note('Checked: ' + data.final_url);
        LAYOUTS[tool](data);
        out.hidden = false;
      } catch (err) {
        $('tool-error').textContent = err.message;
        $('tool-error').hidden = false;
      }
      $('tool-loading').hidden = true; $('tool-run').disabled = false;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
