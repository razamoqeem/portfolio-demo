"""Copy the built website into this static showcase.

Usage (from the showcase folder):
    python scripts/sync_from_website.py [path-to-website/public]

What it does
  * copies every page and file from the website's public/ folder
  * turns every "/path" address into a relative one, so the showcase works from
    any folder or address (GitHub Pages sub-folder, another host, or opened from disk)
  * adds the showcase layer to every page (demo.css, script.js, js/demo-samples.js)
  * marks every page "noindex" so the copy never competes with the live website
  * leaves the showcase's own files alone (see PROTECTED)

It never deletes anything outside the folders it copies into, and it never copies
.env files, databases or keys: public/ holds only built pages.
"""
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = sys.argv[1] if len(sys.argv) > 1 else os.path.normpath(os.path.join(HERE, "..", "Portfolio", "website", "public"))

# Where the showcase is published. Only 404.html needs it (it is served from any depth).
# GitHub Pages project sites live under /<repository>/. Use "/" for a custom domain.
PAGES_BASE = "/portfolio-demo/"
NOINDEX = True

# The showcase's own files: never overwritten by a sync.
PROTECTED = {"script.js", "demo.css", "README.md", "LICENSE", ".gitignore", "js/config.js", "js/tools-client.js", "js/demo-samples.js"}
# Files of the website that the showcase does not use (they only work on the website's own host).
SKIP = {"_headers", "_redirects", "robots.txt",
        # Old "Academy" page: needs a server API that does not exist, and no menu links to it.
        "resources.html"}
SKIP_DIRS = {"legacy", "scripts", ".git"}

ATTR = re.compile(r'(\b(?:href|src|action)=")(/[^"]*)(")')


def prefix_for(rel_path):
    depth = rel_path.count("/")
    return "../" * depth


def fix_target(target, prefix):
    """'/', '/docs/', '/tools/x.html#a', '/css/a.css?v=1' -> relative (and index.html for folders)."""
    path, sep, tail = target.partition("#")
    path, qsep, query = path.partition("?")
    path = path.lstrip("/")
    if path == "" or path.endswith("/"):
        path += "index.html"
    out = prefix + path
    if qsep:
        out += "?" + query
    if sep:
        out += "#" + tail
    return out


# Personal contact details never go into the showcase copy (the website keeps them).
PERSONAL_LINK = re.compile(r'<p[^>]*>\s*<a [^>]*href="(?:mailto:|tel:|https?://(?:www\.)?linkedin\.com)[^"]*"[^>]*>[^<]*</a>\s*</p>\s*', re.I)
PERSONAL_ANCHOR = re.compile(r'<a [^>]*href="(?:mailto:|tel:|https?://(?:www\.)?linkedin\.com)[^"]*"[^>]*>([^<]*)</a>', re.I)


def strip_personal(text):
    text = PERSONAL_LINK.sub("", text)
    return PERSONAL_ANCHOR.sub("", text)


# The chat widget and bot check need the website's server, which the showcase does not have.
NO_SERVER_TAGS = re.compile(r'\s*<(?:script[^>]*src="[^"]*js/(?:chat-widget|bot-check)\.js"[^>]*></script>|link[^>]*href="[^"]*css/chat-widget\.css"[^>]*>)', re.I)


def transform_html(text, rel_path):
    text = strip_personal(text)
    text = NO_SERVER_TAGS.sub("", text)
    prefix = "" if rel_path == "404.html" else prefix_for(rel_path)
    if rel_path == "404.html":
        # A 404 page is served at any address, so its links are relative to a <base> picked in the browser:
        # "/portfolio-demo/" on GitHub Pages, "/" on Vercel or any host that serves the demo at its root.
        text = ATTR.sub(lambda m: m.group(1) + fix_target(m.group(2), "") + m.group(3), text)
        base_js = ('<script>document.write(\'<base href="\' + (location.pathname.indexOf("%s") === 0 ? "%s" : "/") + \'">\');</script>'
                   % (PAGES_BASE, PAGES_BASE))
        text = text.replace("<head>", "<head>\n  " + base_js, 1)
        asset_prefix = ""
    else:
        text = ATTR.sub(lambda m: m.group(1) + fix_target(m.group(2), prefix) + m.group(3), text)
        asset_prefix = prefix

    # the two writing tools: drop the website's "being rebuilt" switch-off script
    text = re.sub(r"<script>\s*/\* This tool needs the tools service.*?</script>", "", text, flags=re.S)

    if NOINDEX:
        if re.search(r'<meta\s+name="robots"', text):
            text = re.sub(r'(<meta\s+name="robots"\s+content=")[^"]*(")', r"\1noindex, nofollow\2", text)
        else:
            text = text.replace("<head>", '<head>\n  <meta name="robots" content="noindex, nofollow" />', 1)

    layer = ('  <link rel="stylesheet" href="%sdemo.css" />\n'
             '  <script src="%sjs/demo-samples.js"></script>\n'
             '  <script src="%sscript.js"></script>\n') % (asset_prefix, asset_prefix, asset_prefix)
    if "demo.css" not in text:
        text = text.replace("</head>", layer + "</head>", 1)
    return text


def transform_css(text, rel_path):
    # "/css/theme.css" imports inside assets/site.css and tools/overview.css
    prefix = prefix_for(rel_path)
    return re.sub(r'(@import url\(")(/[^"]+)("\))', lambda m: m.group(1) + prefix + m.group(2).lstrip("/") + m.group(3), text)


def main():
    if not os.path.isdir(SOURCE):
        sys.exit("Source folder not found: " + SOURCE)
    copied = 0
    for folder, dirs, files in os.walk(SOURCE):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            src = os.path.join(folder, name)
            rel = os.path.relpath(src, SOURCE).replace(os.sep, "/")
            if rel in SKIP or rel in PROTECTED:
                continue
            dest = os.path.join(HERE, *rel.split("/"))
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            if rel.endswith(".html"):
                with open(src, encoding="utf-8") as f:
                    out = transform_html(f.read(), rel)
                with open(dest, "w", encoding="utf-8", newline="\n") as f:
                    f.write(out)
            elif rel.endswith(".css"):
                with open(src, encoding="utf-8") as f:
                    out = transform_css(f.read(), rel)
                with open(dest, "w", encoding="utf-8", newline="\n") as f:
                    f.write(out)
            else:
                shutil.copy2(src, dest)
            copied += 1
    if NOINDEX:
        with open(os.path.join(HERE, "robots.txt"), "w", encoding="utf-8", newline="\n") as f:
            f.write("# Static showcase copy: not for search engines.\nUser-agent: *\nDisallow: /\n")
    print("Synced %d files from %s" % (copied, SOURCE))


if __name__ == "__main__":
    main()
