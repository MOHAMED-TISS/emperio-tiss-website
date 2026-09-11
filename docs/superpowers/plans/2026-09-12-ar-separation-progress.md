# Arabic Language Separation Progress

Current implementation branch: `refactor/ar-language-separation-20260912`.

Completed slice:
- restore checkpoint `restore/pre-ar-separation-20260912`
- dedicated `public/assets/css/ar/` layer
- dedicated `public/assets/js/ar/` loader and adapters
- targeted MENA commercial geography handling
- shared bootstrap routed through the AR loader
- obsolete direct AR runtime references removed from `global-core.js`
- regression contract in `tests/ar-language-separation.test.mjs`

Legacy root-level AR adapters remain temporarily for rollback compatibility and will only be deleted after dependency checks pass.
