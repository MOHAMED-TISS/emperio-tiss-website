(() => {
  'use strict';

  const section = document.querySelector('.fish-emblematic');
  const inner = section?.querySelector('.fish-emblematic__inner');
  if (!section || !inner) return;

  const isShellfish = /\/fr\/products\/seafood\/shellfish\//.test(location.pathname);
  const isCephalopods = /\/fr\/products\/seafood\/cephalopods\//.test(location.pathname);
  if (!isShellfish && !isCephalopods) return;

  const data = isShellfish ? {
    title: 'Crustacés sélectionnés<br><em>pour le marché français.</em>',
    intro: 'Une sélection de références professionnelles, avec une attention portée à l’origine, au calibre, à la qualité et aux formats adaptés au sourcing et à la restauration.',
    items: [
      { name: 'Moruno', scientific: 'Aristeus antennatus', category: 'Crustacé · Méditerranée', note: 'Surgelé · origine Tunisie · FAO 37.2 · selon calibre et disponibilité', image: '/assets/products/incoming/Moruno(1).jpeg' },
      { name: 'Cigale de mer', scientific: 'Nephrops norvegicus', category: 'Crustacé · Premium', note: 'Surgelé · origine Tunisie · FAO 37.2 · format professionnel', image: '/assets/products/incoming/Cigala.jpeg' },
      { name: 'Crevette blanche', scientific: 'Parapenaeus longirostris', category: 'Crevette · Méditerranée', note: 'Surgelée · origine Tunisie · FAO 37.2 · calibrée selon destination', image: '/assets/products/incoming/Gamba Blanca.jpeg' }
    ]
  } : {
    title: 'Céphalopodes sélectionnés<br><em>pour le marché français.</em>',
    intro: 'Trois références professionnelles couvrant les principales familles de céphalopodes, avec des formats adaptés à différents usages en restauration et en sourcing.',
    items: [
      { name: 'Poulpe fleur', scientific: 'Octopus vulgaris', category: 'Poulpe · Premium', note: 'Surgelé · format fleur · Atlantique / Méditerranée selon disponibilité', image: '/assets/products/incoming/Pulpo Flor.jpg' },
      { name: 'Calamar', scientific: 'Illex / Loligo spp.', category: 'Calamar · Professionnel', note: 'Surgelé · entier / préparé · selon programme de fourniture', image: '/assets/products/incoming/Calamar.jpg' },
      { name: 'Seiche nettoyée IQF', scientific: 'Sepia spp.', category: 'Seiche · IQF', note: 'Surgelée · nettoyée / IQF · formats professionnels selon disponibilité', image: '/assets/products/incoming/Sepia Limpia.jpg' }
    ]
  };

  const intro = inner.querySelector('.fish-emblematic__intro');
  const grid = inner.querySelector('.fish-emblematic__grid');
  if (!grid) return;

  const heading = intro?.querySelector('h2');
  const paragraph = intro?.querySelector('p');
  if (heading) heading.innerHTML = data.title;
  if (paragraph) paragraph.textContent = data.intro;

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[c]));

  grid.innerHTML = data.items.map((item, index) => `
    <article class="fish-emblematic-card">
      <div class="fish-emblematic-card__media fish-emblematic-card__media--image">
        <img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" draggable="false">
        <span class="fish-emblematic-card__counter">0${index + 1}</span>
      </div>
      <div class="fish-emblematic-card__body">
        <span class="fish-emblematic-card__kicker">0${index + 1} / SÉLECTION EMBLÉMATIQUE</span>
        <h3>${esc(item.name)}</h3>
        <p class="fish-emblematic-card__scientific"><em>${esc(item.scientific)}</em></p>
        <div class="fish-emblematic-card__meta"><span>${esc(item.category)}</span><span>Marché France</span></div>
        <p class="fish-emblematic-card__note">${esc(item.note)}</p>
        <span class="fish-emblematic-card__mark">Référence professionnelle</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', event => event.preventDefault(), true);
    img.addEventListener('dragstart', event => event.preventDefault(), true);
    img.addEventListener('selectstart', event => event.preventDefault(), true);
  });

  if (!inner.querySelector('.fish-scroll-cue')) {
    const cue = document.createElement('a');
    cue.className = 'fish-scroll-cue';
    cue.href = isShellfish ? '#shellfishCatalog' : '#cephalopodsCatalog';
    cue.setAttribute('aria-label', 'Continuer vers le catalogue');
    cue.innerHTML = '<span>Voir le catalogue</span><i aria-hidden="true"></i><b aria-hidden="true">↓</b>';
    inner.appendChild(cue);
  }
})();
