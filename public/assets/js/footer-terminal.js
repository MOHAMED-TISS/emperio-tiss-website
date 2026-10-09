(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  if (!body || body.classList.contains('private-admin-page')) return;

  const VERSION = '20261008-footer-premium-1';
  if (window.__etTerminalFooterVersion === VERSION) return;
  window.__etTerminalFooterVersion = VERSION;

  const loadCss = () => {
    if (doc.querySelector('link[data-et-terminal-footer], link[data-et-bundle~="/assets/css/footer-terminal.css"]')) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/footer-terminal.css?v=20261008-footer-1';
    link.dataset.etTerminalFooter = 'true';
    doc.head.appendChild(link);
  };
  loadCss();

  const isPrivatePortal = body.classList.contains('private-page');
  const langRaw = (doc.documentElement.lang || 'es').slice(0,2).toLowerCase();
  const lang = ['es','en','fr','it','ar'].includes(langRaw) ? langRaw : 'es';
  const base = lang === 'es' ? '/' : `/${lang}/`;
  const route = (segment) => `${base}${segment}/`;

  const copy = {
    es: {
      blurb:'Productos del mar, frutas y hortalizas para el suministro profesional entre Europa, África y el Mediterráneo.',
      location:'Madrid · España',
      signature:'EMPERIO Signature',
      follow:'Síganos',
      kicker:'EMPERIO TISS · SUMINISTRO PROFESIONAL',
      title:'Su próximo suministro empieza aquí.',
      action:'Hablemos de su suministro',
      featureLabel:'EMPERIO SIGNATURE',
      featureTitle:'Acceso profesional',
      featureText:'Oportunidades seleccionadas para empresas aprobadas.',
      products:'Productos',
      seafood:'Productos del mar',
      fruits:'Frutas',
      vegetables:'Hortalizas',
      seasonal:'Temporada',
      company:'Empresa',
      about:'Quiénes somos',
      markets:'Mercados',
      news:'Noticias',
      contact:'Contacto',
      reach:'CONTACTO',
      reachTitle:'¿Preparando su próximo suministro?',
      reachText:'Escríbanos hoy.',
      email:'info@emperio-tiss.com',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Aviso legal',
      privacy:'Privacidad',
      cookies:'Cookies',
      region:'Madrid · España · Europa · África · Mediterráneo',
      copyright:'Copyright EMPERIO TISS S.L. © 2026'
    },
    en: {
      blurb:'Seafood, fruit and vegetables for professional supply between Europe, Africa and the Mediterranean.',
      location:'Madrid · Spain',
      signature:'EMPERIO Signature',
      follow:'Follow us',
      kicker:'EMPERIO TISS · PROFESSIONAL SUPPLY',
      title:'Your next supply starts here.',
      action:'Talk to us about your supply',
      featureLabel:'EMPERIO SIGNATURE',
      featureTitle:'Professional access',
      featureText:'Selected opportunities for approved companies.',
      products:'Products',
      seafood:'Seafood',
      fruits:'Fruit',
      vegetables:'Vegetables',
      seasonal:'Seasonal',
      company:'Company',
      about:'About us',
      markets:'Markets',
      news:'News',
      contact:'Contact',
      reach:'REACH US',
      reachTitle:'Planning your next supply?',
      reachText:'Get in touch today.',
      email:'info@emperio-tiss.com',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Legal notice',
      privacy:'Privacy',
      cookies:'Cookies',
      region:'Madrid · Spain · Europe · Africa · Mediterranean',
      copyright:'Copyright EMPERIO TISS S.L. © 2026'
    },
    fr: {
      blurb:'Produits de la mer, fruits et légumes pour l’approvisionnement professionnel entre l’Europe, l’Afrique et la Méditerranée.',
      location:'Madrid · Espagne',
      signature:'EMPERIO Signature',
      follow:'Suivez-nous',
      kicker:'EMPERIO TISS · APPROVISIONNEMENT PROFESSIONNEL',
      title:'Votre prochain approvisionnement commence ici.',
      action:'Parlons de votre besoin',
      featureLabel:'EMPERIO SIGNATURE',
      featureTitle:'Accès professionnel',
      featureText:'Opportunités sélectionnées pour les entreprises approuvées.',
      products:'Produits',
      seafood:'Produits de la mer',
      fruits:'Fruits',
      vegetables:'Légumes',
      seasonal:'Saison',
      company:'Entreprise',
      about:'Qui sommes-nous',
      markets:'Marchés',
      news:'Actualités',
      contact:'Contact',
      reach:'NOUS CONTACTER',
      reachTitle:'Vous préparez votre prochain approvisionnement ?',
      reachText:'Contactez-nous dès aujourd’hui.',
      email:'info@emperio-tiss.com',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Mentions légales',
      privacy:'Confidentialité',
      cookies:'Cookies',
      region:'Madrid · Espagne · Europe · Afrique · Méditerranée',
      copyright:'Copyright EMPERIO TISS S.L. © 2026'
    },
    it: {
      blurb:'Prodotti del mare, frutta e ortaggi per la fornitura professionale tra Europa, Africa e Mediterraneo.',
      location:'Madrid · Spagna',
      signature:'EMPERIO Signature',
      follow:'Seguiteci',
      kicker:'EMPERIO TISS · FORNITURA PROFESSIONALE',
      title:'La vostra prossima fornitura inizia qui.',
      action:'Parliamo della fornitura',
      featureLabel:'EMPERIO SIGNATURE',
      featureTitle:'Accesso professionale',
      featureText:'Opportunità selezionate per aziende approvate.',
      products:'Prodotti',
      seafood:'Prodotti del mare',
      fruits:'Frutta',
      vegetables:'Ortaggi',
      seasonal:'Stagionale',
      company:'Azienda',
      about:'Chi siamo',
      markets:'Mercati',
      news:'Notizie',
      contact:'Contatti',
      reach:'CONTATTI',
      reachTitle:'State preparando la prossima fornitura?',
      reachText:'Contattateci oggi.',
      email:'info@emperio-tiss.com',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Note legali',
      privacy:'Privacy',
      cookies:'Cookie',
      region:'Madrid · Spagna · Europa · Africa · Mediterraneo',
      copyright:'Copyright EMPERIO TISS S.L. © 2026'
    },
    ar: {
      blurb:'منتجات بحرية وفواكه وخضروات للتوريد المهني بين أوروبا وأفريقيا والبحر المتوسط.',
      location:'مدريد · إسبانيا',
      signature:'EMPERIO Signature',
      follow:'تابعونا',
      kicker:'EMPERIO TISS · توريد مهني',
      title:'توريدكم القادم يبدأ من هنا.',
      action:'تحدثوا معنا عن التوريد',
      featureLabel:'EMPERIO SIGNATURE',
      featureTitle:'وصول مهني',
      featureText:'فرص مختارة للشركات المعتمدة.',
      products:'المنتجات',
      seafood:'المنتجات البحرية',
      fruits:'الفواكه',
      vegetables:'الخضروات',
      seasonal:'الموسمية',
      company:'الشركة',
      about:'من نحن',
      markets:'الأسواق',
      news:'الأخبار',
      contact:'اتصل بنا',
      reach:'تواصل معنا',
      reachTitle:'هل تخططون لتوريدكم القادم؟',
      reachText:'تواصلوا معنا اليوم.',
      email:'info@emperio-tiss.com',
      whatsapp:'واتساب',
      linkedin:'لينكدإن',
      legal:'الإشعار القانوني',
      privacy:'الخصوصية',
      cookies:'ملفات الارتباط',
      region:'مدريد · إسبانيا · أوروبا · أفريقيا · البحر المتوسط',
      copyright:'Copyright EMPERIO TISS S.L. © 2026'
    }
  }[lang];

  const markup = () => `
    <footer class="et-terminal-footer" data-et-terminal-footer="${VERSION}">
      <div class="et-terminal-footer__inner">
        <section class="et-terminal-footer__statement" aria-labelledby="terminalFooterTitle">
          <p class="et-terminal-footer__kicker">${copy.kicker}</p>
          <h2 id="terminalFooterTitle">${copy.title}</h2>
          <a class="et-terminal-footer__statement-link" href="${route('contact')}">
            ${copy.action} <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section class="et-terminal-footer__directory">
          <div class="et-terminal-footer__brand">
            <img src="/assets/images/emperio-tiss-emblem.svg?v=20261008-brand" alt="" width="230" height="267" loading="lazy">
            <p class="et-terminal-footer__tagline">Rising together, leading the world</p>
            <p class="et-terminal-footer__blurb">${copy.blurb}</p>
          </div>

          <nav class="et-terminal-footer__col" aria-label="${copy.products}">
            <span class="et-terminal-footer__label">${copy.products}</span>
            <a href="${route('products/seafood')}">${copy.seafood}</a>
            <a href="${route('products/fruits')}">${copy.fruits}</a>
            <a href="${route('products/vegetables')}">${copy.vegetables}</a>
            <a href="${route('products/seasonal')}">${copy.seasonal}</a>
          </nav>

          <nav class="et-terminal-footer__col" aria-label="${copy.company}">
            <span class="et-terminal-footer__label">${copy.company}</span>
            <a href="${route('about')}">${copy.about}</a>
            <a href="${route('markets')}">${copy.markets}</a>
            <a href="${route('news')}">${copy.news}</a>
            <a href="${route('private')}">${copy.signature}</a>
          </nav>

          <div class="et-terminal-footer__reach">
            <span class="et-terminal-footer__label">${copy.contact}</span>
            <a class="et-terminal-footer__reach-email" href="mailto:info@emperio-tiss.com">${copy.email}</a>
            <p class="et-terminal-footer__location">${copy.location}</p>
            <div class="et-terminal-footer__social" aria-label="${copy.follow}">
              <a class="et-terminal-footer__social-link et-terminal-footer__social-link--linkedin" href="https://www.linkedin.com/company/emperiotiss/" target="_blank" rel="noopener noreferrer"><span class="et-terminal-footer__social-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg></span><span>${copy.linkedin}</span></a>
              <a class="et-terminal-footer__social-link et-terminal-footer__social-link--whatsapp" href="https://wa.me/34614270684" target="_blank" rel="noopener noreferrer"><span class="et-terminal-footer__social-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35ZM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z"/></svg></span><span>${copy.whatsapp}</span></a>
            </div>
          </div>
        </section>

        <div class="et-terminal-footer__meta">
          <span>${copy.copyright}</span>
          <nav aria-label="Legal">
            <a href="/legal/aviso-legal.html">${copy.legal}</a>
            <a href="/legal/privacidad.html">${copy.privacy}</a>
            <a href="/legal/cookies.html">${copy.cookies}</a>
          </nav>
        </div>
      </div>

      <div class="et-terminal-footer__wordmark-wrap" aria-hidden="true">
        <p class="et-terminal-footer__wordmark">EMPERIO TISS</p>
      </div>
    </footer>`;

  const install = () => {
    const existing = body.querySelector(':scope > .et-terminal-footer[data-et-terminal-footer="' + VERSION + '"]');
    const wrongFooters = [...body.querySelectorAll(':scope > footer')].filter((node) => node !== existing);

    if (existing && !wrongFooters.length) return;

    wrongFooters.forEach((node) => node.remove());

    if (!existing) {
      body.insertAdjacentHTML('beforeend', markup());
    }
  };

  install();

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      install();
    });
  });
  observer.observe(body, { childList:true });
})();