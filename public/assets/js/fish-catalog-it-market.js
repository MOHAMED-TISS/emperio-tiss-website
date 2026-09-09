(() => {
  'use strict';
  const doc = document;
  const grid = doc.getElementById('fishEmblematicGrid');
  if (!grid) return;

  const items = [
    { id: 'lubina', name: 'Spigola', scientific: 'Dicentrarchus labrax', category: 'Pesce bianco', note: 'Domanda strutturale in Italia · fresco · secondo disponibilità' },
    { id: 'dorada', name: 'Orata', scientific: 'Sparus aurata', category: 'Pesce bianco', note: 'Referenza core del mercato italiano · fresco · calibro secondo destinazione' },
    { id: 'pez-limon', name: 'Ricciola', scientific: 'Seriola dumerili', category: 'Pesce azzurro', note: 'Posizionamento premium · fresco · Mediterraneo secondo disponibilità' }
  ];

  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const naturalImageCompare = (a, b) => {
    const filename = value => String(value || '').split('/').pop().replace(/\.[^.]+$/, '').trim();
    const parse = value => { const match = value.match(/^(.*?)(?:\s*[-_ ]?\(?\s*(\d+)\s*\)?)?$/); return {base:(match?.[1]||value).trim().toLocaleLowerCase(),number:match?.[2]?Number(match[2]):0,hasNumber:!!match?.[2]}; };
    const left=parse(filename(a)), right=parse(filename(b));
    const base=left.base.localeCompare(right.base,undefined,{numeric:true,sensitivity:'base'});
    if(base!==0)return base;
    if(left.hasNumber!==right.hasNumber)return left.hasNumber?1:-1;
    if(left.number!==right.number)return left.number-right.number;
    return filename(a).localeCompare(filename(b),undefined,{numeric:true,sensitivity:'base'});
  };
  const sortImages = images => [...new Set(Array.isArray(images)?images.filter(Boolean):[])].sort(naturalImageCompare);

  let viewer=null, viewerImage=null, viewerCounter=null, viewerPrev=null, viewerNext=null, viewerClose=null, gallery=[], galleryIndex=0;
  const ensureGallery=()=>{
    if(viewer)return;
    viewer=doc.createElement('div');
    viewer.className='it-fish-gallery fish-gallery fish-emblematic-gallery';
    viewer.hidden=true;
    viewer.innerHTML='<div class="fish-gallery__panel"><img class="it-fish-gallery__image fish-gallery__image" alt="" draggable="false"><button class="it-fish-gallery__prev fish-gallery__prev" type="button" aria-label="Immagine precedente">‹</button><button class="it-fish-gallery__next fish-gallery__next" type="button" aria-label="Immagine successiva">›</button><button class="it-fish-gallery__close fish-gallery__close" type="button" aria-label="Chiudi">×</button><span class="it-fish-gallery__counter fish-gallery__counter"></span></div>';
    doc.body.appendChild(viewer);
    viewerImage=viewer.querySelector('.it-fish-gallery__image'); viewerCounter=viewer.querySelector('.it-fish-gallery__counter'); viewerPrev=viewer.querySelector('.it-fish-gallery__prev'); viewerNext=viewer.querySelector('.it-fish-gallery__next'); viewerClose=viewer.querySelector('.it-fish-gallery__close');
    const update=()=>{if(!viewerImage||!gallery.length)return;viewerImage.src=gallery[galleryIndex];viewerCounter.textContent=`${galleryIndex+1} / ${gallery.length}`;viewerPrev.hidden=gallery.length<2;viewerNext.hidden=gallery.length<2;};
    viewerPrev.onclick=()=>{galleryIndex=(galleryIndex-1+gallery.length)%gallery.length;update();};
    viewerNext.onclick=()=>{galleryIndex=(galleryIndex+1)%gallery.length;update();};
    viewerClose.onclick=()=>{viewer.hidden=true;doc.body.style.overflow='';};
    viewer.onclick=e=>{if(e.target===viewer){viewer.hidden=true;doc.body.style.overflow='';}};
    doc.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape'){viewer.hidden=true;doc.body.style.overflow='';}if(e.key==='ArrowLeft'&&gallery.length>1){galleryIndex=(galleryIndex-1+gallery.length)%gallery.length;update();}if(e.key==='ArrowRight'&&gallery.length>1){galleryIndex=(galleryIndex+1)%gallery.length;update();}});
  };
  const openGallery=images=>{if(!images.length)return;ensureGallery();gallery=images;galleryIndex=0;viewer.hidden=false;doc.body.style.overflow='hidden';viewerImage.src=gallery[0];viewerCounter.textContent=`1 / ${gallery.length}`;viewerPrev.hidden=gallery.length<2;viewerNext.hidden=gallery.length<2;};

  const installImageProtection=()=>{
    if(doc.documentElement.dataset.itEmblematicProtection==='true')return;
    doc.documentElement.dataset.itEmblematicProtection='true';
    const protectedTarget=t=>!!t?.closest?.('#fishEmblematicGrid .fish-emblematic-card__media,#fishEmblematicGrid .fish-emblematic-card__media img,#fishEmblematicGrid .fish-emblematic-card__image-button');
    const prevent=e=>{if(protectedTarget(e.target))e.preventDefault();};
    doc.addEventListener('contextmenu',prevent,true);doc.addEventListener('dragstart',prevent,true);doc.addEventListener('selectstart',prevent,true);
    const style=doc.createElement('style');style.dataset.itEmblematicProtection='true';style.textContent='#fishEmblematicGrid .fish-emblematic-card__media img{-webkit-user-drag:none!important;user-select:none!important;pointer-events:none!important}#fishEmblematicGrid .fish-emblematic-card__image-button{cursor:zoom-in!important}';doc.head.appendChild(style);
  };

  const bindImages=()=>grid.querySelectorAll('.fish-emblematic-card__media--image').forEach(media=>{
    const images=sortImages(JSON.parse(media.dataset.images||'[]'));media.dataset.images=JSON.stringify(images);
    const button=media.querySelector('.fish-emblematic-card__image-button');const counter=media.querySelector('.fish-emblematic-card__counter');const image=media.querySelector('img');
    if(!button||!images.length)return;
    button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openGallery(images);});
    media.style.cursor='zoom-in';if(counter)counter.textContent=`1 / ${images.length}`;
    if(image){image.draggable=false;image.setAttribute('draggable','false');image.setAttribute('oncontextmenu','return false');image.setAttribute('ondragstart','return false');image.setAttribute('onselectstart','return false');}
  });

  const render=imageMap=>{
    grid.innerHTML=items.map((item,index)=>{
      const images=sortImages(imageMap[item.id]||[]),image=images[0]||'';
      return `<article class="fish-emblematic-card" data-product-id="${esc(item.id)}"><div class="fish-emblematic-card__media${image?' fish-emblematic-card__media--image':''}" data-images='${esc(JSON.stringify(images))}'>${image?`<button type="button" class="fish-emblematic-card__image-button" aria-label="Vedi immagine — ${esc(item.name)}"><img src="${esc(image)}" alt="${esc(item.name)}" loading="lazy" draggable="false"></button><span class="fish-emblematic-card__zoom-label">Vedi immagine</span><span class="fish-emblematic-card__counter" aria-hidden="true">1 / ${images.length}</span>`:'<span>EMPERIO TISS</span>'}</div><div class="fish-emblematic-card__body"><span class="fish-emblematic-card__kicker">0${index+1} / SELEZIONE EMBLEMATICA</span><h3>${esc(item.name)}</h3><p class="fish-emblematic-card__scientific"><em>${esc(item.scientific)}</em></p><div class="fish-emblematic-card__meta"><span>${esc(item.category)}</span><span>Mercato italiano</span></div><p class="fish-emblematic-card__note">${esc(item.note)}</p><span class="fish-emblematic-card__mark">Referenza professionale</span></div></article>`;
    }).join('');bindImages();
  };

  installImageProtection();
  const intro=grid.closest('.fish-emblematic')?.querySelector('.fish-emblematic__intro p');
  if(intro)intro.textContent='Selezione orientata al mercato italiano, con priorità a referenze ad alta rilevanza commerciale, continuità di fornitura e posizionamento premium.';
  fetch('/assets/data/product-images.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(data=>render(data||{})).catch(()=>render({}));
})();
