/* EMPERIO TISS — GLOBAL INTERACTION SYSTEM */
(() => {
  'use strict';
  const doc=document, root=doc.documentElement, body=doc.body;
  const get=(s,scope=doc)=>scope.querySelector(s);
  root.classList.remove('et-pointer-ready'); get('.et-pointer')?.remove();
  const header=get('.site-header,.p-header');
  const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
  updateHeader(); window.addEventListener('scroll',updateHeader,{passive:true});
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
