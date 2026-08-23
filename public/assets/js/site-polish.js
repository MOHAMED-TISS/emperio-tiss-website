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

  loadCss('/assets/css/universal-footer.css?v=20260823-footer-es-1', 'etUniversalFooter');

  const style = doc.createElement('style');
  style.textContent = `
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){
      border-radius:999px!important;
      min-height:50px;
      padding-inline:22px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:14px;
      font-family:var(--et-sans,"DM Sans",sans-serif)!important;
      font-size:10px!important;
      font-weight:700!important;
      letter-spacing:.1em!important;
      line-height:1!important;
      text-transform:uppercase;
      transition:transform .28s cubic-bezier(.165,.84,.44,1),background-color .28s ease,border-color .28s ease,box-shadow .28s ease,color .28s ease;
    }
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):hover{
      transform:translateY(-2px);
      box-shadow:0 12px 28px rgba(6,29,23,.14);
    }
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):focus-visible{
      outline:2px solid #c9a35f;
      outline-offset:3px;
    }
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button,.text-link,.es-link,.intl-link,.ar-link,.product-card__link) > span[aria-hidden="true"]{
      display:none!important;
    }
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button,.text-link,.es-link,.intl-link,.ar-link,.product-card__link){
      position:relative;
    }
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button,.text-link,.es-link,.intl-link,.ar-link,.product-card__link)::after{
      content:"";
      width:8px;
      height:8px;
      border-top:1px solid currentColor;
      border-right:1px solid currentColor;
      transform:rotate(45deg) translateY(1px);
      transform-origin:center;
      opacity:.8;
      transition:transform .28s cubic-bezier(.165,.84,.44,1),opacity .28s ease;
    }
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button,.text-link,.es-link,.intl-link,.ar-link,.product-card__link):hover::after{
      transform:rotate(45deg) translate(3px,1px);
      opacity:1;
    }
    .home-page .button{border-radius:999px!important;min-height:52px;padding-inline:22px}
    .home-page .button:hover{transform:translateY(-2px)!important}
    @media(max-width:800px){
      :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){min-height:48px;padding-inline:19px;font-size:9px!important}
    }
  `;
  doc.head.appendChild(style);

  const stripDecorativeArrows = () => {
    const selector = 'a,button,.product-arrow,.text-link,.es-link,.intl-link,.ar-link,.product-card__link';
    doc.querySelectorAll(selector).forEach((el) => {
      const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);
      nodes.forEach((textNode) => {
        const text = textNode.nodeValue || '';
        if (!/[↗↖↘↙→←•]/.test(text)) return;
        textNode.nodeValue = text.replace(/[↗↖↘↙→←•]/g, '');
      });
    });
  };

  const ensureEsUniversalFooter = () => {
    if (!(doc.documentElement.lang || '').toLowerCase().startsWith('es')) return;
    doc.querySelectorAll('footer:not(.et-universal-footer)').forEach((footer) => footer.remove());
    if (doc.querySelector('.et-universal-footer')) return;
    const footer = doc.createElement('footer');
    footer.className = 'et-universal-footer';
    footer.innerHTML = `<div class="et-footer-container"><div class="et-footer-main"><div class="et-footer-brand"><img class="et-footer-logo" src="/logo.png" alt="EMPERIO TISS"><p>Tu socio de confianza en los mercados internacionales.</p></div><div class="et-footer-column"><strong>Navegación</strong><a href="/">Inicio</a><a href="/about/">Empresa</a><a href="/products/">Productos</a><a href="/markets/">Mercados</a><a href="/news/">Noticias</a><a href="/contact/">Contacto</a></div><div class="et-footer-column"><strong>Productos</strong><a href="/products/seafood/">Productos del mar</a><a href="/products/seafood/fish/">Pescados</a><a href="/products/seafood/shellfish/">Mariscos &amp; Crustáceos</a><a href="/products/seafood/cephalopods/">Cefalópodos</a><a href="/products/fruits/">Frutas</a><a href="/products/vegetables/">Hortalizas</a><a href="/products/seasonal/">Temporada</a></div><div class="et-footer-column"><strong>Empresa</strong><a href="/contact/">Consulta empresarial</a><a href="/legal/aviso-legal.html">Aviso legal</a><a href="/legal/privacidad.html">Política de privacidad</a><a href="/legal/cookies.html">Política de cookies</a></div></div><div class="et-footer-legal"><p>© 2026 <span class="et-footer-company">EMPERIO TISS S.L.</span> Todos los derechos reservados.</p><p>La información publicada tiene carácter informativo y no constituye una oferta contractual.</p></div><div class="et-footer-bottom"><span>EMPERIO TISS S.L.</span><span>MADRID · ESPAÑA · EUROPA · ÁFRICA · MEDITERRÁNEO</span></div></div>`;
    doc.body.appendChild(footer);
  };

  ensureEsUniversalFooter();
  stripDecorativeArrows();

  new MutationObserver(() => {
    ensureEsUniversalFooter();
    stripDecorativeArrows();
  }).observe(doc.body, { childList: true, subtree: true });
})();
