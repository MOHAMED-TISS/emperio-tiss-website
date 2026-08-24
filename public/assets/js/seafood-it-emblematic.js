(() => {
  'use strict';
  const body = document.body;
  const section = document.querySelector('.fish-emblematic');
  const inner = section?.querySelector('.fish-emblematic__inner');
  if (!body || !section || !inner) return;

  const isShellfish = /\/shellfish\//.test(location.pathname);
  const isCephalopods = /\/cephalopods\//.test(location.pathname);
  if (!isShellfish && !isCephalopods) return;

  const data = isShellfish ? {
    kicker: 'SELEZIONE EMBLEMATICA',
    title: 'Crostacei selezionati<br><em>per il mercato italiano.</em>',
    intro: 'Una selezione costruita sulle referenze disponibili, con focus su crostacei ad alto valore, origine mediterranea e formati adatti alla ristorazione e al sourcing professionale.',
    items: [
      {
        name: 'Moruno',
        scientific: 'Aristeus antennatus',
        category: 'Crostaceo · Mediterraneo',
        note: 'Surgelato · origine Tunisia · FAO 37.2 · secondo calibro e disponibilità',
        image: '/assets/products/incoming/Moruno(1).jpeg'
      },
      {
        name: 'Cigala',
        scientific: 'Nephrops norvegicus',
        category: 'Crostaceo · Premium',
        note: 'Surgelata · origine Tunisia · FAO 37.2 · formato professionale',
        image: '/assets/products/incoming/Cigala.jpeg'
      },
      {
        name: 'Gamba blanca',
        scientific: 'Parapenaeus longirostris',
        category: 'Gambero · Mediterraneo',
        note: 'Surgelata · origine Tunisia · FAO 37.2 · calibrata secondo destinazione',
        image: '/assets/products/incoming/Gamba Blanca.jpeg'
      }
    ]
  } : {
    kicker: 'SELEZIONE EMBLEMATICA',
    title: 'Cefalopodi selezionati<br><em>per il mercato italiano.</em>',
    intro: 'Tre referenze professionali con forte rilevanza per il consumo italiano di cefalopodi: polpo, calamaro e seppia, con formati pronti per diversi impieghi.',
    items: [
      {
        name: 'Polpo fiore',
        scientific: 'Octopus vulgaris',
        category: 'Polpo · Premium',
        note: 'Surgelato · formato fiore · Atl./Medit. secondo disponibilità · ideale per ristorazione',
        image: '/assets/products/incoming/Pulpo Flor.jpg'
      },
      {
        name: 'Calamaro avvolto',
        scientific: 'Illex / Loligo spp.',
        category: 'Calamaro · Professionale',
        note: 'Surgelato · intero / avvolto · secondo programma di fornitura',
        image: '/assets/products/incoming/Calamar.jpg'
      },
      {
        name: 'Sepia pulita IQF',
        scientific: 'Sepia spp.',
        category: 'Seppia · IQF',
        note: 'Surgelata · pulita / IQF · formati professionali secondo disponibilità',
        image: '/assets/products/incoming/Sepia Limpia.jpg'
      }
    ]
  };

  const intro = inner.querySelector('.fish-emblematic__intro');
  const grid = inner.querySelector('.fish-emblematic__grid') || (() => {
    const el = document.createElement('div');
    el.className = 'fish-emblematic__grid';
    inner.appendChild(el);
    return el;
  })();

  if (intro) {
    const eyebrow = intro.querySelector('.eyebrow');
    const heading = intro.querySelector('h2');
    const paragraph = intro.querySelector('p');
    if (eyebrow) eyebrow.textContent = data.kicker;
    if (heading) heading.innerHTML = data.title;
    if (paragraph) paragraph.textContent = data.intro;
  }

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\"': '&quot;',
    "'": '&#39;'
  }[c]));

  grid.innerHTML = data.items.map((item, index) => `
    <article class="fish-emblematic-card">
      <div class="fish-emblematic-card__media fish-emblematic-card__media--image">
        <img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" draggable="false">
        <span class="fish-emblematic-card__counter">0${index + 1}</span>
      </div>
      <div class="fish-emblematic-card__body">
        <span class="fish-emblematic-card__kicker">0${index + 1} / ${esc(data.kicker)}</span>
        <h3>${esc(item.name)}</h3>
        <p class="fish-emblematic-card__scientific"><em>${esc(item.scientific)}</em></p>
        <div class="fish-emblematic-card__meta">
          <span>${esc(item.category)}</span>
          <span>Mercato Italia</span>
        </div>
        <p class="fish-emblematic-card__note">${esc(item.note)}</p>
        <span class="fish-emblematic-card__mark">Referenza professionale</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault(), true);
    img.addEventListener('dragstart', e => e.preventDefault(), true);
    img.addEventListener('selectstart', e => e.preventDefault(), true);
  });
})();
