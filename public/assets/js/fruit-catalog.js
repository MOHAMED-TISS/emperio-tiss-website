(() => {
  'use strict';

  const DATA_URL = '/assets/data/fruit-catalog-v1.json';
  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const labels = {
    es: { catalogue:'CATÁLOGO', title:'Frutas', subtitle:'Por familia.', note:'Una selección definida por origen, variedad, calibre, calidad y programa de suministro.', varieties:'Variedades', origin:'Origen', calibre:'Calibre', campaign:'Campaña', format:'Formato', availability:'Disponibilidad', other:'Selección adicional', fresh:'Fresco', request:'Solicitar referencia' },
    en: { catalogue:'CATALOGUE', title:'Fruit', subtitle:'By family.', note:'A selection defined by origin, variety, calibre, quality and supply programme.', varieties:'Varieties', origin:'Origin', calibre:'Calibre', campaign:'Campaign', format:'Format', availability:'Availability', other:'Additional selection', fresh:'Fresh', request:'Request reference' },
    fr: { catalogue:'CATALOGUE', title:'Fruits', subtitle:'Par famille.', note:'Une sélection définie par l’origine, la variété, le calibre, la qualité et le programme d’approvisionnement.', varieties:'Variétés', origin:'Origine', calibre:'Calibre', campaign:'Campagne', format:'Format', availability:'Disponibilité', other:'Sélection complémentaire', fresh:'Frais', request:'Demander la référence' },
    it: { catalogue:'CATALOGO', title:'Frutta', subtitle:'Per famiglia.', note:'Una selezione definita da origine, varietà, calibro, qualità e programma di fornitura.', varieties:'Varietà', origin:'Origine', calibre:'Calibro', campaign:'Campagna', format:'Formato', availability:'Disponibilità', other:'Selezione aggiuntiva', fresh:'Fresco', request:'Richiedi referenza' },
    ar: { catalogue:'الكتالوج', title:'الفواكه', subtitle:'حسب الفئة.', note:'مجموعة مختارة وفق المنشأ والصنف والمقاس والجودة وبرنامج التوريد.', varieties:'الأصناف', origin:'المنشأ', calibre:'المقاس', campaign:'الموسم', format:'التنسيق', availability:'التوفر', other:'اختيارات إضافية', fresh:'طازج', request:'طلب المرجع' }
  };
  const t = labels[lang] || labels.es;
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const first = value => Array.isArray(value) ? (value.find(Boolean) || '') : (value || '');

  function ensureStyles() {
    if (document.getElementById('etCitrusTreeStyles')) return;
    const style = document.createElement('style');
    style.id = 'etCitrusTreeStyles';
    style.textContent = `
      .produce-fruits-page .fruit-special-catalog{padding:clamp(4.5rem,9vw,8rem) 0;background:#f6f3eb;overflow:hidden}
      .produce-fruits-page .fruit-special-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.72fr);gap:3rem;align-items:end;margin-bottom:4rem}
      .produce-fruits-page .fruit-special-head h2{font-family:var(--et-serif,Georgia,serif);font-weight:400;font-size:clamp(3rem,7vw,6rem);line-height:.9;margin:.4rem 0 0;color:#102331}
      .produce-fruits-page .fruit-special-head h2 em{font-style:italic}
      .produce-fruits-page .fruit-special-note{margin:0;color:#65706b;line-height:1.75;max-width:34rem}
      .produce-fruits-page .citrus-tree-wrap{position:relative;max-width:1120px;margin:0 auto;padding:1rem 0 4rem;min-height:690px}
      .produce-fruits-page .citrus-tree-svg{position:absolute;inset:45px 0 30px;width:100%;height:620px;pointer-events:none;overflow:visible}
      .produce-fruits-page .citrus-trunk,.produce-fruits-page .citrus-branch{fill:none;stroke:#243b31;stroke-width:1.15;stroke-linecap:round;stroke-linejoin:round;opacity:.72;stroke-dasharray:900;stroke-dashoffset:900;transition:stroke-dashoffset 1.8s cubic-bezier(.22,.8,.22,1)}
      .produce-fruits-page .citrus-branch{stroke:#657761;stroke-width:.8;transition-delay:.22s}
      .produce-fruits-page .citrus-tree-wrap.is-visible .citrus-trunk,.produce-fruits-page .citrus-tree-wrap.is-visible .citrus-branch{stroke-dashoffset:0}
      .produce-fruits-page .citrus-node{position:absolute;text-align:center;z-index:2;transform:translate(-50%,-50%);opacity:0;transition:opacity .7s ease,transform .9s cubic-bezier(.22,.8,.22,1)}
      .produce-fruits-page .citrus-tree-wrap.is-visible .citrus-node{opacity:1;transform:translate(-50%,-50%)}
      .produce-fruits-page .citrus-family{width:220px}
      .produce-fruits-page .citrus-family .index{display:block;font:600 .56rem/1 var(--et-sans,Arial,sans-serif);letter-spacing:.18em;color:#b38b4c;margin-bottom:.45rem}
      .produce-fruits-page .citrus-family h3{margin:0;font:400 1.55rem/1.05 var(--et-serif,Georgia,serif);color:#102331}
      .produce-fruits-page .citrus-family p{margin:.45rem auto 0;font:400 .58rem/1.4 var(--et-sans,Arial,sans-serif);letter-spacing:.1em;text-transform:uppercase;color:#7a847d}
      .produce-fruits-page .citrus-variety{width:150px}
      .produce-fruits-page .citrus-variety button{border:0;background:transparent;padding:.35rem .25rem;cursor:pointer;color:#243b31;font:500 .76rem/1.2 var(--et-sans,Arial,sans-serif);letter-spacing:.03em;transition:color .25s ease,transform .25s ease}
      .produce-fruits-page .citrus-variety button:before{content:'·';display:block;color:#b38b4c;font-size:1.2rem;line-height:.7;margin-bottom:.25rem}
      .produce-fruits-page .citrus-variety button:hover,.produce-fruits-page .citrus-variety button:focus-visible{color:#a87935;transform:translateY(-2px);outline:none}
      .produce-fruits-page .citrus-detail{max-width:860px;margin:1rem auto 0;min-height:130px;border-top:1px solid rgba(16,35,49,.15);border-bottom:1px solid rgba(16,35,49,.12);padding:1.35rem 0;display:grid;grid-template-columns:1.2fr 2fr;gap:2rem;align-items:start;opacity:0;transform:translateY(10px);transition:opacity .45s ease,transform .45s ease}
      .produce-fruits-page .citrus-detail.is-open{opacity:1;transform:none}
      .produce-fruits-page .citrus-detail h4{margin:0;font:400 1.45rem/1 var(--et-serif,Georgia,serif);color:#102331}
      .produce-fruits-page .citrus-detail h4 em{font-style:italic}
      .produce-fruits-page .citrus-detail p{margin:.45rem 0 0;color:#748078;font:400 .65rem/1.5 var(--et-sans,Arial,sans-serif)}
      .produce-fruits-page .citrus-specs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
      .produce-fruits-page .citrus-spec label{display:block;font:600 .5rem/1 var(--et-sans,Arial,sans-serif);letter-spacing:.13em;text-transform:uppercase;color:#b38b4c;margin-bottom:.4rem}
      .produce-fruits-page .citrus-spec span{font:400 .68rem/1.45 var(--et-sans,Arial,sans-serif);color:#263a32}
      .produce-fruits-page .fruit-other{margin-top:6rem;padding-top:2rem;border-top:1px solid rgba(16,35,49,.12)}
      .produce-fruits-page .fruit-other h3{margin:0 0 1.4rem;font:400 2rem/1 var(--et-serif,Georgia,serif);color:#102331}
      .produce-fruits-page .fruit-other-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
      .produce-fruits-page .fruit-other-card{padding:1.3rem;border:1px solid rgba(16,35,49,.11);background:rgba(255,255,255,.28)}
      .produce-fruits-page .fruit-other-card span{font:600 .53rem/1 var(--et-sans,Arial,sans-serif);letter-spacing:.14em;text-transform:uppercase;color:#b38b4c}
      .produce-fruits-page .fruit-other-card h4{margin:.5rem 0;font:400 1.3rem/1.05 var(--et-serif,Georgia,serif);color:#102331}
      .produce-fruits-page .fruit-other-card p{margin:0;color:#707a74;font:400 .62rem/1.55 var(--et-sans,Arial,sans-serif)}
      @media(max-width:900px){.produce-fruits-page .citrus-tree-wrap{min-height:900px}.produce-fruits-page .citrus-tree-svg{height:830px}.produce-fruits-page .citrus-family{width:190px}.produce-fruits-page .citrus-variety{width:125px}.produce-fruits-page .citrus-detail{grid-template-columns:1fr}.produce-fruits-page .fruit-other-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:640px){.produce-fruits-page .fruit-special-catalog{padding-block:3.5rem}.produce-fruits-page .fruit-special-head{grid-template-columns:1fr;gap:1.5rem;margin-bottom:2rem}.produce-fruits-page .citrus-tree-wrap{min-height:1120px;padding-bottom:2rem}.produce-fruits-page .citrus-tree-svg{display:none}.produce-fruits-page .citrus-node{position:relative!important;left:auto!important;top:auto!important;transform:none!important;width:auto;margin:0 auto;opacity:1!important}.produce-fruits-page .citrus-family{margin:2.2rem auto 0}.produce-fruits-page .citrus-variety{display:inline-block;width:46%;margin:.3rem 1%}.produce-fruits-page .citrus-family h3{font-size:1.65rem}.produce-fruits-page .citrus-detail{margin-top:1rem}.produce-fruits-page .citrus-specs{grid-template-columns:1fr}.produce-fruits-page .fruit-other-grid{grid-template-columns:1fr}.produce-fruits-page .fruit-other{margin-top:3.5rem}}
    `;
    document.head.appendChild(style);
  }

  const citrusGeometry = {
    family: [
      {x:50,y:22}, {x:27,y:49}, {x:73,y:49}
    ],
    variety: [
      {x:17,y:70},{x:24,y:70},{x:31,y:70},
      {x:63,y:70},{x:70,y:70},{x:77,y:70},{x:84,y:70},{x:70,y:84},
      {x:40,y:91},{x:47,y:91},{x:54,y:91},{x:61,y:91}
    ]
  };

  function citrusTree(products) {
    const clementina = products.find(p => p.id === 'clementina');
    const mandarina = products.find(p => p.id === 'mandarina');
    const orange = products.find(p => p.id === 'orange');
    const families = [clementina, mandarina, orange].filter(Boolean);
    const branches = `<path class="citrus-trunk" d="M560 610 C560 500 555 405 560 300 C565 220 560 150 560 75"/><path class="citrus-branch" d="M560 300 C505 260 420 230 310 205 C270 195 245 175 215 145"/><path class="citrus-branch" d="M560 300 C615 260 700 230 810 205 C850 195 875 175 905 145"/><path class="citrus-branch" d="M560 430 C470 390 380 370 260 355 C220 350 185 330 155 305"/><path class="citrus-branch" d="M560 430 C650 390 740 370 860 355 C900 350 935 330 965 305"/>`;
    const familyNodes = families.map((p,i) => `<div class="citrus-node citrus-family" style="left:${citrusGeometry.family[i].x}%;top:${citrusGeometry.family[i].y}%"><span class="index">0${i+1}</span><h3>${esc(p.commercialName || (i===0?'Clementinas':i===1?'Mandarinas':'Naranjas de mesa'))}</h3><p>${esc(first(p.scientificName))}</p></div>`).join('');
    const varietyNodes = [];
    families.forEach((p,fi) => (p.varieties || []).forEach((v,vi) => {
      let pos;
      if(fi===0) pos=citrusGeometry.variety[vi] || {x:27,y:70+vi*7};
      else if(fi===1) pos=citrusGeometry.variety[3+vi] || {x:63+vi*7,y:70};
      else pos=citrusGeometry.variety[9+vi] || {x:40+vi*7,y:91};
      varietyNodes.push(`<div class="citrus-node citrus-variety" style="left:${pos.x}%;top:${pos.y}%"><button type="button" data-citrus-variety="${esc(v)}" data-citrus-product="${esc(p.id)}">${esc(v)}</button></div>`);
    }));
    return `<div class="citrus-tree-wrap"><svg class="citrus-tree-svg" viewBox="0 0 1120 650" aria-hidden="true">${branches}</svg>${familyNodes}${varietyNodes.join('')}</div>`;
  }

  function detail(product, variety) {
    const origin = first(product.origin) || 'Según campaña';
    const calibre = first(product.calibre) || 'Según especificación del comprador';
    const campaign = first(product.availability) || 'Según campaña y programa';
    const format = first(product.format) || 'Según destino';
    return `<div class="citrus-detail is-open"><div><h4>${esc(variety)} <em>· ${esc(product.commercialName)}</em></h4><p>${esc(first(product.scientificName))}</p></div><div class="citrus-specs"><div class="citrus-spec"><label>${esc(t.origin)}</label><span>${esc(origin)}</span></div><div class="citrus-spec"><label>${esc(t.calibre)}</label><span>${esc(calibre)}</span></div><div class="citrus-spec"><label>${esc(t.campaign)}</label><span>${esc(campaign)}</span></div><div class="citrus-spec"><label>${esc(t.format)}</label><span>${esc(format)}</span></div></div></div>`;
  }

  function otherCards(products) {
    return products.filter(p => p.subcategory !== 'citrus' && p.status === 'active').map(p => `<article class="fruit-other-card"><span>${esc(first(p.subcategory))}</span><h4>${esc(p.commercialName)}</h4><p>${esc((p.varieties || []).join(' · '))}</p></article>`).join('');
  }

  async function init() {
    const target = document.getElementById('fruitCatalog');
    if (!target) return;
    ensureStyles();
    try {
      const response = await fetch(DATA_URL, {cache:'no-cache'});
      if (!response.ok) throw new Error(`Fruit catalogue request failed: ${response.status}`);
      const data = await response.json();
      const products = Array.isArray(data.products) ? data.products : [];
      const citrus = products.filter(p => p.subcategory === 'citrus' && p.status === 'active');
      target.className = 'fruit-special-catalog';
      target.innerHTML = `<div class="fruit-special-head"><div><span class="eyebrow">${esc(t.catalogue)}</span><h2>${esc(t.title)}<br><em>${esc(t.subtitle)}</em></h2></div><p class="fruit-special-note">${esc(t.note)}</p></div>${citrusTree(citrus)}<div id="citrusDetail" aria-live="polite"></div><div class="fruit-other"><h3>${esc(t.other)}</h3><div class="fruit-other-grid">${otherCards(products)}</div></div>`;
      const detailTarget = target.querySelector('#citrusDetail');
      target.querySelectorAll('[data-citrus-variety]').forEach(button => button.addEventListener('click', () => {
        const product = citrus.find(p => p.id === button.dataset.citrusProduct);
        if (!product) return;
        detailTarget.innerHTML = detail(product, button.dataset.citrusVariety);
        detailTarget.scrollIntoView({behavior:'smooth', block:'nearest'});
      }));
      const tree = target.querySelector('.citrus-tree-wrap');
      if (tree && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ tree.classList.add('is-visible'); observer.disconnect(); } }), {threshold:.15});
        observer.observe(tree);
      } else if (tree) tree.classList.add('is-visible');
      document.documentElement.dataset.fruitCatalogReady = 'true';
    } catch (error) {
      console.error('[EMPERIO TISS] Fruit catalogue failed:', error);
      document.documentElement.dataset.fruitCatalogReady = 'false';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
