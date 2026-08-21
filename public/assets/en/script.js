/* =========================================================
   EMPERIO TISS
   INTERACTION SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     HEADER SCROLL
  ------------------------------------------------------- */

  const header = document.querySelector(".site-header");

  const updateHeader = () => {

    if (!header) return;

    if (window.scrollY > 30) {

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


  /* -------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------- */

  const menuButton =
    document.querySelector(".mobile-menu");

  const navigation =
    document.querySelector(".main-nav");

  if (menuButton && navigation) {

    menuButton.addEventListener("click", () => {

      const isOpen =
        menuButton.getAttribute("aria-expanded")
        === "true";

      menuButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navigation.classList.toggle(
        "mobile-open"
      );

    });

  }


  /* -------------------------------------------------------
     SMOOTH INTERNAL LINKS
  ------------------------------------------------------- */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const targetId =
          link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });


  /* -------------------------------------------------------
     ACCESSIBILITY BUTTON
  ------------------------------------------------------- */

  const accessibilityButton =
    document.querySelector(
      ".accessibility-button"
    );

  if (accessibilityButton) {

    accessibilityButton.addEventListener(
      "click",
      () => {

        document.body.classList.toggle(
          "accessibility-mode"
        );

        const enabled =
          document.body.classList.contains(
            "accessibility-mode"
          );

        accessibilityButton.setAttribute(
          "aria-pressed",
          String(enabled)
        );

      }
    );

  }


  /* -------------------------------------------------------
     PREMIUM POINTER
  ------------------------------------------------------- */

  if (
    window.matchMedia(
      "(pointer:fine)"
    ).matches
  ) {

    const pointer =
      document.createElement("div");

    pointer.className =
      "premium-pointer";

    document.body.appendChild(pointer);


    document.addEventListener(
      "mousemove",
      event => {

        pointer.style.left =
          `${event.clientX}px`;

        pointer.style.top =
          `${event.clientY}px`;

      }
    );


    document
      .querySelectorAll("a, button")
      .forEach(element => {

        element.addEventListener(
          "mouseenter",
          () => {
            pointer.classList.add("active");
          }
        );

        element.addEventListener(
          "mouseleave",
          () => {
            pointer.classList.remove("active");
          }
        );

      });

  }

});
