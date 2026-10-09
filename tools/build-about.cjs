#!/usr/bin/env node
/* Builds the Company page (/about/) from one corporate structure.
   usage: node tools/build-about.cjs [lang ...]   (default: every language in COPY)
   Copy only restates what the site already says (company page, values, responsibility,
   operating process, Home geography). The Mediterranean is a fishing ground, never a market.
   Owner 2026-10-09: no figures, no team, no sanitary registration, no founding year. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const ARROW = '<span class="co-arrow" aria-hidden="true">→</span>';
const HERO_IMAGE = 'https://images.pexels.com/photos/29258685/pexels-photo-29258685.jpeg?auto=compress&cs=tinysrgb&w=1200';
const AREA_IMAGES = ['/assets/images/home-seafood.webp', '/assets/images/home-produce.webp', '/assets/images/home-seasonal.webp'];
const AREA_ROUTES = ['products/seafood/', 'products/fruits-vegetables/', 'products/seasonal/'];

const COPY = {
  es: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'Del origen al mercado, con criterio.',
    lead: 'Empresa española de comercio alimentario B2B. Desde Madrid, conectamos orígenes seleccionados con compradores profesionales en Europa, África y Oriente Medio.',
    contact: 'Contactar', areasLink: 'Áreas de negocio',
    facts: [['Sede', 'Madrid, España'], ['Actividad', 'Comercio alimentario B2B'], ['Áreas', 'Mar · Frutas y hortalizas · Temporada'], ['Mercados', 'Europa · África · Oriente Medio']],
    who: ['01 · Quiénes somos', 'Una empresa para el comercio alimentario profesional.', 'Operamos como parte principal en cada operación: ante el comprador representamos la oferta y respondemos del producto; ante el productor compramos con criterios claros, destino definido y visión de mercado.', 'EMPERIO TISS nace con una visión internacional: comprender mejor los productos, entender mejor los mercados y trabajar mejor con las personas.'],
    mvLabel: '02 · Misión, visión y valores', mvTitle: 'Lo que nos guía.',
    mission: ['Misión', 'Hacer el comercio alimentario internacional más fiable: elegir bien cada origen, definir cada producto con precisión y responder de él hasta su destino.'],
    vision: ['Visión', 'Construir una empresa preparada para un mercado alimentario más exigente: más conocimiento, más criterio y mejores decisiones.'],
    valuesTitle: 'Valores',
    values: [['Precisión', 'Los detalles importan.'], ['Integridad', 'Hacemos lo que decimos.'], ['Transparencia', 'La confianza comienza con claridad.'], ['Conocimiento', 'Entender mejor permite decidir mejor.'], ['Responsabilidad', 'Pensamos más allá del resultado inmediato.'], ['Adaptabilidad', 'Evolucionamos con el mercado.']],
    model: ['03 · Cómo operamos', 'Un modelo de operación claro.', 'Cada operación parte de una necesidad concreta y se estructura en torno a una especificación verificable antes de coordinar el suministro.'],
    steps: [['Conocer', 'Producto, origen, disponibilidad y contexto comercial.'], ['Especificar', 'Calibre, calidad, presentación, formato y destino, verificados antes de confirmar.'], ['Operar', 'Como parte principal: respondemos del producto ante el comprador y compramos con criterio al productor.'], ['Coordinar', 'Una línea clara desde el acuerdo comercial hasta el mercado de destino.']],
    principle: ['Precisión antes que promesa.', 'Antes de confirmar, verificamos lo que determina el valor real de la operación: producto, origen, especificación y mercado.'],
    areas: ['04 · Áreas de negocio', 'Tres áreas de negocio.', 'Cada área se define por origen, especificación y disponibilidad.'],
    areaList: [['Productos del mar', 'Pescados, mariscos y cefalópodos, frescos y congelados.'], ['Frutas y hortalizas', 'Variedades seleccionadas por origen, calibre y campaña.'], ['Temporada', 'Campañas y oportunidades según origen y disponibilidad.']],
    catalogue: 'Ver catálogo',
    presence: ['05 · Presencia internacional', 'Madrid', 'Sede de EMPERIO TISS S.L. Desde Madrid, al mundo.'],
    regions: [['Europa', 'España, Francia, Italia, Alemania y Países Bajos.'], ['África', 'Marruecos, Túnez, Mauritania y África Occidental.'], ['Oriente Medio', 'Golfo y Levante.']],
    note: 'El Mediterráneo es zona de captura: el origen de parte del pescado que seleccionamos.',
    markets: 'Ver mercados',
    dataLabel: '06 · Datos corporativos', dataTitle: 'Datos corporativos.',
    data: [['Razón social', 'EMPERIO TISS S.L.'], ['Sede', 'Madrid, España'], ['Actividad', 'Comercio alimentario B2B'], ['Áreas de negocio', 'Productos del mar, frutas y hortalizas, temporada'], ['Mercados', 'Europa, África y Oriente Medio'], ['Contacto', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsabilidad', commitTitle: 'Responsabilidad.',
    commit: [['El futuro también importa.', 'La alimentación depende de recursos naturales y ecosistemas que debemos proteger. Buscamos trabajar con más eficiencia, menos desperdicio y mayor conciencia sobre los recursos. No buscamos parecer sostenibles: queremos aprender a hacerlo mejor.'], ['La tecnología ayuda. El criterio decide.', 'Usamos nuevas herramientas cuando aportan valor real: mejor información, mejor coordinación y más eficiencia. Detrás de cada decisión siguen estando las personas.']],
    close: ['Contacto', 'Hablemos de una necesidad concreta.', 'Cuéntenos producto, origen, volumen y destino: estudiamos cada consulta profesional.'],
    signature: ['EMPERIO Signature', 'Acceso profesional', 'Ofertas privadas, disponibilidad y referencias para empresas aprobadas.', 'Entrar']
  },
  en: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'From origin to market, with purpose.',
    lead: 'A Spanish B2B food trading company. From Madrid, we connect selected origins with professional buyers in Europe, Africa and the Middle East.',
    contact: 'Contact us', areasLink: 'Business areas',
    facts: [['Headquarters', 'Madrid, Spain'], ['Activity', 'B2B food trading'], ['Areas', 'Seafood · Fruit and vegetables · Seasonal'], ['Markets', 'Europe · Africa · Middle East']],
    who: ['01 · Who we are', 'A company built for professional food trade.', 'We act as principal in every operation: for buyers we represent the offer and stand behind the product; for producers we buy with clear criteria, a defined destination and market vision.', 'EMPERIO TISS is built around an international vision: understanding products better, reading markets better and working better with people.'],
    mvLabel: '02 · Mission, vision and values', mvTitle: 'What guides us.',
    mission: ['Mission', 'To make international food trade more reliable: choosing every origin well, defining every product precisely and standing behind it all the way to its destination.'],
    vision: ['Vision', 'To build a company ready for a more demanding food market: more knowledge, more judgement and better decisions.'],
    valuesTitle: 'Values',
    values: [['Precision', 'Details matter.'], ['Integrity', 'We do what we say.'], ['Transparency', 'Trust starts with clarity.'], ['Knowledge', 'Understanding better enables better decisions.'], ['Responsibility', 'We think beyond the immediate outcome.'], ['Adaptability', 'We evolve with the market.']],
    model: ['03 · How we operate', 'A clear operating model.', 'Every operation starts from a concrete need and is structured around a verifiable specification before supply is coordinated.'],
    steps: [['Understand', 'Product, origin, availability and commercial context.'], ['Specify', 'Size, quality, presentation, format and destination, verified before confirming.'], ['Operate', 'As principal: we stand behind the product for the buyer and buy with judgement from the producer.'], ['Coordinate', 'One clear line from the commercial agreement to the destination market.']],
    principle: ['Precision before promise.', 'Before confirming, we check what determines the real value of the operation: product, origin, specification and market.'],
    areas: ['04 · Business areas', 'Three business areas.', 'Each area is defined by origin, specification and availability.'],
    areaList: [['Seafood', 'Fish, shellfish and cephalopods, fresh and frozen.'], ['Fruit and vegetables', 'Varieties selected by origin, size and season.'], ['Seasonal', 'Campaigns and opportunities by origin and availability.']],
    catalogue: 'View catalogue',
    presence: ['05 · International presence', 'Madrid', 'Headquarters of EMPERIO TISS S.L. From Madrid to the world.'],
    regions: [['Europe', 'Spain, France, Italy, Germany and the Netherlands.'], ['Africa', 'Morocco, Tunisia, Mauritania and West Africa.'], ['Middle East', 'The Gulf and the Levant.']],
    note: 'The Mediterranean is a fishing ground: the origin of part of the fish we select.',
    markets: 'View markets',
    dataLabel: '06 · Corporate information', dataTitle: 'Corporate information.',
    data: [['Company name', 'EMPERIO TISS S.L.'], ['Headquarters', 'Madrid, Spain'], ['Activity', 'B2B food trading'], ['Business areas', 'Seafood, fruit and vegetables, seasonal'], ['Markets', 'Europe, Africa and the Middle East'], ['Contact', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsibility', commitTitle: 'Responsibility.',
    commit: [['The future matters too.', 'Food depends on natural resources and ecosystems that deserve protection. We aim to work with greater efficiency, less waste and more awareness of resources. We do not want to look sustainable: we want to learn to do better.'], ['Technology helps. Judgement decides.', 'We use new tools when they create real value: better information, better coordination and greater efficiency. People remain behind every decision.']],
    close: ['Contact', 'Let’s talk about a concrete need.', 'Tell us the product, origin, volume and destination: we study every professional enquiry.'],
    signature: ['EMPERIO Signature', 'Professional access', 'Private offers, availability and references for approved companies.', 'Enter']
  },
  fr: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'De l’origine au marché, avec discernement.',
    lead: 'Entreprise espagnole de négoce alimentaire B2B. Depuis Madrid, nous relions des origines sélectionnées à des acheteurs professionnels en Europe, en Afrique et au Moyen-Orient.',
    contact: 'Nous contacter', areasLink: 'Domaines d’activité',
    facts: [['Siège', 'Madrid, Espagne'], ['Activité', 'Négoce alimentaire B2B'], ['Domaines', 'Mer · Fruits et légumes · Saison'], ['Marchés', 'Europe · Afrique · Moyen-Orient']],
    who: ['01 · Qui sommes-nous', 'Une entreprise pensée pour le négoce alimentaire professionnel.', 'Nous intervenons comme partie principale dans chaque opération : pour l’acheteur, nous représentons l’offre et répondons du produit ; pour le producteur, nous achetons avec des critères clairs, une destination définie et une vision de marché.', 'EMPERIO TISS est né d’une vision internationale : mieux comprendre les produits, mieux lire les marchés et mieux travailler avec les personnes.'],
    mvLabel: '02 · Mission, vision et valeurs', mvTitle: 'Ce qui nous guide.',
    mission: ['Mission', 'Rendre le commerce alimentaire international plus fiable : bien choisir chaque origine, définir chaque produit avec précision et en répondre jusqu’à sa destination.'],
    vision: ['Vision', 'Construire une entreprise prête pour un marché alimentaire plus exigeant : plus de connaissance, plus de discernement et de meilleures décisions.'],
    valuesTitle: 'Valeurs',
    values: [['Précision', 'Les détails comptent.'], ['Intégrité', 'Nous faisons ce que nous disons.'], ['Transparence', 'La confiance commence par la clarté.'], ['Connaissance', 'Mieux comprendre permet de mieux décider.'], ['Responsabilité', 'Nous pensons au-delà du résultat immédiat.'], ['Adaptabilité', 'Nous évoluons avec le marché.']],
    model: ['03 · Notre fonctionnement', 'Un modèle opérationnel clair.', 'Chaque opération part d’un besoin concret et se structure autour d’une spécification vérifiable avant la coordination de l’approvisionnement.'],
    steps: [['Connaître', 'Produit, origine, disponibilité et contexte commercial.'], ['Spécifier', 'Calibre, qualité, présentation, format et destination, vérifiés avant confirmation.'], ['Opérer', 'En partie principale : nous répondons du produit devant l’acheteur et achetons avec discernement au producteur.'], ['Coordonner', 'Une ligne claire de l’accord commercial jusqu’au marché de destination.']],
    principle: ['La précision avant la promesse.', 'Avant de confirmer, nous vérifions ce qui détermine la valeur réelle de l’opération : produit, origine, spécification et marché.'],
    areas: ['04 · Domaines d’activité', 'Trois domaines d’activité.', 'Chaque domaine se définit par l’origine, la spécification et la disponibilité.'],
    areaList: [['Produits de la mer', 'Poissons, crustacés et céphalopodes, frais et surgelés.'], ['Fruits et légumes', 'Variétés sélectionnées par origine, calibre et campagne.'], ['Produits de saison', 'Campagnes et opportunités selon l’origine et la disponibilité.']],
    catalogue: 'Voir le catalogue',
    presence: ['05 · Présence internationale', 'Madrid', 'Siège d’EMPERIO TISS S.L. De Madrid au monde.'],
    regions: [['Europe', 'Espagne, France, Italie, Allemagne et Pays-Bas.'], ['Afrique', 'Maroc, Tunisie, Mauritanie et Afrique de l’Ouest.'], ['Moyen-Orient', 'Golfe et Levant.']],
    note: 'La Méditerranée est une zone de pêche : l’origine d’une partie du poisson que nous sélectionnons.',
    markets: 'Voir les marchés',
    dataLabel: '06 · Informations sur l’entreprise', dataTitle: 'Informations sur l’entreprise.',
    data: [['Raison sociale', 'EMPERIO TISS S.L.'], ['Siège', 'Madrid, Espagne'], ['Activité', 'Négoce alimentaire B2B'], ['Domaines d’activité', 'Produits de la mer, fruits et légumes, saison'], ['Marchés', 'Europe, Afrique et Moyen-Orient'], ['Contact', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsabilité', commitTitle: 'Responsabilité.',
    commit: [['L’avenir compte aussi.', 'L’alimentation dépend de ressources naturelles et d’écosystèmes qui doivent être préservés. Nous voulons travailler avec plus d’efficacité, moins de gaspillage et davantage de conscience des ressources. Nous ne cherchons pas à paraître responsables : nous voulons apprendre à faire mieux.'], ['La technologie aide. Le jugement décide.', 'Nous utilisons de nouveaux outils lorsqu’ils créent une vraie valeur : meilleure information, meilleure coordination, plus d’efficacité. Derrière chaque décision, il y a toujours des personnes.']],
    close: ['Contact', 'Parlons d’un besoin concret.', 'Indiquez produit, origine, volume et destination : nous étudions chaque demande professionnelle.'],
    signature: ['EMPERIO Signature', 'Accès professionnel', 'Offres privées, disponibilités et références pour les entreprises approuvées.', 'Entrer']
  },
  it: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'Dall’origine al mercato, con criterio.',
    lead: 'Azienda spagnola di commercio alimentare B2B. Da Madrid colleghiamo origini selezionate con buyer professionali in Europa, Africa e Medio Oriente.',
    contact: 'Contatta', areasLink: 'Aree di business',
    facts: [['Sede', 'Madrid, Spagna'], ['Attività', 'Commercio alimentare B2B'], ['Aree', 'Mare · Frutta e ortaggi · Stagionalità'], ['Mercati', 'Europa · Africa · Medio Oriente']],
    who: ['01 · Chi siamo', 'Un’azienda pensata per il commercio alimentare professionale.', 'Operiamo come parte principale in ogni operazione: per i compratori rappresentiamo l’offerta e rispondiamo del prodotto; per i produttori acquistiamo con criteri chiari, destinazione definita e visione di mercato.', 'EMPERIO TISS nasce con una visione internazionale: capire meglio i prodotti, leggere meglio i mercati e lavorare meglio con le persone.'],
    mvLabel: '02 · Missione, visione e valori', mvTitle: 'Ciò che ci guida.',
    mission: ['Missione', 'Rendere più affidabile il commercio alimentare internazionale: scegliere bene ogni origine, definire ogni prodotto con precisione e risponderne fino alla destinazione.'],
    vision: ['Visione', 'Costruire un’azienda pronta per un mercato alimentare più esigente: più conoscenza, più criterio e decisioni migliori.'],
    valuesTitle: 'Valori',
    values: [['Precisione', 'I dettagli contano.'], ['Integrità', 'Facciamo ciò che diciamo.'], ['Trasparenza', 'La fiducia inizia dalla chiarezza.'], ['Conoscenza', 'Capire meglio permette di decidere meglio.'], ['Responsabilità', 'Pensiamo oltre il risultato immediato.'], ['Adattabilità', 'Evolviamo con il mercato.']],
    model: ['03 · Come operiamo', 'Un modello operativo chiaro.', 'Ogni operazione parte da un’esigenza concreta e si struttura attorno a una specifica verificabile prima di coordinare la fornitura.'],
    steps: [['Conoscere', 'Prodotto, origine, disponibilità e contesto commerciale.'], ['Specificare', 'Calibro, qualità, presentazione, formato e destinazione, verificati prima di confermare.'], ['Operare', 'Come parte principale: rispondiamo del prodotto verso il compratore e acquistiamo con criterio dal produttore.'], ['Coordinare', 'Una linea chiara dall’accordo commerciale fino al mercato di destinazione.']],
    principle: ['Precisione prima della promessa.', 'Prima di confermare, verifichiamo ciò che determina il valore reale dell’operazione: prodotto, origine, specifiche e mercato.'],
    areas: ['04 · Aree di business', 'Tre aree di business.', 'Ogni area è definita da origine, specifiche e disponibilità.'],
    areaList: [['Prodotti del mare', 'Pesce, crostacei e cefalopodi, freschi e surgelati.'], ['Frutta e ortaggi', 'Varietà selezionate per origine, calibro e campagna.'], ['Stagionalità', 'Campagne e opportunità secondo origine e disponibilità.']],
    catalogue: 'Vedi il catalogo',
    presence: ['05 · Presenza internazionale', 'Madrid', 'Sede di EMPERIO TISS S.L. Da Madrid al mondo.'],
    regions: [['Europa', 'Spagna, Francia, Italia, Germania e Paesi Bassi.'], ['Africa', 'Marocco, Tunisia, Mauritania e Africa occidentale.'], ['Medio Oriente', 'Golfo e Levante.']],
    note: 'Il Mediterraneo è una zona di pesca: l’origine di parte del pesce che selezioniamo.',
    markets: 'Vedi i mercati',
    dataLabel: '06 · Dati societari', dataTitle: 'Dati societari.',
    data: [['Ragione sociale', 'EMPERIO TISS S.L.'], ['Sede', 'Madrid, Spagna'], ['Attività', 'Commercio alimentare B2B'], ['Aree di business', 'Prodotti del mare, frutta e ortaggi, stagionalità'], ['Mercati', 'Europa, Africa e Medio Oriente'], ['Contatti', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsabilità', commitTitle: 'Responsabilità.',
    commit: [['Anche il futuro conta.', 'L’alimentazione dipende da risorse naturali ed ecosistemi da proteggere. Vogliamo lavorare con più efficienza, meno sprechi e maggiore consapevolezza delle risorse. Non cerchiamo di sembrare sostenibili: vogliamo imparare a fare meglio.'], ['La tecnologia aiuta. Il criterio decide.', 'Usiamo nuovi strumenti quando portano valore reale: informazioni migliori, coordinamento migliore e più efficienza. Dietro ogni decisione restano le persone.']],
    close: ['Contatti', 'Parliamo di una necessità concreta.', 'Indicateci prodotto, origine, volume e destinazione: valutiamo ogni richiesta professionale.'],
    signature: ['EMPERIO Signature', 'Accesso professionale', 'Offerte private, disponibilità e referenze per aziende approvate.', 'Entra']
  },
  ar: {
    heroLabel: 'EMPERIO TISS S.L. · مدريد',
    h1: 'من المنشأ إلى السوق، بمعايير واضحة.',
    lead: 'شركة إسبانية للتجارة الغذائية بين الشركات (B2B). من مدريد، نربط مناشئ مختارة بمشترين مهنيين في أوروبا وأفريقيا والشرق الأوسط.',
    contact: 'تواصل معنا', areasLink: 'مجالات الأعمال',
    facts: [['المقر', 'مدريد، إسبانيا'], ['النشاط', 'تجارة غذائية بين الشركات'], ['المجالات', 'البحرية · الفواكه والخضروات · الموسمية'], ['الأسواق', 'أوروبا · أفريقيا · الشرق الأوسط']],
    who: ['01 · من نحن', 'شركة مصممة للتجارة الغذائية المهنية.', 'نعمل كطرف رئيسي في كل عملية: للمشترين نمثل العرض ونتحمل مسؤولية المنتج، وللمنتجين نشتري بمعايير واضحة ووجهة محددة ورؤية للسوق.', 'تأسست EMPERIO TISS برؤية دولية: فهم المنتجات بشكل أفضل، وقراءة الأسواق بشكل أفضل، والعمل بشكل أفضل مع الناس.'],
    mvLabel: '02 · الرسالة والرؤية والقيم', mvTitle: 'ما يوجّهنا.',
    mission: ['الرسالة', 'أن نجعل التجارة الغذائية الدولية أكثر موثوقية: نختار كل منشأ بعناية، ونحدد كل منتج بدقة، ونتحمل مسؤوليته حتى وجهته.'],
    vision: ['الرؤية', 'بناء شركة مستعدة لسوق غذائية أكثر تطلباً: معرفة أكبر، ومعايير أوضح، وقرارات أفضل.'],
    valuesTitle: 'القيم',
    values: [['الدقة', 'التفاصيل مهمة.'], ['النزاهة', 'نفعل ما نقول.'], ['الشفافية', 'الثقة تبدأ بالوضوح.'], ['المعرفة', 'الفهم الأفضل يقود إلى قرارات أفضل.'], ['المسؤولية', 'نفكر أبعد من النتيجة الفورية.'], ['المرونة', 'نتطور مع السوق.']],
    model: ['03 · كيف نعمل', 'نموذج عمل واضح.', 'تبدأ كل عملية من احتياج محدد وتُبنى حول مواصفة قابلة للتحقق قبل تنسيق التوريد.'],
    steps: [['نفهم', 'المنتج والمنشأ والتوافر والسياق التجاري.'], ['نحدد', 'الحجم والجودة والتقديم والشكل والوجهة، مع التحقق منها قبل التأكيد.'], ['ننفذ', 'كطرف رئيسي: نتحمل مسؤولية المنتج أمام المشتري ونشتري من المنتج بمعايير واضحة.'], ['ننسّق', 'خط واضح من الاتفاق التجاري حتى سوق الوجهة.']],
    principle: ['الدقة قبل الوعد.', 'قبل التأكيد، نتحقق مما يحدد القيمة الحقيقية للعملية: المنتج والمنشأ والمواصفات والسوق.'],
    areas: ['04 · مجالات الأعمال', 'ثلاثة مجالات أعمال.', 'يُحدَّد كل مجال حسب المنشأ والمواصفات والتوافر.'],
    areaList: [['المنتجات البحرية', 'أسماك وقشريات ورأسيات أرجل، طازجة ومجمدة.'], ['الفواكه والخضروات', 'أصناف مختارة حسب المنشأ والحجم والموسم.'], ['المنتجات الموسمية', 'مواسم وفرص حسب المنشأ والتوافر.']],
    catalogue: 'عرض الكتالوج',
    presence: ['05 · الحضور الدولي', 'مدريد', 'مقر EMPERIO TISS S.L. من مدريد إلى العالم.'],
    regions: [['أوروبا', 'إسبانيا وفرنسا وإيطاليا وألمانيا وهولندا.'], ['أفريقيا', 'المغرب وتونس وموريتانيا وغرب أفريقيا.'], ['الشرق الأوسط', 'الخليج والمشرق.']],
    note: 'البحر المتوسط منطقة صيد: منشأ جزء من الأسماك التي نختارها.',
    markets: 'عرض الأسواق',
    dataLabel: '06 · بيانات الشركة', dataTitle: 'بيانات الشركة.',
    data: [['الاسم التجاري', 'EMPERIO TISS S.L.'], ['المقر', 'مدريد، إسبانيا'], ['النشاط', 'تجارة غذائية بين الشركات (B2B)'], ['مجالات الأعمال', 'المنتجات البحرية والفواكه والخضروات والمنتجات الموسمية'], ['الأسواق', 'أوروبا وأفريقيا والشرق الأوسط'], ['التواصل', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · المسؤولية', commitTitle: 'المسؤولية.',
    commit: [['المستقبل مهم أيضاً.', 'تعتمد منظومة الغذاء على موارد طبيعية ونظم بيئية تستحق الحماية. نريد العمل بكفاءة أكبر وهدر أقل ووعي أكبر بالموارد. لا نريد أن نبدو مستدامين: نريد أن نتعلم كيف نفعل ذلك بشكل أفضل.'], ['التكنولوجيا تساعد. والحُكم يقرر.', 'نستخدم الأدوات الجديدة عندما تضيف قيمة حقيقية: معلومات أفضل وتنسيق أفضل وكفاءة أكبر. وخلف كل قرار يبقى الإنسان.']],
    close: ['تواصل', 'لنتحدث عن احتياج محدد.', 'أخبرونا بالمنتج والمنشأ والكمية والوجهة: ندرس كل طلب مهني.'],
    signature: ['EMPERIO Signature', 'وصول مهني', 'عروض خاصة وتوافر ومراجع للشركات المعتمدة.', 'دخول']
  }
};

const pad = i => String(i + 1).padStart(2, '0');

function main(lang) {
  const c = COPY[lang];
  const base = lang === 'es' ? '/' : `/${lang}/`;
  const R = 'data-co-reveal';
  return `<main class="co">
      <section class="co-hero" aria-labelledby="co-title">
        <div class="co-hero-panel">
          <p class="co-label">${c.heroLabel}</p>
          <h1 id="co-title">${c.h1}</h1>
          <p class="co-hero-lead">${c.lead}</p>
          <div class="co-actions"><a class="co-btn co-btn--primary" href="${base}contact/">${c.contact} <span aria-hidden="true">↗</span></a><a class="co-btn co-btn--line" href="#co-areas">${c.areasLink}</a></div>
          <dl class="co-hero-facts">${c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        </div>
        <div class="co-hero-media"><img src="${HERO_IMAGE}" alt="" fetchpriority="high" decoding="async"></div>
      </section>

      <section class="co-section" aria-labelledby="co-who">
        <div class="co-wrap co-split">
          <div ${R}><p class="co-label">${c.who[0]}</p><h2 id="co-who">${c.who[1]}</h2></div>
          <div ${R}><p class="co-statement">${c.who[2]}</p><p class="co-text">${c.who[3]}</p></div>
        </div>
      </section>

      <section class="co-section co-paper" aria-labelledby="co-mv">
        <div class="co-wrap">
          <div class="co-split" ${R}><div><p class="co-label">${c.mvLabel}</p><h2 id="co-mv">${c.mvTitle}</h2></div><div></div></div>
          <div class="co-mv" ${R}><div><h3>${c.mission[0]}</h3><p>${c.mission[1]}</p></div><div><h3>${c.vision[0]}</h3><p>${c.vision[1]}</p></div></div>
          <p class="co-values-title">${c.valuesTitle}</p>
          <ul class="co-values" ${R}>${c.values.map(([t, d], i) => `<li><span>${pad(i)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
        </div>
      </section>

      <section class="co-section co-navy" aria-labelledby="co-model">
        <div class="co-wrap">
          <div class="co-split" ${R}><div><p class="co-label">${c.model[0]}</p><h2 id="co-model">${c.model[1]}</h2></div><p class="co-text">${c.model[2]}</p></div>
          <ol class="co-model" ${R} style="margin-top:clamp(48px,6vw,72px)">${c.steps.map(([t, d], i) => `<li><span>${pad(i)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
          <p class="co-principle" ${R}><strong>${c.principle[0]}</strong><span>${c.principle[1]}</span></p>
        </div>
      </section>

      <section class="co-section" id="co-areas" aria-labelledby="co-areas-title">
        <div class="co-wrap">
          <div class="co-split" ${R} style="margin-bottom:clamp(44px,5vw,64px)"><div><p class="co-label">${c.areas[0]}</p><h2 id="co-areas-title">${c.areas[1]}</h2></div><p class="co-text">${c.areas[2]}</p></div>
          <div class="co-areas" ${R}>${c.areaList.map(([t, d], i) => `<a class="co-area" href="${base}${AREA_ROUTES[i]}"><figure><img src="${AREA_IMAGES[i]}" alt="" loading="lazy" decoding="async"></figure><div><span>${pad(i)}</span><h3>${t}</h3><p>${d}</p><span class="co-more">${c.catalogue} ${ARROW}</span></div></a>`).join('')}</div>
        </div>
      </section>

      <section class="co-section co-paper" aria-labelledby="co-presence">
        <div class="co-wrap co-split">
          <div ${R}><p class="co-label">${c.presence[0]}</p><p class="co-hq" id="co-presence">${c.presence[1]}<small>${c.presence[2]}</small></p></div>
          <div ${R}><dl class="co-regions">${c.regions.map(([r, d]) => `<div><dt>${r}</dt><dd>${d}</dd></div>`).join('')}</dl><p class="co-note">${c.note}</p><p class="co-presence-more"><a class="co-more" href="${base}markets/">${c.markets} ${ARROW}</a></p></div>
        </div>
      </section>

      <section class="co-section" aria-labelledby="co-data">
        <div class="co-wrap">
          <div class="co-split" ${R} style="margin-bottom:clamp(36px,4vw,56px)"><div><p class="co-label">${c.dataLabel}</p><h2 id="co-data">${c.dataTitle}</h2></div><div></div></div>
          <dl class="co-data" ${R}>${c.data.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        </div>
      </section>

      <section class="co-section co-paper" aria-labelledby="co-commit">
        <div class="co-wrap">
          <div class="co-split" ${R} style="margin-bottom:clamp(36px,4vw,56px)"><div><p class="co-label">${c.commitLabel}</p><h2 id="co-commit">${c.commitTitle}</h2></div><div></div></div>
          <div class="co-commit" ${R}>${c.commit.map(([t, d]) => `<article><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
        </div>
      </section>

      <section class="co-section co-navy" aria-labelledby="co-close">
        <div class="co-wrap co-contact">
          <div ${R}><p class="co-label">${c.close[0]}</p><h2 id="co-close">${c.close[1]}</h2><p class="co-text">${c.close[2]}</p>
            <div class="co-actions"><a class="co-btn co-btn--primary" href="${base}contact/">${c.contact} <span aria-hidden="true">↗</span></a><a class="co-btn co-btn--line" href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a></div></div>
          <aside class="co-signature" ${R}><p class="co-label">${c.signature[0]}</p><h3>${c.signature[1]}</h3><p>${c.signature[2]}</p><a class="co-more" href="${base}private/">${c.signature[3]} ${ARROW}</a></aside>
        </div>
      </section>
      <script>(function(){var els=document.querySelectorAll('.co [data-co-reveal]');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});els.forEach(function(e){io.observe(e)})})();</script>
    </main>`;
}

const langs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(COPY);
for (const lang of langs) {
  if (!COPY[lang]) throw new Error(`no copy for ${lang}`);
  const file = path.join(ROOT, lang === 'es' ? '' : lang, 'about', 'index.html');
  const raw = fs.readFileSync(file, 'utf8');
  const crlf = raw.includes('\r\n');
  let html = raw.replace(/\r\n/g, '\n');
  const start = html.indexOf('<main'), end = html.indexOf('</main>');
  if (start < 0 || end < 0) throw new Error(`${file}: <main> not found`);
  html = html.slice(0, start) + main(lang) + html.slice(end + '</main>'.length);
  html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/(?:about-media|about-2026|company)\.css[^"]*"[^>]*>/, '<link rel="stylesheet" href="/assets/css/company.css?v=20261009-1">');
  html = html.replace(/\n\s*<style>\s*html,\s*body\.es-page\.about-page[\s\S]*?<\/style>/, '');
  html = html.replace(/<body class="[^"]*"/, `<body class="es-page${lang === 'ar' ? ' ar-page' : ''} about-page about-2026 et-brand-shell brand-pages"`);
  fs.writeFileSync(file, crlf ? html.replace(/\n/g, '\r\n') : html);
}
console.log('Company pages written: ' + langs.join(', '));
