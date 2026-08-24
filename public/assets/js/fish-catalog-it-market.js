(() => {
  'use strict';
  const replaceEmblematic = () => {
    const target = document.getElementById('fishEmblematicGrid');
    if (!target || !target.children.length) return false;

    const market = [
      {id:'lubina', name:'Spigola', scientific:'Dicentrarchus labrax', cat:'Pesce bianco', note:'Domanda strutturale in Italia · fresco · secondo disponibilità'},
      {id:'dorada', name:'Orata', scientific:'Sparus aurata', cat:'Pesce bianco', note:'Referenza core del mercato italiano · fresco · calibro secondo destinazione'},
      {id:'pez-limon', name:'Ricciola', scientific:'Seriola dumerili', cat:'Pesce azzurro', note:'Posizionamento premium · fresco · Mediterraneo secondo disponibilità'}
    ];

    const current = [...target.querySelectorAll('.fish-emblematic-card')];
    if (current.length !== market.length) return false;

    current.forEach((card, index) => {
      const item = market[index];
      card.dataset.productId = item.id;
      const title = card.querySelector('h3');
      const scientific = card.querySelector('.fish-emblematic-card__scientific');
      const meta = card.querySelector('.fish-emblematic-card__meta');
      const note = card.querySelector('.fish-emblematic-card__note');
      if (title) title.textContent = item.name;
      if (scientific) scientific.innerHTML = `<em>${item.scientific}</em>`;
      if (meta) meta.innerHTML = `<span>${item.cat}</span><span>Mercato italiano</span>`;
      if (note) note.textContent = item.note;
    });

    const intro = target.closest('.fish-emblematic')?.querySelector('.fish-emblematic__intro p');
    if (intro) intro.textContent = 'Selezione orientata al mercato italiano, priorizzando referenze de alto interés comercial, continuidad de suministro y posicionamiento premium.';
    return true;
  };

  if (replaceEmblematic()) return;
  const observer = new MutationObserver(() => {
    if (replaceEmblematic()) observer.disconnect();
  });
  observer.observe(document.body, {childList:true, subtree:true});
})();
