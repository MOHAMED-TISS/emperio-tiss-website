// Search and sharing copy for the 14 canonical routes in the 5 site languages: one source of truth
// for <title>, the meta description, Open Graph / Twitter cards, the breadcrumb and the JSON-LD
// the SEO worker writes into every routed page. Copy only states what the pages themselves say.
// The Mediterranean is a fishing ground (origin), never a market.

const ORIGIN = 'https://emperio-tiss.com';
const BRAND = 'EMPERIO TISS';

// [title, description] per language (es, en, fr, it, ar)
export const SEO_COPY = {
  '/': {
    es: ['EMPERIO TISS | Productos del mar, frutas y hortalizas B2B', 'Suministro B2B de productos del mar, frutas y hortalizas desde Madrid: origen, especificación y disponibilidad para compradores de Europa, África y Oriente Medio.'],
    en: ['EMPERIO TISS | B2B seafood, fruit and vegetables supply', 'B2B supply of seafood, fruit and vegetables from Madrid: origin, specification and availability for professional buyers in Europe, Africa and the Middle East.'],
    fr: ['EMPERIO TISS | Produits de la mer, fruits et légumes B2B', 'Approvisionnement B2B en produits de la mer, fruits et légumes depuis Madrid, pour les acheteurs professionnels d’Europe, d’Afrique et du Moyen-Orient.'],
    it: ['EMPERIO TISS | Prodotti del mare, frutta e ortaggi B2B', 'Fornitura B2B di prodotti del mare, frutta e ortaggi da Madrid: origine, specifiche e disponibilità per buyer professionali in Europa, Africa e Medio Oriente.'],
    ar: ['EMPERIO TISS | توريد المأكولات البحرية والفواكه والخضروات', 'توريد مهني للمأكولات البحرية والفواكه والخضروات من مدريد: المنشأ والمواصفات والتوافر للمشترين المهنيين في أوروبا وأفريقيا والشرق الأوسط.']
  },
  '/about/': {
    es: ['Empresa | EMPERIO TISS, suministro alimentario B2B', 'EMPERIO TISS, una empresa internacional orientada al mercado alimentario profesional, con conocimiento, precisión, responsabilidad y visión de largo plazo.'],
    en: ['About EMPERIO TISS | B2B food supply company', 'EMPERIO TISS is an international food company for professional markets, built on knowledge, precision, responsibility and a long-term vision.'],
    fr: ['L’entreprise EMPERIO TISS | Approvisionnement B2B', 'EMPERIO TISS est une entreprise moderne du secteur alimentaire, fondée sur la connaissance, la précision, la responsabilité et l’évolution continue.'],
    it: ['L’azienda EMPERIO TISS | Fornitura alimentare B2B', 'EMPERIO TISS opera nelle forniture alimentari B2B, collegando origini selezionate e buyer professionali in Europa, Africa e Medio Oriente.'],
    ar: ['عن EMPERIO TISS | شركة توريد غذائي مهني', 'EMPERIO TISS شركة غذائية دولية تخدم السوق المهنية، تقوم على المعرفة والدقة والمسؤولية والرؤية بعيدة المدى.']
  },
  '/products/': {
    es: ['Productos del mar, frutas y hortalizas | EMPERIO TISS', 'Productos seleccionados de EMPERIO TISS: productos del mar, frutas, hortalizas y productos de temporada para compradores profesionales.'],
    en: ['Seafood, fruit and vegetables | EMPERIO TISS', 'Selected seafood, fruits, vegetables and seasonal products for professional buyers, defined by origin, specification, quality, format and availability.'],
    fr: ['Produits de la mer, fruits et légumes | EMPERIO TISS', 'Produits de la mer, fruits, légumes et produits de saison pour acheteurs professionnels, définis par origine, spécification, qualité, format et disponibilité.'],
    it: ['Prodotti del mare, frutta e ortaggi | EMPERIO TISS', 'Prodotti del mare, frutta, ortaggi e prodotti stagionali selezionati per buyer professionali, definiti da origine, specifiche, qualità, formato e disponibilità.'],
    ar: ['المأكولات البحرية والفواكه والخضروات | EMPERIO TISS', 'منتجات مختارة من EMPERIO TISS: المأكولات البحرية والفواكه والخضروات والمنتجات الموسمية للمشترين المهنيين.']
  },
  '/products/seafood/': {
    es: ['Pescados, mariscos y cefalópodos | EMPERIO TISS', 'Pescados, mariscos y cefalópodos seleccionados para compradores profesionales, con especificaciones de origen, calibre, calidad y disponibilidad.'],
    en: ['Fish, shellfish and cephalopods | EMPERIO TISS', 'Selected fish, shellfish and cephalopods for professional buyers, with clear specifications of origin, size, quality, format and availability.'],
    fr: ['Poissons, crustacés et céphalopodes | EMPERIO TISS', 'Poissons, crustacés, coquillages et céphalopodes sélectionnés pour les acheteurs professionnels : origine, calibre, qualité, format et disponibilité.'],
    it: ['Pesce, crostacei e cefalopodi | EMPERIO TISS', 'Pesce, molluschi e cefalopodi selezionati per buyer professionali, con specifiche di origine, calibro, qualità, formato e disponibilità.'],
    ar: ['الأسماك والقشريات ورأسيات الأرجل | EMPERIO TISS', 'أسماك وقشريات ورأسيات أرجل مختارة للمشترين المهنيين، بمواصفات واضحة للمنشأ والحجم والجودة والتعبئة والتوافر.']
  },
  '/products/seafood/fish/': {
    es: ['Pescados frescos por referencia | EMPERIO TISS', 'Pescados seleccionados para compradores profesionales, definidos por especie, origen, FAO, calibre, calidad, presentación y disponibilidad.'],
    en: ['Fresh fish by reference | EMPERIO TISS', 'Selected fish for professional buyers, defined by species, origin, FAO area, size, quality, presentation and availability.'],
    fr: ['Poissons frais par référence | EMPERIO TISS', 'Poissons sélectionnés pour les acheteurs professionnels, définis par espèce, origine, zone FAO, calibre, qualité, présentation et disponibilité.'],
    it: ['Pesce fresco per referenza | EMPERIO TISS', 'Pesce selezionato per buyer professionali, definito per specie, origine, zona FAO, calibro, qualità, presentazione e disponibilità.'],
    ar: ['أسماك طازجة حسب المرجع | EMPERIO TISS', 'أسماك مختارة للمشترين المهنيين، محددة حسب النوع والمنشأ ومنطقة FAO والمقاس والجودة والتقديم والتوفر.']
  },
  '/products/seafood/shellfish/': {
    es: ['Mariscos para compradores profesionales | EMPERIO TISS', 'Mariscos seleccionados para compradores profesionales, definidos por especie, origen, calibre, calidad, presentación y disponibilidad.'],
    en: ['Shellfish for professional buyers | EMPERIO TISS', 'Selected shellfish for professional buyers, defined by species, origin, size, quality, presentation and availability.'],
    fr: ['Crustacés et coquillages | EMPERIO TISS', 'Crustacés et coquillages sélectionnés pour les acheteurs professionnels, définis par espèce, origine, calibre, qualité et disponibilité.'],
    it: ['Crostacei e molluschi | EMPERIO TISS', 'Crostacei e molluschi selezionati per buyer professionali, definiti per specie, origine, calibro, qualità, presentazione e disponibilità.'],
    ar: ['القشريات والمحار | EMPERIO TISS', 'قشريات ومحار مختارة للمشترين المهنيين وفق النوع والمنشأ والحجم والجودة وطريقة التقديم والتوافر.']
  },
  '/products/seafood/cephalopods/': {
    es: ['Cefalópodos: pulpo, calamar y sepia | EMPERIO TISS', 'Cefalópodos seleccionados para compradores profesionales, definidos por especie, origen, calibre, calidad, presentación, formato y disponibilidad.'],
    en: ['Cephalopods: octopus, squid and cuttlefish | EMPERIO TISS', 'Selected cephalopods for professional buyers, defined by species, size, origin, quality, presentation, format and availability.'],
    fr: ['Céphalopodes : poulpe, calmar et seiche | EMPERIO TISS', 'Céphalopodes sélectionnés pour les acheteurs professionnels, définis par espèce, calibre, origine, qualité, présentation, format et disponibilité.'],
    it: ['Cefalopodi: polpo, calamaro e seppia | EMPERIO TISS', 'Cefalopodi selezionati per buyer professionali, definiti per specie, calibro, origine, qualità, presentazione, formato e disponibilità.'],
    ar: ['رأسيات الأرجل: الأخطبوط والحبار | EMPERIO TISS', 'رأسيات أرجل مختارة للمشترين المهنيين وفق النوع والحجم والمنشأ والجودة وطريقة التقديم والتعبئة والتوافر.']
  },
  '/products/fruits-vegetables/': {
    es: ['Frutas y hortalizas para profesionales | EMPERIO TISS', 'Frutas y hortalizas seleccionadas para compradores profesionales, definidas por variedad, origen, calibre, calidad, campaña y disponibilidad.'],
    en: ['Fruit and vegetables for professionals | EMPERIO TISS', 'Selected fruits and vegetables for professional buyers, defined by variety, origin, sizing, quality, season and availability.'],
    fr: ['Fruits et légumes pour professionnels | EMPERIO TISS', 'Fruits et légumes sélectionnés pour les acheteurs professionnels, définis par variété, origine, calibre, qualité, campagne et disponibilité.'],
    it: ['Frutta e ortaggi per professionisti | EMPERIO TISS', 'Frutta e ortaggi selezionati per acquirenti professionali, definiti per varietà, origine, calibro, qualità, campagna e disponibilità.'],
    ar: ['الفواكه والخضروات للمحترفين | EMPERIO TISS', 'فواكه وخضروات مختارة للمشترين المحترفين وفق الصنف والمنشأ والحجم والجودة والموسم والتوفر.']
  },
  '/products/fruits/': {
    es: ['Frutas seleccionadas por origen y campaña | EMPERIO TISS', 'Frutas seleccionadas para compradores profesionales, definidas por variedad, origen, calibre, calidad, campaña y programa de suministro.'],
    en: ['Fruit selected by origin and season | EMPERIO TISS', 'Selected fruits for professional buyers, defined by variety, origin, sizing, season and supply programme.'],
    fr: ['Fruits sélectionnés par origine et campagne | EMPERIO TISS', 'Fruits sélectionnés pour les acheteurs professionnels, définis par variété, origine, calibre, campagne et programme d’approvisionnement.'],
    it: ['Frutta selezionata per origine e campagna | EMPERIO TISS', 'Frutta selezionata per buyer professionali, definita per varietà, origine, calibro, stagione e programma di fornitura.'],
    ar: ['فواكه مختارة حسب المنشأ والموسم | EMPERIO TISS', 'فواكه مختارة للمشترين المحترفين حسب الصنف والمنشأ والحجم والموسم وبرنامج التوريد.']
  },
  '/products/vegetables/': {
    es: ['Hortalizas frescas B2B | EMPERIO TISS', 'Hortalizas frescas seleccionadas para compradores profesionales, definidas por variedad, origen, calibre, calidad, formato, envase y disponibilidad.'],
    en: ['Fresh vegetables for B2B buyers | EMPERIO TISS', 'Fresh vegetables for professional buyers, defined by variety, origin, size, quality, format, packaging and availability.'],
    fr: ['Légumes frais pour acheteurs B2B | EMPERIO TISS', 'Légumes frais pour les acheteurs professionnels, définis par variété, origine, calibre, qualité, format, conditionnement et disponibilité.'],
    it: ['Ortaggi freschi per buyer B2B | EMPERIO TISS', 'Ortaggi freschi per buyer professionali, definiti per varietà, origine, calibro, qualità, formato, confezionamento e disponibilità.'],
    ar: ['خضروات طازجة للمشترين المهنيين | EMPERIO TISS', 'خضروات طازجة للمشترين المهنيين وفق الصنف والمنشأ والحجم والجودة والشكل والتعبئة والتوافر.']
  },
  '/products/seasonal/': {
    es: ['Productos de temporada por campaña | EMPERIO TISS', 'Productos de temporada seleccionados según campañas, origen, disponibilidad y oportunidad para compradores profesionales.'],
    en: ['Seasonal products by campaign | EMPERIO TISS', 'Seasonal products selected by campaign, origin, availability and opportunity for professional buyers.'],
    fr: ['Produits de saison par campagne | EMPERIO TISS', 'Produits de saison sélectionnés selon la campagne, l’origine, la disponibilité et l’opportunité pour les acheteurs professionnels.'],
    it: ['Prodotti di stagione per campagna | EMPERIO TISS', 'Prodotti di stagione selezionati per campagna, origine, disponibilità e opportunità per buyer professionali.'],
    ar: ['المنتجات الموسمية حسب الموسم | EMPERIO TISS', 'منتجات موسمية مختارة حسب الموسم والمنشأ والتوافر والفرصة للمشترين المهنيين.']
  },
  '/markets/': {
    es: ['Mercados: Europa, África y Oriente Medio | EMPERIO TISS', 'Desde Madrid hacia destinos profesionales de Europa, África y Oriente Medio, con el Mediterráneo como zona de captura del pescado que seleccionamos.'],
    en: ['Markets: Europe, Africa and the Middle East | EMPERIO TISS', 'From Madrid to professional destinations across Europe, Africa and the Middle East, with the Mediterranean as the fishing ground of the fish we select.'],
    fr: ['Marchés : Europe, Afrique et Moyen-Orient | EMPERIO TISS', 'Depuis Madrid vers l’Europe, l’Afrique et le Moyen-Orient, avec la Méditerranée comme zone de pêche du poisson que nous sélectionnons.'],
    it: ['Mercati: Europa, Africa e Medio Oriente | EMPERIO TISS', 'Da Madrid verso destinazioni professionali in Europa, Africa e Medio Oriente, con il Mediterraneo come zona di pesca del pesce che selezioniamo.'],
    ar: ['الأسواق: أوروبا وأفريقيا والشرق الأوسط | EMPERIO TISS', 'من مدريد إلى وجهات مهنية في أوروبا وأفريقيا والشرق الأوسط، والبحر المتوسط منطقة صيد الأسماك التي نختارها.']
  },
  '/news/': {
    es: ['Noticias e inteligencia de mercado | EMPERIO TISS', 'Señales de mercado, producto, origen y oportunidades para compradores profesionales, y acceso a EMPERIO Signature para empresas aprobadas.'],
    en: ['News and market intelligence | EMPERIO TISS', 'Market, product, origin and opportunity signals for professional buyers, plus EMPERIO Signature access for approved companies.'],
    fr: ['Actualités et intelligence de marché | EMPERIO TISS', 'Signaux de marché, produit, origine et opportunités pour les acheteurs professionnels, et accès EMPERIO Signature pour les entreprises approuvées.'],
    it: ['Notizie e intelligence di mercato | EMPERIO TISS', 'Segnali di mercato, prodotto, origine e opportunità per buyer professionali, con accesso a EMPERIO Signature per le aziende approvate.'],
    ar: ['الأخبار وذكاء السوق | EMPERIO TISS', 'إشارات السوق والمنتجات والمنشأ والفرص للمشترين المهنيين، مع وصول EMPERIO Signature للشركات المعتمدة.']
  },
  '/contact/': {
    es: ['Contacto para compradores profesionales | EMPERIO TISS', 'Cuéntenos producto, origen, volumen y destino: el equipo de EMPERIO TISS en Madrid estudia cada consulta B2B de productos del mar, frutas y hortalizas.'],
    en: ['Contact for professional buyers | EMPERIO TISS', 'Tell us the product, origin, volume and destination: the EMPERIO TISS team in Madrid studies every B2B enquiry for seafood, fruit and vegetables.'],
    fr: ['Contact pour acheteurs professionnels | EMPERIO TISS', 'Indiquez produit, origine, volume et destination : l’équipe EMPERIO TISS à Madrid étudie chaque demande B2B de produits de la mer, fruits et légumes.'],
    it: ['Contatti per buyer professionali | EMPERIO TISS', 'Indicateci prodotto, origine, volume e destinazione: il team EMPERIO TISS a Madrid valuta ogni richiesta B2B di prodotti del mare, frutta e ortaggi.'],
    ar: ['تواصل للمشترين المهنيين | EMPERIO TISS', 'أخبرونا بالمنتج والمنشأ والكمية والوجهة: يدرس فريق EMPERIO TISS في مدريد كل طلب توريد مهني للمأكولات البحرية والفواكه والخضروات.']
  }
};

// Breadcrumb labels and parents
const CRUMB = {
  '/': ['Inicio', 'Home', 'Accueil', 'Home', 'الرئيسية'],
  '/about/': ['Empresa', 'Company', 'Entreprise', 'Azienda', 'الشركة'],
  '/products/': ['Productos', 'Products', 'Produits', 'Prodotti', 'المنتجات'],
  '/products/seafood/': ['Productos del mar', 'Seafood', 'Produits de la mer', 'Prodotti del mare', 'المأكولات البحرية'],
  '/products/seafood/fish/': ['Pescados', 'Fish', 'Poissons', 'Pesce', 'الأسماك'],
  '/products/seafood/shellfish/': ['Mariscos', 'Shellfish', 'Crustacés et coquillages', 'Crostacei e molluschi', 'القشريات والمحار'],
  '/products/seafood/cephalopods/': ['Cefalópodos', 'Cephalopods', 'Céphalopodes', 'Cefalopodi', 'رأسيات الأرجل'],
  '/products/fruits-vegetables/': ['Frutas y hortalizas', 'Fruit and vegetables', 'Fruits et légumes', 'Frutta e ortaggi', 'الفواكه والخضروات'],
  '/products/fruits/': ['Frutas', 'Fruit', 'Fruits', 'Frutta', 'الفواكه'],
  '/products/vegetables/': ['Hortalizas', 'Vegetables', 'Légumes', 'Ortaggi', 'الخضروات'],
  '/products/seasonal/': ['Temporada', 'Seasonal', 'Saison', 'Stagionali', 'المنتجات الموسمية'],
  '/markets/': ['Mercados', 'Markets', 'Marchés', 'Mercati', 'الأسواق'],
  '/news/': ['Noticias', 'News', 'Actualités', 'Notizie', 'الأخبار'],
  '/contact/': ['Contacto', 'Contact', 'Contact', 'Contatti', 'اتصل بنا']
};
const PARENT = {
  '/products/seafood/fish/': '/products/seafood/',
  '/products/seafood/shellfish/': '/products/seafood/',
  '/products/seafood/cephalopods/': '/products/seafood/',
  '/products/seafood/': '/products/',
  '/products/fruits/': '/products/fruits-vegetables/',
  '/products/vegetables/': '/products/fruits-vegetables/',
  '/products/fruits-vegetables/': '/products/',
  '/products/seasonal/': '/products/'
};
const LANGS = ['es', 'en', 'fr', 'it', 'ar'];
const LOCALE = { es: 'es_ES', en: 'en_GB', fr: 'fr_FR', it: 'it_IT', ar: 'ar_AR' };
const PAGE_TYPE = {
  '/': 'WebPage', '/about/': 'AboutPage', '/contact/': 'ContactPage', '/markets/': 'WebPage', '/news/': 'CollectionPage'
};
const SHARE_IMAGE = `${ORIGIN}/assets/images/brand/og-share-1200x630.png`;

const escapeHtml = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pathFor = (language, suffix) => language === 'es' ? suffix : (suffix === '/' ? `/${language}/` : `/${language}${suffix}`);

export function seoCopy(language, suffix) {
  const entry = SEO_COPY[suffix]?.[language];
  return entry ? { title: entry[0], description: entry[1] } : null;
}

const breadcrumb = (language, suffix) => {
  const index = LANGS.indexOf(language);
  const chain = [];
  for (let s = suffix; s; s = PARENT[s]) chain.unshift(s);
  if (suffix !== '/') chain.unshift('/');
  return chain.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: CRUMB[s][index], item: `${ORIGIN}${pathFor(language, s)}` }));
};

export function buildStructuredData(language, suffix, canonical) {
  const copy = seoCopy(language, suffix);
  const org = {
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: 'EMPERIO TISS S.L.',
    alternateName: BRAND,
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/assets/images/logo.png`,
    email: 'info@emperio-tiss.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Madrid', addressCountry: 'ES' },
    areaServed: ['Europe', 'Africa', 'Middle East'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'info@emperio-tiss.com', availableLanguage: ['es', 'en', 'fr', 'it', 'ar'] },
    sameAs: ['https://www.linkedin.com/company/emperiotiss/']
  };
  const website = { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: BRAND, publisher: { '@id': org['@id'] }, inLanguage: LANGS };
  const page = {
    '@type': PAGE_TYPE[suffix] || 'CollectionPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: copy.title,
    description: copy.description,
    inLanguage: language,
    isPartOf: { '@id': website['@id'] },
    publisher: { '@id': org['@id'] },
    breadcrumb: { '@id': `${canonical}#breadcrumb` }
  };
  const crumbs = { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: breadcrumb(language, suffix) };
  const graph = { '@context': 'https://schema.org', '@graph': [org, website, page, crumbs] };
  return `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
}

export function buildSocialHead(language, suffix, canonical) {
  const copy = seoCopy(language, suffix);
  const alternates = LANGS.filter(l => l !== language).map(l => `<meta property="og:locale:alternate" content="${LOCALE[l]}">`).join('');
  return `<meta property="og:type" content="website">` +
    `<meta property="og:site_name" content="${BRAND}">` +
    `<meta property="og:title" content="${escapeHtml(copy.title)}">` +
    `<meta property="og:description" content="${escapeHtml(copy.description)}">` +
    `<meta property="og:url" content="${canonical}">` +
    `<meta property="og:image" content="${SHARE_IMAGE}">` +
    `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` +
    `<meta property="og:locale" content="${LOCALE[language]}">${alternates}` +
    `<meta name="twitter:card" content="summary_large_image">` +
    `<meta name="twitter:title" content="${escapeHtml(copy.title)}">` +
    `<meta name="twitter:description" content="${escapeHtml(copy.description)}">` +
    `<meta name="twitter:image" content="${SHARE_IMAGE}">`;
}
