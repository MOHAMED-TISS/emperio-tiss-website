/* EMPERIO TISS — Fruits & Vegetables immersive motion controller */
(function(){
  'use strict';
  const d=document,w=window;
  const page=d.querySelector('.fv-motion');
  if(!page)return;

  const revealables=[...page.querySelectorAll('.es-card,.es-list-row,.es-cta')];
  const io=('IntersectionObserver' in w)?new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('is-inview'); });
  },{threshold:.18,rootMargin:'0px 0px -8% 0px'}):null;
  revealables.forEach(el=>io?io.observe(el):el.classList.add('is-inview'));

  const hero=page.querySelector('.es-fruit-hero');
  const cta=page.querySelector('.es-cta');
  let ticking=false;
  function scrollMotion(){
    const y=w.scrollY||0;
    if(hero){
      const h=Math.max(hero.offsetHeight,1);
      const p=Math.min(1,Math.max(0,y/h));
      hero.style.setProperty('--fv-y',(-p*70)+'px');
      hero.style.setProperty('--fv-x',(p*28)+'px');
      hero.style.setProperty('--fv-orbit',(p*120)+'px');
      const bg=hero.querySelector('.es-container');
      if(bg) bg.style.transform='translate3d(0,'+(p*34)+'px,0)';
    }
    if(cta){
      const r=cta.getBoundingClientRect();
      const vh=w.innerHeight||1;
      const p=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));
      cta.style.setProperty('--fv-cta-shift',(p*6)+'%');
      cta.style.setProperty('--fv-cta-scale',(1.12-p*.08));
      cta.style.setProperty('--fv-cta-position','center '+(50-p*8)+'%');
      const pseudoStyle=cta.querySelector(':scope > .es-container');
      if(pseudoStyle)pseudoStyle.style.transform='translate3d(0,'+((.5-p)*18)+'px,0)';
    }
    ticking=false;
  }
  w.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(scrollMotion)}},{passive:true});
  scrollMotion();

  if(w.matchMedia && w.matchMedia('(hover:hover) and (pointer:fine)').matches){
    page.addEventListener('pointermove',e=>{
      if(!hero)return;
      const r=hero.getBoundingClientRect();
      const nx=(e.clientX-r.left)/r.width-.5;
      const ny=(e.clientY-r.top)/r.height-.5;
      hero.style.setProperty('--fv-x',(nx*18)+'px');
      hero.style.setProperty('--fv-y',(ny*12)+'px');
    },{passive:true});
  }
})();
