# Soqono — www.soqono.com

Company website for Soqono, a technical research operations firm based in California.

## Stack

Static site — HTML, CSS, and vanilla JavaScript. No framework, no build step.

Hosted on **GitHub Pages**, proxied through **Cloudflare** (DNS, SSL, CDN).

## Local development

```bash
npx serve .
```

Opens the site at `http://localhost:3000`. No install required beyond Node.js.

## Repository structure

```
index.html        Main site
style.css         All styles
script.js         All client-side logic
privacy.html      Privacy policy
terms.html        Terms of service
staff/            Cropped portrait photos (used by the site)
brand/            Brand assets — gitignored, not in repo
development/      Prototype/experimental files — gitignored, not in repo
```

## Branch conventions

| Branch | Purpose |
|---|---|
| `main` | Live site — do not push directly |
| `feature/<description>` | All new work branches from here |

**Workflow:**
1. Branch off `main`: `git checkout -b feature/your-description`
2. Make changes and preview locally with `npx serve .`
3. Open a pull request into `main`
4. Get at least one review before merging

## Staff portraits

Cropped portrait files live in `staff/`. Naming convention: `Firstname-sq.jpg` (or `.png`/`.jpeg`).

Original/unprocessed photos are stored locally in `to_delete/staff-orig/` — gitignored and not part of the repo.

## Deployment

Merging to `main` automatically deploys via GitHub Pages. Cloudflare propagates within seconds. SSL mode is set to **Full** in Cloudflare.
