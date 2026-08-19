/* EMPERIO TISS — shared navigation, safe multi-page transitions */
(function () {
  "use strict";

  var CURTAIN_MS = 360;

  function ensureMenuStructure() {
    var button = document.getElementById("menuToggleBtn");
    if (!button) return null;

    button.classList.add("menu-ready");
    button.setAttribute("type", "button");
    button.setAttribute("aria-controls", "navOverlay");
    if (!button.getAttribute("aria-label")) button.setAttribute("aria-label", "Abrir menú");

    var spans = button.querySelectorAll("span");
    while (spans.length < 3) {
      button.appendChild(document.createElement("span"));
      spans = button.querySelectorAll("span");
    }
    return button;
  }

  function setMenuState(button, open) {
    document.body.classList.toggle("nav-open", open);
    if (button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      button.classList.toggle("is-open", open);
    }
  }

  function initProductVisualLayer() {
    if (!/\/products\//.test(window.location.pathname)) return;
    if (!document.querySelector('link[data-products-context]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/products-context.css";
      link.dataset.productsContext = "true";
      document.head.appendChild(link);
    }
  }

  function initPremiumPointer() {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    if (document.querySelector(".premium-pointer")) return;

    var style = document.createElement("style");
    style.textContent = `
      @media (pointer:fine) {
        body.et-pointer-enabled, body.et-pointer-enabled a, body.et-pointer-enabled button { cursor: none !important; }
        .premium-pointer {
          position: fixed;
          left: 0;
          top: 0;
          width: 9px;
          height: 9px;
          margin: -4.5px 0 0 -4.5px;
          border: 1px solid rgba(201,169,97,.9);
          border-radius: 50%;
          background: rgba(255,255,255,.18);
          box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 0 18px rgba(201,169,97,.18);
          pointer-events: none;
          z-index: 2147483647;
          opacity: .85;
          transform: scale(1);
          transition: transform .18s ease, width .18s ease, height .18s ease, opacity .18s ease, background .18s ease;
        }
        .premium-pointer.active {
          width: 28px;
          height: 28px;
          margin: -14px 0 0 -14px;
          transform: scale(1);
          background: rgba(201,169,97,.10);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add("et-pointer-enabled");

    var pointer = document.createElement("div");
    pointer.className = "premium-pointer";
    document.body.appendChild(pointer);

    document.addEventListener("mousemove", function (event) {
      pointer.style.left = event.clientX + "px";
      pointer.style.top = event.clientY + "px";
    }, { passive: true });

    document.addEventListener("mouseover", function (event) {
      var target = event.target.closest("a,button");
      if (target) pointer.classList.add("active");
    });

    document.addEventListener("mouseout", function (event) {
      var target = event.target.closest("a,button");
      if (target && !target.contains(event.relatedTarget)) pointer.classList.remove("active");
    });
  }

  function initCurtain() {
    var curtain = document.getElementById("pageCurtain");
    if (!curtain) {
      curtain = document.createElement("div");
      curtain.id = "pageCurtain";
      curtain.className = "page-curtain";
      document.body.appendChild(curtain);
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.classList.add("is-hidden");
      });
    });
    return curtain;
  }

  function isInternalLink(link) {
    if (!link || !link.href) return false;
    if (link.target === "_blank" || link.hasAttribute("download")) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(link.href)) return false;
    try {
      var url = new URL(link.href, window.location.href);
      return url.origin === window.location.origin;
    } catch (_) {
      return false;
    }
  }

  function initTransitions(curtain, menuButton) {
    document.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link || !isInternalLink(link)) return;

      var url = new URL(link.href, window.location.href);
      var samePage = url.pathname === window.location.pathname;

      if (samePage && url.hash) {
        setMenuState(menuButton, false);
        return;
      }

      if (samePage && !url.hash) {
        event.preventDefault();
        setMenuState(menuButton, false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      event.preventDefault();
      setMenuState(menuButton, false);
      curtain.classList.remove("is-hidden");
      curtain.classList.add("is-covering");

      window.setTimeout(function () {
        window.location.assign(url.href);
      }, CURTAIN_MS);
    });
  }

  function initNav(menuButton) {
    var overlay = document.getElementById("navOverlay");
    if (!menuButton || !overlay) return;

    menuButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setMenuState(menuButton, !document.body.classList.contains("nav-open"));
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) setMenuState(menuButton, false);
    });

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(menuButton, false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenuState(menuButton, false);
    });
  }

  function sanitizeLanguageLinks() {
    document.querySelectorAll('a[href*="/fr/"], a[href*="/ar/"]').forEach(function (link) {
      link.remove();
    });
  }

  function closeOnRestore() {
    window.addEventListener("pageshow", function () {
      var button = document.getElementById("menuToggleBtn");
      setMenuState(button, false);
      var curtain = document.getElementById("pageCurtain");
      if (curtain) {
        curtain.classList.remove("is-covering");
        curtain.classList.add("is-hidden");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    sanitizeLanguageLinks();
    initProductVisualLayer();
    initPremiumPointer();
    var menuButton = ensureMenuStructure();
    var curtain = initCurtain();
    initTransitions(curtain, menuButton);
    initNav(menuButton);
    closeOnRestore();
    setMenuState(menuButton, false);
  });
})();
