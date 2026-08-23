(() => {
  'use strict';

  const root = document.getElementById('productDetail');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const requestedLang = (params.get('lang') || document.documentElement.lang || 'es').slice(0,2).toLowerCase();
  document.documentElement.lang = requestedLang;
  const source = params.get('source') || '';

  const dictionaries = {
    es:{labels:{condition:'Condición',origin:'Origen',faoZone:'Zona FAO',calibre:'Calibre',quality:'Calidad',format:'Formato',packaging:'Envase / embalaje',availability:'Disponibilidad',variety:'Variedad',campaign:'Campaña',brix:'Brix',maturity:'Madurez',glazing:'Glaseado',processing:'Procesado',freezing:'Congelación',harvest:'Cosecha',destination:'Destino'},fresh:'Fresco',frozen:'Congelado',back:'Volver a productos ↗',missing:'Producto no especificado.',unavailable:'Producto no disponible.',error:'No se pudo cargar la ficha.',request:'Solicitar esta referencia'},
    en:{labels:{condition:'Condition',origin:'Origin',faoZone:'FAO zone',calibre:'Calibre',quality:'Quality',format:'Format',packaging:'Packaging',availability:'Availability',variety:'Variety',campaign:'Campaign',brix:'Brix',maturity:'Maturity',glazing:'Glazing',processing:'Processing',freezing:'Freezing',harvest:'Harvest',destination:'Destination'},fresh:'Fresh',frozen:'Frozen',back:'Back to products ↗',missing:'No product specified.',unavailable:'Product unavailable.',error:'The product specification could not be loaded.',request:'Request this reference'},
    fr:{labels:{condition:'Condition',origin:'Origine',faoZone:'Zone FAO',calibre:'Calibre',quality:'Qualité',format:'Format',packaging:'Emballage',availability:'Disponibilité',variety:'Variété',campaign:'Campagne',brix:'Brix',maturity:'Maturité',glazing:'Glaçage',processing:'Transformation',freezing:'Congélation',harvest:'Récolte',destination:'Destination'},fresh:'Frais',frozen:'Surgelé',back:'Retour aux produits ↗',missing:'Produit non spécifié.',unavailable:'Produit indisponible.',error:'Impossible de charger la fiche produit.',request:'Demander cette référence'},
    ar:{labels:{condition:'الحالة',origin:'المنشأ',faoZone:'منطقة FAO',calibre:'المقاس',quality:'الجودة',format:'الشكل',packaging:'التعبئة',availability:'التوفر',variety:'الصنف',campaign:'الموسم',brix:'Brix',maturity:'النضج',glazing:'التزجيج',processing:'المعالجة',freezing:'التجميد',harvest:'الحصاد',destination:'الوجهة'},fresh:'طازج',frozen:'مجمد',back:'العودة إلى المنتجات ↗',missing:'لم يتم تحديد المنتج.',unavailable:'المنتج غير متوفر.',error:'تعذر تحميل مواصفات المنتج.',request:'طلب هذه المرجعية'}
  };

  const lang = dictionaries[requestedLang] ? requestedLang : 'es';
  const t = dictionaries[lang];
  const order = ['condition','origin','faoZone','calibre','quality','format','packaging','availability','variety','campaign','brix','maturity','glazing','processing','freezing','harvest','destination'];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const pretty = (key,value) => key === 'condition'
    ? (Array.isArray(value)?value:[value]).map(item=>item==='fresh'?t.fresh:item==='frozen'?t.frozen:item).join(' · ')
    : Array.isArray(value) ? value.filter(Boolean).join(' · ') : String(value ?? '');
  const first = value => Array.isArray(value) ? (value.find(Boolean) || '') : (value || '');
  const backHref = lang === 'en' ? '/en/products/' : lang === 'fr' ? '/fr/products/' : lang === 'ar' ? '/ar/products/' : '/products/';

  const dedicatedUrls = {
    shellfish:'/assets/data/shellfish-catalog-es.json',
    cephalopods:'/assets/data/cephalopods-catalog-es.json'
  };
  const enNames = {moruno:'Mediterranean red shrimp',cigala:'Norway lobster','gamba-blanca':'Deep-water rose shrimp','langostino-tigre':'Tiger prawn','pulpo-flor':'Flower octopus','pulpo-bloque':'Block octopus','calamar-envuelto':'Wrapped squid','sepia-limpia-iqf':'Cleaned cuttlefish IQF'};
  const enTypes = {moruno:'Mediterranean',cigala:'Mediterranean','gamba-blanca':'Mediterranean','langostino-tigre':'Prawn','pulpo-flor':'Octopus','pulpo-bloque':'Octopus','calamar-envuelto':'Squid','sepia-limpia-iqf':'Cuttlefish'};

  async function getCatalog(){
    const url = dedicatedUrls[source] || '/assets/data/catalog.json';
    const response = await fetch(url,{cache:'no-cache'});
    if(!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    const data = await response.json();
    if(!Array.isArray(data.products)) throw new Error('Invalid catalog');
    return data;
  }

  async function render(){
    const id = params.get('id');
    if(!id){ root.innerHTML=`<div class="product-detail-error"><h1>${esc(t.missing)}</h1><a href="${backHref}">${esc(t.back)}</a></div>`; return; }
    const data = await getCatalog();
    const product = data.products.find(item=>item.id===id && (source ? true : item.status==='active'));
    if(!product){ root.innerHTML=`<div class="product-detail-error"><h1>${esc(t.unavailable)}</h1><a href="${backHref}">${esc(t.back)}</a></div>`; return; }

    if(lang==='en' && source){
      product.commercialName = enNames[product.id] || product.commercialName;
      product.type = enTypes[product.id] || product.type || product.group;
      product.image = product.image || first(product.images);
      product.condition = ['frozen'];
    } else if(product.images && !product.image) {
      product.image = first(product.images);
    }

    const category = product.type || product.subcategory || product.group || product.family || 'product';
    const specs = order.filter(key=>product[key] && ((Array.isArray(product[key])&&product[key].some(Boolean))||(!Array.isArray(product[key])&&product[key]))).map(key=>`<div class="product-detail__spec"><small>${esc(t.labels[key]||key)}</small><strong>${esc(pretty(key,product[key]))}</strong></div>`).join('');
    root.innerHTML=`<article class="product-detail" data-product-id="${esc(product.id)}"><div class="product-detail__media">${product.image?`<img src="${esc(product.image)}" alt="${esc(product.commercialName)}" loading="eager">`:'<div class="product-detail__placeholder">EMPERIO TISS</div>'}</div><div class="product-detail__content"><p class="product-detail__eyebrow">${esc(category)}</p><h1 class="product-detail__title">${esc(product.commercialName)}</h1><p><em>${esc(product.scientificName)}</em></p><div class="product-detail__specs">${specs}</div><a class="button button-light" href="${lang==='en'?'/en/contact/':'/contact/'}">${esc(t.request)} <span>↗</span></a></div></article>`;
    document.title=`${product.commercialName} | EMPERIO TISS`;
  }

  render().catch(error=>{console.error('[EMPERIO TISS] Product detail failed:',error);root.innerHTML=`<div class="product-detail-error"><h1>${esc(t.error)}</h1><a href="${backHref}">${esc(t.back)}</a></div>`;});
})();
