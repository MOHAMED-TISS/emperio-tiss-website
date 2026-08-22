(() => {
  'use strict';
  const doc=document;
  const origin='https://emperio-tiss.com';
  const path=(window.location.pathname.replace(/\/+$/,'/')||'/');
  const langMap={
    es:'/',en:'/en/',fr:'/fr/',ar:'/ar/'
  };
  const localePrefix={es:'',en:'/en',fr:'/fr',ar:'/ar'};
  const currentLang=path.startsWith('/en/')?'en':path.startsWith('/fr/')?'fr':path.startsWith('/ar/')?'ar':'es';
  const suffix=path==='/'||path===`/${currentLang}/`?'':path.slice(localePrefix[currentLang].length);
  const canonical=origin+path;
  if(!doc.querySelector('link[rel="canonical"]')){
    const link=doc.createElement('link'); link.rel='canonical'; link.href=canonical; doc.head.appendChild(link);
  }
  const add=(rel,hreflang,href)=>{
    const selector=`link[rel="alternate"][hreflang="${hreflang}"]`;
    if(doc.querySelector(selector)) return;
    const link=doc.createElement('link'); link.rel=rel; link.hreflang=hreflang; link.href=href; doc.head.appendChild(link);
  };
  Object.entries(localePrefix).forEach(([lang,prefix])=>{
    const target=lang==='es'?(suffix||'/'):(prefix+(suffix||'/'));
    add('alternate',lang,origin+target);
  });
  add('alternate','x-default',origin+(suffix||'/'));
})();
