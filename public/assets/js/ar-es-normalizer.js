(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  if (!body || !root.lang.toLowerCase().startsWith('ar')) return;

  const classMap = new Map([
    ['ar-page','es-page'],['ar-container','es-container'],['ar-hero','es-hero'],['ar-hero-inner','es-container'],
    ['ar-kicker','es-kicker'],['ar-lead','es-lead'],['ar-section','es-section'],['ar-grid','es-grid'],['ar-label','es-label'],
    ['ar-copy','es-copy'],['ar-cards','es-cards'],['ar-card','es-card'],['ar-cta','es-cta'],['ar-actions','es-actions'],
    ['ar-btn','es-btn'],['ar-footer','es-footer'],['ar-footer-inner','es-container']
  ]);

  const translations = new Map([
    ['Legal','قانوني'],['Legal notice','إشعار قانوني'],['Privacy','الخصوصية'],['Cookies','ملفات تعريف الارتباط'],
    ['EUROPE · AFRICA · MEDITERRANEAN · MIDDLE EAST','أوروبا · أفريقيا · المتوسط · الشرق الأوسط'],
    ['Europe · Africa · Mediterranean · Middle East','أوروبا · أفريقيا · المتوسط · الشرق الأوسط'],
    ['Fresco','طازج'],['Fresh','طازج'],['Congelado','مجمد'],['Frozen','مجمد'],
    ['Pez de escama','أسماك ذات قشور'],['Pez cartilaginoso','أسماك غضروفية'],['Pescados especiales','أسماك خاصة'],
    ['Blanco / semigraso','أبيض / متوسط الدهن'],['Azul / graso','أزرق / دهني'],['Especial','خاص'],
    ['Mediterráneo / Atlántico','البحر المتوسط / الأطلسي'],['Mediterráneo / Atlántico oriental','البحر المتوسط / الأطلسي الشرقي'],
    ['Atlántico / Mediterráneo','الأطلسي / البحر المتوسط'],['Atlántico / abastecimiento español','الأطلسي / توريد عبر إسبانيا'],
    ['Abastecimiento internacional vía España','توريد دولي عبر إسبانيا'],['Según disponibilidad','حسب التوفر'],['Según destino','حسب الوجهة'],
    ['Según mercado','حسب السوق'],['Según campaña y disponibilidad','حسب الموسم والتوفر'],['Según programa de suministro','حسب برنامج التوريد'],
    ['Según especie y programa de suministro','حسب النوع وبرنامج التوريد'],['Según origen','حسب المنشأ'],['Según requisitos del destino','حسب متطلبات الوجهة'],
    ['Según requisitos de la destinación','حسب متطلبات الوجهة'],['Especificación profesional','مواصفة مهنية'],['Specifica professionale','مواصفة مهنية'],
    ['Familia','الفئة'],['Tipo','النوع'],['Estado','الحالة'],['Origen','المنشأ'],['Calibre','المقاس'],['Calidad','الجودة'],
    ['Presentación','التقديم'],['Embalaje','التعبئة'],['Conditionnement','التعبئة'],['Disponibilidad','التوفر'],
    ['According to availability','حسب التوفر'],['According to destination','حسب الوجهة'],['According to market','حسب السوق'],
    ['Túnez','تونس'],['Tunisia','تونس'],['Spain','إسبانيا'],['España','إسبانيا'],['Mediterraneo','البحر المتوسط'],['Atlantico','الأطلسي']
  ]);

  const normalizeText = (value) => {
    const raw = String(value ?? '').trim();
    if (!raw || translations.has(raw)) return translations.get(raw) || raw;
    return raw
      .replace(/\bFresco\b|\bFresh\b/g,'طازج').replace(/\bCongelado\b|\bFrozen\b/g,'مجمد')
      .replace(/\bPez de escama\b/g,'أسماك ذات قشور').replace(/\bPez cartilaginoso\b/g,'أسماك غضروفية')
      .replace(/\bPescados especiales\b/g,'أسماك خاصة').replace(/\bBlanco \/ semigraso\b/g,'أبيض / متوسط الدهن')
      .replace(/\bAzul \/ graso\b/g,'أزرق / دهني').replace(/\bMediterráneo\b/g,'البحر المتوسط')
      .replace(/\bAtlántico oriental\b/g,'الأطلسي الشرقي').replace(/\bAtlántico\b/g,'الأطلسي')
      .replace(/\bSegún disponibilidad\b/g,'حسب التوفر').replace(/\bSegún destino\b/g,'حسب الوجهة')
      .replace(/\bSegún mercado\b/g,'حسب السوق').replace(/\bSegún campaña y disponibilidad\b/g,'حسب الموسم والتوفر')
      .replace(/\bSegún programa de suministro\b/g,'حسب برنامج التوريد').replace(/\bSegún especie y programa de suministro\b/g,'حسب النوع وبرنامج التوريد')
      .replace(/\bSegún origen\b/g,'حسب المنشأ').replace(/\bSegún requisitos del destino\b/g,'حسب متطلبات الوجهة')
      .replace(/\bEspecificación profesional\b/g,'مواصفة مهنية').replace(/\bTúnez\b/g,'تونس').replace(/\bEspaña\b/g,'إسبانيا');
  };

  const injectStyle = () => {
    if (doc.getElementById('et-ar-page-polish')) return;
    const style = doc.createElement('style');
    style.id = 'et-ar-page-polish';
    style.textContent = `
      html[lang="ar"] main > :is(.ar-hero,.es-hero,.hero,.page-hero,.current-stage), html[lang="ar"] #newsApp > :first-child { min-height:100vh !important; }
      html[lang="ar"] :is(.es-hero,.ar-hero,.page-hero,.current-stage) { padding-top:clamp(138px,17vh,188px) !important; padding-bottom:clamp(78px,9vh,110px) !important; }
      html[lang="ar"] :is(.es-hero,.ar-hero,.page-hero,.hero,.current-stage) :is(h1,h2) { font-family:"Noto Sans Arabic",sans-serif !important; font-size:clamp(3rem,7.4vw,7.2rem) !important; line-height:.98 !important; letter-spacing:-.035em !important; text-align:right !important; }
      html[lang="ar"] :is(.es-section,.ar-section,.es-cta,.ar-cta) { padding-block:clamp(78px,9vw,120px) !important; }
      html[lang="ar"] .es-page :is(.es-copy,.es-lead), html[lang="ar"] :is(.ar-copy,.ar-lead) { font-size:clamp(15px,1.45vw,17px) !important; line-height:1.95 !important; }
      html[lang="ar"] :is(.market-catalogue,.fish-catalog) { direction:rtl; text-align:right; }
      html[lang="ar"] :is(.market-catalogue__head,.fish-catalog .catalog-head) { text-align:right; }
      html[lang="ar"] :is(.market-catalogue__title,.fish-catalog .catalog-head h2) { font-family:"Noto Sans Arabic",sans-serif !important; font-size:clamp(2.5rem,5.8vw,5.1rem) !important; line-height:1.04 !important; letter-spacing:-.035em !important; }
      html[lang="ar"] :is(.market-catalogue__intro,.fish-catalog .catalog-head p,.ar-fish-gcc-note) { font-family:"Noto Sans Arabic",sans-serif !important; font-size:15px !important; line-height:1.95 !important; }
      html[lang="ar"] :is(.market-catalogue-card__body,.fish-catalog-card__body) { text-align:right; }
      html[lang="ar"] :is(.market-catalogue-card__name,.fish-catalog-card__name) { font-family:"Noto Sans Arabic",sans-serif !important; line-height:1.2 !important; }
      html[lang="ar"] :is(.market-catalogue-card__detail,.fish-catalog-card__detail) { line-height:1.65 !important; }
      html[lang="ar"] :is(.market-catalogue-card__media,.fish-catalog-card__media) { cursor:zoom-in !important; touch-action:manipulation; }
      html[lang="ar"] .et-ar-lightbox { position:fixed; inset:0; z-index:2147483647; display:grid; place-items:center; background:rgba(5,12,16,.96); padding:clamp(16px,4vw,40px); }
      html[lang="ar"] .et-ar-lightbox[hidden] { display:none; }
      html[lang="ar"] .et-ar-lightbox__img { max-width:min(92vw,1500px); max-height:84vh; width:auto; height:auto; object-fit:contain; }
      html[lang="ar"] .et-ar-lightbox__button { position:absolute; width:46px; height:46px; border:1px solid rgba(255,255,255,.28); background:rgba(255,255,255,.08); color:#fff; border-radius:50%; font:400 25px/1 "DM Sans",sans-serif; cursor:pointer; }
      html[lang="ar"] .et-ar-lightbox__close { top:18px; right:18px; } html[lang="ar"] .et-ar-lightbox__prev { top:50%; right:18px; transform:translateY(-50%); } html[lang="ar"] .et-ar-lightbox__next { top:50%; left:18px; transform:translateY(-50%); }
      html[lang="ar"] .et-ar-lightbox__counter { position:absolute; left:50%; bottom:20px; transform:translateX(-50%); color:rgba(255,255,255,.72); font:500 11px/1 "DM Sans",sans-serif; direction:ltr; }
      @media (max-width:800px) { html[lang="ar"] .es-page .es-grid { grid-template-columns:1fr !important; } html[lang="ar"] .es-page .es-cards { grid-template-columns:1fr !important; } html[lang="ar"] .market-catalogue__grid { grid-template-columns:1fr !important; } }
    `;
    doc.head.appendChild(style);
  };

  const normalizeClasses = () => {
    if (body.classList.contains('home-page') || body.classList.contains('markets-current') || body.classList.contains('news-current')) return;
    body.classList.add('es-page');
    for (const [from,to] of classMap) {
      doc.querySelectorAll(`.${from}`).forEach((el) => el.classList.add(to));
    }
  };

  const translateVisibleText = () => {
    const roots = doc.querySelectorAll('.market-catalogue-card,.fish-catalog-card,.market-catalogue__count,.market-catalogue__empty,.fish-catalog__count,.es-footer,.nav-overlay-foot');
    roots.forEach((scope) => {
      const walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT, { acceptNode(node) {
        const parent = node.parentElement;
        if (!node.nodeValue?.trim() || !parent || /^(SCRIPT|STYLE)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-latin="true"],.scientific-name')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }});
      const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => { const next=normalizeText(node.nodeValue); if(next!==node.nodeValue.trim()) node.nodeValue=next; });
    });
  };

  const getImages = (media) => {
    const raw=media?.getAttribute('data-images');
    if(raw){ try{const parsed=JSON.parse(raw); if(Array.isArray(parsed)&&parsed.length)return parsed.filter(Boolean);}catch(_){} }
    const img=media?.querySelector('img');
    return img?.currentSrc||img?.src ? [img.currentSrc||img.src] : [];
  };

  let lightbox=null, images=[], index=0, previousOverflow='', previousActive=null;
  const ensureLightbox=()=>{
    if(lightbox)return lightbox;
    lightbox=doc.createElement('div'); lightbox.className='et-ar-lightbox'; lightbox.hidden=true; lightbox.setAttribute('role','dialog'); lightbox.setAttribute('aria-modal','true'); lightbox.setAttribute('aria-label','عرض الصورة');
    lightbox.innerHTML='<img class="et-ar-lightbox__img" alt=""><button class="et-ar-lightbox__button et-ar-lightbox__close" type="button" aria-label="إغلاق">×</button><button class="et-ar-lightbox__button et-ar-lightbox__prev" type="button" aria-label="الصورة السابقة">‹</button><button class="et-ar-lightbox__button et-ar-lightbox__next" type="button" aria-label="الصورة التالية">›</button><span class="et-ar-lightbox__counter" aria-live="polite"></span>';
    doc.body.appendChild(lightbox);
    lightbox.addEventListener('click',(e)=>{if(e.target===lightbox||e.target.closest('.et-ar-lightbox__close'))closeLightbox();});
    lightbox.querySelector('.et-ar-lightbox__prev').addEventListener('click',()=>step(-1));
    lightbox.querySelector('.et-ar-lightbox__next').addEventListener('click',()=>step(1));
    return lightbox;
  };
  const renderLightbox=()=>{const box=ensureLightbox(); box.querySelector('.et-ar-lightbox__img').src=images[index]||''; box.querySelector('.et-ar-lightbox__counter').textContent=`${index+1} / ${images.length}`; const multi=images.length>1; box.querySelector('.et-ar-lightbox__prev').hidden=!multi; box.querySelector('.et-ar-lightbox__next').hidden=!multi;};
  const openLightbox=(media)=>{images=getImages(media); if(!images.length)return; const box=ensureLightbox(); index=Math.max(0,Number(media.getAttribute('data-image-index')||0)); previousOverflow=body.style.overflow; previousActive=doc.activeElement; body.style.overflow='hidden'; renderLightbox(); box.hidden=false; box.querySelector('.et-ar-lightbox__close').focus({preventScroll:true});};
  const closeLightbox=()=>{if(!lightbox||lightbox.hidden)return; lightbox.hidden=true; images=[]; index=0; body.style.overflow=previousOverflow; if(previousActive?.focus)previousActive.focus({preventScroll:true});};
  const step=(delta)=>{if(images.length<2)return; index=(index+delta+images.length)%images.length; renderLightbox();};
  const bindInteractions=()=>{
    if(root.dataset.arCatalogueInteraction==='true')return; root.dataset.arCatalogueInteraction='true';
    doc.addEventListener('click',(e)=>{if(lightbox&&!lightbox.hidden&&lightbox.contains(e.target))return; const media=e.target.closest('.market-catalogue-card__media,.fish-catalog-card__media'); if(!media)return; const control=e.target.closest('button,a,[role="button"]'); if(control&&control!==media&&media.contains(control))return; e.preventDefault(); e.stopImmediatePropagation(); openLightbox(media);},true);
    doc.addEventListener('keydown',(e)=>{if(!lightbox||lightbox.hidden)return; if(e.key==='Escape'){e.preventDefault();closeLightbox();} else if(e.key==='ArrowRight'){e.preventDefault();step(-1);} else if(e.key==='ArrowLeft'){e.preventDefault();step(1);}},true);
  };

  injectStyle(); normalizeClasses(); bindInteractions(); translateVisibleText();
  new MutationObserver(()=>{normalizeClasses();translateVisibleText();}).observe(body,{childList:true,subtree:true});
})();
