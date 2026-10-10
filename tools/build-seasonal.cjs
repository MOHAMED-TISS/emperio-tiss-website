// Seasonal almanac: writes the editorial <main> of /products/seasonal/ in every language
// from tools/editorial/{lang}.json and the vegetable availability in produce-varieties.json.
// Usage: node tools/build-seasonal.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const LANGS = ['es', 'en', 'fr', 'it', 'ar'];
const VERSION = '20261010-1';
const GROUPS = {
  tomatoes: ['tomato', 'tomato-cherry-round', 'tomato-cherry-long'],
  fruiting: ['pepper', 'cucumber', 'zucchini', 'aubergine', 'green-bean'],
  brassicas: ['broccoli', 'cauliflower'],
  roots: ['potato', 'garlic']
};
const SEASON_PHOTOS = ['orange', 'strawberry', 'peach', 'granada'];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = s => esc(s);
const prefix = lang => (lang === 'es' ? '' : `/${lang}`);

const produce = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/produce-varieties.json'), 'utf8')).products;
const availability = Object.fromEntries(produce.filter(p => p.availability).map(p => [p.id, p]));
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/catalog-v1.3.json'), 'utf8'));
const products = Array.isArray(catalog) ? catalog : (catalog.products || Object.values(catalog).find(Array.isArray));
const refOf = id => (products.find(p => p.id === id) || availability[id] || {}).reference || '';

for (const ids of Object.values(GROUPS)) for (const id of ids) {
  if (!availability[id]) throw new Error(`no availability for ${id}`);
  for (const f of [`${id}-600.webp`, `${id}-dark-600.webp`]) if (!fs.existsSync(path.join(ROOT, 'assets/images/vegetables', f))) throw new Error(`missing image ${f}`);
}

const main = (lang, c) => {
  const s = c.seasonal;
  const P = prefix(lang);
  const cal = s.calendar;
  const levelName = { 3: s.now.high, 2: s.now.medium, 1: s.now.limited };
  const cell = (es, ma, m) => `<td class="sa-cal__m" data-m="${m}"><span class="sa-bar sa-l${es}" title="${attr(s.now.spain)} · ${attr(levelName[es] || '')}"></span><span class="sa-bar sa-l${ma}" title="${attr(s.now.morocco)} · ${attr(levelName[ma] || '')}"></span></td>`;
  const rows = Object.entries(GROUPS).map(([g, ids]) =>
    `<tr class="sa-cal__group"><th scope="rowgroup" colspan="13">${esc(cal.groups[g])}</th></tr>`
    + ids.map(id => {
      const a = availability[id].availability;
      return `<tr class="sa-cal__row" data-id="${id}" data-group="${g}" data-ref="${refOf(id)}" data-es="${a.spain.join(',')}" data-ma="${a.morocco.join(',')}">`
        + `<th scope="row" class="sa-cal__name"><span>${esc(cal.names[id])}</span><small>REF ${refOf(id)}</small></th>`
        + a.spain.map((es, m) => cell(es, a.morocco[m], m)).join('') + '</tr>';
    }).join('')).join('');

  const seasonCards = s.seasons.items.map((it, i) => `
          <article class="sa-season">
            <figure class="sa-season__photo"><img src="/assets/images/fruits/${SEASON_PHOTOS[i]}.webp" alt="" width="1200" height="1500" loading="lazy" decoding="async"></figure>
            <p class="sa-season__name"><span>0${i + 1}</span>${esc(it.name)}</p>
            <h3>${esc(it.title)}</h3>
            <p>${esc(it.text)}</p>
            <p class="sa-season__list">${esc(it.list)}</p>
          </article>`).join('');

  return `<main id="main-content" class="sa-page" data-months-long="${attr(JSON.stringify(cal.monthsLong))}">
      <section class="sa-hero" aria-labelledby="sa-title">
        <div class="sa-wrap sa-hero__inner">
          <p class="sa-kicker">${esc(s.hero.kicker)}</p>
          <h1 id="sa-title">${s.hero.h1}</h1>
          <p class="sa-hero__lead">${esc(s.hero.lead)}</p>
          <div class="sa-hero__actions">
            <a class="sa-btn sa-btn--gold" href="#calendario">${esc(s.hero.cta1)} <span aria-hidden="true">↓</span></a>
            <a class="sa-btn sa-btn--line" href="${P}/contact/">${esc(s.hero.cta2)} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="sa-wrap sa-hero__bar">
          <span>${esc(s.hero.caption)}</span>
          <a href="#ahora"><small>${esc(s.hero.monthLabel)}</small><b data-sa-month>${esc(cal.monthsLong[9])}</b> <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section class="sa-intro" aria-labelledby="sa-intro-title">
        <div class="sa-wrap sa-intro__grid">
          <div>
            <p class="sa-kicker">${esc(s.intro.kicker)}</p>
            <h2 id="sa-intro-title">${s.intro.h2}</h2>
          </div>
          <div class="sa-intro__copy">
            <p class="sa-dropcap">${esc(s.intro.p1)}</p>
            <p>${esc(s.intro.p2)}</p>
          </div>
        </div>
        <dl class="sa-wrap sa-figures">
          ${s.intro.figures.map(f => `<div><dt>${esc(f.n)}</dt><dd>${esc(f.l)}</dd></div>`).join('')}
        </dl>
      </section>

      <section class="sa-now" id="ahora" aria-labelledby="sa-now-title" data-high="${attr(s.now.high)}" data-medium="${attr(s.now.medium)}" data-limited="${attr(s.now.limited)}" data-spain="${attr(s.now.spain)}" data-morocco="${attr(s.now.morocco)}">
        <div class="sa-wrap">
          <div class="sa-head">
            <div>
              <p class="sa-kicker">${esc(s.now.kicker)}</p>
              <h2 id="sa-now-title">${s.now.h2}</h2>
              <p class="sa-head__lead">${esc(s.now.lead)}</p>
            </div>
            <p class="sa-now__month" aria-hidden="true" data-sa-month>${esc(cal.monthsLong[9])}</p>
          </div>
          <div class="sa-now__grid" data-sa-now></div>
          <div class="sa-now__foot">
            <p data-sa-next-wrap hidden><span>${esc(s.now.next)} · <b data-sa-next-month></b></span><em data-sa-next></em></p>
            <a class="sa-link" href="${P}/products/vegetables/">${esc(s.now.link)} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section class="sa-calendar" id="calendario" aria-labelledby="sa-cal-title">
        <div class="sa-wrap">
          <div class="sa-head">
            <div>
              <p class="sa-kicker">${esc(cal.kicker)}</p>
              <h2 id="sa-cal-title">${cal.h2}</h2>
              <p class="sa-head__lead">${esc(cal.lead)}</p>
            </div>
            <ul class="sa-legend">
              <li><i class="sa-l3"></i>${esc(s.now.high)}</li>
              <li><i class="sa-l2"></i>${esc(s.now.medium)}</li>
              <li><i class="sa-l1"></i>${esc(s.now.limited)}</li>
              <li class="sa-legend__origins"><span><b></b>${esc(s.now.spain)}</span><span><b></b>${esc(s.now.morocco)}</span></li>
            </ul>
          </div>
          <div class="sa-cal__scroll" tabindex="0">
            <table class="sa-cal">
              <thead><tr><th scope="col" class="sa-cal__name">${esc(cal.product)}</th>${cal.months.map((m, i) => `<th scope="col" data-m="${i}" abbr="${attr(cal.monthsLong[i])}">${esc(m)}</th>`).join('')}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          <p class="sa-note">${esc(cal.note)}</p>
        </div>
      </section>

      <section class="sa-seasons" aria-labelledby="sa-seasons-title">
        <div class="sa-wrap">
          <div class="sa-head">
            <div>
              <p class="sa-kicker">${esc(s.seasons.kicker)}</p>
              <h2 id="sa-seasons-title">${s.seasons.h2}</h2>
            </div>
            <p class="sa-head__lead">${esc(s.seasons.lead)}</p>
          </div>
          <div class="sa-seasons__grid">${seasonCards}
          </div>
          <div class="sa-seasons__notes">
            <div><h3>${esc(s.seasons.sea.title)}</h3><p>${esc(s.seasons.sea.text)}</p></div>
            <div><h3>${esc(s.seasons.tropical.title)}</h3><p>${esc(s.seasons.tropical.text)}</p></div>
          </div>
        </div>
      </section>

      <section class="sa-method" aria-labelledby="sa-method-title">
        <div class="sa-wrap sa-method__grid">
          <div>
            <p class="sa-kicker">${esc(s.method.kicker)}</p>
            <h2 id="sa-method-title">${s.method.h2}</h2>
          </div>
          <div>
            <ol class="sa-steps">
              ${s.method.steps.map((st, i) => `<li><span>${['I', 'II', 'III'][i]}</span><div><h3>${esc(st.t)}</h3><p>${esc(st.p)}</p></div></li>`).join('')}
            </ol>
            <p class="sa-note">${esc(s.method.note)}</p>
          </div>
        </div>
      </section>

      <section class="sa-cta" aria-labelledby="sa-cta-title">
        <div class="sa-wrap sa-cta__inner">
          <p class="sa-kicker">${esc(s.cta.kicker)}</p>
          <h2 id="sa-cta-title">${s.cta.h2}</h2>
          <p>${esc(s.cta.p)}</p>
          <a class="sa-btn sa-btn--gold" href="${P}/contact/">${esc(s.cta.button)} <span aria-hidden="true">↗</span></a>
          <small>${esc(s.cta.small)}</small>
        </div>
      </section>
    </main>`;
};

for (const lang of LANGS) {
  const src = path.join(__dirname, 'editorial', `${lang}.json`);
  if (!fs.existsSync(src)) { console.log(lang, 'skipped (no content)'); continue; }
  const c = JSON.parse(fs.readFileSync(src, 'utf8'));
  const file = path.join(ROOT, lang === 'es' ? '' : lang, 'products/seasonal/index.html');
  let html = fs.readFileSync(file, 'utf8');
  const m = c.seasonal.meta;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${attr(m.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${attr(m.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(m.description)}$2`);
  // body: one class set for every language (the Arabic page keeps its marker class)
  const bodyClass = `seasonal-almanac brand-pages${lang === 'ar' ? ' ar-page' : ''}`;
  html = html.replace(/<body[^>]*>/, `<body class="${bodyClass}" data-brand-category="seasonal" data-ivory-hero="season">`);
  html = html.replace(/<main[\s\S]*<\/main>/, main(lang, c));
  // stylesheets: the shared shell plus the almanac (catalogue and legacy page sheets removed)
  html = html.replace(/\s*<link rel="stylesheet" href="\/assets\/css\/(?:home|pages|products-en|compact-catalog|seasonal-almanac|product-heroes)\.css[^"]*">/g, '');
  html = html.replace(/(<link rel="stylesheet" href="\/assets\/css\/header-2026\.css[^"]*"[^>]*>)/,
    `$1\n    <link rel="stylesheet" href="/assets/css/product-heroes.css?v=20261010-2">\n    <link rel="stylesheet" href="/assets/css/seasonal-almanac.css?v=${VERSION}">`);
  // scripts: no catalogue renderer on this page; the almanac script after global.js
  html = html.replace(/\s*<script src="\/assets\/js\/(?:catalog|seasonal-almanac)\.js[^"]*"[^>]*><\/script>/g, '');
  html = html.replace(/(<script src="\/assets\/js\/global\.js[^"]*" defer><\/script>)/, `$1\n    <script src="/assets/js/seasonal-almanac.js?v=${VERSION}" defer></script>`);
  if (!html.includes('seasonal-almanac.css') || !html.includes('seasonal-almanac.js')) throw new Error(`${lang}: links not inserted`);
  fs.writeFileSync(file, html);
  console.log(lang, 'ok');
}
