(() => {
  'use strict';
  const doc=document;
  const loadCss=(href,key)=>{if(doc.querySelector(`link[data-${key}]`))return;const link=doc.createElement('link');link.rel='stylesheet';link.href=href;link.dataset[key]='true';doc.head.appendChild(link);};
  loadCss('/assets/css/universal-footer.css?v=20260823-footer-es-1','etUniversalFooter');
  const style=document.createElement('style');
  style.textContent=`
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){border-radius:999px!important;min-height:50px;padding-inline:22px;display:inline-flex;align-items:center;justify-content:center;gap:14px;font-family:var(--et-sans,"DM Sans",sans-serif)!important;font-size:10px!important;font-weight:700!important;letter-spacing:.1em!important;line-height:1!important;text-transform:uppercase;transition:transform .28s cubic-bezier(.165,.84,.44,1),background-color .28s ease,border-color .28s ease,box-shadow .28s ease}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(6,29,23,.14)}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):focus-visible{outline:2px solid #c9a35f;outline-offset:3px}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button)>span:last-child,:is(.text-link,.es-link,.intl-link,.ar-link,.product-card__link)>span:last-child,.product-arrow{font-size:0!important;line-height:0!important;width:1.2em;min-width:1.2em;display:inline-flex;align-items:center;justify-content:center}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button)>span:last-child::before,:is(.text-link,.es-link,.intl-link,.ar-link,.product-card__link)>span:last-child::before,.product-arrow::after{content:"";display:block;width:11px;height:7px;background:currentColor;clip-path:polygon(0 43%,78% 43%,58% 0,100% 50%,58% 100%,78% 57%,0 57%);transition:transform .28s cubic-bezier(.165,.84,.44,1)}
    :is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button):hover>span:last-child::before,:is(.text-link,.es-link,.intl-link,.ar-link,.product-card__link):hover>span:last-child::before,.product-row:hover .product-arrow::after{transform:translateX(4px)}
    .home-page .button{min-height:52px;padding-inline:22px}.et-header-inner,.header-inner{backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:translateZ(0)}
    @media(max-width:800px){:is(.button,.es-btn,.intl-btn,.ar-btn,.about-btn,.cta-button,.contact-button,.inquiry-button){min-height:48px;padding-inline:19px;font-size:9px!important}}
  `;
  doc.head.appendChild(style);
  const removeLegacyArrows=()=>{doc.querySelectorAll('a,button,.product-arrow,.text-link,.es-link,.intl-link,.ar-link,.product-card__link').forEach(el=>{const walker=doc.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];let node;while((node=walker.nextNode()))nodes.push(node);nodes.forEach(textNode=>{textNode.nodeValue=(textNode.nodeValue||'').replace(/[↗↖↘↙→←•]/g,'');});});};
  removeLegacyArrows();
  const ensureUniversalFooter=()=>{
    const lang=(doc.documentElement.lang||'').slice(0,2).toLowerCase();
    if(!['es','fr','it'].includes(lang)) return;
    doc.querySelectorAll('footer:not(.et-universal-footer)').forEach(footer=>footer.remove());
    if(doc.querySelector('.et-universal-footer')) return;
    const copy=lang==='fr'?{tagline:'Votre partenaire de confiance sur les marchés internationaux.',nav:'Navigation',home:'Accueil',company:'Entreprise',products:'Produits',markets:'Marchés',news:'Actualités',contact:'Contact',seafood:'Produits de la mer',fish:'Poissons',shellfish:'Fruits de mer & Crustacés',cephalopods:'Céphalopodes',fruits:'Fruits',vegetables:'Légumes',seasonal:'Produits de saison',inquiry:'Demande B2B',legal:'Mentions légales',privacy:'Politique de confidentialité',cookies:'Politique relative aux cookies',reserved:'Tous droits réservés.',disclaimer:'Les informations publiées sont fournies à titre informatif et ne constituent pas une offre contractuelle.',region:'MADRID · ESPAGNE · EUROPE · AFRIQUE · MÉDITERRANÉE'}:lang==='it'?{tagline:'Il tuo partner di fiducia nei mercati internazionali.',nav:'Navigazione',home:'Home',company:'Azienda',products:'Prodotti',markets:'Mercati',news:'Notizie',contact:'Contatti',seafood:'Prodotti del mare',fish:'Pesce',shellfish:'Molluschi & crostacei',cephalopods:'Cefalopodi',fruits:'Frutta',vegetables:'Ortaggi',seasonal:'Stagionale',inquiry:'Richiesta B2B',legal:'Note legali',privacy:'Privacy',cookies:'Cookie policy',reserved:'Tutti i diritti riservati.',disclaimer:'Le informazioni pubblicate sono fornite a titolo informativo e non costituiscono un’offerta contrattuale.',region:'MADRID · SPAGNA · EUROPA · AFRICA · MEDITERRANEO'}:{tagline:'Tu socio de confianza en los mercados internacionales.',nav:'Navegación',home:'Inicio',company:'Empresa',products:'Productos',markets:'Mercados',news:'Noticias',contact:'Contacto',seafood:'Productos del mar',fish:'Pescados',shellfish:'Mariscos & Crustáceos',cephalopods:'Cefalópodos',fruits:'Frutas',vegetables:'Hortalizas',seasonal:'Temporada',inquiry:'Consulta empresarial',legal:'Aviso legal',privacy:'Política de privacidad',cookies:'Política de cookies',reserved:'Todos los derechos reservados.',disclaimer:'La información publicada tiene carácter informativo y no constituye una oferta contractual.',region:'MADRID · ESPAÑA · EUROPA · ÁFRICA · MEDITERRÁNEO'};
    const base=lang==='fr'?'/fr/':lang==='it'?'/it/':'/';
    const legalBase='/legal/';
    const footer=doc.createElement('footer');footer.className='et-universal-footer';
    footer.innerHTML=`<div class="et-footer-container"><div class="et-footer-main"><div class="et-footer-brand"><img class="et-footer-logo" src="/logo.png" alt="EMPERIO TISS"><p>${copy.tagline}</p></div><div class="et-footer-column"><strong>${copy.nav}</strong><a href="${base}">${copy.home}</a><a href="${base}about/">${copy.company}</a><a href="${base}products/">${copy.products}</a><a href="${base}markets/">${copy.markets}</a><a href="${base}news/">${copy.news}</a><a href="${base}contact/">${copy.contact}</a></div><div class="et-footer-column"><strong>${copy.products}</strong><a href="${base}products/seafood/">${copy.seafood}</a><a href="${base}products/seafood/fish/">${copy.fish}</a><a href="${base}products/seafood/shellfish/">${copy.shellfish}</a><a href="${base}products/seafood/cephalopods/">${copy.cephalopods}</a><a href="${base}products/fruits/">${copy.fruits}</a><a href="${base}products/vegetables/">${copy.vegetables}</a><a href="${base}products/seasonal/">${copy.seasonal}</a></div><div class="et-footer-column"><strong>${copy.company}</strong><a href="${base}contact/">${copy.inquiry}</a><a href="${legalBase}aviso-legal.html">${copy.legal}</a><a href="${legalBase}privacidad.html">${copy.privacy}</a><a href="${legalBase}cookies.html">${copy.cookies}</a></div></div><div class="et-footer-legal"><p>© 2026 <span class="et-footer-company">EMPERIO TISS S.L.</span> ${copy.reserved}</p><p>${copy.disclaimer}</p></div><div class="et-footer-bottom"><span>EMPERIO TISS S.L.</span><span>${copy.region}</span></div></div>`;
    doc.body.appendChild(footer);
  };
  ensureUniversalFooter();

  const initSecureContactForm = () => {
    if (window.location.pathname !== '/contact/' || !window.turnstile) return;
    const form = doc.getElementById('contactForm');
    const status = doc.getElementById('contactFormStatus');
    const button = form?.querySelector('.form-submit');
    if (!form || !status || !button || form.dataset.etSecureTurnstile === 'true') return;
    form.dataset.etSecureTurnstile = 'true';

    const visibleWidget = form.querySelector('.cf-turnstile');
    if (visibleWidget) visibleWidget.style.display = 'none';

    const mount = doc.createElement('div');
    mount.className = 'cf-turnstile-execute';
    mount.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
    form.appendChild(mount);

    let widgetId = null;
    let resolving = false;
    let resolveToken = null;
    let rejectToken = null;

    const ensureWidget = () => {
      if (widgetId !== null || !window.turnstile) return;
      widgetId = window.turnstile.render(mount, {
        sitekey: '0x4AAAAAAEaIn_beKLMv4VjA',
        action: 'contact',
        execution: 'execute',
        appearance: 'interaction-only',
        callback: (token) => {
          resolving = false;
          if (resolveToken) { const resolve = resolveToken; resolveToken = null; rejectToken = null; resolve(token); }
        },
        'expired-callback': () => {
          resolving = false;
          if (rejectToken) { const reject = rejectToken; resolveToken = null; rejectToken = null; reject(new Error('La verificación de seguridad ha caducado.')); }
        },
        'error-callback': (code) => {
          resolving = false;
          if (rejectToken) { const reject = rejectToken; resolveToken = null; rejectToken = null; reject(new Error(`Turnstile error: ${code || 'unknown'}`)); }
        },
      });
    };

    const getToken = async () => {
      ensureWidget();
      if (widgetId === null) throw new Error('No se pudo inicializar la verificación de seguridad.');
      if (resolving) throw new Error('La verificación de seguridad ya está en curso.');
      resolving = true;
      return new Promise((resolve, reject) => {
        resolveToken = resolve;
        rejectToken = reject;
        window.turnstile.execute(widgetId);
      });
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity() || button.disabled) return;
      button.disabled = true;
      status.textContent = 'Verificando seguridad…';
      status.dataset.state = 'pending';
      try {
        const token = await getToken();
        let input = form.querySelector('#contactTurnstileToken');
        if (!input) { input = doc.createElement('input'); input.type='hidden'; input.id='contactTurnstileToken'; input.name='cf-turnstile-response'; form.appendChild(input); }
        input.value = token;
        status.textContent = 'Enviando consulta…';
        const response = await fetch('/api/contact', { method:'POST', body:new FormData(form), headers:{ Accept:'application/json' } });
        const result = await response.json().catch(()=>({}));
        if (!response.ok || !result.ok) {
          const codes = Array.isArray(result.turnstileErrors) ? result.turnstileErrors.join(', ') : '';
          throw new Error((result.error || 'No se pudo enviar la consulta.') + (codes ? ` (${codes})` : ''));
        }
        status.textContent = 'Consulta enviada correctamente. Gracias.';
        status.dataset.state = 'success';
        form.reset();
        input.value='';
        if (widgetId !== null) window.turnstile.reset(widgetId);
      } catch (error) {
        status.textContent = error.message || 'No se pudo enviar la consulta. Inténtalo de nuevo.';
        status.dataset.state = 'error';
        const input = form.querySelector('#contactTurnstileToken'); if (input) input.value='';
        if (widgetId !== null) window.turnstile.reset(widgetId);
      } finally {
        button.disabled = false;
      }
    }, true);

    ensureWidget();
  };

  const bootContact = () => {
    if (window.turnstile) initSecureContactForm();
    else window.setTimeout(bootContact, 200);
  };
  if (window.location.pathname === '/contact/') {
    bootContact();
    window.addEventListener('load', bootContact, {once:true});
  }
})();
