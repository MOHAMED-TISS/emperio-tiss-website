/* EMPERIO TISS — Cinematic Home Intro runtime */
(()=>{
  'use strict';
  const KEY='emperioTissHomeIntroSeen';
  const overlay=document.querySelector('.home-intro');
  if(!overlay)return;
  const removeIntro=()=>{
    overlay.classList.add('is-exiting');
    document.body.classList.remove('home-intro-active');
    window.setTimeout(()=>overlay.remove(),850);
  };
  try{sessionStorage.setItem(KEY,'1');}catch{}
  const brand=overlay.querySelector('[data-intro-brand]');
  if(brand){
    const text=brand.textContent.trim();
    brand.textContent='';
    [...text].forEach((char,i)=>{
      const span=document.createElement('span');
      span.className=char===' '?'home-intro-space':'home-intro-letter';
      if(char!==' '){span.textContent=char;span.style.setProperty('--i',i)}
      brand.appendChild(span);
    });
  }
  document.body.classList.add('home-intro-active');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(removeIntro,reduced?500:2400);
})();
