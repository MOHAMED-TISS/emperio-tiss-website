/* EMPERIO TISS — global navigation, localized Products submenu and pointer */
(function(){
'use strict';
const d=document,w=window;
const menu=()=>d.getElementById('menuToggleBtn')||d.querySelector('.es-menu,.intl-menu,.mobile-menu');
const overlay=()=>d.getElementById('navOverlay');
const lang=()=>{const p=w.location.pathname.toLowerCase();if(p.startsWith('/en/'))return'EN';if(p.startsWith('/fr/'))return'FR';if(p.startsWith('/ar/'))return'AR';return'ES'};

function menuVisualNormalize(){
 if(d.getElementById('et-menu-visual-fix'))return;
 const s=d.createElement('style');s.id='et-menu-visual-fix';
 s.textContent=`
#luxuryHeader #menuToggleBtn,#luxuryHeader .mobile-menu,#luxuryHeader .es-menu,#luxuryHeader .intl-menu,.site-header .mobile-menu,.site-header .es-menu,.site-header .intl-menu{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important;overflow:visible!important}
#luxuryHeader #menuToggleBtn span:not(.et-menu-label),#luxuryHeader .mobile-menu span:not(.et-menu-label),#luxuryHeader .es-menu span:not(.et-menu-label),#luxuryHeader .intl-menu span:not(.et-menu-label),.site-header .mobile-menu span:not(.et-menu-label),.site-header .es-menu span:not(.et-menu-label),.site-header .intl-menu span:not(.et-menu-label){position:absolute!important;left:50%!important;top:50%!important;width:21px!important;height:1px!important;margin:0!important;display:block!important;background:#f4f0e6!important;transform-origin:center!important;transition:transform .45s cubic-bezier(.165,.84,.44,1),opacity .25s ease!important}
#luxuryHeader #menuToggleBtn span:nth-child(1),#luxuryHeader .mobile-menu span:nth-child(1),#luxuryHeader .es-menu span:nth-child(1),#luxuryHeader .intl-menu span:nth-child(1),.site-header .mobile-menu span:nth-child(1),.site-header .es-menu span:nth-child(1),.site-header .intl-menu span:nth-child(1){transform:translate(-50%,-50%) translateY(-6px)!important}
#luxuryHeader #menuToggleBtn span:nth-child(2),#luxuryHeader .mobile-menu span:nth-child(2),#luxuryHeader .es-menu span:nth-child(2),#luxuryHeader .intl-menu span:nth-child(2),.site-header .mobile-menu span:nth-child(2),.site-header .es-menu span:nth-child(2),.site-header .intl-menu span:nth-child(2){transform:translate(-50%,-50%)!important}
#luxuryHeader #menuToggleBtn span:nth-child(3),#luxuryHeader .mobile-menu span:nth-child(3),#luxuryHeader .es-menu span:nth-child(3),#luxuryHeader .intl-menu span:nth-child(3),.site-header .mobile-menu span:nth-child(3),.site-header .es-menu span:nth-child(3),.site-header .intl-menu span:nth-child(3){transform:translate(-50%,-50%) translateY(6px)!important}
body.nav-open #luxuryHeader #menuToggleBtn span:nth-child(1),body.nav-open #luxuryHeader .mobile-menu span:nth-child(1),body.nav-open #luxuryHeader .es-menu span:nth-child(1),body.nav-open #luxuryHeader .intl-menu span:nth-child(1),body.nav-open .site-header .mobile-menu span:nth-child(1),body.nav-open .site-header .es-menu span:nth-child(1),body.nav-open .site-header .intl-menu span:nth-child(1){transform:translate(-50%,-50%) rotate(45deg)!important}
body.nav-open #luxuryHeader #menuToggleBtn span:nth-child(2),body.nav-open #luxuryHeader .mobile-menu span:nth-child(2),body.nav-open #luxuryHeader .es-menu span:nth-child(2),body.nav-open #luxuryHeader .intl-menu span:nth-child(2),body.nav-open .site-header .mobile-menu span:nth-child(2),body.nav-open .site-header .es-menu span:nth-child(2),body.nav-open .site-header .intl-menu span:nth-child(2){opacity:0!important}
body.nav-open #luxuryHeader #menuToggleBtn span:nth-child(3),body.nav-open #luxuryHeader .mobile-menu span:nth-child(3),body.nav-open #luxuryHeader .es-menu span:nth-child(3),body.nav-open #luxuryHeader .intl-menu span:nth-child(3),body.nav-open .site-header .mobile-menu span:nth-child(3),body.nav-open .site-header .es-menu span:nth-child(3),body.nav-open .site-header .intl-menu span:nth-child(3){transform:translate(-50%,-50%) rotate(-45deg)!important}
#luxuryHeader #menuToggleBtn::after,#luxuryHeader .mobile-menu::after,#luxuryHeader .es-menu::after,#luxuryHeader .intl-menu::after,.site-header .mobile-menu::after,.site-header .es-menu::after,.site-header .intl-menu::after{content:"MENU";position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);color:#f4f0e6;font:600 8px/1 "DM Sans",sans-serif;letter-spacing:.18em;opacity:.78;white-space:nowrap;pointer-events:none}
body.nav-open #luxuryHeader #menuToggleBtn::after,body.nav-open #luxuryHeader .mobile-menu::after,body.nav-open #luxuryHeader .es-menu::after,body.nav-open #luxuryHeader .intl-menu::after,body.nav-open .site-header .mobile-menu::after,body.nav-open .site-header .es-menu::after,body.nav-open .site-header .intl-menu::after{content:"CLOSE";color:#d2b16c!important;opacity:1!important}
@media(max-width:900px){#luxuryHeader #menuToggleBtn span:not(.et-menu-label),#luxuryHeader .mobile-menu span:not(.et-menu-label),#luxuryHeader .es-menu span:not(.et-menu-label),#luxuryHeader .intl-menu span:not(.et-menu-label),.site-header .mobile-menu span:not(.et-menu-label),.site-header .es-menu span:not(.et-menu-label),.site-header .intl-menu span:not(.et-menu-label){width:19px!important}}
`;
 d.head.appendChild(s);
}

function normalizeInternationalNav(){
 const o=overlay();if(!o)return;
 let inner=o.querySelector('.nav-overlay-inner,.intl-overlay-inner');
 let nav=o.querySelector('.nav-overlay-links,.intl-nav');
 let foot=o.querySelector('.nav-overlay-foot,.intl-overlay-foot');
 if(!inner&&nav){inner=d.createElement('div');inner.className='nav-overlay-inner';o.insertBefore(inner,nav);inner.appendChild(nav);if(foot)inner.appendChild(foot)}
 if(inner)inner.classList.add('nav-overlay-inner');
 nav=o.querySelector('.nav-overlay-links,.intl-nav');if(nav)nav.classList.add('nav-overlay-links');
 foot=o.querySelector('.nav-overlay-foot,.intl-overlay-foot');
 if(foot){foot.classList.add('nav-overlay-foot');const kids=Array.from(foot.children);if(kids[0])kids[0].classList.add('nav-overlay-lang');if(kids[1])kids[1].classList.add('nav-overlay-contact')}
 const b=menu();if(b&&b.classList.contains('intl-menu'))b.classList.add('es-menu');
}

function visualNormalize(){
 if(d.getElementById('et-visual-normalizer'))return;
 const s=d.createElement('style');s.id='et-visual-normalizer';
 s.textContent=`html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{overflow-x:hidden}a,button,[role="button"],input,select,textarea{cursor:pointer}button:disabled,a[aria-disabled="true"]{cursor:default}.es-page h1,.es-page h2,.es-page h3,.es-page h4,.intl-page h1,.intl-page h2,.intl-page h3,.intl-page h4,.product-detail-page h1,.product-detail-page h2,.product-detail-page h3{font-family:"Playfair Display",Georgia,serif;font-weight:400}.es-page p,.es-page a,.es-page button,.intl-page p,.intl-page a,.intl-page button,.product-detail-page p,.product-detail-page a,.product-detail-page button{font-family:"DM Sans",Arial,sans-serif}.es-page .es-container,.product-detail-page .pd-container{max-width:1180px;margin-inline:auto}.intl-page .intl-container,.intl-page .intl-hero-inner{max-width:1180px;margin-inline:auto}.es-page img,.product-detail-page img{height:auto;max-width:100%}.es-page .es-section,.es-page .es-cta,.es-page .es-footer{overflow:visible}.es-page .es-grid,.es-page .es-cards,.es-page .es-footer-grid{min-width:0}.es-page .es-grid>*,.es-page .es-cards>*,.es-page .es-footer-grid>*{min-width:0}.intl-page main,.intl-page section,.intl-page footer{max-width:100%;box-sizing:border-box}.intl-page .intl-container,.intl-page .intl-hero-inner{box-sizing:border-box}.product-catalog-grid{min-width:0}.product-card{min-width:0}.product-card-body{min-width:0}.product-card-meta,.product-card-scientific{overflow-wrap:anywhere}@media(max-width:800px){.es-page .es-container,.product-detail-page .pd-container{width:calc(100% - 32px)}.es-page .es-grid,.es-page .es-cards,.es-page .es-footer-grid{width:100%}.intl-page .intl-container,.intl-page .intl-hero-inner{width:calc(100% - 32px)}}`;
 d.head.appendChild(s);
}

function set(open){
 const b=menu(),o=overlay();
 d.body.classList.toggle('nav-open',open);d.documentElement.classList.toggle('menu-lock',open);d.body.classList.toggle('menu-lock',open);
 if(b){b.classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Close menu':'Open menu')}
 if(o)o.setAttribute('aria-hidden',String(!open));
}

function ensureProducts(){
 normalizeInternationalNav();
 const nav=d.querySelector('#navOverlay .nav-overlay-links');if(!nav||nav.querySelector('.et-products-menu'))return;
 const current=lang();
 const L=current==='EN'?['Seafood','Fruits','Vegetables','Seasonal']:current==='FR'?['Produits de la mer','Fruits','Horticulture','Saisonniers']:current==='AR'?['المأكولات البحرية','الفواكه','الخضروات','المنتجات الموسمية']:['Productos del mar','Frutas','Hortalizas','Productos de temporada'];
 const P=current==='EN'?'/en/products/':current==='FR'?'/fr/products/':current==='AR'?'/ar/products/':'/products/';
 const group=d.createElement('div');group.className='nav-products-group et-products-menu';
 [['01',L[0],'seafood.html'],['02',L[1],'fruits/'],['03',L[2],'vegetables/'],['04',L[3],'seasonal.html']].forEach(item=>{const a=d.createElement('a');a.href=P+item[2];a.innerHTML='<span class="idx">'+item[0]+'</span><span>'+item[1]+'</span>';group.appendChild(a)});
 const products=Array.from(nav.children).find(x=>x.matches('a')&&/^(productos|products|produits|المنتجات)$/i.test((x.textContent||'').replace(/^\d+\s*/,'').trim()));if(!products)return;
 products.classList.add('has-products-menu');products.dataset.productsParent='true';products.setAttribute('aria-expanded','false');products.setAttribute('aria-haspopup','true');products.setAttribute('role','button');products.setAttribute('tabindex','0');products.after(group);
 const toggle=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const expanded=nav.classList.toggle('products-expanded');products.setAttribute('aria-expanded',String(expanded))};
 products.addEventListener('click',toggle,true);products.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){toggle(e)}});
}

function initPointer(){
 if(d.querySelector('.et-pointer'))return;
 const coarse=w.matchMedia&&w.matchMedia('(hover:none),(pointer:coarse)').matches;if(coarse)return;
 const style=d.createElement('style');style.id='et-pointer-style';style.textContent='.et-pointer{position:fixed;left:-100px;top:-100px;width:12px;height:12px;border:1px solid rgba(210,177,108,.95);border-radius:50%;pointer-events:none;z-index:2147483647;transform:translate(-50%,-50%);opacity:.95;transition:width .2s ease,height .2s ease}.et-pointer::after{content:"";position:absolute;inset:3px;border-radius:50%;background:rgba(210,177,108,.75)}.et-pointer.is-hover{width:34px;height:34px}@media(hover:none),(pointer:coarse){.et-pointer{display:none!important}}';d.head.appendChild(style);
 const p=d.createElement('div');p.className='et-pointer';d.body.appendChild(p);w.addEventListener('mousemove',e=>{p.style.left=e.clientX+'px';p.style.top=e.clientY+'px'},{passive:true});d.addEventListener('mouseover',e=>{if(e.target.closest('a,button,[role="button"]'))p.classList.add('is-hover')});d.addEventListener('mouseout',e=>{if(e.target.closest('a,button,[role="button"]'))p.classList.remove('is-hover')});
}

function init(){
 menuVisualNormalize();normalizeInternationalNav();visualNormalize();
 let b=menu(),o=overlay();initPointer();if(!b||!o)return;
 /* Remove every legacy click handler attached to the menu button. This is the root fix for MENU → X → instant close. */
 const clean=b.cloneNode(true);b.replaceWith(clean);b=clean;
 b.type='button';b.setAttribute('aria-controls','navOverlay');
 ensureProducts();
 const nav=o.querySelector('.nav-overlay-links');
 if(nav&&!nav.dataset.productsCapture){nav.dataset.productsCapture='1';nav.addEventListener('click',e=>{const parent=e.target.closest('a.has-products-menu');if(parent){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const expanded=nav.classList.toggle('products-expanded');parent.setAttribute('aria-expanded',String(expanded))}},true)}
 b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();set(!d.body.classList.contains('nav-open'))},true);
 if(!o.dataset.navBound){o.dataset.navBound='1';o.addEventListener('click',e=>{if(e.target===o)set(false)});o.querySelectorAll('a:not(.has-products-menu)').forEach(a=>a.addEventListener('click',()=>set(false)))}
 set(false);
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
