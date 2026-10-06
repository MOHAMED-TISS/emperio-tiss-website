import baseWorker from './index.js';
import { buildSeoHead, getSeoMeta } from './seo-metadata.js';

const isHtmlResponse = response =>
  (response.headers.get('content-type') || '').toLowerCase().includes('text/html');

class SeoLinkSanitizer {
  element(element) {
    const rel = (element.getAttribute('rel') || '').toLowerCase().split(/\s+/).filter(Boolean);
    const hreflang = element.getAttribute('hreflang');

    if (rel.includes('canonical') || rel.includes('icon') || (rel.includes('alternate') && hreflang)) {
      element.remove();
    }
  }
}

class SeoHeadAppender {
  constructor(meta) {
    this.meta = meta;
  }

  element(element) {
    element.append(
      buildSeoHead(this.meta) +
      '<link rel="icon" type="image/svg+xml" sizes="any" href="/favicon-emblem-2026.svg?v=2">' +
      '<script>(function(){try{var t=localStorage.getItem("et_theme_mode");document.documentElement.dataset.etTheme=(t==="dark"||t==="light")?t:"light"}catch(e){document.documentElement.dataset.etTheme="light"}})();</script>' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&display=swap">' +
      '<link rel="stylesheet" href="/assets/css/site-2026.css?v=20261003-4">' +
      '<link rel="stylesheet" href="/assets/css/theme-mode.css?v=20261004-3">' +
      '<link rel="stylesheet" href="/assets/css/header-liquid-v23.css?v=20261006-liquid-universal-6">' +
      '<link rel="stylesheet" href="/assets/css/footer-terminal.css?v=20261003-4">' +
      '<link rel="stylesheet" href="/assets/css/cookie-consent.css?v=20261004-5">' +
      '<script src="/assets/js/cookie-consent.js?v=20261004-5" defer></script>' +
      '<script src="/assets/js/analytics-events.js?v=20261004-3" defer></script>' +
      '<script src="/assets/js/theme-mode.js?v=20261004-3" defer></script>' +
      '<script src="/assets/js/header-universal.js?v=20261006-liquid-universal-6" defer></script>' +
      '<script src="/assets/js/footer-terminal.js?v=20261003-2" defer></script>',
      { html: true }
    );
  }
}

export function normalizeSeoResponse(request, response) {
  if (request.method !== 'GET' || !response.ok || !isHtmlResponse(response)) return response;

  const pathname = new URL(request.url).pathname;
  if (pathname === '/private' || pathname.startsWith('/private/')) return response;

  const meta = getSeoMeta(pathname);
  if (!meta) return response;

  return new HTMLRewriter()
    .on('link', new SeoLinkSanitizer())
    .on('head', new SeoHeadAppender(meta))
    .transform(response);
}

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    return normalizeSeoResponse(request, response);
  }
};
