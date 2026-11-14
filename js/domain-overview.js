/* AMK Digital Agency Website: Domain Overview page.
   Shows one report from the tools service. Every value is put on the page as
   plain text. A part with no data says why instead of showing a number. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function num(v) { return v == null ? null : Number(v).toLocaleString('en-US'); }
  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  /* One summary card. state: good / warn / bad / '' */
  function card(box, label, value, note, state, barPct) {
    var c = node('div', 'card');
    c.appendChild(node('div', 'label', label));
    c.appendChild(node('div', 'value ' + (state || ''), value));
    if (barPct != null) {
      var bar = node('div', 'bar');
      bar.appendChild(node('span', 'w-' + Math.max(0, Math.min(100, Math.round(barPct / 10) * 10)) + ' ' + (state || '')));
      c.appendChild(bar);
    }
    if (note) c.appendChild(node('div', 'note', note));
    box.appendChild(c);
  }

  /* One line in a panel. */
  function row(box, key, value, state, why) {
    var r = node('div', 'row');
    r.appendChild(node('span', 'k', key));
    r.appendChild(node('span', 'v ' + (state || ''), value));
    if (why) r.appendChild(node('span', 'why', why));
    box.appendChild(r);
  }
  function yesNo(ok, yes, no) { return [ok ? '✓ ' + yes : '✗ ' + no, ok ? 'good' : 'bad']; }

  function clear() {
    ['ov-cards', 'ov-authority', 'ov-technical', 'ov-issues', 'ov-health'].forEach(function (id) { $(id).textContent = ''; });
  }

  function render(d) {
    clear();
    var site = d.site || {}, reg = d.registration || {}, rank = d.rank || {}, host = d.hosting || {};
    var sec = site.available ? site.sections : {};
    var s = sec.security || {}, on = sec.on_page || {}, crawl = sec.crawlability || {}, idx = sec.indexability || {};
    var sd = sec.structured_data || {}, img = sec.images || {}, red = sec.redirects || {}, links = sec.links || {};
    var tech = sec.tech_stack || {}, social = sec.social || {}, canon = sec.canonical || {}, mixed = sec.mixed_content || {};

    $('ov-meta').textContent = d.domain + ' · checked ' + d.checked_at + ' · results are saved for 24 hours';

    /* ── Summary ── */
    var cards = $('ov-cards');
    if (site.available) {
      var sc = site.score;
      card(cards, 'On-page health (our check)', sc + ' / 100', 'Grade ' + site.grade + ' · ' + plural(site.total_issues, 'issue') + ' on the home page',
           sc >= 80 ? 'good' : sc >= 60 ? 'warn' : 'bad', sc);
    } else {
      card(cards, 'On-page health (our check)', 'Not available', site.reason, 'muted');
    }
    if (rank.available) {
      var rs = Number(rank.rank_score);
      card(cards, 'Domain rank (Open PageRank)', rs + ' / 10', 'Not a Google score · data from ' + (rank.data_date || 'unknown date'),
           rs >= 6 ? 'good' : rs >= 3 ? 'warn' : 'bad', rs * 10);
      card(cards, 'Referring domains', rank.referring_domains != null ? num(rank.referring_domains) : 'Not published',
           'Different websites that link to this domain');
    } else {
      card(cards, 'Domain rank', 'Not available', rank.reason, 'muted');
    }
    if (reg.available) {
      var y = Math.floor(reg.age_days / 365);
      card(cards, 'Domain age', y >= 1 ? plural(y, 'year') : plural(Math.floor(reg.age_days / 30), 'month'), 'Registered ' + reg.registered_on);
    } else {
      card(cards, 'Domain age', 'Not available', reg.reason, 'muted');
    }
    if (site.available) {
      card(cards, 'Security', s.https ? 'HTTPS on' : 'No HTTPS', s.ssl_valid ? 'Certificate valid' + (s.ssl_expires_in_days != null ? ' · ' + s.ssl_expires_in_days + ' days left' : '') : 'Certificate problem',
           s.https && s.ssl_valid ? 'good' : 'bad');
      var noindex = /noindex/.test((idx.meta_robots || '') + ' ' + (idx.x_robots_tag || ''));
      card(cards, 'Search engines', noindex ? 'Blocked' : 'Allowed', noindex ? 'The home page asks not to be listed (noindex)' : 'The home page can be listed', noindex ? 'bad' : 'good');
    }

    /* ── Authority and links ── */
    var a = $('ov-authority');
    if (rank.available) {
      row(a, 'Domain rank', rank.rank_score + ' / 10', '', 'A public score built from links between websites. Source: Open PageRank.');
      row(a, 'Position among all ranked domains', rank.global_position != null ? '#' + num(rank.global_position) : 'Not published');
      row(a, 'Referring domains', rank.referring_domains != null ? num(rank.referring_domains) : 'Not published');
      row(a, 'Data date', rank.data_date || 'Not published');
    } else {
      row(a, 'Domain rank', 'Not available', 'muted', rank.reason);
    }
    if (site.available) {
      row(a, 'Links on the home page', num(links.internal || 0) + ' internal · ' + num(links.external || 0) + ' external', '', 'Counted on the page itself by our check.');
    }
    row(a, 'Domain Authority, Page Authority, Domain Rating, URL Rating, Spam Score', 'Not available', 'muted',
        'These are the private scores of other companies. They can only be shown with a paid licence from the company that owns each one, and they are not interchangeable. We do not imitate them.');

    /* ── Technical SEO ── */
    var t = $('ov-technical');
    if (!site.available) {
      row(t, 'Website check', 'Not available', 'muted', site.reason);
    } else {
      var r;
      r = yesNo(s.https, 'On', 'Off'); row(t, 'HTTPS', r[0], r[1]);
      row(t, 'Home page answer', 'Code ' + site.status_code, site.status_code === 200 ? 'good' : 'warn');
      row(t, 'Redirects before the page', red.hops ? plural(red.hops, 'redirect') : 'None', red.hops > 1 ? 'warn' : 'good', red.hops ? 'Final address: ' + site.final_url : '');
      r = yesNo(crawl.robots_txt, 'Found', 'Missing'); row(t, 'robots.txt', r[0], r[1]);
      var sm = (crawl.sitemaps || []).length > 0;
      row(t, 'XML sitemap', sm ? '✓ Found · ' + num(crawl.sitemap_url_count || 0) + ' addresses' : '✗ Not found', sm ? 'good' : 'warn');
      row(t, 'Indexing', noindex ? '✗ Blocked by noindex' : '✓ Allowed', noindex ? 'bad' : 'good');
      row(t, 'Canonical tag', canon.canonical ? '✓ Set' : '✗ Missing', canon.canonical ? 'good' : 'warn', canon.canonical || '');
      var tl = on.title_len || 0;
      row(t, 'Page title', tl ? tl + ' characters' : '✗ Missing', tl >= 30 && tl <= 60 ? 'good' : 'warn', on.title || '');
      var dl = on.desc_len || 0;
      row(t, 'Meta description', dl ? dl + ' characters' : '✗ Missing', dl >= 120 && dl <= 160 ? 'good' : 'warn');
      row(t, 'Main heading (H1)', on.h1_count === 1 ? '✓ One' : (on.h1_count || 0) + ' found', on.h1_count === 1 ? 'good' : 'warn');
      row(t, 'Mobile viewport tag', on.has_viewport ? '✓ Set' : '✗ Missing', on.has_viewport ? 'good' : 'bad');
      row(t, 'Structured data', sd.blocks ? plural(sd.blocks, 'block') + ': ' + (sd.types || []).join(', ') : 'None found', sd.blocks ? 'good' : 'warn');
      if (img.total) row(t, 'Images with a text description', img.alt_coverage_pct + '% of ' + img.total, img.alt_coverage_pct >= 80 ? 'good' : 'warn');
      row(t, 'Insecure files on a secure page', mixed.count ? mixed.count + ' found' : 'None', mixed.count ? 'bad' : 'good');
      row(t, 'Words on the home page', num(on.word_count || 0));
      row(t, 'Page speed and Core Web Vitals', 'Not measured', 'muted', 'Planned as a separate tool.');
    }

    /* ── Issues ── */
    var is = $('ov-issues');
    if (!site.available) {
      row(is, 'Website check', 'Not available', 'muted', site.reason);
    } else if (!site.findings.length) {
      row(is, 'Result', 'No issues found by these checks', 'good');
    } else {
      site.findings.forEach(function (f) {
        var box = node('div', 'issue');
        box.appendChild(node('span', 'tag ' + f.severity, f.severity));
        box.appendChild(node('strong', '', f.title));
        if (f.recommendation) box.appendChild(node('p', '', f.recommendation));
        is.appendChild(box);
      });
      if (site.total_issues > site.findings.length) {
        row(is, 'More', plural(site.total_issues - site.findings.length, 'more issue') + ' not shown');
      }
    }

    /* ── Domain health ── */
    var h = $('ov-health');
    if (reg.available) {
      row(h, 'Registered on', reg.registered_on);
      row(h, 'Registration ends', reg.expires_on || 'Not disclosed');
      row(h, 'Registrar', reg.registrar || 'Not disclosed');
      row(h, 'Nameservers', (reg.nameservers || []).length ? reg.nameservers.join(', ') : 'Not disclosed');
    } else {
      row(h, 'Registration record', 'Not available', 'muted', reg.reason);
    }
    row(h, 'Server address (IP)', host.available ? host.ip_addresses.join(', ') : 'Not found');
    if (site.available) {
      row(h, 'Security certificate', s.ssl_valid ? 'Valid' + (s.ssl_issuer ? ' · ' + s.ssl_issuer : '') : 'Problem found', s.ssl_valid ? 'good' : 'bad',
          s.ssl_expires_in_days != null ? 'Ends in ' + s.ssl_expires_in_days + ' days' : '');
      var missing = (s.headers_missing || []).length;
      row(h, 'Security headers', (s.headers_present || []).length + ' set · ' + missing + ' missing', missing > 3 ? 'warn' : 'good', missing ? 'Missing: ' + s.headers_missing.join(', ') : '');
      row(h, 'Technology found', (tech.detected || []).length ? tech.detected.join(', ') : 'Not recognised');
      if (tech.server_header) row(h, 'Server software', tech.server_header);
      var og = Object.keys(social.open_graph || {}).length;
      row(h, 'Social preview tags', og ? plural(og, 'Open Graph tag') : 'None found', og ? 'good' : 'warn');
    }

    $('ov-result').hidden = false;
  }

  function init() {
    var form = $('ov-form');
    if (!TOOLS_API) {
      $('tools-unavailable').hidden = false;
      $('ov-run').disabled = true;
      return;
    }
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var domain = $('ov-domain').value.trim();
      if (!domain) return;
      $('ov-error').hidden = true;
      $('ov-result').hidden = true;
      $('gate-panel').hidden = true;
      $('ov-loading').hidden = false;
      $('ov-run').disabled = true;
      try {
        render(await callTool('domain-overview', { domain: domain }));
      } catch (err) {
        $('ov-error').textContent = err.message;
        $('ov-error').hidden = false;
      }
      $('ov-loading').hidden = true;
      $('ov-run').disabled = false;
    });
    var asked = new URLSearchParams(location.search).get('domain');
    if (asked && /^[a-z0-9.-]{4,253}$/i.test(asked)) { $('ov-domain').value = asked; }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
