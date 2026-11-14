/* AMK Digital Agency: static showcase. Fixed sample reports.
   Every value below is example data for "example.com". Nothing here is a live
   measurement, and the pages say so in a banner. No network request is made.
   The shapes match what the live tools return, so the layout is identical. */
(function () {
  'use strict';

  var HOME = 'https://example.com/';

  var SECURITY = {
    https: true, ssl_valid: true, ssl_issuer: 'Example Certificate Authority', ssl_expires_in_days: 212,
    headers_present: ['Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options'],
    headers_missing: ['Content-Security-Policy', 'Referrer-Policy', 'Permissions-Policy']
  };
  var OG = {
    title: 'Example Domain', description: 'A sample page used to show how the report looks.',
    type: 'website', url: HOME, image: 'https://example.com/share.png'
  };
  var TW = { card: 'summary_large_image', title: 'Example Domain' };

  function scan(variant) {
    var b = variant === 'b';
    return {
      available: true, domain: b ? 'example.org' : 'example.com', status_code: 200, final_url: b ? 'https://example.org/' : HOME,
      score: b ? 64 : 72, grade: b ? 'C' : 'B', total_issues: b ? 7 : 4,
      security: SECURITY,
      crawlability: { robots_txt: true, sitemaps: [HOME + 'sitemap.xml'], sitemap_url_count: b ? 21 : 48 },
      tech_stack: { detected: b ? ['Nginx', 'Static HTML'] : ['Cloudflare', 'WordPress', 'Google Tag Manager'], server_header: b ? 'nginx' : 'cloudflare' },
      structured_data: { blocks: b ? 1 : 3, types: b ? ['WebSite'] : ['Organization', 'WebSite', 'BreadcrumbList'] },
      llms_txt: { present: false },
      images: { total: 14, alt_coverage_pct: b ? 71 : 86 },
      international: {},
      social: { open_graph: OG, twitter: TW },
      on_page: { title: 'Example Domain: a sample page', title_len: b ? 24 : 31, desc_len: b ? 0 : 118, h1_count: 1, word_count: b ? 310 : 1240, has_viewport: true },
      canonical: { canonical: HOME },
      indexability: { meta_robots: 'index, follow', x_robots_tag: '' },
      redirects: { hops: 1 },
      links: { internal: 42, external: 9 },
      mixed_content: { count: 0 },
      keyword_match: { in_title: true }
    };
  }

  function overview(domain) {
    var b = /\.org$/i.test(domain);
    var sc = scan(b ? 'b' : 'a');
    return {
      domain: b ? 'example.org' : 'example.com',
      checked_at: 'sample data',
      site: {
        available: true, score: sc.score, grade: sc.grade, total_issues: sc.total_issues, status_code: 200, final_url: sc.final_url,
        sections: {
          security: SECURITY, on_page: sc.on_page, crawlability: sc.crawlability, indexability: sc.indexability,
          structured_data: sc.structured_data, images: sc.images, redirects: sc.redirects, links: sc.links,
          tech_stack: sc.tech_stack, social: sc.social, canonical: sc.canonical, mixed_content: sc.mixed_content
        },
        findings: [
          { severity: 'HIGH', title: 'Meta description is shorter than 120 characters', recommendation: 'Write a description of 120 to 160 characters that says what the page offers.' },
          { severity: 'MEDIUM', title: 'Three recommended security headers are missing', recommendation: 'Add Content-Security-Policy, Referrer-Policy and Permissions-Policy at the server.' },
          { severity: 'MEDIUM', title: 'Some images have no text description', recommendation: 'Give each meaningful image a short alt text.' },
          { severity: 'LOW', title: 'No llms.txt file found', recommendation: 'Optional: publish a short /llms.txt that points AI tools to your key pages.' }
        ]
      },
      registration: {
        available: true, age_days: b ? 11200 : 11800, registered_on: b ? '1995-08-31' : '1995-08-14', expires_on: '2027-08-13',
        registrar: 'Example Registrar, Inc.', nameservers: ['ns1.example.net', 'ns2.example.net']
      },
      rank: { available: true, rank_score: b ? 5.1 : 6.4, global_position: b ? 187402 : 96311, referring_domains: b ? 3150 : 9420, data_date: 'sample date' },
      hosting: { available: true, ip_addresses: ['192.0.2.10'] }
    };
  }

  var SAMPLES = {
    'seo-audit': function () {
      return {
        score: 72, grade: 'B', domain: 'example.com',
        metrics: { crawler_access: 'Allowed', https: 'On', word_count: 1240 },
        top_findings: [
          { severity: 'HIGH', title: 'Meta description is shorter than 120 characters' },
          { severity: 'MEDIUM', title: 'Three recommended security headers are missing' },
          { severity: 'LOW', title: 'No llms.txt file found' }
        ],
        most_important_fix: 'Write a meta description of 120 to 160 characters for the home page.'
      };
    },
    'site-scan': function () { return scan('a'); },
    'domain-age': function () {
      return { registered_on: '1995-08-14', expires_on: '2027-08-13', age_days: 11800, registrar: 'Example Registrar, Inc.', source: 'rdap' };
    },
    'domain-rank': function () {
      return { domain: 'example.com', rank_score: 6.4, global_position: 96311, referring_domains: 9420, data_date: 'sample date' };
    },
    'domain-overview': function (body) { return overview(String((body && body.domain) || 'example.com')); },

    'meta-tags': function () {
      return {
        final_url: HOME,
        meta: {
          title: 'Example Domain: a sample page', title_length: 31,
          description: 'A sample page used to show how the report looks.', description_length: 118,
          canonical: HOME, robots: 'index, follow', x_robots_tag: '', viewport: 'width=device-width, initial-scale=1',
          language: 'en', charset: 'utf-8', open_graph: OG, twitter: TW
        }
      };
    },
    'headings': function () {
      var outline = [
        { level: 1, text: 'Example Domain' }, { level: 2, text: 'What this page is' }, { level: 2, text: 'How it is used' },
        { level: 3, text: 'In documentation' }, { level: 3, text: 'In examples' }, { level: 2, text: 'More information' }
      ];
      return { final_url: HOME, headings: { counts: { h1: 1, h2: 3, h3: 2, h4: 0, h5: 0, h6: 0 }, outline: outline, total: outline.length } };
    },
    'images': function () {
      return {
        final_url: HOME,
        images: {
          total: 5, missing_alt: 1, empty_alt: 1, without_size: 2,
          items: [
            { src: HOME + 'img/logo.png', alt: 'Example logo', has_size: true },
            { src: HOME + 'img/hero.jpg', alt: 'People reviewing a report', has_size: false },
            { src: HOME + 'img/team.jpg', alt: null, has_size: false },
            { src: HOME + 'img/divider.svg', alt: '', has_size: true },
            { src: HOME + 'img/chart.png', alt: 'Traffic chart for the last year', has_size: true }
          ]
        }
      };
    },
    'links': function () {
      return {
        final_url: HOME, internal_total: 42, external_total: 9, nofollow_total: 2, checked_total: 6, broken: 1, not_checked: 45,
        checked: [
          { url: HOME + 'about/', text: 'About', kind: 'internal', state: 'ok', status_code: 200 },
          { url: HOME + 'contact/', text: 'Contact', kind: 'internal', state: 'ok', status_code: 200 },
          { url: HOME + 'old-page/', text: 'Old page', kind: 'internal', state: 'broken', status_code: 404, reason: 'Not found' },
          { url: 'https://example.net/partner', text: 'Partner', kind: 'external', state: 'ok', status_code: 200 },
          { url: 'https://example.org/press', text: 'Press', kind: 'external', state: 'blocked', status_code: 403, reason: 'The other site refuses automated checks' },
          { url: 'https://example.net/slow', text: 'Slow link', kind: 'external', state: 'unknown', status_code: null, reason: 'No answer in time' }
        ]
      };
    },
    'redirects': function () {
      return {
        final_url: HOME, final_status: 200, redirects: 1, http_to_https: true, host_changed: false, server: 'cloudflare', content_type: 'text/html; charset=utf-8',
        hops: [{ url: 'http://example.com/', status_code: 301 }, { url: HOME, status_code: 200 }]
      };
    },
    'robots-sitemap': function () {
      return {
        robots: {
          found: true, blocks_all_crawlers: false, rule_total: 3,
          groups: [{ agents: ['*'], allow: 1, disallow: 2, crawl_delay: null }],
          rules: [{ agent: '*', rule: 'Disallow', path: '/admin/' }, { agent: '*', rule: 'Disallow', path: '/cart/' }, { agent: '*', rule: 'Allow', path: '/' }]
        },
        sitemaps: [{ url: HOME + 'sitemap.xml', found: true, type: 'urlset', url_count: 48 }],
        sitemap_url_total: 48
      };
    },
    'ssl-check': function () {
      return {
        valid: true, host: 'example.com', days_left: 212, valid_from: '2026-04-01', valid_until: '2027-06-12', issuer: 'Example Certificate Authority',
        issued_to: 'example.com', protocol: 'TLSv1.3', cipher: 'TLS_AES_256_GCM_SHA384', names_total: 2, names: ['example.com', 'www.example.com']
      };
    },
    'schema-social': function () {
      return {
        final_url: HOME,
        structured_data: {
          blocks: 3, types: ['Organization', 'WebSite', 'BreadcrumbList'], parse_errors: [],
          incomplete: [{ type: 'Organization', missing: ['logo', 'sameAs'] }]
        },
        social: { open_graph: OG, twitter: TW }
      };
    },
    'keyword-density': function () {
      return {
        final_url: HOME,
        text: {
          word_count: 1240, readability: { flesch_reading_ease: 62, words_per_sentence: 17 },
          top_words: [
            { word: 'example', count: 31, percent: 2.5 }, { word: 'domain', count: 24, percent: 1.9 }, { word: 'page', count: 19, percent: 1.5 },
            { word: 'report', count: 14, percent: 1.1 }, { word: 'search', count: 12, percent: 1.0 }, { word: 'content', count: 10, percent: 0.8 }
          ],
          top_phrases: [{ phrase: 'example domain', count: 11 }, { phrase: 'sample report', count: 6 }, { phrase: 'search results', count: 4 }]
        }
      };
    },
    'technology': function () {
      return {
        final_url: HOME,
        tech_stack: { detected: ['Cloudflare', 'WordPress', 'Google Tag Manager'], server_header: 'cloudflare', generator: 'WordPress' },
        security: SECURITY
      };
    }
  };

  window.AMK_DEMO = {
    sample: function (tool, body) { return SAMPLES[tool] ? SAMPLES[tool](body) : null; }
  };

  /* ── The two writing tools call a server with fetch(). In the demo they get a fixed sample. ── */
  var KEYWORDS = [
    { keyword: 'local seo checklist', search_volume: '1.2K', difficulty: 'Medium', intent: 'Informational' },
    { keyword: 'seo audit for small business', search_volume: '880', difficulty: 'Medium', intent: 'Commercial' },
    { keyword: 'how to improve page speed', search_volume: '2.4K', difficulty: 'High', intent: 'Informational' },
    { keyword: 'schema markup examples', search_volume: '1.6K', difficulty: 'Low', intent: 'Informational' },
    { keyword: 'seo agency pricing', search_volume: '590', difficulty: 'Low', intent: 'Transactional' },
    { keyword: 'technical seo audit service', search_volume: '320', difficulty: 'Medium', intent: 'Transactional' }
  ];
  var ARTICLE = '# Sample article: Getting the basics of SEO right\n\n' +
    'This is a fixed sample draft. It shows the layout of the Article Writer, not a real result for your topic.\n\n' +
    '## Start with search intent\n\nEvery page should answer one clear question. Decide what the visitor wants before you write.\n\n' +
    '## Keep the technical basics clean\n\n- Use one H1 per page\n- Write a title of 30 to 60 characters\n- Describe every meaningful image\n\n' +
    '## Measure and improve\n\nReview results monthly and update the pages that already rank on page two.\n';

  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var data = /\/api\/generate-keywords$/.test(url) ? KEYWORDS : /\/api\/generate-article$/.test(url) ? { article: ARTICLE } : null;
    if (data) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } }));
        }, 600);
      });
    }
    return realFetch ? realFetch(input, init) : Promise.reject(new Error('fetch is not available'));
  };
})();
