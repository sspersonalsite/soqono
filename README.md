# Soqono — Aurora

Marketing site for Soqono Technical Operations. Nine-theme color switcher, animated hero canvas, interactive world map, and smooth-scroll navigation.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173 with hot reload.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main page — hero, What/Where/Who/Programs sections |
| `style.css` | All styling + 9 theme variable blocks |
| `script.js` | Theme switcher, smooth scroll, hero canvas, world map, programs grid, footer injection, cookie banner, favicon |
| `terms.html` | Terms of Use (unlisted) |
| `privacy.html` | Privacy Policy (unlisted) |

## Themes

Click the glowing dot next to "Soqono" to cycle. Choice persists across pages via `localStorage`.

| # | Key | Palette |
|---|---|---|
| 1 | `atomic` | Yellow / red / cyan on black (default) |
| 2 | `aurora` | Teal / blue / violet |
| 3 | `solar` | Amber / red / magenta |
| 4 | `mono` | Grayscale + oxblood |
| 5 | `embedding` | Purple / magenta / teal |
| 6 | `plasma` | Magenta / violet / pink |
| 7 | `forest` | Moss / olive / amber |
| 8 | `coral` | Salmon / peach / pink |
| 9 | `midnight` | Navy / silver / steel |

## Notes

- World map uses TopoJSON data fetched from `cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json`
- Footer content (text + links) is injected by `script.js` — edit the `// ───── Shared footer ─────` block there to update all three pages at once
- Cookie consent stored in `localStorage` under key `sqCookieConsent`
