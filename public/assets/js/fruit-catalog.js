(() => {
  'use strict';

  const DATA_URL = '/assets/data/fruit-catalog-v1.json';
  const TREE_IMAGE = 'https://images.unsplash.com/photo-1647249240005-4bb82d61b000?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=2200';
  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const labels = {
    es: { catalogue:'CÍTRICOS', title:'Del árbol', subtitle:'al mercado.', intro:'Una selección profesional construida alrededor de variedad, origen, calibre y ventana comercial.', families:['Clementinas','Mandarinas','Naranjas de mesa'], familyNotes:['Primeras variedades y programas tempranos.','Selección de mandarinas para programas profesionales.','Variedades de mesa para distintos periodos de campaña.'], technical:'Especificación técnica', origin:'Origen', species:'Especie', condition:'Condición', calibre:'Calibre', quality:'Calidad', format:'Formato', packaging:'Envase', campaign:'Campaña', availability:'Disponibilidad', status:'Estado', active:'Referencia activa', reference:'Referencia', request:'Solicitar referencia', select:'Seleccionar variedad', fresh:'Fresco', campaignHint:'Ventana orientativa · sujeta a campaña y programa', other:'Selección adicional', otherIntro:'Otras referencias disponibles dentro del programa de frutas.', add:'Añadir al carrito', priceUnit:['/ pack','/ saco','/ caja 10 kg'], hotspot:['Copa','Rama izquierda','Rama derecha'], productCopy:['Packs Premium seleccionados para retail, horeca y consumo doméstico.','Sacos familiares de fruta fresca y aromática para consumo diario.','Cajas de 5 kg o 10 kg para zumo, mesa y programas de suministro.'] },
    en: { catalogue:'CITRUS', title:'From tree', subtitle:'to market.', intro:'A professional selection built around variety, origin, calibre and commercial window.', families:['Clementines','Mandarins','Table oranges'], familyNotes:['Early varieties and early-season programmes.','Mandarin selection for professional programmes.','Table varieties covering different campaign windows.'], technical:'Technical specification', origin:'Origin', species:'Species', condition:'Condition', calibre:'Calibre', quality:'Quality', format:'Format', packaging:'Packaging', campaign:'Campaign', availability:'Availability', status:'Status', active:'Active reference', reference:'Reference', request:'Request reference', select:'Select variety', fresh:'Fresh', campaignHint:'Indicative window · subject to season and supply programme', other:'Additional selection', otherIntro:'Other references available within the fruit programme.', add:'Add to cart', priceUnit:['/ pack','/ sack','/ 10 kg box'], hotspot:['Crown','Left branch','Right branch'], productCopy:['Premium packs selected for retail, horeca and home consumption.','Family sacks of fresh, aromatic fruit for everyday consumption.','5 kg or 10 kg boxes for juice, table and supply programmes.'] },
    fr: { catalogue:'AGRUMES', title:'De l’arbre', subtitle:'au marché.', intro:'Une sélection professionnelle structurée autour de la variété, de l’origine, du calibre et de la fenêtre commerciale.', families:['Clémentines','Mandarines','Oranges de table'], familyNotes:['Variétés précoces et programmes de début de campagne.','Sélection de mandarines pour programmes professionnels.','Variétés de table couvrant différentes périodes de campagne.'], technical:'Spécification technique', origin:'Origine', species:'Espèce', condition:'Condition', calibre:'Calibre', quality:'Qualité', format:'Format', packaging:'Conditionnement', campaign:'Campagne', availability:'Disponibilité', status:'Statut', active:'Référence active', reference:'Référence', request:'Demander la référence', select:'Sélectionner la variété', fresh:'Frais', campaignHint:'Fenêtre indicative · selon campagne et programme', other:'Sélection complémentaire', otherIntro:'Autres références disponibles dans le programme fruits.', add:'Ajouter au panier', priceUnit:['/ pack','/ sac','/ caisse 10 kg'], hotspot:['Cime','Branche gauche','Branche droite'], productCopy:['Packs Premium sélectionnés pour le retail, la restauration et la consommation domestique.','Sacs familiaux de fruits frais et aromatiques pour la consommation quotidienne.','Caisses de 5 kg ou 10 kg pour jus, table et programmes d’approvisionnement.'] },
    it: { catalogue:'AGRUMI', title:'Dall’albero', subtitle:'al mercato.', intro:'Una selezione professionale costruita intorno a varietà, origine, calibro e finestra commerciale.', families:['Clementine','Mandarini','Arance da tavola'], familyNotes:['Varietà precoci e programmi di inizio campagna.','Selezione di mandarini per programmi professionali.','Varietà da tavola per differenti periodi di campagna.'], technical:'Specifiche tecniche', origin:'Origine', species:'Specie', condition:'Condizione', calibre:'Calibro', quality:'Qualità', format:'Formato', packaging:'Imballaggio', campaign:'Campagna', availability:'Disponibilità', status:'Stato', active:'Referenza attiva', reference:'Referenza', request:'Richiedi referenza', select:'Seleziona varietà', fresh:'Fresco', campaignHint:'Finestra indicativa · secondo campagna e programma', other:'Selezione aggiuntiva', otherIntro:'Altre referenze disponibili nel programma frutta.', add:'Aggiungi al carrello', priceUnit:['/ pack','/ sacco','/ cassa 10 kg'], hotspot:['Chioma','Ramo sinistro','Ramo destro'], productCopy:['Packs Premium selezionati per retail, horeca e consumo domestico.','Sacchi famiglia di frutta fresca e aromatica per il consumo quotidiano.','Cassette da 5 kg o 10 kg per succo, tavola e programmi di fornitura.'] },
    ar: { catalogue:'الحمضيات', title:'من الشجرة', subtitle:'إلى السوق.', intro:'مجموعة مهنية مبنية على الصنف والمنشأ والحجم والنافذة التجارية.', families:['كلمنتين','يوسفي','برتقال مائدة'], familyNotes:['أصناف مبكرة وبرامج بداية الموسم.','مجموعة من أصناف اليوسفي للبرامج المهنية.','أصناف مائدة تغطي فترات مختلفة من الموسم.'], technical:'المواصفات الفنية', origin:'المنشأ', species:'النوع', condition:'الحالة', calibre:'الحجم', quality:'الجودة', format:'التنسيق', packaging:'التعبئة', campaign:'الموسم', availability:'التوفر', status:'الحالة', active:'مرجع نشط', reference:'المرجع', request:'طلب المرجع', select:'اختر الصنف', fresh:'طازج', campaignHint:'فترة إرشادية · حسب الموسم وبرنامج التوريد', other:'اختيارات إضافية', otherIntro:'مراجع أخرى متاحة ضمن برنامج الفواكه.', add:'أضف إلى السلة', priceUnit:['/ عبوة','/ كيس','/ صندوق 10 كغ'], hotspot:['التاج','الغصن الأيسر','الغصن الأيمن'], productCopy:['عبوات Premium مختارة للبيع بالتجزئة والضيافة والاستهلاك المنزلي.','أكياس عائلية من فاكهة طازجة وعطرية للاستهلاك اليومي.','صناديق 5 أو 10 كغ للعصير والمائدة وبرامج التوريد.'] }
  };
  const t = labels[lang] || labels.es;
  const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const first = (value) => Array.isArray(value) ? (value.find(Boolean) || '') : (value || '');
  const unique = (values) => [...new Set((values || []).filter(Boolean))];
  const familyIds = ['clementina','mandarina','orange'];
  const hotspotClasses = ['top','left','right'];
  const fictivePrices = [12.90, 9.90, 16.90];

  function ensureStyles() {
    if (document.getElementById('etCitrusCatalogCss')) return;
    const link = document.createElement('link');
    link.id = 'etCitrusCatalogCss';
    link.rel = 'stylesheet';
    link.href = '/assets/css/citrus-catalog.css?v=20260904.4';
    document.head.appendChild(link);
  }

  function getFamilyData(products) {
    return familyIds.map((id, index) => {
      const product = products.find((item) => item.id === id);
      return product ? {...product, familyIndex:index} : null;
    }).filter(Boolean);
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

  function productHotspot(product) {
    const i = product.familyIndex;
    const price = fictivePrices[i].toFixed(2).replace('.', ',') + ' €';
    return `<button class="citrus-hotspot citrus-hotspot--${hotspotClasses[i]}" type="button" data-tree-product="${esc(product.id)}" aria-label="${esc(t.families[i])}">
      <span class="citrus-hotspot-pulse" aria-hidden="true"></span>
      <span class="citrus-hotspot-core" aria-hidden="true"></span>
      <span class="citrus-hotspot-label">${esc(t.families[i])}</span>
      <span class="citrus-product-popover">
        <span class="citrus-popover-kicker">0${i+1} · ${esc(t.hotspot[i])}</span>
        <strong>${esc(t.families[i])}</strong>
        <span class="citrus-popover-copy">${esc(t.productCopy[i])}</span>
        <span class="citrus-popover-price"><b>${price}</b><small>${esc(t.priceUnit[i])}</small></span>
        <span class="citrus-cart-button" data-cart-product="${esc(product.commercialName || t.families[i])}">${esc(t.add)}</span>
      </span>
    </button>`;
  }

  function treeScene(families, activeIndex) {
    return `<div class="citrus-tree-scene" data-tree-scene tabindex="-1" aria-label="${esc(t.catalogue)}">
      <div class="citrus-tree-photo" aria-hidden="true"><img src="${TREE_IMAGE}" alt="" loading="eager" decoding="async" fetchpriority="high"></div>
      <div class="citrus-tree-vignette" aria-hidden="true"></div>
      <div class="citrus-tree-ambient" aria-hidden="true"></div>
      <div class="citrus-tree-title"><span>01 / CITRUS ORCHARD</span><strong>${esc(t.catalogue)}</strong></div>
      <div class="citrus-tree-hint">HOVER / CLICK</div>
      ${families.map((product) => productHotspot(product)).join('')}
      <div class="citrus-tree-focus" aria-hidden="true"></div>
      <div class="citrus-tree-footer"><span>FROM ORIGIN · TO MARKET</span><span>01 — 03</span></div>
    </div>`;
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

  function setActiveFamily(root, products, index, variety) {
    const families = getFamilyData(products);
    const product = families[index] || families[0];
    if (!product) return;
    const selected = variety || product.varieties?.[0] || product.commercialName;
    root.querySelectorAll('[data-family-index]').forEach((button) => {
      const active = Number(button.dataset.familyIndex) === product.familyIndex;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    root.querySelector('[data-detail-host]')?.replaceChildren(document.createRange().createContextualFragment(detail(product, selected)));
    root.querySelectorAll('.citrus-selection-chip').forEach((button) => {
      const active = button.dataset.citrusProduct === product.id && button.dataset.citrusVariety === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    root.querySelector('[data-tree-scene]')?.setAttribute('data-active-family', product.id);
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
        <div class="citrus-botanical" data-botanical>${treeScene(families, product.familyIndex)}${varietyList(product,variety)}</div>
        <div data-detail-host>${detail(product,variety)}</div>
      </div>
      ${otherCards(products)}
    </div>`;
    requestAnimationFrame(() => target.querySelector('[data-tree-scene]')?.classList.add('is-visible'));
    bind(target, products);
  }

  function bind(root, products) {
    root.querySelectorAll('[data-family-index]').forEach((button) => {
      button.addEventListener('click', () => {
        setActiveFamily(root, products, Number(button.dataset.familyIndex || 0));
      });
    });

    root.querySelectorAll('[data-citrus-variety]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = products.find((item) => item.id === button.dataset.citrusProduct);
        if (!product) return;
        setActiveFamily(root, products, productIds(products).indexOf(product.id), button.dataset.citrusVariety);
      });
    });

    root.querySelectorAll('[data-tree-product]').forEach((hotspot) => {
      const open = () => {
        root.querySelector('[data-tree-scene]')?.classList.add('is-focused');
        root.querySelectorAll('[data-tree-product]').forEach((item) => item.classList.toggle('is-active', item === hotspot));
        const product = products.find((item) => item.id === hotspot.dataset.treeProduct);
        if (product) setActiveFamily(root, products, productIds(products).indexOf(product.id));
      };
      hotspot.addEventListener('mouseenter', open);
      hotspot.addEventListener('focus', open);
      hotspot.addEventListener('click', (event) => {
        if (event.target.closest('.citrus-cart-button')) return;
        if (hotspot.classList.contains('is-active')) {
          hotspot.classList.remove('is-active');
          root.querySelector('[data-tree-scene]')?.classList.remove('is-focused');
        } else open();
      });
      hotspot.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          hotspot.blur();
          root.querySelector('[data-tree-scene]')?.classList.remove('is-focused');
          root.querySelectorAll('[data-tree-product]').forEach((item) => item.classList.remove('is-active'));
        }
      });
    });

    root.querySelector('[data-tree-scene]')?.addEventListener('mouseleave', (event) => {
      if (event.relatedTarget?.closest?.('.citrus-product-popover')) return;
      root.querySelector('[data-tree-scene]')?.classList.remove('is-focused');
      root.querySelectorAll('[data-tree-product]').forEach((item) => item.classList.remove('is-active'));
    });

    root.querySelectorAll('[data-cart-product]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const original = button.textContent;
        button.textContent = lang === 'es' ? 'Añadido ✓' : lang === 'fr' ? 'Ajouté ✓' : lang === 'it' ? 'Aggiunto ✓' : lang === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓';
        button.classList.add('is-added');
        window.dispatchEvent(new CustomEvent('et:cart:add', {detail:{product:button.dataset.cartProduct || ''}}));
        window.setTimeout(() => { button.textContent = original; button.classList.remove('is-added'); }, 1300);
      });
    });
  }

  function productIds(products) { return familyIds.filter((id) => products.some((product) => product.id === id)); }

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
