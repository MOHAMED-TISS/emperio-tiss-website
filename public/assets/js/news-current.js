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
      private: 'Acceso seleccionado para<br><em>relaciones comerciales directas.</em>',
      privateText: 'Un espacio reservado para empresas aprobadas, con acceso a oportunidades seleccionadas, disponibilidad comercial y referencias adaptadas a cada mercado.',
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
        existingTitle: '¿Ya tienes acceso SIGNATURE?', existingText: 'Recibe un enlace seguro en tu email profesional.', login: 'Acceder a SIGNATURE ↗'
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
          'Abrir mercados exige conocer tanto la oportunidad como la operación.', 'company'
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
      private: 'Selected access for<br><em>direct commercial relationships.</em>',
      privateText: 'A reserved space for approved companies, with access to selected opportunities, commercial availability and market-adapted references.',
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
        existingTitle: 'Already have SIGNATURE access?', existingText: 'Receive a secure link at your professional email.', login: 'Enter SIGNATURE ↗'
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
          'Opening markets requires understanding opportunity as well as execution.',
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
      private: 'Un accès sélectionné pour<br><em>des relations commerciales directes.</em>',
      privateText: 'Un espace réservé aux entreprises approuvées, avec accès à des opportunités sélectionnées, des disponibilités commerciales et des références adaptées à chaque marché.',
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
        existingTitle: 'Vous avez déjà accès à SIGNATURE ?', existingText: 'Recevez un lien sécurisé sur votre email professionnel.', login: 'Accéder à SIGNATURE ↗'
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
          "Ouvrir des marchés exige de comprendre l'opportunité autant que l'exécution.",
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
      private: 'Accesso selezionato per<br><em>relazioni commerciali dirette.</em>',
      privateText: 'Uno spazio riservato alle aziende approvate, con accesso a opportunità selezionate, disponibilità commerciali e referenze adattate a ciascun mercato.',
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
        existingTitle: 'Hai già accesso a SIGNATURE?', existingText: 'Ricevi un link sicuro sulla tua email professionale.', login: 'Accedi a SIGNATURE ↗'
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
          'Aprire mercati richiede di capire l’opportunità quanto l’esecuzione.',
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
      private: 'وصول مختار من أجل<br><em>علاقات تجارية مباشرة.</em>',
      privateText: 'مساحة مخصصة للشركات المعتمدة، تتيح الوصول إلى فرص مختارة وتوافر تجاري ومراجع ملائمة لكل سوق.',
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
        existingTitle: 'هل لديك وصول إلى SIGNATURE؟', existingText: 'استلم رابطاً آمناً على بريدك المهني.', login: 'الدخول إلى SIGNATURE ↗'
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
        ['بناء مسارات بوعي تجاري.', 'فتح الأسواق يتطلب فهم الفرصة والتنفيذ في الوقت نفسه.',
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
  const requiredLabel = value => `<span class="private-field-label"><span class="private-required-mark" aria-hidden="true">*</span><span>${value}</span></span>`;
  // ---- the journal (content from news-journal-content.js; Spanish is the fallback edition)
  const N = (window.ET_NEWS || {})[L] || (window.ET_NEWS || {}).es;
  if (!N) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ui = N.ui;
  const tagName = key => ui.filters[key] || key;
  const minutes = a => Math.max(1, Math.round(a.body.join(' ').split(/\s+/).length / 180));
  const photo = (key, cls) => {
    const base = key === 'news' || key === 'season' ? `/assets/images/editorial/${key}` : `/assets/images/heroes/${key}`;
    return `<img class="nj-img--light${cls ? ' ' + cls : ''}" src="${base}-light-m.webp" alt="" width="1280" height="720" loading="lazy" decoding="async"><img class="nj-img--dark${cls ? ' ' + cls : ''}" src="${base}-dark-m.webp" alt="" width="1280" height="720" loading="lazy" decoding="async">`;
  };
  const meta = a => `${esc(ui.date)} · ${minutes(a)} ${esc(ui.minutes)}`;
  const [lead, ...rest] = N.articles;
  const card = (a, i) => `<article class="nj-card${i === 0 ? ' nj-card--wide' : ''}${i === rest.length - 1 && rest.length > 4 ? ' nj-card--band' : ''}" data-topic="${esc(a.tag)}" id="${esc(a.id)}">`
    + `<a class="nj-card__open" href="#${esc(a.id)}" data-open="${esc(a.id)}"><span class="nj-card__photo">${photo(a.image)}</span>`
    + `<span class="nj-card__body"><span class="nj-kicker">${esc(tagName(a.tag))}</span><h3>${esc(a.title)}</h3><span class="nj-dek">${esc(a.dek)}</span><span class="nj-meta">${meta(a)}</span><span class="nj-card__more">${esc(ui.read)} <span aria-hidden="true">↗</span></span></span></a></article>`;
  const filters = ['all', 'catalogue', 'product', 'origin', 'company'].filter(k => k === 'all' || N.articles.some(a => a.tag === k));

  root.querySelector('#newsApp').innerHTML =
    `<main class="nj-page">`
    + `<section class="nj-hero" aria-labelledby="nj-title"><div class="nj-wrap nj-hero__masthead"><span>${esc(N.hero.kicker)}</span><span>${esc(N.hero.edition)}</span><span>${esc(N.hero.place)}</span></div>`
    + `<div class="nj-wrap nj-hero__inner"><h1 id="nj-title">${N.hero.h1}</h1><p class="nj-hero__lead">${esc(N.hero.lead)}</p><a class="nj-btn nj-btn--gold" href="#edicion">${esc(N.hero.cta)} <span aria-hidden="true">↓</span></a></div>`
    + `<div class="nj-wrap nj-hero__toc"><p>${esc(ui.inEdition)}</p><ol>${N.articles.slice(0, 3).map((a, i) => `<li><a href="#${esc(a.id)}" data-open="${esc(a.id)}"><b>0${i + 1}</b><span>${esc(a.title)}</span></a></li>`).join('')}</ol></div></section>`
    + `<section class="nj-cover" id="edicion" aria-labelledby="nj-cover-title"><div class="nj-wrap nj-cover__grid"><a class="nj-cover__photo" href="#${esc(lead.id)}" data-open="${esc(lead.id)}" tabindex="-1" aria-hidden="true">${photo(lead.image)}</a>`
    + `<div class="nj-cover__copy"><p class="nj-kicker">${esc(ui.cover)} · ${esc(tagName(lead.tag))}</p><h2 id="nj-cover-title">${esc(lead.title)}</h2><p class="nj-dek">${esc(lead.dek)}</p><p class="nj-cover__excerpt nj-dropcap">${esc(lead.body[0])}</p><p class="nj-meta">${meta(lead)}</p><a class="nj-btn nj-btn--line" href="#${esc(lead.id)}" data-open="${esc(lead.id)}">${esc(ui.read)} <span aria-hidden="true">↗</span></a></div></div></section>`
    + `<section class="nj-index" aria-labelledby="nj-index-title"><div class="nj-wrap"><div class="nj-head"><div><p class="nj-kicker">${esc(ui.inEdition)}</p><h2 id="nj-index-title">${ui.indexTitle}</h2></div>`
    + `<div class="nj-filters" role="group">${filters.map(k => `<button type="button" data-filter="${k}" aria-pressed="${k === 'all'}">${esc(tagName(k))}</button>`).join('')}</div></div>`
    + `<div class="nj-grid">${rest.map(card).join('')}</div></div></section>`
    + `<section class="nj-quote"><div class="nj-wrap"><blockquote><p>${esc(N.quote.text)}</p><cite>${esc(N.quote.cite)}</cite></blockquote></div></section>`
    + `<section class="nj-letter news-subscribe" id="newsletter"><div class="nj-wrap nj-split"><div><p class="nj-kicker">${esc(N.letter.kicker)}</p><h2>${N.letter.h2}</h2><p class="nj-lead">${esc(N.letter.text)}</p></div>`
    + `<form class="news-form" data-newsletter-form><label>${t.email}<input type="email" name="email" required></label><label class="news-check"><input type="checkbox" name="consent" required><span>${t.consent}</span></label><input type="hidden" name="language" value="${L}"><input type="text" name="_honey" class="news-honey" tabindex="-1" autocomplete="off"><button type="submit">${t.subscribe}</button><p class="news-form-status" aria-live="polite"></p></form></div></section>`
    + `<section class="nj-signature news-private" id="emperio-private"><div class="nj-wrap nj-split"><div class="news-private-copy"><p class="nj-kicker">SELECTED ACCESS</p><h2><span>EMPERIO</span><br><em>SIGNATURE.</em></h2><p class="news-private-tagline">${t.private}</p><p class="nj-lead">${t.privateText}</p></div><div class="private-forms">`
    + `<form class="news-form private-form" data-private-form><div class="private-application-grid"><label>${requiredLabel(t.application.taxId)}<input type="text" name="tax_id" maxlength="80" autocomplete="off" required></label><label>${requiredLabel(t.application.company)}<input type="text" name="company" maxlength="160" autocomplete="organization" required></label><label class="private-field-wide">${requiredLabel(t.application.address)}<input type="text" name="address" maxlength="300" autocomplete="street-address" required></label><label>${requiredLabel(t.application.country)}<input type="text" name="country" minlength="2" maxlength="2" pattern="[A-Za-z]{2}" autocomplete="country" placeholder="ES" required></label><label>${requiredLabel(t.application.contact)}<input type="text" name="contact_name" maxlength="160" autocomplete="name" required></label><label>${requiredLabel(t.application.mobile)}<input type="tel" name="mobile" maxlength="40" autocomplete="tel" required></label><label>${requiredLabel(t.email)}<input type="email" name="email" maxlength="254" autocomplete="email" required></label><label>${requiredLabel(t.application.whatsapp)}<input type="tel" name="whatsapp" maxlength="40" autocomplete="tel" required></label><label class="private-field-wide">${t.application.details}<textarea name="products_interest" maxlength="1000" rows="3"></textarea></label></div><fieldset class="private-categories"><legend>${requiredLabel(t.application.categories)}</legend>${['seafood','fruits','vegetables'].map((value,i)=>`<label><input type="checkbox" name="categories" value="${value}"><span>${t.application.categoryNames[i]}</span></label>`).join('')}</fieldset><label class="news-check"><input type="checkbox" name="privacy" value="yes" required><span class="private-field-label private-field-label--check"><span class="private-required-mark" aria-hidden="true">*</span><span>${t.application.privacy}</span></span></label><input type="hidden" name="language" value="${L}"><input type="text" name="_honey" class="news-honey" tabindex="-1" autocomplete="off"><button type="submit">${t.access}</button><p class="news-form-status" aria-live="polite"></p></form>`
    + `<form id="private-login" class="news-form private-login-form" data-private-login-form><div class="private-login-copy"><strong>${t.application.existingTitle}</strong><p>${t.application.existingText}</p></div><label>${requiredLabel(t.email)}<input type="email" name="email" maxlength="254" autocomplete="email" required></label><input type="hidden" name="language" value="${L}"><input type="text" name="_honey" class="news-honey" tabindex="-1" autocomplete="off"><button type="submit">${t.application.login}</button><p class="news-form-status" aria-live="polite"></p></form></div></div></section>`
    + `<section class="nj-talk"><div class="nj-wrap"><h2>${t.talk}</h2><a class="nj-btn nj-btn--gold" href="${P}/contact/">${t.contact}</a></div></section>`
    + `</main>`
    + `<div class="nj-reader" hidden role="dialog" aria-modal="true" aria-labelledby="nj-reader-title" data-lenis-prevent><div class="nj-reader__bar"><span>${esc(N.hero.kicker)}</span><button type="button" class="nj-reader__close" data-close>${esc(ui.close)} <span aria-hidden="true">×</span></button></div><article class="nj-reader__article" tabindex="-1"></article></div>`;

  // filters
  const grid = root.querySelector('.nj-grid');
  root.querySelectorAll('.nj-filters button').forEach(btn => btn.addEventListener('click', () => {
    root.querySelectorAll('.nj-filters button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const f = btn.dataset.filter;
    grid.classList.toggle('is-filtered', f !== 'all');
    root.querySelectorAll('.nj-card').forEach(c => { c.hidden = f !== 'all' && c.dataset.topic !== f; });
  }));

  // reader: every article opens full page, with a deep link (#article-id)
  const reader = root.querySelector('.nj-reader');
  const body = reader.querySelector('.nj-reader__article');
  let lastFocus = null;
  const byId = id => N.articles.find(a => a.id === id);
  const open = (id, push = true) => {
    const a = byId(id);
    if (!a) return;
    const i = N.articles.indexOf(a);
    const next = N.articles[(i + 1) % N.articles.length];
    body.innerHTML = `<header class="nj-reader__head"><p class="nj-kicker">${esc(tagName(a.tag))}</p><h2 id="nj-reader-title">${esc(a.title)}</h2><p class="nj-dek">${esc(a.dek)}</p><p class="nj-meta">${meta(a)}</p></header>`
      + `<figure class="nj-reader__photo">${photo(a.image)}</figure>`
      + `<div class="nj-reader__text">${a.body.map((p, k) => `<p${k === 0 ? ' class="nj-dropcap"' : ''}>${esc(p)}</p>`).join('')}</div>`
      + `<footer class="nj-reader__foot">${a.link ? `<a class="nj-btn nj-btn--gold" href="${P}/${esc(a.link.href)}">${esc(a.link.label)} <span aria-hidden="true">↗</span></a>` : ''}<button type="button" class="nj-reader__next" data-next="${esc(next.id)}"><small>${esc(ui.next)}</small><span>${esc(next.title)}</span></button></footer>`;
    if (reader.hidden) lastFocus = document.activeElement;
    reader.hidden = false;
    reader.scrollTop = 0;
    document.documentElement.classList.add('nj-reading');
    window.__emperioLenis?.stop?.();
    requestAnimationFrame(() => reader.classList.add('is-open'));
    body.focus({ preventScroll: true });
    if (push) history.replaceState(null, '', `#${id}`);
  };
  const close = () => {
    if (reader.hidden) return;
    reader.classList.remove('is-open');
    reader.hidden = true;
    document.documentElement.classList.remove('nj-reading');
    window.__emperioLenis?.start?.();
    history.replaceState(null, '', location.pathname + location.search);
    lastFocus?.focus?.({ preventScroll: true });
  };
  root.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); open(opener.dataset.open); return; }
    const next = e.target.closest('[data-next]');
    if (next) { open(next.dataset.next); return; }
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  if (location.hash && byId(location.hash.slice(1))) open(location.hash.slice(1), false);
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (byId(id)) open(id, false); });
  const status = (f, s, ok) => {
    const e = f.querySelector('.news-form-status');
    if (e) {
      e.textContent = s;
      e.dataset.state = ok ? 'success' : 'error';
      e.style.removeProperty('color');
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
