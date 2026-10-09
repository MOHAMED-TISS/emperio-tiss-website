import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Minimal HTMLRewriter stand-in: records the handlers the worker registers.
const handlers = [];
globalThis.HTMLRewriter = class {
  on(selector, handler) { handlers.push([selector, handler]); return this; }
  transform(response) { return response; }
};

const {
  buildBundle, bundleTag, cssName, isGroupableLink, parseBundleRequest, UNGROUPABLE, WORKER_STYLESHEETS
} = await import('../src/css-bundle.js');
const { normalizeSeoResponse } = await import('../src/seo-worker.js');

// Plays a <head> through the registered handlers and returns the resulting markup tokens.
const rewriteHead = elements => {
  handlers.length = 0;
  normalizeSeoResponse(
    new Request('https://emperio-tiss.com/about/'),
    new Response('<html></html>', { headers: { 'content-type': 'text/html' } })
  );
  const handler = selector => handlers.find(([s]) => s === selector)[1];
  const out = [];
  let endTag = null;
  handler('head').element({ onEndTag: fn => { endTag = fn; } });
  for (const { tag, attrs = {} } of elements) {
    const node = {
      tagName: tag, removed: false, slot: [],
      attributes: Object.entries(attrs),
      getAttribute: name => attrs[name] ?? null,
      hasAttribute: name => name in attrs,
      remove() { this.removed = true; },
      before(html) { this.slot.push(html); },
      replace(html) { this.removed = true; this.slot.push(html); }
    };
    if (tag === 'link') handler('link').element(node);
    handler('head *').element(node);
    out.push(...node.slot);
    if (!node.removed) out.push(`<${tag} ${attrs.href || ''}>`.replace(' >', '>'));
  }
  endTag({ before: html => out.push(html) });
  return out;
};

test('cssName only accepts stylesheets directly inside /assets/css/', () => {
  assert.equal(cssName('/assets/css/site-2026.css?v=1'), 'site-2026');
  assert.equal(cssName('https://emperio-tiss.com/assets/css/global.css'), 'global');
  assert.equal(cssName('/assets/css/ar/home.css'), null);
  assert.equal(cssName('https://fonts.googleapis.com/css2?family=Inter'), null);
  assert.equal(cssName('/assets/css/bundle.css?f=a,b'), null);
});

test('only plain stylesheet links are grouped', () => {
  assert.equal(isGroupableLink([['rel', 'stylesheet'], ['href', '/assets/css/global.css']], ['stylesheet']), true);
  assert.equal(isGroupableLink([['rel', 'stylesheet'], ['href', '/assets/css/global.css'], ['data-etUnifiedPages', 'true']], ['stylesheet']), true);
  assert.equal(isGroupableLink([['rel', 'stylesheet'], ['href', '/assets/css/global.css'], ['media', 'print']], ['stylesheet']), false);
  assert.equal(isGroupableLink([['rel', 'stylesheet'], ['href', '/assets/css/news-current.css']], ['stylesheet']), false);
  assert.equal(isGroupableLink([['rel', 'stylesheet'], ['href', '/assets/css/home-selection-marquee.css']], ['stylesheet']), false);
});

test('bundles inline local @imports in place and hoist remote ones', async () => {
  const files = {
    a: '@charset "UTF-8";\n@import url("/assets/css/b.css?v=1");\n.a{color:red}',
    b: '.b{color:blue}',
    c: "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');\n.c{}"
  };
  const css = await buildBundle(['a', 'c', 'missing'], async name => files[name] ?? null);
  assert.ok(css.startsWith("@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');"));
  assert.ok(css.indexOf('.b{color:blue}') < css.indexOf('.a{color:red}'), 'imported rules precede the importing file');
  assert.ok(css.indexOf('.a{color:red}') < css.indexOf('.c{}'), 'files keep their order');
  assert.doesNotMatch(css, /@charset/);
  assert.match(css, /missing\.css not found/);
});

test('bundle requests are validated', () => {
  const parse = query => parseBundleRequest(new URL(`https://emperio-tiss.com/assets/css/bundle.css${query}`));
  assert.deepEqual(parse('?f=global,pages'), ['global', 'pages']);
  assert.deepEqual(parse('?f=../secret'), []);
  assert.deepEqual(parse('?f=bundle'), []);
  assert.deepEqual(parse(`?f=${Array(41).fill('a').join(',')}`), []);
  assert.equal(parseBundleRequest(new URL('https://emperio-tiss.com/assets/css/global.css')), null);
});

test('worker groups consecutive static stylesheets in place and appends its own as one bundle', () => {
  const out = rewriteHead([
    { tag: 'link', attrs: { rel: 'stylesheet', href: '/assets/css/global.css' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: '/assets/css/pages.css' } },
    { tag: 'style' },
    { tag: 'link', attrs: { rel: 'stylesheet', href: '/assets/css/site-pages-unified.css', 'data-etUnifiedPages': 'true' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: '/assets/css/header-2026.css?v=1', 'data-eth-css': 'true' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: '/assets/css/footer-terminal.css' } },
    { tag: 'style', attrs: { 'data-eth-critical': '' } }
  ]);
  assert.equal(out[0], bundleTag(['global', 'pages']));
  assert.equal(out[1], '<style>');
  assert.equal(out[2], bundleTag(['site-pages-unified']), 'group closed where the static critical style was');
  const tail = out[3];
  assert.ok(tail.indexOf(bundleTag(WORKER_STYLESHEETS)) < tail.indexOf('data-eth-critical'));
  assert.doesNotMatch(out.join(''), /footer-terminal\.css(?!")/, 'footer-terminal.js re-adds it at runtime');
  assert.equal(out.join('').match(/header-2026\.css/g).length, 1, 'no duplicate header stylesheet');
});

test('stylesheets that cannot sit inside a bundle stay out of it', () => {
  const dir = 'public/assets/css';
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(dir, file), 'utf8');
    const name = file.replace(/\.css$/, '');
    if (/@import\s+(?:url\()?\s*["']?https?:/i.test(css)) assert.ok(UNGROUPABLE.has(name), `${file} imports a remote stylesheet`);
    // concatenation must not swallow the next file
    const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
    assert.doesNotMatch(stripped, /\/\*/, `${file} has an unclosed comment`);
  }
  // global.js moves these to the end of <head> by path
  const global = fs.readFileSync('public/assets/js/global.js', 'utf8');
  for (const name of ['home-selection-marquee', 'products-landing-2026', 'products-marquee-luxe', 'products-contrast-2026', 'produce-family-2026']) {
    assert.match(global, new RegExp(`/assets/css/${name}\\.css`));
    assert.ok(UNGROUPABLE.has(name), name);
  }
});

test('runtime loaders recognise stylesheets served inside a bundle', () => {
  const read = file => fs.readFileSync(`public/assets/js/${file}`, 'utf8');
  assert.match(read('global.js'), /link\[data-et-bundle\]/);
  assert.match(read('global.js'), /bundle\.css\?f=/);
  assert.match(read('header-universal.js'), /data-et-bundle~="\/assets\/css\/header-2026\.css"/);
  assert.match(read('footer-terminal.js'), /data-et-bundle~="\/assets\/css\/footer-terminal\.css"/);
});
