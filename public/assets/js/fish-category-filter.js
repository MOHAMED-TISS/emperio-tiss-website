(() => {
  'use strict';

  const grid = document.getElementById('fishCatalogGrid');
  const count = document.getElementById('fishCatalogCount');
  const buttons = Array.from(document.querySelectorAll('[data-fish-category]'));
  if (!grid || !buttons.length) return;

  const categoryById = {
    dorada: 'white',
    lubina: 'white',
    'merluza-pijota': 'white',
    mujol: 'white',
    rape: 'white',
    'san-pedro': 'white',
    'mero-amarillo': 'white',
    pargo: 'white',
    denton: 'white',
    sama: 'white',
    sargo: 'white',
    rascacio: 'white',
    caballa: 'blue',
    salmonete: 'blue',
    atun: 'blue',
    'pez-limon': 'blue',
    boqueron: 'blue',
    'pez-sable': 'special',
    'pez-espada': 'special'
  };

  let active = 'all';

  const update = () => {
    const cards = Array.from(grid.querySelectorAll('.fish-catalog-card[data-product-id]'));
    let visible = 0;

    cards.forEach(card => {
      const id = card.dataset.productId || '';
      const show = active === 'all' || categoryById[id] === active;
      card.hidden = !show;
      card.setAttribute('aria-hidden', String(!show));
      if (show) visible += 1;
    });

    if (count && cards.length) {
      count.textContent = `${visible} ${visible === 1 ? 'referencia' : 'referencias'}`;
    }
  };

  buttons.forEach(button => {
    button.type = 'button';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      active = button.dataset.fishCategory || 'all';
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      update();
    });
  });

  const observer = new MutationObserver(update);
  observer.observe(grid, { childList: true });
  update();
})();
