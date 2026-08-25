import fs from 'node:fs';
import assert from 'node:assert/strict';

const pages = [
  ['es', 'public/about/index.html', '/'],
  ['en', 'public/en/about/index.html', '/en/'],
  ['fr', 'public/fr/about/index.html', '/fr/'],
  ['it', 'public/it/about/index.html', '/it/'],
  ['ar', 'public/ar/about/index.html', '/ar/'],
];

for (const [lang, path] of pages) {
  const html = fs.readFileSync(path, 'utf8');
  assert.match(html, /es-page/, `${lang}: must use canonical ES page visual shell`);
  assert.match(html, /es-pages\.css/, `${lang}: must load ES page typography/styles`);
  assert.match(html, /Nuestra visión|Our vision|Notre vision|La nostra visione|رؤيتنا/i, `${lang}: missing vision section`);
  assert.match(html, /Misión|Mission|Missione|رسالتنا/i, `${lang}: missing mission section`);
  assert.match(html, /Valores|Values|Valeurs|Valori|قيم/i, `${lang}: missing values section`);
  assert.match(html, /medio ambiente|environment|environnement|ambiente|الموارد الطبيعية|ecosistemas|écosystèmes|ecosistemi/i, `${lang}: missing environmental responsibility section`);
  assert.match(html, /tecnolog|technology|technologie|التكنولوجيا/i, `${lang}: missing supporting technology reference`);
  assert.match(html, /Responsabilidad|Responsibility|Responsabilité|Responsabilità|المسؤولية/i, `${lang}: missing responsibility value`);
  assert.match(html, /info@emperio-tiss\.com/, `${lang}: missing contact CTA`);
}

console.log('about-content-regression: PASS');
