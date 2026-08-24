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
      nav:'Navigation', productCol:'Products', companyCol:'Company', legalNotice:'Legal notice', privacy:'Privacy policy', cookies:'Cookie policy', reserved:'All rights reserved.', disclaimer:'Published information is provided for information purposes and does not constitute a contractual offer.', geography:'MADRID · SPAIN · EUROPE · AFRICA · MEDITERRANEAN', locale:'Madrid · Europe · Africa · Mediterranean', open:'Open menu', close:'Close menu', homeAria:'EMPERIO TISS — Home'
    },
    fr: {
      home:'Accueil', company:'Entreprise', products:'Produits', seafood:'Produits de la mer', fish:'Poissons', shellfish:'Crustacés', cephalopods:'Céphalopodes', fruits:'Fruits', vegetables:'Légumes', seasonal:'Produits de saison', markets:'Marchés', news:'Actualités', contact:'Contact',
      enquiry:'Demande commerciale', brand:'Votre partenaire de confiance sur les marchés internationaux.',
      nav:'Navigation', productCol:'Produits', companyCol:'Entreprise', legalNotice:'Mentions légales', privacy:'Politique de confidentialité', cookies:'Politique relative aux cookies', reserved:'Tous droits réservés.', disclaimer:'Les informations publiées sont fournies à titre informatif et ne constituent pas une offre contractuelle.', geography:'MADRID · ESPAGNE · EUROPE · AFRIQUE · MÉDITERRANÉE', locale:'Madrid · Europe · Afrique · Méditerranée', open:'Ouvrir le menu', close:'Fermer le menu', homeAria:'EMPERIO TISS — Accueil'
    },
    ar: {
      home:'الرئيسية', company:'الشركة', products:'المنتجات', seafood:'منتجات البحر', fish:'الأسماك', shellfish:'القشريات', cephalopods:'رأسيات الأرجل', fruits:'الفواكه', vegetables:'الخضروات', seasonal:'المنتجات الموسمية', markets:'الأسواق', news:'الأخبار', contact:'اتصل بنا',
      enquiry:'استفسار تجاري', brand:'شريككم الموثوق في الأسواق الدولية.',
      nav:'التنقل', productCol:'المنتجات', companyCol:'الشركة', legalNotice:'الإشعار القانوني', privacy:'سياسة الخصوصية', cookies:'سياسة ملفات تعريف الارتباط', reserved:'جميع الحقوق محفوظة.', disclaimer:'المعلومات المنشورة مقدمة لأغراض إعلامية ولا تشكل عرضًا تعاقديًا.', geography:'مدريد · إسبانيا · أوروبا · أفريقيا · البحر المتوسط', locale:'مدريد · أوروبا · أفريقيا · البحر المتوسط', open:'فتح القائمة', close:'إغلاق القائمة', homeAria:'EMPERIO TISS — الرئيسية'
    }
  }[lang];

  const base = lang === 'en' ? '/en/' : lang === 'fr' ? '/fr/' : '/ar/';
  const href = {
    home:base, company:`${base}about/`, products:`${base}products/`, seafood:`${base}products/seafood/`, fish:`${base}products/seafood/fish/`, shellfish:`${base}products/seafood/shellfish/`, cephalopods:`${base}products/seafood/cephalopods/`, fruits:`${base}products/fruits/`, vegetables:`${base}products/vegetables/`, seasonal:`${base}products/seasonal/`, markets:`${base}markets/`, news:`${base}news/`, contact:`${base}contact/`
  };

  const header = `<header class="site-header" id="luxuryHeader"><a href="${href.home}" class="site-logo" aria-label="${cfg.homeAria}"><img src="/logo.png" alt="EMPERIO TISS" width="94" height="62"></a><nav class="et-language-switch" aria-label="${lang==='ar'?'اللغة':lang==='fr'?'Langue':'Language'}"><a href="/">ES</a><span>·</span><a href="/en/" ${lang==='en'?'class="current" aria-current="page"':''}>EN</a><span>·</span><a href="/fr/" ${lang==='fr'?'class="current" aria-current="page"':''}>FR</a><span>·</span><a href="/ar/" ${lang==='ar'?'class="current" aria-current="page"':''}>AR</a></nav><button id="menuToggleBtn" class="mobile-menu" type="button" aria-label="${cfg.open}" aria-expanded="false" aria-controls="navOverlay"><span></span><span></span><span></span></button></header>`;
  const overlay = `<div class="nav-overlay" id="navOverlay" aria-hidden="true"><div class="nav-overlay-inner"><nav class="nav-overlay-links" aria-label="${cfg.nav}"></nav><div class="nav-overlay-foot"><div class="nav-overlay-lang"><a href="/">ES</a><span>·</span><a href="/en/">EN</a><span>·</span><a href="/fr/">FR</a><span>·</span><a href="/ar/">AR</a></div><div class="nav-overlay-contact"><a href="${href.contact}">${cfg.enquiry}</a><span>${cfg.locale}</span></div></div></div></div>`;
  const footer = `<footer class="et-universal-footer"><div class="et-footer-container"><div class="et-footer-main"><div class="et-footer-brand"><img class="et-footer-logo" src="/logo.png" alt="EMPERIO TISS"><p>${cfg.brand}</p></div><div class="et-footer-column"><strong>${cfg.nav}</strong><a href="${href.home}">${cfg.home}</a><a href="${href.company}">${cfg.company}</a><a href="${href.products}">${cfg.products}</a><a href="${href.markets}">${cfg.markets}</a><a href="${href.news}">${cfg.news}</a><a href="${href.contact}">${cfg.contact}</a></div><div class="et-footer-column"><strong>${cfg.productCol}</strong><a href="${href.seafood}">${cfg.seafood}</a><a href="${href.fish}">${cfg.fish}</a><a href="${href.shellfish}">${cfg.shellfish}</a><a href="${href.cephalopods}">${cfg.cephalopods}</a><a href="${href.fruits}">${cfg.fruits}</a><a href="${href.vegetables}">${cfg.vegetables}</a><a href="${href.seasonal}">${cfg.seasonal}</a></div><div class="et-footer-column"><strong>${cfg.companyCol}</strong><a href="${href.contact}">${cfg.enquiry}</a><a href="/legal/aviso-legal.html">${cfg.legalNotice}</a><a href="/legal/privacidad.html">${cfg.privacy}</a><a href="/legal/cookies.html">${cfg.cookies}</a></div></div><div class="et-footer-legal"><p>© 2026 <span class="et-footer-company">EMPERIO TISS S.L.</span> ${cfg.reserved}</p><p>${cfg.disclaimer}</p></div><div class="et-footer-bottom"><span>EMPERIO TISS SL</span><span>${cfg.geography}</span></div></div></footer>`;

  doc.querySelectorAll('header').forEach(el => el.remove());
  doc.querySelectorAll('.nav-overlay, .p-overlay, footer').forEach(el => el.remove());
  doc.body.insertAdjacentHTML('afterbegin', header + overlay);
  doc.body.insertAdjacentHTML('beforeend', footer);
  body.classList.add('international-shell');
  body.classList.toggle('international-shell-ar', lang === 'ar');

  if (lang === 'ar') {
    const style = doc.createElement('style');
    style.textContent = `
      html[lang="ar"] #menuToggleBtn.mobile-menu{position:relative!important;display:grid!important;place-items:center!important;inline-size:58px!important;block-size:58px!important;padding:0!important;direction:ltr!important}
      html[lang="ar"] #menuToggleBtn.mobile-menu span{position:absolute!important;left:50%!important;top:50%!important;margin:0!important;transform-origin:center!important}
      html[lang="ar"] #menuToggleBtn.mobile-menu span:nth-child(1){transform:translate(-50%,-7px)!important}
      html[lang="ar"] #menuToggleBtn.mobile-menu span:nth-child(2){transform:translate(-50%,-50%)!important}
      html[lang="ar"] #menuToggleBtn.mobile-menu span:nth-child(3){transform:translate(-50%,5px)!important}
      html[lang="ar"] body.nav-open #menuToggleBtn.mobile-menu span:nth-child(1),html[lang="ar"] body.menu-open #menuToggleBtn.mobile-menu span:nth-child(1),html[lang="ar"] #menuToggleBtn.mobile-menu[aria-expanded="true"] span:nth-child(1){transform:translate(-50%,-50%) rotate(45deg)!important}
      html[lang="ar"] body.nav-open #menuToggleBtn.mobile-menu span:nth-child(2),html[lang="ar"] body.menu-open #menuToggleBtn.mobile-menu span:nth-child(2),html[lang="ar"] #menuToggleBtn.mobile-menu[aria-expanded="true"] span:nth-child(2){transform:translate(-50%,-50%) scaleX(0)!important;opacity:0!important}
      html[lang="ar"] body.nav-open #menuToggleBtn.mobile-menu span:nth-child(3),html[lang="ar"] body.menu-open #menuToggleBtn.mobile-menu span:nth-child(3),html[lang="ar"] #menuToggleBtn.mobile-menu[aria-expanded="true"] span:nth-child(3){transform:translate(-50%,-50%) rotate(-45deg)!important}
    `;
    doc.head.appendChild(style);
  }
})();
