(() => {
  'use strict';
  const doc = document;
  const loadCss = (href, key) => {
    if (doc.querySelector(`link[data-${key}]`)) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet'; link.href = href; link.dataset[key] = 'true';
    doc.head.appendChild(link);
  };
  const loadScript = (src, key) => {
    if (doc.querySelector(`script[data-${key}]`)) return;
    const script = doc.createElement('script');
    script.src = src; script.async = false; script.dataset[key] = 'true';
    doc.head.appendChild(script);
  };
  loadCss('/assets/css/site-pages.css?v=20260821-3', 'etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1', 'etUnifiedPages');
  loadCss('/assets/css/canonical-nav.css?v=20260823-taxonomy-5', 'etCanonicalNav');
  loadCss('/assets/css/catalogue-taxonomy.css?v=20260823-catalogue-1', 'etCatalogueTaxonomy');
  loadCss('/assets/css/nav-consistency.css?v=20260823-nav-1', 'etNavConsistency');
  loadCss('/assets/css/footer-consistency.css?v=20260823-footer-1', 'etFooterConsistency');

  const lang=(doc.documentElement.lang||'es').slice(0,2).toLowerCase();
  const footerI18n={
    es:{tagline:'Tu socio de confianza en los mercados internacionales.',navigation:'Navegación',products:'Productos',company:'Empresa',home:'Inicio',about:'Empresa',allProducts:'Productos',markets:'Mercados',news:'Noticias',contact:'Contacto',seafood:'Productos del mar',produce:'Frutas y hortalizas',seasonal:'Temporada',legal:'Aviso legal',privacy:'Política de privacidad',cookies:'Política de cookies',legalNote:'La información publicada tiene carácter informativo y no constituye una oferta contractual.',regions:'EUROPA · ÁFRICA · MEDITERRÁNEO'},
    en:{tagline:'Your trusted partner in international markets.',navigation:'Navigation',products:'Products',company:'Company',home:'Home',about:'Company',allProducts:'Products',markets:'Markets',news:'News',contact:'Contact',seafood:'Seafood',produce:'Fruits & vegetables',seasonal:'Seasonal',legal:'Legal notice',privacy:'Privacy policy',cookies:'Cookie policy',legalNote:'Published information is for guidance only and does not constitute a contractual offer.',regions:'EUROPE · AFRICA · MEDITERRANEAN'},
    fr:{tagline:'Votre partenaire de confiance sur les marchés internationaux.',navigation:'Navigation',products:'Produits',company:'Entreprise',home:'Accueil',about:'Entreprise',allProducts:'Produits',markets:'Marchés',news:'Actualités',contact:'Contact',seafood:'Produits de la mer',produce:'Fruits & légumes',seasonal:'Saisonnier',legal:'Mentions légales',privacy:'Politique de confidentialité',cookies:'Politique de cookies',legalNote:"Les informations publiées sont fournies à titre indicatif et ne constituent pas une offre contractuelle.",regions:'EUROPE · AFRIQUE · MÉDITERRANÉE'},
    ar:{tagline:'شريككم الموثوق في الأسواق الدولية.',navigation:'التنقل',products:'المنتجات',company:'الشركة',home:'الرئيسية',about:'الشركة',allProducts:'المنتجات',markets:'الأسواق',news:'الأخبار',contact:'اتصل بنا',seafood:'منتجات البحر',produce:'الفواكه والخضروات',seasonal:'الموسمية',legal:'إشعار قانوني',privacy:'سياسة الخصوصية',cookies:'سياسة ملفات الارتباط',legalNote:'المعلومات المنشورة إرشادية ولا تشكل عرضًا تعاقديًا.',regions:'أوروبا · أفريقيا · البحر المتوسط'}
  };
  const t=footerI18n[lang]||footerI18n.es;
  const base=lang==='es'?'':`/${lang}`;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const link=(path,label)=>`<a href="${base}${path}">${esc(label)}</a>`;

  function unifyFooter(){
    const existing=doc.querySelector('footer');
    if(!existing) return;
    const footer=doc.createElement('footer');
    footer.className='site-footer et-unified-footer';
    footer.innerHTML=`<div class="container"><div class="footer-main">
      <div class="footer-brand"><img src="/logo.png" alt="EMPERIO TISS" class="footer-logo"><strong class="footer-company-name">EMPERIO TISS S.L.</strong><p>${esc(t.tagline)}</p></div>
      <div class="footer-column"><strong>${esc(t.navigation)}</strong>${link('/',t.home)}${link('/about/',t.about)}${link('/products/',t.allProducts)}${link('/markets/',t.markets)}${link('/news/',t.news)}</div>
      <div class="footer-column"><strong>${esc(t.products)}</strong>${link('/products/seafood/',t.seafood)}${link('/products/fruits/',t.produce)}${link('/products/seasonal/',t.seasonal)}</div>
      <div class="footer-column"><strong>${esc(t.company)}</strong>${link('/contact/',t.contact)}${link('/legal/aviso-legal.html',t.legal)}${link('/legal/privacidad.html',t.privacy)}${link('/legal/cookies.html',t.cookies)}</div>
    </div><div class="footer-legal"><p>© 2026 EMPERIO TISS S.L. ${esc(t.regions)}</p><p>${esc(t.legalNote)}</p></div><div class="footer-bottom"><span>EMPERIO TISS S.L.</span><span>${esc(t.regions)}</span></div></div>`;
    existing.replaceWith(footer);
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',unifyFooter,{once:true});else unifyFooter();

  // Spanish Fish catalogue: keep the page operational even if the catalogue JSON is temporarily unavailable.
  if ((doc.documentElement.lang || '').toLowerCase().startsWith('es') && doc.body?.classList.contains('fish-catalog-pilot')) {
    const fallback = [
      ['dorada','Dorada','Sparus aurata','Pez de escama','Blanco / semigraso','fresh'],['lubina','Lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','fresh'],['merluza-pijota','Merluza / Pijota','Merluccius spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['mujol','Mújol','Mugil cephalus','Pez de escama','Blanco / semigraso','fresh'],['rape','Rape','Lophius spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['san-pedro','San Pedro','Zeus faber','Pez de escama','Blanco / semigraso','fresh'],['mero-amarillo','Mero amarillo','Epinephelus spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['pargo','Pargo','Lutjanus spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['denton','Dentón','Dentex dentex','Pez de escama','Blanco / semigraso','fresh'],['sama','Sama','Dentex spp.','Pez de escama','Blanco / semigraso','fresh'],['sargo','Sargo','Diplodus spp.','Pez de escama','Blanco / semigraso','fresh'],['rascacio','Rascacio','Scorpaena spp.','Pez de escama','Blanco / semigraso','fresh'],['caballa','Caballa','Scomber spp.','Pez de escama','Azul / graso','fresh|frozen'],['salmonete','Salmonete','Mullus spp.','Pez de escama','Azul / graso','fresh'],['atun','Atún','Thunnus spp.','Pez de escama','Azul / graso','fresh|frozen'],['pez-limon','Pez limón','Seriola dumerili','Pez de escama','Azul / graso','fresh'],['boqueron','Boquerón','Engraulis encrasicolus','Pez de escama','Azul / graso','fresh'],['pez-sable','Pez sable','Trichiurus spp.','Pescados especiales','Especial','fresh|frozen'],['pez-espada','Pez espada','Xiphias gladius','Pescados especiales','Especial','fresh|frozen']
    ].map(([id, commercialName, scientificName, group, type, condition]) => ({id,commercialName,scientificName,group,type,condition:condition.split('|'),origin:['Según disponibilidad'],faoZone:['Según origen'],calibre:['Según disponibilidad'],quality:['Especificación profesional'],format:['Según destino'],packaging:['Según mercado'],availability:['Según disponibilidad']}));
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (...args) => nativeFetch(...args).then(response => {
      if (String(args[0] || '').includes('/assets/data/fish-catalog-es.json') && !response.ok) return new Response(JSON.stringify({schemaVersion:'1.0',language:'es',products:fallback}), {status:200,headers:{'Content-Type':'application/json'}});
      return response;
    }).catch(error => {
      if (String(args[0] || '').includes('/assets/data/fish-catalog-es.json')) return new Response(JSON.stringify({schemaVersion:'1.0',language:'es',products:fallback}), {status:200,headers:{'Content-Type':'application/json'}});
      throw error;
    });
  }

  loadScript('/assets/js/global-core.js?v=20260823-taxonomy-5', 'etGlobalCore');
  loadScript('/assets/js/catalog-polish.js?v=20260823-catalogue-polish-1', 'etCatalogPolish');
})();
