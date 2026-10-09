import test from 'node:test';
import assert from 'node:assert/strict';

// Minimal HTMLRewriter stand-in: records the handlers the worker registers.
const handlers = [];
globalThis.HTMLRewriter = class {
  on(selector, handler) { handlers.push([selector, handler]); return this; }
  transform(response) { return response; }
};

const { normalizeSeoResponse } = await import('../src/seo-worker.js');

const fakeElement = attrs => {
  const state = { removed: false };
  return { state, getAttribute: name => attrs[name] ?? null, remove() { state.removed = true; } };
};

test('SEO worker drops static copies of the stylesheets it appends itself', () => {
  handlers.length = 0;
  normalizeSeoResponse(
    new Request('https://emperio-tiss.com/about/'),
    new Response('<html></html>', { headers: { 'content-type': 'text/html' } })
  );
  const link = handlers.find(([selector]) => selector === 'link')?.[1];
  assert.ok(link, 'link handler is registered');
  assert.ok(handlers.some(([selector]) => selector === 'style[data-eth-critical]'), 'static critical style is replaced by the appended one');

  const verdict = attrs => { const el = fakeElement(attrs); link.element(el); return el.state.removed; };
  assert.equal(verdict({ rel: 'stylesheet', href: '/assets/css/header-2026.css?v=20261008-eth-6' }), true);
  assert.equal(verdict({ rel: 'stylesheet', href: '/assets/css/site-2026.css' }), true);
  assert.equal(verdict({ rel: 'stylesheet', href: '/assets/css/global.css' }), false);
  assert.equal(verdict({ rel: 'stylesheet', href: '/assets/css/theme-mode.css', media: 'print' }), false);
  assert.equal(verdict({ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter' }), false);
  assert.equal(verdict({ rel: 'canonical', href: 'https://emperio-tiss.com/about/' }), true);
});
