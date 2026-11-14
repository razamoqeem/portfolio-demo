# AMK Digital Agency: static showcase

A copy of the AMK Digital Agency website that runs with **no server**. Same pages, same menu, same
light and dark theme and spacing as the main website, so it can be shown to clients from any static host.

This is a showcase. Nothing here is a live check.

## What visitors see

| Part | In the showcase |
|---|---|
| Home, Company, Founder, Docs, tools hub | Same as the main website |
| Browser-only tools (Title Generator) | Work fully |
| Tools that need a server (Domain Overview, Website Comparison, SEO Audit, AI readiness, SSL, Domain Age, Domain Rank, Meta Tags, Headings, Images, Links, Redirects, Robots and Sitemap, Schema, Keyword Density, Technology, Keyword Generator, Article Writer) | Show a **sample report** for `example.com`, under the banner "Sample report: example data, not a live check." |
| "Live Website & Tools" button (every page) and "Run Live Check" button (tool pages) | Open the main website. The tool button passes what the visitor typed as `?url=` |
| Search engines | Told not to list these pages (`noindex`), so the copy never competes with the main website |

## One setting to edit

Open `script.js` and set the first line to the address of the live website:

```js
const LIVE_SITE_URL = "https://www.your-domain.com";
```

Full address with `https://`, no trailing slash. While it is empty, the two buttons show a short
notice instead of leaving the page.

## Updating the showcase from the main website

1. In the main website folder, rebuild its pages (`cms/build.py`).
2. In this folder, run:

```bash
python scripts/sync_from_website.py "path/to/website/public"
```

The script copies the pages, makes every address relative, adds the showcase layer, and leaves these
files alone: `script.js`, `demo.css`, `js/config.js`, `js/tools-client.js`, `js/demo-samples.js`,
`README.md`, `LICENSE`. Edit `PAGES_BASE` at the top of the script if the showcase moves from
`/portfolio-demo/` to its own domain.

## Folder notes

| Folder or file | Purpose |
|---|---|
| `legacy/` | The previous single-page demo, kept untouched |
| `js/demo-samples.js` | The fixed sample reports |
| `js/tools-client.js` | Replaces the website's tool code so no network request is made |
| `demo.css` | Styles for the header button, banner and notice only |

© AMK Digital Agency. All rights reserved. See the `LICENSE` file.
