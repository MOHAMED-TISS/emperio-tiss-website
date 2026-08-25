(() => {
  'use strict';

  const doc = document;
  const root = document.documentElement;
  const body = document.body;
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
    es:{home:'Inicio',company:'Nuestra propuesta',products:'Productos',seafood:'Productos del mar',fish:'Pescados',shellfish:'Mariscos & Crustáceos',cephalopods:'Cefalópodos',fruits:'Frutas',vegetables:'Hortalizas',seasonal:'Temporada',markets:'Mercados',news:'Noticias',contact:'Contacto',open:'Abrir menú',close:'Cerrar menú'},
    en:{home:'Home',company:'Our approach',products:'Products',seafood:'Seafood',fish:'Fish',shellfish:'Shellfish & Crustaceans',cephalopods:'Cephalopods',fruits:'Fruits',vegetables:'Vegetables',seasonal:'Seasonal',markets:'Markets',news:'News',contact:'Contact',open:'Open menu',close:'Close menu'},
    fr:{home:'Accueil',company:'Notre approche',products:'Produits',seafood:'Produits de la mer',fish:'Poissons',shellfish:'Fruits de mer & Crustacés',cephalopods:'Céphalopodes',fruits:'Fruits',vegetables:'Légumes',seasonal:'Saison',markets:'Marchés',news:'Actualités',contact:'Contact',open:'Ouvrir le menu',close:'Fermer le menu'},
    ar:{home:'الرئيسية',company:'نهجنا',products:'المنتجات',seafood:'منتجات البحر',fish:'الأسماك',shellfish:'المأكولات البحرية والقشريات',cephalopods:'رأسيات الأرجل',fruits:'الفواكه',vegetables:'الخضروات',seasonal:'الموسمية',markets:'الأسواق',news:'الأخبار',contact:'اتصل بنا',open:'فتح القائمة',close:'إغلاق القائمة'},
    it:{home:'Home',company:'La nostra proposta',products:'Prodotti',seafood:'Prodotti del mare',fish:'Pesce',shellfish:'Molluschi & crostacei',cephalopods:'Cefalopodi',fruits:'Frutta',vegetables:'Ortaggi',seasonal:'Stagionale',markets:'Mercati',news:'Notizie',contact:'Contatti',open:'Apri il menu',close:'Chiudi il menu'}
  }[lang] || {
    home:'Home',company:'Our approach',products:'Products',seafood:'Seafood',fish:'Fish',shellfish:'Shellfish & Crustaceans',cephalopods:'Cephalopods',fruits:'Fruits',vegetables:'Vegetables',seasonal:'Seasonal',markets:'Markets',news:'News',contact:'Contact',open:'Open menu',close:'Close menu'
  };

  const paths = {
    es:{home:'/',company:'/about/',products:'/products/',seafood:'/products/seafood/',fish:'/products/seafood/fish/',shellfish:'/products/seafood/shellfish/',cephalopods:'/products/seafood/cephalopods/',fruits:'/products/fruits/',vegetables:'/products/vegetables/',seasonal:'/products/seasonal/',markets:'/markets/',news:'/news/',contact:'/contact/'},
    en:{home:'/en/',company:'/en/about/',products:'/en/products/',seafood:'/en/products/seafood/',fish:'/en/products/seafood/fish/',shellfish:'/en/products/seafood/shellfish/',cephalopods:'/en/products/seafood/cephalopods/',fruits:'/en/products/fruits/',vegetables:'/en/products/vegetables/',seasonal:'/en/products/seasonal/',markets:'/en/markets/',news:'/en/news/',contact:'/en/contact/'},
    fr:{home:'/fr/',company:'/fr/about/',products:'/fr/products/',seafood:'/fr/products/seafood/',fish:'/fr/products/seafood/fish/',shellfish:'/fr/products/seafood/shellfish/',cephalopods:'/fr/products/seafood/cephalopods/',fruits:'/fr/products/fruits/',vegetables:'/fr/products/vegetables/',seasonal:'/fr/products/seasonal/',markets:'/fr/markets/',news:'/fr/news/',contact:'/fr/contact/'},
    ar:{home:'/ar/',company:'/ar/about/',products:'/ar/products/',seafood:'/ar/products/seafood/',fish:'/ar/products/seafood/fish/',shellfish:'/ar/products/seafood/shellfish/',cephalopods:'/ar/products/seafood/cephalopods/',fruits:'/ar/products/fruits/',vegetables:'/ar/products/vegetables/',seasonal:'/ar/products/seasonal/',markets:'/ar/markets/',news:'/ar/news/',contact:'/ar/contact/'},
    it:{home:'/it/',company:'/it/about/',products:'/it/products/',seafood:'/it/products/seafood/',fish:'/it/products/seafood/fish/',shellfish:'/it/products/seafood/shellfish/',cephalopods:'/it/products/seafood/cephalopods/',fruits:'/it/products/fruits/',vegetables:'/it/products/vegetables/',seasonal:'/it/products/seasonal/',markets:'/it/markets/',news:'/it/news/',contact:'/it/contact/'}
  };

  const contactCopy = {
    es:{sending:'Enviando consulta…',success:'Consulta enviada correctamente. Gracias.',error:'No se pudo enviar la consulta. Inténtalo de nuevo.'},
    en:{sending:'Sending enquiry…',success:'Enquiry sent successfully. Thank you.',error:'Could not send the enquiry. Please try again.'},
    fr:{sending:'Envoi de la demande…',success:'Demande envoyée avec succès. Merci.',error:'Impossible d’envoyer la demande. Veuillez réessayer.'},
    it:{sending:'Invio della richiesta…',success:'Richiesta inviata correttamente. Grazie.',error:'Impossibile inviare la richiesta. Riprova.'},
    ar:{sending:'جارٍ إرسال الطلب…',success:'تم إرسال الطلب بنجاح. شكرًا لكم.',error:'تعذر إرسال الطلب. حاولوا مرة أخرى.'}
  }[lang] || {sending:'Sending enquiry…',success:'Enquiry sent successfully. Thank you.',error:'Could not send the enquiry. Please try again.'};

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
      <a class="about-menu-contact" href="${P.contact}">${idx('06',labels.contact)}</a>`;
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

  const initContactForm = () => {
    if (!/^\/(en|fr|it|ar)\/contact\/?$/.test(window.location.pathname) && !/^\/contact\/?$/.test(window.location.pathname)) return;
    const form = doc.getElementById('contactForm');
    const status = doc.getElementById('contactFormStatus');
    const button = form?.querySelector('.form-submit');
    if (!form || !status || !button || form.dataset.etSubmitBound === 'true') return;

    form.dataset.etSubmitBound = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;

      const honey = form.querySelector('input[name="_honey"]');
      if (honey?.value) return;

      button.disabled = true;
      status.textContent = contactCopy.sending;
      status.dataset.state = 'pending';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || contactCopy.error);
        form.reset();
        status.textContent = contactCopy.success;
        status.dataset.state = 'success';
      } catch (error) {
        status.textContent = error.message || contactCopy.error;
        status.dataset.state = 'error';
      } finally {
        button.disabled = false;
      }
    }, true);
  };

  initContactForm();
  window.addEventListener('load', initContactForm, { once: true });
})();
