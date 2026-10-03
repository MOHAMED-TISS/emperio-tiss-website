(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  if (!body || body.classList.contains('private-page') || body.classList.contains('private-admin-page')) return;

  const VERSION = '20261003-terminal-footer-1';
  if (window.__etTerminalFooterVersion === VERSION) return;
  window.__etTerminalFooterVersion = VERSION;

  const loadCss = () => {
    if (doc.querySelector('link[data-et-terminal-footer]')) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/footer-terminal.css?v=20261003-1';
    link.dataset.etTerminalFooter = 'true';
    doc.head.appendChild(link);
  };
  loadCss();

  const lang = ['es','en','fr','it','ar'].includes((doc.documentElement.lang || 'es').slice(0,2).toLowerCase())
    ? (doc.documentElement.lang || 'es').slice(0,2).toLowerCase()
    : 'es';

  const base = lang === 'es' ? '/' : `/${lang}/`;
  const route = (segment) => `${base}${segment}/`;

  const copy = {
    es: {
      kicker:'EMPERIO TISS · SUMINISTRO PROFESIONAL',
      title:'Su próximo suministro<br><em>empieza aquí.</em>',
      cta:'Plantear un suministro',
      signatureTop:'EMPERIO SIGNATURE',
      signatureTitle:'Acceso profesional.',
      signatureText:'Oportunidades seleccionadas para empresas aprobadas.',
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
      reachTitle:'¿Tiene una necesidad de suministro?',
      reachText:'Cuéntenos producto, formato, volumen y destino. Revisamos la operación con usted.',
      email:'Escribir por email',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Aviso legal',
      privacy:'Privacidad',
      cookies:'Cookies',
      copyright:'© 2026 EMPERIO TISS S.L.',
      region:'Madrid · Europa · África · Mediterráneo'
    },
    en: {
      kicker:'EMPERIO TISS · PROFESSIONAL SUPPLY',
      title:'Your next supply<br><em>starts here.</em>',
      cta:'Start an enquiry',
      signatureTop:'EMPERIO SIGNATURE',
      signatureTitle:'Professional access.',
      signatureText:'Selected opportunities for approved companies.',
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
      reachTitle:'Have a supply requirement?',
      reachText:'Tell us the product, format, volume and destination. We review the operation with you.',
      email:'Email us',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Legal notice',
      privacy:'Privacy',
      cookies:'Cookies',
      copyright:'© 2026 EMPERIO TISS S.L.',
      region:'Madrid · Europe · Africa · Mediterranean'
    },
    fr: {
      kicker:'EMPERIO TISS · APPROVISIONNEMENT PROFESSIONNEL',
      title:'Votre prochain approvisionnement<br><em>commence ici.</em>',
      cta:'Parler de votre besoin',
      signatureTop:'EMPERIO SIGNATURE',
      signatureTitle:'Accès professionnel.',
      signatureText:'Opportunités sélectionnées pour les entreprises approuvées.',
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
      reachTitle:'Vous avez un besoin d’approvisionnement ?',
      reachText:'Indiquez-nous le produit, le format, le volume et la destination. Nous étudions l’opération avec vous.',
      email:'Écrire par email',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Mentions légales',
      privacy:'Confidentialité',
      cookies:'Cookies',
      copyright:'© 2026 EMPERIO TISS S.L.',
      region:'Madrid · Europe · Afrique · Méditerranée'
    },
    it: {
      kicker:'EMPERIO TISS · FORNITURA PROFESSIONALE',
      title:'La vostra prossima fornitura<br><em>inizia qui.</em>',
      cta:'Parliamo della fornitura',
      signatureTop:'EMPERIO SIGNATURE',
      signatureTitle:'Accesso professionale.',
      signatureText:'Opportunità selezionate per aziende approvate.',
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
      reachTitle:'Avete una necessità di fornitura?',
      reachText:'Indicateci prodotto, formato, volume e destinazione. Valutiamo l’operazione insieme a voi.',
      email:'Scrivi via email',
      whatsapp:'WhatsApp',
      linkedin:'LinkedIn',
      legal:'Note legali',
      privacy:'Privacy',
      cookies:'Cookie',
      copyright:'© 2026 EMPERIO TISS S.L.',
      region:'Madrid · Europa · Africa · Mediterraneo'
    },
    ar: {
      kicker:'EMPERIO TISS · توريد مهني',
      title:'توريدكم القادم<br><em>يبدأ من هنا.</em>',
      cta:'ابدأ طلب توريد',
      signatureTop:'EMPERIO SIGNATURE',
      signatureTitle:'وصول مهني.',
      signatureText:'فرص مختارة للشركات المعتمدة.',
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
      reachTitle:'هل لديكم حاجة توريد محددة؟',
      reachText:'أرسلوا لنا المنتج والشكل والكمية والوجهة، وسنراجع العملية معكم.',
      email:'البريد الإلكتروني',
      whatsapp:'واتساب',
      linkedin:'لينكدإن',
      legal:'الإشعار القانوني',
      privacy:'الخصوصية',
      cookies:'ملفات الارتباط',
      copyright:'© 2026 EMPERIO TISS S.L.',
      region:'مدريد · أوروبا · أفريقيا · البحر المتوسط'
    }
  }[lang];

  const footer = doc.createElement('footer');
  footer.className = 'et-terminal-footer';
  footer.dataset.etTerminalFooter = VERSION;
  footer.innerHTML = `
    <div class="et-terminal-footer__inner">
      <section class="et-terminal-footer__cta" aria-labelledby="terminalFooterTitle">
        <div>
          <p class="et-terminal-footer__kicker">${copy.kicker}</p>
          <h2 id="terminalFooterTitle">${copy.title}</h2>
          <a class="et-terminal-footer__cta-action" href="${route('contact')}">
            <span>${copy.cta}</span><span aria-hidden="true">↗</span>
          </a>
        </div>

        <a class="et-terminal-footer__signature" href="/private/">
          <div class="et-terminal-footer__signature-top">
            <span>${copy.signatureTop}</span>
            <img src="/assets/images/emperio-tiss-emblem.svg?v=20261003-header-current" alt="" width="230" height="267" loading="lazy">
          </div>
          <div>
            <strong>${copy.signatureTitle}</strong>
            <small>${copy.signatureText}</small>
            <div class="et-terminal-footer__signature-arrow" aria-hidden="true">↗</div>
          </div>
        </a>
      </section>

      <div class="et-terminal-footer__main">
        <div class="et-terminal-footer__brand">
          <div class="et-terminal-footer__brand-mark">
            <img src="/assets/images/emperio-tiss-emblem.svg?v=20261003-header-current" alt="" width="230" height="267" loading="lazy">
            <strong>EMPERIO TISS</strong>
          </div>
          <p>PRIME ORIGINS. GLOBAL REACH.<br>${copy.region}</p>
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
          <a href="${route('contact')}">${copy.contact}</a>
        </nav>

        <div class="et-terminal-footer__reach">
          <span class="et-terminal-footer__label">${copy.reach}</span>
          <h3 class="et-terminal-footer__reach-heading">${copy.reachTitle}</h3>
          <p>${copy.reachText}</p>
          <div class="et-terminal-footer__reach-links">
            <a href="mailto:info@emperio-tiss.com">${copy.email} ↗</a>
            <a href="https://wa.me/34614270684" target="_blank" rel="noopener noreferrer">${copy.whatsapp} ↗</a>
          </div>
        </div>
      </div>

      <div class="et-terminal-footer__legal">
        <div class="et-terminal-footer__social">
          <a href="https://www.linkedin.com/company/emperiotiss/" target="_blank" rel="noopener noreferrer">${copy.linkedin}</a>
          <a href="https://wa.me/34614270684" target="_blank" rel="noopener noreferrer">${copy.whatsapp}</a>
        </div>
        <span class="et-terminal-footer__copyright">${copy.copyright}</span>
        <nav class="et-terminal-footer__legal-links" aria-label="Legal">
          <a href="/legal/aviso-legal.html">${copy.legal}</a>
          <a href="/legal/privacidad.html">${copy.privacy}</a>
          <a href="/legal/cookies.html">${copy.cookies}</a>
        </nav>
      </div>
    </div>

    <div class="et-terminal-footer__wordmark-wrap" aria-hidden="true">
      <p class="et-terminal-footer__wordmark">EMPERIO <span>TISS</span></p>
    </div>
  `;

  doc.querySelectorAll('footer').forEach((node) => node.remove());
  body.appendChild(footer);
})();