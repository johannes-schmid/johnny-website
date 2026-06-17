/**
 * translate.mjs — generates Spanish blog post HTML from locales/es.json
 * Usage: node translate.mjs
 * Output: es/blog/<spanish-slug>.html
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const en = JSON.parse(readFileSync(join(__dirname, 'locales/en.json'), 'utf8'));
const es = JSON.parse(readFileSync(join(__dirname, 'locales/es.json'), 'utf8'));

mkdirSync(join(__dirname, 'es/blog'), { recursive: true });

// ── Shared CSS (identical to English posts) ──────────────────────────────────
const sharedCSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --dark: #1d1b1c; --cream: #fefcf5; --yellow: #acd1a6; --warmgray: #eeece7; --muted: #a5a49f; }
    html { scroll-behavior: smooth; overflow-x: hidden; }
    body { background: var(--dark); color: var(--cream); font-family: 'Manrope', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    .grain::after { content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 10; opacity: 0.032; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 220px 220px; }
    .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), transform 0.75s cubic-bezier(0.22, 1, 0.36, 1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-d1 { transition-delay: 0.1s; } .reveal-d2 { transition-delay: 0.2s; } .reveal-d3 { transition-delay: 0.3s; } .reveal-d4 { transition-delay: 0.4s; }
    nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1.2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; background: rgba(29, 27, 28, 0.92); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid rgba(238, 236, 231, 0.07); }
    .nav-logo { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cream); text-decoration: none; }
    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links a { font-family: 'Manrope', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s ease; }
    .nav-links a:hover { color: var(--cream); }
    .lang-switcher { display: flex; align-items: center; gap: 0.35rem; margin-right: 0.75rem; }
    .lang-btn { font-family: 'Manrope', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: var(--muted); transition: color 0.2s ease; }
    .lang-btn:hover, .lang-btn.active { color: var(--cream); }
    .lang-sep { font-size: 0.55rem; color: rgba(165,164,159,0.25); }
    .btn-primary { background: var(--yellow); color: var(--dark); font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.7rem 1.5rem; border-radius: 2px; text-decoration: none; display: inline-block; transition: background 0.2s ease, transform 0.15s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease; }
    .btn-primary:hover { background: #bdddb8; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(172, 209, 166, 0.35); }
    .btn-ghost { border: 1px solid rgba(238, 236, 231, 0.28); color: var(--cream); font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.7rem 1.5rem; border-radius: 2px; text-decoration: none; display: inline-block; transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease; }
    .btn-ghost:hover { border-color: rgba(238, 236, 231, 0.6); background: rgba(238, 236, 231, 0.05); transform: translateY(-2px); }
    .article-hero { min-height: 72vh; position: relative; display: flex; align-items: flex-end; overflow: hidden; }
    .article-hero-img { position: absolute; inset: 0; }
    .article-hero-img img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
    .article-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(29,27,28,0.96) 0%, rgba(29,27,28,0.62) 45%, rgba(29,27,28,0.22) 75%, transparent 100%), linear-gradient(to right, rgba(29,27,28,0.5) 0%, transparent 60%); z-index: 1; }
    .article-hero-content { position: relative; z-index: 2; padding: 10rem 2.5rem 5rem; max-width: 820px; }
    .article-hero-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(2.6rem, 5vw, 5rem); line-height: 0.96; letter-spacing: -0.035em; color: var(--cream); margin-bottom: 1.75rem; }
    .article-hero-title em { font-style: normal; color: var(--yellow); }
    .article-wrap { max-width: 720px; margin: 0 auto; padding: 6rem 2.5rem 7rem; }
    .article-meta { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(238, 236, 231, 0.1); }
    .label { font-family: 'Manrope', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--yellow); }
    .meta-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(238, 236, 231, 0.28); flex-shrink: 0; }
    .meta-text { font-family: 'Manrope', sans-serif; font-size: 0.72rem; color: var(--muted); letter-spacing: 0.04em; }
    .prose h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(1.6rem, 2.4vw, 2.2rem); line-height: 1.12; letter-spacing: -0.03em; color: var(--cream); margin: 3.5rem 0 1.25rem; }
    .prose h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.15rem; letter-spacing: -0.02em; color: var(--cream); margin: 2.5rem 0 0.9rem; }
    .prose p { font-size: 1.05rem; line-height: 1.88; color: rgba(238, 236, 231, 0.78); margin-bottom: 1.6rem; }
    .prose strong { color: var(--cream); font-weight: 600; }
    .prose em { font-style: italic; color: rgba(238, 236, 231, 0.68); }
    .prose a { color: var(--yellow); text-decoration: underline; text-decoration-color: rgba(172,209,166,0.4); transition: text-decoration-color 0.2s ease; }
    .prose a:hover { text-decoration-color: var(--yellow); }
    .prose blockquote { border-left: 3px solid var(--yellow); padding: 1.4rem 1.75rem; background: rgba(172, 209, 166, 0.06); border-radius: 0 4px 4px 0; margin: 2.5rem 0; }
    .prose blockquote p { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.15rem; line-height: 1.55; color: var(--cream); margin-bottom: 0; letter-spacing: -0.01em; }
    .prose ul { list-style: none; margin: 1.5rem 0 2rem; display: flex; flex-direction: column; gap: 0.85rem; }
    .prose ul li { display: flex; align-items: flex-start; gap: 0.9rem; font-size: 1rem; line-height: 1.78; color: rgba(238, 236, 231, 0.78); }
    .prose ul li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--yellow); flex-shrink: 0; margin-top: 0.65em; }
    .pull-quote { text-align: center; padding: 3.5rem 2rem; border-top: 1px solid rgba(238, 236, 231, 0.08); border-bottom: 1px solid rgba(238, 236, 231, 0.08); margin: 3.5rem 0; }
    .pull-quote-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(1.5rem, 2.8vw, 2.2rem); line-height: 1.2; letter-spacing: -0.03em; color: var(--cream); max-width: 28ch; margin: 0 auto; }
    .pull-quote-text span { color: var(--yellow); }
    .section-divider { display: flex; align-items: center; gap: 1rem; margin: 3.5rem 0; }
    .section-divider-line { flex: 1; height: 1px; background: rgba(238, 236, 231, 0.1); }
    .section-divider-diamond { width: 8px; height: 8px; border: 1px solid var(--yellow); transform: rotate(45deg); flex-shrink: 0; }
    .author-card { display: flex; align-items: center; gap: 1.5rem; padding: 2rem; background: rgba(238, 236, 231, 0.04); border: 1px solid rgba(238, 236, 231, 0.08); border-radius: 4px; margin-top: 4rem; }
    .author-avatar-large { width: 60px; height: 60px; border-radius: 50%; background: rgba(172, 209, 166, 0.12); border: 1.5px solid rgba(172, 209, 166, 0.3); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--yellow); flex-shrink: 0; }
    .article-cta { background: #1F3B2A; padding: 7rem 2.5rem; position: relative; overflow: hidden; }
    .article-cta::before { content: ''; position: absolute; top: -40%; left: -10%; width: 60%; height: 180%; background: radial-gradient(ellipse at center, rgba(172,209,166,0.08) 0%, transparent 70%); pointer-events: none; }
    footer { background: var(--dark); padding: 2.75rem 2.5rem; border-top: 1px solid rgba(238, 236, 231, 0.07); }
    .back-link { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Manrope', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s ease, gap 0.2s ease; }
    .back-link:hover { color: var(--cream); gap: 0.7rem; }
    @media (max-width: 900px) { nav { padding: 1rem 1.5rem; } .nav-links { display: none; } .article-hero-content { padding: 8rem 1.5rem 4rem; } .article-wrap { padding: 4rem 1.25rem 5rem; } .article-cta { padding: 5rem 1.25rem; } footer { padding: 2rem 1.25rem; } footer > div { flex-direction: column; align-items: flex-start; gap: 1.25rem; } }
    @media (max-width: 640px) { .article-hero-title { font-size: 2.4rem; } .nav-logo { font-size: 0.9rem; } nav { padding: 0.9rem 1.25rem; } .prose p { font-size: 0.96rem; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .article-hero-content .label { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
    .article-hero-content .article-hero-title { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.22s both; }
    .article-hero-content .hero-meta { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.38s both; }
    .article-hero-img { animation: fadeIn 1.1s ease 0s both; }
`;

// ── Content block → HTML ──────────────────────────────────────────────────────
function renderBlocks(blocks, revealClass = 'reveal') {
  let delay = 0;
  const nextDelay = () => {
    const d = delay;
    delay = (delay + 1) % 4;  // cycles 0–3
    return d === 0 ? revealClass : `${revealClass} reveal-d${d}`;
  };

  return blocks.map(block => {
    const rc = nextDelay();
    switch (block.type) {
      case 'p':
        return `        <p class="${rc}">${block.text}</p>`;
      case 'h2':
        return `        <h2 class="${rc}">${block.text}</h2>`;
      case 'h3':
        return `        <h3 class="${rc}">${block.text}</h3>`;
      case 'blockquote':
        return `        <blockquote class="${rc}"><p>${block.text}</p></blockquote>`;
      case 'divider':
        return `        <div class="section-divider ${rc}">
          <div class="section-divider-line"></div>
          <div class="section-divider-diamond"></div>
          <div class="section-divider-line"></div>
        </div>`;
      case 'pullquote':
        return `        <div class="pull-quote ${rc}">
          <p class="pull-quote-text">${block.text}<br><span>${block.highlight}</span></p>
        </div>`;
      case 'ul':
        const items = block.items.map(item =>
          `          <li><strong>${item.strong}</strong> ${item.text}</li>`
        ).join('\n');
        return `        <ul class="${rc}">\n${items}\n        </ul>`;
      default:
        return '';
    }
  }).join('\n\n');
}

// ── Build one HTML file ───────────────────────────────────────────────────────
function buildPost(postKey, langData, uiStrings, altPath) {
  const p = langData;
  const lang = p.lang;
  const isEs = lang === 'es';

  const navHome = isEs ? '../../index.html' : '../index.html';
  const navBlog = isEs ? '../index.html' : './index.html';
  const backLink = isEs ? '../index.html' : './index.html';
  const enPath = isEs ? p.hreflang_alt_path : `/blog/${p.slug}.html`;
  const esPath = isEs ? `/es/blog/${p.slug}.html` : p.hreflang_alt_path;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.meta_title}</title>
  <meta name="description" content="${p.meta_description}">

  <link rel="alternate" hreflang="en" href="${enPath}">
  <link rel="alternate" hreflang="es" href="${esPath}">
  <link rel="alternate" hreflang="x-default" href="${enPath}">

  <link rel="icon" type="image/svg+xml" href="${isEs ? '../../' : '../'}favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: { colors: { dark: '#1d1b1c', cream: '#fefcf5', yellow: '#acd1a6', warmgray: '#eeece7', muted: '#a5a49f' }, fontFamily: { display: ['Syne', 'sans-serif'], body: ['Manrope', 'sans-serif'] } } } }
  </script>
  <style>${sharedCSS}</style>
</head>
<body>

  <nav>
    <a href="${navHome}" class="nav-logo">Johnny Durán</a>
    <ul class="nav-links">
      <li><a href="${navHome}#about">${uiStrings.nav_about}</a></li>
      <li><a href="${navHome}#services">${uiStrings.nav_services}</a></li>
      <li><a href="${navHome}#method">${uiStrings.nav_method}</a></li>
      <li><a href="${navHome}#testimonials">${uiStrings.nav_testimonials}</a></li>
      <li><a href="${navBlog}">${uiStrings.nav_blog}</a></li>
    </ul>
    <div style="display:flex;align-items:center;gap:1rem;">
      <div class="lang-switcher">
        <a href="${enPath}" class="lang-btn${!isEs ? ' active' : ''}" onclick="sessionStorage.setItem('lang-chosen','en')">EN</a>
        <span class="lang-sep">|</span>
        <a href="${esPath}" class="lang-btn${isEs ? ' active' : ''}" onclick="sessionStorage.setItem('lang-chosen','es')">ES</a>
      </div>
      <a href="${navHome}#cta" class="btn-primary">${uiStrings.nav_apply}</a>
    </div>
  </nav>

  <header class="article-hero grain">
    <div class="article-hero-img">
      <img src="${p.hero_img}" alt="${p.hero_img_alt}">
      <div style="position:absolute;inset:0;background:rgba(29,27,28,0.15);mix-blend-mode:multiply;"></div>
    </div>
    <div class="article-hero-overlay"></div>
    <div class="article-hero-content">
      <span class="label" style="display:block;margin-bottom:1.25rem;">${p.label}</span>
      <h1 class="article-hero-title">
        ${p.h1_before}<br><em>${p.h1_em}</em><br>${p.h1_after}
      </h1>
      <div class="hero-meta" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
        <span class="meta-text">${uiStrings.by_author}</span>
        <div class="meta-dot"></div>
        <span class="meta-text">${p.date}</span>
        <div class="meta-dot"></div>
        <span class="meta-text">${p.read_time}</span>
      </div>
    </div>
  </header>

  <main>
    <div class="article-wrap">
      <a href="${backLink}" class="back-link reveal" style="display:inline-flex;margin-bottom:3rem;">${uiStrings.back_to_journal}</a>

      <div class="article-meta reveal">
        <span class="label">${p.label}</span>
        <div class="meta-dot"></div>
        <span class="meta-text">${p.date}</span>
        <div class="meta-dot"></div>
        <span class="meta-text">${p.read_time}</span>
      </div>

      <div class="prose">

${renderBlocks(p.content)}

        <div class="author-card reveal">
          <div class="author-avatar-large">JD</div>
          <div>
            <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:var(--cream);margin-bottom:0.3rem;">Johnny Durán</div>
            <div style="font-size:0.82rem;line-height:1.65;color:var(--muted);">Leadership &amp; Performance Coach · Founder of TRIBUTHO · Barcelona</div>
          </div>
        </div>

      </div>
    </div>
  </main>

  <section class="article-cta">
    <div style="max-width:680px;margin:0 auto;text-align:center;position:relative;z-index:2;">
      <span class="label reveal" style="display:block;margin-bottom:1.5rem;">${uiStrings.next_step_label}</span>
      <h2 class="reveal reveal-d1" style="font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2.2rem,4vw,3.6rem);line-height:1.05;letter-spacing:-0.03em;color:var(--cream);margin-bottom:1.5rem;">
        ${p.cta_h2_before}<br><em style="font-style:normal;color:var(--yellow);">${p.cta_h2_em}</em>${p.cta_h2_after}
      </h2>
      <p class="reveal reveal-d2" style="font-size:1.02rem;line-height:1.78;color:rgba(254,252,245,0.68);max-width:44ch;margin:0 auto 2.75rem;">
        ${p.cta_body}
      </p>
      <div class="reveal reveal-d3" style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <a href="https://wa.me/34605113195" target="_blank" rel="noopener" class="btn-primary">${uiStrings.cta_apply_btn}</a>
        <a href="https://calendly.com/johnnyduran/discoverycall" target="_blank" rel="noopener" class="btn-ghost">${uiStrings.cta_call_btn}</a>
      </div>
    </div>
  </section>

  <footer>
    <div style="max-width:1160px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;">
      <div>
        <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:0.9rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--cream);margin-bottom:0.35rem;">Johnny Durán</div>
        <div style="font-size:0.75rem;color:rgba(165,164,159,0.7);">${uiStrings.footer_base}</div>
      </div>
      <div style="display:flex;gap:2.25rem;align-items:center;">
        <a href="https://www.instagram.com/johnyduran_?igsh=NXZ3cm1iN3oyNG52&utm_source=qr" target="_blank" rel="noopener" style="font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);text-decoration:none;transition:color 0.2s ease;" onmouseover="this.style.color='var(--cream)'" onmouseout="this.style.color='var(--muted)'">Instagram</a>
        <a href="https://www.linkedin.com/in/johnnyduranwellnessmentor" target="_blank" rel="noopener" style="font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);text-decoration:none;transition:color 0.2s ease;" onmouseover="this.style.color='var(--cream)'" onmouseout="this.style.color='var(--muted)'">LinkedIn</a>
        <a href="https://www.instagram.com/tributho?igsh=emw2dnZtbXY4dDJ6" target="_blank" rel="noopener" style="font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);text-decoration:none;transition:color 0.2s ease;" onmouseover="this.style.color='var(--cream)'" onmouseout="this.style.color='var(--muted)'">TRIBUTHO</a>
      </div>
      <div style="font-size:0.72rem;color:rgba(165,164,159,0.5);">${uiStrings.footer_copy}</div>
    </div>
  </footer>

  <script>
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('visible'); } else { revealObserver.observe(el); }
    });
  </script>
</body>
</html>`;
}

// ── Generate all Spanish posts ────────────────────────────────────────────────
const ui = es.ui;

for (const [postKey, esPost] of Object.entries(es.posts)) {
  const html = buildPost(postKey, esPost, ui);
  const outPath = join(__dirname, `es/blog/${esPost.slug}.html`);
  writeFileSync(outPath, html, 'utf8');
  console.log(`✓ es/blog/${esPost.slug}.html`);
}

// ── Also update the English posts to include hreflang links ──────────────────
// (patch only the <head> alternate links — non-destructive)
import { existsSync } from 'fs';

for (const [postKey, enPost] of Object.entries(en.posts)) {
  const enFile = join(__dirname, `blog/${enPost.slug}.html`);
  if (!existsSync(enFile)) { console.warn(`  skip (not found): blog/${enPost.slug}.html`); continue; }

  let html = readFileSync(enFile, 'utf8');
  const esSlug = es.posts[postKey].slug;
  const esHref = `/es/blog/${esSlug}.html`;
  const enHref = `/blog/${enPost.slug}.html`;

  // Skip if already patched
  if (html.includes('hreflang="es"')) { console.log(`  already has hreflang: blog/${enPost.slug}.html`); continue; }

  const hreflangBlock = `  <link rel="alternate" hreflang="en" href="${enHref}">
  <link rel="alternate" hreflang="es" href="${esHref}">
  <link rel="alternate" hreflang="x-default" href="${enHref}">
`;
  html = html.replace('<link rel="icon"', hreflangBlock + '  <link rel="icon"');
  writeFileSync(enFile, html, 'utf8');
  console.log(`  + hreflang → blog/${enPost.slug}.html`);
}

console.log('\nDone.');
