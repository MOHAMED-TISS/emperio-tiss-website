(() => {
  'use strict';
  const doc = document;
  const root = document.documentElement;
  const body = document.body;
  const loadCss = (href, key) => { if (doc.querySelector(`link[data-${key}]`)) return; const link=doc.createElement('link'); link.rel='stylesheet'; link.href=href; link.dataset[key]='true'; doc.head.appendChild(link); };
  const loadScript = (src, key) => { if (doc.querySelector(`script[data-${key}]`)) return; const script=doc.createElement('script'); script.src=src; script.defer=true; script.dataset[key]='true'; doc.head.appendChild(script); };

  loadCss('/assets/css/site-pages.css?v=20260822-es-editorial-3','etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1','etUnifiedPages');
  loadCss('/assets/css/components/tokens.css?v=architecture-tokens-2','etTokens');
  loadCss('/assets/css/components/nav.css?v=architecture-nav-6','etNavigation');
  loadCss('/assets/css/components/footer.css?v=architecture-footer-1','etFooter');
  loadCss('/assets/css/components/header-transparent.css?v=header-transparent-1','etHeaderTransparent');
  loadScript('/assets/js/seo.js?v=architecture-seo-1','etSeo');
  loadScript('/assets/js/nav-normalizer.js?v=architecture-nav-6','etNavNormalizer');

  const path=window.location.pathname.replace(/\/+$/,'/')||'/';
  const productPath=/^\/(?:en\/|fr\/|ar\/)?products\//.test(path);
  const fishPilotPath=/^\/(?:en\/|fr\/|ar\/)?products\/seafood\/fish\/$/.test(path);
  const compactCatalog=body?.dataset.compactCatalog==='true';
  const locale=(()=>{const lang=(root.lang||'es').toLowerCase();if(lang.startsWith('ar'))return'ar';if(lang.startsWith('fr'))return'fr';if(lang.startsWith('en'))return'en';return'es';})();

  if(locale==='es'){
    body.classList.add('et-es');
    if(path==='/') body.classList.add('et-es-home');
    else if(path==='/about/') body.classList.add('et-es-about','et-es-page');
    else if(path==='/markets/') body.classList.add('et-es-markets','et-es-standard');
    else if(path==='/news/') body.classList.add('et-es-news','et-es-standard');
    else if(path==='/contact/') body.classList.add('et-es-contact','et-es-standard');
    else if(path==='/products/') body.classList.add('et-es-products');
    else if(/\/products\/seafood\/$/.test(path)) body.classList.add('et-es-products','et-es-seafood');
    else if(/\/products\/fruits\/$/.test(path)) body.classList.add('et-es-products','et-es-fruits');
    else if(/\/products\/vegetables\/$/.test(path)) body.classList.add('et-es-products','et-es-vegetables');
    else if(/\/products\/seasonal\/$/.test(path)) body.classList.add('et-es-products','et-es-seasonal');
    else if(/\/products\/seafood\/(fish|shellfish|cephalopods)\/$/.test(path)) body.classList.add('et-es-product-detail','et-es-seafood');
    else if(/\/products\//.test(path)) body.classList.add('et-es-product-detail');
    else body.classList.add('et-es-standard');
    loadCss('/assets/css/es-editorial-system.css?v=20260822-isra-es-1','etSpanishEditorial');
  }

  if(compactCatalog){loadCss('/assets/css/compact-catalog.css?v=20260822-1','etCompactCatalog');loadScript('/assets/js/compact-catalog.js?v=20260822-1','etCompactCatalogScript');}
  else if(productPath&&!fishPilotPath){loadCss('/assets/css/catalog.css?v=20260822-2','etCatalog');loadScript('/assets/js/products-catalog.js?v=20260822-1','etCatalogScript');}

  const prefix=locale==='es'?'':`/${locale}`;
  const footerCopy={
    es:{nav:'Navegación',products:'Productos',company:'Empresa',home:'Inicio',about:'Empresa',productsLink:'Productos',markets:'Mercados',news:'Noticias',contact:'Contacto',seafood:'Productos del mar',fruits:'Frutas y hortalizas',seasonal:'Temporada',legal:'Aviso legal',privacy:'Política de privacidad',cookies:'Política de cookies',note:'Tu socio de confianza en los mercados internacionales.',region:'EUROPA · ÁFRICA · MEDITERRÁNEO'},
    en:{nav:'Navigation',products:'Products',company:'Company',home:'Home',about:'Company',productsLink:'Products',markets:'Markets',news:'News',contact:'Contact',seafood:'Seafood',fruits:'Fruits & Vegetables',seasonal:'Seasonal',legal:'Legal notice',privacy:'Privacy',cookies:'Cookies',note:'Your trusted partner across international food markets.',region:'EUROPE · AFRICA · MEDITERRANEAN'},
    fr:{nav:'Navigation',products:'Produits',company:'Entreprise',home:'Accueil',about:'Entreprise',productsLink:'Produits',markets:'Marchés',news:'Actualités',contact:'Contact',seafood:'Produits de la mer',fruits:'Fruits & légumes',seasonal:'Produits de saison',legal:'Mentions légales',privacy:'Confidentialité',cookies:'Politique de cookies',note:'Votre partenaire de confiance sur les marchés internationaux.',region:'EUROPE · AFRIQUE · MÉDITERRANÉE'},
    ar:{nav:'التنقل',products:'المنتجات',company:'الشركة',home:'الرئيسية',about:'الشركة',productsLink:'المنتجات',markets:'الأسواق',news:'الأخبار',contact:'اتصل بنا',seafood:'المأكولات البحرية',fruits:'الفواكه والخضروات',seasonal:'المنتجات الموسمية',legal:'إشعار قانوني',privacy:'الخصوصية',cookies:'ملفات تعريف الارتباط',note:'شريككم الموثوق في أسواق الأغذية الدولية.',region:'أوروبا · أفريقيا · المتوسط'}
  }[locale];

  const renderLegacyFooter=()=>{const legacyFooter=doc.querySelector('.intl-footer,.ar-footer');if(!legacyFooter||doc.querySelector('.site-footer'))return;legacyFooter.className='site-footer';legacyFooter.innerHTML=`<div class="site-footer__inner"><div class="site-footer__grid"><div class="site-footer__brand"><img src="/logo.png" alt="EMPERIO TISS" class="site-footer__logo"><p>${footerCopy.note}</p></div><div class="site-footer__column"><strong>${footerCopy.nav}</strong><a href="${prefix}/">${footerCopy.home}</a><a href="${prefix}/about/">${footerCopy.about}</a><a href="${prefix}/products/">${footerCopy.productsLink}</a><a href="${prefix}/markets/">${footerCopy.markets}</a><a href="${prefix}/news/">${footerCopy.news}</a><a href="${prefix}/contact/">${footerCopy.contact}</a></div><div class="site-footer__column"><strong>${footerCopy.products}</strong><a href="${prefix}/products/seafood/">${footerCopy.seafood}</a><a href="${prefix}/products/fruits/">${footerCopy.fruits}</a><a href="${prefix}/products/seasonal/">${footerCopy.seasonal}</a></div><div class="site-footer__column"><strong>${footerCopy.company}</strong><a href="${prefix}/contact/">${footerCopy.contact}</a><a href="/legal/aviso-legal.html">${footerCopy.legal}</a><a href="/legal/privacidad.html">${footerCopy.privacy}</a><a href="/legal/cookies.html">${footerCopy.cookies}</a></div></div><div class="site-footer__bottom"><span>EMPERIO TISS</span><span>${footerCopy.region}</span></div></div>`;};
  const normalizeLegacyProductLinks=()=>{if(!body?.classList.contains('intl-page'))return;const replacements=[['/products/seafood.html','/products/seafood/'],['/products/fruits-vegetables.html','/products/fruits/'],['/products/seasonal.html','/products/seasonal/']];doc.querySelectorAll('.nav-products-links a[href]').forEach(link=>{const href=link.getAttribute('href');const replacement=replacements.find(([from])=>href===`${prefix}${from}`||href===from);if(replacement)link.setAttribute('href',prefix+replacement[1]);});};
  renderLegacyFooter();normalizeLegacyProductLinks();

  const qs=selector=>doc.querySelector(selector);
  const menuConfigs=[{button:'#menuToggleBtn,.mobile-menu,.es-menu,.intl-menu',overlay:'#navOverlay,.nav-overlay,.intl-overlay'},{button:'#productsMenu,.p-menu',overlay:'#productsOverlay,.p-overlay'}];
  const bindMenu=({button:buttonSelector,overlay:overlaySelector})=>{const button=qs(buttonSelector),overlay=qs(overlaySelector);if(!button||!overlay||button.dataset.etMenuBound==='true')return;const setOpen=open=>{body.classList.toggle('nav-open',open);body.classList.toggle('menu-open',open);body.classList.toggle('menu-is-open',open);button.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close menu':'Open menu');overlay.setAttribute('aria-hidden',String(!open));};button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();const open=body.classList.contains('nav-open')||body.classList.contains('menu-open');setOpen(!open);},true);overlay.addEventListener('click',event=>{if(event.target===overlay)setOpen(false);});overlay.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setOpen(false)));button.dataset.etMenuBound='true';};
  menuConfigs.forEach(bindMenu);
  doc.addEventListener('keydown',event=>{if(event.key==='Escape'){body.classList.remove('nav-open','menu-open','menu-is-open');doc.querySelectorAll('#menuToggleBtn,.mobile-menu,.es-menu,.intl-menu').forEach(button=>{button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open menu');});doc.querySelectorAll('#navOverlay,.nav-overlay,.intl-overlay').forEach(overlay=>overlay.setAttribute('aria-hidden','true'));}});
})();
