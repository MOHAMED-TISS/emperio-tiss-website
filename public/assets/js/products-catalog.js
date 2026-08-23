(() => {
  'use strict';

  const CATALOG_URL = '/assets/data/catalog-v1.3.json';
  const i18n = {
    es: {labels:{fish:'Pescados',shellfish:'Mariscos / Crustáceos',cephalopods:'Cefalópodos',citrus:'Cítricos',exotics:'Frutas exóticas','core-produce':'Otras frutas',vegetables:'Hortalizas','seasonal-selection':'Temporada',mediterranean:'Del Mediterráneo'},fresh:'Fresco',frozen:'Congelado',detail:'Ver ficha',empty:'No hay referencias activas en esta categoría.',catalogue:'CATÁLOGO',all:'Referencias seleccionadas.',seafood:'Productos del mar',seasonal:'Temporada',previous:'Imagen anterior',next:'Imagen siguiente',close:'Cerrar'},
    en: {labels:{fish:'Fish',shellfish:'Shellfish / Crustaceans',cephalopods:'Cephalopods',citrus:'Citrus',exotics:'Exotic fruit','core-produce':'Other fruit',vegetables:'Vegetables','seasonal-selection':'Seasonal',mediterranean:'Mediterranean'},fresh:'Fresh',frozen:'Frozen',detail:'View specification',empty:'No active references in this category.',catalogue:'CATALOGUE',all:'Selected references.',seafood:'Seafood',seasonal:'Seasonal',previous:'Previous image',next:'Next image',close:'Close'},
    fr: {labels:{fish:'Poissons',shellfish:'Fruits de mer / Crustacés',cephalopods:'Céphalopodes',citrus:'Agrumes',exotics:'Fruits exotiques','core-produce':'Autres fruits',vegetables:'Légumes','seasonal-selection':'Saisonnier',mediterranean:'Méditerranée'},fresh:'Frais',frozen:'Surgelé',detail:'Voir la fiche',empty:'Aucune référence active dans cette catégorie.',catalogue:'CATALOGUE',all:'Références sélectionnées.',seafood:'Produits de la mer',seasonal:'Saisonnier',previous:'Image précédente',next:'Image suivante',close:'Fermer'},
    ar: {labels:{fish:'أسماك',shellfish:'المأكولات البحرية / القشريات',cephalopods:'رأسيات الأرجل',citrus:'حمضيات',exotics:'فواكه استوائية','core-produce':'فواكه أخرى',vegetables:'خضروات','seasonal-selection':'موسمي',mediterranean:'البحر المتوسط'},fresh:'طازج',frozen:'مجمد',detail:'عرض المواصفات',empty:'لا توجد مراجع نشطة في هذه الفئة.',catalogue:'الكتالوج',all:'مراجع مختارة.',seafood:'منتجات البحر',seasonal:'موسمي',previous:'الصورة السابقة',next:'الصورة التالية',close:'إغلاق'}
  };

  const lang=(document.documentElement.lang||'es').slice(0,2).toLowerCase();
  const t=i18n[lang]||i18n.es;
  const esc=(value)=>String(value??'').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const first=(value)=>Array.isArray(value)?value.find(Boolean)||'':(value||'');
  const images=(product)=>{
    const values=Array.isArray(product.images)?product.images:(product.image?[product.image]:[]);
    return [...new Set(values.filter(Boolean))];
  };
  const normalizeCondition=(values)=>(values||[]).map((value)=>value==='fresh'?t.fresh:value==='frozen'?t.frozen:value).join(' · ');

  let lightboxImages=[];
  let lightboxIndex=0;

  function ensureLightbox(){
    if(document.getElementById('etProductLightbox'))return;
    const style=document.createElement('style');
    style.textContent=`#etProductLightbox{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:32px;background:rgba(2,14,24,.94)}#etProductLightbox.is-open{display:flex}#etProductLightbox .et-lb-image{max-width:min(92vw,1500px);max-height:86vh;object-fit:contain;user-select:none;-webkit-user-drag:none}#etProductLightbox .et-lb-close,#etProductLightbox .et-lb-prev,#etProductLightbox .et-lb-next{position:absolute;border:0;background:rgba(255,255,255,.1);color:#fff;width:46px;height:46px;border-radius:50%;font-size:26px;cursor:pointer}#etProductLightbox .et-lb-close{top:20px;right:20px;font-size:24px}#etProductLightbox .et-lb-prev{left:22px}#etProductLightbox .et-lb-next{right:22px}#etProductLightbox .et-lb-count{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);font:500 12px/1 var(--et-sans,"DM Sans",sans-serif);letter-spacing:.12em;color:rgba(255,255,255,.72)}#etProductLightbox .et-lb-thumbs{position:absolute;bottom:52px;left:50%;transform:translateX(-50%);display:flex;gap:8px;max-width:80vw;overflow:auto}#etProductLightbox .et-lb-thumb{width:56px;height:42px;padding:0;border:1px solid rgba(255,255,255,.28);background:none;cursor:pointer;overflow:hidden}#etProductLightbox .et-lb-thumb img{width:100%;height:100%;object-fit:cover}@media(max-width:700px){#etProductLightbox{padding:18px}#etProductLightbox .et-lb-prev{left:10px}#etProductLightbox .et-lb-next{right:10px}}`;
    document.head.appendChild(style);
    const box=document.createElement('div');
    box.id='etProductLightbox';box.setAttribute('aria-hidden','true');
    box.innerHTML=`<button class="et-lb-close" type="button" aria-label="${esc(t.close)}">×</button><button class="et-lb-prev" type="button" aria-label="${esc(t.previous)}">‹</button><img class="et-lb-image" alt=""><button class="et-lb-next" type="button" aria-label="${esc(t.next)}">›</button><div class="et-lb-thumbs"></div><div class="et-lb-count"></div>`;
    document.body.appendChild(box);
    box.addEventListener('click',(event)=>{if(event.target===box)closeLightbox();});
    box.querySelector('.et-lb-close').addEventListener('click',closeLightbox);
    box.querySelector('.et-lb-prev').addEventListener('click',()=>showLightbox(lightboxIndex-1));
    box.querySelector('.et-lb-next').addEventListener('click',()=>showLightbox(lightboxIndex+1));
    document.addEventListener('keydown',(event)=>{if(!box.classList.contains('is-open'))return;if(event.key==='Escape')closeLightbox();if(event.key==='ArrowLeft')showLightbox(lightboxIndex-1);if(event.key==='ArrowRight')showLightbox(lightboxIndex+1);});
  }
  function showLightbox(index){
    if(!lightboxImages.length)return;
    lightboxIndex=(index+lightboxImages.length)%lightboxImages.length;
    const box=document.getElementById('etProductLightbox');
    const image=box.querySelector('.et-lb-image');
    image.src=lightboxImages[lightboxIndex];
    image.alt=image.dataset.productName||'';
    box.querySelector('.et-lb-count').textContent=`${lightboxIndex+1} / ${lightboxImages.length}`;
    box.querySelector('.et-lb-prev').hidden=lightboxImages.length<2;
    box.querySelector('.et-lb-next').hidden=lightboxImages.length<2;
    const thumbs=box.querySelector('.et-lb-thumbs');thumbs.replaceChildren();
    if(lightboxImages.length>1)lightboxImages.forEach((src,i)=>{const button=document.createElement('button');button.type='button';button.className='et-lb-thumb';button.setAttribute('aria-label',`${i+1}`);button.innerHTML=`<img src="${esc(src)}" alt="">`;button.addEventListener('click',()=>showLightbox(i));thumbs.appendChild(button);});
  }
  function openLightbox(product){ensureLightbox();lightboxImages=images(product);if(!lightboxImages.length)return;lightboxIndex=0;const box=document.getElementById('etProductLightbox');box.querySelector('.et-lb-image').dataset.productName=product.commercialName||'';box.classList.add('is-open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';showLightbox(0);}
  function closeLightbox(){const box=document.getElementById('etProductLightbox');if(!box)return;box.classList.remove('is-open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';}

  function card(product){
    if(!product||product.status!=='active')return '';
    const category=t.labels[product.subcategory]||product.subcategory||product.family||'';
    const group=product.catalogGroup?t.labels[product.catalogGroup]||product.catalogGroup:'';
    const meta=[normalizeCondition(product.condition),first(product.origin),first(product.calibre)].filter(Boolean).join(' · ');
    const href=`/products/product.html?id=${encodeURIComponent(product.id)}`;
    const gallery=images(product);
    const media=gallery.length?`<button class="product-card__image-button" type="button" data-gallery-product="${esc(product.id)}" aria-label="${esc(product.commercialName)}"><img src="${esc(gallery[0])}" alt="${esc(product.commercialName)}" loading="lazy" draggable="false">${gallery.length>1?`<span class="product-card__image-count">${gallery.length} imágenes</span>`:''}</button>`:'<span class="product-card__placeholder">EMPERIO TISS</span>';
    return `<article class="product-card" data-product-id="${esc(product.id)}"><div class="product-card__media">${media}</div><div class="product-card__body">${group?`<p class="product-card__group">${esc(group)}</p>`:''}<p class="product-card__meta">${esc(category)}</p><h3 class="product-card__title">${esc(product.commercialName)}</h3>${product.scientificName?`<p class="product-card__description"><em>${esc(product.scientificName)}</em></p>`:''}${meta?`<p class="product-card__description">${esc(meta)}</p>`:''}<a class="product-card__link" href="${href}">${esc(t.detail)} <span aria-hidden="true">↗</span></a></div></article>`;
  }

  async function loadCatalog(){
    const response=await fetch(CATALOG_URL,{cache:'no-cache'});
    if(!response.ok)throw new Error(`Catalog request failed: ${response.status}`);
    const data=await response.json();
    if(!data||!Array.isArray(data.products))throw new Error('Invalid catalog schema');
    return data;
  }
  function bindGalleries(root=document){root.querySelectorAll('[data-gallery-product]').forEach(button=>{if(button.dataset.galleryBound)return;button.dataset.galleryBound='true';button.addEventListener('click',()=>{const id=button.dataset.galleryProduct;const product=window.__ET_CATALOG_PRODUCTS?.find(item=>item.id===id);if(product)openLightbox(product);});});}
  function renderInto(element,products){if(!element)return;element.innerHTML=products.length?products.map(card).join(''):`<p class="catalog-empty">${esc(t.empty)}</p>`;bindGalleries(element);}
  function renderRequestedCatalogs(data){
    window.__ET_CATALOG_PRODUCTS=data.products;
    const products=data.products.filter((product)=>product.status==='active');
    document.querySelectorAll('[data-catalog-family]').forEach((element)=>{const family=element.dataset.catalogFamily;const subcategories=(element.dataset.catalogSubcategories||'').split(',').map((value)=>value.trim()).filter(Boolean);renderInto(element,products.filter((product)=>product.family===family&&(!subcategories.length||subcategories.includes(product.subcategory))));});
  }
  function routeContext(){const parts=window.location.pathname.split('/').filter(Boolean);const productsIndex=parts.indexOf('products');return productsIndex>=0?parts.slice(productsIndex+1):[];}
  function autoCatalogTarget(){
    if(document.querySelector('[data-catalog-family]'))return null;
    const rest=routeContext();if(!rest.length)return null;
    let family=null,subcategories=[],title='',eyebrow=t.catalogue;
    if(rest[0]==='seafood'){family='seafood';if(rest[1]==='fish'){subcategories=['fish'];title=t.labels.fish;}else if(rest[1]==='shellfish'){subcategories=['shellfish'];title=t.labels.shellfish;}else if(rest[1]==='cephalopods'){subcategories=['cephalopods'];title=t.labels.cephalopods;}else title=t.seafood;}else if(rest[0]==='seasonal'){family='seasonal';subcategories=['seasonal-selection'];title=t.seasonal;}
    if(!family)return null;const main=document.querySelector('main');if(!main)return null;const section=document.createElement('section');section.className='catalog-section auto-catalog-section';section.innerHTML=`<div class="catalog-inner"><div class="catalog-head"><div><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}<br><em>${esc(t.all)}</em></h2></div><p>${esc(t.detail)}</p></div><div class="product-catalog-grid" data-catalog-family="${esc(family)}" data-catalog-subcategories="${esc(subcategories.join(','))}"></div></div>`;main.appendChild(section);return section.querySelector('[data-catalog-family]');
  }
  async function init(){const injected=autoCatalogTarget();const targets=document.querySelectorAll('[data-catalog-family]');if(!targets.length&&!injected)return;try{const data=await loadCatalog();renderRequestedCatalogs(data);document.documentElement.dataset.catalogReady='true';}catch(error){console.error('[EMPERIO TISS] Catalog load failed:',error);document.querySelectorAll('[data-catalog-family]').forEach((element)=>{element.innerHTML=`<p class="catalog-empty">${esc(t.empty)}</p>`;});document.documentElement.dataset.catalogReady='false';}}
  window.EMPERIO_TISS_CATALOG={loadCatalog,renderInto,card};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();