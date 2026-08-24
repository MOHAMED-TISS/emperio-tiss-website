(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const lang = (root.lang || 'en').slice(0, 2).toLowerCase();
  if (!['en','fr','ar','it'].includes(lang)) return;

  root.lang = lang;
  if (lang === 'ar') root.dir = 'rtl';

  const cfg = {
    en: {
      home:'Home', company:'Company', products:'Products', seafood:'Seafood', fish:'Fish', shellfish:'Shellfish', cephalopods:'Cephalopods', fruits:'Fruits', vegetables:'Vegetables', seasonal:'Seasonal', markets:'Markets', news:'News', contact:'Contact',
      enquiry:'Business enquiry', whatsapp:'Contact us on WhatsApp', brand:'Your trusted partner in international markets.',
      nav:'Navigation', productCol:'Products', companyCol:'Company', legalNotice:'Legal notice', privacy:'Privacy policy', cookies:'Cookie policy', reserved:'All rights reserved.', disclaimer:'Published information is provided for information purposes and does not constitute a contractual offer.', geography:'MADRID · SPAIN · EUROPE · AFRICA · MEDITERRANEAN', locale:'Madrid · Europe · Africa · Mediterranean', open:'Open menu', homeAria:'EMPERIO TISS — Home'
    },
    fr: {
      home:'Accueil', company:'Entreprise', products:'Produits', seafood:'Produits de la mer', fish:'Poissons', shellfish:'Crustacés', cephalopods:'Céphalopodes', fruits:'Fruits', vegetables:'Légumes', seasonal:'Produits de saison', markets:'Marchés', news:'Actualités', contact:'Contact',
      enquiry:'Demande commerciale', whatsapp:'Contacter sur WhatsApp', brand:'Votre partenaire de confiance sur les marchés internationaux.',
      nav:'Navigation', productCol:'Produits', companyCol:'Entreprise', legalNotice:'Mentions légales', privacy:'Politique de confidentialité', cookies:'Politique relative aux cookies', reserved:'Tous droits réservés.', disclaimer:'Les informations publiées sont fournies à titre informatif et ne constituent pas une offre contractuelle.', geography:'MADRID · ESPAGNE · EUROPE · AFRIQUE · MÉDITERRANÉE', locale:'Madrid · Europe · Afrique · Méditerranée', open:'Ouvrir le menu', homeAria:'EMPERIO TISS — Accueil'
    },
    ar: {
      home:'الرئيسية', company:'الشركة', products:'المنتجات', seafood:'منتجات البحر', fish:'الأسماك', shellfish:'القشريات', cephalopods:'رأسيات الأرجل', fruits:'الفواكه', vegetables:'الخضروات', seasonal:'المنتجات الموسمية', markets:'الأسواق', news:'الأخبار', contact:'اتصل بنا',
      enquiry:'استفسار تجاري', whatsapp:'تواصل معنا عبر واتساب', brand:'شريككم الموثوق في الأسواق الدولية.',
      nav:'التنقل', productCol:'المنتجات', companyCol:'الشركة', legalNotice:'الإشعار القانوني', privacy:'سياسة الخصوصية', cookies:'سياسة ملفات تعريف الارتباط', reserved:'جميع الحقوق محفوظة.', disclaimer:'المعلومات المنشورة مقدمة لأغراض إعلامية ولا تشكل عرضًا تعاقديًا.', geography:'مدريد · إسبانيا · أوروبا · أفريقيا · البحر المتوسط', locale:'مدريد · أوروبا · أفريقيا · البحر المتوسط', open:'فتح القائمة', homeAria:'EMPERIO TISS — الرئيسية'
    },
    it: {
      home:'Home', company:'Azienda', products:'Prodotti', seafood:'Prodotti del mare', fish:'Pesce', shellfish:'Molluschi & crostacei', cephalopods:'Cefalopodi', fruits:'Frutta', vegetables:'Ortaggi', seasonal:'Stagionale', markets:'Mercati', news:'Notizie', contact:'Contatti',
      enquiry:'Richiesta commerciale', whatsapp:'Contattaci su WhatsApp', brand:'Il tuo partner di fiducia nei mercati internazionali.',
      nav:'Navigazione', productCol:'Prodotti', companyCol:'Azienda', legalNotice:'Note legali', privacy:'Privacy', cookies:'Cookie policy', reserved:'Tutti i diritti riservati.', disclaimer:'Le informazioni pubblicate sono fornite a titolo informativo e non costituiscono un’offerta contrattuale.', geography:'MADRID · SPAGNA · EUROPA · AFRICA · MEDITERRANEO', locale:'Madrid · Europa · Africa · Mediterraneo', open:'Apri il menu', homeAria:'EMPERIO TISS — Home'
    }
  }[lang];

  const base = lang === 'en' ? '/en/' : lang === 'fr' ? '/fr/' : lang === 'ar' ? '/ar/' : '/it/';
  const href = {
    home:base, company:`${base}about/`, products:`${base}products/`, seafood:`${base}products/seafood/`, fish:`${base}products/seafood/fish/`, shellfish:`${base}products/seafood/shellfish/`, cephalopods:`${base}products/seafood/cephalopods/`, fruits:`${base}products/fruits/`, vegetables:`${base}products/vegetables/`, seasonal:`${base}products/seasonal/`, markets:`${base}markets/`, news:`${base}news/`, contact:`${base}contact/`
  };

  const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 3.5A10.9 10.9 0 0 0 13 1.1 10.9 10.9 0 0 0 3.2 17.4L2 22l4.7-1.2A10.9 10.9 0 1 0 20.5 3.5Zm-7.4 17.2a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-2.8.7-.8-2.7.8-2.7.8-2.7.2-.3a9.1 9.1 0 1 1 7.1 3.7Zm5-6.8c-.3-.2-1.8-.9-2-.9-.3-.1-.4-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.7-2.6-1.3-3.7-2.9-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6 0-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1.1 1.9-1.1 3 0 .7.2 1.3.5 1.9.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.5.6.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3Z"/></svg>';

  const header = `<header class="site-header" id="luxuryHeader"><div class="header-inner"><a href="${href.home}" class="site-logo" aria-label="${cfg.homeAria}"><img src="/logo.png" alt="EMPERIO TISS" width="94" height="62"></a><a href="https://wa.me/34614270684" class="et-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="${cfg.whatsapp}">${whatsappIcon}<span>${cfg.whatsapp}</span></a><nav class="et-language-switch" aria-label="${lang==='ar'?'اللغة':lang==='fr'?'Langue':lang==='it'?'Lingua':'Language'}"><a href="/">ES</a><span>·</span><a href="/en/">EN</a><span>·</span><a href="/fr/">FR</a><span>·</span><a href="/ar/">AR</a><span>·</span><a href="/it/" class="current" aria-current="page">IT</a></nav><button id="menuToggleBtn" class="mobile-menu" type="button" aria-label="${cfg.open}" aria-expanded="false" aria-controls="navOverlay"><span></span><span></span><span></span></button></div></header>`;
  const overlay = `<div class="nav-overlay" id="navOverlay" aria-hidden="true"><div class="nav-overlay-inner"><nav class="nav-overlay-links" aria-label="${cfg.nav}"></nav><div class="nav-overlay-foot"><div class="nav-overlay-lang"><a href="/">ES</a><span>·</span><a href="/en/">EN</a><span>·</span><a href="/fr/">FR</a><span>·</span><a href="/ar/">AR</a><span>·</span><a href="/it/" class="current">IT</a></div><div class="nav-overlay-contact"><a href="${href.contact}">${cfg.enquiry}</a><span>${cfg.locale}</span></div></div></div></div>`;
  const footer = `<footer class="et-universal-footer"><div class="et-footer-container"><div class="et-footer-main"><div class="et-footer-brand"><img class="et-footer-logo" src="/logo.png" alt="EMPERIO TISS"><p>${cfg.brand}</p></div><div class="et-footer-column"><strong>${cfg.nav}</strong><a href="${href.home}">${cfg.home}</a><a href="${href.company}">${cfg.company}</a><a href="${href.products}">${cfg.products}</a><a href="${href.markets}">${cfg.markets}</a><a href="${href.news}">${cfg.news}</a><a href="${href.contact}">${cfg.contact}</a></div><div class="et-footer-column"><strong>${cfg.productCol}</strong><a href="${href.seafood}">${cfg.seafood}</a><a href="${href.fish}">${cfg.fish}</a><a href="${href.shellfish}">${cfg.shellfish}</a><a href="${href.cephalopods}">${cfg.cephalopods}</a><a href="${href.fruits}">${cfg.fruits}</a><a href="${href.vegetables}">${cfg.vegetables}</a><a href="${href.seasonal}">${cfg.seasonal}</a></div><div class="et-footer-column"><strong>${cfg.companyCol}</strong><a href="${href.contact}">${cfg.enquiry}</a><a href="/legal/aviso-legal.html">${cfg.legalNotice}</a><a href="/legal/privacidad.html">${cfg.privacy}</a><a href="/legal/cookies.html">${cfg.cookies}</a></div></div><div class="et-footer-legal"><p>© 2026 <span class="et-footer-company">EMPERIO TISS S.L.</span> ${cfg.reserved}</p><p>${cfg.disclaimer}</p></div><div class="et-footer-bottom"><span>EMPERIO TISS SL</span><span>${cfg.geography}</span></div></div></footer>`;

  doc.querySelectorAll('header').forEach(el => el.remove());
  doc.querySelectorAll('.nav-overlay, .p-overlay, footer').forEach(el => el.remove());
  doc.body.insertAdjacentHTML('afterbegin', header + overlay);
  doc.body.insertAdjacentHTML('beforeend', footer);
  body.classList.add('international-shell');
})();
