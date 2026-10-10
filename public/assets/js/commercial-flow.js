(() => {
  'use strict';
  if (window.__etCommercialFlow) return;
  window.__etCommercialFlow = true;
  const doc=document, root=doc.documentElement, body=doc.body;
  if (!body || body.classList.contains('private-page') || body.classList.contains('private-admin-page')) return;
  const lang=(root.lang||'en').slice(0,2).toLowerCase();
  const L={
    es:{eyebrow:'CÓMO TRABAJAMOS',title:'De la necesidad a la recepción.',lead:'Cada operación parte de una necesidad concreta y se estructura alrededor de una especificación verificable antes de coordinar el suministro.',steps:['Necesidad','Especificación','Origen','Verificación','Ejecución','Recepción y seguimiento'],controls:['Especie / variedad','Origen / zona FAO','Calibre','Condición','Calidad','Presentación / envase','Cantidad','Ventana de carga','Destino','Documentación'],cta:'Solicitar esta especificación'},
    en:{eyebrow:'HOW WE WORK',title:'From requirement to reception.',lead:'Each operation starts with a concrete requirement and is structured around a verifiable specification before supply is coordinated.',steps:['Requirement','Specification','Origin','Verification','Execution','Reception & follow-up'],controls:['Species / variety','Origin / FAO area','Calibre','Condition','Quality','Presentation / packaging','Quantity','Loading window','Destination','Documentation'],cta:'Request this specification'},
    fr:{eyebrow:'NOTRE MÉTHODE',title:'Du besoin à la réception.',lead:'Chaque opération part d’un besoin précis et s’organise autour d’une spécification vérifiable avant la coordination de l’approvisionnement.',steps:['Besoin','Spécification','Origine','Vérification','Exécution','Réception & suivi'],controls:['Espèce / variété','Origine / zone FAO','Calibre','État','Qualité','Présentation / conditionnement','Quantité','Fenêtre de chargement','Destination','Documentation'],cta:'Demander cette spécification'},
    it:{eyebrow:'COME LAVORIAMO',title:'Dall’esigenza alla ricezione.',lead:'Ogni operazione parte da un’esigenza concreta ed è strutturata attorno a una specifica verificabile prima di coordinare la fornitura.',steps:['Esigenza','Specifica','Origine','Verifica','Esecuzione','Ricezione e follow-up'],controls:['Specie / varietà','Origine / zona FAO','Calibro','Condizione','Qualità','Presentazione / imballaggio','Quantità','Finestra di carico','Destinazione','Documentazione'],cta:'Richiedi questa specifica'},
    ar:{eyebrow:'كيف نعمل',title:'من الاحتياج إلى الاستلام.',lead:'تبدأ كل عملية باحتياج محدد ويتم تنظيمها حول مواصفات قابلة للتحقق قبل تنسيق التوريد.',steps:['الاحتياج','المواصفات','المنشأ','التحقق','التنفيذ','الاستلام والمتابعة'],controls:['النوع / الصنف','المنشأ / منطقة FAO','العيار','الحالة','الجودة','العرض / التعبئة','الكمية','نافذة التحميل','الوجهة','الوثائق'],cta:'طلب هذه المواصفات'}
  }[lang] || null;
  if (!L) return;
  if (!doc.querySelector('link[data-et-commercial-flow]')) {
    const link=doc.createElement('link'); link.rel='stylesheet'; link.href='/assets/css/commercial-flow.css?v=20260928-commercial-flow-1'; link.dataset.etCommercialFlow='true'; doc.head.appendChild(link);
  }
  let referenceMap={};
  let referenceAliases={};
  let referencesLoaded=false;
  const referenceReady=fetch('/assets/data/product-references.json?v=20260928-ref4-1',{cache:'no-cache'})
    .then(r=>r.ok?r.json():{})
    .then(data=>{ referenceMap=data.references || {}; referenceAliases=data.aliases || {}; referencesLoaded=true; return referenceMap; })
    .catch(()=>{ referencesLoaded=true; return {}; });
  const path=location.pathname.replace(/\/+/g,'/');
  const base=lang==='es'?'/':`/${lang}/`;
  const contact=`${base}contact/`;
  const categoryFromPath=()=>{
    if(/\/seafood\/fish\//.test(path)) return 'fish';
    if(/\/seafood\/shellfish\//.test(path)) return 'shellfish';
    if(/\/seafood\/cephalopods\//.test(path)) return 'cephalopods';
    if(/\/fruits\//.test(path)) return 'fruits';
    if(/\/vegetables\//.test(path)) return 'vegetables';
    if(/\/seasonal\//.test(path)) return 'seasonal';
    return body.dataset.catalogSubcategory || body.dataset.brandCategory || '';
  };
  const compact=v=>String(v||'').replace(/\s+/g,' ').trim();
  const slug=v=>compact(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,120);
  const makeHref=(productId,productReference,productName,specification,origin,category,source='catalogue')=>{
    const q=new URLSearchParams();
    if(productId) q.set('product_id',productId);
    if(productReference) q.set('product_reference',productReference);
    if(productName) q.set('product_name',productName);
    if(specification) q.set('specification',specification.slice(0,1200));
    if(origin) q.set('origin',origin.slice(0,240));
    if(category) q.set('category',category);
    q.set('source',source); q.set('from',path);
    return contact+'?'+q.toString();
  };
  const trustEligible=/\/about\/?$/.test(path) || /\/products(?:\/|$)/.test(path);
  if(trustEligible && !doc.querySelector('.et-operation-flow')) {
    const main=doc.querySelector('main');
    if(main){
      const section=doc.createElement('section'); section.className='et-operation-flow';
      section.innerHTML=`<div class="et-operation-flow__inner"><div class="et-operation-flow__head"><div><p class="et-operation-flow__eyebrow">${L.eyebrow}</p><h2>${L.title}</h2></div><p>${L.lead}</p></div><ol class="et-operation-flow__steps">${L.steps.map((s,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><strong>${s}</strong></li>`).join('')}</ol><div class="et-operation-flow__controls">${L.controls.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
      main.appendChild(section);
    }
  }
  const decorate=()=>{
    const cards=doc.querySelectorAll('.seafood-catalog-card,.compact-catalog-card,.market-catalogue-card,.fish-catalog-card,.fish-emblematic-card,[data-product-id].product-card,.product-row[data-product-id]');
    for(const card of cards){
      const titleNode=card.querySelector('.et-fish-card__name,h3,.compact-catalog-card__title,.market-catalogue-card__name,h2');
      const title=compact(titleNode?.textContent);
      if(!title) continue;
      const productId=card.dataset.productId || slug(title);
      const productReference=referenceMap[productId] || referenceMap[referenceAliases[productId]] || card.dataset.productReference || '';
      if(productReference){
        card.dataset.productReference=productReference;
        if(!card.querySelector(':scope .et-product-reference')){
          const ref=doc.createElement('p'); ref.className='et-product-reference'; ref.textContent=`REF. ${productReference}`;
          titleNode?.insertAdjacentElement('beforebegin',ref);
        }
      }
      const spec=compact(card.querySelector('.et-fish-card__specs,.seafood-catalog-card__details,.compact-catalog-card__details,.market-catalogue-card__details,.fish-catalog-card__details,.fish-catalog-card__specs,.product-card__details')?.textContent);
      const host=card.querySelector('.et-fish-card__sheet,.seafood-catalog-card__body,.compact-catalog-card__body,.market-catalogue-card__body,.fish-catalog-card__body,.fish-emblematic-card__body,.product-card__body') || card;
      let a=card.querySelector(':scope .et-rfq-link');
      if(!a){ a=doc.createElement('a'); a.className='et-rfq-link'; a.textContent=L.cta; host.appendChild(a); }
      a.href=makeHref(productId,productReference,title,spec,'',categoryFromPath());
    }
    if(body.classList.contains('product-detail-page') && !doc.querySelector('.et-product-rfq')){
      const title=compact(doc.querySelector('main h1,main h2')?.textContent);
      if(title){
        const spec=compact(doc.querySelector('.product-detail-specs,.product-specs,.product-detail__specs')?.textContent);
        const a=doc.createElement('a'); a.className='et-rfq-link et-product-rfq'; a.textContent=L.cta; a.href=makeHref(slug(title),'',title,spec,'',categoryFromPath(),'product-detail');
        (doc.querySelector('.product-detail__copy,.product-detail-copy,main')||doc.body).appendChild(a);
      }
    }
  };
  decorate();
  referenceReady.then(decorate);
  new MutationObserver(decorate).observe(doc.body,{childList:true,subtree:true});
})();