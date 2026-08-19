/* EMPERIO TISS — FR / AR navigation, pointer and language-aware editorial refinements. */
(function(){'use strict';
const d=document,w=window,b=d.getElementById('intlMenu'),o=d.getElementById('intlOverlay');if(!b||!o)return;
const lang=(d.documentElement.lang||'fr').toLowerCase().slice(0,2);
const set=open=>{d.body.classList.toggle('nav-open',open);b.classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open));o.setAttribute('aria-hidden',String(!open));b.setAttribute('aria-label',open?(lang==='ar'?'إغلاق القائمة':'Fermer le menu'):(lang==='ar'?'فتح القائمة':'Ouvrir le menu'));};
function initPointer(){if(!w.matchMedia||w.matchMedia('(hover:none),(pointer:coarse)').matches||d.querySelector('.et-pointer'))return;const p=d.createElement('div');p.className='et-pointer';p.setAttribute('aria-hidden','true');d.body.appendChild(p);d.documentElement.classList.add('et-pointer-ready');let x=-100,y=-100,tx=-100,ty=-100,raf=0;const render=()=>{tx+=(x-tx)*.24;ty+=(y-ty)*.24;p.style.left=tx+'px';p.style.top=ty+'px';raf=requestAnimationFrame(render)};w.addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(render)},{passive:true});w.addEventListener('mousedown',()=>p.classList.add('is-down'));w.addEventListener('mouseup',()=>p.classList.remove('is-down'));d.addEventListener('mouseover',e=>{if(e.target.closest('a,button,[role="button"],input,select,textarea,.intl-card,.intl-btn'))p.classList.add('is-hover')});d.addEventListener('mouseout',e=>{if(e.target.closest('a,button,[role="button"],input,select,textarea,.intl-card,.intl-btn'))p.classList.remove('is-hover')});w.addEventListener('blur',()=>p.style.opacity='0');w.addEventListener('focus',()=>p.style.opacity='1');}
function replaceText(reps){const walker=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{if(n.parentElement&&n.parentElement.closest('script,style'))return;let v=n.nodeValue;Object.keys(reps).forEach(k=>{v=v.split(k).join(reps[k])});n.nodeValue=v});}
function editorial(){
if(lang==='fr'){
const maps={'Les produits<br><em>connectent.</em>':'Les produits circulent.<br><em>Les marchés se connectent.</em>','Trois<br><em>catégories.</em>':'Trois<br><em>univers.</em>','Vous cherchez<br><em>un produit précis ?</em>':'Vous recherchez<br><em>un produit précis ?</em>'};
Object.keys(maps).forEach(from=>d.querySelectorAll('h1,h2').forEach(el=>{if(el.innerHTML.replace(/\s+/g,' ').trim()===from.replace(/\s+/g,' ').trim())el.innerHTML=maps[from]}));
replaceText({'Fruits & légumes':'Fruits et légumes','Saisonnier':'Produits saisonniers','Demande professionnelle':'Demande B2B','Commencer une demande ↗':'Envoyer une demande B2B ↗'});
}
if(lang==='ar'){
const maps={'المنتج<br><em>يربط الأسواق.</em>':'المنتجات تتحرك.<br><em>والأسواق تتصل.</em>','ثلاث<br><em>فئات.</em>':'ثلاث<br><em>فئات متكاملة.</em>','تبحث عن<br><em>منتج محدد؟</em>':'تبحث عن<br><em>منتج محدد؟</em>'};
Object.keys(maps).forEach(from=>d.querySelectorAll('h1,h2').forEach(el=>{if(el.innerHTML.replace(/\s+/g,' ').trim()===from.replace(/\s+/g,' ').trim())el.innerHTML=maps[from]}));
replaceText({'موسمي':'منتجات موسمية','طلب مهني':'طلب تجاري','طلب B2B':'طلب توريد B2B'});
}}
function ensureLegal(){const footer=d.querySelector('.intl-footer');if(!footer||footer.querySelector('.intl-legal'))return;const labels=lang==='ar'?['إشعار قانوني','الخصوصية','ملفات تعريف الارتباط']:['Mentions légales','Confidentialité','Cookies'];const box=d.createElement('span');box.className='intl-legal';box.innerHTML='<a href="/legal/aviso-legal.html">'+labels[0]+'</a><span>·</span><a href="/legal/privacidad.html">'+labels[1]+'</a><span>·</span><a href="/legal/cookies.html">'+labels[2]+'</a>';footer.querySelector('.intl-footer-inner')?.appendChild(box);}
function init(){initPointer();editorial();ensureLegal();b.type='button';b.addEventListener('click',()=>set(!d.body.classList.contains('nav-open')));o.addEventListener('click',e=>{if(e.target===o)set(false)});o.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));d.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});set(false)}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init,{once:true});else init();w.addEventListener('pageshow',()=>set(false));
})();
