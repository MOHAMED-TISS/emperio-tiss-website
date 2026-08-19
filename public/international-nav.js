/* EMPERIO TISS — FR / AR navigation */
(function(){'use strict';
const d=document,b=d.getElementById('intlMenu'),o=d.getElementById('intlOverlay');
if(!b||!o)return;
const set=open=>{d.body.classList.toggle('nav-open',open);b.classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open));o.setAttribute('aria-hidden',String(!open));};
function ensureLegal(){
  const footer=d.querySelector('.intl-footer');
  if(!footer||footer.querySelector('.intl-legal'))return;
  const lang=(d.documentElement.lang||'fr').toLowerCase();
  const labels=lang==='ar'?['قانوني','الخصوصية','ملفات تعريف الارتباط']:['Mentions légales','Confidentialité','Cookies'];
  const box=d.createElement('span');box.className='intl-legal';
  box.innerHTML='<a href="/legal/aviso-legal.html">'+labels[0]+'</a> · <a href="/legal/privacidad.html">'+labels[1]+'</a> · <a href="/legal/cookies.html">'+labels[2]+'</a>';
  footer.querySelector('.intl-footer-inner')?.appendChild(box);
}
b.addEventListener('click',()=>set(!d.body.classList.contains('nav-open')));
o.addEventListener('click',e=>{if(e.target===o)set(false)});
o.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
d.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
ensureLegal();
})();
