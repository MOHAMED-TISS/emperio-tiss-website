#!/usr/bin/env node
/* Builds the Company page (/about/) from one corporate structure.
   usage: node tools/build-about.cjs [lang ...]   (default: every language in COPY)
   Copy only restates what the site already says (company page, values, responsibility,
   operating process, Home geography). The Mediterranean is a fishing ground, never a market.
   Owner 2026-10-09: no figures, no team, no sanitary registration, no founding year; EMPERIO TISS
   is a principal that selects, buys and supplies — never a broker or intermediary, not even implicitly. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const ARROW = '<span class="co-arrow" aria-hidden="true">→</span>';
const HERO_IMAGE = 'https://images.pexels.com/photos/29258685/pexels-photo-29258685.jpeg?auto=compress&cs=tinysrgb&w=1200';

const COPY = {
  es: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'Del origen al mercado, con criterio.',
    lead: "Empresa alimentaria B2B española con sede en Madrid. Seleccionamos, compramos y suministramos productos del mar, frutas y hortalizas a clientes profesionales en Europa, África y Oriente Medio.",
    contact: 'Contactar', productsLink: "Ver productos",
    facts: [["Sede","Madrid, España"],["Actividad","Suministro alimentario B2B"],["Productos","Productos del mar · Frutas y hortalizas"],["Mercados","Europa · África · Oriente Medio"]],
    who: ['01 · Quiénes somos', 'Una empresa para el mercado alimentario profesional.', "Somos parte de cada operación desde el principio: seleccionamos el origen, compramos el producto, definimos su especificación y respondemos de él ante nuestros clientes hasta su destino.", 'EMPERIO TISS nace con una visión internacional: comprender mejor los productos, entender mejor los mercados y trabajar mejor con las personas.'],
    mvLabel: '02 · Misión, visión y valores', mvTitle: 'Lo que nos guía.',
    mission: ['Misión', "Construir un suministro de alimentos más inteligente y más humano: uniendo el conocimiento de cada origen, la tecnología y el criterio de las personas para llevar a cada mercado alimentos en los que se pueda confiar."],
    vision: ['Visión', 'Convertirnos en una referencia internacional en el suministro de alimentos: una empresa donde cada origen se valora, cada decisión se apoya en conocimiento y cada relación se construye para durar.'],
    valuesTitle: 'Valores',
    values: [['Precisión', 'Los detalles importan.'], ['Integridad', 'Hacemos lo que decimos.'], ['Transparencia', 'La confianza comienza con claridad.'], ['Conocimiento', 'Entender mejor permite decidir mejor.'], ['Responsabilidad', 'Pensamos más allá del resultado inmediato.'], ['Adaptabilidad', 'Evolucionamos con el mercado.']],
    model: ['03 · Cómo operamos', 'Un modelo de operación claro.', "Cada operación parte de una necesidad concreta del cliente y se estructura en torno a una especificación verificable antes del suministro."],
    steps: [["Conocer","Producto, origen, disponibilidad y contexto comercial."],["Especificar","Calibre, calidad, presentación, formato y destino, verificados antes de confirmar."],["Comprar","Compramos el producto con criterios claros y respondemos de él ante nuestros clientes."],["Suministrar","Organizamos el suministro desde el origen hasta el mercado de destino."]],
    principle: ['Precisión antes que promesa.', 'Antes de confirmar, verificamos lo que determina el valor real de la operación: producto, origen, especificación y mercado.'],
    areas: ["04 · Compromiso con el cliente","Nuestro compromiso.","Lo que cada cliente encuentra en EMPERIO TISS."],
    pledgeList: [["Producto definido","Especie o variedad, origen, calibre, calidad y formato, acordados antes de cada operación."],["Responsabilidad","Respondemos del producto que suministramos."],["Transparencia","Información clara sobre origen, disponibilidad y condiciones."],["Relación duradera","Construimos relaciones comerciales a largo plazo, no operaciones aisladas."]],
    presence: ['05 · Presencia internacional', 'Madrid', 'Sede de EMPERIO TISS S.L. Desde Madrid, al mundo.'],
    regions: [['Europa', 'España, Francia, Italia, Alemania y Países Bajos.'], ['África', 'Marruecos, Túnez, Mauritania y África Occidental.'], ['Oriente Medio', 'Golfo y Levante.']],
    note: 'El Mediterráneo es zona de captura: el origen de parte del pescado que seleccionamos.',
    markets: 'Ver mercados',
    dataLabel: '06 · Datos corporativos', dataTitle: 'Datos corporativos.',
    data: [['Razón social', 'EMPERIO TISS S.L.'], ['Sede', 'Madrid, España'], ['Actividad', 'Suministro alimentario B2B'], ["Productos","Productos del mar, frutas y hortalizas"], ['Mercados', 'Europa, África y Oriente Medio'], ['Contacto', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsabilidad', commitTitle: 'Responsabilidad.',
    commit: [['El futuro también importa.', 'La alimentación depende de recursos naturales y ecosistemas que debemos proteger. Buscamos trabajar con más eficiencia, menos desperdicio y mayor conciencia sobre los recursos. No buscamos parecer sostenibles: queremos aprender a hacerlo mejor.'], ['La tecnología ayuda. El criterio decide.', 'Usamos nuevas herramientas cuando aportan valor real: mejor información, mejor coordinación y más eficiencia. Detrás de cada decisión siguen estando las personas.']],
    close: ['Contacto', 'Hablemos de una necesidad concreta.', 'Cuéntenos producto, origen, volumen y destino: estudiamos cada consulta profesional.'],
    signature: ['EMPERIO Signature', 'Acceso profesional', 'Ofertas privadas, disponibilidad y referencias para empresas aprobadas.', 'Entrar']
  },
  en: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'From origin to market, with purpose.',
    lead: "A Spanish B2B food company based in Madrid. We select, buy and supply seafood, fruit and vegetables to professional customers in Europe, Africa and the Middle East.",
    contact: 'Contact us', productsLink: "View products",
    facts: [["Headquarters","Madrid, Spain"],["Activity","B2B food supply"],["Products","Seafood · Fruit and vegetables"],["Markets","Europe · Africa · Middle East"]],
    who: ['01 · Who we are', 'A company built for the professional food market.', "We are part of every operation from the start: we select the origin, buy the product, define its specification and stand behind it before our customers all the way to its destination.", 'EMPERIO TISS is built around an international vision: understanding products better, reading markets better and working better with people.'],
    mvLabel: '02 · Mission, vision and values', mvTitle: 'What guides us.',
    mission: ['Mission', "To build a smarter, more human food supply: bringing together knowledge of every origin, technology and people’s judgement to bring every market food it can trust."],
    vision: ['Vision', 'To become an international reference in food supply: a company where every origin is valued, every decision rests on knowledge and every relationship is built to last.'],
    valuesTitle: 'Values',
    values: [['Precision', 'Details matter.'], ['Integrity', 'We do what we say.'], ['Transparency', 'Trust starts with clarity.'], ['Knowledge', 'Understanding better enables better decisions.'], ['Responsibility', 'We think beyond the immediate outcome.'], ['Adaptability', 'We evolve with the market.']],
    model: ['03 · How we operate', 'A clear operating model.', "Every operation starts from a concrete customer need and is structured around a verifiable specification before supply."],
    steps: [["Understand","Product, origin, availability and commercial context."],["Specify","Size, quality, presentation, format and destination, verified before confirming."],["Buy","We buy the product with clear criteria and stand behind it before our customers."],["Supply","We organise supply from origin to the destination market."]],
    principle: ['Precision before promise.', 'Before confirming, we check what determines the real value of the operation: product, origin, specification and market.'],
    areas: ["04 · Commitment to our customers","Our commitment.","What every customer finds at EMPERIO TISS."],
    pledgeList: [["Defined product","Species or variety, origin, size, quality and format, agreed before every operation."],["Responsibility","We stand behind the product we supply."],["Transparency","Clear information on origin, availability and conditions."],["Lasting relationships","We build long-term commercial relationships, not one-off operations."]],
    presence: ['05 · International presence', 'Madrid', 'Headquarters of EMPERIO TISS S.L. From Madrid to the world.'],
    regions: [['Europe', 'Spain, France, Italy, Germany and the Netherlands.'], ['Africa', 'Morocco, Tunisia, Mauritania and West Africa.'], ['Middle East', 'The Gulf and the Levant.']],
    note: 'The Mediterranean is a fishing ground: the origin of part of the fish we select.',
    markets: 'View markets',
    dataLabel: '06 · Corporate information', dataTitle: 'Corporate information.',
    data: [['Company name', 'EMPERIO TISS S.L.'], ['Headquarters', 'Madrid, Spain'], ['Activity', 'B2B food supply'], ["Products","Seafood, fruit and vegetables"], ['Markets', 'Europe, Africa and the Middle East'], ['Contact', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsibility', commitTitle: 'Responsibility.',
    commit: [['The future matters too.', 'Food depends on natural resources and ecosystems that deserve protection. We aim to work with greater efficiency, less waste and more awareness of resources. We do not want to look sustainable: we want to learn to do better.'], ['Technology helps. Judgement decides.', 'We use new tools when they create real value: better information, better coordination and greater efficiency. People remain behind every decision.']],
    close: ['Contact', 'Let’s talk about a concrete need.', 'Tell us the product, origin, volume and destination: we study every professional enquiry.'],
    signature: ['EMPERIO Signature', 'Professional access', 'Private offers, availability and references for approved companies.', 'Enter']
  },
  fr: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'De l’origine au marché, avec discernement.',
    lead: "Entreprise alimentaire B2B espagnole basée à Madrid. Nous sélectionnons, achetons et fournissons des produits de la mer, des fruits et des légumes à des clients professionnels en Europe, en Afrique et au Moyen-Orient.",
    contact: 'Nous contacter', productsLink: "Voir les produits",
    facts: [["Siège","Madrid, Espagne"],["Activité","Approvisionnement alimentaire B2B"],["Produits","Produits de la mer · Fruits et légumes"],["Marchés","Europe · Afrique · Moyen-Orient"]],
    who: ['01 · Qui sommes-nous', 'Une entreprise pensée pour le marché alimentaire professionnel.', "Nous faisons partie de chaque opération dès le départ : nous sélectionnons l’origine, achetons le produit, définissons sa spécification et en répondons devant nos clients jusqu’à sa destination.", 'EMPERIO TISS est né d’une vision internationale : mieux comprendre les produits, mieux lire les marchés et mieux travailler avec les personnes.'],
    mvLabel: '02 · Mission, vision et valeurs', mvTitle: 'Ce qui nous guide.',
    mission: ['Mission', "Construire un approvisionnement alimentaire plus intelligent et plus humain : réunir la connaissance de chaque origine, la technologie et le discernement des personnes pour apporter à chaque marché des aliments dignes de confiance."],
    vision: ['Vision', 'Devenir une référence internationale de l’approvisionnement alimentaire : une entreprise où chaque origine est valorisée, chaque décision s’appuie sur la connaissance et chaque relation est construite pour durer.'],
    valuesTitle: 'Valeurs',
    values: [['Précision', 'Les détails comptent.'], ['Intégrité', 'Nous faisons ce que nous disons.'], ['Transparence', 'La confiance commence par la clarté.'], ['Connaissance', 'Mieux comprendre permet de mieux décider.'], ['Responsabilité', 'Nous pensons au-delà du résultat immédiat.'], ['Adaptabilité', 'Nous évoluons avec le marché.']],
    model: ['03 · Notre fonctionnement', 'Un modèle opérationnel clair.', "Chaque opération part d’un besoin concret du client et se structure autour d’une spécification vérifiable avant l’approvisionnement."],
    steps: [["Connaître","Produit, origine, disponibilité et contexte commercial."],["Spécifier","Calibre, qualité, présentation, format et destination, vérifiés avant confirmation."],["Acheter","Nous achetons le produit avec des critères clairs et en répondons devant nos clients."],["Fournir","Nous organisons l’approvisionnement de l’origine jusqu’au marché de destination."]],
    principle: ['La précision avant la promesse.', 'Avant de confirmer, nous vérifions ce qui détermine la valeur réelle de l’opération : produit, origine, spécification et marché.'],
    areas: ["04 · Engagement client","Notre engagement.","Ce que chaque client trouve chez EMPERIO TISS."],
    pledgeList: [["Produit défini","Espèce ou variété, origine, calibre, qualité et format, convenus avant chaque opération."],["Responsabilité","Nous répondons du produit que nous fournissons."],["Transparence","Une information claire sur l’origine, la disponibilité et les conditions."],["Relation durable","Nous construisons des relations commerciales à long terme, pas des opérations isolées."]],
    presence: ['05 · Présence internationale', 'Madrid', 'Siège d’EMPERIO TISS S.L. De Madrid au monde.'],
    regions: [['Europe', 'Espagne, France, Italie, Allemagne et Pays-Bas.'], ['Afrique', 'Maroc, Tunisie, Mauritanie et Afrique de l’Ouest.'], ['Moyen-Orient', 'Golfe et Levant.']],
    note: 'La Méditerranée est une zone de pêche : l’origine d’une partie du poisson que nous sélectionnons.',
    markets: 'Voir les marchés',
    dataLabel: '06 · Informations sur l’entreprise', dataTitle: 'Informations sur l’entreprise.',
    data: [['Raison sociale', 'EMPERIO TISS S.L.'], ['Siège', 'Madrid, Espagne'], ['Activité', 'Approvisionnement alimentaire B2B'], ["Produits","Produits de la mer, fruits et légumes"], ['Marchés', 'Europe, Afrique et Moyen-Orient'], ['Contact', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsabilité', commitTitle: 'Responsabilité.',
    commit: [['L’avenir compte aussi.', 'L’alimentation dépend de ressources naturelles et d’écosystèmes qui doivent être préservés. Nous voulons travailler avec plus d’efficacité, moins de gaspillage et davantage de conscience des ressources. Nous ne cherchons pas à paraître responsables : nous voulons apprendre à faire mieux.'], ['La technologie aide. Le jugement décide.', 'Nous utilisons de nouveaux outils lorsqu’ils créent une vraie valeur : meilleure information, meilleure coordination, plus d’efficacité. Derrière chaque décision, il y a toujours des personnes.']],
    close: ['Contact', 'Parlons d’un besoin concret.', 'Indiquez produit, origine, volume et destination : nous étudions chaque demande professionnelle.'],
    signature: ['EMPERIO Signature', 'Accès professionnel', 'Offres privées, disponibilités et références pour les entreprises approuvées.', 'Entrer']
  },
  it: {
    heroLabel: 'EMPERIO TISS S.L. · Madrid',
    h1: 'Dall’origine al mercato, con criterio.',
    lead: "Azienda alimentare B2B spagnola con sede a Madrid. Selezioniamo, acquistiamo e forniamo prodotti del mare, frutta e ortaggi a clienti professionali in Europa, Africa e Medio Oriente.",
    contact: 'Contatta', productsLink: "Vedi i prodotti",
    facts: [["Sede","Madrid, Spagna"],["Attività","Fornitura alimentare B2B"],["Prodotti","Prodotti del mare · Frutta e ortaggi"],["Mercati","Europa · Africa · Medio Oriente"]],
    who: ['01 · Chi siamo', 'Un’azienda pensata per il mercato alimentare professionale.', "Siamo parte di ogni operazione fin dall’inizio: selezioniamo l’origine, acquistiamo il prodotto, ne definiamo le specifiche e ne rispondiamo verso i nostri clienti fino alla destinazione.", 'EMPERIO TISS nasce con una visione internazionale: capire meglio i prodotti, leggere meglio i mercati e lavorare meglio con le persone.'],
    mvLabel: '02 · Missione, visione e valori', mvTitle: 'Ciò che ci guida.',
    mission: ['Missione', "Costruire una fornitura alimentare più intelligente e più umana: unire la conoscenza di ogni origine, la tecnologia e il giudizio delle persone per portare in ogni mercato alimenti di cui fidarsi."],
    vision: ['Visione', 'Diventare un punto di riferimento internazionale nella fornitura alimentare: un’azienda in cui ogni origine è valorizzata, ogni decisione si basa sulla conoscenza e ogni relazione è costruita per durare.'],
    valuesTitle: 'Valori',
    values: [['Precisione', 'I dettagli contano.'], ['Integrità', 'Facciamo ciò che diciamo.'], ['Trasparenza', 'La fiducia inizia dalla chiarezza.'], ['Conoscenza', 'Capire meglio permette di decidere meglio.'], ['Responsabilità', 'Pensiamo oltre il risultato immediato.'], ['Adattabilità', 'Evolviamo con il mercato.']],
    model: ['03 · Come operiamo', 'Un modello operativo chiaro.', "Ogni operazione parte da un’esigenza concreta del cliente e si struttura attorno a una specifica verificabile prima della fornitura."],
    steps: [["Conoscere","Prodotto, origine, disponibilità e contesto commerciale."],["Specificare","Calibro, qualità, presentazione, formato e destinazione, verificati prima di confermare."],["Acquistare","Acquistiamo il prodotto con criteri chiari e ne rispondiamo verso i nostri clienti."],["Fornire","Organizziamo la fornitura dall’origine al mercato di destinazione."]],
    principle: ['Precisione prima della promessa.', 'Prima di confermare, verifichiamo ciò che determina il valore reale dell’operazione: prodotto, origine, specifiche e mercato.'],
    areas: ["04 · Impegno verso il cliente","Il nostro impegno.","Ciò che ogni cliente trova in EMPERIO TISS."],
    pledgeList: [["Prodotto definito","Specie o varietà, origine, calibro, qualità e formato, concordati prima di ogni operazione."],["Responsabilità","Rispondiamo del prodotto che forniamo."],["Trasparenza","Informazioni chiare su origine, disponibilità e condizioni."],["Relazione duratura","Costruiamo relazioni commerciali di lungo periodo, non operazioni isolate."]],
    presence: ['05 · Presenza internazionale', 'Madrid', 'Sede di EMPERIO TISS S.L. Da Madrid al mondo.'],
    regions: [['Europa', 'Spagna, Francia, Italia, Germania e Paesi Bassi.'], ['Africa', 'Marocco, Tunisia, Mauritania e Africa occidentale.'], ['Medio Oriente', 'Golfo e Levante.']],
    note: 'Il Mediterraneo è una zona di pesca: l’origine di parte del pesce che selezioniamo.',
    markets: 'Vedi i mercati',
    dataLabel: '06 · Dati societari', dataTitle: 'Dati societari.',
    data: [['Ragione sociale', 'EMPERIO TISS S.L.'], ['Sede', 'Madrid, Spagna'], ['Attività', 'Fornitura alimentare B2B'], ["Prodotti","Prodotti del mare, frutta e ortaggi"], ['Mercati', 'Europa, Africa e Medio Oriente'], ['Contatti', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
    commitLabel: '07 · Responsabilità', commitTitle: 'Responsabilità.',
    commit: [['Anche il futuro conta.', 'L’alimentazione dipende da risorse naturali ed ecosistemi da proteggere. Vogliamo lavorare con più efficienza, meno sprechi e maggiore consapevolezza delle risorse. Non cerchiamo di sembrare sostenibili: vogliamo imparare a fare meglio.'], ['La tecnologia aiuta. Il criterio decide.', 'Usiamo nuovi strumenti quando portano valore reale: informazioni migliori, coordinamento migliore e più efficienza. Dietro ogni decisione restano le persone.']],
    close: ['Contatti', 'Parliamo di una necessità concreta.', 'Indicateci prodotto, origine, volume e destinazione: valutiamo ogni richiesta professionale.'],
    signature: ['EMPERIO Signature', 'Accesso professionale', 'Offerte private, disponibilità e referenze per aziende approvate.', 'Entra']
  },
  ar: {
    heroLabel: 'EMPERIO TISS S.L. · مدريد',
    h1: 'من المنشأ إلى السوق، بمعايير واضحة.',
    lead: "شركة غذائية إسبانية بين الشركات (B2B) مقرها مدريد. نختار ونشتري ونورّد المنتجات البحرية والفواكه والخضروات لعملاء مهنيين في أوروبا وأفريقيا والشرق الأوسط.",
    contact: 'تواصل معنا', productsLink: "عرض المنتجات",
    facts: [["المقر","مدريد، إسبانيا"],["النشاط","توريد غذائي بين الشركات"],["المنتجات","المنتجات البحرية · الفواكه والخضروات"],["الأسواق","أوروبا · أفريقيا · الشرق الأوسط"]],
    who: ['01 · من نحن', 'شركة مصممة للسوق الغذائية المهنية.', "نحن جزء من كل عملية منذ بدايتها: نختار المنشأ، ونشتري المنتج، ونحدد مواصفاته، ونتحمل مسؤوليته أمام عملائنا حتى وجهته.", 'تأسست EMPERIO TISS برؤية دولية: فهم المنتجات بشكل أفضل، وقراءة الأسواق بشكل أفضل، والعمل بشكل أفضل مع الناس.'],
    mvLabel: '02 · الرسالة والرؤية والقيم', mvTitle: 'ما يوجّهنا.',
    mission: ['الرسالة', "بناء توريد غذائي أذكى وأكثر إنسانية: نجمع معرفة كل منشأ والتكنولوجيا وحكمة الإنسان لنقدّم لكل سوق غذاءً يمكن الوثوق به."],
    vision: ['الرؤية', 'أن نصبح مرجعاً دولياً في التوريد الغذائي: شركة يُقدَّر فيها كل منشأ، ويستند فيها كل قرار إلى المعرفة، وتُبنى فيها كل علاقة لتدوم.'],
    valuesTitle: 'القيم',
    values: [['الدقة', 'التفاصيل مهمة.'], ['النزاهة', 'نفعل ما نقول.'], ['الشفافية', 'الثقة تبدأ بالوضوح.'], ['المعرفة', 'الفهم الأفضل يقود إلى قرارات أفضل.'], ['المسؤولية', 'نفكر أبعد من النتيجة الفورية.'], ['المرونة', 'نتطور مع السوق.']],
    model: ['03 · كيف نعمل', 'نموذج عمل واضح.', "تبدأ كل عملية من احتياج محدد لدى العميل وتُبنى حول مواصفة قابلة للتحقق قبل التوريد."],
    steps: [["نفهم","المنتج والمنشأ والتوافر والسياق التجاري."],["نحدد","الحجم والجودة والتقديم والشكل والوجهة، مع التحقق منها قبل التأكيد."],["نشتري","نشتري المنتج بمعايير واضحة ونتحمل مسؤوليته أمام عملائنا."],["نورّد","ننظم التوريد من المنشأ حتى سوق الوجهة."]],
    principle: ['الدقة قبل الوعد.', 'قبل التأكيد، نتحقق مما يحدد القيمة الحقيقية للعملية: المنتج والمنشأ والمواصفات والسوق.'],
    areas: ["04 · التزامنا تجاه العميل","التزامنا.","ما يجده كل عميل لدى EMPERIO TISS."],
    pledgeList: [["منتج محدد","النوع أو الصنف والمنشأ والحجم والجودة والشكل، متفق عليها قبل كل عملية."],["المسؤولية","نتحمل مسؤولية المنتج الذي نورّده."],["الشفافية","معلومات واضحة عن المنشأ والتوافر والشروط."],["علاقة دائمة","نبني علاقات تجارية طويلة الأمد، لا عمليات منفردة."]],
    presence: ['05 · الحضور الدولي', 'مدريد', 'مقر EMPERIO TISS S.L. من مدريد إلى العالم.'],
    regions: [['أوروبا', 'إسبانيا وفرنسا وإيطاليا وألمانيا وهولندا.'], ['أفريقيا', 'المغرب وتونس وموريتانيا وغرب أفريقيا.'], ['الشرق الأوسط', 'الخليج والمشرق.']],
    note: 'البحر المتوسط منطقة صيد: منشأ جزء من الأسماك التي نختارها.',
    markets: 'عرض الأسواق',
    dataLabel: '06 · بيانات الشركة', dataTitle: 'بيانات الشركة.',
    data: [['الاسم التجاري', 'EMPERIO TISS S.L.'], ['المقر', 'مدريد، إسبانيا'], ['النشاط', 'توريد غذائي بين الشركات (B2B)'], ["المنتجات","المنتجات البحرية والفواكه والخضروات"], ['الأسواق', 'أوروبا وأفريقيا والشرق الأوسط'], ['التواصل', '<a href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a>']],
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
          <div class="co-actions"><a class="co-btn co-btn--primary" href="${base}contact/">${c.contact} <span aria-hidden="true">↗</span></a><a class="co-btn co-btn--line" href="${base}products/">${c.productsLink}</a></div>
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

      <section class="co-section" aria-labelledby="co-pledge">
        <div class="co-wrap">
          <div class="co-split" ${R} style="margin-bottom:clamp(44px,5vw,64px)"><div><p class="co-label">${c.areas[0]}</p><h2 id="co-pledge">${c.areas[1]}</h2></div><p class="co-text">${c.areas[2]}</p></div>
          <ul class="co-pledge" ${R}>${c.pledgeList.map(([t, d], i) => `<li><span>${pad(i)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
          <p class="co-presence-more" ${R}><a class="co-more" href="${base}products/">${c.productsLink} ${ARROW}</a></p>
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
