(() => {
  'use strict';

  const DATA_URL = '/assets/data/fruit-catalog-v1.json';
  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const labels = {
    es: { catalogue:'CÍTRICOS', title:'Del árbol', subtitle:'al mercado.', intro:'Una selección profesional construida alrededor de variedad, origen, calibre y ventana comercial.', families:['Clementinas','Mandarinas','Naranjas de mesa'], familyNotes:['Primeras variedades y programas tempranos.','Selección de mandarinas para programas profesionales.','Variedades de mesa para distintos periodos de campaña.'], technical:'Especificación técnica', origin:'Origen', species:'Especie', condition:'Condición', calibre:'Calibre', quality:'Calidad', format:'Formato', packaging:'Envase', campaign:'Campaña', availability:'Disponibilidad', status:'Estado', active:'Referencia activa', reference:'Referencia', request:'Solicitar referencia', select:'Seleccionar variedad', fresh:'Fresco', campaignHint:'Ventana orientativa · sujeta a campaña y programa', other:'Selección adicional', otherIntro:'Otras referencias disponibles dentro del programa de frutas.' },
    en: { catalogue:'CITRUS', title:'From tree', subtitle:'to market.', intro:'A professional selection built around variety, origin, calibre and commercial window.', families:['Clementines','Mandarins','Table oranges'], familyNotes:['Early varieties and early-season programmes.','Mandarin selection for professional programmes.','Table varieties covering different campaign windows.'], technical:'Technical specification', origin:'Origin', species:'Species', condition:'Condition', calibre:'Calibre', quality:'Quality', format:'Format', packaging:'Packaging', campaign:'Campaign', availability:'Availability', status:'Status', active:'Active reference', reference:'Reference', request:'Request reference', select:'Select variety', fresh:'Fresh', campaignHint:'Indicative window · subject to season and supply programme', other:'Additional selection', otherIntro:'Other references available within the fruit programme.' },
    fr: { catalogue:'AGRUMES', title:'De l’arbre', subtitle:'au marché.', intro:'Une sélection professionnelle structurée autour de la variété, de l’origine, du calibre et de la fenêtre commerciale.', families:['Clémentines','Mandarines','Oranges de table'], familyNotes:['Variétés précoces et programmes de début de campagne.','Sélection de mandarines pour programmes professionnels.','Variétés de table couvrant différentes périodes de campagne.'], technical:'Spécification technique', origin:'Origine', species:'Espèce', condition:'Condition', calibre:'Calibre', quality:'Qualité', format:'Format', packaging:'Conditionnement', campaign:'Campagne', availability:'Disponibilité', status:'Statut', active:'Référence active', reference:'Référence', request:'Demander la référence', select:'Sélectionner la variété', fresh:'Frais', campaignHint:'Fenêtre indicative · selon campagne et programme', other:'Sélection complémentaire', otherIntro:'Autres références disponibles dans le programme fruits.' },
    it: { catalogue:'AGRUMI', title:'Dall’albero', subtitle:'al mercato.', intro:'Una selezione professionale costruita intorno a varietà, origine, calibro e finestra commerciale.', families:['Clementine','Mandarini','Arance da tavola'], familyNotes:['Varietà precoci e programmi di inizio campagna.','Selezione di mandarini per programmi professionali.','Varietà da tavola per differenti periodi di campagna.'], technical:'Specifiche tecniche', origin:'Origine', species:'Specie', condition:'Condizione', calibre:'Calibro', quality:'Qualità', format:'Formato', packaging:'Imballaggio', campaign:'Campagna', availability:'Disponibilità', status:'Stato', active:'Referenza attiva', reference:'Referenza', request:'Richiedi referenza', select:'Seleziona varietà', fresh:'Fresco', campaignHint:'Finestra indicativa · secondo campagna e programma', other:'Selezione aggiuntiva', otherIntro:'Altre referenze disponibili nel programma frutta.' },
    ar: { catalogue:'الحمضيات', title:'من الشجرة', subtitle:'إلى السوق.', intro:'مجموعة مهنية مبنية على الصنف والمنشأ والحجم والنافذة التجارية.', families:['كلمنتين','يوسفي','برتقال مائدة'], familyNotes:['أصناف مبكرة وبرامج بداية الموسم.','مجموعة من أصناف اليوسفي للبرامج المهنية.','أصناف مائدة تغطي فترات مختلفة من الموسم.'], technical:'المواصفات الفنية', origin:'المنشأ', species:'النوع', condition:'الحالة', calibre:'الحجم', quality:'الجودة', format:'التنسيق', packaging:'التعبئة', campaign:'الموسم', availability:'التوفر', status:'الحالة', active:'مرجع نشط', reference:'المرجع', request:'طلب المرجع', select:'اختر الصنف', fresh:'طازج', campaignHint:'فترة إرشادية · حسب الموسم وبرنامج التوريد', other:'اختيارات إضافية', otherIntro:'مراجع أخرى متاحة ضمن برنامج الفواكه.' }
  };
  const t = labels[lang] || labels.es;
  const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const first = (value) => Array.isArray(value) ? (value.find(Boolean) || '') : (value || '');
  const unique = (values) => [...new Set((values || []).filter(Boolean))];
  const familyIds = ['clementina','mandarina','orange'];

  function ensureStyles() {
    if (document.getElementById('etCitrusCatalogCss')) return;
    const link = document.createElement('link');
    link.id = 'etCitrusCatalogCss';
    link.rel = 'stylesheet';
    link.href = '/assets/css/citrus-catalog.css?v=20260904.2';
    document.head.appendChild(link);
  }

  function getFamilyData(products) {
    return familyIds.map((id, index) => {
      const product = products.find((item) => item.id === id);
      return product ? {...product, familyIndex:index} : null;
    }).filter(Boolean);
  }

  function botanicalSvg(activeId) {
    const highlight = activeId === 'mandarina' ? 'mandarina' : activeId === 'orange' ? 'orange' : 'clementina';
    return `<svg viewBox="0 0 620 620" role="img" aria-label="Citrus botanical illustration" preserveAspectRatio="xMidYMid meet">
      <circle cx="310" cy="310" r="230" fill="none" stroke="rgba(165,122,53,.10)" stroke-width="1"/>
      <circle cx="310" cy="310" r="170" fill="none" stroke="rgba(20,43,58,.06)" stroke-width="1" stroke-dasharray="2 8"/>
      <path class="citrus-stem" d="M312 560 C309 485 314 416 306 350 C300 296 288 250 307 190 C321 147 321 112 310 70"/>
      <path class="citrus-twig" d="M307 348 C256 315 211 286 146 277 C117 273 91 260 66 236"/>
      <path class="citrus-twig" d="M306 349 C361 318 414 286 474 279 C514 274 543 259 568 230"/>
      <path class="citrus-twig" d="M310 233 C260 214 226 184 195 146 C180 128 164 117 143 111"/>
      <path class="citrus-twig" d="M315 222 C366 205 406 176 438 141 C454 123 469 114 490 109"/>
      <path class="citrus-leaf" d="M158 275 C141 251 115 245 92 252 C109 274 134 282 158 275Z"/>
      <path class="citrus-leaf" d="M464 278 C482 254 508 248 531 256 C514 277 489 285 464 278Z"/>
      <path class="citrus-leaf" d="M195 147 C179 127 157 118 137 123 C150 145 173 156 195 147Z"/>
      <path class="citrus-leaf" d="M438 141 C456 122 479 114 497 120 C482 142 461 151 438 141Z"/>
      <g opacity=".82">
        <circle cx="142" cy="271" r="12" fill="none" stroke="#bd924d" stroke-width="1.2"/>
        <circle cx="478" cy="273" r="12" fill="none" stroke="#bd924d" stroke-width="1.2"/>
        <circle cx="205" cy="148" r="10" fill="none" stroke="#bd924d" stroke-width="1.2"/>
        <circle cx="433" cy="145" r="10" fill="none" stroke="#bd924d" stroke-width="1.2"/>
      </g>
      <g class="citrus-orchard-mark citrus-orchard-mark--${highlight}"><circle cx="310" cy="99" r="17" fill="none" stroke="#bd924d" stroke-width="1.35"/><circle cx="310" cy="99" r="29" fill="rgba(189,146,77,.06)" stroke="rgba(189,146,77,.18)" stroke-width="1"/></g>
      <text x="310" y="597" text-anchor="middle" fill="rgba(20,43,58,.38)" font-family="DM Sans,Arial,sans-serif" font-size="9" letter-spacing="3">FROM ORIGIN · TO MARKET</text>
    </svg>`;
  }

  function familyTabs(families, activeIndex) {
    return `<div class="citrus-family-switcher" role="tablist" aria-label="${esc(t.select)}">${families.map((product,index) => `
      <button class="citrus-family-tab${index===activeIndex?' is-active':''}" type="button" role="tab" aria-selected="${index===activeIndex}" data-family-index="${index}">
        <span class="num">0${index+1}</span><strong>${esc(t.families[index])}</strong><small>${esc(t.familyNotes[index])}</small>
      </button>`).join('')}</div>`;
  }

  function varietyList(product, activeVariety) {
    return `<div class="citrus-selection" role="list" aria-label="${esc(t.families[product.familyIndex])}">${(product.varieties||[]).map((variety) => `
      <button class="citrus-selection-chip${variety===activeVariety?' is-active':''}" type="button" role="listitem" data-citrus-variety="${esc(variety)}" data-citrus-product="${esc(product.id)}" aria-pressed="${variety===activeVariety}">${esc(variety)}</button>`).join('')}</div>`;
  }

  function specs(product) {
    const fields = [
      [t.origin, first(product.origin) || '—'],
      [t.species, first(product.scientificName) || '—'],
      [t.condition, first(product.condition) === 'fresh' ? t.fresh : (first(product.condition) || '—')],
      [t.calibre, first(product.calibre) || 'Según especificación del comprador'],
      [t.quality, first(product.quality) || 'Especificación profesional'],
      [t.format, first(product.format) || 'Según destino'],
      [t.packaging, first(product.packaging) || 'Según mercado'],
      [t.status, t.active]
    ];
    return `<div class="citrus-technical">${fields.map(([label,value]) => `<div class="citrus-tech-item"><label>${esc(label)}</label><span>${esc(value)}</span></div>`).join('')}</div>`;
  }

  function campaign(product) {
    const raw = first(product.availability) || first(product.campaign) || t.campaignHint;
    return `<div class="citrus-campaign"><div class="citrus-campaign-head"><span>${esc(t.campaign)}</span><strong>${esc(raw)}</strong></div><div class="citrus-timeline">${['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'].map((month,index) => `<span class="citrus-month${index < 8 ? ' is-active':''}" title="${month}">${month}</span>`).join('')}</div><p class="citrus-campaign-note">${esc(t.campaignHint)}</p></div>`;
  }

  function detail(product, variety) {
    const requestHref = `/contact/?product=${encodeURIComponent(product.id)}&variety=${encodeURIComponent(variety)}`;
    return `<section class="citrus-detail" aria-live="polite">
      <div class="citrus-detail-head"><div><span class="citrus-detail-index">${esc(t.technical)}</span><h3>${esc(variety)}<br><em>${esc(product.commercialName)}</em></h3><p class="citrus-detail-scientific"><em>${esc(first(product.scientificName))}</em></p></div><span class="citrus-status">${esc(t.active)}</span></div>
      <p class="citrus-detail-copy">${esc(t.intro)}</p>
      ${specs(product)}
      ${campaign(product)}
      <div class="citrus-actions"><a href="${requestHref}">${esc(t.request)} ↗</a><span class="note">${esc(t.reference)} · ${esc(product.id)} · ${esc(variety)}</span></div>
    </section>`;
  }

  function otherCards(products) {
    const others = products.filter((product) => product.subcategory !== 'citrus' && product.status === 'active');
    if (!others.length) return '';
    return `<section class="fruit-other"><div class="fruit-other-head"><div><span>${esc(t.other)}</span><h3>${esc(t.otherIntro)}</h3></div></div><div class="fruit-other-grid">${others.map((product,index) => `<article class="fruit-other-card"><span class="index">${String(index+1).padStart(2,'0')}</span><h4>${esc(product.commercialName)}</h4><p>${esc(unique(product.varieties).join(' · ') || first(product.origin) || '')}</p></article>`).join('')}</div></section>`;
  }

  function render(target, products, activeIndex = 0, activeVariety) {
    const families = getFamilyData(products);
    const product = families[activeIndex] || families[0];
    if (!product) return;
    const variety = activeVariety || product.varieties?.[0] || product.commercialName;
    target.innerHTML = `<div class="fruit-special-shell">
      <header class="fruit-special-head"><div><span class="fruit-special-kicker">${esc(t.catalogue)}</span><h2>${esc(t.title)}<br><em>${esc(t.subtitle)}</em></h2></div><p class="fruit-special-intro">${esc(t.intro)}</p></header>
      ${familyTabs(families, product.familyIndex)}
      <div class="citrus-orchard">
        <div class="citrus-botanical" data-botanical><span class="citrus-sign">${String(product.familyIndex+1).padStart(2,'0')} / ${esc(t.families[product.familyIndex])}</span>${botanicalSvg(product.id)}${varietyList(product,variety)}</div>
        ${detail(product,variety)}
      </div>
      ${otherCards(products)}
    </div>`;
    const botanical = target.querySelector('[data-botanical]');
    requestAnimationFrame(() => botanical?.classList.add('is-visible'));
    bind(target, products);
  }

  function bind(root, products) {
    root.querySelectorAll('[data-family-index]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.familyIndex || 0);
        render(root, products, index);
      });
    });
    root.querySelectorAll('[data-citrus-variety]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = products.find((item) => item.id === button.dataset.citrusProduct);
        if (!product) return;
        const wrap = button.closest('.citrus-orchard');
        const detailNode = wrap?.querySelector('.citrus-detail');
        if (!detailNode) return;
        const shell = root.querySelector('.fruit-special-shell');
        const variety = button.dataset.citrusVariety || product.varieties?.[0] || product.commercialName;
        root.querySelectorAll('.citrus-selection-chip').forEach((item) => item.classList.toggle('is-active', item === button));
        root.querySelectorAll('.citrus-selection-chip').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        detailNode.outerHTML = detail(product, variety);
        shell?.querySelector('.citrus-detail')?.scrollIntoView({behavior:'smooth', block:'nearest'});
      });
    });
  }

  async function init() {
    const target = document.getElementById('fruitCatalog');
    if (!target) return;
    ensureStyles();
    try {
      const response = await fetch(DATA_URL, {cache:'no-cache'});
      if (!response.ok) throw new Error(`Fruit catalog request failed: ${response.status}`);
      const data = await response.json();
      const products = Array.isArray(data.products) ? data.products.filter((product) => product.status === 'active') : [];
      if (!products.length) throw new Error('Fruit catalog is empty');
      window.__ET_CATALOG_PRODUCTS = products;
      render(target, products, 0);
      document.documentElement.dataset.fruitCatalogReady = 'true';
    } catch (error) {
      console.error('[EMPERIO TISS] Fruit catalog failed:', error);
      document.documentElement.dataset.fruitCatalogReady = 'false';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
