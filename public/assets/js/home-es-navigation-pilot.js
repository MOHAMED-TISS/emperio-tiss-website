/* EMPERIO TISS — Home ES navigation/clarity pilot */
(() => {
  'use strict';

  if (document.documentElement.lang.slice(0,2).toLowerCase() !== 'es') return;
  const root = document.querySelector('.home-page.home-experience .home-selection-marquee');
  if (!root) return;

  const track = root.querySelector('.home-selection-marquee__track');
  const tabs = [...root.querySelectorAll('[role="tab"][data-category]')];
  if (!track || !tabs.length) return;

  const vocab = {
    sea: {
      family:'Mar',
      terms:['Especie','Origen','Formato','Disponibilidad']
    },
    fruit: {
      family:'Frutas',
      terms:['Variedad','Origen','Campaña','Calibre']
    },
    vegetable: {
      family:'Hortalizas',
      terms:['Variedad','Origen','Calidad','Formato']
    }
  };

  const sep = '<i class="home-selection-marquee__sep"></i>';

  const runMarkup = data => {
    const sequence = [
      ...data.terms.map(term => `<span class="home-selection-marquee__word home-selection-marquee__word--term">${term}</span>`),
      `<span class="home-selection-marquee__word home-selection-marquee__word--family"><em>${data.family}</em></span>`
    ];
    return sequence.join(sep) + sep;
  };

  const render = key => {
    const data = vocab[key] || vocab.sea;
    track.classList.add('is-switching');
    window.setTimeout(() => {
      const run = runMarkup(data);
      track.innerHTML = `<div class="home-selection-marquee__run">${run}</div><div class="home-selection-marquee__run">${run}</div>`;
      track.classList.remove('is-switching');
    }, 120);
  };

  const syncFromTabs = () => {
    const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    render(active.dataset.category);
  };

  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.type === 'attributes' && m.attributeName === 'aria-selected')) {
      syncFromTabs();
    }
  });

  tabs.forEach(tab => observer.observe(tab,{attributes:true,attributeFilter:['aria-selected']}));
  syncFromTabs();
})();