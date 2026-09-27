/* Generate localized Home bodies from the approved ES markup and i18n copy. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const copy = JSON.parse(fs.readFileSync(path.join(root, 'public/assets/i18n/home.json'), 'utf8'));
const escape = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
for (const [index, lang] of ['en', 'fr', 'it', 'ar'].entries()) {
  const file = path.join(root, 'public', lang, 'index.html');
  const original = fs.readFileSync(file, 'utf8');
  let head = original.slice(0, original.indexOf('<body'));
  head = head.replace(/<link[^>]+Noto\+Naskh\+Arabic[^>]*>\s*/g, '');
  head = head.replace(/<link[^>]+href="\/assets\/css\/(?:ar\/)?home\.css[^>]*>\s*/g, '');
  head = head.replace('</head>', '<link rel="stylesheet" href="/assets/css/home.css?v=20260927-localized-homes">\n</head>');
  if(lang === 'ar') head = head.replace('</head>', '<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">\n</head>');
  let body = source.slice(source.indexOf('<body'));
  body = body.replace(/>([^<>]+)</g, (match, value) => {
    const key = value.trim();
    return copy.text[key] ? '>' + value.replace(key, copy.text[key][index]) + '<' : match;
  });
  body = body.replace(/(aria-label|alt)="([^"]*)"/g, (match, attr, value) => copy.text[value] ? `${attr}="${escape(copy.text[value][index])}"` : match);
  body = body.replace(/href="\/(about|products|markets|news|contact)([^" ]*)"/g, `href="/${lang}/$1$2"`);
  // Preserve cross-language destinations while localizing brand/home links.
  body = body.replace(/(<a\b[^>]*href=")\/("[^>]*>)(?!(?:ES|<span>·))/g, `$1/${lang}/$2`);
  body = body.replace(/(<a[^>]*href=")\/(?:en|fr|it|ar)\/" class="current">ES/g, '$1/" class="current">ES');
  body = body.replace(/class="current"/g, '').replace(new RegExp(`href="/${lang}/"(\\s*)>${lang.toUpperCase()}`, 'g'), `href="/${lang}/" class="current">${lang.toUpperCase()}`);
  body = body.replace(/home\.css\?v=[^" ]+/g, 'home.css?v=20260927-localized-homes')
    .replace('global.js?v=20260926-brand-foundation-2', 'global.js?v=20260927-localized-homes')
    .replace('home-modern.js?v=20260927-experience', 'home-modern.js?v=20260927-localized-homes');
  body = body.replace(/(<img\b[^>]*loading="lazy"[^>]*?) loading="lazy"/g, '$1');
  const scenes = {};
  for(const key of ['sea','fruit','vegetable']) scenes[key] = { ...copy.scenes[key], label:copy.scenes[key].label[index], description:copy.scenes[key].description[index] };
  body = body.replace('</main>', '</main>\n<script type="application/json" id="home-scenes">'+JSON.stringify(scenes).replace(/</g,'\\u003c')+'</script>');
  fs.writeFileSync(file, head + body);
}
