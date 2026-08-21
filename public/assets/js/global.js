(() => {
  'use strict';
  const doc=document;
  const loadCss=(href,key)=>{if(doc.querySelector(`link[data-${key}]`))return;const link=doc.createElement('link');link.rel='stylesheet';link.href=href;link.dataset[key]='true';doc.head.appendChild(link)};
  loadCss('/assets/css/site-pages.css?v=20260821-3','etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1','etUnifiedPages');
  const script=doc.createElement('script');script.src='/assets/js/global-core.js?v=20260821-2';script.defer=true;doc.head.appendChild(script);
})();
