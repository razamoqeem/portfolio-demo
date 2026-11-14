document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains("nav-open");
      if (isOpen) {
        navLinks.classList.remove("nav-open");
        navLinks.classList.add("nav-closed");
        navToggle.setAttribute("aria-expanded", "false");
      } else {
        navLinks.classList.remove("nav-closed");
        navLinks.classList.add("nav-open");
        navToggle.setAttribute("aria-expanded", "true");
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        if (navLinks.classList.contains("nav-open")) {
          navLinks.classList.remove("nav-open");
          navLinks.classList.add("nav-closed");
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });

    // Close when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("nav-open");
        navLinks.classList.add("nav-closed");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});
