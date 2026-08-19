/* EMPERIO TISS — scroll-driven pineapple peeling */
(function(){'use strict';
const page=document.querySelector('.fv-motion');if(!page)return;
const win=window,hero=page.querySelector('.es-fruit-hero'),scene=page.querySelector('.pineapple-scene'),skin=page.querySelector('.pineapple-skin'),crown=page.querySelector('.pineapple-crown'),body=page.querySelector('.pineapple-body'),flesh=page.querySelector('.pineapple-flesh'),peel=page.querySelector('.pineapple-peel'),content=page.querySelector('.es-hero-content'),cards=[...page.querySelectorAll('.es-card')],rows=[...page.querySelectorAll('.es-list-row')],cta=page.querySelector('.es-cta');if(!hero||!scene)return;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const reduce=win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function progress(){const r=hero.getBoundingClientRect(),travel=Math.max(hero.offsetHeight-win.innerHeight,1);return clamp(-r.top/travel)}
let ticking=false;
function animate(){ticking=false;const p=progress();hero.style.setProperty('--pine-progress',p.toFixed(4));hero.style.setProperty('--pine-rot',`${p*18-9}deg`);hero.style.setProperty('--pine-scale',`${1+p*.16}`);hero.style.setProperty('--pine-skin-x',`${p*230}px`);hero.style.setProperty('--pine-skin-y',`${p*260}px`);hero.style.setProperty('--pine-skin-rot',`${p*620}deg`);
scene.style.transform=`translate(-50%,-45%) scale(${1+p*.16}) rotate(${p*18-9}deg)`;
if(skin)skin.style.transform=`translate(calc(-50% + ${p*230}px),calc(-43% + ${p*260}px)) rotate(${p*620}deg)`;
if(crown)crown.style.transform=`translateX(-50%) rotate(${p*12-6}deg) translateY(${p*-35}px)`;
if(body)body.style.transform=`translate(-50%,-43%) rotate(${p*-7}deg)`;
if(content){content.style.transform=`translate3d(${p*-7}vw,${p*-20}px,0) scale(${1-p*.08})`;content.style.opacity=String(1-p*.8)}
if(peel)peel.style.transform=`translate(-50%,${p*300}px) rotate(${p*900}deg) scale(${.6+p*.8})`;
if(cta){const r=cta.getBoundingClientRect(),q=clamp((win.innerHeight-r.top)/(win.innerHeight+r.height));cta.style.setProperty('--fv-cta-scale',1.16-q*.12);cta.style.setProperty('--fv-cta-y',`${(0.5-q)*90}px`)}
}
function request(){if(!ticking){ticking=true;win.requestAnimationFrame(animate)}}
win.addEventListener('scroll',request,{passive:true});win.addEventListener('resize',request,{passive:true});
if(!reduce){const io='IntersectionObserver'in win?new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('is-inview')),{threshold:.12}):null;[...cards,...rows].forEach(e=>io?io.observe(e):e.classList.add('is-inview'));}
else [...cards,...rows].forEach(e=>e.classList.add('is-inview'));
animate();
})();