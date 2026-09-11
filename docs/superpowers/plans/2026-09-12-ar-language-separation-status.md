# Arabic Language Separation Status

Branch: `refactor/ar-language-separation-20260912`

The current slice adds a dedicated Arabic CSS/JS namespace, routes the shared bootstrap through an AR loader, moves the AR normalizer under that namespace, and replaces broad commercial geography rewriting with a targeted MENA adapter. Legacy root-level AR adapters remain temporarily until zero-consumer checks pass.
