/* =========================================================
   EMPERIO TISS — MOTION ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     HEADER
  ----------------------------------------- */

  const header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 45) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* -----------------------------------------
     MOBILE MENU
  ----------------------------------------- */

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {

      const isOpen = nav.classList.toggle("active");

      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      toggle.textContent = isOpen ? "×" : "☰";

    });


    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("active");

        toggle.setAttribute(
          "aria-expanded",
          "false"
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

        toggle.textContent = "☰";

      }

    });

  }


  /* -----------------------------------------
     SCROLL REVEAL
  ----------------------------------------- */

  const revealElements = document.querySelectorAll(
    ".section-head, .card, .market, .service-list article, .two-col"
  );


  revealElements.forEach((element, index) => {

    element.classList.add("fade-up");

    const delay =
      Math.min((index % 6) * 70, 350);

    element.style.transitionDelay =
      `${delay}ms`;

  });


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              observer.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.12,
          rootMargin: "0px 0px -45px 0px"
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


  /* -----------------------------------------
     SMOOTH ANCHOR NAVIGATION
  ----------------------------------------- */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const id =
          link.getAttribute("href");

        if (!id || id === "#") {
          return;
        }

        const target =
          document.querySelector(id);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });


  /* -----------------------------------------
     CURRENT YEAR
  ----------------------------------------- */

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* -----------------------------------------
     ESCAPE → CLOSE MOBILE MENU
  ----------------------------------------- */

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

          toggle.textContent = "☰";

        }

      }

    }
  );

});
