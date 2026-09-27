#!/usr/bin/env python3
"""Make an Expo web export installable on iOS as a real home-screen app.

Expo's static export doesn't emit a web app manifest, so we write one and inject
the iOS-specific meta tags into index.html. Result: Safari's "Add to Home Screen"
produces a full-screen app with its own icon and no browser chrome — no Apple
account, no signing, no expiry.

Usage: python3 scripts/pwa.py <dist-dir> [app-name] [accent-hex]
"""
import json
import pathlib
import re
import sys

dist = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
name = sys.argv[2] if len(sys.argv) > 2 else "App"
accent = sys.argv[3] if len(sys.argv) > 3 else "#b7ff2e"
bg = "#05060a"

# Generate the PWA icon sizes from the app icon, so a fresh export is always
# installable without a manual step.
assets = dist / "assets"
assets.mkdir(parents=True, exist_ok=True)
src = pathlib.Path("assets/icon.png")
if src.exists():
    try:
        from PIL import Image
        base = Image.open(src).convert("RGBA")
        for px in (192, 512):
            base.resize((px, px), Image.LANCZOS).save(assets / f"icon-{px}.png")
    except ImportError:
        print("  ! Pillow not installed — copy assets/icon.png to icon-192/512 manually",
              file=sys.stderr)

icon192 = assets / "icon-192.png"
icon512 = assets / "icon-512.png"

manifest = {
    "name": name,
    "short_name": name[:12],
    "description": f"{name} — premium iOS foundation.",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "orientation": "portrait",
    "background_color": bg,
    "theme_color": bg,
    "icons": [
        {"src": p.name, "sizes": f"{s}x{s}", "type": "image/png", "purpose": "any maskable"}
        for p, s in ((icon192, 192), (icon512, 512))
    ],
}
(dist / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

# service worker: offline shell so the app opens without the laptop
(dist / "sw.js").write_text(
    "const CACHE='app-v1';\n"
    "self.addEventListener('install',e=>{self.skipWaiting();});\n"
    "self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});\n"
    "self.addEventListener('fetch',e=>{\n"
    "  if(e.request.method!=='GET')return;\n"
    "  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{\n"
    "    const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res;\n"
    "  }).catch(()=>caches.match('/index.html'))));\n"
    "});\n"
)

idx = dist / "index.html"
html = idx.read_text()
html = re.sub(r'<link[^>]*rel="manifest"[^>]*>', "", html)

inject = f"""  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="{bg}" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="{name}" />
  <link rel="apple-touch-icon" sizes="192x192" href="/assets/icon-192.png" />
  <link rel="apple-touch-icon" sizes="512x512" href="/assets/icon-512.png" />
  <link rel="icon" type="image/png" href="/assets/icon-192.png" />
  <script>
    if ('serviceWorker' in navigator) {{
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {{}}));
    }}
  </script>
"""
if "</head>" in html:
    html = html.replace("</head>", inject + "</head>", 1)
else:
    html = inject + html
idx.write_text(html)

print(f"manifest + apple-touch icons + service worker written into {dist}")
print(f"  {dist/'manifest.json'}")
print(f"  {dist/'sw.js'}")
