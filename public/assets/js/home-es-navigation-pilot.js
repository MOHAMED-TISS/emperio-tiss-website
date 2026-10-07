/* EMPERIO TISS — Home ES selection redesign v4 */
(() => {
  'use strict';
  if (document.documentElement.lang.slice(0,2).toLowerCase() !== 'es') return;

  const root=document.querySelector('.home-selection-redesign');
  if(!root) return;

  const tabs=[...root.querySelectorAll('[role="tab"][data-category]')];
  const title=root.querySelector('#selection-display-title');
  const track=root.querySelector('.home-selection-marquee__track');
  if(!tabs.length||!title||!track) return;

  const data={
    sea:{title:'MAR',terms:['Especie','Origen','Formato','Disponibilidad']},
    fruit:{title:'FRUTAS',terms:['Variedad','Origen','Campaña','Calibre']},
    vegetable:{title:'HORTALIZAS',terms:['Variedad','Origen','Calidad','Formato']}
  };

  const sep='<i class="home-selection-marquee__sep"></i>';
  const tickerRun=terms=>terms.map(term=>`<span class="home-selection-marquee__word home-selection-marquee__word--term">${term}</span>`).join(sep)+sep;

  let timer=0;
  const sync=()=>{
    const active=tabs.find(tab=>tab.getAttribute('aria-selected')==='true')||tabs[0];
    const next=data[active.dataset.category]||data.sea;
    clearTimeout(timer);
    title.classList.add('is-switching');
    track.classList.add('is-switching');
    timer=window.setTimeout(()=>{
      title.textContent=next.title;
      const run=tickerRun(next.terms);
      track.innerHTML=`<div class="home-selection-marquee__run">${run}</div><div class="home-selection-marquee__run">${run}</div>`;
      title.classList.remove('is-switching');
      track.classList.remove('is-switching');
    },140);
  };

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='attributes'&&m.attributeName==='aria-selected')) sync();
  });
  tabs.forEach(tab=>observer.observe(tab,{attributes:true,attributeFilter:['aria-selected']}));
  sync();
})();