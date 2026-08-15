/* =========================================================
   EMPERIO TISS — INTERACTION ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     HERO INTRO
  ======================================================= */

  const hero = document.querySelector(".hero");

  if (hero) {
    requestAnimationFrame(() => {
      hero.classList.add("loaded");
    });
  }


  /* =======================================================
     HEADER
  ======================================================= */

  const header = document.querySelector(".site-header");

  const updateHeader = () => {

    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 45
    );

  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );


  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  const toggle =
    document.querySelector(".menu-toggle");

  const nav =
    document.querySelector(".nav");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {

      const open =
        nav.classList.toggle("active");

      toggle.setAttribute(
        "aria-expanded",
        String(open)
      );

      toggle.setAttribute(
        "aria-label",
        open
          ? "Close navigation"
          : "Open navigation"
      );

      toggle.textContent =
        open ? "×" : "☰";

    });


    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("active");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        toggle.setAttribute(
          "aria-label",
          "Open navigation"
        );

        toggle.textContent = "☰";

      });

    });


    document.addEventListener("click", event => {

      if (
        nav.classList.contains("active") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {

        nav.classList.remove("active");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        toggle.setAttribute(
          "aria-label",
          "Open navigation"
        );

        toggle.textContent = "☰";

      }

    });

  }


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements = document.querySelectorAll(
    ".section-head, " +
    ".card, " +
    ".market, " +
    ".service-list article, " +
    ".two-col, " +
    ".bridge-node, " +
    ".bridge-center"
  );


  revealElements.forEach((element, index) => {

    element.classList.add("fade-up");

    const delay =
      Math.min(
        (index % 5) * 90,
        360
      );

    element.style.transitionDelay =
      `${delay}ms`;

  });


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("visible");

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold:0.12,
          rootMargin:"0px 0px -50px 0px"
        }
      );


    revealElements.forEach(element => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }


  /* =======================================================
     SMOOTH INTERNAL LINKS
  ======================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const id =
          link.getAttribute("href");

        if (
          !id ||
          id === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(id);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });

      });

    });


  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =======================================================
     ESCAPE → CLOSE MENU
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        nav &&
        nav.classList.contains("active")
      ) {

        nav.classList.remove("active");

        if (toggle) {

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );

          toggle.setAttribute(
            "aria-label",
            "Open navigation"
          );

          toggle.textContent = "☰";

        }

      }

    }
  );

});
