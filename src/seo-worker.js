import baseWorker from './index.js';
import { buildSeoHead, getSeoMeta } from './seo-metadata.js';

const isHtmlResponse = response =>
  (response.headers.get('content-type') || '').toLowerCase().includes('text/html');

class SeoLinkSanitizer {
  element(element) {
    const rel = (element.getAttribute('rel') || '').toLowerCase().split(/\s+/).filter(Boolean);
    const hreflang = element.getAttribute('hreflang');

    if (rel.includes('canonical') || (rel.includes('alternate') && hreflang)) {
      element.remove();
    }
  }
}

class SeoHeadAppender {
  constructor(meta) {
    this.meta = meta;
  }

  element(element) {
    element.append(buildSeoHead(this.meta), { html: true });
  }
}

export function normalizeSeoResponse(request, response) {
  if (request.method !== 'GET' || !response.ok || !isHtmlResponse(response)) return response;

  const meta = getSeoMeta(new URL(request.url).pathname);
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
