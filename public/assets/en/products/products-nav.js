(()=>{
  const b=document.getElementById('productsMenu');
  const o=document.getElementById('productsOverlay');
  const d=document.body;
  if(!b||!o)return;

  /* Shared Products navigation: every Products page exposes the same hidden
     secondary navigation only when the main menu is open. */
  const productsLink=[...o.querySelectorAll('.p-nav > a')]
    .find(a=>a.textContent.trim().replace(/\s+/g,' ').includes('Products'));

  if(productsLink&&!o.querySelector('.p-subnav')){
    const group=document.createElement('div');
    group.className='p-nav-group';
    productsLink.parentNode.insertBefore(group,productsLink);
    group.appendChild(productsLink);

    const sub=document.createElement('div');
    sub.className='p-subnav';
    sub.setAttribute('aria-label','Product categories');
    sub.innerHTML='<a href="/en/products/seafood/"><span>01</span>Seafood</a>'+
      '<a href="/en/products/fruits/"><span>02</span>Fruits &amp; Vegetables</a>'+
      '<a href="/en/products/seasonal.html"><span>03</span>Seasonal</a>';
    group.appendChild(sub);
  }

  const set=open=>{
    d.classList.toggle('menu-open',open);
    b.setAttribute('aria-expanded',String(open));
    b.setAttribute('aria-label',open?'Close menu':'Open menu');
    o.setAttribute('aria-hidden',String(!open));
  };

  b.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    set(!d.classList.contains('menu-open'));
  });

  o.addEventListener('click',e=>{
    if(e.target===o)set(false);
  });

  o.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
  set(false);
})();
