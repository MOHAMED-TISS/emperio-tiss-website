(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const get = (selector, scope = doc) => scope.querySelector(selector);
  const overlaySelector = '#navOverlay,.nav-overlay,.intl-overlay';
  const buttonSelector = '#menuToggleBtn,.mobile-menu,.es-menu,.intl-menu';
  const header = get('.site-header,.p-header');

  root.classList.remove('et-pointer-ready');
  get('.et-pointer')?.remove();

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const lang = (root.lang || 'en').slice(0, 2).toLowerCase();
  const labels = {
    es:{home:'Inicio',company:'Empresa',products:'Productos',seafood:'Productos del mar',fish:'Pescados',shellfish:'Mariscos & Crustáceos',cephalopods:'Cefalópodos',fruits:'Frutas',vegetables:'Hortalizas',seasonal:'Temporada',markets:'Mercados',news:'Noticias',contact:'Contacto',open:'Abrir menú',close:'Cerrar menú'},
    en:{home:'Home',company:'Company',products:'Products',seafood:'Seafood',fish:'Fish',shellfish:'Shellfish & Crustaceans',cephalopods:'Cephalopods',fruits:'Fruits',vegetables:'Vegetables',seasonal:'Seasonal',markets:'Markets',news:'News',contact:'Contact',open:'Open menu',close:'Close menu'},
    fr:{home:'Accueil',company:'Entreprise',products:'Produits',seafood:'Produits de la mer',fish:'Poissons',shellfish:'Fruits de mer & Crustacés',cephalopods:'Céphalopodes',fruits:'Fruits',vegetables:'Légumes',seasonal:'Saison',markets:'Marchés',news:'Actualités',contact:'Contact',open:'Ouvrir le menu',close:'Fermer le menu'},
    ar:{home:'الرئيسية',company:'الشركة',products:'المنتجات',seafood:'منتجات البحر',fish:'الأسماك',shellfish:'المأكولات البحرية والقشريات',cephalopods:'رأسيات الأرجل',fruits:'الفواكه',vegetables:'الخضروات',seasonal:'الموسمية',markets:'الأسواق',news:'الأخبار',contact:'اتصل بنا',open:'فتح القائمة',close:'إغلاق القائمة'},
    it:{home:'Home',company:'Azienda',products:'Prodotti',seafood:'Prodotti del mare',fish:'Pesce',shellfish:'Molluschi & crostacei',cephalopods:'Cefalopodi',fruits:'Frutta',vegetables:'Ortaggi',seasonal:'Stagionale',markets:'Mercati',news:'Notizie',contact:'Contatti',open:'Apri il menu',close:'Chiudi il menu'}
  }[lang] || {
    home:'Home',company:'Company',products:'Products',seafood:'Seafood',fish:'Fish',shellfish:'Shellfish & Crustaceans',cephalopods:'Cephalopods',fruits:'Fruits',vegetables:'Vegetables',seasonal:'Seasonal',markets:'Markets',news:'News',contact:'Contact',open:'Open menu',close:'Close menu'
  };

  const paths = {
    es:{home:'/',company:'/about/',products:'/products/',seafood:'/products/seafood/',fish:'/products/seafood/fish/',shellfish:'/products/seafood/shellfish/',cephalopods:'/products/seafood/cephalopods/',fruits:'/products/fruits/',vegetables:'/products/vegetables/',seasonal:'/products/seasonal/',markets:'/markets/',news:'/news/',contact:'/contact/'},
    en:{home:'/en/',company:'/en/about/',products:'/en/products/',seafood:'/en/products/seafood/',fish:'/en/products/seafood/fish/',shellfish:'/en/products/seafood/shellfish/',cephalopods:'/en/products/seafood/cephalopods/',fruits:'/en/products/fruits/',vegetables:'/en/products/vegetables/',seasonal:'/en/products/seasonal/',markets:'/en/markets/',news:'/en/news/',contact:'/en/contact/'},
    fr:{home:'/fr/',company:'/fr/about/',products:'/fr/products/',seafood:'/fr/products/seafood/',fish:'/fr/products/seafood/fish/',shellfish:'/fr/products/seafood/shellfish/',cephalopods:'/fr/products/seafood/cephalopods/',fruits:'/fr/products/fruits/',vegetables:'/fr/products/vegetables/',seasonal:'/fr/products/seasonal/',markets:'/fr/markets/',news:'/fr/news/',contact:'/fr/contact/'},
    ar:{home:'/ar/',company:'/ar/about/',products:'/ar/products/',seafood:'/ar/products/seafood/',fish:'/ar/products/seafood/fish/',shellfish:'/ar/products/seafood/shellfish/',cephalopods:'/ar/products/seafood/cephalopods/',fruits:'/ar/products/fruits/',vegetables:'/ar/products/vegetables/',seasonal:'/ar/products/seasonal/',markets:'/ar/markets/',news:'/ar/news/',contact:'/ar/contact/'},
    it:{home:'/it/',company:'/it/about/',products:'/it/products/',seafood:'/it/products/seafood/',fish:'/it/products/seafood/fish/',shellfish:'/it/products/seafood/shellfish/',cephalopods:'/it/products/seafood/cephalopods/',fruits:'/it/products/fruits/',vegetables:'/it/products/vegetables/',seasonal:'/it/products/seasonal/',markets:'/it/markets/',news:'/it/news/',contact:'/it/contact/'}
  };

  const L = paths[lang] ? lang : 'en';
  const P = paths[L];
  const idx = (n,text) => `<span class="idx">${n}</span><span>${text}</span>`;

  const normalizeMenuOverlays = () => {
    doc.querySelectorAll(overlaySelector).forEach((overlay) => {
      const ownerHeader = overlay.closest('.site-header,.p-header,.et-header-inner,.header-inner');
      if (ownerHeader && overlay.parentElement !== body) body.appendChild(overlay);
    });
  };

  const buildNavigation = () => {
    normalizeMenuOverlays();
    const nav = get('.nav-overlay-links');
    if (!nav || nav.dataset.etNavigationBuilt === 'true') return;
    nav.innerHTML = `
      <a href="${P.home}">${idx('01',labels.home)}</a>
      <a href="${P.company}">${idx('02',labels.company)}</a>
      <details class="nav-products">
        <summary>${idx('03',labels.products)}</summary>
        <div class="nav-products-links">
          <details class="nav-seafood">
            <summary>${labels.seafood}</summary>
            <div class="nav-products-links">
              <a class="nav-product-leaf" href="${P.fish}">${labels.fish}</a>
              <a class="nav-product-leaf" href="${P.shellfish}">${labels.shellfish}</a>
              <a class="nav-product-leaf" href="${P.cephalopods}">${labels.cephalopods}</a>
            </div>
          </details>
          <a href="${P.fruits}">${labels.fruits}</a>
          <a href="${P.vegetables}">${labels.vegetables}</a>
          <a href="${P.seasonal}">${labels.seasonal}</a>
        </div>
      </details>
      <a href="${P.markets}">${idx('04',labels.markets)}</a>
      <a href="${P.news}">${idx('05',labels.news)}</a>
      <a href="${P.contact}">${idx('06',labels.contact)}</a>`;
    nav.setAttribute('dir',lang==='ar'?'rtl':'ltr');
    nav.dataset.etNavigationBuilt='true';
  };

  const setMenuOpen = (button,overlay,open) => {
    normalizeMenuOverlays();
    body.classList.toggle('nav-open',open);
    body.classList.toggle('menu-open',open);
    root.classList.toggle('menu-is-open',open);
    button.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?labels.close:labels.open);
    overlay.setAttribute('aria-hidden',String(!open));
  };

  const closeMenu = () => {
    const button=get(buttonSelector);
    const overlay=get(overlaySelector);
    if(button&&overlay)setMenuOpen(button,overlay,false);
  };

  doc.addEventListener('click',(event)=>{
    const button=event.target.closest(buttonSelector);
    if(button){
      normalizeMenuOverlays();
      const overlay=get(overlaySelector);
      if(!overlay)return;
      event.preventDefault();event.stopPropagation();
      const open=body.classList.contains('nav-open')||body.classList.contains('menu-open');
      setMenuOpen(button,overlay,!open);return;
    }
    const overlay=event.target.closest(overlaySelector);
    if(!overlay)return;
    if(event.target===overlay||event.target.closest('.nav-overlay-close,.intl-overlay-close')){closeMenu();return;}
    if(event.target.closest('a'))closeMenu();
  },true);

  doc.addEventListener('keydown',(event)=>{if(event.key==='Escape')closeMenu();});
  window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMenu();},{passive:true});

  const initDynamicParts=()=>{normalizeMenuOverlays();buildNavigation();};
  initDynamicParts();
  new MutationObserver(initDynamicParts).observe(doc.body,{childList:true,subtree:true});

  const initContactTurnstile = () => {
    if (window.location.pathname !== '/contact/') return;
    const form = doc.getElementById('contactForm');
    const widget = form?.querySelector('.cf-turnstile');
    if (!form || !widget || form.dataset.etContactTurnstileInit === 'true') return;

    const start = () => {
      if (!window.turnstile || typeof window.turnstile.render !== 'function') return false;
      if (form.dataset.etContactTurnstileInit === 'true') return true;

      form.dataset.etContactTurnstileInit = 'true';
      widget.innerHTML = '';

      const tokenInput = doc.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'cf-turnstile-response';
      tokenInput.id = 'contactTurnstileToken';
      tokenInput.value = '';
      form.appendChild(tokenInput);

      const widgetId = window.turnstile.render(widget, {
        sitekey: '0x4AAAAAAEaIn_beKLMv4VjA',
        action: 'contact',
        theme: 'auto',
        callback: (token) => { tokenInput.value = token || ''; },
        'expired-callback': () => { tokenInput.value = ''; },
        'error-callback': () => { tokenInput.value = ''; },
      });

      form.dataset.turnstileWidgetId = String(widgetId);
      return true;
    };

    if (start()) return;

    let attempts = 0;
    const waitForTurnstile = window.setInterval(() => {
      attempts += 1;
      if (start() || attempts >= 100) window.clearInterval(waitForTurnstile);
    }, 100);
  };

  const bindContactForm = () => {
    if (window.location.pathname !== '/contact/') return;
    const form = doc.getElementById('contactForm');
    const status = doc.getElementById('contactFormStatus');
    const button = form?.querySelector('.form-submit');
    const tokenInput = doc.getElementById('contactTurnstileToken');
    if (!form || !status || !button || !tokenInput || form.dataset.etSubmitBound === 'true') return;

    form.dataset.etSubmitBound = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;

      const widgetId = form.dataset.turnstileWidgetId;
      const token = widgetId && window.turnstile ? window.turnstile.getResponse(widgetId) : tokenInput.value;
      tokenInput.value = token || '';
      if (!tokenInput.value) {
        status.textContent = 'Completa la verificación de seguridad antes de enviar.';
        status.dataset.state = 'error';
        initContactTurnstile();
        return;
      }

      button.disabled = true;
      status.textContent = 'Enviando consulta…';
      status.dataset.state = 'pending';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) {
          const codes = Array.isArray(result.turnstileErrors) ? result.turnstileErrors.join(', ') : '';
          const suffix = codes ? ` (${codes})` : '';
          throw new Error((result.error || 'No se pudo enviar la consulta.') + suffix);
        }
        form.reset();
        tokenInput.value = '';
        if (window.turnstile && widgetId) window.turnstile.reset(widgetId);
        status.textContent = 'Consulta enviada correctamente. Gracias.';
        status.dataset.state = 'success';
      } catch (error) {
        tokenInput.value = '';
        if (window.turnstile && widgetId) window.turnstile.reset(widgetId);
        status.textContent = error.message || 'No se pudo enviar la consulta. Inténtalo de nuevo.';
        status.dataset.state = 'error';
      } finally {
        button.disabled = false;
      }
    }, true);
  };

  const initContact = () => {
    initContactTurnstile();
    bindContactForm();
  };

  initContact();
  window.setTimeout(initContact, 150);
  window.setTimeout(initContact, 500);
  window.setTimeout(initContact, 1200);
  window.setTimeout(initContact, 2500);
  window.addEventListener('load', initContact, { once: true });
})();
