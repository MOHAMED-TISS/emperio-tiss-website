/* =========================================================
   EMPERIO TISS
   FINAL INTERACTION SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     HEADER SCROLL EFFECT
  ======================================================= */

  const header = document.querySelector(".site-header");

  const updateHeader = () => {

    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

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

  const menuToggle =
    document.querySelector(".menu-toggle");

  const nav =
    document.querySelector(".nav");

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        nav.classList.toggle("active");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation"
          : "Open navigation"
      );

      menuToggle.textContent =
        isOpen ? "×" : "☰";

    });


    /* Close menu after clicking a link */

    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("active");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation"
        );

        menuToggle.textContent = "☰";

      });

    });


    /* Close when clicking outside */

    document.addEventListener("click", event => {

      if (
        nav.classList.contains("active") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {

        nav.classList.remove("active");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation"
        );

        menuToggle.textContent = "☰";

      }

    });

  }


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal, .fade-up, [data-reveal]"
    );

  if (
    revealElements.length &&
    "IntersectionObserver" in window
  ) {

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
          rootMargin: "0px 0px -50px 0px"
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
     ADD REVEAL EFFECTS AUTOMATICALLY
  ======================================================= */

  const animatedSections =
    document.querySelectorAll(
      ".section-head, .card, .market, .service-list article, .origin-card"
    );

  if (
    "IntersectionObserver" in window
  ) {

    const animationObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "visible"
            );

            animationObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px"
        }
      );


    animatedSections.forEach(
      (element, index) => {

        element.classList.add("fade-up");

        /*
          Small stagger without excessive delay.
        */

        element.style.transitionDelay =
          `${Math.min(index * 45, 250)}ms`;

        animationObserver.observe(
          element
        );

      }
    );

  }


  /* =======================================================
     SMOOTH INTERNAL LINKS
  ======================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
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
     ESCAPE KEY — CLOSE MOBILE NAV
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

        if (menuToggle) {

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
          );

          menuToggle.textContent = "☰";

        }

      }

    }
  );


  /* =======================================================
     PREVENT BROKEN HASH JUMP ON PAGE LOAD
  ======================================================= */

  if (window.location.hash) {

    const target =
      document.querySelector(
        window.location.hash
      );

    if (target) {

      setTimeout(() => {

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }, 100);

    }

  }

});
