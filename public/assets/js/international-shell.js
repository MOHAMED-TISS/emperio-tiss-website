(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const lang = (root.lang || 'en').slice(0, 2).toLowerCase();
  if (!['en','fr','ar'].includes(lang)) return;

  root.lang = lang;
  if (lang === 'ar') root.dir = 'rtl';

  const cfg = {
    en: {
      home:'Home', company:'Company', products:'Products', seafood:'Seafood', fish:'Fish', shellfish:'Shellfish', cephalopods:'Cephalopods', fruits:'Fruits', vegetables:'Vegetables', seasonal:'Seasonal', markets:'Markets', news:'News', contact:'Contact',
      enquiry:'Business enquiry', brand:'Your trusted partner in international markets.',
      nav:'Navigation', productCol:'Products', companyCol:'Company', legal:'Legal', legalNotice:'Legal notice', privacy:'Privacy policy', cookies:'Cookie policy',
      geography:'EUROPE · AFRICA · MEDITERRANEAN', locale:'Madrid · Europe · Africa · Mediterranean', open:'Open menu', close:'Close menu', homeAria:'EMPERIO TISS — Home'
    },
    fr: {
      home:'Accueil', company:'Entreprise', products:'Produits', seafood:'Produits de la mer', fish:'Poissons', shellfish:'Crustacés', cephalopods:'Céphalopodes', fruits:'Fruits', vegetables:'Légumes', seasonal:'Produits de saison', markets:'Marchés', news:'Actualités', contact:'Contact',
      enquiry:'Demande commerciale', brand:'Votre partenaire de confiance sur les marchés internationaux.',
      nav:'Navigation', productCol:'Produits', companyCol:'Entreprise', legal:'Informations légales', legalNotice:'Mentions légales', privacy:'Politique de confidentialité', cookies:'Politique relative aux cookies',
      geography:'EUROPE · AFRIQUE · MÉDITERRANÉE', locale:'Madrid · Europe · Afrique · Méditerranée', open:'Ouvrir le menu', close:'Fermer le menu', homeAria:'EMPERIO TISS — Accueil'
    },
    ar: {
      home:'الرئيسية', company:'الشركة', products:'المنتجات', seafood:'منتجات البحر', fish:'الأسماك', shellfish:'القشريات', cephalopods:'رأسيات الأرجل', fruits:'الفواكه', vegetables:'الخضروات', seasonal:'المنتجات الموسمية', markets:'الأسواق', news:'الأخبار', contact:'اتصل بنا',
      enquiry:'استفسار تجاري', brand:'شريككم الموثوق في الأسواق الدولية.',
      nav:'التنقل', productCol:'المنتجات', companyCol:'الشركة', legal:'المعلومات القانونية', legalNotice:'الإشعار القانوني', privacy:'سياسة الخصوصية', cookies:'سياسة ملفات تعريف الارتباط',
      geography:'أوروبا · أفريقيا · البحر المتوسط', locale:'مدريد · أوروبا · أفريقيا · البحر المتوسط', open:'فتح القائمة', close:'إغلاق القائمة', homeAria:'EMPERIO TISS — الرئيسية'
    }
  }[lang];

  const base = lang === 'en' ? '/en/' : lang === 'fr' ? '/fr/' : '/ar/';
  const href = {
    home:base, company:`${base}about/`, products:`${base}products/`, seafood:`${base}products/seafood/`, fish:`${base}products/seafood/fish/`, shellfish:`${base}products/seafood/shellfish/`, cephalopods:`${base}products/seafood/cephalopods/`, fruits:`${base}products/fruits/`, vegetables:`${base}products/vegetables/`, seasonal:`${base}products/seasonal/`, markets:`${base}markets/`, news:`${base}news/`, contact:`${base}contact/`
  };

  const header = `<header class="site-header" id="luxuryHeader"><div class="header-inner"><a href="${href.home}" class="site-logo" aria-label="${cfg.homeAria}"><img src="/logo.png" alt="EMPERIO TISS" width="94" height="62"></a><nav class="et-language-switch" aria-label="${lang==='ar'?'اللغة':lang==='fr'?'Langue':'Language'}"><a href="/">ES</a><span>·</span><a href="/en/" ${lang==='en'?'class="current" aria-current="page"':''}>EN</a><span>·</span><a href="/fr/" ${lang==='fr'?'class="current" aria-current="page"':''}>FR</a><span>·</span><a href="/ar/" ${lang==='ar'?'class="current" aria-current="page"':''}>AR</a></nav><button id="menuToggleBtn" class="mobile-menu" type="button" aria-label="${cfg.open}" aria-expanded="false" aria-controls="navOverlay"><span></span><span></span><span></span></button></div></header>`;
  const overlay = `<div class="nav-overlay" id="navOverlay" aria-hidden="true"><div class="nav-overlay-inner"><nav class="nav-overlay-links" aria-label="${cfg.nav}"></nav><div class="nav-overlay-foot"><div class="nav-overlay-lang"><a href="/">ES</a><span>·</span><a href="/en/">EN</a><span>·</span><a href="/fr/">FR</a><span>·</span><a href="/ar/">AR</a></div><div class="nav-overlay-contact"><a href="${href.contact}">${cfg.enquiry}</a><span>${cfg.locale}</span></div></div></div></div>`;
  const footer = `<footer class="site-footer"><div class="container"><div class="footer-main"><div class="footer-brand"><img src="/logo.png" alt="EMPERIO TISS" class="footer-logo"><p>${cfg.brand}</p></div><div class="footer-column"><strong>${cfg.nav}</strong><a href="${href.home}">${cfg.home}</a><a href="${href.company}">${cfg.company}</a><a href="${href.products}">${cfg.products}</a><a href="${href.markets}">${cfg.markets}</a></div><div class="footer-column"><strong>${cfg.productCol}</strong><a href="${href.seafood}">${cfg.seafood}</a><a href="${href.fruits}">${cfg.fruits} &amp; ${cfg.vegetables}</a><a href="${href.seasonal}">${cfg.seasonal}</a></div><div class="footer-column"><strong>${cfg.companyCol}</strong><a href="${href.contact}">${cfg.contact}</a><a href="/legal/aviso-legal.html">${cfg.legalNotice}</a><a href="/legal/privacidad.html">${cfg.privacy}</a><a href="/legal/cookies.html">${cfg.cookies}</a></div></div><div class="footer-bottom"><span>EMPERIO TISS</span><span>${cfg.geography}</span></div></div></footer>`;

  doc.querySelector('header.site-header, header.p-header')?.replaceWith();
  doc.querySelector('.nav-overlay, .p-overlay')?.remove();
  doc.querySelector('footer.site-footer, footer.intl-footer, footer.ar-footer, footer.es-footer, footer.footer')?.remove();
  doc.body.insertAdjacentHTML('afterbegin', header + overlay);
  doc.body.insertAdjacentHTML('beforeend', footer);
  body.classList.add('international-shell');
  body.classList.toggle('international-shell-ar', lang === 'ar');
})();