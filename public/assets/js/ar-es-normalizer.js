(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  if (!body || !root.lang.toLowerCase().startsWith('ar')) return;

  const classMap = new Map([
    ['ar-page', 'es-page'],
    ['ar-container', 'es-container'],
    ['ar-hero', 'es-hero'],
    ['ar-hero-inner', 'es-container'],
    ['ar-kicker', 'es-kicker'],
    ['ar-lead', 'es-lead'],
    ['ar-section', 'es-section'],
    ['ar-grid', 'es-grid'],
    ['ar-label', 'es-label'],
    ['ar-copy', 'es-copy'],
    ['ar-cards', 'es-cards'],
    ['ar-card', 'es-card'],
    ['ar-cta', 'es-cta'],
    ['ar-actions', 'es-actions'],
    ['ar-btn', 'es-btn'],
    ['ar-footer', 'es-footer'],
    ['ar-footer-inner', 'es-container']
  ]);

  const catalogueTranslations = new Map([
    ['Fresco', 'طازج'],
    ['Fresh', 'طازج'],
    ['Congelado', 'مجمد'],
    ['Frozen', 'مجمد'],
    ['Pez de escama', 'أسماك ذات قشور'],
    ['Pez cartilaginoso', 'أسماك غضروفية'],
    ['Pescados especiales', 'أسماك خاصة'],
    ['Blanco / semigraso', 'أبيض / متوسط الدهن'],
    ['Azul / graso', 'أزرق / دهني'],
    ['Especial', 'خاص'],
    ['Mediterráneo / Atlántico', 'البحر المتوسط / الأطلسي'],
    ['Mediterráneo / Atlántico oriental', 'البحر المتوسط / الأطلسي الشرقي'],
    ['Atlántico / Mediterráneo', 'الأطلسي / البحر المتوسط'],
    ['Atlántico / abastecimiento español', 'الأطلسي / توريد عبر إسبانيا'],
    ['Abastecimiento internacional vía España', 'توريد دولي عبر إسبانيا'],
    ['Según disponibilidad', 'حسب التوفر'],
    ['Según destino', 'حسب الوجهة'],
    ['Según mercado', 'حسب السوق'],
    ['Según campaña y disponibilidad', 'حسب الموسم والتوفر'],
    ['Según programa de suministro', 'حسب برنامج التوريد'],
    ['Según especie y programa de suministro', 'حسب النوع وبرنامج التوريد'],
    ['Según origen', 'حسب المنشأ'],
    ['Según requisitos de la destinación', 'حسب متطلبات الوجهة'],
    ['Según requisitos del destino', 'حسب متطلبات الوجهة'],
    ['Especificación profesional', 'مواصفة مهنية'],
    ['Specifica professionale', 'مواصفة مهنية'],
    ['Familia', 'الفئة'],
    ['Tipo', 'النوع'],
    ['Estado', 'الحالة'],
    ['Origen', 'المنشأ'],
    ['Calibre', 'المقاس'],
    ['Calidad', 'الجودة'],
    ['Presentación', 'التقديم'],
    ['Embalaje', 'التعبئة'],
    ['Conditionnement', 'التعبئة'],
    ['Disponibilidad', 'التوفر'],
    ['According to availability', 'حسب التوفر'],
    ['According to destination', 'حسب الوجهة'],
    ['According to market', 'حسب السوق'],
    ['Túnez', 'تونس'],
    ['Tunisia', 'تونس'],
    ['Spain', 'إسبانيا'],
    ['España', 'إسبانيا'],
    ['Mediterraneo', 'البحر المتوسط'],
    ['Atlantico', 'الأطلسي']
  ]);

  const normalizeText = (value) => {
    const raw = String(value ?? '').trim();
    if (!raw) return raw;
    if (catalogueTranslations.has(raw)) return catalogueTranslations.get(raw);
    return raw
      .replace(/\bSegún disponibilidad\b/g, 'حسب التوفر')
      .replace(/\bSegún destino\b/g, 'حسب الوجهة')
      .replace(/\bSegún mercado\b/g, 'حسب السوق')
      .replace(/\bSegún campaña y disponibilidad\b/g, 'حسب الموسم والتوفر')
      .replace(/\bSegún programa de suministro\b/g, 'حسب برنامج التوريد')
      .replace(/\bSegún especie y programa de suministro\b/g, 'حسب النوع وبرنامج التوريد')
      .replace(/\bSegún origen\b/g, 'حسب المنشأ')
      .replace(/\bSegún requisitos del destino\b/g, 'حسب متطلبات الوجهة')
      .replace(/\bEspecificación profesional\b/g, 'مواصفة مهنية')
      .replace(/\bFresco\b/g, 'طازج')
      .replace(/\bCongelado\b/g, 'مجمد')
      .replace(/\bPez de escama\b/g, 'أسماك ذات قشور')
      .replace(/\bPez cartilaginoso\b/g, 'أسماك غضروفية')
      .replace(/\bPescados especiales\b/g, 'أسماك خاصة')
      .replace(/\bBlanco \/ semigraso\b/g, 'أبيض / متوسط الدهن')
      .replace(/\bAzul \/ graso\b/g, 'أزرق / دهني')
      .replace(/\bMediterráneo\b/g, 'البحر المتوسط')
      .replace(/\bAtlántico oriental\b/g, 'الأطلسي الشرقي')
      .replace(/\bAtlántico\b/g, 'الأطلسي')
      .replace(/\bTúnez\b/g, 'تونس')
      .replace(/\bEspaña\b/g, 'إسبانيا');
  };

  const injectStyle = () => {
    if (doc.getElementById('et-ar-page-polish')) return;
    const style = doc.createElement('style');
    style.id = 'et-ar-page-polish';
    style.textContent = `
      html[lang="ar"] main > :is(.ar-hero,.es-hero,.hero,.page-hero,[class*="hero"]) {
        min-height: 100vh !important;
      }
      html[lang="ar"] .es-hero,
      html[lang="ar"] .ar-hero,
      html[lang="ar"] .page-hero {
        padding-top: clamp(138px, 17vh, 188px) !important;
        padding-bottom: clamp(78px, 9vh, 110px) !important;
      }
      html[lang="ar"] .es-page .es-hero h1,
      html[lang="ar"] .ar-hero h1,
      html[lang="ar"] .page-hero h1,
      html[lang="ar"] .hero h1 {
        font-family: "Noto Sans Arabic", sans-serif !important;
        font-size: clamp(3rem, 7.4vw, 7.2rem) !important;
        line-height: .98 !important;
        letter-spacing: -.035em !important;
        text-align: right !important;
      }
      html[lang="ar"] .es-page .es-section,
      html[lang="ar"] .ar-section,
      html[lang="ar"] .es-cta,
      html[lang="ar"] .ar-cta {
        padding-block: clamp(78px, 9vw, 120px) !important;
      }
      html[lang="ar"] .es-page .es-grid,
      html[lang="ar"] .es-page .es-cards {
        gap: clamp(20px, 4vw, 64px) !important;
      }
      html[lang="ar"] .es-page .es-copy,
      html[lang="ar"] .es-page .es-lead,
      html[lang="ar"] .ar-copy,
      html[lang="ar"] .ar-lead {
        font-size: clamp(15px, 1.45vw, 17px) !important;
        line-height: 1.95 !important;
      }
      html[lang="ar"] .market-catalogue,
      html[lang="ar"] .fish-catalog {
        direction: rtl;
        text-align: right;
      }
      html[lang="ar"] .market-catalogue__head,
      html[lang="ar"] .fish-catalog .catalog-head {
        text-align: right;
      }
      html[lang="ar"] .market-catalogue__title,
      html[lang="ar"] .fish-catalog .catalog-head h2 {
        font-family: "Noto Sans Arabic", sans-serif !important;
        font-size: clamp(2.5rem, 5.8vw, 5.1rem) !important;
        line-height: 1.04 !important;
        letter-spacing: -.035em !important;
      }
      html[lang="ar"] .market-catalogue__intro,
      html[lang="ar"] .fish-catalog .catalog-head p,
      html[lang="ar"] .ar-fish-gcc-note {
        font-family: "Noto Sans Arabic", sans-serif !important;
        font-size: 15px !important;
        line-height: 1.95 !important;
      }
      html[lang="ar"] .market-catalogue-card__body,
      html[lang="ar"] .fish-catalog-card__body {
        text-align: right;
      }
      html[lang="ar"] .market-catalogue-card__name,
      html[lang="ar"] .fish-catalog-card__name {
        font-family: "Noto Sans Arabic", sans-serif !important;
        line-height: 1.2 !important;
      }
      html[lang="ar"] .market-catalogue-card__detail,
      html[lang="ar"] .fish-catalog-card__detail {
        line-height: 1.65 !important;
      }
      html[lang="ar"] .market-catalogue-card__media,
      html[lang="ar"] .fish-catalog-card__media {
        cursor: zoom-in !important;
        touch-action: manipulation;
      }
      html[lang="ar"] .et-ar-lightbox {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: grid;
        place-items: center;
        background: rgba(5, 12, 16, .96);
        padding: clamp(16px, 4vw, 40px);
      }
      html[lang="ar"] .et-ar-lightbox[hidden] { display: none; }
      html[lang="ar"] .et-ar-lightbox__img {
        display: block;
        max-width: min(92vw, 1500px);
        max-height: 84vh;
        width: auto;
        height: auto;
        object-fit: contain;
      }
      html[lang="ar"] .et-ar-lightbox__button {
        position: absolute;
        width: 46px;
        height: 46px;
        border: 1px solid rgba(255,255,255,.28);
        background: rgba(255,255,255,.08);
        color: #fff;
        border-radius: 50%;
        font: 400 25px/1 "DM Sans", sans-serif;
        cursor: pointer;
      }
      html[lang="ar"] .et-ar-lightbox__close { top: 18px; right: 18px; }
      html[lang="ar"] .et-ar-lightbox__prev { top: 50%; right: 18px; transform: translateY(-50%); }
      html[lang="ar"] .et-ar-lightbox__next { top: 50%; left: 18px; transform: translateY(-50%); }
      html[lang="ar"] .et-ar-lightbox__counter {
        position: absolute;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        color: rgba(255,255,255,.72);
        font: 500 11px/1 "DM Sans", sans-serif;
        direction: ltr;
      }
      @media (max-width: 800px) {
        html[lang="ar"] .es-page .es-grid { grid-template-columns: 1fr !important; }
        html[lang="ar"] .es-page .es-cards { grid-template-columns: 1fr !important; }
        html[lang="ar"] .market-catalogue__grid { grid-template-columns: 1fr !important; }
      }
    `;
    doc.head.appendChild(style);
  };

  const normalizeClasses = () => {
    if (body.classList.contains('home-page') || body.classList.contains('markets-current') || body.classList.contains('news-current')) return;
    body.classList.add('es-page');
    for (const [from, to] of classMap) {
      if (from === 'ar-page') continue;
      doc.querySelectorAll(`.${from}`).forEach((element) => element.classList.add(to));
    }
    doc.querySelectorAll('.ar-page').forEach((element) => element.classList.add('es-page'));
  };

  const translateCatalogue = () => {
    const selectors = [
      '.market-catalogue-card',
      '.fish-catalog-card',
      '.market-catalogue__count',
      '.market-catalogue__empty',
      '.fish-catalog__count'
    ];
    doc.querySelectorAll(selectors.join(',')).forEach((card) => {
      const walker = doc.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || /^(SCRIPT|STYLE)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest('[data-latin="true"], .scientific-name')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const translated = normalizeText(node.nodeValue);
        if (translated !== node.nodeValue.trim()) node.nodeValue = translated;
      });
    });
  };

  const getImages = (media) => {
    const raw = media?.getAttribute('data-images');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed.filter(Boolean);
      } catch (_) {}
    }
    const img = media?.querySelector('img');
    return img?.currentSrc || img?.src ? [img.currentSrc || img.src] : [];
  };

  let lightbox;
  let lightboxImages = [];
  let lightboxIndex = 0;
  let previousOverflow = '';
  let previousActiveElement = null;

  const ensureLightbox = () => {
    if (lightbox) return lightbox;
    lightbox = doc.createElement('div');
    lightbox.className = 'et-ar-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'عرض الصورة');
    lightbox.innerHTML = `
      <img class="et-ar-lightbox__img" alt="">
      <button class="et-ar-lightbox__button et-ar-lightbox__close" type="button" aria-label="إغلاق">×</button>
      <button class="et-ar-lightbox__button et-ar-lightbox__prev" type="button" aria-label="الصورة السابقة">‹</button>
      <button class="et-ar-lightbox__button et-ar-lightbox__next" type="button" aria-label="الصورة التالية">›</button>
      <span class="et-ar-lightbox__counter" aria-live="polite"></span>`;
    doc.body.appendChild(lightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.closest('.et-ar-lightbox__close')) closeLightbox();
    });
    lightbox.querySelector('.et-ar-lightbox__prev').addEventListener('click', () => stepLightbox(-1));
    lightbox.querySelector('.et-ar-lightbox__next').addEventListener('click', () => stepLightbox(1));
    return lightbox;
  };

  const renderLightbox = () => {
    const box = ensureLightbox();
    const image = box.querySelector('.et-ar-lightbox__img');
    const counter = box.querySelector('.et-ar-lightbox__counter');
    const src = lightboxImages[lightboxIndex] || '';
    image.src = src;
    image.alt = '';
    counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    const multiple = lightboxImages.length > 1;
    box.querySelector('.et-ar-lightbox__prev').hidden = !multiple;
    box.querySelector('.et-ar-lightbox__next').hidden = !multiple;
  };

  const openLightbox = (media) => {
    const images = getImages(media);
    if (!images.length) return;
    const box = ensureLightbox();
    lightboxImages = images;
    lightboxIndex = Math.max(0, Number(media.getAttribute('data-image-index') || 0));
    previousOverflow = body.style.overflow;
    previousActiveElement = doc.activeElement;
    body.style.overflow = 'hidden';
    renderLightbox();
    box.hidden = false;
    box.querySelector('.et-ar-lightbox__close').focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImages = [];
    lightboxIndex = 0;
    body.style.overflow = previousOverflow;
    if (previousActiveElement?.focus) previousActiveElement.focus({ preventScroll: true });
  };

  const stepLightbox = (delta) => {
    if (lightboxImages.length < 2) return;
    lightboxIndex = (lightboxIndex + delta + lightboxImages.length) % lightboxImages.length;
    renderLightbox();
  };

  const bindCatalogueInteractions = () => {
    if (doc.documentElement.dataset.arCatalogueInteraction === 'true') return;
    doc.documentElement.dataset.arCatalogueInteraction = 'true';
    doc.addEventListener('click', (event) => {
      if (lightbox && !lightbox.hidden && lightbox.contains(event.target)) return;
      const media = event.target.closest('.market-catalogue-card__media, .fish-catalog-card__media');
      if (!media || !root.lang.toLowerCase().startsWith('ar')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openLightbox(media);
    }, true);
    doc.addEventListener('keydown', (event) => {
      if (!lightbox || lightbox.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        stepLightbox(-1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stepLightbox(1);
      }
    }, true);
  };

  injectStyle();
  normalizeClasses();
  bindCatalogueInteractions();
  translateCatalogue();
  new MutationObserver(() => {
    normalizeClasses();
    translateCatalogue();
  }).observe(body, { childList: true, subtree: true });
})();
