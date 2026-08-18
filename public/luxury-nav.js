/* =========================================================
   EMPERIO TISS — NAV OVERLAY + PAGE TRANSITIONS
   Vanilla JS, sin dependencias. Funciona en sitio multi-página
   (cada .html es una carga real, no SPA).
========================================================= */

(function () {
  "use strict";

  var CURTAIN_MS = 650; // debe coincidir con la transición CSS de .page-curtain

  /* ---------- 1. Cortina: ocultar al cargar la página ---------- */

  function initCurtain() {
    var curtain = document.getElementById("pageCurtain");
    if (!curtain) {
      curtain = document.createElement("div");
      curtain.id = "pageCurtain";
      curtain.className = "page-curtain";
      document.body.appendChild(curtain);
    }
    // fuerza reflow para que la transición de salida se dispare
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.classList.add("is-hidden");
      });
    });
    return curtain;
  }

  /* ---------- 2. Interceptar clics en enlaces internos ---------- */

  function isInternalLink(link) {
    if (!link || !link.href) return false;
    if (link.target === "_blank") return false;
    if (link.hasAttribute("download")) return false;
    if (link.href.indexOf("mailto:") === 0) return false;
    if (link.href.indexOf("tel:") === 0) return false;
    var url = new URL(link.href, window.location.href);
    return url.origin === window.location.origin;
  }

 function initPageTransitions(curtain) {
  document.addEventListener("click", function (e) {

    var link = e.target.closest("a");

    if (!link || !isInternalLink(link)) return;

    var url = new URL(link.href, window.location.href);

    // No interceptar anclas de la misma página
    if (
      url.pathname === window.location.pathname &&
      url.hash
    ) {
      return;
    }

    e.preventDefault();

    /* =====================================================
       CLOSE MENU FIRST
    ===================================================== */

    document.body.classList.remove("nav-open");

    var menuButton =
      document.getElementById("menuToggleBtn");

    if (menuButton) {
      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "Open menu"
      );
    }


    /* =====================================================
       PAGE TRANSITION
    ===================================================== */

    curtain.classList.remove("is-hidden");
    curtain.classList.add("is-covering");


    /* =====================================================
       NAVIGATE
    ===================================================== */

    window.setTimeout(function () {
      window.location.href = link.href;
    }, CURTAIN_MS);

  });
}

  /* ---------- 3. Overlay de navegación pantalla completa ---------- */

  function initNavOverlay() {
    var trigger = document.getElementById("menuToggleBtn");
    var overlay = document.getElementById("navOverlay");
    if (!trigger || !overlay) return;

    trigger.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
      var isOpen = document.body.classList.contains("nav-open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // cerrar con ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.body.classList.remove("nav-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    // cerrar al hacer clic en un link del overlay (la cortina de transición
    // ya se encarga de la salida visual)
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Init ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var curtain = initCurtain();
    initPageTransitions(curtain);
    initNavOverlay();
  });
})();
