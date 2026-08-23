(() => {
  'use strict';
  const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;

  const labels = lang === 'fr' ? {
    all:'Toutes', fresh:'Frais', frozen:'Congelé', allCats:'Toutes les catégories', white:'Poisson blanc', blue:'Poisson bleu', special:'Poissons spéciaux', refs:'références', ref:'référence', none:'Aucune référence ne correspond à votre recherche.', family:'Famille', type:'Type', state:'État', origin:'Origine', fao:'Zone FAO', calibre:'Calibre', quality:'Qualité', presentation:'Présentation', packaging:'Conditionnement', availability:'Disponibilité', emblem:'SÉLECTION EMBLÉMATIQUE', emblemNote:'Une sélection adaptée au marché français à partir des références actuellement proposées.', zoom:'Voir l’image', professional:'Référence professionnelle', according:'Selon disponibilité'
  } : {
    all:'All', fresh:'Fresh', frozen:'Frozen', allCats:'All categories', white:'White fish', blue:'Blue fish', special:'Special fish', refs:'references', ref:'reference', none:'No references match your search.', family:'Family', type:'Type', state:'Condition', origin:'Origin', fao:'FAO area', calibre:'Calibre', quality:'Quality', presentation:'Presentation', packaging:'Packaging', availability:'Availability', emblem:'EMBLEMATIC SELECTION', emblemNote:'A market-led selection for English-speaking buyers, using the references currently offered.', zoom:'View image', professional:'Professional reference', according:'According to availability'
  };

  const products = [
    ['dorada',{en:'Sea bream',fr:'Daurade royale'},'Sparus aurata','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['lubina',{en:'Sea bass',fr:'Bar'},'Dicentrarchus labrax','white','White / semi-fat','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['merluza-pijota',{en:'Hake',fr:'Merlu'},'Merluccius spp.','white','White / semi-fat','FRESH','According to supply programme','According to origin'],
    ['mujol',{en:'Mullet',fr:'Mulet'},'Mugil cephalus','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['rape',{en:'Monkfish',fr:'Baudroie'},'Lophius spp.','white','White / semi-fat','FRESH','Atlantic / Mediterranean according to availability','FAO 27 / FAO 37'],
    ['san-pedro',{en:'John Dory',fr:'Saint-Pierre'},'Zeus faber','white','White / semi-fat','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['mero-amarillo',{en:'Yellow grouper',fr:'Mérou jaune'},'Epinephelus spp.','white','White / semi-fat','FRESH','According to origin available','According to origin'],
    ['pargo',{en:'Snapper',fr:'Vivaneau'},'Lutjanus spp.','white','White / semi-fat','FRESH','According to supply programme','According to origin'],
    ['denton',{en:'Dentex',fr:'Denté'},'Dentex dentex','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['sama',{en:'Sama',fr:'Sama'},'Dentex spp.','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['sargo',{en:'White seabream',fr:'Sar commun'},'Diplodus spp.','white','White / semi-fat','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['rascacio',{en:'Scorpionfish',fr:'Rascasse'},'Scorpaena spp.','white','White / semi-fat','FRESH','Mediterranean / according to availability','FAO 37'],
    ['caballa',{en:'Mackerel',fr:'Maquereau'},'Scomber spp.','blue','Blue / oily','FRESH|FROZEN','Atlantic / Mediterranean according to availability','FAO 27 / FAO 37'],
    ['salmonete',{en:'Red mullet',fr:'Rouget'},'Mullus spp.','blue','Blue / oily','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['atun',{en:'Tuna',fr:'Thon'},'Thunnus spp.','blue','Blue / oily','FRESH','According to species and supply programme','According to origin'],
    ['salmon',{en:'Salmon',fr:'Saumon'},'Salmo salar','blue','Blue / oily','FRESH|FROZEN','Norway','FAO 27'],
    ['pez-limon',{en:'Greater amberjack',fr:'Sériole couronnée'},'Seriola dumerili','blue','Blue / oily','FRESH','Mediterranean / according to availability','FAO 37'],
    ['boqueron',{en:'Anchovy',fr:'Anchois'},'Engraulis encrasicolus','blue','Blue / oily','FRESH','Mediterranean / Atlantic according to availability','FAO 27 / FAO 37'],
    ['pez-sable',{en:'Cutlassfish',fr:'Sabre'},'Trichiurus spp.','special','Special','FRESH','According to supply programme','According to origin'],
    ['pez-espada',{en:'Swordfish',fr:'Espadon'},'Xiphias gladius','special','Special','FRESH','According to supply programme','According to origin']
  ].map(([id,names,scientific,category,type,condition,origin,fao]) => ({id,names,scientific,category,type,condition:condition.split('|'),origin,fao,name:names[lang]}));

  const categoryNames = {white:labels.white, blue:labels.blue, special:labels.special};
  const emblematic = lang === 'fr' ? [
    {id:'salmon', name:'Saumon', scientific:'Salmo salar', cat:'blue'},
    {id:'merluza-pijota', name:'Merlu', scientific:'Merluccius spp.', cat:'white'},
    {id:'caballa', name:'Maquereau', scientific:'Scomber spp.', cat:'blue'}
  ] : [
    {id:'salmon', name:'Salmon', scientific:'Salmo salar', cat:'blue'},
    {id:'atun', name:'Tuna', scientific:'Thunnus spp.', cat:'blue'},
    {id:'lubina', name:'Sea bass', scientific:'Dicentrarchus labrax', cat:'white'}
  ];

  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let imageMap = {}, condition = 'all', category = 'all', gallery = [], galleryIndex = 0;

  const ensureViewer = () => {
    if (document.getElementById('intlFishViewer')) return;
    const box = document.createElement('div');
    box.id = 'intlFishViewer';
    box.className = 'fish-gallery';
    box.hidden = true;
    box.innerHTML = '<div class="fish-gallery__panel"><img class="fish-gallery__image" alt="" draggable="false"><button class="fish-gallery__prev" type="button" aria-label="Previous">‹</button><button class="fish-gallery__next" type="button" aria-label="Next">›</button><button class="fish-gallery__close" type="button" aria-label="Close">×</button><span class="fish-gallery__counter"></span></div>';
    document.body.appendChild(box);
    const img = box.querySelector('.fish-gallery__image');
    const counter = box.querySelector('.fish-gallery__counter');
    const move = step => {
      if (gallery.length < 2) return;
      galleryIndex = (galleryIndex + step + gallery.length) % gallery.length;
      img.src = gallery[galleryIndex];
      counter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
    };
    box.querySelector('.fish-gallery__prev').onclick = () => move(-1);
    box.querySelector('.fish-gallery__next').onclick = () => move(1);
    box.querySelector('.fish-gallery__close').onclick = () => { box.hidden = true; document.body.style.overflow = ''; };
    box.onclick = e => { if (e.target === box) { box.hidden = true; document.body.style.overflow = ''; } };
    document.addEventListener('keydown', e => {
      if (box.hidden) return;
      if (e.key === 'Escape') { box.hidden = true; document.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    });
  };

  const openViewer = images => {
    if (!images.length) return;
    ensureViewer();
    const box = document.getElementById('intlFishViewer');
    gallery = images;
    galleryIndex = 0;
    const img = box.querySelector('.fish-gallery__image');
    img.src = gallery[0];
    box.querySelector('.fish-gallery__counter').textContent = `1 / ${gallery.length}`;
    box.querySelector('.fish-gallery__prev').hidden = gallery.length < 2;
    box.querySelector('.fish-gallery__next').hidden = gallery.length < 2;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const details = p => [
    [labels.family,categoryNames[p.category]],
    [labels.type,p.type],
    [labels.state,p.condition.map(x => x === 'FRESH' ? labels.fresh : labels.frozen).join(' / ')],
    [labels.origin,p.origin],
    [labels.fao,p.fao],
    [labels.calibre,labels.according],
    [labels.quality,lang === 'fr' ? 'Spécification professionnelle' : 'Professional specification'],
    [labels.presentation,lang === 'fr' ? 'Selon destination' : 'According to destination'],
    [labels.packaging,lang === 'fr' ? 'Selon marché' : 'According to market'],
    [labels.availability,labels.according]
  ].map(([k,v]) => `<div class="fish-catalog-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('');

  const bindMedia = (media, images) => {
    if (!images.length) return;
    const imageButton = media.querySelector('.fish-card-image-button');
    const image = media.querySelector('.fish-card-image');
    let current = 0;
    const counter = media.querySelector('.fish-card-counter');
    const show = index => {
      current = (index + images.length) % images.length;
      if (image) image.src = images[current];
      if (counter) counter.textContent = `${current + 1} / ${images.length}`;
    };
    media.querySelector('.fish-card-nav--prev')?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); show(current - 1); });
    media.querySelector('.fish-card-nav--next')?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); show(current + 1); });
    imageButton?.addEventListener('click', e => { e.preventDefault(); openViewer(images); });
    media.addEventListener('click', e => {
      if (e.target.closest('.fish-card-nav') || e.target.closest('.fish-card-image-button')) return;
      openViewer(images);
    });
  };

  const renderEmblematic = () => {
    const target = document.getElementById('fishEmblematicGrid');
    if (!target) return;
    target.closest('.fish-emblematic')?.querySelector('.fish-emblematic__intro p')?.replaceChildren(document.createTextNode(labels.emblemNote));
    target.innerHTML = emblematic.map((p,i) => {
      const images = imageMap[p.id] || [];
      const image = images[0] || '';
      return `<article class="fish-emblematic-card" data-product-id="${esc(p.id)}"><div class="fish-emblematic-card__media${image ? ' fish-emblematic-card__media--image' : ''}" data-images='${esc(JSON.stringify(images))}'>${image ? `<button type="button" class="fish-emblematic-card__image-button" aria-label="${esc(labels.zoom)} — ${esc(p.name)}"><img src="${esc(image)}" alt="${esc(p.name)}" loading="lazy" draggable="false"></button>` : '<span>EMPERIO TISS</span>'}${image ? `<span class="fish-emblematic-card__zoom-label">${labels.zoom}</span>` : ''}</div><div class="fish-emblematic-card__body"><span class="fish-emblematic-card__kicker">0${i+1} / ${labels.emblem}</span><h3>${esc(p.name)}</h3><p class="fish-emblematic-card__scientific"><em>${esc(p.scientific)}</em></p><div class="fish-emblematic-card__meta"><span>${esc(categoryNames[p.cat])}</span><span>${esc(lang === 'fr' ? 'Marché français' : 'English-speaking market')}</span></div><p class="fish-emblematic-card__note">${esc(lang === 'fr' ? 'Selon disponibilité · frais ou congelé selon référence' : 'According to availability · fresh or frozen by reference')}</p><span class="fish-emblematic-card__mark">${labels.professional}</span></div></article>`;
    }).join('');
    target.querySelectorAll('.fish-emblematic-card__media--image').forEach(media => {
      const images = JSON.parse(media.dataset.images || '[]');
      const button = media.querySelector('.fish-emblematic-card__image-button');
      button?.addEventListener('click', e => { e.preventDefault(); openViewer(images); });
      media.style.cursor = images.length ? 'zoom-in' : '';
    });
  };

  const render = () => {
    const q = String(search.value || '').trim().toLowerCase();
    const visible = products.filter(p => {
      const cOk = condition === 'all' || p.condition.includes(condition);
      const catOk = category === 'all' || p.category === category;
      const hay = [p.name,p.names.en,p.names.fr,p.scientific,p.type,p.origin,p.fao,categoryNames[p.category]].join(' ').toLowerCase();
      return cOk && catOk && (!q || hay.includes(q));
    });
    count.textContent = `${visible.length} ${visible.length === 1 ? labels.ref : labels.refs}`;
    grid.innerHTML = visible.length ? visible.map(p => {
      const images = imageMap[p.id] || [];
      const img = images[0] || '';
      return `<article class="fish-catalog-card" data-product-id="${esc(p.id)}"><div class="fish-catalog-card__media" data-images='${esc(JSON.stringify(images))}'>${img ? `<button type="button" class="fish-card-image-button" aria-label="${esc(labels.zoom)} — ${esc(p.name)}"><img class="fish-card-image" src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" draggable="false"></button>` : '<span>EMPERIO TISS</span>'}${images.length > 1 ? `<button class="fish-card-nav fish-card-nav--prev" type="button" aria-label="Previous image">‹</button><button class="fish-card-nav fish-card-nav--next" type="button" aria-label="Next image">›</button><span class="fish-card-counter">1 / ${images.length}</span>` : ''}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(categoryNames[p.category])}</p><h3 class="fish-catalog-card__title">${esc(p.name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(p.scientific)}</em></p><div class="fish-catalog-card__details">${details(p)}</div></div></article>`;
    }).join('') : `<p class="fish-catalog__empty">${labels.none}</p>`;

    grid.querySelectorAll('.fish-catalog-card__media').forEach(media => {
      const images = JSON.parse(media.dataset.images || '[]');
      bindMedia(media, images);
    });
  };

  document.querySelectorAll('[data-fish-filter]').forEach(b => b.addEventListener('click', () => {
    condition = b.dataset.fishFilter || 'all';
    document.querySelectorAll('[data-fish-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));
  document.querySelectorAll('[data-fish-category]').forEach(b => b.addEventListener('click', () => {
    category = b.dataset.fishCategory || 'all';
    document.querySelectorAll('[data-fish-category]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));
  search.addEventListener('input', render);
  fetch('/assets/data/product-images.json', {cache:'no-cache'})
    .then(r => r.ok ? r.json() : {})
    .then(d => { imageMap = d || {}; renderEmblematic(); render(); })
    .catch(() => { renderEmblematic(); render(); });
})();
