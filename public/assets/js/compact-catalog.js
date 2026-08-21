(() => {
  'use strict';
  const body = document.body;
  const family = body?.dataset.catalogFamily || '';
  const subcategory = body?.dataset.catalogSubcategory || '';
  const title = body?.dataset.catalogTitle || 'Catalogue';
  const grid = document.getElementById('compactCatalogGrid');
  const search = document.getElementById('compactCatalogSearch');
  const count = document.getElementById('compactCatalogCount');
  const filters = [...document.querySelectorAll('[data-compact-filter]')];
  if (!family || !grid || !search || !count) return;

  const lang = (document.documentElement.lang || 'en').slice(0,2).toLowerCase();
  const labels = {
    es:{fresh:'Fresco',frozen:'Congelado',detail:'Ver ficha',empty:'No hay referencias activas.',all:'Todas'},
    en:{fresh:'Fresh',frozen:'Frozen',detail:'View specification',empty:'No active references.',all:'All'},
    fr:{fresh:'Frais',frozen:'Surgelé',detail:'Voir la fiche',empty:'Aucune référence active.',all:'Toutes'},
    ar:{fresh:'طازج',frozen:'مجمد',detail:'عرض المواصفات',empty:'لا توجد مراجع نشطة',all:'الكل'}
  }[lang] || null;
  const t = labels || labels.en;
  const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const first=(v)=>Array.isArray(v)?(v.find(Boolean)||''):(v||'');
  const cond=(v)=>v==='fresh'?t.fresh:v==='frozen'?t.frozen:v;
  let products=[]; let activeFilter='all';

  function matches(product){
    const filterOk=activeFilter==='all'||(product.condition||[]).includes(activeFilter);
    const q=search.value.trim().toLowerCase();
    const hay=[product.commercialName,product.scientificName,first(product.origin),first(product.variety),first(product.campaign)].join(' ').toLowerCase();
    return filterOk&&(!q||hay.includes(q));
  }
  function card(product){
    const meta=[(product.condition||[]).map(cond).join(' · '),first(product.origin),first(product.calibre)||first(product.quality)].filter(Boolean).join(' · ');
    const href=`/products/product.html?id=${encodeURIComponent(product.id)}`;
    return `<article class="compact-catalog-card" data-product-id="${esc(product.id)}"><div class="compact-catalog-card__media">${product.image?`<img src="${esc(product.image)}" alt="${esc(product.commercialName)}" loading="lazy">`:'<span class="compact-catalog-card__placeholder">EMPERIO TISS</span>'}</div><div class="compact-catalog-card__body"><p class="compact-catalog-card__meta">${esc(product.subcategory||product.category||title)}</p><h3 class="compact-catalog-card__title">${esc(product.commercialName)}</h3><p class="compact-catalog-card__scientific"><em>${esc(product.scientificName)}</em></p>${meta?`<p class="compact-catalog-card__spec">${esc(meta)}</p>`:''}<a class="compact-catalog-card__link" href="${href}">${esc(t.detail)} ↗</a></div></article>`;
  }
  function render(){
    const visible=products.filter(matches);
    count.textContent=`${visible.length} ${visible.length===1?'reference':'references'}`;
    grid.innerHTML=visible.length?visible.map(card).join(''):`<p class="compact-catalog__empty">${esc(t.empty)}</p>`;
  }
  filters.forEach((button)=>button.addEventListener('click',()=>{
    activeFilter=button.dataset.compactFilter||'all';
    filters.forEach((item)=>item.setAttribute('aria-pressed',String(item===button)));
    render();
  }));
  search.addEventListener('input',render);
  fetch('/assets/data/catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(`Catalog request failed: ${r.status}`);return r.json();}).then(data=>{
    products=(data.products||[]).filter(p=>p.status==='active'&&p.family===family&&(!subcategory||p.subcategory===subcategory));
    render();
  }).catch(err=>{console.error('[EMPERIO TISS] Compact catalogue failed',err);grid.innerHTML=`<p class="compact-catalog__empty">${esc(t.empty)}</p>`;count.textContent='—';});
})();
