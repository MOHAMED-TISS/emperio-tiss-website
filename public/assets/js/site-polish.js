(() => {
  'use strict';
  const doc = document;
  const loadCss = (href, key) => {
    if (doc.querySelector(`link[data-${key}]`)) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset[key] = 'true';
    doc.head.appendChild(link);
  };
  const style = document.createElement('style');
  style.textContent = `
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){border-radius:999px!important;min-height:50px;padding-inline:22px;display:inline-flex;align-items:center;justify-content:center;gap:14px;font-family:var(--et-sans,"DM Sans",sans-serif)!important;font-size:10px!important;font-weight:700!important;letter-spacing:.1em!important;line-height:1!important;text-transform:uppercase;transition:transform .28s cubic-bezier(.165,.84,.44,1),background-color .28s ease,border-color .28s ease,box-shadow .28s ease}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(6,29,23,.14)}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):focus-visible{outline:2px solid #c9a35f;outline-offset:3px}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button)>span:last-child,:is(.text-link,.es-link,.intl-link,.ar-link,.product-card__link)>span:last-child,.product-arrow{font-size:0!important;line-height:0!important;width:1.2em;min-width:1.2em;display:inline-flex;align-items:center;justify-content:center}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button)>span:last-child::before,:is(.text-link,.es-link,.intl-link,.ar-link,.product-card__link)>span:last-child::before,.product-arrow::after{content:"";display:block;width:11px;height:7px;background:currentColor;clip-path:polygon(0 43%,78% 43%,58% 0,100% 50%,58% 100%,78% 57%,0 57%);transition:transform .28s cubic-bezier(.165,.84,.44,1)}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):hover>span:last-child::before,:is(.text-link,.es-link,.intl-link,.ar-link,.product-card__link):hover>span:last-child::before,.product-row:hover .product-arrow::after{transform:translateX(4px)}
    .home-page .button{min-height:52px;padding-inline:22px}.et-header-inner,.header-inner{backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:translateZ(0)}
    @media(max-width:800px){:is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){min-height:48px;padding-inline:19px;font-size:9px!important}}
  `;
  if (!['/contact/', '/contact'].includes(location.pathname)) doc.head.appendChild(style);
  const removeLegacyArrows = () => {
    doc.querySelectorAll('a,button,.product-arrow,.text-link,.es-link,.intl-link,.ar-link,.product-card__link').forEach(el => {
      const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);
      nodes.forEach(textNode => {
        textNode.nodeValue = (textNode.nodeValue || '').replace(/[↗↖↘↙→←•]/g, '');
      });
    });
  };
  if (!['/contact/', '/contact'].includes(location.pathname)) removeLegacyArrows();

  const ensureUniversalFooter = () => {
    // Footer ownership moved to /assets/js/footer-terminal.js.
    // Do not create or preserve the legacy .et-universal-footer here.
    const legacy = doc.querySelectorAll('footer.et-universal-footer');
    legacy.forEach((footer) => footer.remove());
  };
  ensureUniversalFooter();
})();
