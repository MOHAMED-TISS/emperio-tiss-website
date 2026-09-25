(() => {
  'use strict';
  const root = document.querySelector('.news-current');
  if (!root) return;
  const L = root.dataset.lang || 'en',
    P = {
      es: '',
      en: '/en',
      fr: '/fr',
      it: '/it',
      ar: '/ar'
    } [L] || '';
  const T = {
    es: {
      hero: 'NOTICIAS & INTELIGENCIA',
      h1: 'Lo que mueve<br><em>el mercado.</em>',
      lead: 'Señales de mercado, producto, origen y oportunidades para quienes toman decisiones.',
      latest: 'Últimas señales',
      desc: 'Contexto comercial útil para compradores, socios y operadores profesionales.',
      featureTag: 'MERCADO · NOTA EDITORIAL',
      featureTitle: 'La ventana comercial importa tanto como el producto.',
      featureText: 'Una lectura profesional de disponibilidad, origen, destino y timing puede cambiar una decisión de compra.',
      filters: ['Todos', 'Mercado', 'Producto', 'Origen', 'EMPERIO TISS'],
      intel: 'Lo que estamos<br><em>observando.</em>',
      newsletter: 'Recibe lo que<br><em>estamos viendo.</em>',
      newsletterText: 'Observaciones de mercado, campañas, producto y oportunidades seleccionadas. Sin ruido. Solo información relevante.',
      private: 'Acceso a<br><em>EMPERIO PRIVATE.</em>',
      privateText: 'Ofertas exclusivas y disponibilidad seleccionada para clientes registrados y aprobados.',
      email: 'Tu email profesional',
      subscribe: 'Suscribirme ↗',
      access: 'Solicitar acceso ↗',
      contact: 'Hablar con EMPERIO TISS ↗',
      talk: 'Cuando hay una oportunidad real,<br><em>hablemos.</em>',
      consent: 'Acepto recibir comunicaciones comerciales y puedo cancelar mi suscripción en cualquier momento.',
      application: {
        taxId: 'CIF / Identificación fiscal', company: 'Nombre de la empresa', address: 'Dirección completa',
        country: 'País (código ISO, ej. ES)', contact: 'Persona de contacto', mobile: 'Móvil',
        whatsapp: 'WhatsApp', categories: 'Productos de interés', details: 'Productos concretos (opcional)',
        privacy: 'Acepto que EMPERIO TISS trate estos datos para evaluar y responder a mi solicitud de acceso.',
        categoryNames: ['Productos del mar','Frutas','Hortalizas'], categoryRequired: 'Selecciona al menos una categoría.',
        existingTitle: '¿Ya tienes acceso aprobado?', existingText: 'Recibe un enlace seguro en tu email profesional.', login: 'Recibir enlace seguro ↗'
      },
      labels: ['MERCADO', 'PRODUCTO', 'ORIGEN', 'EMPERIO TISS'],
      stories: [
        ['La geografía vuelve a importar.',
          'Origen, destino y logística deben leerse como una misma decisión comercial.',
          'market'
        ],
        ['La calidad necesita contexto.',
          'Calibre, presentación, continuidad y timing cambian el valor comercial.', 'product'
        ],
        ['Seguir el origen antes de la campaña.',
          'La observación empieza donde nace el producto y termina donde se consume.',
          'origin'
        ],
        ['Construir rutas con criterio.',
          'Conectar mercados exige conocer tanto la oportunidad como la operación.', 'company'
        ]
      ],
      obs: ['Seguir la disponibilidad antes del volumen.',
        'Leer la demanda con el timing adecuado.', 'Actuar cuando la ruta tiene sentido.'
      ]
    },
    en: {
      hero: 'NEWS & INTELLIGENCE',
      h1: 'What moves<br><em>the market.</em>',
      lead: 'Market, product, origin and opportunity signals for people who make commercial decisions.',
      latest: 'Latest signals',
      desc: 'Useful commercial context for buyers, partners and professional operators.',
      featureTag: 'MARKET · EDITORIAL NOTE',
      featureTitle: 'The commercial window matters as much as the product.',
      featureText: 'A professional reading of availability, origin, destination and timing can change a buying decision.',
      filters: ['All', 'Market', 'Product', 'Origin', 'EMPERIO TISS'],
      intel: "What we're<br><em>watching.</em>",
      newsletter: 'Receive what<br><em>we\'re seeing.</em>',
      newsletterText: 'Selected market observations, campaigns, products and opportunities. No noise. Only relevant information.',
      private: 'Access<br><em>EMPERIO PRIVATE.</em>',
      privateText: 'Exclusive offers and selected availability for registered and approved clients.',
      email: 'Professional email',
      subscribe: 'Subscribe ↗',
      access: 'Request access ↗',
      contact: 'Talk to EMPERIO TISS ↗',
      talk: "When there is a real opportunity,<br><em>let's talk.</em>",
      consent: 'I agree to receive commercial communications and can unsubscribe at any time.',
      application: {
        taxId: 'Tax ID / Company number', company: 'Company name', address: 'Full address',
        country: 'Country (ISO code, e.g. GB)', contact: 'Contact person', mobile: 'Mobile',
        whatsapp: 'WhatsApp', categories: 'Products of interest', details: 'Specific products (optional)',
        privacy: 'I agree that EMPERIO TISS may process this data to assess and respond to my access request.',
        categoryNames: ['Seafood','Fruits','Vegetables'], categoryRequired: 'Select at least one category.',
        existingTitle: 'Already approved?', existingText: 'Receive a secure link at your professional email.', login: 'Send secure link ↗'
      },
      labels: ['MARKET', 'PRODUCT', 'ORIGIN', 'EMPERIO TISS'],
      stories: [
        ['Geography matters again.',
          'Origin, destination and logistics need to be read as one commercial decision.',
          'market'
        ],
        ['Quality needs context.',
          'Size, presentation, continuity and timing shape commercial value.', 'product'
        ],
        ['Follow the origin before the campaign.',
          'The observation starts where the product begins and ends where it is consumed.',
          'origin'
        ],
        ['Building routes with judgment.',
          'Connecting markets requires understanding opportunity as well as execution.',
          'company'
        ]
      ],
      obs: ['Follow availability before volume.', 'Read demand with timing.',
        'Act when the route makes sense.'
      ]
    },
    fr: {
      hero: 'ACTUALITÉS & INTELLIGENCE',
      h1: 'Ce qui fait bouger<br><em>le marché.</em>',
      lead: 'Signaux marché, produit, origine et opportunités pour ceux qui prennent des décisions commerciales.',
      latest: 'Derniers signaux',
      desc: 'Un contexte commercial utile pour les acheteurs, partenaires et opérateurs professionnels.',
      featureTag: 'MARCHÉ · NOTE ÉDITORIALE',
      featureTitle: 'La fenêtre commerciale compte autant que le produit.',
      featureText: "Une lecture professionnelle de la disponibilité, de l'origine, de la destination et du timing peut changer une décision d'achat.",
      filters: ['Tous', 'Marché', 'Produit', 'Origine', 'EMPERIO TISS'],
      intel: 'Ce que nous<br><em>observons.</em>',
      newsletter: 'Recevez ce que<br><em>nous voyons.</em>',
      newsletterText: "Observations marché, campagnes, produits et opportunités sélectionnées. Sans bruit. Seulement l'essentiel.",
      private: 'Accès à<br><em>EMPERIO PRIVATE.</em>',
      privateText: 'Offres exclusives et disponibilités sélectionnées pour les clients enregistrés et approuvés.',
      email: 'Email professionnel',
      subscribe: "S'abonner ↗",
      access: "Demander l'accès ↗",
      contact: 'Parler à EMPERIO TISS ↗',
      talk: "Quand une opportunité est réelle,<br><em>parlons-en.</em>",
      consent: "J'accepte de recevoir des communications commerciales et peux me désabonner à tout moment.",
      application: {
        taxId: 'Identifiant fiscal / SIREN', company: "Nom de l'entreprise", address: 'Adresse complète',
        country: 'Pays (code ISO, ex. FR)', contact: 'Personne de contact', mobile: 'Mobile',
        whatsapp: 'WhatsApp', categories: "Produits d'intérêt", details: 'Produits précis (facultatif)',
        privacy: "J'accepte qu'EMPERIO TISS traite ces données afin d'évaluer et de répondre à ma demande d'accès.",
        categoryNames: ['Produits de la mer','Fruits','Légumes'], categoryRequired: 'Sélectionnez au moins une catégorie.',
        existingTitle: 'Accès déjà approuvé ?', existingText: 'Recevez un lien sécurisé sur votre email professionnel.', login: 'Recevoir le lien sécurisé ↗'
      },
      labels: ['MARCHÉ', 'PRODUIT', 'ORIGINE', 'EMPERIO TISS'],
      stories: [
        ['La géographie compte à nouveau.',
          'Origine, destination et logistique doivent être lues comme une seule décision commerciale.',
          'market'
        ],
        ['La qualité a besoin de contexte.',
          'Calibre, présentation, continuité et timing façonnent la valeur commerciale.',
          'product'
        ],
        ["Suivre l'origine avant la campagne.",
          "L'observation commence là où naît le produit et se termine là où il est consommé.",
          'origin'
        ],
        ['Construire des routes avec discernement.',
          "Relier les marchés exige de comprendre l'opportunité autant que l'exécution.",
          'company'
        ]
      ],
      obs: ['Suivre la disponibilité avant le volume.', 'Lire la demande avec le bon timing.',
        'Agir quand la route a du sens.'
      ]
    },
    it: {
      hero: 'NOTIZIE & INTELLIGENCE',
      h1: 'Ciò che muove<br><em>il mercato.</em>',
      lead: 'Segnali di mercato, prodotto, origine e opportunità per chi prende decisioni commerciali.',
      latest: 'Ultimi segnali',
      desc: 'Contesto commerciale utile per buyer, partner e operatori professionali.',
      featureTag: 'MERCATO · NOTA EDITORIALE',
      featureTitle: 'La finestra commerciale conta quanto il prodotto.',
      featureText: "Una lettura professionale di disponibilità, origine, destinazione e tempistica può cambiare una decisione d'acquisto.",
      filters: ['Tutti', 'Mercato', 'Prodotto', 'Origine', 'EMPERIO TISS'],
      intel: 'Cosa stiamo<br><em>osservando.</em>',
      newsletter: 'Ricevi ciò che<br><em>stiamo vedendo.</em>',
      newsletterText: 'Osservazioni di mercato, campagne, prodotti e opportunità selezionate. Niente rumore. Solo informazioni rilevanti.',
      private: 'Accesso a<br><em>EMPERIO PRIVATE.</em>',
      privateText: 'Offerte esclusive e disponibilità selezionate per clienti registrati e approvati.',
      email: 'Email professionale',
      subscribe: 'Iscriviti ↗',
      access: 'Richiedi accesso ↗',
      contact: 'Parla con EMPERIO TISS ↗',
      talk: "Quando c'è una vera opportunità,<br><em>parliamone.</em>",
      consent: "Accetto di ricevere comunicazioni commerciali e posso annullare l'iscrizione in qualsiasi momento.",
      application: {
        taxId: 'Partita IVA / Codice fiscale', company: "Nome dell'azienda", address: 'Indirizzo completo',
        country: 'Paese (codice ISO, es. IT)', contact: 'Persona di contatto', mobile: 'Cellulare',
        whatsapp: 'WhatsApp', categories: 'Prodotti di interesse', details: 'Prodotti specifici (facoltativo)',
        privacy: "Accetto che EMPERIO TISS tratti questi dati per valutare e rispondere alla mia richiesta di accesso.",
        categoryNames: ['Prodotti del mare','Frutta','Ortaggi'], categoryRequired: 'Seleziona almeno una categoria.',
        existingTitle: 'Accesso già approvato?', existingText: 'Ricevi un link sicuro sulla tua email professionale.', login: 'Ricevi il link sicuro ↗'
      },
      labels: ['MERCATO', 'PRODOTTO', 'ORIGINE', 'EMPERIO TISS'],
      stories: [
        ['La geografia torna a contare.',
          'Origine, destinazione e logistica vanno lette come un’unica decisione commerciale.',
          'market'
        ],
        ['La qualità ha bisogno di contesto.',
          'Pezzatura, presentazione, continuità e timing definiscono il valore commerciale.',
          'product'
        ],
        ["Seguire l'origine prima della campagna.",
          'L’osservazione parte da dove nasce il prodotto e arriva fino a dove viene consumato.',
          'origin'
        ],
        ['Costruire rotte con criterio.',
          'Collegare i mercati richiede di capire l’opportunità quanto l’esecuzione.',
          'company'
        ]
      ],
      obs: ['Seguire la disponibilità prima del volume.',
        'Leggere la domanda con il giusto timing.', 'Agire quando la rotta ha senso.'
      ]
    },
    ar: {
      hero: 'الأخبار والذكاء السوقي',
      h1: 'ما الذي يحرك<br><em>السوق.</em>',
      lead: 'إشارات السوق والمنتجات والمصادر والفرص لمن يتخذون القرارات التجارية.',
      latest: 'أحدث الإشارات',
      desc: 'سياق تجاري مفيد للمشترين والشركاء والمشغلين المحترفين.',
      featureTag: 'السوق · ملاحظة تحريرية',
      featureTitle: 'النافذة التجارية مهمة بقدر أهمية المنتج.',
      featureText: 'قراءة مهنية للتوافر والمنشأ والوجهة والتوقيت يمكن أن تغيّر قرار الشراء.',
      filters: ['الكل', 'السوق', 'المنتج', 'المنشأ', 'EMPERIO TISS'],
      intel: 'ما الذي<br><em>نراقبه.</em>',
      newsletter: 'تلقَّ ما<br><em>نراه في السوق.</em>',
      newsletterText: 'ملاحظات سوقية وحملات ومنتجات وفرص مختارة. بلا ضجيج، فقط معلومات مفيدة.',
      private: 'الوصول إلى<br><em>EMPERIO PRIVATE.</em>',
      privateText: 'عروض حصرية وتوافر مختار للعملاء المسجلين والمعتمدين.',
      email: 'البريد الإلكتروني المهني',
      subscribe: 'اشتراك ↗',
      access: 'طلب الوصول ↗',
      contact: 'تواصل مع EMPERIO TISS ↗',
      talk: 'عندما توجد فرصة حقيقية،<br><em>فلنتحدث.</em>',
      consent: 'أوافق على تلقي الاتصالات التجارية ويمكنني إلغاء الاشتراك في أي وقت.',
      application: {
        taxId: 'الرقم الضريبي للشركة', company: 'اسم الشركة', address: 'العنوان الكامل',
        country: 'الدولة (رمز ISO مثل MA)', contact: 'جهة الاتصال', mobile: 'الهاتف المحمول',
        whatsapp: 'واتساب', categories: 'المنتجات المطلوبة', details: 'منتجات محددة (اختياري)',
        privacy: 'أوافق على معالجة EMPERIO TISS لهذه البيانات لتقييم طلب الوصول والرد عليه.',
        categoryNames: ['المأكولات البحرية','الفواكه','الخضروات'], categoryRequired: 'اختر فئة واحدة على الأقل.',
        existingTitle: 'هل تمت الموافقة على وصولك؟', existingText: 'استلم رابطاً آمناً على بريدك المهني.', login: 'إرسال الرابط الآمن ↗'
      },
      labels: ['السوق', 'المنتج', 'المنشأ', 'EMPERIO TISS'],
      stories: [
        ['الجغرافيا مهمة من جديد.',
          'يجب قراءة المنشأ والوجهة والخدمات اللوجستية كقرار تجاري واحد.', 'market'
        ],
        ['الجودة تحتاج إلى سياق.', 'الحجم والعرض والاستمرارية والتوقيت تشكل القيمة التجارية.',
          'product'
        ],
        ['تابع المنشأ قبل الحملة.',
          'تبدأ الملاحظة من مكان نشوء المنتج وتنتهي حيث يتم استهلاكه.', 'origin'
        ],
        ['بناء مسارات بوعي تجاري.', 'ربط الأسواق يتطلب فهم الفرصة والتنفيذ في الوقت نفسه.',
          'company'
        ]
      ],
      obs: ['تابع التوافر قبل الكمية.', 'اقرأ الطلب مع التوقيت المناسب.',
        'تحرك عندما يكون المسار منطقياً.'
      ]
    }
  };
  const t = T[L] || T.en,
    navLabels = {
      es: ['Inicio', 'Empresa', 'Productos', 'Mercados', 'Noticias', 'Contacto'],
      en: ['Home', 'Company', 'Products', 'Markets', 'News', 'Contact'],
      fr: ['Accueil', 'Entreprise', 'Produits', 'Marchés', 'Actualités', 'Contact'],
      it: ['Home', 'Azienda', 'Prodotti', 'Mercati', 'Notizie', 'Contatti'],
      ar: ['الرئيسية', 'الشركة', 'المنتجات', 'الأسواق', 'الأخبار', 'اتصل بنا']
    } [L] || ['Home', 'Company', 'Products', 'Markets', 'News', 'Contact'];
  const nav = document.querySelector('.nav-overlay-links');
  if (nav) {
    const pfx = P,
      prod = L === 'es' ? ['Todos los productos', 'Productos del mar', 'Pescados', 'Mariscos',
        'Cefalópodos', 'Frutas', 'Hortalizas', 'Temporada'
      ] : L === 'en' ? ['All products', 'Seafood', 'Fish', 'Shellfish', 'Cephalopods', 'Fruits',
        'Vegetables', 'Seasonal'
      ] : L === 'fr' ? ['Tous les produits', 'Produits de la mer', 'Fruits', 'Légumes',
        'Produits de saison'
      ] : L === 'it' ? ['Tutti i prodotti', 'Prodotti del mare', 'Frutta', 'Ortaggi',
        'Stagionali'] : ['كل المنتجات', 'المأكولات البحرية', 'الفواكه', 'الخضروات',
        'المنتجات الموسمية'
      ];
    const paths = L === 'en' || L === 'es' ? ['products/', 'products/seafood/',
      'products/seafood/fish/', 'products/seafood/shellfish/', 'products/seafood/cephalopods/',
      'products/fruits/', 'products/vegetables/', 'products/seasonal/'
    ] : ['products/', 'products/seafood/', 'products/fruits/', 'products/vegetables/',
      'products/seasonal/'
    ];
    nav.innerHTML =
      `<a href="${pfx}/"><span class="idx">01</span><span>${navLabels[0]}</span></a><a href="${pfx}/about/"><span class="idx">02</span><span>${navLabels[1]}</span></a><details class="nav-products"><summary><span class="idx">03</span><span>${navLabels[2]}</span></summary><div class="nav-products-links">${paths.map((x,i)=>`<a href="${pfx}/${x}">${prod[i]}</a>`).join('')}</div></details><a href="${pfx}/markets/"><span class="idx">04</span><span>${navLabels[3]}</span></a><a href="${pfx}/news/" class="active"><span class="idx">05</span><span>${navLabels[4]}</span></a><a href="${pfx}/contact/"><span class="idx">06</span><span>${navLabels[5]}</span></a>`
  }
  root.querySelector('#newsApp').innerHTML =
    `<main><section class="news-hero"><div class="news-wrap"><div class="news-hero-meta"><span>01 / ${t.hero}</span><span>EUROPE · AFRICA · MEDITERRANEAN</span></div><div class="news-hero-grid"><div><p class="news-eyebrow">${t.hero}</p><h1>${t.h1}</h1><p class="news-lead">${t.lead}</p><a class="news-text-link" href="#market-signals">${t.latest} ↓</a></div><div class="news-hero-orbit"><span>ORIGIN</span><span>MARKET</span><span>DESTINATION</span></div></div></div></section><section class="news-feature-section"><div class="news-wrap"><div class="news-section-head"><div><p class="news-eyebrow">${t.latest.toUpperCase()}</p><h2>${t.latest} <em>+</em></h2></div><p>${t.desc}</p></div><article class="news-feature"><div class="news-feature-visual"><span>MARKET SIGNAL</span><b>01</b></div><div class="news-feature-copy"><span class="news-tag">${t.featureTag}</span><h3>${t.featureTitle}</h3><p>${t.featureText}</p><div class="news-feature-meta"><span>Origin · Market · Destination</span><a href="${P}/contact/">${t.contact}</a></div></div></article></div></section><section class="news-stream" id="market-signals"><div class="news-wrap"><div class="news-section-head compact"><div><p class="news-eyebrow">SIGNALS</p><h2>${t.latest} <em>+</em></h2></div><div class="news-filters">${t.filters.map((x,i)=>`<button class="${i===0?'active':''}" data-filter="${['all','market','product','origin','company'][i]}">${x}</button>`).join('')}</div></div><div class="news-card-grid">${t.stories.map((s,i)=>`<article class="news-card" data-topic="${s[2]}"><span class="news-card-index">${String(i+1).padStart(2,'0')}</span><span class="news-tag">${t.labels[i]}</span><h3>${s[0]}</h3><p>${s[1]}</p><a href="${P}/contact/">${t.contact}</a></article>`).join('')}</div></div></section><section class="news-intelligence"><div class="news-wrap news-intelligence-grid"><div><p class="news-eyebrow">MARKET INTELLIGENCE</p><h2>${t.intel}</h2></div><div class="news-observations">${t.obs.map((x,i)=>`<div><span>0${i+1}</span><strong>${['Origin','Destination','Opportunity'][i]}</strong><p>${x}</p></div>`).join('')}</div></div></section><section class="news-subscribe"><div class="news-wrap news-subscribe-grid"><div><p class="news-eyebrow">MARKET SIGNALS</p><h2>${t.newsletter}</h2><p>${t.newsletterText}</p></div><form class="news-form" data-newsletter-form><label>${t.email}<input type="email" name="email" required></label><label class="news-check"><input type="checkbox" name="consent" required><span>${t.consent}</span></label><input type="hidden" name="language" value="${L}"><input type="text" name="_honey" class="news-honey" tabindex="-1" autocomplete="off"><button type="submit">${t.subscribe}</button><p class="news-form-status" aria-live="polite"></p></form></div></section><section class="news-private"><div class="news-wrap news-private-grid"><div><p class="news-eyebrow">EMPERIO PRIVATE</p><h2>${t.private}</h2><p>${t.privateText}</p></div><div class="private-forms"><form class="news-form private-form" data-private-form><div class="private-application-grid"><label>${t.application.taxId}<input type="text" name="tax_id" maxlength="80" autocomplete="off" required></label><label>${t.application.company}<input type="text" name="company" maxlength="160" autocomplete="organization" required></label><label class="private-field-wide">${t.application.address}<input type="text" name="address" maxlength="300" autocomplete="street-address" required></label><label>${t.application.country}<input type="text" name="country" minlength="2" maxlength="2" pattern="[A-Za-z]{2}" autocomplete="country" placeholder="ES" required></label><label>${t.application.contact}<input type="text" name="contact_name" maxlength="160" autocomplete="name" required></label><label>${t.application.mobile}<input type="tel" name="mobile" maxlength="40" autocomplete="tel" required></label><label>${t.email}<input type="email" name="email" maxlength="254" autocomplete="email" required></label><label>${t.application.whatsapp}<input type="tel" name="whatsapp" maxlength="40" autocomplete="tel" required></label><label class="private-field-wide">${t.application.details}<textarea name="products_interest" maxlength="1000" rows="3"></textarea></label></div><fieldset class="private-categories"><legend>${t.application.categories}</legend>${['seafood','fruits','vegetables'].map((value,i)=>`<label><input type="checkbox" name="categories" value="${value}"><span>${t.application.categoryNames[i]}</span></label>`).join('')}</fieldset><label class="news-check"><input type="checkbox" name="privacy" value="yes" required><span>${t.application.privacy}</span></label><input type="hidden" name="language" value="${L}"><input type="text" name="_honey" class="news-honey" tabindex="-1" autocomplete="off"><button type="submit">${t.access}</button><p class="news-form-status" aria-live="polite"></p></form><form class="news-form private-login-form" data-private-login-form><div class="private-login-copy"><strong>${t.application.existingTitle}</strong><p>${t.application.existingText}</p></div><label>${t.email}<input type="email" name="email" maxlength="254" autocomplete="email" required></label><input type="hidden" name="language" value="${L}"><input type="text" name="_honey" class="news-honey" tabindex="-1" autocomplete="off"><button type="submit">${t.application.login}</button><p class="news-form-status" aria-live="polite"></p></form></div></div></section><section class="news-cta"><div class="news-wrap"><p class="news-eyebrow">B2B</p><h2>${t.talk}</h2><a class="news-solid-link" href="${P}/contact/">${t.contact}</a></div></section></main>`;
  root.querySelectorAll('.news-filters button').forEach(btn => btn.addEventListener('click',
() => {
    root.querySelectorAll('.news-filters button').forEach(b => b.classList.remove(
    'active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    root.querySelectorAll('.news-card').forEach(c => c.hidden = f !== 'all' && c.dataset
      .topic !== f)
  }));
  const status = (f, s, ok) => {
    const e = f.querySelector('.news-form-status');
    if (e) {
      e.textContent = s;
      e.style.color = ok ? '#2d5e45' : ''
    }
  };
  const form = (f, url) => f.addEventListener('submit', async e => {
    e.preventDefault();
    const b = f.querySelector('button');
    if (b) b.disabled = true;
    try {
      const data = new FormData(f);
      if (f.matches('[data-private-form]') && !data.getAll('categories').length) {
        throw new Error(t.application.categoryRequired)
      }
      const r = await fetch(url, {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json'
          }
        }),
        d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || 'Unable to complete request.');
      status(f, d.message || 'Request received.', true);
      f.reset()
    } catch (x) {
      status(f, x.message || 'Unable to complete request.')
    } finally {
      if (b) b.disabled = false
    }
  });
  form(root.querySelector('[data-newsletter-form]'), '/api/newsletter/subscribe');
  form(root.querySelector('[data-private-form]'), '/api/private/request-access');
  form(root.querySelector('[data-private-login-form]'), '/api/private/request-access');
})();
