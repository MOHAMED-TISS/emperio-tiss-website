(() => {
  'use strict';
  // Calibre is rendered by the fish catalogue itself as "Según disponibilidad".
  // Do not observe or mutate the catalogue DOM: that caused an infinite
  // MutationObserver -> textContent -> MutationObserver loop and hung Chrome.
})();