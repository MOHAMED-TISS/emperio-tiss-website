#!/usr/bin/env node
/* Builds the Company page (/about/) in the five languages from one structure.
   usage: node tools/build-about.cjs
   Copy only restates what the site already says (Italian company page, values and
   responsibility texts, Home atlas geography). The Mediterranean is a fishing ground,
   never a market. Each page keeps its own <head> metadata, header and footer shell. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const ARROW = '<span class="ab26-arrow" aria-hidden="true">→</span>';
const UP = '<span aria-hidden="true">↗</span>';

const COPY = {
  es: {
    kicker: 'Empresa internacional · Madrid',
    h1: 'Del origen al mercado.<br><em>Con criterio.</em>',
    lead: 'EMPERIO TISS opera directamente en operaciones alimentarias B2B, conectando orígenes seleccionados y mercados profesionales con responsabilidad comercial.',
    cta: 'Cuéntenos su necesidad', products: 'Ver productos', indexLabel: 'Áreas de actividad',
    families: ['Productos del mar', 'Frutas y hortalizas', 'Temporada'],
    factsLabel: 'EMPERIO TISS en síntesis',
    facts: [['Sede', 'Madrid, España'], ['Actividad', 'Suministro alimentario B2B'], ['Productos', 'Productos del mar, frutas y hortalizas'], ['Mercados', 'Europa, África y Oriente Medio']],
    role: ['01 / Nuestro papel', 'Una parte activa<br><em>de cada operación.</em>', 'Operamos como parte principal: para los compradores representamos la oferta y respondemos del producto; para los productores compramos con criterios claros, destino definido y visión de mercado.'],
    steps: [['Conocer', 'Producto, origen, disponibilidad y contexto comercial.'], ['Seleccionar', 'Especificaciones coherentes con calidad, formato y destino.'], ['Coordinar', 'Una línea clara desde el acuerdo comercial hasta el mercado.']],
    supply: ['02 / Qué suministramos', 'Orígenes seleccionados.<br><em>Destinos internacionales.</em>', 'Tres familias de producto, definidas por origen, especificación y disponibilidad.'],
    cards: ['Pescados, mariscos y cefalópodos, frescos y congelados.', 'Frutas y hortalizas seleccionadas por variedad, origen, calibre y campaña.', 'Campañas y oportunidades según origen y disponibilidad.'],
    catalogue: 'Ver catálogo',
    criteria: ['03 / Nuestro criterio', 'Precisión<br><em>antes que promesa.</em>', 'Cada oportunidad parte de una especificación concreta. Antes de confirmar, verificamos lo que determina el valor real de la operación.'],
    checks: [['Producto', 'especie o variedad'], ['Origen', 'zona y disponibilidad'], ['Especificación', 'calibre, calidad y presentación'], ['Mercado', 'volumen, formato y destino']],
    reach: ['04 / Dónde operamos', 'Desde Madrid<br><em>al mundo.</em>', 'Desde Madrid conectamos zonas de producción y de captura con destinos profesionales en tres regiones.'],
    regions: [['Europa', 'España, Francia, Italia, Alemania y Países Bajos.'], ['África', 'Marruecos, Túnez, Mauritania y África Occidental.'], ['Oriente Medio', 'Golfo y Levante.']],
    note: 'El Mediterráneo es zona de captura: el origen de parte del pescado que seleccionamos.',
    markets: 'Ver mercados',
    values: ['05 / Valores', 'Lo que<br><em>no cambia.</em>', 'Principios sencillos que guían nuestras decisiones y nuestra manera de trabajar.'],
    valueList: [['Precisión', 'Los detalles importan.'], ['Integridad', 'Hacemos lo que decimos.'], ['Transparencia', 'La confianza comienza con claridad.'], ['Conocimiento', 'Entender mejor permite decidir mejor.'], ['Responsabilidad', 'Pensamos más allá del resultado inmediato.'], ['Adaptabilidad', 'Evolucionamos con el mercado.']],
    commitKicker: '06 / Compromiso',
    commit: [['El futuro también importa.', 'La alimentación depende de recursos naturales y ecosistemas que debemos proteger. Buscamos trabajar con más eficiencia, menos desperdicio y mayor conciencia sobre los recursos. No buscamos parecer sostenibles: queremos aprender a hacerlo mejor.'], ['La tecnología ayuda. El criterio decide.', 'Usamos nuevas herramientas cuando aportan valor real: mejor información, mejor coordinación y más eficiencia. Detrás de cada decisión siguen estando las personas.']],
    close: ['Nuevas conexiones', 'Hablemos de una<br><em>necesidad concreta.</em>', 'Cuéntenos producto, origen, volumen y destino: estudiamos cada consulta profesional.'],
    contact: 'Contactar',
    signature: ['EMPERIO Signature', 'Acceso profesional', 'Ofertas privadas, disponibilidad y referencias para empresas aprobadas.', 'Entrar']
  },
  en: {
    kicker: 'International company · Madrid',
    h1: 'From origin to market.<br><em>With purpose.</em>',
    lead: 'EMPERIO TISS works directly in B2B food operations, connecting selected origins and professional markets with commercial responsibility.',
    cta: 'Tell us what you need', products: 'View products', indexLabel: 'Areas of activity',
    families: ['Seafood', 'Fruit and vegetables', 'Seasonal'],
    factsLabel: 'EMPERIO TISS at a glance',
    facts: [['Headquarters', 'Madrid, Spain'], ['Activity', 'B2B food supply'], ['Products', 'Seafood, fruit and vegetables'], ['Markets', 'Europe, Africa and the Middle East']],
    role: ['01 / Our role', 'An active party<br><em>in every operation.</em>', 'We act as principal: for buyers we represent the offer and stand behind the product; for producers we buy with clear criteria, a defined destination and market vision.'],
    steps: [['Understand', 'Product, origin, availability and commercial context.'], ['Select', 'Specifications consistent with quality, format and destination.'], ['Coordinate', 'One clear line from the commercial agreement to the market.']],
    supply: ['02 / What we supply', 'Selected origins.<br><em>International destinations.</em>', 'Three product families, defined by origin, specification and availability.'],
    cards: ['Fish, shellfish and cephalopods, fresh and frozen.', 'Fruit and vegetables selected by variety, origin, size and season.', 'Campaigns and opportunities by origin and availability.'],
    catalogue: 'View catalogue',
    criteria: ['03 / Our standard', 'Precision<br><em>before promise.</em>', 'Every opportunity starts from a concrete specification. Before confirming, we check what determines the real value of the operation.'],
    checks: [['Product', 'species or variety'], ['Origin', 'area and availability'], ['Specification', 'size, quality and presentation'], ['Market', 'volume, format and destination']],
    reach: ['04 / Where we operate', 'From Madrid<br><em>to the world.</em>', 'From Madrid we connect production areas and fishing grounds with professional destinations in three regions.'],
    regions: [['Europe', 'Spain, France, Italy, Germany and the Netherlands.'], ['Africa', 'Morocco, Tunisia, Mauritania and West Africa.'], ['Middle East', 'The Gulf and the Levant.']],
    note: 'The Mediterranean is a fishing ground: the origin of part of the fish we select.',
    markets: 'View markets',
    values: ['05 / Values', 'What<br><em>doesn’t change.</em>', 'Simple principles that guide our decisions and the way we work.'],
    valueList: [['Precision', 'Details matter.'], ['Integrity', 'We do what we say.'], ['Transparency', 'Trust starts with clarity.'], ['Knowledge', 'Understanding better enables better decisions.'], ['Responsibility', 'We think beyond the immediate outcome.'], ['Adaptability', 'We evolve with the market.']],
    commitKicker: '06 / Commitment',
    commit: [['The future matters too.', 'Food depends on natural resources and ecosystems that deserve protection. We aim to work with greater efficiency, less waste and more awareness of resources. We do not want to look sustainable: we want to learn to do better.'], ['Technology helps. Judgement decides.', 'We use new tools when they create real value: better information, better coordination and greater efficiency. People remain behind every decision.']],
    close: ['New connections', 'Let’s talk about a<br><em>concrete need.</em>', 'Tell us the product, origin, volume and destination: we study every professional enquiry.'],
    contact: 'Contact us',
    signature: ['EMPERIO Signature', 'Professional access', 'Private offers, availability and references for approved companies.', 'Enter']
  },
  fr: {
    kicker: 'Entreprise internationale · Madrid',
    h1: 'De l’origine au marché.<br><em>Avec discernement.</em>',
    lead: 'EMPERIO TISS intervient directement dans les opérations alimentaires B2B, en reliant des origines sélectionnées et des marchés professionnels avec une responsabilité commerciale.',
    cta: 'Présentez-nous votre besoin', products: 'Voir les produits', indexLabel: 'Domaines d’activité',
    families: ['Produits de la mer', 'Fruits et légumes', 'Produits de saison'],
    factsLabel: 'EMPERIO TISS en bref',
    facts: [['Siège', 'Madrid, Espagne'], ['Activité', 'Approvisionnement alimentaire B2B'], ['Produits', 'Produits de la mer, fruits et légumes'], ['Marchés', 'Europe, Afrique et Moyen-Orient']],
    role: ['01 / Notre rôle', 'Une partie active<br><em>de chaque opération.</em>', 'Nous intervenons comme partie principale : pour les acheteurs, nous représentons l’offre et répondons du produit ; pour les producteurs, nous achetons avec des critères clairs, une destination définie et une vision de marché.'],
    steps: [['Connaître', 'Produit, origine, disponibilité et contexte commercial.'], ['Sélectionner', 'Des spécifications cohérentes avec la qualité, le format et la destination.'], ['Coordonner', 'Une ligne claire de l’accord commercial jusqu’au marché.']],
    supply: ['02 / Ce que nous fournissons', 'Des origines sélectionnées.<br><em>Des destinations internationales.</em>', 'Trois familles de produits, définies par l’origine, la spécification et la disponibilité.'],
    cards: ['Poissons, crustacés et céphalopodes, frais et surgelés.', 'Fruits et légumes sélectionnés par variété, origine, calibre et campagne.', 'Campagnes et opportunités selon l’origine et la disponibilité.'],
    catalogue: 'Voir le catalogue',
    criteria: ['03 / Notre exigence', 'La précision<br><em>avant la promesse.</em>', 'Chaque opportunité part d’une spécification concrète. Avant de confirmer, nous vérifions ce qui détermine la valeur réelle de l’opération.'],
    checks: [['Produit', 'espèce ou variété'], ['Origine', 'zone et disponibilité'], ['Spécification', 'calibre, qualité et présentation'], ['Marché', 'volume, format et destination']],
    reach: ['04 / Où nous opérons', 'De Madrid<br><em>au monde.</em>', 'Depuis Madrid, nous relions zones de production et zones de pêche à des destinations professionnelles dans trois régions.'],
    regions: [['Europe', 'Espagne, France, Italie, Allemagne et Pays-Bas.'], ['Afrique', 'Maroc, Tunisie, Mauritanie et Afrique de l’Ouest.'], ['Moyen-Orient', 'Golfe et Levant.']],
    note: 'La Méditerranée est une zone de pêche : l’origine d’une partie du poisson que nous sélectionnons.',
    markets: 'Voir les marchés',
    values: ['05 / Valeurs', 'Ce qui<br><em>ne change pas.</em>', 'Des principes simples qui guident nos décisions et notre manière de travailler.'],
    valueList: [['Précision', 'Les détails comptent.'], ['Intégrité', 'Nous faisons ce que nous disons.'], ['Transparence', 'La confiance commence par la clarté.'], ['Connaissance', 'Mieux comprendre permet de mieux décider.'], ['Responsabilité', 'Nous pensons au-delà du résultat immédiat.'], ['Adaptabilité', 'Nous évoluons avec le marché.']],
    commitKicker: '06 / Engagement',
    commit: [['L’avenir compte aussi.', 'L’alimentation dépend de ressources naturelles et d’écosystèmes qui doivent être préservés. Nous voulons travailler avec plus d’efficacité, moins de gaspillage et davantage de conscience des ressources. Nous ne cherchons pas à paraître responsables : nous voulons apprendre à faire mieux.'], ['La technologie aide. Le jugement décide.', 'Nous utilisons de nouveaux outils lorsqu’ils créent une vraie valeur : meilleure information, meilleure coordination, plus d’efficacité. Derrière chaque décision, il y a toujours des personnes.']],
    close: ['Nouvelles connexions', 'Parlons d’un<br><em>besoin concret.</em>', 'Indiquez produit, origine, volume et destination : nous étudions chaque demande professionnelle.'],
    contact: 'Nous contacter',
    signature: ['EMPERIO Signature', 'Accès professionnel', 'Offres privées, disponibilités et références pour les entreprises approuvées.', 'Entrer']
  },
  it: {
    kicker: 'Azienda internazionale · Madrid',
    h1: 'Dall’origine al mercato.<br><em>Con criterio.</em>',
    lead: 'EMPERIO TISS opera direttamente nelle operazioni B2B alimentari, collegando origini selezionate e mercati professionali con responsabilità commerciale.',
    cta: 'Presentaci la tua esigenza', products: 'Vedi i prodotti', indexLabel: 'Aree di attività',
    families: ['Prodotti del mare', 'Frutta e ortaggi', 'Stagionalità'],
    factsLabel: 'EMPERIO TISS in sintesi',
    facts: [['Sede', 'Madrid, Spagna'], ['Attività', 'Fornitura alimentare B2B'], ['Prodotti', 'Prodotti del mare, frutta e ortaggi'], ['Mercati', 'Europa, Africa e Medio Oriente']],
    role: ['01 / Il nostro ruolo', 'Una parte attiva<br><em>di ogni operazione.</em>', 'Operiamo come parte principale: per i compratori rappresentiamo l’offerta e rispondiamo del prodotto; per i produttori acquistiamo con criteri chiari, destinazione definita e visione di mercato.'],
    steps: [['Conoscere', 'Prodotto, origine, disponibilità e contesto commerciale.'], ['Selezionare', 'Specifiche coerenti con qualità, formato e destinazione.'], ['Coordinare', 'Una linea chiara dall’accordo commerciale fino al mercato.']],
    supply: ['02 / Cosa forniamo', 'Origini selezionate.<br><em>Destinazioni internazionali.</em>', 'Tre famiglie di prodotto, definite per origine, specifiche e disponibilità.'],
    cards: ['Pesce, crostacei e cefalopodi, freschi e surgelati.', 'Frutta e ortaggi selezionati per varietà, origine, calibro e campagna.', 'Campagne e opportunità secondo origine e disponibilità.'],
    catalogue: 'Vedi il catalogo',
    criteria: ['03 / Il nostro criterio', 'Precisione<br><em>prima della promessa.</em>', 'Ogni opportunità parte da una specifica concreta. Prima di confermare, verifichiamo ciò che determina il valore reale dell’operazione.'],
    checks: [['Prodotto', 'specie o varietà'], ['Origine', 'area e disponibilità'], ['Specifiche', 'calibro, qualità e presentazione'], ['Mercato', 'volume, formato e destinazione']],
    reach: ['04 / Dove operiamo', 'Da Madrid<br><em>al mondo.</em>', 'Da Madrid colleghiamo aree di produzione e zone di pesca con destinazioni professionali in tre regioni.'],
    regions: [['Europa', 'Spagna, Francia, Italia, Germania e Paesi Bassi.'], ['Africa', 'Marocco, Tunisia, Mauritania e Africa occidentale.'], ['Medio Oriente', 'Golfo e Levante.']],
    note: 'Il Mediterraneo è una zona di pesca: l’origine di parte del pesce che selezioniamo.',
    markets: 'Vedi i mercati',
    values: ['05 / Valori', 'Ciò che<br><em>non cambia.</em>', 'Principi semplici che guidano le nostre decisioni e il nostro modo di lavorare.'],
    valueList: [['Precisione', 'I dettagli contano.'], ['Integrità', 'Facciamo ciò che diciamo.'], ['Trasparenza', 'La fiducia inizia dalla chiarezza.'], ['Conoscenza', 'Capire meglio permette di decidere meglio.'], ['Responsabilità', 'Pensiamo oltre il risultato immediato.'], ['Adattabilità', 'Evolviamo con il mercato.']],
    commitKicker: '06 / Impegno',
    commit: [['Anche il futuro conta.', 'L’alimentazione dipende da risorse naturali ed ecosistemi da proteggere. Vogliamo lavorare con più efficienza, meno sprechi e maggiore consapevolezza delle risorse. Non cerchiamo di sembrare sostenibili: vogliamo imparare a fare meglio.'], ['La tecnologia aiuta. Il criterio decide.', 'Usiamo nuovi strumenti quando portano valore reale: informazioni migliori, coordinamento migliore e più efficienza. Dietro ogni decisione restano le persone.']],
    close: ['Nuove connessioni', 'Parliamo di una<br><em>necessità concreta.</em>', 'Indicateci prodotto, origine, volume e destinazione: valutiamo ogni richiesta professionale.'],
    contact: 'Contatta EMPERIO TISS',
    signature: ['EMPERIO Signature', 'Accesso professionale', 'Offerte private, disponibilità e referenze per aziende approvate.', 'Entra']
  },
  ar: {
    kicker: 'شركة دولية · مدريد',
    h1: 'من المنشأ إلى السوق.<br><em>بمعايير واضحة.</em>',
    lead: 'تعمل EMPERIO TISS مباشرة في العمليات الغذائية بين الشركات (B2B)، وتربط مناشئ مختارة بأسواق مهنية بمسؤولية تجارية.',
    cta: 'أخبرونا باحتياجكم', products: 'عرض المنتجات', indexLabel: 'مجالات النشاط',
    families: ['المنتجات البحرية', 'الفواكه والخضروات', 'المنتجات الموسمية'],
    factsLabel: 'EMPERIO TISS باختصار',
    facts: [['المقر', 'مدريد، إسبانيا'], ['النشاط', 'توريد غذائي بين الشركات (B2B)'], ['المنتجات', 'المأكولات البحرية والفواكه والخضروات'], ['الأسواق', 'أوروبا وأفريقيا والشرق الأوسط']],
    role: ['01 / دورنا', 'طرف فاعل<br><em>في كل عملية.</em>', 'نعمل كطرف رئيسي: للمشترين نمثل العرض ونتحمل مسؤولية المنتج، وللمنتجين نشتري بمعايير واضحة ووجهة محددة ورؤية للسوق.'],
    steps: [['نفهم', 'المنتج والمنشأ والتوافر والسياق التجاري.'], ['نختار', 'مواصفات متسقة مع الجودة والشكل والوجهة.'], ['ننسّق', 'خط واضح من الاتفاق التجاري حتى السوق.']],
    supply: ['02 / ما نورّده', 'مناشئ مختارة.<br><em>وجهات دولية.</em>', 'ثلاث عائلات من المنتجات، محددة حسب المنشأ والمواصفات والتوافر.'],
    cards: ['أسماك وقشريات ورأسيات أرجل، طازجة ومجمدة.', 'فواكه وخضروات مختارة حسب الصنف والمنشأ والحجم والموسم.', 'مواسم وفرص حسب المنشأ والتوافر.'],
    catalogue: 'عرض الكتالوج',
    criteria: ['03 / معيارنا', 'الدقة<br><em>قبل الوعد.</em>', 'كل فرصة تبدأ من مواصفة محددة. قبل التأكيد، نتحقق مما يحدد القيمة الحقيقية للعملية.'],
    checks: [['المنتج', 'النوع أو الصنف'], ['المنشأ', 'المنطقة والتوافر'], ['المواصفات', 'الحجم والجودة والتقديم'], ['السوق', 'الكمية والشكل والوجهة']],
    reach: ['04 / أين نعمل', 'من مدريد<br><em>إلى العالم.</em>', 'من مدريد نربط مناطق الإنتاج ومناطق الصيد بوجهات مهنية في ثلاث مناطق.'],
    regions: [['أوروبا', 'إسبانيا وفرنسا وإيطاليا وألمانيا وهولندا.'], ['أفريقيا', 'المغرب وتونس وموريتانيا وغرب أفريقيا.'], ['الشرق الأوسط', 'الخليج والمشرق.']],
    note: 'البحر المتوسط منطقة صيد: منشأ جزء من الأسماك التي نختارها.',
    markets: 'عرض الأسواق',
    values: ['05 / قيمنا', 'ما الذي<br><em>لا يتغير.</em>', 'مبادئ بسيطة توجه قراراتنا وطريقة عملنا.'],
    valueList: [['الدقة', 'التفاصيل مهمة.'], ['النزاهة', 'نفعل ما نقول.'], ['الشفافية', 'الثقة تبدأ بالوضوح.'], ['المعرفة', 'الفهم الأفضل يقود إلى قرارات أفضل.'], ['المسؤولية', 'نفكر أبعد من النتيجة الفورية.'], ['المرونة', 'نتطور مع السوق.']],
    commitKicker: '06 / التزامنا',
    commit: [['المستقبل مهم أيضاً.', 'تعتمد منظومة الغذاء على موارد طبيعية ونظم بيئية تستحق الحماية. نريد العمل بكفاءة أكبر وهدر أقل ووعي أكبر بالموارد. لا نريد أن نبدو مستدامين: نريد أن نتعلم كيف نفعل ذلك بشكل أفضل.'], ['التكنولوجيا تساعد. والحُكم يقرر.', 'نستخدم الأدوات الجديدة عندما تضيف قيمة حقيقية: معلومات أفضل وتنسيق أفضل وكفاءة أكبر. وخلف كل قرار يبقى الإنسان.']],
    close: ['روابط جديدة', 'لنتحدث عن<br><em>احتياج محدد.</em>', 'أخبرونا بالمنتج والمنشأ والكمية والوجهة: ندرس كل طلب مهني.'],
    contact: 'تواصل معنا',
    signature: ['EMPERIO Signature', 'وصول مهني', 'عروض خاصة وتوافر ومراجع للشركات المعتمدة.', 'دخول']
  }
};

const IMAGES = ['/assets/images/home-seafood.webp', '/assets/images/home-produce.webp', '/assets/images/home-seasonal.webp'];
const ROUTES = ['products/seafood/', 'products/fruits-vegetables/', 'products/seasonal/'];
const pad = i => String(i + 1).padStart(2, '0');

function main(lang) {
  const c = COPY[lang];
  const base = lang === 'es' ? '/' : `/${lang}/`;
  const head = ([kicker, h2, lead], id) => `<div class="ab26-head" data-ab26-reveal><div><p class="ab26-kicker">${kicker}</p><h2 id="${id}">${h2}</h2></div><p class="ab26-lead">${lead}</p></div>`;
  return `<main class="ab26">
      <section class="ab26-hero" aria-labelledby="ab26-title">
        <div class="ab26-wrap">
          <div>
            <p class="ab26-kicker">${c.kicker}</p>
            <h1 id="ab26-title">${c.h1}</h1>
            <p class="ab26-lead">${c.lead}</p>
            <div class="ab26-actions"><a class="ab26-btn ab26-btn--primary" href="${base}contact/">${c.cta} ${UP}</a><a class="ab26-btn ab26-btn--ghost" href="${base}products/">${c.products}</a></div>
          </div>
          <div><p class="ab26-index-label">${c.indexLabel}</p><ol class="ab26-index">${c.families.map((f, i) => `<li><span>${pad(i)}</span>${f}</li>`).join('')}</ol></div>
        </div>
      </section>

      <section class="ab26-facts" aria-label="${c.factsLabel}">
        <div class="ab26-wrap"><dl>${c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
      </section>

      <section class="ab26-section ab26-role" aria-labelledby="ab26-role">
        <div class="ab26-wrap">
          ${head(c.role, 'ab26-role')}
          <ol class="ab26-steps" data-ab26-reveal>${c.steps.map(([t, d], i) => `<li><span>${pad(i)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
        </div>
      </section>

      <section class="ab26-section ab26-supply ab26-dark" aria-labelledby="ab26-supply">
        <div class="ab26-wrap">
          ${head(c.supply, 'ab26-supply')}
          <div class="ab26-cards" data-ab26-reveal>${c.families.map((f, i) => `<a class="ab26-card" href="${base}${ROUTES[i]}"><img src="${IMAGES[i]}" alt="" loading="lazy" decoding="async"><span>${pad(i)}</span><h3>${f}</h3><p>${c.cards[i]}</p><b>${c.catalogue} ${ARROW}</b></a>`).join('')}</div>
        </div>
      </section>

      <section class="ab26-section ab26-criteria" aria-labelledby="ab26-criteria">
        <div class="ab26-wrap">
          <div data-ab26-reveal><p class="ab26-kicker">${c.criteria[0]}</p><h2 id="ab26-criteria">${c.criteria[1]}</h2></div>
          <div data-ab26-reveal><p class="ab26-lead">${c.criteria[2]}</p><dl>${c.checks.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
        </div>
      </section>

      <section class="ab26-section ab26-reach ab26-dark" aria-labelledby="ab26-reach">
        <div class="ab26-wrap">
          ${head(c.reach, 'ab26-reach')}
          <div class="ab26-regions" data-ab26-reveal>${c.regions.map(([r, d], i) => `<div><span>${pad(i)}</span><h3>${r}</h3><p>${d}</p></div>`).join('')}</div>
          <p class="ab26-note">${c.note}</p>
          <a class="ab26-link" href="${base}markets/">${c.markets} ${ARROW}</a>
        </div>
      </section>

      <section class="ab26-section ab26-values" aria-labelledby="ab26-values">
        <div class="ab26-wrap">
          ${head(c.values, 'ab26-values')}
          <div class="ab26-values-grid" data-ab26-reveal>${c.valueList.map(([t, d], i) => `<article><span>${pad(i)}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
        </div>
      </section>

      <section class="ab26-section ab26-commit" aria-label="${c.commitKicker.replace(/^\d+ \/ /, '')}">
        <div class="ab26-wrap">
          <p class="ab26-kicker">${c.commitKicker}</p>
          <div class="ab26-commit-grid" data-ab26-reveal>${c.commit.map(([t, d]) => `<article><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
        </div>
      </section>

      <section class="ab26-section ab26-close ab26-dark" aria-labelledby="ab26-close">
        <div class="ab26-wrap">
          <div data-ab26-reveal>
            <p class="ab26-kicker">${c.close[0]}</p>
            <h2 id="ab26-close">${c.close[1]}</h2>
            <p class="ab26-lead">${c.close[2]}</p>
            <div class="ab26-actions"><a class="ab26-btn ab26-btn--primary" href="${base}contact/">${c.contact} ${UP}</a><a class="ab26-btn ab26-btn--ghost" href="mailto:info@emperio-tiss.com">info@emperio-tiss.com</a></div>
          </div>
          <aside class="ab26-signature" data-ab26-reveal>
            <img src="/assets/images/emperio-tiss-emblem.svg?v=20261008-brand" alt="" width="44" height="44">
            <p class="ab26-kicker">${c.signature[0]}</p>
            <h3>${c.signature[1]}</h3>
            <p>${c.signature[2]}</p>
            <a class="ab26-link" href="${base}private/">${c.signature[3]} ${ARROW}</a>
          </aside>
        </div>
      </section>
      <script>(function(){var els=document.querySelectorAll('.ab26 [data-ab26-reveal]');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});els.forEach(function(e){io.observe(e)})})();</script>
    </main>`;
}

for (const lang of Object.keys(COPY)) {
  const file = path.join(ROOT, lang === 'es' ? '' : lang, 'about', 'index.html');
  const raw = fs.readFileSync(file, 'utf8');
  const crlf = raw.includes('\r\n');
  let html = raw.replace(/\r\n/g, '\n');
  const start = html.indexOf('<main'), end = html.indexOf('</main>');
  if (start < 0 || end < 0) throw new Error(`${file}: <main> not found`);
  html = html.slice(0, start) + main(lang) + html.slice(end + '</main>'.length);
  // page styles: the shared Company stylesheet replaces the old about-media one
  html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/(?:about-media|about-2026)\.css[^"]*"[^>]*>/, '<link rel="stylesheet" href="/assets/css/about-2026.css?v=20261009-3">');
  // the old hero override block in the Spanish head is not needed any more
  html = html.replace(/\n\s*<style>\s*html,\s*body\.es-page\.about-page[\s\S]*?<\/style>/, '');
  html = html.replace(/<body class="[^"]*"/, `<body class="es-page${lang === 'ar' ? ' ar-page' : ''} about-page about-2026 et-brand-shell brand-pages"`);
  fs.writeFileSync(file, crlf ? html.replace(/\n/g, '\r\n') : html);
}
console.log('Company pages written: ' + Object.keys(COPY).join(', '));
