(() => {
    'use strict';
    const doc = document,
      root = doc.documentElement,
      body = doc.body;
    const lang = (root.lang || 'en').slice(0, 2).toLowerCase();
    if (!['en', 'fr', 'it', 'ar'].includes(lang)) return;
    const path = location.pathname.replace(/\/+/g, '/');
    const match = path.match(
      /\/products\/(?:seafood\/(fish|shellfish|cephalopods)|fruits|vegetables)(?:\/|$)/);
    if (!match) return;
    const subcategory = match[1] || (path.includes('/vegetables') ? 'vegetables' : 'fruits');
    const seafood = ['fish', 'shellfish', 'cephalopods'].includes(subcategory);
    const base = lang === 'en' ? '/en' : lang === 'fr' ? '/fr' : lang === 'it' ? '/it' : '/ar';
    const t = {
      en: {
        seafoodLabel: 'SEAFOOD PRODUCTS',
        nav: ['Fish', 'Shellfish', 'Cephalopods'],
        heroes: {
          fish: {
            eyebrow: 'SEAFOOD / FISH',
            title: 'From origin<br><em>to market.</em>',
            lead: 'Selected fish for professional operations: species, origin, FAO, calibre, quality, presentation and availability.',
            cta: 'Explore references'
          },
          shellfish: {
            eyebrow: 'SEAFOOD PRODUCTS / 02',
            title: 'Selected<br><em>shellfish.</em>',
            lead: 'References defined by species, origin, calibre, quality, format, packaging and availability.'
          },
          cephalopods: {
            eyebrow: 'SEAFOOD PRODUCTS / 03',
            title: 'Selected<br><em>cephalopods.</em>',
            lead: 'References defined by species, origin, calibre, quality, format, packaging and availability.'
          }
        },
        produce: {
          fruits: {
            eyebrow: 'PRODUCT / 01 · FRUITS',
            title: 'From origin<br><em>to table.</em>',
            lead: 'Selected fruits by variety, origin, calibre, quality, campaign and supply programme.',
            note: 'SELECTION · ORIGIN · CAMPAIGN'
          },
          vegetables: {
            eyebrow: 'PRODUCT / 02 · VEGETABLES',
            title: 'The selected<br><em>harvest.</em>',
            lead: 'Fresh vegetables defined by variety, origin, calibre or size, quality, format, packaging and availability.',
            note: 'VARIETY · SPECIFICATION · SUPPLY'
          }
        }
      },
      fr: {
        seafoodLabel: 'PRODUITS DE LA MER',
        nav: ['Poissons', 'Crustacés', 'Céphalopodes'],
        heroes: {
          fish: {
            eyebrow: 'PRODUITS DE LA MER / POISSONS',
            title: 'De l’origine<br><em>au marché.</em>',
            lead: 'Poissons sélectionnés pour les opérations professionnelles : espèce, origine, FAO, calibre, qualité, présentation et disponibilité.',
            cta: 'Explorer les références'
          },
          shellfish: {
            eyebrow: 'PRODUITS DE LA MER / 02',
            title: 'Crustacés<br><em>sélectionnés.</em>',
            lead: 'Références définies par espèce, origine, calibre, qualité, format, emballage et disponibilité.'
          },
          cephalopods: {
            eyebrow: 'PRODUITS DE LA MER / 03',
            title: 'Céphalopodes<br><em>sélectionnés.</em>',
            lead: 'Références définies par espèce, origine, calibre, qualité, format, emballage et disponibilité.'
          }
        },
        produce: {
          fruits: {
            eyebrow: 'PRODUIT / 01 · FRUITS',
            title: 'De l’origine<br><em>à la table.</em>',
            lead: 'Fruits sélectionnés par variété, origine, calibre, qualité, campagne et programme d’approvisionnement.',
            note: 'SÉLECTION · ORIGINE · CAMPAGNE'
          },
          vegetables: {
            eyebrow: 'PRODUIT / 02 · LÉGUMES',
            title: 'La récolte<br><em>sélectionnée.</em>',
            lead: 'Légumes frais définis par variété, origine, calibre ou taille, qualité, format, emballage et disponibilité.',
            note: 'VARIÉTÉ · SPÉCIFICATION · APPROVISIONNEMENT'
          }
        }
      },
      it: {
        seafoodLabel: 'PRODOTTI DEL MARE',
        nav: ['Pesce', 'Crostacei', 'Cefalopodi'],
        heroes: {
          fish: {
            eyebrow: 'PRODOTTI DEL MARE / PESCE',
            title: 'Dall’origine<br><em>al mercato.</em>',
            lead: 'Pesce selezionato per operazioni professionali: specie, origine, FAO, calibro, qualità, presentazione e disponibilità.',
            cta: 'Esplora le referenze'
          },
          shellfish: {
            eyebrow: 'PRODOTTI DEL MARE / 02',
            title: 'Crostacei<br><em>selezionati.</em>',
            lead: 'Referenze definite da specie, origine, calibro, qualità, formato, imballaggio e disponibilità.'
          },
          cephalopods: {
            eyebrow: 'PRODOTTI DEL MARE / 03',
            title: 'Cefalopodi<br><em>selezionati.</em>',
            lead: 'Referenze definite da specie, origine, calibro, qualità, formato, imballaggio e disponibilità.'
          }
        },
        produce: {
          fruits: {
            eyebrow: 'PRODOTTO / 01 · FRUTTA',
            title: 'Dall’origine<br><em>alla tavola.</em>',
            lead: 'Frutta selezionata per varietà, origine, calibro, qualità, campagna e programma di fornitura.',
            note: 'SELEZIONE · ORIGINE · CAMPAGNA'
          },
          vegetables: {
            eyebrow: 'PRODOTTO / 02 · ORTAGGI',
            title: 'Il raccolto<br><em>selezionato.</em>',
            lead: 'Ortaggi freschi definiti da varietà, origine, calibro o dimensione, qualità, formato, imballaggio e disponibilità.',
            note: 'VARIETÀ · SPECIFICA · FORNITURA'
          }
        }
      },
      ar: {
        seafoodLabel: 'منتجات البحر',
        nav: ['الأسماك', 'القشريات', 'رأسيات الأرجل'],
        heroes: {
          fish: {
            eyebrow: 'منتجات البحر / الأسماك',
            title: 'من المنشأ<br><em>إلى السوق.</em>',
            lead: 'أسماك مختارة للعمليات المهنية: النوع، المنشأ، منطقة FAO، القياس، الجودة، طريقة التقديم والتوافر.',
            cta: 'استكشاف المراجع'
          },
          shellfish: {
            eyebrow: 'منتجات البحر / 02',
            title: 'قشريات<br><em>مختارة.</em>',
            lead: 'مراجع محددة حسب النوع، المنشأ، القياس، الجودة، الشكل، التعبئة والتوافر.'
          },
          cephalopods: {
            eyebrow: 'منتجات البحر / 03',
            title: 'رأسيات الأرجل<br><em>مختارة.</em>',
            lead: 'مراجع محددة حسب النوع، المنشأ، القياس، الجودة، الشكل، التعبئة والتوافر.'
          }
        },
        produce: {
          fruits: {
            eyebrow: 'منتج / 01 · الفواكه',
            title: 'من المنشأ<br><em>إلى المائدة.</em>',
            lead: 'فواكه مختارة حسب الصنف، المنشأ، القياس، الجودة، الموسم وبرنامج التوريد.',
            note: 'اختيار · منشأ · موسم'
          },
          vegetables: {
            eyebrow: 'منتج / 02 · الخضروات',
            title: 'محصول<br><em>مختار.</em>',
            lead: 'خضروات طازجة محددة حسب الصنف، المنشأ، القياس أو الحجم، الجودة، الشكل، التعبئة والتوافر.',
            note: 'صنف · مواصفات · توريد'
          }
        }
      }
    } [lang];
    const addCss = (href, key) => {
      if (doc.querySelector(`link[data-${key}]`)) return;
      const l = doc.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.dataset[key] = 'true';
      doc.head.appendChild(l)
    };
    if (seafood) {
      addCss('/assets/css/seafood-subpages-es.css?v=20260909.4', 'market-es-category-css');
      addCss('/assets/css/seafood-catalog-es.css?v=20260909.4', 'market-es-catalog-css');
      if (subcategory === 'fish') addCss('/assets/css/fish-editorial.css?v=20260909.4',
        'market-es-fish-css')
    } else {
      addCss('/assets/css/produce-es.css?v=20260909.4', 'market-es-category-css');
      addCss('/assets/css/catalog.css?v=20260909.4', 'market-es-catalog-css');
      if (subcategory === 'fruits') {
        addCss('/assets/css/citrus-catalog.css?v=20260909.4', 'market-es-fruit-css');
        addCss('/assets/css/citrus-catalog-overrides.css?v=20260909.4', 'market-es-fruit-overrides')
      }
    }
    body.classList.add('market-catalogue-page');
    if (subcategory === 'fish') body.classList.add('fish-catalog-pilot');
    else if (subcategory === 'fruits') body.classList.add('produce-page', 'produce-fruits-page');
    else if (subcategory === 'vegetables') body.classList.add('produce-page',
      'produce-vegetables-page');
    else body.classList.add('seafood-subpage');
    const hero = doc.querySelector('.page-hero,.product-hero');
    if (hero) {
      hero.classList.remove('product-hero');
      hero.classList.add('page-hero', 'market-page-hero');
      hero.style.removeProperty('background');
      hero.innerHTML =
        '<div class="page-hero-inner"><span class="eyebrow"></span><h1></h1><p class="lead"></p></div>';
      const inner = hero.querySelector('.page-hero-inner');
      const data = seafood ? t.heroes[subcategory] : t.produce[subcategory];
      inner.querySelector('.eyebrow').textContent = data.eyebrow;
      inner.querySelector('h1').innerHTML = data.title;
      inner.querySelector('.lead').textContent = data.lead;
      if (data.cta) {
        const a = doc.createElement('a');
        a.className = 'hero-cta';
        a.href = '#fishCatalog';
        a.innerHTML = `${data.cta} <span aria-hidden="true">↘</span>`;
        inner.appendChild(a)
      }
      if (data.note) {
        const n = doc.createElement('span');
        n.className = 'hero-note';
        n.textContent = data.note;
        inner.appendChild(n)
      }
      if (subcategory === 'fish') hero.style.backgroundImage =
        'url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Fishing_Boat_on_the_Sea.jpg/3840px-Fishing_Boat_on_the_Sea.jpg")'
    }
  }
  if (seafood && !doc.querySelector('.seafood-category-nav')) {
    const nav = doc.createElement('nav');
    nav.className = 'seafood-category-nav market-seafood-nav';
    nav.setAttribute('aria-label', t.seafoodLabel);
    nav.innerHTML =
      `<span class="seafood-category-nav__label">${t.seafoodLabel}</span><div class="seafood-category-nav__links">${['fish','shellfish','cephalopods'].map((id,i)=>`<a class="${id===subcategory?'is-active':''}" href="${base}/products/seafood/${id}/" ${id===subcategory?'aria-current="page"':''}><span>0${i+1}</span>${t.nav[i]}</a>`).join('')}</div>`;
    hero ? hero.insertAdjacentElement('afterend', nav) : doc.querySelector('main')?.prepend(nav)
  }
})();
