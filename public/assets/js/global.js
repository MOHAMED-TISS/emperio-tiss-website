(() => {
  'use strict';
  const doc = document;
  const loadCss = (href, key) => { if (doc.querySelector(`link[data-${key}]`)) return; const link = doc.createElement('link'); link.rel='stylesheet'; link.href=href; link.dataset[key]='true'; doc.head.appendChild(link); };
  const loadScript = (src, key) => { if (doc.querySelector(`script[data-${key}]`)) return; const script=doc.createElement('script'); script.src=src; script.async=false; script.dataset[key]='true'; doc.head.appendChild(script); };
  const lang=(doc.documentElement.lang||'en').slice(0,2).toLowerCase();
  loadCss('/assets/css/site-pages.css?v=20260821-3','etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1','etUnifiedPages');
  loadCss('/assets/css/canonical-nav.css?v=20260823-taxonomy-5','etCanonicalNav');
  loadCss('/assets/css/catalogue-taxonomy.css?v=20260823-catalogue-1','etCatalogueTaxonomy');
  loadCss('/assets/css/nav-consistency.css?v=20260823-nav-1','etNavConsistency');
  loadCss('/assets/css/catalogue-type-scale-unified.css?v=20260823-es-baseline-2','etCatalogueTypeScale');
  loadCss('/assets/css/catalogue-filter-contrast-en-fr.css?v=20260823-filter-contrast-1','etCatalogueFilterContrast');
  if(['en','fr','ar'].includes(lang)) loadScript('/assets/js/international-shell.js?v=20260823-intl-shell-1','etInternationalShell');

  const socialCopy={es:{whatsapp:'Contactar por WhatsApp',linkedin:'LinkedIn'},en:{whatsapp:'Contact us on WhatsApp',linkedin:'LinkedIn'},fr:{whatsapp:'Contacter sur WhatsApp',linkedin:'LinkedIn'},ar:{whatsapp:'تواصل معنا عبر واتساب',linkedin:'LinkedIn'}}[lang]||{whatsapp:'Contact us on WhatsApp',linkedin:'LinkedIn'};
  const whatsappHref='https://wa.me/34614270684';
  const linkedinHref='https://www.linkedin.com/company/emperiotiss/';
  const whatsappIcon='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 3.5A10.9 10.9 0 0 0 13 1.1 10.9 10.9 0 0 0 3.2 17.4L2 22l4.7-1.2A10.9 10.9 0 1 0 20.5 3.5Zm-7.4 17.2a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-2.8.7.8-2.7-.2-.3a9.1 9.1 0 1 1 7.1 3.7Zm5-6.8c-.3-.2-1.8-.9-2-.9-.3-.1-.4-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.7-2.6-1.3-3.7-2.9-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6 0-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1.1 1.9-1.1 3 0 .7.2 1.3.5 1.9.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.5.6.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3Z"/></svg>';
  const linkedinIcon='<span aria-hidden="true" class="et-linkedin-mark">in</span>';
  const style=doc.createElement('style');
  style.id='et-social-actions-style';
  style.textContent=`
    .site-header .et-whatsapp,.et-header-inner .et-whatsapp,.header-inner .et-whatsapp,.p-header-inner .et-whatsapp,.es-header-inner .et-whatsapp{pointer-events:auto!important}
    .et-whatsapp,.et-linkedin{box-sizing:border-box;text-decoration:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;border-radius:999px!important;cursor:pointer!important;position:relative!important;z-index:1202!important;pointer-events:auto!important;transition:transform .28s ease,background-color .28s ease,border-color .28s ease,box-shadow .28s ease,color .28s ease!important;font-family:var(--et-sans,"DM Sans",Arial,sans-serif)!important;font-weight:700!important;line-height:1!important;white-space:nowrap!important}
    .et-whatsapp{height:38px!important;padding:0 14px!important;margin-inline-start:auto!important;border:1px solid rgba(16,37,28,.16)!important;background:rgba(255,255,255,.46)!important;color:#1b3a2f!important;font-size:9px!important;letter-spacing:.08em!important;text-transform:uppercase!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}
    .et-whatsapp svg{width:15px!important;height:15px!important;fill:currentColor!important;flex:none!important;pointer-events:none!important}
    .et-whatsapp:hover{transform:translateY(-1px)!important;background:rgba(255,255,255,.8)!important;border-color:rgba(201,163,95,.55)!important;box-shadow:0 8px 22px rgba(6,29,23,.12)!important}
    .et-linkedin{min-height:34px!important;padding:0 12px!important;border:1px solid rgba(255,255,255,.17)!important;background:rgba(255,255,255,.05)!important;color:rgba(255,255,255,.82)!important;font-size:9px!important;letter-spacing:.08em!important}
    .et-linkedin:hover{transform:translateY(-1px)!important;background:rgba(201,163,95,.12)!important;border-color:rgba(201,163,95,.55)!important;color:#fff!important;box-shadow:0 8px 20px rgba(0,0,0,.12)!important}
    .et-linkedin-mark{display:inline-grid!important;place-items:center!important;width:18px!important;height:18px!important;border-radius:4px!important;background:currentColor!important;color:#061613!important;font-size:11px!important;font-weight:800!important;line-height:1!important;letter-spacing:-.06em!important;pointer-events:none!important}
    @media(max-width:800px){.et-whatsapp{width:38px!important;height:38px!important;padding:0!important;margin-inline-start:8px!important;font-size:0!important;gap:0!important}.et-whatsapp svg{width:16px!important;height:16px!important}.et-linkedin{min-height:32px!important;padding:0 10px!important}}
  `;
  doc.head.appendChild(style);

  const ensureHeaderWhatsApp=()=>{
    const header=doc.querySelector('.site-header .header-inner,.et-header-inner,.header-inner,.p-header-inner,.es-header-inner');
    if(!header||header.querySelector('.et-whatsapp')) return;
    const link=doc.createElement('a');
    link.className='et-whatsapp'; link.href=whatsappHref; link.target='_blank'; link.rel='noopener noreferrer'; link.setAttribute('aria-label',socialCopy.whatsapp); link.innerHTML=`${whatsappIcon}<span>${socialCopy.whatsapp}</span>`;
    const menu=header.querySelector('#menuToggleBtn,.mobile-menu,.es-menu,.p-menu');
    if(menu) header.insertBefore(link,menu); else header.appendChild(link);
  };
  const ensureFooterLinkedIn=()=>{
    const footer=doc.querySelector('footer'); if(!footer||footer.querySelector('.et-linkedin')) return;
    const link=doc.createElement('a'); link.className='et-linkedin'; link.href=linkedinHref; link.target='_blank'; link.rel='noopener noreferrer'; link.setAttribute('aria-label',socialCopy.linkedin); link.innerHTML=`${linkedinIcon}<span>${socialCopy.linkedin}</span>`;
    const bottom=footer.querySelector('.et-footer-bottom,.et-footer-legal,.footer-band-inner,.ar-footer-inner'); if(bottom) bottom.appendChild(link); else footer.appendChild(link);
  };
  const enhance=()=>{ensureHeaderWhatsApp();ensureFooterLinkedIn();};
  enhance();
  const observer=new MutationObserver(enhance); observer.observe(doc.body,{childList:true,subtree:true});

  const catalogueImageSelector=['.fish-catalog-card img','.catalog-card img','.catalog-product img','.fish-gallery__image','.fish-lightbox__image','[data-catalog] img','.compact-catalog img','.seafood-catalog img','.fish-emblematic-card img'].join(',');
  const protectCatalogueImages=(root=doc)=>root.querySelectorAll(catalogueImageSelector).forEach(img=>{img.setAttribute('draggable','false');img.setAttribute('oncontextmenu','return false');img.setAttribute('ondragstart','return false');img.setAttribute('onselectstart','return false');img.style.userSelect='none';img.style.webkitUserDrag='none';img.style.webkitTouchCallout='none';});
  protectCatalogueImages();
  doc.addEventListener('contextmenu',event=>{if(event.target.closest(catalogueImageSelector))event.preventDefault();},true);
  doc.addEventListener('dragstart',event=>{const image=event.target.closest('img');if(image&&image.matches(catalogueImageSelector))event.preventDefault();},true);
  doc.addEventListener('selectstart',event=>{if(event.target.closest(catalogueImageSelector))event.preventDefault();},true);
  new MutationObserver(()=>protectCatalogueImages()).observe(doc.documentElement,{childList:true,subtree:true});

  loadScript('/assets/js/global-core.js?v=20260823-taxonomy-5','etGlobalCore');
  loadScript('/assets/js/catalog-polish.js?v=20260823-catalogue-polish-1','etCatalogPolish');
  loadScript('/assets/js/site-polish.js?v=20260823-site-polish-1','etSitePolish');
  loadScript('/assets/js/fish-filter-crossing.js?v=20260823-fish-filter-2','etFishFilterCrossing');
  loadScript('/assets/js/en-catalog-filter-fix.js?v=20260823-en-filter-2','etEnCatalogFilterFix');
})();