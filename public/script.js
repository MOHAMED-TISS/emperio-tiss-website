/* =====================================================
   EMPERIO TISS
   Interactions & Scroll Animations
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     PAGE LOAD
  =================================================== */

  document.body.classList.add("loaded");


  /* ===================================================
     HEADER
  =================================================== */

  const header = document.querySelector(".site-header");

  const updateHeader = () => {

    if (!header) return;

    if (window.scrollY > 50) {
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


  /* ===================================================
     MOBILE MENU
  =================================================== */

  const menuButton =
    document.querySelector(".menu-toggle");

  const nav =
    document.querySelector(".nav");

  if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

      const open =
        nav.classList.toggle("open");

      menuButton.classList.toggle(
        "active",
        open
      );

      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

    });


    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        menuButton.classList.remove("active");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* ===================================================
     SCROLL REVEALS
  =================================================== */

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12,

          rootMargin:
            "0px 0px -60px 0px"
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


  /* ===================================================
     NETWORK LINES
  =================================================== */

  const network =
    document.querySelector(".network");

  if (network) {

    const lines =
      network.querySelectorAll(
        ".network-line"
      );

    if ("IntersectionObserver" in window) {

      const networkObserver =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              if (
                entry.isIntersecting
              ) {

                lines.forEach(
                  (line, index) => {

                    setTimeout(() => {

                      line.classList.add(
                        "visible"
                      );

                    }, index * 250);

                  }
                );

                networkObserver.unobserve(
                  entry.target
                );

              }

            });

          },
          {
            threshold: .25
          }
        );

      networkObserver.observe(network);

    } else {

      lines.forEach(line => {

        line.classList.add("visible");

      });

    }

  }


  /* ===================================================
     SMOOTH INTERNAL LINKS
  =================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

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

          const headerHeight =
            header
              ? header.offsetHeight
              : 0;

          const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });

        }
      );

    });


  /* ===================================================
     PARALLAX HERO
  =================================================== */

  const heroImage =
    document.querySelector(".hero-image");

  if (
    heroImage &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {

        if (ticking) return;

        window.requestAnimationFrame(() => {

          const scroll =
            window.scrollY;

          if (scroll < window.innerHeight) {

            heroImage.style.transform =
              `scale(1.08) translateY(${scroll * 0.12}px)`;

          }

          ticking = false;

        });

        ticking = true;

      },
      { passive: true }
    );

  }


  /* ===================================================
     FOOTER YEAR
  =================================================== */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* ===================================================
     IMAGE FALLBACK
  =================================================== */

  document
    .querySelectorAll("img")
    .forEach(image => {

      image.addEventListener(
        "error",
        () => {

          image.style.opacity = "0";

        }
      );

    });

});
