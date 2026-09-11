(() => {
  'use strict';

  // Calibre is rendered by the fish catalogue itself as "Según disponibilidad".
  // Do not observe or mutate the catalogue DOM: that caused an infinite
  // MutationObserver -> textContent -> MutationObserver loop and hung Chrome.

  // Shared Fish catalogue switcher refinement.
  // Desktop and mobile controls use the same soft editorial language:
  // smooth rounded rectangles, translucency and restrained visual weight.
  if (!document.getElementById('fish-switcher-visual-system')) {
    const style = document.createElement('style');
    style.id = 'fish-switcher-visual-system';
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

      @media (max-width: 760px) {
        /* Same switcher language on mobile: smooth, compact, translucent controls. */
        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav {
          width: 34px !important;
          height: 28px !important;
          min-width: 34px !important;
          min-height: 28px !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 1px solid rgba(243,239,230,.48) !important;
          border-radius: 10px !important;
          background: rgba(7,30,53,.18) !important;
          color: rgba(243,239,230,.92) !important;
          box-shadow: 0 3px 10px rgba(0,0,0,.08) !important;
          backdrop-filter: blur(7px) !important;
          -webkit-backdrop-filter: blur(7px) !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          line-height: 1 !important;
          opacity: .86 !important;
          transition: background .2s ease, border-color .2s ease, transform .2s ease, opacity .2s ease !important;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:hover,
        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:focus-visible {
          background: rgba(7,30,53,.34) !important;
          border-color: rgba(199,162,96,.68) !important;
          color: #f3efe6 !important;
          opacity: 1 !important;
          outline: none !important;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav:active {
          transform: translateY(-50%) scale(.96) !important;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-counter {
          min-height: 20px !important;
          padding: 0 7px !important;
          border: 1px solid rgba(243,239,230,.22) !important;
          border-radius: 8px !important;
          background: rgba(7,30,53,.18) !important;
          color: rgba(243,239,230,.92) !important;
          box-shadow: 0 3px 9px rgba(0,0,0,.06) !important;
          backdrop-filter: blur(7px) !important;
          -webkit-backdrop-filter: blur(7px) !important;
          font-size: 8px !important;
        }
      }

      @media (max-width: 430px) {
        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav {
          width: 32px !important;
          height: 27px !important;
          min-width: 32px !important;
          min-height: 27px !important;
          border-radius: 9px !important;
          font-size: 15px !important;
        }

        body.fish-catalog-pilot .fish-catalog-card__media .fish-card-counter {
          min-height: 19px !important;
          padding-inline: 6px !important;
          border-radius: 7px !important;
          font-size: 7px !important;
        }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }
})();
