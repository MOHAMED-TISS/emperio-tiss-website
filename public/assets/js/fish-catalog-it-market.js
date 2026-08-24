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

  const installImageProtection = () => {
    if (doc.documentElement.dataset.itEmblematicProtection === 'true') return;
    doc.documentElement.dataset.itEmblematicProtection = 'true';

    const isProtectedTarget = target => !!target?.closest?.('#fishEmblematicGrid .fish-emblematic-card__media, #fishEmblematicGrid .fish-emblematic-card__media img, #fishEmblematicGrid .fish-emblematic-card__image-button');
    const prevent = event => {
      if (isProtectedTarget(event.target)) event.preventDefault();
    };

    doc.addEventListener('contextmenu', prevent, true);
    doc.addEventListener('dragstart', prevent, true);
    doc.addEventListener('selectstart', prevent, true);
    doc.addEventListener('mousedown', event => {
      if (isProtectedTarget(event.target)) event.preventDefault();
    }, true);

    const style = doc.createElement('style');
    style.dataset.itEmblematicProtection = 'true';
    style.textContent = `
      #fishEmblematicGrid .fish-emblematic-card__media,
      #fishEmblematicGrid .fish-emblematic-card__media img,
      #fishEmblematicGrid .fish-emblematic-card__image-button {
        -webkit-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      #fishEmblematicGrid .fish-emblematic-card__media img {
        -webkit-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      #fishEmblematicGrid .fish-emblematic-card__image-button {
        cursor: zoom-in !important;
      }
    `;
    doc.head.appendChild(style);
  };

  const openGallery = images => {
    if (!images.length) return;
    const viewer = doc.querySelector('.it-fish-gallery');
    if (!viewer) return;
    const image = viewer.querySelector('.it-fish-gallery__image');
    const counter = viewer.querySelector('.it-fish-gallery__counter');
    const prev = viewer.querySelector('.it-fish-gallery__prev');
    const next = viewer.querySelector('.it-fish-gallery__next');
    const close = viewer.querySelector('.it-fish-gallery__close');
    if (!image) return;

    let index = 0;
    const update = () => {
      image.src = images[index];
      image.draggable = false;
      image.setAttribute('draggable', 'false');
      image.style.userSelect = 'none';
      image.style.webkitUserDrag = 'none';
      if (counter) counter.textContent = `${index + 1} / ${images.length}`;
      if (prev) prev.hidden = images.length < 2;
      if (next) next.hidden = images.length < 2;
    };

    if (prev) prev.onclick = () => { index = (index - 1 + images.length) % images.length; update(); };
    if (next) next.onclick = () => { index = (index + 1) % images.length; update(); };
    if (close) close.onclick = () => { viewer.hidden = true; doc.body.style.overflow = ''; };

    viewer.hidden = false;
    doc.body.style.overflow = 'hidden';
    update();
  };

  const bindImages = () => {
    grid.querySelectorAll('.fish-emblematic-card__media--image').forEach(media => {
      const images = JSON.parse(media.dataset.images || '[]');
      const button = media.querySelector('.fish-emblematic-card__image-button');
      const counter = media.querySelector('.fish-emblematic-card__counter');
      const image = media.querySelector('img');
      if (!button || !images.length || button.dataset.itGalleryBound === 'true') return;

      button.dataset.itGalleryBound = 'true';
      if (image) {
        image.draggable = false;
        image.setAttribute('draggable', 'false');
        image.setAttribute('oncontextmenu', 'return false');
        image.setAttribute('ondragstart', 'return false');
        image.setAttribute('onselectstart', 'return false');
        image.style.userSelect = 'none';
        image.style.webkitUserDrag = 'none';
        image.style.webkitTouchCallout = 'none';
      }

      const blockImageActions = event => {
        event.preventDefault();
        event.stopImmediatePropagation();
      };

      button.addEventListener('contextmenu', blockImageActions, true);
      button.addEventListener('dragstart', blockImageActions, true);
      button.addEventListener('selectstart', blockImageActions, true);
      button.addEventListener('mousedown', event => {
        if (event.button === 2) blockImageActions(event);
      }, true);
      media.addEventListener('contextmenu', blockImageActions, true);
      media.addEventListener('dragstart', blockImageActions, true);
      media.addEventListener('selectstart', blockImageActions, true);

      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        openGallery(images);
      });
      media.style.cursor = 'zoom-in';
      if (counter) counter.textContent = `1 / ${images.length}`;
    });
  };

  const render = imageMap => {
    grid.innerHTML = items.map((item, index) => {
      const images = imageMap[item.id] || [];
      const image = images[0] || '';
      return `<article class="fish-emblematic-card" data-product-id="${esc(item.id)}">
        <div class="fish-emblematic-card__media${image ? ' fish-emblematic-card__media--image' : ''}" data-images='${esc(JSON.stringify(images))}'>
          ${image ? `<button type="button" class="fish-emblematic-card__image-button" aria-label="Vedi immagine — ${esc(item.name)}"><img src="${esc(image)}" alt="${esc(item.name)}" loading="lazy" draggable="false" oncontextmenu="return false" ondragstart="return false" onselectstart="return false"></button><span class="fish-emblematic-card__zoom-label">Vedi immagine</span><span class="fish-emblematic-card__counter" aria-hidden="true">1 / ${images.length}</span>` : '<span>EMPERIO TISS</span>'}
        </div>
        <div class="fish-emblematic-card__body">
          <span class="fish-emblematic-card__kicker">0${index + 1} / SELEZIONE EMBLEMATICA</span>
          <h3>${esc(item.name)}</h3>
          <p class="fish-emblematic-card__scientific"><em>${esc(item.scientific)}</em></p>
          <div class="fish-emblematic-card__meta"><span>${esc(item.category)}</span><span>Mercato italiano</span></div>
          <p class="fish-emblematic-card__note">${esc(item.note)}</p>
          <span class="fish-emblematic-card__mark">Referenza professionale</span>
        </div>
      </article>`;
    }).join('');
    bindImages();
  };

  installImageProtection();

  const intro = grid.closest('.fish-emblematic')?.querySelector('.fish-emblematic__intro p');
  if (intro) intro.textContent = 'Selezione orientata al mercato italiano, con priorità a referenze ad alta rilevanza commerciale, continuità di fornitura e posizionamento premium.';

  fetch('/assets/data/product-images.json', { cache: 'no-cache' })
    .then(r => r.ok ? r.json() : {})
    .then(data => render(data || {}))
    .catch(() => render({}));
})();
