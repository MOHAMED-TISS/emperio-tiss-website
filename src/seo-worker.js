import baseWorker from './index.js';
import { buildSeoHead, getSeoMeta } from './seo-metadata.js';
import { buildSocialHead, buildStructuredData, seoCopy } from './seo-copy.js';
import {
  bundleTag, cssName, isGroupableLink, parseBundleRequest, serveBundle,
  SUPERSEDED_STYLESHEETS, WORKER_STYLESHEETS
} from './css-bundle.js';

const isHtmlResponse = response =>
  (response.headers.get('content-type') || '').toLowerCase().includes('text/html');

// Hide the legacy static headers from the very first paint; header-universal.js replaces them.
const CRITICAL_STYLE = '<style data-eth-critical>body>.site-header,body>.p-header,body>#etLiquidHeader,body>header.et-liquid-header{visibility:hidden!important;position:fixed!important;top:0!important;left:0!important;right:0!important}</style>';


const relList = element => (element.getAttribute('rel') || '').toLowerCase().split(/\s+/).filter(Boolean);

// Title, description, sharing tags and JSON-LD come from one table (seo-copy.js):
// static copies in the pages are replaced so every language gets the same complete set.
class SeoCopyRewriter {
  constructor(copy, state) {
    this.copy = copy;
    this.state = state;
  }

  element(element) {
    const tag = element.tagName.toLowerCase();
    if (tag === 'title') {
      element.setInnerContent(this.copy.title);
      this.state.title = true;
    } else if (tag === 'meta' && (element.getAttribute('name') || '').toLowerCase() === 'description') {
      element.setAttribute('content', this.copy.description);
      this.state.description = true;
    } else if (tag === 'meta' || tag === 'script') {
      element.remove();
    }
  }
}

const escapeText = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = value => escapeText(value).replace(/"/g, '&quot;');

class SeoLinkSanitizer {
  element(element) {
    const rel = relList(element);
    const hreflang = element.getAttribute('hreflang');
    if (rel.includes('canonical') || rel.includes('icon') || (rel.includes('alternate') && hreflang)) {
      element.remove();
    }
  }
}

// Walks <head> in document order. Consecutive groupable stylesheet links are replaced by one
// bundle link at the same place; anything that could take part in the cascade between them
// (a <style>, a <script>, a stylesheet that cannot be grouped) closes the current group.
class HeadStylesheets {
  constructor(state) {
    this.state = state;
  }

  flushBefore(element) {
    const { run } = this.state;
    if (!run.length) return;
    element.before(bundleTag(run), { html: true });
    this.state.run = [];
  }

  element(element) {
    if (element.removed) return;
    const tag = element.tagName.toLowerCase();
    const { state } = this;

    if (tag === 'link') {
      const rel = relList(element);
      if (!rel.includes('stylesheet')) return;
      const name = cssName(element.getAttribute('href') || '');
      if (name && SUPERSEDED_STYLESHEETS.has(name) && !element.getAttribute('media')) {
        element.remove();
        return;
      }
      if (isGroupableLink([...element.attributes], rel)) {
        state.run.push(name);
        element.remove();
        return;
      }
      this.flushBefore(element);
      return;
    }

    if (tag === 'style' && element.hasAttribute('data-eth-critical')) {
      // the worker appends the same rule after its own stylesheets
      if (state.run.length) {
        element.replace(bundleTag(state.run), { html: true });
        state.run = [];
      } else {
        element.remove();
      }
      return;
    }

    if (tag === 'style' || tag === 'script' || tag === 'noscript' || tag === 'template') this.flushBefore(element);
  }
}

class SeoHeadAppender {
  constructor(meta, state) {
    this.meta = meta;
    this.state = state;
  }

  copyHead() {
    const { meta, state } = this;
    const copy = seoCopy(meta.language, meta.suffix);
    if (!copy) return '';
    return (state.title ? '' : `<title>${escapeText(copy.title)}</title>`) +
      (state.description ? '' : `<meta name="description" content="${escapeAttr(copy.description)}">`) +
      buildSocialHead(meta.language, meta.suffix, meta.canonical) +
      buildStructuredData(meta.language, meta.suffix, meta.canonical);
  }

  element(element) {
    element.onEndTag(end => {
      const { state } = this;
      const pending = state.run.length ? bundleTag(state.run) : '';
      state.run = [];
      end.before(
        pending +
        this.copyHead() +
        buildSeoHead(this.meta) +
        '<link rel="icon" type="image/svg+xml" sizes="any" href="/favicon-emblem-2026.svg?v=20261008-brand">' +
        '<script>(function(){try{var t=localStorage.getItem("et_theme_mode");document.documentElement.dataset.etTheme=(t==="dark"||t==="light")?t:"light"}catch(e){document.documentElement.dataset.etTheme="light"}})();</script>' +
        '<link rel="preconnect" href="https://fonts.googleapis.com">' +
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap">' +
        bundleTag(WORKER_STYLESHEETS) +
        CRITICAL_STYLE +
        '<script src="/assets/js/cookie-consent.js?v=20261007-6" defer></script>' +
        '<script src="/assets/js/whatsapp-floating.js?v=20261007-4" defer></script>' +
        '<script src="/assets/js/analytics-events.js?v=20261004-3" defer></script>' +
        '<script src="/assets/js/theme-mode.js?v=20261004-3" defer></script>' +
        '<script src="/assets/js/header-universal.js?v=20261009-eth-7" defer></script>' +
        '<script src="/assets/js/footer-terminal.js?v=20261009-footer-2" defer></script>',
        { html: true }
      );
    });
  }
}

export function normalizeSeoResponse(request, response) {
  if (request.method !== 'GET' || !response.ok || !isHtmlResponse(response)) return response;

  const pathname = new URL(request.url).pathname;
  if (pathname === '/private' || pathname.startsWith('/private/')) return response;

  const meta = getSeoMeta(pathname);
  if (!meta) return response;

  const state = { run: [] };
  const copy = seoCopy(meta.language, meta.suffix);
  let rewriter = new HTMLRewriter();
  if (copy) {
    const copyRewriter = new SeoCopyRewriter(copy, state);
    for (const selector of ['head title', 'head meta[name="description"]', 'head meta[property^="og:"]', 'head meta[name^="twitter:"]', 'head script[type="application/ld+json"]']) {
      rewriter = rewriter.on(selector, copyRewriter);
    }
  }
  return rewriter
    .on('link', new SeoLinkSanitizer())
    .on('head *', new HeadStylesheets(state))
    .on('head', new SeoHeadAppender(meta, state))
    .transform(response);
}

export default {
  async fetch(request, env, ctx) {
    const bundle = parseBundleRequest(new URL(request.url));
    if (bundle && (request.method === 'GET' || request.method === 'HEAD')) return serveBundle(request, env, bundle, ctx);
    const response = await baseWorker.fetch(request, env, ctx);
    return normalizeSeoResponse(request, response);
  }
};
