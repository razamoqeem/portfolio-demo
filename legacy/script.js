/* ══════════════════════════════════════════════════════════════
   AMK DIGITAL AGENCY — INTELLIGENCE ENGINE
   script.js — Separated JS layer | © AMK Digital Agency 2026
══════════════════════════════════════════════════════════════ */
"use strict";

/* ─────────────────────────────────────────────────────────────────
   STATIC DATA VAULT — AMK Digital Agency SEO Suite Demo
   All simulated outputs served from this local JSON map.
───────────────────────────────────────────────────────────────── */
const VAULT = {

  /* Audit simulation data */
  audit: {
    scores: {
      overall: 87, performance: 92, content: 84,
      technical: 81, authority: 75, ux: 90, geo: 78, eeat: 85
    },
    issues: [
      { priority: 'high',   issue: 'Missing JSON-LD Schema on 3 routes', category: 'Technical',    impact: 'SEO' },
      { priority: 'high',   issue: 'LCP > 2.5s on mobile (3 pages)',     category: 'Performance',  impact: 'CWV' },
      { priority: 'high',   issue: 'No canonical tags on paginated URLs', category: 'Technical',    impact: 'Crawl' },
      { priority: 'medium', issue: 'Missing alt text on 8 images',       category: 'On-Page',      impact: 'Accessibility' },
      { priority: 'medium', issue: 'Thin content pages (< 300 words)',   category: 'Content',      impact: 'Authority' },
      { priority: 'medium', issue: 'FAQ schema absent on 8 info pages',  category: 'Structured Data', impact: 'GEO' },
      { priority: 'low',    issue: 'HTTP/2 not enabled on subdomains',   category: 'Technical',    impact: 'Speed' },
      { priority: 'low',    issue: '12 broken internal anchor links',     category: 'On-Page',      impact: 'UX' },
    ]
  },

  /* Semantic keyword clusters */
  semantics: {
    "real estate": {
      phrases: ["automated real estate data pipelines", "hyperlocal search intent models", "programmatic luxury real estate indexing", "schema-optimized property listing strategy"],
      titles: [
        { cat: "Blog Blueprint",  t: "Maximizing Search Volume Traffic for Competitive Real Estate Assets in 2026" },
        { cat: "Case Study",      t: "How Automated Semantic Clusters Dominate Suburban Broker Keyword Vaults" },
        { cat: "Landing Page",    t: "AI-Powered Property SEO: Your Local Market Domination Toolkit" }
      ]
    },
    "ecommerce": {
      phrases: ["programmatic product structure scaling", "headless content index configurations", "long-tail keyword transactional modifiers", "conversion-optimized category schema"],
      titles: [
        { cat: "Blog Blueprint",  t: "How We Scaled an Enterprise E-commerce Pipeline to 200k Indexed Pages" },
        { cat: "Case Study",      t: "Resolving Crawling Bottlenecks Within JavaScript-Heavy Storefront Layouts" },
        { cat: "Landing Page",    t: "The E-commerce SEO Audit Checklist That Generated 340% Organic Revenue Lift" }
      ]
    },
    "saas": {
      phrases: ["SaaS product-led SEO architecture", "free trial conversion keyword clusters", "PLG content flywheel optimization", "intent-mapped feature page strategy"],
      titles: [
        { cat: "Blog Blueprint",  t: "Product-Led Growth SEO: How SaaS Brands Capture Bottom-of-Funnel Intent" },
        { cat: "Case Study",      t: "SaaS Keyword Architecture: Mapping Free Trial Search Intent to Revenue" },
        { cat: "Landing Page",    t: "The 2026 SaaS SEO Playbook: From Trial Signups to Enterprise Contracts" }
      ]
    },
    "healthcare": {
      phrases: ["YMYL healthcare content authority signals", "medical schema and structured data layers", "patient journey search intent mapping", "E-E-A-T signals for clinical content"],
      titles: [
        { cat: "Blog Blueprint",  t: "Why E-E-A-T is Non-Negotiable for Healthcare Content in the AI Search Era" },
        { cat: "Case Study",      t: "Medical SEO Architecture: How We Ranked a Clinic Network for 180+ Procedures" },
        { cat: "Landing Page",    t: "Trusted Healthcare SEO: Building Patient Confidence Through Search Authority" }
      ]
    },
    "logistics": {
      phrases: ["B2B logistics long-tail commercial keywords", "supply chain semantic content clusters", "fleet management intent modeling", "multi-location logistics schema markup"],
      titles: [
        { cat: "Blog Blueprint",  t: "Logistics SEO Playbook: Winning B2B Commercial Intent Across Supply Chain Verticals" },
        { cat: "Case Study",      t: "How We Generated 287 Qualified Leads via Programmatic Logistics SEO" },
        { cat: "Landing Page",    t: "Precision B2B Logistics SEO: Engineering Qualified Fleet Leads Through Search" }
      ]
    },
    "default": {
      phrases: ["high-velocity programmatic entity mappings", "intent-driven search vertical blueprints", "advanced algorithmic search visibility indexing", "competitive moat content architecture"],
      titles: [
        { cat: "Blog Blueprint",  t: "Engineered Rankings: Overcoming Enterprise Competitor Technical Moats in 2026" },
        { cat: "Case Study",      t: "The Technical Growth Blueprint: Scaling Corporate Search Capture Without Middleware" },
        { cat: "Landing Page",    t: "AI-First SEO Architecture: How AMK Builds Search Authority at Scale" }
      ]
    }
  },

  /* Article streaming content */
  article: {
    intro: `## STRATEGIC CONTENT OPTIMIZATION BLUEPRINT
Generated by AMK Content Engine v3.0 | AMK Digital Agency

### Executive Summary
In the current search landscape, building organic web authority requires programmatic precision. Traditional keyword-stuffing methods fall short when scaling competitive directory spaces. By establishing clear entity relationships within web content structures, brands can capture high-intent queries directly.

### Core SEO Architecture Roadmap
1. **Establish Explicit Canonical Definitions** — Ensure canonical structural definitions span consistently across all page trees without competing signals.
2. **Localized Schema Implementation** — Incorporate geo-targeted schema layouts to disambiguate page content for both crawlers and AI overview systems.
3. **Internal Linking Architecture** — Optimize internal link flows based on topic importance and page conversion priority rather than arbitrary placement.
4. **E-E-A-T Signal Integration** — Deploy author bio markup, expert citation patterns, and organizational verification schema across key conversion pages.

### Semantic Content Cluster Strategy
Topical authority is no longer an optional enhancement — it is a prerequisite for AI-overview inclusion. Build radial hub-and-spoke clusters around core commercial intents, ensuring each spoke page addresses a specific sub-query within the broader topic universe.

### Recommended Next Steps
- Complete a comprehensive 8-pillar technical audit of your current domain.
- Identify content gap opportunities across your top 3 competitor sites.
- Deploy structured content templates aligned to your primary keyword clusters.

[AMK SYSTEM NOTICE] Full article generation with 2,500+ words, semantic keyword weaving, and meta data optimization is available via the authenticated AMK suite. Request access from an AMK system administrator.`
  },

  /* AI Search Assistant responses */
  aiResponses: {
    "geo": `**GEO (Generative Engine Optimization)** is AMK's methodology for optimizing content to be cited by AI-powered search systems like Google AI Overviews, Perplexity, and ChatGPT Search.\n\nKey GEO signals we optimize:\n• **Entity clarity** — Unambiguous organization/person schema\n• **FAQ coverage** — Direct answers to common queries\n• **Citation authority** — Cross-referenced expert mentions\n• **Semantic completeness** — Full topic coverage, no gaps\n\nClients who implement our GEO architecture see a **3.2× increase** in AI Overview citation frequency within 90 days.`,
    "eeat": `**E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)** is Google's quality evaluator framework — and the backbone of every AMK engagement.\n\nOur E-E-A-T implementation includes:\n• **Author bio markup** with verified credentials\n• **Organization schema** with NAP consistency\n• **Review/testimonial schema** for social proof\n• **Expert citation patterns** and outbound authority links\n• **Medical/legal/financial** content trust signals\n\nE-E-A-T gaps are the #1 reason enterprise sites underperform in AI-first search.`,
    "schema": `**Schema Markup (Structured Data)** is machine-readable HTML that tells search engines and AI crawlers exactly what your content means.\n\nAMK deploys 14+ schema types:\n• Organization, Person, LocalBusiness\n• Article, BlogPosting, FAQPage\n• Product, Review, BreadcrumbList\n• HowTo, VideoObject, SiteLinksSearchBox\n\nImpact: Schema-optimized pages see **+40% rich snippet eligibility** and **+2.7× AI Overview inclusion** vs. pages without structured data.`,
    "audit": `**AMK's 8-Pillar SEO Audit** covers every layer of your digital infrastructure:\n\n1. 🔍 Technical Crawl (robots, sitemap, canonicals)\n2. ⚡ Core Web Vitals (LCP, FID, CLS)\n3. 📄 On-Page Signals (titles, H1s, meta)\n4. 🔗 Backlink Matrix (DA, TF, anchor spread)\n5. 🧠 Entity Layer (schema, KG signals)\n6. 📢 E-E-A-T Architecture\n7. 🌐 GEO/AEO Readiness\n8. 📊 Content Depth & Topical Coverage\n\nDelivered within **48 hours** with a full action-priority matrix.`,
    "default": `Great question! As AMK's AI Search Assistant, I can help you understand our methodology.\n\n**I can explain:**\n• GEO / AI Search Optimization\n• E-E-A-T Signal Architecture  \n• Schema & Structured Data\n• Technical SEO Audits\n• Content Intelligence\n• Backlink & Authority Building\n\nTry asking about: *"What is GEO?"*, *"How does E-E-A-T work?"*, *"What does the audit include?"*, or *"Explain schema markup"*\n\nOr book a strategy call to get a personalized analysis of your domain.`
  }
};

/* ─────────────────────────────────────────────────────────────────
   TAB SWITCHER
───────────────────────────────────────────────────────────────── */
function switchTab(name) {
  document.querySelectorAll('.lab-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.lab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('panel-' + name).classList.add('active');

  // Trigger chart animations on panel open
  if (name === 'exec') {
    setTimeout(() => {
      animateExecDonuts();
      buildRadarChart();
    }, 100);
  }
  if (name === 'geo') {
    setTimeout(animateGeoScores, 100);
  }
  if (name === 'entity') {
    setTimeout(animateEntityScores, 100);
  }
}

/* ─────────────────────────────────────────────────────────────────
   COMMAND CENTER — ANIMATED RING COUNTERS
───────────────────────────────────────────────────────────────── */
const CC_METRICS = [
  { id: 'cc-seo',   val: 87, stroke: '#818CF8', class: '' },
  { id: 'cc-health',val: 91, stroke: '#1DD1A1', class: 'success' },
  { id: 'cc-vis',   val: 78, stroke: '#2DD4BF', class: 'teal' },
  { id: 'cc-eeat',  val: 85, stroke: '#FF9F43', class: 'warn' }
];

function animateCommandCenter() {
  CC_METRICS.forEach((m, i) => {
    const card = document.getElementById(m.id);
    if (!card) return;
    const ring = card.querySelector('.cc-ring-fill');
    const valEl = card.querySelector('.cc-ring-val');
    if (!ring || !valEl) return;

    const circumference = 220;
    setTimeout(() => {
      // Animate ring
      ring.style.strokeDashoffset = circumference * (1 - m.val / 100);
      // Animate counter
      let cur = 0;
      const step = Math.ceil(m.val / 50);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, m.val);
        valEl.textContent = cur;
        if (cur >= m.val) clearInterval(timer);
      }, 25);
    }, i * 120);
  });
}

/* ─────────────────────────────────────────────────────────────────
   EXECUTIVE DASHBOARD — DONUT CHARTS
───────────────────────────────────────────────────────────────── */
const EXEC_SCORES = [
  { id: 'donut-overall',  val: 87, color: '#818CF8', label: 'SEO Score' },
  { id: 'donut-health',   val: 91, color: '#1DD1A1', label: 'Site Health' },
  { id: 'donut-perf',     val: 92, color: '#2DD4BF', label: 'Performance' },
  { id: 'donut-content',  val: 84, color: '#FF9F43', label: 'Content Quality' }
];

function animateExecDonuts() {
  EXEC_SCORES.forEach((s, i) => {
    const fill = document.querySelector(`#${s.id} .exec-donut-fill`);
    const val  = document.querySelector(`#${s.id} .exec-donut-val`);
    if (!fill || !val) return;

    const r = 28;
    const circ = 2 * Math.PI * r; // ~175.9
    setTimeout(() => {
      fill.style.strokeDashoffset = circ * (1 - s.val / 100);
      let cur = 0;
      const step = Math.ceil(s.val / 40);
      const t = setInterval(() => {
        cur = Math.min(cur + step, s.val);
        val.textContent = cur;
        if (cur >= s.val) clearInterval(t);
      }, 28);
    }, i * 100);
  });
}

/* ─────────────────────────────────────────────────────────────────
   RADAR CHART (SVG Polygon — 6 axes)
───────────────────────────────────────────────────────────────── */
const RADAR_DATA = [
  { label: 'Technical', val: 81,  color: '#818CF8' },
  { label: 'Content',   val: 84,  color: '#2DD4BF' },
  { label: 'Authority', val: 75,  color: '#A78BFA' },
  { label: 'E-E-A-T',   val: 85,  color: '#FF9F43' },
  { label: 'UX',        val: 90,  color: '#1DD1A1' },
  { label: 'GEO',       val: 78,  color: '#F472B6' }
];

function buildRadarChart() {
  const svg = document.getElementById('radar-svg');
  if (!svg || svg.dataset.built === '1') return;
  svg.dataset.built = '1';

  const cx = 140, cy = 140, maxR = 110;
  const n = RADAR_DATA.length;
  const angleStep = (2 * Math.PI) / n;

  // Draw grid circles
  [0.25, 0.5, 0.75, 1].forEach(fraction => {
    const r = maxR * fraction;
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy);
    el.setAttribute('r', r);
    el.setAttribute('class', 'radar-grid-line');
    svg.appendChild(el);
  });

  // Draw axis lines + labels
  RADAR_DATA.forEach((d, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const x = cx + maxR * Math.cos(angle);
    const y = cy + maxR * Math.sin(angle);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', x); line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.06)'); line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    // Label positioning
    const lx = cx + (maxR + 20) * Math.cos(angle);
    const ly = cy + (maxR + 20) * Math.sin(angle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lx); text.setAttribute('y', ly + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'radar-axis-label');
    text.textContent = d.label;
    svg.appendChild(text);
  });

  // Build polygon (animate from center out)
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('class', 'radar-polygon');
  svg.appendChild(polygon);

  // Animate polygon
  let progress = 0;
  const animate = setInterval(() => {
    progress = Math.min(progress + 0.04, 1);
    const points = RADAR_DATA.map((d, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const r = maxR * (d.val / 100) * progress;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    polygon.setAttribute('points', points.join(' '));
    if (progress >= 1) clearInterval(animate);
  }, 20);

  // Dots on vertices
  setTimeout(() => {
    RADAR_DATA.forEach((d, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const r = maxR * (d.val / 100);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', cx + r * Math.cos(angle));
      dot.setAttribute('cy', cy + r * Math.sin(angle));
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', d.color);
      svg.appendChild(dot);
    });
  }, 600);
}

/* Update legend bar fills */
function buildRadarLegend() {
  RADAR_DATA.forEach((d, i) => {
    const fill = document.querySelector(`.radar-legend-fill[data-idx="${i}"]`);
    if (fill) {
      fill.style.background = d.color;
      setTimeout(() => {
        fill.style.width = d.val + '%';
      }, 200 + i * 80);
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   SYSTEM ACTION 1 — VISUAL AUDIT DASHBOARD
───────────────────────────────────────────────────────────────── */
function runAudit() {
  const url = document.getElementById('audit-url-input').value.trim();
  if (!url) { alert('Please enter a target domain URL.'); return; }

  const btn    = document.getElementById('audit-run-btn');
  const loader = document.getElementById('audit-loader');
  const output = document.getElementById('audit-output');

  btn.disabled = true;
  btn.textContent = '⏳ Scanning...';
  loader.style.display = 'flex';
  output.style.display = 'none';

  // Rotate through status messages
  const msgs = [
    'Initiating DOM hierarchy scan...',
    'Checking Core Web Vitals signals...',
    'Analyzing on-page signal density...',
    'Querying backlink authority matrix...',
    'Running GEO/AI compliance checks...',
    'Generating executive summary...'
  ];
  let mIdx = 0;
  const loaderSpan = loader.querySelector('span');
  const msgTimer = setInterval(() => {
    mIdx = (mIdx + 1) % msgs.length;
    if (loaderSpan) loaderSpan.textContent = msgs[mIdx];
  }, 450);

  setTimeout(() => {
    clearInterval(msgTimer);
    loader.style.display = 'none';
    output.style.display = 'block';
    renderAuditDashboard(url, output);
    btn.disabled = false;
    btn.textContent = '🚀 Scan Website Free';
    showToast('Audit complete — Score: 87/100 ✅', 'success');
  }, 2800);
}

function renderAuditDashboard(url, container) {
  const s = VAULT.audit.scores;
  const hostname = url.replace(/https?:\/\//, '').split('/')[0];

  container.innerHTML = `
    <div style="margin-bottom:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);">Audited Domain</span>
        <span style="font-size:12px;color:var(--text-muted);">${new Date().toLocaleString()}</span>
      </div>
      <div style="font-size:17px;font-weight:700;color:var(--text);">${hostname}</div>
    </div>

    <!-- Score cards -->
    <div class="exec-score-grid" style="margin-bottom:24px;">
      ${renderDonutCard('a-overall', s.overall, '#818CF8', 'Overall SEO')}
      ${renderDonutCard('a-perf',    s.performance, '#1DD1A1', 'Performance')}
      ${renderDonutCard('a-content', s.content, '#2DD4BF', 'Content')}
      ${renderDonutCard('a-tech',    s.technical, '#FF9F43', 'Technical')}
    </div>

    <!-- Progress bars -->
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px;">
      ${renderAuditBar('Authority', s.authority, '#A78BFA')}
      ${renderAuditBar('UX Score',  s.ux,        '#1DD1A1')}
      ${renderAuditBar('GEO Ready', s.geo,        '#2DD4BF')}
      ${renderAuditBar('E-E-A-T',   s.eeat,       '#FF9F43')}
    </div>

    <!-- Issue table -->
    <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:12px;">Priority Issues</div>
    ${buildIssueTable(VAULT.audit.issues)}
  `;

  // Animate donuts
  ['a-overall','a-perf','a-content','a-tech'].forEach((id, i) => {
    const fill = container.querySelector(`#${id} .exec-donut-fill`);
    const val  = container.querySelector(`#${id} .exec-donut-val`);
    const scores = [s.overall, s.performance, s.content, s.technical];
    if (!fill || !val) return;
    const r = 28, circ = 2 * Math.PI * r;
    const target = scores[i];
    setTimeout(() => {
      fill.style.strokeDashoffset = circ * (1 - target / 100);
      let cur = 0;
      const step = Math.ceil(target / 40);
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        val.textContent = cur;
        if (cur >= target) clearInterval(t);
      }, 28);
    }, i * 100);
  });

  // Animate bars
  container.querySelectorAll('.audit-bar-fill').forEach((bar, idx) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.w + '%';
    }, 200 + idx * 80);
  });
}

function renderDonutCard(id, val, color, label) {
  const r = 28, circ = 2 * Math.PI * r;
  return `
    <div class="exec-score-card" id="${id}">
      <div class="exec-donut-wrap">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="${r}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="5"/>
          <circle class="exec-donut-fill" cx="36" cy="36" r="${r}" fill="none"
            stroke="${color}" stroke-width="5" stroke-linecap="round"
            stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
            style="transform:rotate(-90deg);transform-origin:36px 36px;transition:stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1);"/>
        </svg>
        <div class="exec-donut-val">0</div>
      </div>
      <div class="exec-score-label">${label}</div>
    </div>`;
}

function renderAuditBar(label, val, color) {
  return `
    <div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
        <span style="color:var(--text-muted);font-weight:600;">${label}</span>
        <span style="font-weight:700;color:var(--text);">${val}%</span>
      </div>
      <div class="progress-track">
        <div class="audit-bar-fill" data-w="${val}"
          style="height:100%;background:${color};border-radius:9999px;width:0;transition:width 1.1s cubic-bezier(0.16,1,0.3,1);"></div>
      </div>
    </div>`;
}

function buildIssueTable(issues) {
  const rows = issues.map(issue => {
    const pClass = issue.priority === 'high' ? 'high' : issue.priority === 'medium' ? 'medium' : 'low';
    const pIcon  = issue.priority === 'high' ? '🔴' : issue.priority === 'medium' ? '🟡' : '🟢';
    return `<tr>
      <td><span class="issue-pill ${pClass}">${pIcon} ${issue.priority}</span></td>
      <td style="font-weight:500;color:var(--text);">${issue.issue}</td>
      <td><span class="issue-category-pill">${issue.category}</span></td>
      <td style="font-weight:600;color:var(--text-muted);">${issue.impact}</td>
    </tr>`;
  }).join('');

  return `
    <div class="issues-table-wrap">
      <table class="issues-table">
        <thead>
          <tr><th>Priority</th><th>Issue</th><th>Category</th><th>Impact</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────────
   GEO / AI READINESS SCORES ANIMATION
───────────────────────────────────────────────────────────────── */
function animateGeoScores() {
  document.querySelectorAll('.geo-score-bar').forEach(bar => {
    const target = parseInt(bar.dataset.w, 10);
    bar.style.width = target + '%';
  });
  document.querySelectorAll('.geo-score-val').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let cur = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(t);
    }, 28);
  });
}

/* ─────────────────────────────────────────────────────────────────
   ENTITY ANALYZER ANIMATION
───────────────────────────────────────────────────────────────── */
function animateEntityScores() {
  document.querySelectorAll('.entity-count-val').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let cur = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(t);
    }, 28);
  });
}

/* ─────────────────────────────────────────────────────────────────
   SYSTEM ACTION 2 — KEYWORD & TITLE ENGINE
───────────────────────────────────────────────────────────────── */
function runKeywordEngine() {
  const input  = document.getElementById('kw-input').value.toLowerCase().trim();
  const btn    = document.getElementById('kw-run-btn');
  const loader = document.getElementById('kw-loader');
  const output = document.getElementById('kw-output');

  if (!input) { alert('Enter a seed market topic to begin.'); return; }

  btn.disabled = true;
  loader.style.display = 'flex';
  output.style.display = 'none';
  output.innerHTML = '';

  setTimeout(() => {
    loader.style.display = 'none';

    const matchKey = Object.keys(VAULT.semantics).find(k => k !== 'default' && input.includes(k)) || 'default';
    const data = VAULT.semantics[matchKey];

    let html = `<h4 style="margin-bottom:16px;font-size:16px;color:var(--text);">Semantic Extraction Complete: "${input}"</h4>`;

    html += `<div style="margin-bottom:20px;"><div class="lab-label">High-Value Semantic Terms</div>`;
    data.phrases.forEach(p => {
      html += `<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px;font-size:14px;color:var(--text-soft);">
        <span style="color:var(--accent-2);font-size:16px;">→</span> ${p}
      </div>`;
    });
    html += `</div>`;

    html += `<div><div class="lab-label">Conversion-Optimized Blueprint Titles</div>`;
    data.titles.forEach(item => {
      html += `<div class="result-card">
        <div><span class="result-pill">${item.cat}</span><p style="margin:0;font-size:14px;font-weight:500;color:var(--text);">${item.t}</p></div>
      </div>`;
    });
    html += `</div>`;

    output.innerHTML = html;
    output.style.display = 'block';
    btn.disabled = false;
    showToast(`${data.phrases.length + data.titles.length} outputs generated ✅`, 'success');
  }, 1100);
}

/* ─────────────────────────────────────────────────────────────────
   SYSTEM ACTION 3 — ARTICLE STREAMING ENGINE
───────────────────────────────────────────────────────────────── */
function runArticleStream() {
  const topic  = document.getElementById('article-input').value.trim();
  const btn    = document.getElementById('article-run-btn');
  const loader = document.getElementById('article-loader');
  const output = document.getElementById('article-output');

  if (!topic) { alert('Provide a target article topic or keyphrase.'); return; }

  btn.disabled = true;
  loader.style.display = 'flex';
  output.style.display = 'none';
  output.textContent = '';

  setTimeout(() => {
    loader.style.display = 'none';
    output.style.display = 'block';

    const header = `[INITIALIZING LOCAL STREAMING INJECTION: "${topic}"]\n${'─'.repeat(52)}\n\n`;
    const src    = VAULT.article.intro;
    let   full   = header;
    let   idx    = 0;

    output.textContent = full;

    const stream = setInterval(() => {
      if (idx >= src.length) {
        clearInterval(stream);
        btn.disabled = false;
        showToast('Article blueprint streamed successfully ✅', 'success');
        return;
      }
      const chunk = src.slice(idx, idx + 3);
      full += chunk;
      output.textContent = full;
      output.scrollTop = output.scrollHeight;
      idx += 3;
    }, 10);
  }, 1400);
}

/* ─────────────────────────────────────────────────────────────────
   SYSTEM ACTION 4 — AI SEARCH ASSISTANT
───────────────────────────────────────────────────────────────── */
function sendAiMessage(msgOverride) {
  const input = document.getElementById('ai-chat-input');
  const history = document.getElementById('ai-chat-history');
  const msg = (msgOverride || input.value).trim();
  if (!msg) return;

  input.value = '';

  // User bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'ai-msg user';
  userBubble.innerHTML = `
    <div class="ai-msg-avatar">You</div>
    <div class="ai-msg-bubble">${msg}</div>`;
  history.appendChild(userBubble);

  // Typing indicator
  const typingBubble = document.createElement('div');
  typingBubble.className = 'ai-msg bot';
  typingBubble.id = 'ai-typing-indicator';
  typingBubble.innerHTML = `
    <div class="ai-msg-avatar">AI</div>
    <div class="ai-msg-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
  history.appendChild(typingBubble);
  history.scrollTop = history.scrollHeight;

  const lower = msg.toLowerCase();
  let responseKey = 'default';
  if (lower.includes('geo') || lower.includes('generative') || lower.includes('ai overview')) responseKey = 'geo';
  else if (lower.includes('eeat') || lower.includes('e-e-a-t') || lower.includes('trust') || lower.includes('author')) responseKey = 'eeat';
  else if (lower.includes('schema') || lower.includes('structured data') || lower.includes('json-ld')) responseKey = 'schema';
  else if (lower.includes('audit') || lower.includes('crawl') || lower.includes('pillar')) responseKey = 'audit';

  setTimeout(() => {
    typingBubble.remove();
    const response = VAULT.aiResponses[responseKey];
    const botBubble = document.createElement('div');
    botBubble.className = 'ai-msg bot';
    // Convert **bold** to <strong> and \n to <br>
    const formatted = response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    botBubble.innerHTML = `
      <div class="ai-msg-avatar">AI</div>
      <div class="ai-msg-bubble" style="color:var(--text-soft);">${formatted}</div>`;
    history.appendChild(botBubble);
    history.scrollTop = history.scrollHeight;
  }, 1200 + Math.random() * 600);
}

function aiChatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAiMessage();
  }
}

function aiQuickPrompt(text) {
  sendAiMessage(text);
}

/* ─────────────────────────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────────────────────────── */
function submitForm(e) {
  e.preventDefault();
  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
  showToast('Strategy session requested! 🚀', 'success');
}

/* ─────────────────────────────────────────────────────────────────
   TOAST NOTIFICATIONS
───────────────────────────────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.4s';
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('active');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────────────────────────────
   ANIMATED STAT COUNTERS (Hero)
───────────────────────────────────────────────────────────────── */
function animateCount(el, target, suffix) {
  let start = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start >= target) clearInterval(interval);
  }, 25);
}
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(document.getElementById('stat-audits'), 340, '+');
      animateCount(document.getElementById('stat-lift'),   47,  '%');
      statObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObs.observe(heroStats);

/* ─────────────────────────────────────────────────────────────────
   SCORE RING ANIMATION (Hero card)
───────────────────────────────────────────────────────────────── */
setTimeout(() => {
  const arc = document.getElementById('score-arc');
  if (arc) {
    const pct = 90 / 100;
    const circumference = 2 * Math.PI * 37;
    arc.style.strokeDashoffset = circumference * (1 - pct);
    arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  }
}, 800);

/* ─────────────────────────────────────────────────────────────────
   COMMAND CENTER SCROLL TRIGGER
───────────────────────────────────────────────────────────────── */
const ccObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCommandCenter();
      ccObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const ccSection = document.getElementById('command-center');
if (ccSection) ccObs.observe(ccSection);

/* ─────────────────────────────────────────────────────────────────
   EXEC DASHBOARD — INIT ON FIRST VIEW (default tab)
───────────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Exec is default tab — init radar legend widths
  buildRadarLegend();

  // Init exec donuts with slight delay
  setTimeout(() => {
    animateExecDonuts();
    buildRadarChart();
    animateGeoScores();
    animateEntityScores();
  }, 600);

  // Seed AI chat with welcome message
  const history = document.getElementById('ai-chat-history');
  if (history) {
    const welcome = document.createElement('div');
    welcome.className = 'ai-msg bot';
    welcome.innerHTML = `
      <div class="ai-msg-avatar">AI</div>
      <div class="ai-msg-bubble" style="color:var(--text-soft);">
        <strong>Welcome to the AMK AI Search Assistant.</strong><br><br>
        Ask me anything about SEO strategy, GEO optimization, E-E-A-T signals, schema markup, or our audit methodology. I'm here to help.<br><br>
        Try a quick prompt below 👇
      </div>`;
    history.appendChild(welcome);
  }
});

/* ─────────────────────────────────────────────────────────────────
   THEME TOGGLE — DARK / LIGHT
───────────────────────────────────────────────────────────────── */
(function () {
  var saved = localStorage.getItem('amk-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = saved === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
})();

function toggleTheme() {
  var root = document.documentElement;
  var current = root.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('amk-theme', next);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
}

/* ─────────────────────────────────────────────────────────────────
   MOBILE NAVIGATION
───────────────────────────────────────────────────────────────── */
function toggleNav() {
  document.getElementById('main-nav').classList.toggle('open');
}
document.querySelectorAll('#main-nav a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('main-nav').classList.remove('open'));
});

/* ─────────────────────────────────────────────────────────────────
   SECURITY ENVELOPE — ANTI-INSPECTION LAYER
───────────────────────────────────────────────────────────────── */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.keyCode === 123) { e.preventDefault(); return false; }
  if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) { e.preventDefault(); return false; }
  if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
  if (e.ctrlKey && e.keyCode === 83) { e.preventDefault(); return false; }
});

(function devToolsGuard() {
  const threshold = 160;
  const check = () => {
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    document.body.style.filter = (widthDiff || heightDiff) ? 'blur(12px)' : '';
  };
  setInterval(check, 1000);
})();
