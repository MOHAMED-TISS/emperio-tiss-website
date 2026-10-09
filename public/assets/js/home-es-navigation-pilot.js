/* EMPERIO TISS — Home selection v7: editorial marquees (ES / EN / FR / IT / AR) */
(() => {
  'use strict';

  const root=document.querySelector('.home-selection-redesign');
  if(!root) return;

  const stage=root.querySelector('.home-selection-redesign__stage');
  const tabs=[...root.querySelectorAll('[role="tab"][data-category]')];
  const title=root.querySelector('#selection-display-title');
  const track=root.querySelector('.home-selection-redesign__ticker .home-selection-marquee__track');
  if(!stage||!tabs.length||!title||!track) return;

  const copy={
    es:{
      sea:{title:'Mar',terms:['Especie','Origen','Formato','Calibre','Disponibilidad']},
      fruit:{title:'Frutas y hortalizas',terms:['Variedad','Origen','Campaña','Calibre','Formato']}
    },
    en:{
      sea:{title:'Sea',terms:['Species','Origin','Format','Size','Availability']},
      fruit:{title:'Produce',terms:['Variety','Origin','Season','Size','Format']}
    },
    fr:{
      sea:{title:'Mer',terms:['Espèce','Origine','Format','Calibre','Disponibilité']},
      fruit:{title:'Fruits et légumes',terms:['Variété','Origine','Campagne','Calibre','Format']}
    },
    it:{
      sea:{title:'Mare',terms:['Specie','Origine','Formato','Calibro','Disponibilità']},
      fruit:{title:'Frutta e ortaggi',terms:['Varietà','Origine','Campagna','Calibro','Formato']}
    },
    ar:{
      sea:{title:'البحر',terms:['النوع','المنشأ','التعبئة','الحجم','التوافر']},
      fruit:{title:'الفواكه والخضروات',terms:['الصنف','المنشأ','الموسم','الحجم','التعبئة']}
    }
  };
  const data=copy[(document.documentElement.lang||'es').slice(0,2).toLowerCase()]||copy.es;

  // Large editorial marquee: the family name, alternating filled and outlined.
  const grand=document.createElement('div');
  grand.className='ets-grand';
  grand.setAttribute('aria-hidden','true');
  grand.innerHTML='<div class="ets-grand__track"></div>';
  title.insertAdjacentElement('afterend',grand);
  const grandTrack=grand.firstElementChild;

  // Each run repeats its content so one run is always wider than the stage (seamless -50% loop).
  const grandRun=name=>Array.from({length:6},(_,i)=>
    `<span class="ets-grand__word${i%2?' ets-grand__word--outline':''}">${name}</span><i class="ets-grand__sep"></i>`).join('');
  const sep='<i class="home-selection-marquee__sep"></i>';
  const tickerRun=terms=>[...terms,...terms,...terms].map(term=>
    `<span class="home-selection-marquee__word home-selection-marquee__word--term">${term}</span>`).join(sep)+sep;

  let timer=0;
  const sync=()=>{
    const active=tabs.find(tab=>tab.getAttribute('aria-selected')==='true')||tabs[0];
    const next=data[active.dataset.category]||data.sea;
    clearTimeout(timer);
    stage.classList.add('is-switching');
    timer=window.setTimeout(()=>{
      title.textContent=next.title;
      const run=grandRun(next.title);
      grandTrack.innerHTML=`<div class="ets-grand__run">${run}</div><div class="ets-grand__run">${run}</div>`;
      const terms=tickerRun(next.terms);
      track.innerHTML=`<div class="home-selection-marquee__run">${terms}</div><div class="home-selection-marquee__run">${terms}</div>`;
      stage.classList.remove('is-switching');
    },260);
  };

  stage.classList.add('ets-ready');
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='attributes'&&m.attributeName==='aria-selected')) sync();
  });
  tabs.forEach(tab=>observer.observe(tab,{attributes:true,attributeFilter:['aria-selected']}));
  sync();
})();
