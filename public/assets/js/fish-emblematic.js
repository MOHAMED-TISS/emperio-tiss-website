(() => {
  'use strict';

  /* Shared responsive Fish catalogue UI system.
     Loaded by every Fish catalogue page, including Arabic where the
     editorial stylesheet is intentionally not used. Keep this scoped to
     Fish catalogue/gallery components so other site sections are untouched. */
  if (!document.getElementById('fish-catalog-responsive-system')) {
    const style = document.createElement('style');
    style.id = 'fish-catalog-responsive-system';
    style.textContent = `
      .fish-catalog-grid,
      .fish-catalog-card,
      .fish-catalog-card__gallery,
      .fish-catalog-card__media { box-sizing: border-box; }

      .fish-catalog-card__media {
        position: relative;
        isolation: isolate;
      }

      .fish-catalog-card__media .fish-card-image {
        position: relative;
        z-index: 1;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        object-fit: cover;
      }

      .fish-card-nav {
        position: absolute;
        top: 50%;
        z-index: 5;
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        margin: 0;
        padding: 0;
        border: 1px solid rgba(243,239,230,.62);
        border-radius: 50%;
        background: rgba(7,30,53,.84);
        color: #f3efe6;
        box-shadow: 0 8px 20px rgba(0,0,0,.18);
        transform: translateY(-50%);
        cursor: pointer;
        pointer-events: auto;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        font: 400 24px/1 "DM Sans", Arial, sans-serif;
      }

      .fish-card-nav:hover,
      .fish-card-nav:focus-visible {
        background: #071e35;
        border-color: #c7a260;
        color: #f3efe6;
        outline: none;
      }

      .fish-card-nav:active { transform: translateY(-50%) scale(.96); }
      .fish-card-nav--prev { left: 10px; }
      .fish-card-nav--next { right: 10px; }

      .fish-card-counter {
        position: absolute;
        left: 50%;
        bottom: 10px;
        z-index: 5;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 28px;
        max-width: calc(100% - 120px);
        padding: 0 10px;
        border: 1px solid rgba(243,239,230,.28);
        border-radius: 999px;
        background: rgba(7,30,53,.72);
        color: #f3efe6;
        transform: translateX(-50%);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        pointer-events: none;
        font: 600 10px/1 "DM Sans", Arial, sans-serif;
        letter-spacing: .08em;
      }

      .fish-catalog__toolbar { box-sizing: border-box; }
      .fish-catalog__filters { min-width: 0; }
      .fish-catalog__filter { flex: 0 0 auto; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

      .fish-catalog-card__link,
      .fish-catalog .hero-cta,
      .fish-catalog .catalog-cta,
      .fish-catalog .view-catalog { max-width: 100%; box-sizing: border-box; }

      .fish-gallery {
        z-index: 10000 !important;
        box-sizing: border-box;
        overscroll-behavior: contain;
      }

      .fish-gallery__panel {
        position: relative;
        z-index: 1;
        box-sizing: border-box;
      }

      .fish-gallery button {
        z-index: 10 !important;
        box-sizing: border-box;
        min-width: 44px;
        min-height: 44px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      .fish-gallery__image {
        position: relative;
        z-index: 1;
      }

      @media (max-width: 760px) {
        .fish-catalog { overflow: visible; }

        .fish-catalog-grid {
          grid-template-columns: 1fr !important;
          gap: 14px !important;
        }

        .fish-catalog-card {
          min-width: 0;
          width: 100%;
          transform: none;
        }

        .fish-catalog-card:hover {
          transform: none;
        }

        .fish-catalog-card__gallery {
          margin: 6px !important;
          border-radius: 11px;
        }

        .fish-catalog-card__media {
          width: 100%;
          min-height: 0;
          aspect-ratio: 16 / 10 !important;
          border-radius: 11px;
        }

        .fish-catalog-card__body {
          min-width: 0;
          padding: 1rem 1rem 1.15rem !important;
          gap: .55rem;
        }

        .fish-catalog-card__title {
          font-size: clamp(1.35rem, 6vw, 1.9rem) !important;
          line-height: 1.04 !important;
          overflow-wrap: anywhere;
        }

        .fish-catalog-card__scientific { font-size: .8rem; line-height: 1.45; }

        .fish-catalog-card__meta {
          gap: .55rem;
          flex-wrap: wrap;
          min-width: 0;
        }

        .fish-card-nav {
          width: 46px;
          height: 46px;
          top: 50%;
          font-size: 25px;
          box-shadow: 0 8px 18px rgba(0,0,0,.2);
        }

        .fish-card-nav--prev { left: 9px; }
        .fish-card-nav--next { right: 9px; }

        .fish-card-counter {
          bottom: 9px;
          min-height: 29px;
          padding: 0 10px;
        }

        .fish-catalog-card__thumbs {
          display: flex;
          flex-wrap: nowrap;
          gap: 7px;
          max-width: 100%;
          overflow-x: auto;
          padding: 7px !important;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
        }

        .fish-catalog-card__thumbs::-webkit-scrollbar { display: none; }
        .fish-catalog-card__thumb { flex: 0 0 auto; }

        .fish-catalog__toolbar {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
          padding: 14px !important;
          border-radius: 12px !important;
        }

        .fish-catalog__search {
          width: 100% !important;
          min-width: 0 !important;
          min-height: 48px;
          box-sizing: border-box;
        }

        .fish-catalog__filters {
          display: flex;
          flex-wrap: nowrap;
          gap: 8px !important;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 2px 2px 4px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scroll-snap-type: x proximity;
        }

        .fish-catalog__filters::-webkit-scrollbar { display: none; }

        .fish-catalog__filter {
          min-height: 46px;
          min-width: max-content;
          padding: .72rem 1rem !important;
          scroll-snap-align: start;
          white-space: nowrap;
        }

        .fish-catalog-card__link,
        .fish-catalog .hero-cta,
        .fish-catalog .catalog-cta,
        .fish-catalog .view-catalog {
          min-height: 48px !important;
          padding: .78rem 1rem !important;
          width: fit-content;
          max-width: 100%;
          white-space: normal;
          text-align: center;
        }

        .fish-catalog-pilot .seafood-category-nav {
          position: relative;
          isolation: isolate;
          box-sizing: border-box;
        }

        .fish-catalog-pilot .seafood-category-nav__links {
          display: flex;
          flex-wrap: nowrap;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
          overscroll-behavior-x: contain;
        }

        .fish-catalog-pilot .seafood-category-nav__links::-webkit-scrollbar { display: none; }

        .fish-catalog-pilot .seafood-category-nav__links a {
          flex: 0 0 auto;
          min-height: 48px;
          scroll-snap-align: start;
          touch-action: manipulation;
        }

        .fish-catalog-pilot .fish-scroll-cue {
          max-width: 100%;
          white-space: normal;
          text-align: center;
          box-sizing: border-box;
        }

        .fish-emblematic__intro h2,
        .fish-emblematic__intro h2 span {
          white-space: normal !important;
          overflow-wrap: anywhere;
        }

        .fish-emblematic-card {
          min-width: 0;
        }

        .fish-emblematic-card__media--image {
          min-height: 0 !important;
        }

        .fish-emblematic-card__body {
          min-height: auto !important;
          padding: 1rem 1.1rem 1.25rem !important;
        }

        .fish-emblematic-card h3 {
          font-size: clamp(1.8rem, 8vw, 2.55rem) !important;
          line-height: .98 !important;
        }

        .fish-emblematic-card__meta {
          flex-wrap: wrap;
        }

        .fish-gallery {
          inset: 0 !important;
          width: 100vw !important;
          height: 100dvh !important;
          padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left)) !important;
          overflow: hidden !important;
          touch-action: none;
        }

        .fish-gallery__panel {
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          max-height: none !important;
        }

        .fish-gallery__image {
          max-width: calc(100vw - 74px) !important;
          max-height: calc(100dvh - 132px) !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
        }

        .fish-gallery button {
          width: 48px !important;
          height: 48px !important;
          font-size: 27px !important;
          background: rgba(7,30,53,.86) !important;
        }

        .fish-gallery__prev { left: max(8px, env(safe-area-inset-left)) !important; top: 50% !important; }
        .fish-gallery__next { right: max(8px, env(safe-area-inset-right)) !important; top: 50% !important; }
        .fish-gallery__close { top: max(8px, env(safe-area-inset-top)) !important; right: max(8px, env(safe-area-inset-right)) !important; }

        .fish-gallery__counter {
          bottom: max(12px, env(safe-area-inset-bottom)) !important;
          max-width: calc(100vw - 112px) !important;
        }
      }

      @media (max-width: 430px) {
        .fish-catalog-pilot .page-hero-inner,
        .fish-catalog-pilot .fish-emblematic__inner,
        .fish-catalog-pilot .fish-catalog__inner {
          width: calc(100% - 24px) !important;
        }

        .fish-catalog-card__media { aspect-ratio: 4 / 3 !important; }
        .fish-card-nav { width: 44px; height: 44px; }
        .fish-card-nav--prev { left: 7px; }
        .fish-card-nav--next { right: 7px; }

        .fish-catalog__filter { min-height: 44px; padding-inline: .9rem !important; }

        .fish-gallery__image {
          max-width: calc(100vw - 64px) !important;
          max-height: calc(100dvh - 126px) !important;
        }

        .fish-gallery button {
          width: 44px !important;
          height: 44px !important;
          font-size: 25px !important;
        }
      }

      @media (hover: none) {
        .fish-card-nav:hover,
        .fish-catalog-card:hover,
        .fish-catalog-card__link:hover,
        .fish-catalog .hero-cta:hover,
        .fish-catalog .catalog-cta:hover,
        .fish-catalog .view-catalog:hover { transform: none !important; }
      }

      [dir="rtl"] .fish-card-nav--prev { right: 9px; left: auto; }
      [dir="rtl"] .fish-card-nav--next { left: 9px; right: auto; }
      [dir="rtl"] .fish-gallery__prev { right: 10px; left: auto; }
      [dir="rtl"] .fish-gallery__next { left: 10px; right: auto; }

      @media (max-width: 760px) {
        [dir="rtl"] .fish-catalog-pilot .seafood-category-nav__links a,
        [dir="rtl"] .fish-catalog__filter { scroll-snap-align: end; }
        [dir="rtl"] .fish-card-nav--prev { right: 7px; left: auto; }
        [dir="rtl"] .fish-card-nav--next { left: 7px; right: auto; }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

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