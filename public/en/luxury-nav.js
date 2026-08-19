/* EMPERIO TISS — one global navigation controller */
(function(){
  'use strict';
  const d=document,w=window;
  const menu=()=>d.getElementById('menuToggleBtn')||d.querySelector('.es-menu,.mobile-menu');
  const overlay=()=>d.getElementById('navOverlay');
  const lang=()=>{const p=w.location.pathname.toLowerCase();return p.startsWith('/en/')||p==='/en/'?'EN':p.startsWith('/fr/')?'FR':p.startsWith('/ar/')?'AR':'ES'};
  function identity(){const p=w.location.pathname.toLowerCase();let page='standard';if(p.includes('seafood'))page='seafood';else if(p.includes('fruits-vegetables'))page='produce';else if(p.includes('seasonal'))page='seasonal';else if(p.includes('/news'))page='news';d.body.dataset.sitePage=page;}
  function set(open){const b=menu(),o=overlay();d.body.classList.toggle('nav-open',open);d.documentElement.classList.toggle('menu-lock',open);d.body.classList.toggle('menu-lock',open);if(b){b.classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Close menu':'Open menu');}if(o)o.setAttribute('aria-hidden',String(!open));}
  function languageBar(){const host=d.querySelector('#luxuryHeader .header-inner,.site-header .header-inner,.site-header .nav-wrap');if(!host||host.querySelector('.et-language-switch'))return;const current=lang();const links=[['ES','/index.html'],['EN','/en/index.html']];const box=d.createElement('nav');box.className='et-language-switch';box.setAttribute('aria-label','Language');links.forEach((x,i)=>{const a=d.createElement('a');a.href=x[1];a.textContent=x[0];if(x[0]===current)a.className='current';box.appendChild(a);if(i<links.length-1){const s=d.createElement('span');s.className='sep';s.textContent='·';box.appendChild(s)}});const b=menu();if(b)host.insertBefore(box,b);else host.appendChild(box);}
  function init(){identity();const b=menu(),o=overlay();if(!b||!o)return;b.querySelectorAll('.et-menu-label').forEach(x=>x.remove());b.type='button';b.setAttribute('aria-controls','navOverlay');if(!b.dataset.navBound){b.dataset.navBound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();set(!d.body.classList.contains('nav-open'))})}if(!o.dataset.navBound){o.dataset.navBound='1';o.addEventListener('click',e=>{if(e.target===o)set(false)});o.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)))}if(!d.body.dataset.navKeys){d.body.dataset.navKeys='1';d.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)})}languageBar();set(false)}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init,{once:true});else init();
  w.addEventListener('pageshow',()=>set(false));
})();
