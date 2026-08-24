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
      if (!button || !images.length || button.dataset.itGalleryBound === 'true') return;
      button.dataset.itGalleryBound = 'true';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        openGallery(images);
      });
      media.style.cursor = 'zoom-in';
    });
  };

  const render = imageMap => {
    grid.innerHTML = items.map((item, index) => {
      const images = imageMap[item.id] || [];
      const image = images[0] || '';
      return `<article class="fish-emblematic-card" data-product-id="${esc(item.id)}">
        <div class="fish-emblematic-card__media${image ? ' fish-emblematic-card__media--image' : ''}" data-images='${esc(JSON.stringify(images))}'>
          ${image ? `<button type="button" class="fish-emblematic-card__image-button" aria-label="Vedi immagine — ${esc(item.name)}"><img src="${esc(image)}" alt="${esc(item.name)}" loading="lazy" draggable="false"></button><span class="fish-emblematic-card__zoom-label">Vedi immagine</span>` : '<span>EMPERIO TISS</span>'}
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

  const intro = grid.closest('.fish-emblematic')?.querySelector('.fish-emblematic__intro p');
  if (intro) intro.textContent = 'Selezione orientata al mercato italiano, con priorità a referenze ad alta rilevanza commerciale, continuità di fornitura e posizionamento premium.';

  fetch('/assets/data/product-images.json', { cache: 'no-cache' })
    .then(r => r.ok ? r.json() : {})
    .then(data => render(data || {}))
    .catch(() => render({}));
})();
