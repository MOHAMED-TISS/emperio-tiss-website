/* EMPERIO TISS — Home cinematic scroll layer */
(()=>{
  'use strict';
  const root=document.querySelector('.home-origin-page');
  if(!root)return;
  const network=document.querySelector('.origin-network');
  const update=()=>{
    if(network){
      const r=network.getBoundingClientRect();
      const p=Math.min(1,Math.max(0,(window.innerHeight-r.top)/(r.height+window.innerHeight*.15)));
      network.classList.toggle('is-drift',p>.04&&p<.98);
      network.style.setProperty('--network-progress',p.toFixed(4));
    }
  };
  let ticking=false;
  const onScroll=()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{update();ticking=false;});
  };
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  update();
  if(!reduce.matches){window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});}
})();
