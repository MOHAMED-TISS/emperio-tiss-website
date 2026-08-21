/* EMPERIO TISS — GLOBAL INTERACTION SYSTEM */
(() => {
  'use strict';
  const doc=document, root=doc.documentElement, body=doc.body;
  const get=(s,scope=doc)=>scope.querySelector(s);

  /* Always apply the shared visual layer last so language/page modules cannot diverge visually. */
  if(!doc.querySelector('link[data-et-site-pages]')){
    const style=doc.createElement('link');
    style.rel='stylesheet';
    style.href='/assets/css/site-pages.css?v=20260821-1';
    style.dataset.etSitePages='true';
    (doc.head||doc.documentElement).appendChild(style);
  }

  root.classList.remove('et-pointer-ready'); get('.et-pointer')?.remove();
  const header=get('.site-header,.p-header');
  const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
  updateHeader(); window.addEventListener('scroll',updateHeader,{passive:true});

  /* One canonical Products tree for every language. */
  const lang=(root.lang||'en').slice(0,2).toLowerCase();
  const productTree={
    en:[['/en/products/','All products'],['/en/products/seafood/','Seafood'],['/en/products/seafood/fish/','Fish'],['/en/products/seafood/shellfish/','Shellfish'],['/en/products/seafood/cephalopods/','Cephalopods'],['/en/products/fruits/','Fruits'],['/en/products/vegetables/','Vegetables'],['/en/products/seasonal/','Seasonal']],
    fr:[['/fr/products/','Tous les produits'],['/fr/products/seafood/','Produits de la mer'],['/fr/products/seafood/fish/','Poissons'],['/fr/products/seafood/shellfish/','Coquillages'],['/fr/products/seafood/cephalopods/','Céphalopodes'],['/fr/products/fruits/','Fruits'],['/fr/products/vegetables/','Légumes'],['/fr/products/seasonal/','Produits de saison']],
    ar:[['/ar/products/','كل المنتجات'],['/ar/products/seafood/','المأكولات البحرية'],['/ar/products/seafood/fish/','الأسماك'],['/ar/products/seafood/shellfish/','القشريات'],['/ar/products/seafood/cephalopods/','الرخويات'],['/ar/products/fruits/','الفواكه'],['/ar/products/vegetables/','الخضروات'],['/ar/products/seasonal/','المنتجات الموسمية']],
    es:[['/products/','Todos los productos'],['/products/seafood/','Productos del mar'],['/products/seafood/fish/','Pescados'],['/products/seafood/shellfish/','Mariscos'],['/products/seafood/cephalopods/','Cefalópodos'],['/products/fruits/','Frutas'],['/products/vegetables/','Hortalizas'],['/products/seasonal/','Temporada']]
  };
  const productLinks=get('.nav-products-links');
  if(productLinks){
    const existing=new Set([...productLinks.querySelectorAll('a')].map(a=>a.getAttribute('href')));
    (productTree[lang]||productTree.en).forEach(([href,label])=>{
      if(existing.has(href))return;
      const a=doc.createElement('a'); a.href=href; a.textContent=label; productLinks.appendChild(a);
    });
  }

  const configs=[
    {button:'#menuToggleBtn, .mobile-menu, .es-menu',overlay:'#navOverlay, .nav-overlay'},
    {button:'#productsMenu, .p-menu',overlay:'#productsOverlay, .p-overlay'},
    {button:'#intlMenu, .intl-menu',overlay:'#intlOverlay, .intl-overlay'}
  ];
  configs.forEach(({button:bs,overlay:os})=>{
    const button=get(bs), overlay=get(os); if(!button||!overlay)return;
    const setOpen=open=>{
      body.classList.toggle('nav-open',open); body.classList.toggle('menu-open',open); button.classList.toggle('is-open',open);
      button.setAttribute('aria-expanded',String(open)); button.setAttribute('aria-label',open?'Close menu':'Open menu'); overlay.setAttribute('aria-hidden',String(!open));
      doc.documentElement.classList.toggle('menu-is-open',open);
    };
    button.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const open=body.classList.contains('nav-open')||body.classList.contains('menu-open');setOpen(!open);},true);
    overlay.addEventListener('click',e=>{if(e.target===overlay)setOpen(false);});
    overlay.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
    doc.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
    window.addEventListener('resize',()=>{if(window.innerWidth>900)setOpen(false);},{passive:true});
  });

  doc.querySelectorAll('.p-products-link').forEach(link=>{
    link.addEventListener('click',e=>{const group=link.closest('.p-nav-group');if(group&&group.querySelector('.p-subnav'))e.preventDefault();});
  });

  doc.querySelectorAll('[data-language-toggle]').forEach(toggle=>{
    const id=toggle.getAttribute('aria-controls'), menu=id?doc.getElementById(id):get('[data-language-menu]',toggle.parentElement||doc); if(!menu)return;
    const close=()=>{toggle.setAttribute('aria-expanded','false');menu.hidden=true;};
    toggle.addEventListener('click',e=>{e.stopPropagation();const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.hidden=open;});
    doc.addEventListener('click',e=>{if(!menu.contains(e.target)&&!toggle.contains(e.target))close();});
  });
})();
