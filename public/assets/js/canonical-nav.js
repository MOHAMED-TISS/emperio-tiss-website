(() => {
  'use strict';
  const doc=document, root=document.documentElement, body=document.body;
  if(!body)return;
  const lang=(root.lang||'es').slice(0,2).toLowerCase();
  const nav={
    es:{prefix:'',seafood:'Productos del mar',fish:'Pescados',fishScale:'Pez de escama',white:'Blanco / semigraso',blue:'Azul / graso',premium:'Premium',special:'Pescados especiales',shellfish:'Mariscos / Crustáceos',mediterranean:'Del Mediterráneo',moruno:'Moruno',cigala:'Cigala',whitePrawn:'Gamba blanca',tigerPrawn:'Langostino tigre',cephalopods:'Cefalópodos',fruitsVegetables:'Frutas y hortalizas',fruits:'Frutas',citrus:'Cítricos',exoticFruit:'Frutas exóticas',otherFruit:'Otras frutas',vegetables:'Hortalizas',seasonal:'Temporada',seasonalSelection:'Selección de temporada'},
    en:{prefix:'/en',seafood:'Seafood',fish:'Fish',fishScale:'Scaled fish',white:'White / semi-fatty',blue:'Blue / fatty',premium:'Premium',special:'Special fish',shellfish:'Shellfish / Crustaceans',mediterranean:'Mediterranean',moruno:'Moruno',cigala:'Cigala',whitePrawn:'Gamba blanca',tigerPrawn:'Langostino tigre',cephalopods:'Cephalopods',fruitsVegetables:'Fruits & Vegetables',fruits:'Fruit',citrus:'Citrus',exoticFruit:'Exotic fruit',otherFruit:'Other fruit',vegetables:'Vegetables',seasonal:'Seasonal',seasonalSelection:'Seasonal selection'},
    fr:{prefix:'/fr',seafood:'Produits de la mer',fish:'Poissons',fishScale:'Poissons à écailles',white:'Blancs / semi-gras',blue:'Bleus / gras',premium:'Premium',special:'Poissons spéciaux',shellfish:'Fruits de mer / Crustacés',mediterranean:'Méditerranée',moruno:'Moruno',cigala:'Cigala',whitePrawn:'Gamba blanca',tigerPrawn:'Langostino tigre',cephalopods:'Céphalopodes',fruitsVegetables:'Fruits & légumes',fruits:'Fruits',citrus:'Agrumes',exoticFruit:'Fruits exotiques',otherFruit:'Autres fruits',vegetables:'Légumes',seasonal:'Produits de saison',seasonalSelection:'Sélection de saison'},
    ar:{prefix:'/ar',seafood:'المأكولات البحرية',fish:'الأسماك',fishScale:'أسماك ذات قشور',white:'أبيض / شبه دهني',blue:'أزرق / دهني',premium:'فاخر',special:'أسماك خاصة',shellfish:'المأكولات البحرية / القشريات',mediterranean:'من البحر المتوسط',moruno:'Moruno',cigala:'Cigala',whitePrawn:'Gamba blanca',tigerPrawn:'Langostino tigre',cephalopods:'رأسيات الأرجل',fruitsVegetables:'الفواكه والخضروات',fruits:'الفواكه',citrus:'الحمضيات',exoticFruit:'الفواكه الاستوائية',otherFruit:'فواكه أخرى',vegetables:'الخضروات',seasonal:'المنتجات الموسمية',seasonalSelection:'اختيارات موسمية'}
  }[lang]||null;
  if(!nav)return;
  const path=window.location.pathname.replace(/\/+$/,'/')||'/';
  const href=s=>`${nav.prefix}${s}`;
  const link=(label,s)=>{const a=doc.createElement('a');a.href=href(s);a.textContent=label;if(path===href(s))a.setAttribute('aria-current','page');return a;};
  const summary=label=>{const s=doc.createElement('summary');s.textContent=label;return s;};
  const leaf=label=>{const s=doc.createElement('span');s.className='nav-product-leaf';s.textContent=label;return s;};
  const group=(cls,label,children)=>{const d=doc.createElement('details');d.className=cls;d.appendChild(summary(label));const box=doc.createElement('div');box.className='nav-products-links';children.forEach(c=>box.appendChild(c));d.appendChild(box);return d;};

  const buildFish=()=>{
    const fish=group('nav-fish',nav.fish,[]), box=fish.querySelector('.nav-products-links');
    const scaled=group('nav-fish-scale',nav.fishScale,[]), scaledBox=scaled.querySelector('.nav-products-links');
    const makeType=(label,names)=>{const d=group('nav-fish-type',label,[]),b=d.querySelector('.nav-products-links');names.forEach(n=>b.appendChild(leaf(n)));return d;};
    scaledBox.appendChild(makeType(nav.white,['Dorada','Lubina','Merluza / Pijota','Mújol','Rape','San Pedro','Mero amarillo','Pargo','Dentón','Sama','Sargo','Rascacio']));
    scaledBox.appendChild(makeType(nav.blue,['Caballa','Salmonete','Atún','Pez limón','Boquerón']));
    scaledBox.appendChild(makeType(nav.premium,['Dentón','San Pedro','Mero amarillo','Pargo','Sama','Pez limón','Atún']));
    box.appendChild(scaled);
    box.appendChild(group('nav-fish-special',nav.special,['Pez sable','Pez espada'].map(leaf)));
    return fish;
  };

  const normalize=links=>{
    if(!links||links.dataset.canonicalNav==='true')return;
    links.dataset.canonicalNav='true';links.innerHTML='';
    const seafood=group('nav-seafood',nav.seafood,[]), seafoodBox=seafood.querySelector('.nav-products-links');
    seafoodBox.appendChild(buildFish());
    const shellfish=group('nav-shellfish',nav.shellfish,[]), shellBox=shellfish.querySelector('.nav-products-links');
    shellBox.appendChild(group('nav-shellfish-mediterranean',nav.mediterranean,[nav.moruno,nav.cigala,nav.whitePrawn,nav.tigerPrawn].map(leaf)));
    seafoodBox.appendChild(shellfish);seafoodBox.appendChild(link(nav.cephalopods,'/products/seafood/cephalopods/'));links.appendChild(seafood);
    const produce=group('nav-produce',nav.fruitsVegetables,[]), produceBox=produce.querySelector('.nav-products-links');
    produceBox.appendChild(group('nav-fruits',nav.fruits,[nav.citrus,nav.exoticFruit,nav.otherFruit].map(leaf)));produceBox.appendChild(link(nav.vegetables,'/products/vegetables/'));links.appendChild(produce);
    links.appendChild(group('nav-seasonal',nav.seasonal,[link(nav.seasonalSelection,'/products/seasonal/')]));
  };
  const run=()=>doc.querySelectorAll('.nav-products > .nav-products-links').forEach(normalize);
  run();window.setTimeout(run,0);window.setTimeout(run,100);new MutationObserver(run).observe(body,{childList:true,subtree:true});
})();
