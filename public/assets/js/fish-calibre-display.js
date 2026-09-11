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

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav {
          width: 30px;
          height: 30px;
          min-width: 30px;
          min-height: 30px;
          margin: 0;
          padding: 0;
          border: 1px solid rgba(243,239,230,.55);
          background: rgba(7,30,53,.24);
          color: rgba(243,239,230,.94);
          box-shadow: 0 4px 12px rgba(0,0,0,.10);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          font-size: 17px;
          line-height: 1;
          transition: background .2s ease, border-color .2s ease, transform .2s ease, opacity .2s ease;
          opacity: .9;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:hover,
        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:focus-visible {
          background: rgba(7,30,53,.40);
          border-color: rgba(199,162,96,.72);
          color: #f3efe6;
          opacity: 1;
          outline: none;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:active {
          transform: translateY(-50%) scale(.95);
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav--prev {
          left: 8px;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav--next {
          right: 8px;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-counter {
          bottom: 8px;
          min-height: 21px;
          padding: 0 7px;
          border: 1px solid rgba(243,239,230,.24);
          background: rgba(7,30,53,.24);
          color: rgba(243,239,230,.94);
          box-shadow: 0 3px 10px rgba(0,0,0,.08);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
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
          max-width: calc(100% - 96px);
          margin: 0;
          padding: 3px 5px;
          border: 1px solid rgba(243,239,230,.20);
          border-radius: 999px;
          background: rgba(7,30,53,.18);
          box-shadow: 0 3px 10px rgba(0,0,0,.07);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transform: translateX(-50%);
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb {
          flex: 0 0 auto;
          width: 28px;
          height: 20px;
          min-width: 28px;
          min-height: 20px;
          padding: 0;
          border: 1px solid rgba(243,239,230,.32);
          border-radius: 4px;
          background: rgba(243,239,230,.10);
          opacity: .62;
          box-shadow: none;
          transition: opacity .2s ease, border-color .2s ease, transform .2s ease;
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb:hover {
          opacity: .9;
          border-color: rgba(243,239,230,.62);
          transform: translateY(-1px);
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb.is-active {
          opacity: 1;
          border-color: #c7a260;
          box-shadow: 0 0 0 1px rgba(199,162,96,.18);
        }

        body.fish-catalog-pilot .fish-catalog-card__thumb img {
          border-radius: 3px;
        }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }
})();
