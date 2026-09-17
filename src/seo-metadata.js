const ORIGIN = 'https://emperio-tiss.com';

export const SEO_LANGUAGES = ['es', 'en', 'fr', 'it', 'ar'];

export const SEO_ROUTE_SUFFIXES = [
  '/',
  '/about/',
  '/products/',
  '/products/seafood/',
  '/products/seafood/fish/',
  '/products/seafood/shellfish/',
  '/products/seafood/cephalopods/',
  '/products/fruits/',
  '/products/vegetables/',
  '/products/seasonal/',
  '/markets/',
  '/news/',
  '/contact/'
];

const LANGUAGE_BASE = {
  es: '',
  en: '/en',
  fr: '/fr',
  it: '/it',
  ar: '/ar'
};

function parsePath(pathname) {
  const path = pathname || '/';

  for (const language of SEO_LANGUAGES) {
    const base = LANGUAGE_BASE[language];

    if (language === 'es') {
      if (SEO_ROUTE_SUFFIXES.includes(path)) return { language, suffix: path };
      continue;
    }

    if (path === `${base}/`) return { language, suffix: '/' };

    if (path.startsWith(`${base}/`)) {
      const suffix = path.slice(base.length);
      if (SEO_ROUTE_SUFFIXES.includes(suffix)) return { language, suffix };
    }
  }

  return null;
}

function localizedPath(language, suffix) {
  if (language === 'es') return suffix;
  if (suffix === '/') return `${LANGUAGE_BASE[language]}/`;
  return `${LANGUAGE_BASE[language]}${suffix}`;
}

export function getSeoMeta(pathname) {
  const parsed = parsePath(pathname);
  if (!parsed) return null;

  const localized = Object.fromEntries(
    SEO_LANGUAGES.map(language => [
      language,
      `${ORIGIN}${localizedPath(language, parsed.suffix)}`
    ])
  );

  return {
    canonical: localized[parsed.language],
    hreflang: {
      ...localized,
      'x-default': localized.es
    }
  };
}

export const isSeoCanonicalPath = pathname => Boolean(getSeoMeta(pathname));

export function buildSeoHead(meta) {
  if (!meta) return '';

  const canonical = `<link rel="canonical" href="${meta.canonical}">`;
  const alternates = Object.entries(meta.hreflang)
    .map(([language, href]) => `<link rel="alternate" hreflang="${language}" href="${href}">`)
    .join('');

  return `${canonical}${alternates}`;
}
