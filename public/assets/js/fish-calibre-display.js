(() => {
  'use strict';

  // Calibre is rendered by the fish catalogue itself as "Según disponibilidad".
  // Do not observe or mutate the catalogue DOM: that caused an infinite
  // MutationObserver -> textContent -> MutationObserver loop and hung Chrome.

  // Desktop Fish catalogue switcher refinement.
  // Kept here because this file is already loaded by the Fish catalogue pages;
  // the rules are explicitly desktop-only and do not alter the mobile system.
  if (!document.getElementById('fish-desktop-switcher-system')) {
    const style = document.createElement('style');
    style.id = 'fish-desktop-switcher-system';
    style.textContent = `
      @media (min-width: 761px) {
        body.fish-catalog-pilot .fish-catalog-card__gallery {
          position: relative;
        }

        /* Soft editorial controls: smooth corners instead of circular UI bubbles. */
        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav {
          width: 34px;
          height: 28px;
          min-width: 34px;
          min-height: 28px;
          margin: 0;
          padding: 0;
          border: 1px solid rgba(243,239,230,.48);
          border-radius: 10px;
          background: rgba(7,30,53,.18);
          color: rgba(243,239,230,.92);
          box-shadow: 0 3px 10px rgba(0,0,0,.08);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
          font-size: 16px;
          font-weight: 400;
          line-height: 1;
          opacity: .86;
          transition: background .2s ease, border-color .2s ease, transform .2s ease, opacity .2s ease;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:hover,
        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:focus-visible {
          background: rgba(7,30,53,.34);
          border-color: rgba(199,162,96,.68);
          color: #f3efe6;
          opacity: 1;
          outline: none;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:active {
          transform: translateY(-50%) scale(.96);
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav--prev {
          left: 8px;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav--next {
          right: 8px;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-counter {
          bottom: 8px;
          min-height: 20px;
          padding: 0 7px;
          border: 1px solid rgba(243,239,230,.22);
          border-radius: 8px;
          background: rgba(7,30,53,.18);
          color: rgba(243,239,230,.92);
          box-shadow: 0 3px 9px rgba(0,0,0,.06);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
          font-size: 8px;
          line-height: 1;
          letter-spacing: .09em;
        }

        body.fish-catalog-pilot .fish-catalog-card__thumbs {
          position: absolute;
          left: 50%;
          bottom: 8px;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: auto;
          max-width: calc(100% - 112px);
          margin: 0;
          padding: 3px 5px;
          border: 1px solid rgba(243,239,230,.18);
          border-radius: 8px;
          background: rgba(7,30,53,.14);
          box-shadow: 0 3px 9px rgba(0,0,0,.05);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
          transform: translateX(-50%);
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb {
          flex: 0 0 auto;
          width: 26px;
          height: 19px;
          min-width: 26px;
          min-height: 19px;
          padding: 0;
          border: 1px solid rgba(243,239,230,.30);
          border-radius: 5px;
          background: rgba(243,239,230,.08);
          opacity: .58;
          box-shadow: none;
          transition: opacity .2s ease, border-color .2s ease, transform .2s ease;
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb:hover {
          opacity: .92;
          border-color: rgba(243,239,230,.60);
          transform: translateY(-1px);
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb.is-active {
          opacity: 1;
          border-color: #c7a260;
          box-shadow: 0 0 0 1px rgba(199,162,96,.16);
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb img {
          border-radius: 4px;
        }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }
})();
