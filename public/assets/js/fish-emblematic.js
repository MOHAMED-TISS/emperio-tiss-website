(() => {
  'use strict';
  const grid = document.getElementById('fishEmblematicGrid');
  if (!grid) return;

  const selected = [
    {
      id: 'dorada',
      name: 'Dorada',
      scientific: 'Sparus aurata',
      group: 'Pez de escama',
      note: 'Mediterráneo · fresco · según disponibilidad'
    },
    {
      id: 'denton',
      name: 'Dentón',
      scientific: 'Dentex dentex',
      group: 'Pez de escama',
      note: 'Mediterráneo · fresco · según disponibilidad'
    },
    {
      id: 'san-pedro',
      name: 'San Pedro',
      scientific: 'Zeus faber',
      group: 'Pez de escama',
      note: 'Mediterráneo / Atlántico · fresco · según disponibilidad'
    }
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const render = imageMap => {
    grid.innerHTML = selected.map((product, i) => {
      const image = imageMap[product.id]?.[0] || '';
      return `<article class="fish-emblematic-card">
        <div class="fish-emblematic-card__media${image ? ' fish-emblematic-card__media--image' : ''}">
          ${image ? `<img src="${esc(image)}" alt="${esc(product.name)}" loading="lazy" draggable="false">` : '<span>EMPERIO TISS</span>'}
          ${image ? '<span class="fish-emblematic-card__zoom-label">Ver imagen</span>' : ''}
        </div>
        <div class="fish-emblematic-card__body">
          <span class="fish-emblematic-card__kicker">0${i + 1} / SELECCIÓN</span>
          <h3>${esc(product.name)}</h3>
          <p class="fish-emblematic-card__scientific"><em>${esc(product.scientific)}</em></p>
          <div class="fish-emblematic-card__meta"><span>${esc(product.group)}</span><span>${esc(product.note.split('·')[0].trim())}</span></div>
          <p class="fish-emblematic-card__note">${esc(product.note)}</p>
          <span class="fish-emblematic-card__mark">Referencia profesional</span>
        </div>
      </article>`;
    }).join('');
  };

  fetch('/assets/data/product-images.json', { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : {})
    .then(data => render(data || {}))
    .catch(() => render({}));
})();
