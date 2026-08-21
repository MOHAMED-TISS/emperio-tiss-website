(() => {
  'use strict';

  const CATALOG_URL = '/assets/data/catalog.json';
  const i18n = {
    es: {labels:{fish:'Pescados',shellfish:'Mariscos',cephalopods:'Cefalópodos',citrus:'Cítricos',exotics:'Frutas exóticas','core-produce':'Otras frutas',vegetables:'Hortalizas','seasonal-selection':'Temporada'},fresh:'Fresco',frozen:'Congelado',detail:'Ver ficha',empty:'No hay referencias activas en esta categoría.',catalogue:'CATÁLOGO',all:'Referencias seleccionadas.',seafood:'Productos del mar',seasonal:'Temporada'},
    en: {labels:{fish:'Fish',shellfish:'Shellfish',cephalopods:'Cephalopods',citrus:'Citrus',exotics:'Exotic fruit','core-produce':'Other fruit',vegetables:'Vegetables','seasonal-selection':'Seasonal'},fresh:'Fresh',frozen:'Frozen',detail:'View specification',empty:'No active references in this category.',catalogue:'CATALOGUE',all:'Selected references.',seafood:'Seafood',seasonal:'Seasonal'},
    fr: {labels:{fish:'Poissons',shellfish:'Fruits de mer',cephalopods:'Céphalopodes',citrus:'Agrumes',exotics:'Fruits exotiques','core-produce':'Autres fruits',vegetables:'Légumes','seasonal-selection':'Saisonnier'},fresh:'Frais',frozen:'Surgelé',detail:'Voir la fiche',empty:'Aucune référence active dans cette catégorie.',catalogue:'CATALOGUE',all:'Références sélectionnées.',seafood:'Produits de la mer',seasonal:'Saisonnier'},
    ar: {labels:{fish:'أسماك',shellfish:'مأكولات بحرية',cephalopods:'رأسيات الأرجل',citrus:'حمضيات',exotics:'فواكه استوائية','core-produce':'فواكه أخرى',vegetables:'خضروات','seasonal-selection':'موسمي'},fresh:'طازج',frozen:'مجمد',detail:'عرض المواصفات',empty:'لا توجد مراجع نشطة في هذه الفئة.',catalogue:'الكتالوج',all:'مراجع مختارة.',seafood:'منتجات البحر',seasonal:'موسمي'}
  };

  const lang = (document.documentElement.lang || 'es').slice(0,2).toLowerCase();
  const t = i18n[lang] || i18n.es;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const first = (value) => Array.isArray(value) ? value.find(Boolean) || '' : (value || '');
  const normalizeCondition = (values) => (values || []).map((value)=>value==='fresh'?t.fresh:value==='frozen'?t.frozen:value).join(' · ');

  function card(product){
    if(!product || product.status!=='active') return '';
    const category=t.labels[product.subcategory]||product.subcategory||product.family||'';
    const meta=[normalizeCondition(product.condition),first(product.origin),first(product.calibre)].filter(Boolean).join(' · ');
    const href=`/products/product.html?id=${encodeURIComponent(product.id)}`;
    return `<article class="product-card" data-product-id="${esc(product.id)}"><div class="product-card__media">${product.image?`<img src="${esc(product.image)}" alt="${esc(product.commercialName)}" loading="lazy">`:'<span class="product-card__placeholder">EMPERIO TISS</span>'}</div><div class="product-card__body"><p class="product-card__meta">${esc(category)}</p><h3 class="product-card__title">${esc(product.commercialName)}</h3><p class="product-card__description"><em>${esc(product.scientificName)}</em></p>${meta?`<p class="product-card__description">${esc(meta)}</p>`:''}<a class="product-card__link" href="${href}">${esc(t.detail)} <span aria-hidden="true">↗</span></a></div></article>`;
  }

  async function loadCatalog(){
    const response=await fetch(CATALOG_URL,{cache:'no-cache'});
    if(!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    const data=await response.json();
    if(!data||!Array.isArray(data.products)) throw new Error('Invalid catalog schema');
    return data;
  }

  function renderInto(element,products){if(!element)return;element.innerHTML=products.length?products.map(card).join(''):`<p class="catalog-empty">${esc(t.empty)}</p>`;}
  function renderRequestedCatalogs(data){
    const products=data.products.filter((product)=>product.status==='active');
    document.querySelectorAll('[data-catalog-family]').forEach((element)=>{
      const family=element.dataset.catalogFamily;
      const subcategories=(element.dataset.catalogSubcategories||'').split(',').map((value)=>value.trim()).filter(Boolean);
      renderInto(element,products.filter((product)=>product.family===family&&(!subcategories.length||subcategories.includes(product.subcategory))));
    });
  }

  function routeContext(){
    const parts=window.location.pathname.split('/').filter(Boolean);
    const productsIndex=parts.indexOf('products');
    return productsIndex>=0?parts.slice(productsIndex+1):[];
  }

  function autoCatalogTarget(){
    if(document.querySelector('[data-catalog-family]')) return null;
    const rest=routeContext();
    if(!rest.length)return null;
    let family=null,subcategories=[],title='',eyebrow=t.catalogue;
    if(rest[0]==='seafood'){
      family='seafood';
      if(rest[1]==='fish'){subcategories=['fish'];title=t.labels.fish;}
      else if(rest[1]==='shellfish'){subcategories=['shellfish'];title=t.labels.shellfish;}
      else if(rest[1]==='cephalopods'){subcategories=['cephalopods'];title=t.labels.cephalopods;}
      else title=t.seafood;
    }else if(rest[0]==='seasonal'){
      family='seasonal';subcategories=['seasonal-selection'];title=t.seasonal;
    }
    if(!family)return null;
    const main=document.querySelector('main');
    if(!main)return null;
    const section=document.createElement('section');
    section.className='catalog-section auto-catalog-section';
    section.innerHTML=`<div class="catalog-inner"><div class="catalog-head"><div><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}<br><em>${esc(t.all)}</em></h2></div><p>${esc(t.detail)}</p></div><div class="product-catalog-grid" data-catalog-family="${esc(family)}" data-catalog-subcategories="${esc(subcategories.join(','))}"></div></div>`;
    main.appendChild(section);
    return section.querySelector('[data-catalog-family]');
  }

  async function init(){
    const injected=autoCatalogTarget();
    const targets=document.querySelectorAll('[data-catalog-family]');
    if(!targets.length&&!injected)return;
    try{
      const data=await loadCatalog();
      renderRequestedCatalogs(data);
      document.documentElement.dataset.catalogReady='true';
    }catch(error){
      console.error('[EMPERIO TISS] Catalog load failed:',error);
      document.querySelectorAll('[data-catalog-family]').forEach((element)=>{element.innerHTML=`<p class="catalog-empty">${esc(t.empty)}</p>`;});
      document.documentElement.dataset.catalogReady='false';
    }
  }

  window.EMPERIO_TISS_CATALOG={loadCatalog,renderInto,card};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
