(() => {
  'use strict';

  if (window.__etAnalyticsEventsLoaded) return;
  window.__etAnalyticsEventsLoaded = true;

  const doc = document;
  const lang = (doc.documentElement.lang || 'es').slice(0,2).toLowerCase();

  const consented = () => Boolean(window.ETConsent?.analytics);

  const clean = (value, max=80) => String(value ?? '')
    .replace(/[\r\n\t]+/g,' ')
    .replace(/\s{2,}/g,' ')
    .trim()
    .slice(0,max);

  const normalizeProductCategory = (value) => {
    const v = String(value || '').toLowerCase();
    if (/sea|fish|pesc|marisc|cefal|seafood/.test(v)) return 'seafood';
    if (/frut|fruit/.test(v)) return 'fruits';
    if (/hort|veget/.test(v)) return 'vegetables';
    if (/tempor|season/.test(v)) return 'seasonal';
    return value ? 'other' : '';
  };

  // Strict allowlist: GA4 must never become a second CRM or receive free-form/PII fields.
  const eventParamAllowlist = Object.freeze({
    contact_form_submit: ['product_category','form_location'],
    whatsapp_click: ['link_location'],
    product_view: ['product_category','product_subcategory'],
    signature_request: ['interest_categories','form_location'],
    market_view: ['market_section']
  });

  const looksLikePII = (value) => {
    const text = String(value || '');
    return /@/.test(text) || /(?:\+?\d[\d\s().-]{6,}\d)/.test(text);
  };

  const safeParams = (name, params={}) => {
    const allowed = eventParamAllowlist[name];
    if (!allowed) return null;
    const out = {
      language: lang,
      page_path: location.pathname
    };
    for (const [key,value] of Object.entries(params)) {
      if (!allowed.includes(key) || value === undefined || value === null || value === '') continue;
      if (typeof value === 'boolean' || typeof value === 'number') {
        out[key] = value;
        continue;
      }
      const normalized = clean(value);
      if (!normalized || looksLikePII(normalized)) continue;
      out[key] = normalized;
    }
    return out;
  };

  const track = (name, params={}) => {
    if (!consented() || typeof window.gtag !== 'function') return false;
    const payload = safeParams(name, params);
    if (!payload) return false;
    window.gtag('event', name, payload);
    return true;
  };

  window.ETAnalytics = Object.freeze({ track });

  const pathParts = location.pathname.split('/').filter(Boolean);
  const stripLang = ['en','fr','it','ar'].includes(pathParts[0]) ? pathParts.slice(1) : pathParts;
  const route = '/' + stripLang.join('/');

  const productMeta = () => {
    const parts = stripLang;
    const i = parts.indexOf('products');
    if (i < 0) return null;
    const after = parts.slice(i+1);
    if (!after.length) return {category:'all_products',subcategory:''};
    const category = after[0] || '';
    const subcategory = after[1] || '';
    return {
      category: clean(category.replace(/-/g,'_'),40),
      subcategory: clean(subcategory.replace(/-/g,'_'),40)
    };
  };

  const sendInitialViews = () => {
    const pm = productMeta();
    if (pm && route.startsWith('/products')) {
      track('product_view', {
        product_category: pm.category,
        product_subcategory: pm.subcategory || undefined
      });
    }

    if (route === '/markets' || route.startsWith('/markets/')) {
      track('market_view', { market_section:'markets' });
    }
  };

  const onConsent = (event) => {
    if (event?.detail?.analytics) sendInitialViews();
  };
  window.addEventListener('et:consentchange', onConsent);

  if (consented()) sendInitialViews();

  doc.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (/wa\.me\//i.test(href) || /whatsapp/i.test(href)) {
      track('whatsapp_click', {
        link_location: link.closest('header') ? 'header' :
          link.closest('footer') ? 'footer' :
          link.closest('.home-private,.news-private') ? 'signature' : 'content'
      });
    }
  }, {capture:true});

  window.addEventListener('et:contact-success', (event) => {
    const d = event.detail || {};
    track('contact_form_submit', {
      product_category: normalizeProductCategory(d.product_category) || undefined,
      form_location: d.form_location || 'contact'
    });
  });

  window.addEventListener('et:signature-request-success', (event) => {
    const d = event.detail || {};
    track('signature_request', {
      interest_categories: Array.isArray(d.categories) ? d.categories.join('|') : d.categories || undefined,
      form_location: 'news_signature'
    });
  });
})();