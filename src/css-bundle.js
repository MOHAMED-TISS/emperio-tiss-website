// Stylesheet grouping for routed pages.
//
// A page used to load ~15–25 separate stylesheets: its own static links, the shared ones the SEO
// worker appends, and the ones global.js adds at runtime. The worker now serves consecutive
// stylesheets as one response (/assets/css/bundle.css?f=a,b,c) in exactly the same order, so the
// cascade is unchanged while the browser makes far fewer requests.
//
// Each bundle <link> lists its files in data-et-bundle; global.js, header-universal.js and
// footer-terminal.js treat those files as already loaded. global.js also requests the
// stylesheets it adds at runtime as one bundle.

export const BUNDLE_PATH = '/assets/css/bundle.css';
const MAX_FILES = 40;

// Files that must keep their own <link>:
// - news-current.css starts with a remote @import (Google Fonts), which is only valid at the top
//   of a stylesheet;
// - global.js moves these to the end of <head> at runtime to win the cascade, so they are
//   re-appended by path.
export const UNGROUPABLE = new Set([
  'news-current',
  'home-selection-marquee',
  'products-landing-2026',
  'products-marquee-luxe',
  'products-contrast-2026',
  'produce-family-2026',
  // footer-terminal.js re-adds it at runtime unless it is already loaded
  'footer-terminal'
]);

// Attributes a static stylesheet link may carry and still be grouped (global.js keys).
const GROUPABLE_ATTRIBUTES = new Set(['rel', 'href', 'type', 'data-etunifiedpages', 'data-etbrandinteriors']);

const SITE = 'https://emperio-tiss.com';

// "/assets/css/site-2026.css?v=1" -> "site-2026"; null for anything outside /assets/css/ root.
export const cssName = href => {
  try {
    const url = new URL(href, SITE);
    if (url.origin !== SITE) return null;
    const match = url.pathname.match(/^\/assets\/css\/([a-z0-9][a-z0-9.-]*)\.css$/i);
    return match && match[1] !== 'bundle' ? match[1] : null;
  } catch (_) {
    return null;
  }
};

export const cssPath = name => `/assets/css/${name}.css`;

export const isGroupableLink = (attributes, rel) => {
  if (rel.length !== 1 || rel[0] !== 'stylesheet') return false;
  for (const [name] of attributes) if (!GROUPABLE_ATTRIBUTES.has(name.toLowerCase())) return false;
  const href = attributes.find(([name]) => name.toLowerCase() === 'href')?.[1] || '';
  const name = cssName(href);
  return Boolean(name) && !UNGROUPABLE.has(name);
};

export const bundleTag = names => names.length === 1
  ? `<link rel="stylesheet" href="${cssPath(names[0])}" data-et-bundle="${cssPath(names[0])}">`
  : `<link rel="stylesheet" href="${BUNDLE_PATH}?f=${names.join(',')}" data-et-bundle="${names.map(cssPath).join(' ')}">`;

// Stylesheets the worker appends at the end of <head>, in cascade order, as one bundle. The
// critical inline style follows them (cookie-consent.css has no rule for the legacy headers it
// targets, so their relative order does not matter).
export const WORKER_STYLESHEETS = ['site-2026', 'theme-mode', 'scrollbar-editorial', 'whatsapp-floating', 'header-2026', 'cookie-consent'];

// Static copies of these are dropped: the worker's (or, for footer-terminal.css, the copy
// footer-terminal.js re-adds at runtime) comes later and decides the cascade.
export const SUPERSEDED_STYLESHEETS = new Set([...WORKER_STYLESHEETS, 'footer-terminal']);

// @import url("x") | url(x) | "x", optionally followed by media/supports conditions
const IMPORT_RE = /@import\s+(?:url\(\s*(["']?)(.*?)\1\s*\)|(["'])(.*?)\3)([^;]*);/g;
const CHARSET_RE = /@charset\s+["'][^"']*["']\s*;/gi;

// Concatenates the named stylesheets. Local @imports (/assets/css/*.css) are inlined where they
// stand; any other @import is hoisted to the top, where CSS requires it.
export const buildBundle = async (names, readCss) => {
  const hoisted = [];
  const expand = async (name, depth) => {
    const text = await readCss(name);
    if (text == null) return `/* ${name}.css not found */`;
    let out = '';
    let last = 0;
    const source = text.replace(CHARSET_RE, '');
    for (const match of source.matchAll(IMPORT_RE)) {
      out += source.slice(last, match.index);
      last = match.index + match[0].length;
      const imported = cssName(match[2] ?? match[4]);
      if (imported && !match[5].trim() && depth < 4) out += `\n${await expand(imported, depth + 1)}\n`;
      else hoisted.push(match[0]);
    }
    return out + source.slice(last);
  };
  const parts = [];
  for (const name of names) parts.push(`/* ${name}.css */\n${await expand(name, 0)}`);
  return (hoisted.length ? hoisted.join('\n') + '\n' : '') + parts.join('\n');
};

export const parseBundleRequest = url => {
  if (url.pathname !== BUNDLE_PATH) return null;
  const names = (url.searchParams.get('f') || '').split(',').filter(Boolean);
  if (!names.length || names.length > MAX_FILES) return [];
  return names.every(name => /^[a-z0-9][a-z0-9.-]*$/i.test(name) && name !== 'bundle') ? names : [];
};

// Built bundles are kept in the edge cache under the deployment id, so each one is built once per
// deploy and a new deploy never serves stale CSS. Browsers revalidate like any other asset.
export async function serveBundle(request, env, names, ctx) {
  if (!names.length) return new Response('Bad bundle request', { status: 400 });
  const origin = new URL(request.url).origin;
  const version = env.CF_VERSION_METADATA?.id || 'dev';
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const cacheKey = new Request(`${origin}${BUNDLE_PATH}?f=${names.join(',')}&deploy=${encodeURIComponent(version)}`);

  let body = null;
  let etag = null;
  const cached = cache ? await cache.match(cacheKey) : null;
  if (cached) {
    etag = cached.headers.get('etag');
    body = await cached.text();
  } else {
    const readCss = async name => {
      const response = await env.ASSETS.fetch(new Request(`${origin}${cssPath(name)}`));
      return response.ok ? response.text() : null;
    };
    body = await buildBundle(names, readCss);
    const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(body));
    etag = `"${[...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')}"`;
    if (cache) {
      const stored = new Response(body, {
        headers: { 'content-type': 'text/css; charset=utf-8', 'cache-control': 'public, max-age=31536000', etag }
      });
      const put = cache.put(cacheKey, stored);
      if (ctx?.waitUntil) ctx.waitUntil(put); else await put;
    }
  }

  const headers = {
    'content-type': 'text/css; charset=utf-8',
    'cache-control': 'public, max-age=0, must-revalidate',
    etag
  };
  if ((request.headers.get('if-none-match') || '') === etag) return new Response(null, { status: 304, headers });
  return new Response(request.method === 'HEAD' ? null : body, { headers });
}
