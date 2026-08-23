(() => {
  'use strict';
  const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;

  const labels = lang === 'fr' ? {
    all:'Toutes', fresh:'Frais', frozen:'Congelé', allCats:'Toutes les catégories', white:'Poisson blanc', blue:'Poisson bleu', special:'Poissons spéciaux', refs:'références', ref:'référence', none:'Aucune référence ne correspond à votre recherche.',
    family:'Famille', type:'Type', state:'État', origin:'Origine', fao:'Zone FAO', calibre:'Calibre', quality:'Qualité', presentation:'Présentation', packaging:'Conditionnement', availability:'Disponibilité', byRef:'par référence.', emblem:'SÉLECTION EMBLÉMATIQUE', exceptional:'Quelques références\nexceptionnelles.', emblemNote:'Une sélection visuelle et éditoriale avant le catalogue opérationnel.', see:'Voir le catalogue', zoom:'Voir l’image', professional:'Référence professionnelle', whiteType:'Blanc / semi-gras', blueType:'Bleu / gras', specialType:'Spécial', fresh:'Frais', freshFrozen:'Frais / Congelé', according:'Selon disponibilité', mediterranean:'Méditerranée / selon disponibilité'
  } : {
    all:'All', fresh:'Fresh', frozen:'Frozen', allCats:'All categories', white:'White fish', blue:'Blue fish', special:'Special fish', refs:'references', ref:'reference', none:'No references match your search.',
    family:'Family', type:'Type', state:'Condition', origin:'Origin', fao:'FAO area', calibre:'Calibre', quality:'Quality', presentation:'Presentation', packaging:'Packaging', availability:'Availability', byRef:'by reference.', emblem:'EMBLEMATIC SELECTION', exceptional:'A few\nexceptional references.', emblemNote:'Selected references presented with more space and detail before the working catalogue.', see:'Scroll to catalogue', zoom:'View image', professional:'Professional reference', whiteType:'White / semi-fat', blueType:'Blue / oily', specialType:'Special', fresh:'Fresh', freshFrozen:'Fresh / Frozen', according:'According to availability', mediterranean:'Mediterranean / according to availability'
  };

  const products = [
    ['dorada','Dorada','Sparus aurata','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['lubina','Sea bass','Dicentrarchus labrax','white','White / semi-fat','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['merluza-pijota','Hake','Merluccius spp.','white','White / semi-fat','FRESH','According to supply programme','According to origin'],
    ['mujol','Mullet','Mugil cephalus','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['rape','Monkfish','Lophius spp.','white','White / semi-fat','FRESH','Atlantic / Mediterranean according to availability','FAO 27 / FAO 37'],
    ['san-pedro','John Dory','Zeus faber','white','White / semi-fat','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['mero-amarillo','Yellow grouper','Epinephelus spp.','white','White / semi-fat','FRESH','According to origin available','According to origin'],
    ['pargo','Snapper','Lutjanus spp.','white','White / semi-fat','FRESH','According to supply programme','According to origin'],
    ['denton','Dentex','Dentex dentex','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['sama','Sama','Dentex spp.','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['sargo','White seabream','Diplodus spp.','white','White / semi-fat','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['rascacio','Scorpionfish','Scorpaena spp.','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['caballa','Mackerel','Scomber spp.','blue','Blue / oily','FRESH|FROZEN','Atlantic / Mediterranean according to availability','FAO 27 / FAO 37'],
    ['salmonete','Red mullet','Mullus spp.','blue','Blue / oily','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['atun','Tuna','Thunnus spp.','blue','Blue / oily','FRESH','According to species and supply programme','According to origin'],
    ['pez-limon','Greater amberjack','Seriola dumerili','blue','Blue / oily','FRESH','Mediterranean / according to availability','FAO 37'],
    ['boqueron','Anchovy','Engraulis encrasicolus','blue','Blue / oily','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['pez-sable','Cutlassfish','Trichiurus spp.','special','Special','FRESH','According to supply programme','According to origin'],
    ['pez-espada','Swordfish','Xiphias gladius','special','Special','FRESH','According to supply programme','According to origin']
  ].map(([id,name,scientific,category,type,condition,origin,fao]) => ({id,name,scientific,category,type,condition:condition.split('|'),origin,fao}));
  const categoryNames = {white:labels.white, blue:labels.blue, special:labels.special};
  const emblematic = [
    {id:'dorada', es:'Dorada', en:'Sea bream', fr:'Daurade', scientific:'Sparus aurata', cat:'white'},
    {id:'denton', es:'Dentón', en:'Dentex', fr:'Denté', scientific:'Dentex dentex', cat:'white'},
    {id:'san-pedro', es:'San Pedro', en:'John Dory', fr:'Saint-Pierre', scientific:'Zeus faber', cat:'white'}
  ];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let imageMap = {}, condition = 'all', category = 'all', gallery = [], galleryIndex = 0;

  const ensureViewer = () => {
    if (document.getElementById('intlFishViewer')) return;
    const box = document.createElement('div');
    box.id='intlFishViewer'; box.className='fish-gallery'; box.hidden=true;
    box.innerHTML='<div class="fish-gallery__panel"><img class="fish-gallery__image" alt=""><button class="fish-gallery__prev" type="button" aria-label="Previous">‹</button><button class="fish-gallery__next" type="button" aria-label="Next">›</button><button class="fish-gallery__close" type="button" aria-label="Close">×</button><span class="fish-gallery__counter"></span></div>';
    document.body.appendChild(box);
    const img=box.querySelector('.fish-gallery__image'), counter=box.querySelector('.fish-gallery__counter');
    const move = step => { if(gallery.length<2) return; galleryIndex=(galleryIndex+step+gallery.length)%gallery.length; img.src=gallery[galleryIndex]; counter.textContent=`${galleryIndex+1} / ${gallery.length}`; };
    box.querySelector('.fish-gallery__prev').onclick=()=>move(-1); box.querySelector('.fish-gallery__next').onclick=()=>move(1);
    box.querySelector('.fish-gallery__close').onclick=()=>{box.hidden=true;document.body.style.overflow='';}; box.onclick=e=>{if(e.target===box){box.hidden=true;document.body.style.overflow='';}};
    document.addEventListener('keydown',e=>{if(box.hidden)return;if(e.key==='Escape'){box.hidden=true;document.body.style.overflow='';}if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);});
  };
  const openViewer = images => { if(!images.length)return; ensureViewer(); const box=document.getElementById('intlFishViewer'); gallery=images;galleryIndex=0;const img=box.querySelector('.fish-gallery__image');img.src=gallery[0];box.querySelector('.fish-gallery__counter').textContent=`1 / ${gallery.length}`;box.querySelector('.fish-gallery__prev').hidden=gallery.length<2;box.querySelector('.fish-gallery__next').hidden=gallery.length<2;box.hidden=false;document.body.style.overflow='hidden'; };

  const details = p => [
    [labels.family,categoryNames[p.category]], [labels.type, p.type.replace('White / semi-fat',lang==='fr'?labels.whiteType:'White / semi-fat').replace('Blue / oily',lang==='fr'?labels.blueType:'Blue / oily')],
    [labels.state,p.condition.map(x=>x==='FRESH'?labels.fresh:labels.frozen).join(' / ')],[labels.origin,p.origin],[labels.fao,p.fao],[labels.calibre,labels.according],[labels.quality,lang==='fr'?'Spécification professionnelle':'Professional specification'],[labels.presentation,lang==='fr'?'Selon destination':'According to destination'],[labels.packaging,lang==='fr'?'Selon marché':'According to market'],[labels.availability,labels.according]
  ].map(([k,v])=>`<div class="fish-catalog-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('');

  const renderEmblematic = () => {
    const target=document.getElementById('fishEmblematicGrid'); if(!target)return;
    const title=target.closest('.fish-emblematic')?.querySelector('#fishEmblematicTitle'); if(title) title.innerHTML=`${esc(labels.exceptional).replace('\n','<br>')}`;
    target.closest('.fish-emblematic')?.querySelector('.fish-emblematic__intro p')?.replaceChildren(document.createTextNode(labels.emblemNote));
    target.innerHTML=emblematic.map((p,i)=>{ const name=lang==='fr'?p.fr:p.en; const images=imageMap[p.id]||[]; const image=images[0]||''; return `<article class="fish-emblematic-card"><div class="fish-emblematic-card__media${image?' fish-emblematic-card__media--image':''}" data-images='${esc(JSON.stringify(images))}'>${image?`<img src="${esc(image)}" alt="${esc(name)}" loading="lazy" draggable="false">`:'<span>EMPERIO TISS</span>'}${image?`<span class="fish-emblematic-card__zoom-label">${labels.zoom}</span>`:''}</div><div class="fish-emblematic-card__body"><span class="fish-emblematic-card__kicker">0${i+1} / ${labels.emblem}</span><h3>${esc(name)}</h3><p class="fish-emblematic-card__scientific"><em>${esc(p.scientific)}</em></p><div class="fish-emblematic-card__meta"><span>${esc(categoryNames[p.cat])}</span><span>${esc(lang==='fr'?'Méditerranée':'Mediterranean')}</span></div><p class="fish-emblematic-card__note">${esc(lang==='fr'?'Frais · selon disponibilité':'Fresh · according to availability')}</p><span class="fish-emblematic-card__mark">${labels.professional}</span></div></article>`; }).join('');
    target.querySelectorAll('.fish-emblematic-card__media').forEach(media=>{const images=JSON.parse(media.dataset.images||'[]');if(images.length)media.addEventListener('click',()=>openViewer(images));});
  };

  const render = () => {
    const q=String(search.value||'').trim().toLowerCase();
    const visible=products.filter(p=>{
      const cOk=condition==='all'||p.condition.includes(condition);
      const catOk=category==='all'||p.category===category;
      const hay=[p.name,p.scientific,p.type,p.origin,p.fao,categoryNames[p.category]].join(' ').toLowerCase();
      return cOk&&catOk&&(!q||hay.includes(q));
    });
    count.textContent=`${visible.length} ${visible.length===1?labels.ref:labels.refs}`;
    grid.innerHTML=visible.length?visible.map(p=>{const images=imageMap[p.id]||[];const img=images[0]||'';return `<article class="fish-catalog-card" data-product-id="${esc(p.id)}"><div class="fish-catalog-card__media" data-images='${esc(JSON.stringify(images))}'>${img?`<img class="fish-card-image" src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" draggable="false">`:'<span>EMPERIO TISS</span>'}${images.length>1?'<button class="fish-card-nav fish-card-nav--prev" type="button">‹</button><button class="fish-card-nav fish-card-nav--next" type="button">›</button><span class="fish-card-counter">1 / '+images.length+'</span>':''}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(categoryNames[p.category])}</p><h3 class="fish-catalog-card__title">${esc(p.name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(p.scientific)}</em></p><div class="fish-catalog-card__details">${details(p)}</div></div></article>`;}).join(''):`<p class="fish-catalog__empty">${labels.none}</p>`;
    grid.querySelectorAll('.fish-catalog-card__media').forEach(media=>{const images=JSON.parse(media.dataset.images||'[]');if(!images.length)return;let current=0;const img=media.querySelector('.fish-card-image'),counterEl=media.querySelector('.fish-card-counter');const show=i=>{current=(i+images.length)%images.length;if(img)img.src=images[current];if(counterEl)counterEl.textContent=`${current+1} / ${images.length}`;};media.querySelector('.fish-card-nav--prev')?.addEventListener('click',e=>{e.stopPropagation();show(current-1)});media.querySelector('.fish-card-nav--next')?.addEventListener('click',e=>{e.stopPropagation();show(current+1)});media.addEventListener('click',e=>{if(!e.target.closest('.fish-card-nav'))openViewer(images);});});
  };

  document.querySelectorAll('[data-fish-filter]').forEach(b=>b.addEventListener('click',()=>{condition=b.dataset.fishFilter||'all';document.querySelectorAll('[data-fish-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  document.querySelectorAll('[data-fish-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.fishCategory||'all';document.querySelectorAll('[data-fish-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  search.addEventListener('input',render);
  fetch('/assets/data/product-images.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(d=>{imageMap=d||{};renderEmblematic();render();}).catch(()=>{renderEmblematic();render();});
})();
