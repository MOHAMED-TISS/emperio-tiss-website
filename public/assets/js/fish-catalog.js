(() => {
  'use strict';

  const root = document.documentElement;
  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;

  const labels = {
    es: { all:'Todos', fresh:'Fresco', allCats:'Todas las categorías', white:'Pez blanco', blue:'Pez azul', special:'Pescados especiales', refs:'referencias', ref:'referencia', none:'No hay referencias que coincidan con la búsqueda.', family:'Familia', type:'Tipo', state:'Estado', origin:'Origen', fao:'Zona FAO', calibre:'Calibre', quality:'Calidad', presentation:'Presentación', packaging:'Embalaje', availability:'Disponibilidad', according:'Según disponibilidad', destination:'Según destino', market:'Según mercado', professional:'Especificación profesional' },
    en: { all:'All', fresh:'Fresh', allCats:'All categories', white:'White fish', blue:'Blue fish', special:'Special fish', refs:'references', ref:'reference', none:'No references match your search.', family:'Family', type:'Type', state:'Condition', origin:'Origin', fao:'FAO area', calibre:'Calibre', quality:'Quality', presentation:'Presentation', packaging:'Packaging', availability:'Availability', according:'According to availability', destination:'According to destination', market:'According to market', professional:'Professional specification' },
    fr: { all:'Toutes', fresh:'Frais', allCats:'Toutes les catégories', white:'Poisson blanc', blue:'Poisson bleu', special:'Poissons spéciaux', refs:'références', ref:'référence', none:'Aucune référence ne correspond à votre recherche.', family:'Famille', type:'Type', state:'État', origin:'Origine', fao:'Zone FAO', calibre:'Calibre', quality:'Qualité', presentation:'Présentation', packaging:'Conditionnement', availability:'Disponibilité', according:'Selon disponibilité', destination:'Selon destination', market:'Selon marché', professional:'Spécification professionnelle' },
    it: { all:'Tutte', fresh:'Fresco', allCats:'Tutte le categorie', white:'Pesce bianco', blue:'Pesce azzurro', special:'Pesci speciali', refs:'referenze', ref:'referenza', none:'Nessuna referenza corrisponde alla ricerca.', family:'Famiglia', type:'Tipo', state:'Stato', origin:'Origine', fao:'Zona FAO', calibre:'Calibro', quality:'Qualità', presentation:'Presentazione', packaging:'Imballaggio', availability:'Disponibilità', according:'Secondo disponibilità', destination:'Secondo destinazione', market:'Secondo mercato', professional:'Specificazione professionale' },
    ar: { all:'الكل', fresh:'طازج', allCats:'جميع الفئات', white:'سمك أبيض', blue:'سمك أزرق', special:'أسماك خاصة', refs:'مراجع', ref:'مرجع', none:'لا توجد مراجع مطابقة للبحث.', family:'الفئة', type:'النوع', state:'الحالة', origin:'المنشأ', fao:'منطقة FAO', calibre:'المقاس', quality:'الجودة', presentation:'التقديم', packaging:'التعبئة', availability:'التوفر', according:'حسب التوفر', destination:'حسب الوجهة', market:'حسب السوق', professional:'مواصفة مهنية' }
  }[lang] || {};

  const names = {
    dorada:{es:'Dorada',en:'Sea bream',fr:'Daurade royale',it:'Orata',ar:'الدنيس'},
    lubina:{es:'Lubina',en:'Sea bass',fr:'Bar',it:'Branzino',ar:'القاروص'},
    'merluza-pijota':{es:'Merluza / Pijota',en:'Hake',fr:'Merlu',it:'Nasello',ar:'النازلي'},
    rape:{es:'Rape',en:'Monkfish',fr:'Baudroie',it:'Rana pescatrice',ar:'سمك الراهب'},
    'san-pedro':{es:'San Pedro',en:'John Dory',fr:'Saint-Pierre',it:'San Pietro',ar:'سمك القديس بطرس'},
    mero:{es:'Mero',en:'Dusky grouper',fr:'Mérou brun',it:'Cernia bruna',ar:'الهامور'},
    pargo:{es:'Pargo',en:'Common seabream / red porgy',fr:'Pagrus commun',it:'Pagro',ar:'المرجان'},
    denton:{es:'Dentón',en:'Dentex',fr:'Denté',it:'Dentice',ar:'السنغاري'},
    sama:{es:'Sama',en:'Dentex',fr:'Dentex',it:'Dentice',ar:'السما'},
    sargo:{es:'Sargo',en:'White seabream',fr:'Sar commun',it:'Sarago',ar:'السارغو'},
    rascacio:{es:'Rascacio',en:'Scorpionfish',fr:'Rascasse',it:'Scorfano',ar:'سمك العقرب'},
    caballa:{es:'Caballa',en:'Mackerel',fr:'Maquereau',it:'Sgombro',ar:'الماكريل'},
    salmonete:{es:'Salmonete',en:'Red mullet',fr:'Rouget',it:'Triglia',ar:'البربوني'},
    atun:{es:'Atún rojo',en:'Bluefin tuna',fr:'Thon rouge',it:'Tonno rosso',ar:'التونة زرقاء الزعانف'},
    'pez-limon':{es:'Pez limón / Seriola',en:'Greater amberjack',fr:'Sériole couronnée',it:'Ricciola',ar:'الكنعد'},
    boqueron:{es:'Boquerón',en:'European anchovy',fr:'Anchois',it:'Acciuga',ar:'الأنشوفة'},
    sardina:{es:'Sardina',en:'European sardine',fr:'Sardine',it:'Sardina',ar:'السردين'},
    sole:{es:'Lenguado',en:'Common sole',fr:'Sole commune',it:'Sogliola',ar:'سمك موسى'},
    'pez-espada':{es:'Pez espada',en:'Swordfish',fr:'Espadon',it:'Pesce spada',ar:'أبو سيف'},
    mujol:{es:'Mújol',en:'Mullet',fr:'Mulet',it:'Cefalo',ar:'البوري'}
  };

  const products = [
    ['dorada','Sparus aurata','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['merluza-pijota','Merluccius merluccius','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['rape','Lophius spp.','Pez de escama','Blanco / semigraso','Fresco','Atlántico / Mediterráneo','FAO 27 / FAO 37'],
    ['san-pedro','Zeus faber','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['mero','Epinephelus marginatus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['pargo','Pagrus pagrus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['denton','Dentex dentex','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sama','Dentex gibbosus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sargo','Diplodus sargus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['rascacio','Scorpaena scrofa','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['caballa','Scomber colias','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['salmonete','Mullus surmuletus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['atun','Thunnus thynnus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['pez-limon','Seriola dumerili','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['boqueron','Engraulis encrasicolus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sardina','Sardina pilchardus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sole','Solea solea','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['pez-espada','Xiphias gladius','Pescados especiales','Especial','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['mujol','Mugil cephalus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37']
  ].map(([id,scientificName,group,type,condition,origin,faoZone]) => ({ id,scientificName,group,type,condition,origin,faoZone,name:(names[id]||{})[lang]||names[id]?.es||id }));

  const marketOrder = {
    es:['dorada','lubina','merluza-pijota','rape','caballa','sardina','boqueron','salmonete','atun','pez-espada','san-pedro','denton','sargo','sole','pez-limon','mujol','pargo','mero','sama','rascacio'],
    en:['atun','merluza-pijota','caballa','lubina','dorada','pez-espada','boqueron','rape','sardina','sole','salmonete','pez-limon','san-pedro','denton','sargo','mujol','pargo','mero','sama','rascacio'],
    fr:['merluza-pijota','lubina','dorada','sardina','caballa','salmonete','rape','boqueron','pez-espada','sole','atun','san-pedro','denton','sargo','pez-limon','mujol','pargo','mero','sama','rascacio'],
    it:['dorada','lubina','merluza-pijota','pez-espada','atun','boqueron','caballa','rape','salmonete','pez-limon','sardina','sole','san-pedro','denton','sargo','mujol','pargo','mero','sama','rascacio'],
    ar:['atun','dorada','lubina','pez-limon','pez-espada','caballa','sardina','boqueron','salmonete','merluza-pijota','rape','sole','san-pedro','mero','pargo','denton','sargo','mujol','sama','rascacio']
  };
  const rank = new Map((marketOrder[lang] || marketOrder.es).map((id,i) => [id,i]));
  const categoryOf = p => p.group === 'Pescados especiales' ? 'special' : p.type.startsWith('Azul') ? 'blue' : 'white';
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  // The commercial Fish catalogue is fresh-only. Hide obsolete frozen controls
  // without changing the canonical page markup shared across languages.
  document.querySelectorAll('[data-fish-filter="frozen"]').forEach(button => {
    button.hidden = true;
    button.disabled = true;
    button.setAttribute('aria-hidden','true');
  });

  let imageMap = {};
  let condition = 'all';
  let category = 'all';

  const details = p => {
    const cat = categoryOf(p);
    const vals = [
      [labels.family,cat==='white'?labels.white:cat==='blue'?labels.blue:labels.special],
      [labels.type,p.type],
      [labels.state,labels.fresh],
      [labels.origin,p.origin],
      [labels.fao,p.faoZone],
      [labels.calibre,labels.according],
      [labels.quality,labels.professional],
      [labels.presentation,labels.destination],
      [labels.packaging,labels.market],
      [labels.availability,labels.according]
    ];
    return vals.map(([k,v])=>`<div class="fish-catalog-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('');
  };

  const viewer = document.createElement('div');
  viewer.className = 'fish-gallery';
  viewer.hidden = true;
  viewer.innerHTML = '<div class="fish-gallery__panel"><img class="fish-gallery__image" alt=""><button class="fish-gallery__prev" type="button">‹</button><button class="fish-gallery__next" type="button">›</button><button class="fish-gallery__close" type="button">×</button><span class="fish-gallery__counter"></span></div>';
  document.body.appendChild(viewer);
  const vimg=viewer.querySelector('.fish-gallery__image');
  const vc=viewer.querySelector('.fish-gallery__counter');
  let gallery=[],gi=0;
  const updateViewer=()=>{vimg.src=gallery[gi];vc.textContent=`${gi+1} / ${gallery.length}`;viewer.querySelector('.fish-gallery__prev').hidden=gallery.length<2;viewer.querySelector('.fish-gallery__next').hidden=gallery.length<2};
  const openViewer=imgs=>{if(!imgs.length)return;gallery=imgs;gi=0;viewer.hidden=false;document.body.style.overflow='hidden';updateViewer()};
  const closeViewer=()=>{viewer.hidden=true;document.body.style.overflow='';vimg.removeAttribute('src')};
  viewer.querySelector('.fish-gallery__prev').onclick=()=>{gi=(gi-1+gallery.length)%gallery.length;updateViewer()};
  viewer.querySelector('.fish-gallery__next').onclick=()=>{gi=(gi+1)%gallery.length;updateViewer()};
  viewer.querySelector('.fish-gallery__close').onclick=closeViewer;
  viewer.onclick=e=>{if(e.target===viewer)closeViewer()};

  const bindMedia = media => {
    const imgs=JSON.parse(media.dataset.images||'[]');
    const img=media.querySelector('.fish-card-image');
    const counter=media.querySelector('.fish-card-counter');
    if(!imgs.length)return;
    let current=0;
    const show=i=>{current=(i+imgs.length)%imgs.length;if(img)img.src=imgs[current];if(counter)counter.textContent=`${current+1} / ${imgs.length}`};
    media.querySelector('.fish-card-nav--prev')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(current-1)});
    media.querySelector('.fish-card-nav--next')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(current+1)});
    media.addEventListener('click',e=>{if(!e.target.closest('.fish-card-nav'))openViewer(imgs)});
  };

  const render = () => {
    const q=String(search.value||'').trim().toLowerCase();
    const visible=products.filter(p=>{
      const cat=categoryOf(p);
      const hay=[p.name,p.id,p.scientificName,p.group,p.type,p.origin,p.faoZone].join(' ').toLowerCase();
      return (condition==='all'||p.condition.toLowerCase().includes('fresco')) && (category==='all'||cat===category) && (!q||hay.includes(q));
    }).sort((a,b)=>(rank.get(a.id)??9999)-(rank.get(b.id)??9999));
    count.textContent=`${visible.length} ${visible.length===1?labels.ref:labels.refs}`;
    grid.innerHTML=visible.length?visible.map(p=>{
      const imgs=imageMap[p.id]||[];
      const img=imgs[0]||'';
      const mediaData=esc(JSON.stringify(imgs));
      const cat=categoryOf(p);
      return `<article class="fish-catalog-card" data-product-id="${esc(p.id)}"><div class="fish-catalog-card__media" data-images='${mediaData}'>${img?`<img class="fish-card-image" src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" draggable="false">`:'<span class="fish-catalog-card__placeholder">EMPERIO TISS</span>'}${imgs.length>1?`<button class="fish-card-nav fish-card-nav--prev" type="button">‹</button><button class="fish-card-nav fish-card-nav--next" type="button">›</button><span class="fish-card-counter">1 / ${imgs.length}</span>`:''}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(cat==='white'?labels.white:cat==='blue'?labels.blue:labels.special)}</p><h3 class="fish-catalog-card__title">${esc(p.name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(p.scientificName)}</em></p><div class="fish-catalog-card__details">${details(p)}</div></div></article>`;
    }).join(''):`<p class="fish-catalog__empty">${labels.none}</p>`;
    grid.querySelectorAll('.fish-catalog-card__media').forEach(bindMedia);
  };

  document.querySelectorAll('[data-fish-filter]').forEach(button=>button.addEventListener('click',()=>{
    if(button.hidden||button.disabled)return;
    condition=button.dataset.fishFilter||'all';
    document.querySelectorAll('[data-fish-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
    render();
  }));
  document.querySelectorAll('[data-fish-category]').forEach(button=>button.addEventListener('click',()=>{
    category=button.dataset.fishCategory||'all';
    document.querySelectorAll('[data-fish-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
    render();
  }));
  search.addEventListener('input',render);
  fetch('/assets/data/product-images.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(images=>{imageMap=images||{};render()}).catch(()=>render());
})();