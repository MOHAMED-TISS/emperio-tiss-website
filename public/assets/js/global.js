(() => {
  'use strict';
  const doc=document;
  const css=doc.createElement('link');
  css.rel='stylesheet';
  css.href='/assets/css/site-pages.css?v=20260821-2';
  css.dataset.etSitePages='true';
  doc.head.appendChild(css);
  const script=doc.createElement('script');
  script.src='/assets/js/global-core.js?v=20260821-1';
  script.defer=true;
  doc.head.appendChild(script);
})();
