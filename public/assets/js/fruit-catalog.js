/* Citrus catalogue — photographic editorial interaction. */
(() => {
  'use strict';

  const DATA_URL = '/assets/data/fruit-catalog-v1.json';
  const TREE_IMAGE = 'https://images.unsplash.com/photo-1647249240005-4bb82d61b000?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=2400';

  const I18N = {
    es: { catalogue:'Catálogo de cítricos', title:'Del árbol al', subtitle:'mercado', intro:'Selección profesional de cítricos por origen, variedad y especificación. Una lectura clara de cada referencia.', families:['Clementinas','Mandarinas','Naranjas'], familyCopy:['Cítricos tempranos y de mesa.','Mandarinas seleccionadas para mercado profesional.','Variedades de mesa y larga ventana comercial.'], technical:'Especificación', active:'Disponible', origin:'Origen', species:'Especie', condition:'Condición', fresh:'Fresco', calibre:'Calibre', quality:'Calidad', format:'Formato', packaging:'Embalaje', campaign:'Campaña', campaignHint:'Ventana orientativa · confirmar según origen y semana', request:'Solicitar referencia', reference:'Ref.', other:'Otras referencias', otherIntro:'Más productos de la categoría', hover:'Pasar por una familia', treeLabel:'Árbol de cítricos', clementinaDesc:'Selección de variedades de mesa con perfiles comerciales diferenciados.', mandarinaDesc:'Variedades de mandarina orientadas a regularidad, sabor y mercado europeo.', orangeDesc:'Naranjas de mesa seleccionadas por condición, calibre y destino.' },
    en: { catalogue:'Citrus catalogue', title:'From tree to', subtitle:'market', intro:'Professional citrus selection by origin, variety and specification. A clear view of each reference.', families:['Clementines','Mandarins','Oranges'], familyCopy:['Early and table citrus.','Selected mandarins for professional markets.','Table varieties with broad commercial windows.'], technical:'Specification', active:'Available', origin:'Origin', species:'Species', condition:'Condition', fresh:'Fresh', calibre:'Calibre', quality:'Quality', format:'Format', packaging:'Packaging', campaign:'Campaign', campaignHint:'Indicative window · confirm by origin and week', request:'Request reference', reference:'Ref.', other:'Other references', otherIntro:'More category products', hover:'Explore a family', treeLabel:'Citrus tree', clementinaDesc:'Table varieties with differentiated commercial profiles.', mandarinaDesc:'Mandarin varieties focused on consistency, flavour and European markets.', orangeDesc:'Table oranges selected by condition, calibre and destination.' },
    fr: { catalogue:'Catalogue agrumes', title:'De l’arbre au', subtitle:'marché', intro:'Sélection professionnelle d’agrumes par origine, variété et spécification. Une lecture claire de chaque référence.', families:['Clémentines','Mandarines','Oranges'], familyCopy:['Agrumes précoces et de table.','Mandarines sélectionnées pour le marché professionnel.','Variétés de table à large fenêtre commerciale.'], technical:'Spécification', active:'Disponible', origin:'Origine', species:'Espèce', condition:'Condition', fresh:'Frais', calibre:'Calibre', quality:'Qualité', format:'Format', packaging:'Emballage', campaign:'Campagne', campaignHint:'Fenêtre indicative · confirmer selon origine et semaine', request:'Demander la référence', reference:'Réf.', other:'Autres références', otherIntro:'Plus de produits de la catégorie', hover:'Explorer une famille', treeLabel:'Agrumeier', clementinaDesc:'Variétés de table aux profils commerciaux différenciés.', mandarinaDesc:'Mandarines sélectionnées pour la régularité, le goût et le marché européen.', orangeDesc:'Oranges de table sélectionnées selon la condition, le calibre et la destination.' },
    it: { catalogue:'Catalogo agrumi', title:'Dall’albero al', subtitle:'mercato', intro:'Selezione professionale di agrumi per origine, varietà e specifica. Una lettura chiara di ogni referenza.', families:['Clementine','Mandarini','Arance'], familyCopy:['Agrumi precoci e da tavola.','Mandarini selezionati per il mercato professionale.','Varietà da tavola con ampia finestra commerciale.'], technical:'Specifiche', active:'Disponibile', origin:'Origine', species:'Specie', condition:'Condizione', fresh:'Fresco', calibre:'Calibro', quality:'Qualità', format:'Formato', packaging:'Imballaggio', campaign:'Campagna', campaignHint:'Finestra indicativa · confermare per origine e settimana', request:'Richiedi referenza', reference:'Rif.', other:'Altre referenze', otherIntro:'Altri prodotti della categoria', hover:'Esplora una famiglia', treeLabel:'Albero di agrumi', clementinaDesc:'Varietà da tavola con profili commerciali differenziati.', mandarinaDesc:'Mandarini orientati a costanza, gusto e mercato europeo.', orangeDesc:'Arance da tavola selezionate per condizione, calibro e destinazione.' },
    ar: { catalogue:'دليل الحمضيات', title:'من الشجرة إلى', subtitle:'السوق', intro:'اختيار احترافي للحمضيات حسب المنشأ والصنف والمواصفات. قراءة واضحة لكل مرجع.', families:['كلمنتينا','يوسفي','برتقال'], familyCopy:['حمضيات مبكرة ومائدة.','أصناف يوسفي مختارة للسوق الاحترافي.','أصناف مائدة بنافذة تسويقية واسعة.'], technical:'المواصفات', active:'متاح', origin:'المنشأ', species:'النوع', condition:'الحالة', fresh:'طازج', calibre:'المقاس', quality:'الجودة', format:'التنسيق', packaging:'التغليف', campaign:'الموسم', campaignHint:'نافذة إرشادية · التأكيد حسب المنشأ والأسبوع', request:'طلب المرجع', reference:'مرجع', other:'مراجع أخرى', otherIntro:'منتجات أخرى من الفئة', hover:'استكشف العائلة', treeLabel:'شجرة الحمضيات', clementinaDesc:'أصناف مائدة بملفات تجارية مختلفة.', mandarinaDesc:'أصناف يوسفي تركز على الانتظام والطعم والسوق الأوروبي.', orangeDesc:'برتقال مائدة مختار حسب الحالة والمقاس والوجهة.' }
  };

  let lang = document.documentElement.lang?.toLowerCase().slice(0,2) || 'es';
  let t = I18N[lang] || I18N.es;

  function esc(value='') { return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
  function first(value) { return Array.isArray(value) ? value[0] : value; }
  function unique(values) { return [...new Set((values || []).filter(Boolean))]; }

  function ensureStyles() {
    if (document.querySelector('link[data-citrus-catalog]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/citrus-catalog.css?v=20260904.5';
    link.dataset.citrusCatalog = '1';
    document.head.appendChild(link);
  }

  function getFamilies(products) {
    const ids = ['clementina','mandarina','orange'];
    return ids.map((id, familyIndex) => {
      const product = products.find((item) => item.id === id);
      return product ? {...product, familyIndex} : null;
    }).filter(Boolean);
  }

  function familyTabs(families, activeIndex) {
    return `<nav class="citrus-family-switcher" aria-label="${esc(t.catalogue)}">${families.map((product, index) => `<button class="citrus-family-tab${index === activeIndex ? ' is-active' : ''}" type="button" data-family-index="${index}"><span class="num">0${index+1}</span><strong>${esc(t.families[index] || product.commercialName)}</strong><small>${esc(t.familyCopy[index] || '')}</small></button>`).join('')}</nav>`;
  }

  function varietyList(product, variety) {
    return `<div class="citrus-selection" aria-label="${esc(t.catalogue)}">${unique(product.varieties).map((item) => `<button class="citrus-selection-chip${item === variety ? ' is-active' : ''}" type="button" data-citrus-variety="${esc(item)}" data-citrus-product="${esc(product.id)}" aria-pressed="${item === variety ? 'true' : 'false'}">${esc(item)}</button>`).join('')}</div>`;
  }

  function familyCopy(index) {
    return [t.clementinaDesc,t.mandarinaDesc,t.orangeDesc][index] || '';
  }

  function productHotspot(product, index) {
    return `<button class="citrus-hotspot citrus-hotspot--${index===0?'top':index===1?'left':'right'}" type="button" data-tree-product="${esc(product.id)}" aria-label="${esc(t.families[index] || product.commercialName)}">
      <span class="citrus-hotspot-pulse" aria-hidden="true"></span><span class="citrus-hotspot-core" aria-hidden="true"></span><span class="citrus-hotspot-label">${esc(t.families[index] || product.commercialName)}</span>
      <span class="citrus-product-popover" role="status"><small class="citrus-popover-kicker">${String(index+1).padStart(2,'0')} · ${esc(t.families[index] || product.commercialName)}</small><strong>${esc(product.commercialName)}</strong><span class="citrus-popover-copy">${esc(familyCopy(index))}</span></span>
    </button>`;
  }

  function treeScene(families) {
    return `<div class="citrus-tree-scene" data-tree-scene tabindex="-1" aria-label="${esc(t.treeLabel)}">
      <div class="citrus-tree-photo" aria-hidden="true"><img src="${TREE_IMAGE}" alt="" loading="eager" decoding="async" fetchpriority="high"></div>
      <div class="citrus-tree-vignette" aria-hidden="true"></div><div class="citrus-tree-ambient" aria-hidden="true"></div>
      <div class="citrus-tree-title"><span>01 / CITRUS ORCHARD</span><strong>${esc(t.catalogue)}</strong></div><div class="citrus-tree-hint">HOVER / CLICK</div>
      ${families.map(productHotspot).join('')}
      <div class="citrus-tree-focus" aria-hidden="true"></div><div class="citrus-tree-footer"><span>FROM ORIGIN · TO MARKET</span><span>01 — 03</span></div>
    </div>`;
  }

  function specs(product) {
    const fields = [[t.origin,first(product.origin)||'—'],[t.species,first(product.scientificName)||'—'],[t.condition,first(product.condition)==='fresh'?t.fresh:(first(product.condition)||'—')],[t.calibre,first(product.calibre)||'Según especificación del comprador'],[t.quality,first(product.quality)||'Especificación profesional'],[t.format,first(product.format)||'Según destino'],[t.packaging,first(product.packaging)||'Según mercado'],[t.active,t.active]];
    return `<div class="citrus-technical">${fields.map(([label,value])=>`<div class="citrus-tech-item"><label>${esc(label)}</label><span>${esc(value)}</span></div>`).join('')}</div>`;
  }

  function campaign(product) {
    const raw = first(product.availability) || first(product.campaign) || t.campaignHint;
    return `<div class="citrus-campaign"><div class="citrus-campaign-head"><span>${esc(t.campaign)}</span><strong>${esc(raw)}</strong></div><div class="citrus-timeline">${['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'].map((month,index)=>`<span class="citrus-month${index<8?' is-active':''}" title="${month}">${month}</span>`).join('')}</div><p class="citrus-campaign-note">${esc(t.campaignHint)}</p></div>`;
  }

  function detail(product, variety) {
    const requestHref = `/contact/?product=${encodeURIComponent(product.id)}&variety=${encodeURIComponent(variety)}`;
    return `<section class="citrus-detail" aria-live="polite"><div class="citrus-detail-head"><div><span class="citrus-detail-index">${esc(t.technical)}</span><h3>${esc(variety)}<br><em>${esc(product.commercialName)}</em></h3><p class="citrus-detail-scientific"><em>${esc(first(product.scientificName))}</em></p></div><span class="citrus-status">${esc(t.active)}</span></div><p class="citrus-detail-copy">${esc(t.intro)}</p>${specs(product)}${campaign(product)}<div class="citrus-actions"><a href="${requestHref}">${esc(t.request)} ↗</a><span class="note">${esc(t.reference)} · ${esc(product.id)} · ${esc(variety)}</span></div></section>`;
  }

  function otherCards(products) {
    const others = products.filter((product)=>product.subcategory!=='citrus' && product.status==='active');
    if (!others.length) return '';
    return `<section class="fruit-other"><div class="fruit-other-head"><div><span>${esc(t.other)}</span><h3>${esc(t.otherIntro)}</h3></div></div><div class="fruit-other-grid">${others.map((product,index)=>`<article class="fruit-other-card"><span class="index">${String(index+1).padStart(2,'0')}</span><h4>${esc(product.commercialName)}</h4><p>${esc(unique(product.varieties).join(' · ') || first(product.origin) || '')}</p></article>`).join('')}</div></section>`;
  }

  function setFocus(target, activeHotspot) {
    const scene = target.querySelector('[data-tree-scene]');
    target.querySelectorAll('.citrus-hotspot').forEach((hotspot)=>hotspot.classList.toggle('is-active',hotspot===activeHotspot));
    scene?.classList.toggle('is-focused',Boolean(activeHotspot));
  }

  function render(target, products, activeIndex=0, activeVariety) {
    const families = getFamilies(products); const product = families[activeIndex] || families[0]; if (!product) return;
    const variety = activeVariety || product.varieties?.[0] || product.commercialName;
    target.innerHTML = `<div class="fruit-special-shell"><header class="fruit-special-head"><div><span class="fruit-special-kicker">${esc(t.catalogue)}</span><h2>${esc(t.title)}<br><em>${esc(t.subtitle)}</em></h2></div><p class="fruit-special-intro">${esc(t.intro)}</p></header><div class="citrus-orchard"><div class="citrus-botanical" data-botanical>${treeScene(families)}${varietyList(product,variety)}</div><div class="citrus-below-image">${familyTabs(families,product.familyIndex)}${detail(product,variety)}</div></div>${otherCards(products)}</div>`;
    const botanical = target.querySelector('[data-botanical]'); requestAnimationFrame(()=>botanical?.classList.add('is-visible')); bind(target,products);
  }

  function bind(root,products) {
    root.querySelectorAll('[data-family-index]').forEach((button)=>button.addEventListener('click',()=>render(root,products,Number(button.dataset.familyIndex||0))));
    root.querySelectorAll('[data-citrus-variety]').forEach((button)=>button.addEventListener('click',()=>{const product=products.find((item)=>item.id===button.dataset.citrusProduct);if(!product)return;const variety=button.dataset.citrusVariety||product.varieties?.[0]||product.commercialName;root.querySelectorAll('.citrus-selection-chip').forEach((item)=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});const detailNode=root.querySelector('.citrus-detail');if(detailNode)detailNode.outerHTML=detail(product,variety);}));
    root.querySelectorAll('[data-tree-product]').forEach((hotspot)=>{const open=()=>setFocus(root,hotspot),close=()=>{if(!hotspot.classList.contains('is-pinned'))setFocus(root,null)};hotspot.addEventListener('mouseenter',open);hotspot.addEventListener('focus',open);hotspot.addEventListener('mouseleave',close);hotspot.addEventListener('blur',close);hotspot.addEventListener('click',(event)=>{event.stopPropagation();const pinned=hotspot.classList.toggle('is-pinned');setFocus(root,pinned?hotspot:null)});hotspot.addEventListener('keydown',(event)=>{if(event.key==='Escape'){hotspot.classList.remove('is-pinned');setFocus(root,null);hotspot.blur();}});});
    root.querySelector('[data-tree-scene]')?.addEventListener('click',(event)=>{if(!event.target.closest('.citrus-hotspot')){root.querySelectorAll('.citrus-hotspot').forEach((hotspot)=>hotspot.classList.remove('is-pinned'));setFocus(root,null);}});
  }

  async function init(){const target=document.getElementById('fruitCatalog');if(!target)return;ensureStyles();try{const response=await fetch(DATA_URL,{cache:'no-cache'});if(!response.ok)throw new Error(`Fruit catalog request failed: ${response.status}`);const data=await response.json();const products=Array.isArray(data.products)?data.products.filter((product)=>product.status==='active'):[];if(!products.length)throw new Error('Fruit catalog is empty');window.__ET_CATALOG_PRODUCTS=products;render(target,products,0);}catch(error){console.error('[fruit-catalog]',error);target.innerHTML='<p class="catalog-error">Catalogue unavailable.</p>';}}

  window.ETFruitCatalog = { init };
  document.addEventListener('DOMContentLoaded',init,{once:true});
})();
