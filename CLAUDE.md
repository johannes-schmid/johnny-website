# CLAUDE.md — Johnny Durán Website

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

---

## Project Overview

**Johnny Durán** is a psychotherapist based in Barcelona offering therapy in English and Spanish. The site is his personal practice website targeting two distinct audiences:

- **English**: European/American expat founders and executives in Barcelona. Language of performance, burnout, clarity, ROI. Never therapy language.
- **Spanish**: Latin American and Spanish men. Emotional, direct, close voice. Language of wound, burden, masculinity. Not performance/ROI framing.

Men don't search "depression/anxiety" — they search "burnout", "can't sleep", "always angry", "relationship tension". All content targets symptom-based search intent.

**Live site**: `https://www.johnnydurán.com`  
**GitHub**: `https://github.com/johannes-schmid/johnny-website`  
**Pexels API key**: stored in `.env` as `PEXELS_API_KEY`

---

## Site Structure

```
/                         → index.html (EN homepage)
/es/index.html            → Spanish homepage
/blog/index.html          → EN blog listing
/es/blog/index.html       → ES blog listing
/blog/<slug>.html         → EN blog posts
/es/blog/<slug>.html      → ES blog posts (different SEO slugs)
/sitemap.xml              → XML sitemap (all EN + ES URLs with hreflang)
/locales/en.json          → EN translation source of truth
/locales/es.json          → ES translation source of truth
/translate.mjs            → Generator: reads locales/*.json → outputs es/blog/*.html
/serve.mjs                → Dev server (serves project root at localhost:3000)
/brand_assets/            → Logos, color guides, style assets
/Resources/Pictures/      → Local photography assets
```

---

## Design System

All styles are inline in each HTML file (no external CSS). Design tokens:

| Token | Value | Usage |
|---|---|---|
| `--dark` | `#1d1b1c` | Background, nav |
| `--cream` | `#fefcf5` | Light sections, body bg |
| `--yellow` | `#acd1a6` | Accent (sage green, not yellow) |
| `--warmgray` | `#eeece7` | Subtle section bg |
| `--muted` | `#a5a49f` | Secondary text |

**Fonts**: Syne (display/headings) + Manrope (body) — loaded via Google Fonts  
**Texture**: SVG noise filter grain overlay (`.grain` class) applied to hero sections  
**Animations**: Scroll reveal via `.reveal` + delay classes `.reveal-d1/.d2/.d3/.d4`  
**Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` (spring-style) — never `transition-all`

---

## Blog Posts (current)

| English slug | Spanish slug | Topic |
|---|---|---|
| `burnout-barcelona` | *(EN only)* | Burnout in Barcelona — original post |
| `burnout-signs-high-performers` | `senales-burnout-alto-rendimiento` | 7 signs of burnout |
| `stress-insomnia-leaders` | `insomnio-por-estres` | Can't sleep from stress |
| `chronic-stress-focus-performance` | `estres-cronico-rendimiento` | Chronic stress drains edge |
| `always-irritable-burnout` | `siempre-irritable-burnout` | Always irritable / nervous system |
| `work-stress-relationship-tension` | `estres-trabajo-tension-en-pareja` | Work stress breaking relationships |

All posts use real Pexels photography. Hero images: `?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600`. Card thumbnails: `h=450&w=800`.

---

## i18n / Translation System

- `locales/en.json` and `locales/es.json` are the source of truth for all post content (meta, h1, body blocks, CTAs, UI strings).
- `translate.mjs` reads both JSON files and generates all Spanish blog posts to `es/blog/`.
- **To add a new bilingual post**:
  1. Create the English HTML in `blog/<slug>.html`
  2. Add the post entry to `locales/en.json` and `locales/es.json`
  3. Run `node translate.mjs` — generates `es/blog/<es-slug>.html`
  4. Add both URLs to `sitemap.xml`
  5. Update `blog/index.html`, `es/blog/index.html`, `index.html`, `es/index.html` (blog cards)

---

## Multilingual Content Rule

This site is **bilingual (English + Spanish)**. Whenever you add or update any content:
- Update the **English version first** (`index.html`, `blog/index.html`)
- Then update the **Spanish version** (`es/index.html`, `es/blog/index.html`)
- Never leave one language out of sync with the other
- New blog posts need a Spanish translation generated via `translate.mjs`
- Image paths in `es/` use `../` prefix; in `es/blog/` use `../../` prefix
- Nav home link: `../../index.html` for ES blog posts, `../index.html` for EN blog posts

### hreflang SEO
Every page must have `<link rel="alternate">` tags for `hreflang="en"`, `hreflang="es"`, and `hreflang="x-default"` in `<head>`. EN pages point to their ES counterpart and vice versa.

---

## Sitemap

`sitemap.xml` at the project root lists all pages with `xhtml:link` hreflang alternates. Update it whenever:
- A new blog post is added
- A new page is added to the site
- A URL changes

---

## Local Server

- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server:  
  `node serve.mjs`  
  (serves the project root at `http://localhost:3000`)
- `serve.mjs` maps `/` → `index.html` only. No directory indexes — all links must use explicit `.html` filenames.
- If the server is already running, do not start a second instance.

---

## Screenshot Workflow

- **Always screenshot from localhost:**  
  `node screenshot.mjs http://localhost:3000`
- Screenshots saved to `./temporary_screenshots/screenshot-N.png` (auto-incremented)
- Optional label: `node screenshot.mjs http://localhost:3000 label` → `screenshot-N-label.png`

---

## Output Defaults

- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Prefer real Pexels photos where relevant (key in `.env`)
- Mobile-first responsive

---

## Brand Assets

- Always check the `brand_assets/` folder before designing.
- Use real assets — do not use placeholders where real assets are available.
- Color palette is defined above — do not invent brand colors.

---

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.).
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating).

---

## Hard Rules

- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not commit `.env` to git
