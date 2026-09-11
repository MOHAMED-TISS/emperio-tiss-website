# Arabic Language Separation Progress

Implementation is proceeding on `refactor/ar-language-separation-20260912` from `main` commit `406980be1fb2af567f7ef58487d7e9ac8c553c25`.

Completed in the current slice:
- restore branch `restore/pre-ar-separation-20260912`
- `public/assets/css/ar/{visual,home,pages,catalogues}.css`
- `public/assets/js/ar/loader.js`
- `public/assets/js/ar/es-normalizer.js`
- `public/assets/js/ar/content-geography.js`
- shared bootstrap routed to the AR loader
- shared core no longer directly references obsolete root AR runtime adapters
- regression contract in `tests/ar-language-separation.test.mjs`

The legacy root-level AR runtime files remain temporarily for compatibility and will be removed only after repository-wide dependency checks pass.
