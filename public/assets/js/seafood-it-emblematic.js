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
    title: 'Referenze core<br><em>per il mercato italiano.</em>',
    intro: 'Una selezione orientata al mercato italiano, con priorità a crostacei mediterranei, continuità di fornitura e posizionamento premium.',
    items: [
      { name:'Moruno', scientific:'Aristeus antennatus', category:'Crostaceo', note:'Mediterraneo · surgelato · secondo disponibilità', image:'/assets/products/incoming/Moruno(1).jpeg' },
      { name:'Scampo', scientific:'Nephrops norvegicus', category:'Crostaceo', note:'Mediterraneo · surgelato · secondo calibro e disponibilità', image:'/assets/products/incoming/Cigala.jpeg' },
      { name:'Gambero bianco', scientific:'Parapenaeus longirostris', category:'Gambero', note:'Mediterraneo · surgelato · calibrato secondo destinazione', image:'/assets/products/incoming/Gamba Blanca.jpeg' }
    ]
  } : {
    kicker: 'SELEZIONE EMBLEMATICA',
    title: 'Referenze core<br><em>per il mercato italiano.</em>',
    intro: 'Una selezione orientata al mercato italiano, con priorità a cefalopodi versatili, formati professionali e continuità di fornitura.',
    items: [
      { name:'Polpo fiore', scientific:'Octopus vulgaris', category:'Polpo', note:'Surgelato · formato flor · secondo campagna e disponibilità', image:'/assets/products/incoming/Pulpo Flor.jpg' },
      { name:'Calamaro avvolto', scientific:'Illex / Loligo spp.', category:'Calamaro', note:'Surgelato · intero / avvolto · secondo programma', image:'/assets/products/incoming/Calamar.jpg' },
      { name:'Seppia pulita IQF', scientific:'Sepia spp.', category:'Seppia', note:'Surgelato · pulita / IQF · formato professionale', image:'/assets/products/incoming/Sepia Limpia.jpg' }
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

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

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
        <div class="fish-emblematic-card__meta"><span>${esc(item.category)}</span><span>Mercato italiano</span></div>
        <p class="fish-emblematic-card__note">${esc(item.note)}</p>
        <span class="fish-emblematic-card__mark">Referenza professionale</span>
      </div>
    </article>
  `).join('');
})();
