(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  if (!body || body.classList.contains('private-admin-page')) return;

  const VERSION = '20261003-terminal-footer-2';
  if (window.__etTerminalFooterVersion === VERSION) return;
  window.__etTerminalFooterVersion = VERSION;

  const loadCss = () => {
    if (doc.querySelector('link[data-et-terminal-footer]')) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/footer-terminal.css?v=20261003-4';
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
          <a class="et-terminal-footer__feature" href="${route('private')}">
            <span class="et-terminal-footer__label">${copy.featureLabel}</span>
            <img src="/assets/images/emperio-tiss-emblem.svg?v=20261003-header-current" alt="" width="230" height="267" loading="lazy">
            <div>
              <strong>${copy.featureTitle}</strong>
              <small>${copy.featureText}</small>
            </div>
            <span class="et-terminal-footer__feature-arrow" aria-hidden="true">↗</span>
          </a>

          <nav class="et-terminal-footer__col" aria-label="${copy.products}">
            <span class="et-terminal-footer__label">${copy.products}</span>
            <a href="${route('products')}">${copy.products}</a>
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
            <a href="${route('contact')}">${copy.contact}</a>
          </nav>

          <div class="et-terminal-footer__reach">
            <span class="et-terminal-footer__label">${copy.reach}</span>
            <a class="et-terminal-footer__reach-title" href="${route('contact')}">${copy.reachTitle}</a>
            <a class="et-terminal-footer__reach-email" href="mailto:info@emperio-tiss.com">${copy.email}</a>
            <p>${copy.reachText}</p>
          </div>
        </section>

        <div class="et-terminal-footer__meta">
          <div class="et-terminal-footer__social">
            <a href="https://www.linkedin.com/company/emperiotiss/" target="_blank" rel="noopener noreferrer">${copy.linkedin}</a>
            <a href="https://wa.me/34614270684" target="_blank" rel="noopener noreferrer">${copy.whatsapp}</a>
          </div>
          <span>${copy.copyright}</span>
          <nav aria-label="Legal">
            <a href="/legal/aviso-legal.html">${copy.legal}</a>
            <a href="/legal/privacidad.html">${copy.privacy}</a>
            <a href="/legal/cookies.html">${copy.cookies}</a>
          </nav>
        </div>

        <div class="et-terminal-footer__region">${copy.region}</div>
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