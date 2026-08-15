/* =========================================================
   EMPERIO TISS
   Global Interaction & Animation System
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     PAGE LOAD
  ------------------------------------------------------- */

  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });


  /* -------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------- */

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      nav.classList.toggle("nav-open", !isOpen);

      document.body.classList.toggle(
        "menu-open",
        !isOpen
      );

    });


    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        nav.classList.remove("nav-open");

        document.body.classList.remove(
          "menu-open"
        );

      });

    });

  }


  /* -------------------------------------------------------
     SCROLL REVEAL
  ------------------------------------------------------- */

  const revealElements = document.querySelectorAll(
    ".reveal, " +
    ".product-card, " +
    ".market, " +
    ".step, " +
    ".network-region, " +
    ".network-center, " +
    ".network-line"
  );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -70px 0px"
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


  /* -------------------------------------------------------
     HEADER SCROLL STATE
  ------------------------------------------------------- */

  const header =
    document.querySelector(".site-header");

  if (header) {

    const updateHeader = () => {

      if (window.scrollY > 40) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove(
          "header-scrolled"
        );
      }

    };

    updateHeader();

    window.addEventListener(
      "scroll",
      updateHeader,
      {
        passive: true
      }
    );

  }


  /* -------------------------------------------------------
     SMOOTH ANCHOR NAVIGATION
  ------------------------------------------------------- */

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

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* -------------------------------------------------------
     IMAGE PARALLAX
  ------------------------------------------------------- */

  const parallaxImages =
    document.querySelectorAll(
      "[data-parallax]"
    );


  if (
    parallaxImages.length &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    let ticking = false;

    const updateParallax = () => {

      const viewportHeight =
        window.innerHeight;

      parallaxImages.forEach(image => {

        const rect =
          image.getBoundingClientRect();

        if (
          rect.bottom < 0 ||
          rect.top > viewportHeight
        ) {
          return;
        }

        const progress =
          (
            viewportHeight - rect.top
          ) /
          (
            viewportHeight + rect.height
          );

        const movement =
          (progress - 0.5) * -45;

        image.style.transform =
          `translate3d(0, ${movement}px, 0)`;

      });

      ticking = false;
    };


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            updateParallax
          );

          ticking = true;

        }

      },
      {
        passive: true
      }
    );

  }


  /* -------------------------------------------------------
     PRODUCT CARD MOUSE MOVEMENT
  ------------------------------------------------------- */

  const cards =
    document.querySelectorAll(
      ".product-card"
    );


  if (
    cards.length &&
    window.matchMedia(
      "(hover: hover)"
    ).matches
  ) {

    cards.forEach(card => {

      card.addEventListener(
        "mousemove",
        event => {

          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const y =
            event.clientY - rect.top;

          const rotateX =
            ((y / rect.height) - 0.5) * -2;

          const rotateY =
            ((x / rect.width) - 0.5) * 2;

          card.style.transform =
            `translateY(-4px)
             perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

        }
      );


      card.addEventListener(
        "mouseleave",
        () => {

          card.style.transform = "";

        }
      );

    });

  }


  /* -------------------------------------------------------
     NETWORK ANIMATION
  ------------------------------------------------------- */

  const network =
    document.querySelector(".network");

  if (network) {

    const center =
      network.querySelector(
        ".network-center"
      );

    const lines =
      network.querySelectorAll(
        ".network-line"
      );

    const regions =
      network.querySelectorAll(
        ".network-region"
      );


    const networkObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            if (center) {
              center.classList.add(
                "visible"
              );
            }

            regions.forEach(
              (region, index) => {

                setTimeout(
                  () => {
                    region.classList.add(
                      "visible"
                    );
                  },
                  index * 180
                );

              }
            );

            lines.forEach(
              (line, index) => {

                setTimeout(
                  () => {
                    line.classList.add(
                      "visible"
                    );
                  },
                  450 + index * 250
                );

              }
            );

            networkObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: .25
        }
      );


    networkObserver.observe(network);

  }


  /* -------------------------------------------------------
     STAGGER GENERIC ELEMENTS
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-stagger]"
    )
    .forEach(container => {

      const children =
        container.children;

      Array.from(children).forEach(
        (child, index) => {

          child.style.transitionDelay =
            `${index * 100}ms`;

        }
      );

    });


  /* -------------------------------------------------------
     CURRENT YEAR
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-year], #year"
    )
    .forEach(element => {

      element.textContent =
        new Date().getFullYear();

    });


  /* -------------------------------------------------------
     IMAGE LOADING
  ------------------------------------------------------- */

  document
    .querySelectorAll("img")
    .forEach(image => {

      if (image.complete) {
        image.classList.add(
          "image-loaded"
        );
        return;
      }

      image.addEventListener(
        "load",
        () => {
          image.classList.add(
            "image-loaded"
          );
        },
        {
          once: true
        }
      );

    });


  /* -------------------------------------------------------
     ESCAPE KEY
  ------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      if (menuToggle) {

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

      if (nav) {
        nav.classList.remove(
          "nav-open"
        );
      }

      document.body.classList.remove(
        "menu-open"
      );

    }
  );


  /* -------------------------------------------------------
     PREVENT ANIMATION JUMP ON BACK/FORWARD CACHE
  ------------------------------------------------------- */

  window.addEventListener(
    "pageshow",
    event => {

      if (event.persisted) {
        document.body.classList.add(
          "loaded"
        );
      }

    }
  );

});
