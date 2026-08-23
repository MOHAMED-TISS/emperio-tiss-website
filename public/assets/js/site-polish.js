/* EMPERIO TISS — shared CTA and arrow polish */
(() => {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    :root{--et-cta-gold:#c9a35f;--et-cta-deep:#061d17}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){
      border-radius:999px!important;min-height:50px;padding-inline:22px;display:inline-flex;align-items:center;justify-content:center;gap:14px;
      font-family:var(--et-sans,"DM Sans",sans-serif)!important;font-size:10px!important;font-weight:700!important;letter-spacing:.1em!important;line-height:1!important;text-transform:uppercase;
      transition:transform .28s cubic-bezier(.165,.84,.44,1),background-color .28s ease,border-color .28s ease,box-shadow .28s ease,color .28s ease;will-change:transform}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(6,29,23,.14)}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):focus-visible{outline:2px solid var(--et-cta-gold);outline-offset:3px}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button,.text-link,.es-link,.intl-link,.ar-link,.product-card__link,.product-arrow) span[aria-hidden="true"],
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button) span:last-child{display:inline-flex;align-items:center;justify-content:center;font-family:var(--et-sans,"DM Sans",sans-serif)!important;font-size:15px!important;font-weight:400!important;line-height:1!important;letter-spacing:0!important;transform:translateX(0);transition:transform .28s cubic-bezier(.165,.84,.44,1)}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):hover span:last-child{transform:translateX(4px)}
    :is(.footer-column a,.text-link,.es-link,.intl-link,.ar-link,.product-card__link){transition:color .25s ease,transform .25s ease}
    :is(.footer-column a,.text-link,.es-link,.intl-link,.ar-link,.product-card__link):hover{color:var(--et-cta-gold)!important}
    .home-page .button{border-radius:999px!important;min-height:52px;padding-inline:22px}.home-page .button:hover{transform:translateY(-2px)!important}
    @media(max-width:800px){:is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){min-height:48px;padding-inline:19px;font-size:9px!important}}
  `;
  document.head.appendChild(style);

  const replaceTextNode = (node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const text = node.nodeValue || '';
    if (!/[↗↖↘↙→←•]/.test(text)) return;
    node.nodeValue = text.replace(/[↗↖↘↙→←•]/g, (glyph) => {
      if (glyph === '•') return '·';
      if (glyph === '←') return '‹';
      if (glyph === '→') return '›';
      return '↗';
    });
  };

  const normalizeArrows = (root = document) => {
    root.querySelectorAll('a,button,.product-arrow,.text-link,.es-link,.intl-link,.ar-link,.product-card__link').forEach((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);
      nodes.forEach(replaceTextNode);
    });
  };

  normalizeArrows();
  const observer = new MutationObserver(() => normalizeArrows());
  observer.observe(document.body, {childList:true,subtree:true});
})();
