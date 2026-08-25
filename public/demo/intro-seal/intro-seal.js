/* Demo only — El Sello runtime */
(()=>{
  'use strict';
  const KEY='etSealSeen';
  const intro=document.querySelector('.seal-intro');
  const mark=document.querySelector('.seal-mark');
  const wordmark=document.querySelector('.seal-wordmark');
  const slogan=document.querySelector('.seal-slogan');
  const reset=document.querySelector('[data-reset-seal]');
  if(!intro||!mark)return;
  const remove=()=>{document.body.classList.remove('seal-active');intro.remove()};
  const exit=()=>{intro.classList.add('is-exiting');window.setTimeout(remove,430)};
  const failSafe=()=>{try{sessionStorage.setItem(KEY,'1')}catch{};document.body.classList.remove('seal-active');intro.remove()};
  reset?.addEventListener('click',()=>{try{sessionStorage.removeItem(KEY)}catch{};window.location.reload()});
  let seen=false;try{seen=sessionStorage.getItem(KEY)==='1'}catch{}
  if(seen){remove();return}
  document.body.classList.add('seal-active');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  fetch('/demo/intro-seal/monogram-et.svg',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('SVG load failed');return r.text()})
    .then(svgText=>{
      mark.innerHTML=svgText;
      const paths=[...mark.querySelectorAll('path')];
      if(!paths.length)throw new Error('No paths found');
      if(reduced){
        wordmark?.classList.add('is-on');slogan?.classList.add('is-on');mark.classList.add('is-sealed');
        window.setTimeout(()=>{try{sessionStorage.setItem(KEY,'1')}catch{};exit()},300);return;
      }
      const lengths=paths.map(path=>{
        const len=path.getTotalLength();
        if(!Number.isFinite(len)||len<=0)throw new Error('Invalid path length');
        path.style.strokeDasharray=`${len} ${len}`;
        path.style.strokeDashoffset=len;
        return len;
      });
      const start=performance.now();
      const draw=(now)=>{
        const progress=Math.min(1,(now-start)/1400);
        const eased=1-Math.pow(1-progress,3);
        paths.forEach((path,i)=>path.style.strokeDashoffset=lengths[i]*(1-eased));
        if(progress<1){requestAnimationFrame(draw)}else{mark.classList.add('is-sealed')}};
      requestAnimationFrame(draw);
      window.setTimeout(()=>wordmark?.classList.add('is-on'),1600);
      window.setTimeout(()=>slogan?.classList.add('is-on'),2000);
      window.setTimeout(()=>{try{sessionStorage.setItem(KEY,'1')}catch{};exit()},2400);
      window.setTimeout(()=>{if(intro.isConnected&&!intro.classList.contains('is-exiting'))failSafe()},2850);
    })
    .catch(()=>failSafe());
})();
