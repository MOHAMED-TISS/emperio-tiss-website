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
function layoutFix(){const s=d.createElement('style');s.id='intl-layout-fix';s.textContent=`
/* Global FR / AR overlay-safe editorial layout. Every section gets independent text tracks. */
.intl-page .intl-container{width:min(1080px,calc(100% - 80px));margin-inline:auto}
.intl-page .intl-hero-inner,.intl-page .intl-cta>.intl-container{max-width:1080px;margin-inline:auto}
.intl-page .intl-hero-inner{display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;min-height:515px;padding-bottom:0}
.intl-page .intl-hero .intl-kicker{position:relative;z-index:3;margin:0 0 24px}
.intl-page .intl-hero h1{position:relative;z-index:2;max-width:900px;margin:0!important;line-height:.9;overflow-wrap:normal;word-break:normal;text-wrap:balance}
.intl-page .intl-hero .intl-lead{position:relative;z-index:3;max-width:680px;margin:34px 0 0!important;line-height:1.85;overflow-wrap:break-word}
.intl-page .intl-hero .intl-actions{position:relative;z-index:3;margin-top:28px}
.intl-page .intl-grid{width:100%;max-width:1080px;margin-inline:auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.62fr);gap:clamp(42px,7vw,90px);align-items:start}
.intl-page .intl-grid>div,.intl-page .intl-grid>.intl-copy{min-width:0}
.intl-page .intl-grid>div{padding-right:12px}
.intl-page .intl-section h2{max-width:680px;margin-top:18px;font-size:clamp(50px,6.3vw,92px);line-height:.9;overflow-wrap:normal;word-break:normal;text-wrap:balance}
.intl-page .intl-copy{max-width:470px;padding-top:clamp(42px,6vw,92px);margin:0;color:var(--et-muted);font-size:14px;line-height:1.9;overflow-wrap:break-word}
.intl-page .intl-cards{max-width:1080px;margin-inline:auto;margin-top:64px}
.intl-page .intl-card{min-width:0;overflow:hidden}
.intl-page .intl-card h3,.intl-page .intl-card p{overflow-wrap:break-word;word-break:normal}
.intl-page .intl-row{min-width:0}
.intl-page .intl-row strong,.intl-page .intl-row em{min-width:0;overflow-wrap:break-word;word-break:normal}
.intl-page .intl-cta>.intl-container{max-width:1080px;margin-inline:auto}
.intl-page .intl-cta h2{max-width:780px;line-height:.9;overflow-wrap:normal;word-break:normal;text-wrap:balance}
.intl-page .intl-cta p{max-width:680px;overflow-wrap:break-word}
[dir=rtl] .intl-page .intl-grid{direction:rtl}
[dir=rtl] .intl-page .intl-grid>div{padding-right:0;padding-left:12px}
[dir=rtl] .intl-page .intl-copy{justify-self:start;max-width:470px;padding-top:clamp(38px,5vw,82px);line-height:2;overflow-wrap:break-word}
[dir=rtl] .intl-page .intl-hero-inner,[dir=rtl] .intl-page .intl-cta>.intl-container{text-align:right;align-items:flex-start}
[dir=rtl] .intl-page .intl-hero h1{max-width:820px;line-height:1.25;overflow-wrap:normal;word-break:normal}
[dir=rtl] .intl-page .intl-hero .intl-lead{max-width:720px;line-height:2;margin-top:30px!important}
[dir=rtl] .intl-page .intl-section h2{max-width:700px;line-height:1.28;overflow-wrap:normal;word-break:normal}
[dir=rtl] .intl-page .intl-cta h2{max-width:760px;line-height:1.28}
[dir=rtl] .intl-page .intl-cards{direction:rtl}
[dir=rtl] .intl-page .intl-card{text-align:right}
@media(max-width:900px){
 .intl-page .intl-container,.intl-page .intl-hero-inner,.intl-page .intl-cta>.intl-container{width:calc(100% - 56px)}
 .intl-page .intl-hero-inner{min-height:500px;padding-bottom:0}
 .intl-page .intl-hero h1{max-width:100%;font-size:clamp(56px,13vw,90px);line-height:.94}
 .intl-page .intl-hero .intl-lead{max-width:680px;margin-top:26px!important}
 .intl-page .intl-grid{grid-template-columns:minmax(0,1fr);gap:0}
 .intl-page .intl-grid>div{padding:0}
 .intl-page .intl-copy{max-width:680px;padding-top:28px}
 .intl-page .intl-cards{margin-top:46px}
 .intl-page .intl-cta h2{max-width:100%;font-size:clamp(50px,12vw,78px);line-height:.96}
 [dir=rtl] .intl-page .intl-grid{direction:rtl}
 [dir=rtl] .intl-page .intl-grid>div{padding:0}
 [dir=rtl] .intl-page .intl-copy{justify-self:stretch;max-width:680px;padding-top:28px}
 [dir=rtl] .intl-page .intl-hero h1{max-width:100%;font-size:clamp(48px,12vw,78px);line-height:1.35}
 [dir=rtl] .intl-page .intl-hero .intl-lead{max-width:100%;line-height:2;margin-top:24px!important}
 [dir=rtl] .intl-page .intl-section h2{max-width:100%;font-size:clamp(44px,10vw,76px);line-height:1.35}
 [dir=rtl] .intl-page .intl-cta h2{max-width:100%;line-height:1.35}
}
@media(max-width:600px){
 .intl-page .intl-container,.intl-page .intl-hero-inner,.intl-page .intl-cta>.intl-container{width:calc(100% - 40px)}
 .intl-page .intl-hero{min-height:680px;padding-top:125px;padding-bottom:54px}
 .intl-page .intl-hero-inner{min-height:0}
 .intl-page .intl-hero .intl-kicker{margin-bottom:18px}
 .intl-page .intl-hero h1{font-size:clamp(48px,14vw,72px);line-height:.96}
 .intl-page .intl-hero .intl-lead{font-size:14px;line-height:1.85;margin-top:22px!important}
 .intl-page .intl-section h2{font-size:clamp(42px,12vw,68px);line-height:.98}
 .intl-page .intl-copy{font-size:14px;line-height:1.85;padding-top:24px}
 .intl-page .intl-cards{margin-top:38px}
 .intl-page .intl-cta h2{font-size:clamp(44px,12vw,68px);line-height:.98}
 [dir=rtl] .intl-page .intl-hero{min-height:700px}
 [dir=rtl] .intl-page .intl-hero h1{font-size:clamp(40px,11vw,64px);line-height:1.4}
 [dir=rtl] .intl-page .intl-hero .intl-lead{line-height:2;padding-bottom:2px}
 [dir=rtl] .intl-page .intl-section h2{font-size:clamp(38px,11vw,62px);line-height:1.4}
 [dir=rtl] .intl-page .intl-copy{line-height:2;padding-top:22px}
 [dir=rtl] .intl-page .intl-cta h2{font-size:clamp(38px,11vw,62px);line-height:1.4}
}
`;
d.head.appendChild(s);}
function init(){layoutFix();initPointer();editorial();ensureLegal();b.type='button';b.addEventListener('click',()=>set(!d.body.classList.contains('nav-open')));o.addEventListener('click',e=>{if(e.target===o)set(false)});o.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));d.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});set(false)}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init,{once:true});else init();w.addEventListener('pageshow',()=>set(false));
})();
