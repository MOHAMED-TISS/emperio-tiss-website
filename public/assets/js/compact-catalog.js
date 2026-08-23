(() => {
  'use strict';
  const body = document.body;
  const lang = (document.documentElement.lang || 'en').slice(0,2).toLowerCase();
  const family = body?.dataset.catalogFamily || '';
  const subcategories = (body?.dataset.catalogSubcategories || body?.dataset.catalogSubcategory || '').split(',').map(v => v.trim()).filter(Boolean);
  const grid = document.getElementById('compactCatalogGrid');
  const search = document.getElementById('compactCatalogSearch');
  const count = document.getElementById('compactCatalogCount');
  const filters = [...document.querySelectorAll('[data-compact-filter]')];
  if (!family || !grid || !search || !count) return;

  const i18n={es:{fresh:'Fresco',frozen:'Congelado',detail:'Ver ficha',empty:'No hay referencias activas.'},en:{fresh:'Fresh',frozen:'Frozen',detail:'View specification',empty:'No active references.'},fr:{fresh:'Frais',frozen:'Surgelé',detail:'Voir la fiche',empty:'Aucune référence active.'},ar:{fresh:'طازج',frozen:'مجمد',detail:'عرض المواصفات',empty:'لا توجد مراجع نشطة'}};
  const t=i18n[lang]||i18n.en;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const first=v=>Array.isArray(v)?(v.find(Boolean)||''):(v||'');
  const cond=v=>v==='fresh'?t.fresh:v==='frozen'?t.frozen:v;
  const frozenSeafoodFamily = family === 'seafood' && subcategories.some(s => s === 'shellfish' || s === 'cephalopods');
  const dedicatedSubcategory = subcategories.find(s => s === 'shellfish' || s === 'cephalopods') || '';
  const dedicatedDataUrl = lang === 'en' && frozenSeafoodFamily
    ? (dedicatedSubcategory === 'shellfish' ? '/assets/data/shellfish-catalog-es.json' : '/assets/data/cephalopods-catalog-es.json')
    : null;
  const enNames={moruno:'Mediterranean red shrimp',cigala:'Norway lobster','gamba-blanca':'Deep-water rose shrimp','langostino-tigre':'Tiger prawn','pulpo-flor':'Flower octopus','pulpo-bloque':'Block octopus','calamar-envuelto':'Wrapped squid','sepia-limpia-iqf':'Cleaned cuttlefish IQF'};
  const enTypes={moruno:'Mediterranean',cigala:'Mediterranean','gamba-blanca':'Mediterranean','langostino-tigre':'Prawn','pulpo-flor':'Octopus','pulpo-bloque':'Octopus','calamar-envuelto':'Squid','sepia-limpia-iqf':'Cuttlefish'};
  let products=[]; let activeFilter=frozenSeafoodFamily ? 'frozen' : 'all'; let imageMap={};
  const galleryStyles=`.catalog-gallery{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:32px;background:rgba(7,16,22,.94)}.catalog-gallery[hidden]{display:none}.catalog-gallery__panel{position:relative;width:min(92vw,1200px);height:min(88vh,850px);display:flex;align-items:center;justify-content:center}.catalog-gallery__image{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none}.catalog-gallery__button{position:absolute;border:0;background:rgba(255,255,255,.12);color:#fff;width:48px;height:48px;border-radius:50%;font-size:30px;line-height:1;cursor:pointer}.catalog-gallery__button:hover{background:rgba(255,255,255,.22)}.catalog-gallery__prev{left:10px}.catalog-gallery__next{right:10px}.catalog-gallery__close{top:10px;right:10px;font-size:26px}.catalog-gallery__counter{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);color:#fff;font:500 13px/1.2 sans-serif;letter-spacing:.08em}.compact-catalog-card__media{cursor:zoom-in}.compact-catalog-card__media img{width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none}`;
  const style=document.createElement('style'); style.textContent=galleryStyles; document.head.appendChild(style);
  const lightbox=document.createElement('div'); lightbox.className='catalog-gallery'; lightbox.hidden=true; lightbox.innerHTML='<div class="catalog-gallery__panel"><img class="catalog-gallery__image" alt=""><button class="catalog-gallery__button catalog-gallery__prev" type="button" aria-label="Previous">‹</button><button class="catalog-gallery__button catalog-gallery__next" type="button" aria-label="Next">›</button><button class="catalog-gallery__button catalog-gallery__close" type="button" aria-label="Close">×</button><span class="catalog-gallery__counter"></span></div>'; document.body.appendChild(lightbox);
  const lbImage=lightbox.querySelector('.catalog-gallery__image'),lbPrev=lightbox.querySelector('.catalog-gallery__prev'),lbNext=lightbox.querySelector('.catalog-gallery__next'),lbClose=lightbox.querySelector('.catalog-gallery__close'),lbCounter=lightbox.querySelector('.catalog-gallery__counter');
  let galleryImages=[],galleryIndex=0;
  const showGallery=images=>{galleryImages=images||[];if(!galleryImages.length)return;galleryIndex=0;lightbox.hidden=false;document.body.style.overflow='hidden';updateGallery();};
  const updateGallery=()=>{lbImage.src=galleryImages[galleryIndex];lbCounter.textContent=`${galleryIndex+1} / ${galleryImages.length}`;const multi=galleryImages.length>1;lbPrev.hidden=!multi;lbNext.hidden=!multi;};
  const closeGallery=()=>{lightbox.hidden=true;document.body.style.overflow='';lbImage.removeAttribute('src');};
  const moveGallery=step=>{if(galleryImages.length<2)return;galleryIndex=(galleryIndex+step+galleryImages.length)%galleryImages.length;updateGallery();};
  lbPrev.addEventListener('click',()=>moveGallery(-1));lbNext.addEventListener('click',()=>moveGallery(1));lbClose.addEventListener('click',closeGallery);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeGallery();});
  document.addEventListener('keydown',e=>{if(lightbox.hidden)return;if(e.key==='Escape')closeGallery();if(e.key==='ArrowLeft')moveGallery(-1);if(e.key==='ArrowRight')moveGallery(1);});
  function matches(product){const filterOk=activeFilter==='all'||(product.condition||[]).includes(activeFilter);const q=search.value.trim().toLowerCase();const hay=[product.commercialName,product.scientificName,first(product.origin),first(product.variety),first(product.campaign),first(product.quality),product._enName||'',product._enType||''].join(' ').toLowerCase();return filterOk&&(!q||hay.includes(q));}
  function card(product){
    const images=Array.isArray(product.images)?product.images:product.image?[product.image]:[];
    const displayName=product._enName||product.commercialName;
    const displayType=product._enType||product.type||product.group;
    const meta=[(product.condition||[]).map(cond).join(' · '),first(product.origin),first(product.calibre)||first(product.quality)].filter(Boolean).join(' · ');
    const params=new URLSearchParams({id:product.id});
    if(lang==='en')params.set('lang','en');
    if(dedicatedSubcategory)params.set('source',dedicatedSubcategory);
    const href=`${lang==='en'?'/en/products/product.html':'/products/product.html'}?${params.toString()}`;
    const media=images.length?`<button class="compact-catalog-card__media" type="button" data-gallery='${esc(JSON.stringify(images))}' aria-label="${esc(displayName)}"><img src="${esc(images[0])}" alt="${esc(displayName)}" loading="lazy" draggable="false"></button>`:'<div class="compact-catalog-card__media"><span class="compact-catalog-card__placeholder">EMPERIO TISS</span></div>';
    return `<article class="compact-catalog-card" data-product-id="${esc(product.id)}">${media}<div class="compact-catalog-card__body"><p class="compact-catalog-card__meta">${esc(displayType)}</p><h3 class="compact-catalog-card__title">${esc(displayName)}</h3><p class="compact-catalog-card__scientific"><em>${esc(product.scientificName)}</em></p>${meta?`<p class="compact-catalog-card__spec">${esc(meta)}</p>`:''}<a class="compact-catalog-card__link" href="${href}">${esc(t.detail)} ↗</a></div></article>`;
  }
  function syncFilterAvailability(){
    const hasFresh=products.some(p=>(p.condition||[]).includes('fresh'));const hasFrozen=products.some(p=>(p.condition||[]).includes('frozen'));
    filters.forEach(button=>{const value=button.dataset.compactFilter||'all';const available=value==='all'||(value==='fresh'?hasFresh:hasFrozen);button.disabled=!available;button.setAttribute('aria-disabled',String(!available));});
    if(frozenSeafoodFamily){const fresh=filters.find(b=>b.dataset.compactFilter==='fresh');if(fresh){fresh.disabled=true;fresh.setAttribute('aria-disabled','true');fresh.title=t.fresh+' not available for this catalogue';}const frozen=filters.find(b=>b.dataset.compactFilter==='frozen');if(frozen){frozen.disabled=false;frozen.removeAttribute('title');}activeFilter='frozen';filters.forEach(item=>item.setAttribute('aria-pressed',String((item.dataset.compactFilter||'all')===activeFilter)));}
  }
  function render(){const visible=products.filter(matches);count.textContent=`${visible.length} ${visible.length===1?'reference':'references'}`;grid.innerHTML=visible.length?visible.map(card).join(''):`<p class="compact-catalog__empty">${esc(t.empty)}</p>`;grid.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>showGallery(JSON.parse(button.dataset.gallery))));syncFilterAvailability();}
  filters.forEach(button=>{button.type='button';button.addEventListener('click',()=>{if(button.disabled)return;activeFilter=button.dataset.compactFilter||'all';filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));render();});});
  search.addEventListener('input',render);
  const loadData=async()=>{
    if(dedicatedDataUrl){const response=await fetch(dedicatedDataUrl,{cache:'no-cache'});if(!response.ok)throw new Error(`Catalogue request failed: ${response.status}`);const data=await response.json();return(data.products||[]).map(p=>({...p,condition:['frozen'],_enName:enNames[p.id]||p.commercialName,_enType:enTypes[p.id]||p.type||p.group}));}
    const[catalogResponse,imageResponse]=await Promise.all([fetch('/assets/data/catalog.json',{cache:'no-cache'}),fetch('/assets/data/product-images.json',{cache:'no-cache'})]);
    if(!catalogResponse.ok)throw new Error(`Catalog request failed: ${catalogResponse.status}`);if(imageResponse.ok)imageMap=await imageResponse.json();const data=await catalogResponse.json();
    return(data.products||[]).filter(p=>p.status==='active'&&p.family===family&&(!subcategories.length||subcategories.includes(p.subcategory))).map(p=>({...p,condition:frozenSeafoodFamily?['frozen']:p.condition,images:imageMap[p.id]||p.images||(p.image?[p.image]:[])}));
  };
  loadData().then(data=>{products=data;render();}).catch(err=>{console.error('[EMPERIO TISS] Catalogue failed',err);grid.innerHTML=`<p class="compact-catalog__empty">${esc(t.empty)}</p>`;count.textContent='—';});
})();
