(() => {
  'use strict';
  const root=document.documentElement;
  const lang=(root.lang||'es').slice(0,2).toLowerCase();
  const grid=document.getElementById('fishEmblematicGrid');
  if(!grid)return;

  const copy={
    es:{market:'Mercado español',note:'Referencia fresca de suministro mediterráneo/atlántico según disponibilidad.',mark:'Referencia profesional',title:'<span>Algunas referencias</span><span><em>excepcionales.</em></span>',intro:'Una selección fresca antes de entrar en el catálogo operativo de pescados.',zoom:'Ver imagen'},
    en:{market:'English-speaking market',note:'Fresh Mediterranean/Atlantic supply reference, subject to availability.',mark:'Professional reference',title:'<span>A few</span><span><em>exceptional references.</em></span>',intro:'A fresh Mediterranean/Atlantic selection before the working fish catalogue.',zoom:'View image'},
    fr:{market:'Marché français',note:'Référence fraîche issue de l’approvisionnement méditerranéen/atlantique selon disponibilité.',mark:'Référence professionnelle',title:'<span>Quelques</span><span><em>références exceptionnelles.</em></span>',intro:'Une sélection fraîche méditerranéenne/atlantique avant le catalogue opérationnel.',zoom:"Voir l’image"},
    it:{market:'Mercato italiano',note:'Referenza fresca da approvvigionamento mediterraneo/atlantico secondo disponibilità.',mark:'Referenza professionale',title:'<span>Referenze core</span><span><em>per il mercato italiano.</em></span>',intro:'Una selezione fresca mediterranea/atlantica delle referenze prioritarie per il mercato italiano.',zoom:'Vedi immagine'}
  }[lang]||{};

  const names={
    dorada:{es:'Dorada',en:'Sea bream',fr:'Daurade royale',it:'Orata'},
    lubina:{es:'Lubina',en:'Sea bass',fr:'Bar',it:'Branzino'},
    'merluza-pijota':{es:'Merluza / Pijota',en:'Hake',fr:'Merlu',it:'Nasello'},
    atun:{es:'Atún rojo',en:'Bluefin tuna',fr:'Thon rouge',it:'Tonno rosso'},
    sardina:{es:'Sardina',en:'European sardine',fr:'Sardine',it:'Sardina'},
    caballa:{es:'Caballa',en:'Mackerel',fr:'Maquereau',it:'Sgombro'},
    'pez-limon':{es:'Pez limón / Seriola',en:'Greater amberjack',fr:'Sériole couronnée',it:'Ricciola'}
  };
  const scientific={dorada:'Sparus aurata',lubina:'Dicentrarchus labrax','merluza-pijota':'Merluccius merluccius',atun:'Thunnus thynnus',sardina:'Sardina pilchardus',caballa:'Scomber colias','pez-limon':'Seriola dumerili'};
  const category={dorada:'white',lubina:'white','merluza-pijota':'white',atun:'blue',sardina:'blue',caballa:'blue','pez-limon':'blue'};
  const categoryLabel={
    es:{white:'Pez blanco',blue:'Pez azul'},
    en:{white:'White fish',blue:'Blue fish'},
    fr:{white:'Poisson blanc',blue:'Poisson bleu'},
    it:{white:'Pesce bianco',blue:'Pesce azzurro'}
  }[lang]||{};
  const selected={
    es:['dorada','lubina','merluza-pijota'],
    en:['atun','merluza-pijota','lubina'],
    fr:['merluza-pijota','dorada','sardina'],
    it:['lubina','dorada','pez-limon']
  }[lang]||['dorada','lubina','merluza-pijota'];
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  let imageMap={};
  let viewer=null,viewerImage=null,viewerCounter=null,gallery=[],index=0;
  const ensureViewer=()=>{
    if(viewer)return;
    viewer=document.createElement('div');
    viewer.className='fish-gallery fish-emblematic-gallery';
    viewer.hidden=true;
    viewer.innerHTML='<div class="fish-gallery__panel"><img class="fish-gallery__image" alt="" draggable="false"><button class="fish-gallery__prev" type="button" aria-label="Previous">‹</button><button class="fish-gallery__next" type="button" aria-label="Next">›</button><button class="fish-gallery__close" type="button" aria-label="Close">×</button><span class="fish-gallery__counter"></span></div>';
    document.body.appendChild(viewer);
    viewerImage=viewer.querySelector('.fish-gallery__image');
    viewerCounter=viewer.querySelector('.fish-gallery__counter');
    viewer.querySelector('.fish-gallery__prev').onclick=()=>move(-1);
    viewer.querySelector('.fish-gallery__next').onclick=()=>move(1);
    viewer.querySelector('.fish-gallery__close').onclick=close;
    viewer.onclick=e=>{if(e.target===viewer)close()};
    document.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
  };
  const update=()=>{viewerImage.src=gallery[index];viewerCounter.textContent=`${index+1} / ${gallery.length}`;viewer.querySelector('.fish-gallery__prev').hidden=gallery.length<2;viewer.querySelector('.fish-gallery__next').hidden=gallery.length<2};
  const open=imgs=>{if(!imgs.length)return;ensureViewer();gallery=imgs;index=0;viewer.hidden=false;document.body.style.overflow='hidden';update()};
  const close=()=>{if(!viewer)return;viewer.hidden=true;document.body.style.overflow='';viewerImage.removeAttribute('src')};
  const move=step=>{if(gallery.length<2)return;index=(index+step+gallery.length)%gallery.length;update()};
  const protect=()=>document.querySelectorAll('img').forEach(img=>{img.setAttribute('draggable','false');img.setAttribute('oncontextmenu','return false');img.setAttribute('ondragstart','return false');img.style.userSelect='none';img.style.webkitUserDrag='none';img.style.webkitTouchCallout='none'});

  const render=()=>{
    const section=grid.closest('.fish-emblematic');
    const title=section?.querySelector('#fishEmblematicTitle');
    const intro=section?.querySelector('.fish-emblematic__intro p');
    if(title)title.innerHTML=copy.title;
    if(intro)intro.textContent=copy.intro;
    grid.innerHTML=selected.map((id,i)=>{
      const name=(names[id]||{})[lang]||(names[id]||{}).es||id;
      const cat=category[id]||'special';
      const imgs=Array.from(new Set(Array.isArray(imageMap[id])?imageMap[id].filter(Boolean):[]));
      const image=imgs[0]||'';
      return `<article class="fish-emblematic-card" data-product-id="${esc(id)}"><div class="fish-emblematic-card__media${image?' fish-emblematic-card__media--image':''}" data-images='${esc(JSON.stringify(imgs))}'>${image?`<button type="button" class="fish-emblematic-card__image-button" aria-label="${esc(copy.zoom)} — ${esc(name)}"><img src="${esc(image)}" alt="${esc(name)}" loading="lazy" draggable="false"></button><span class="fish-emblematic-card__zoom-label">${esc(copy.zoom)}</span>`:'<span>EMPERIO TISS</span>'}</div><div class="fish-emblematic-card__body"><span class="fish-emblematic-card__kicker">0${i+1} / SELECCIÓN</span><h3>${esc(name)}</h3><p class="fish-emblematic-card__scientific"><em>${esc(scientific[id]||'')}</em></p><div class="fish-emblematic-card__meta"><span>${esc(categoryLabel[cat]||cat)}</span><span>${esc(copy.market)}</span></div><p class="fish-emblematic-card__note">${esc(copy.note)}</p><span class="fish-emblematic-card__mark">${esc(copy.mark)}</span></div></article>`;
    }).join('');
    grid.querySelectorAll('.fish-emblematic-card__image-button').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(JSON.parse(btn.closest('.fish-emblematic-card__media').dataset.images||'[]'))}));
    protect();
  };
  protect();
  document.addEventListener('contextmenu',e=>{if(e.target.closest('img'))e.preventDefault()},true);
  document.addEventListener('dragstart',e=>{if(e.target.closest('img'))e.preventDefault()},true);
  document.addEventListener('selectstart',e=>{if(e.target.closest('img'))e.preventDefault()},true);
  new MutationObserver(protect).observe(document.documentElement,{childList:true,subtree:true});
  fetch('/assets/data/product-images.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(images=>{imageMap=images||{};render()}).catch(()=>render());
})();