(function () {
  const STORAGE_KEY = "tgc-theme";

  function applyTheme(theme) {
    const resolved = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", resolved);
    localStorage.setItem(STORAGE_KEY, resolved);

    document.querySelectorAll("[data-theme-toggle]").forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.checked = resolved === "dark";
      }
    });

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", resolved === "dark" ? "#050505" : "#f7f7f8");
    }
  }

  function bindToggles() {
    document.querySelectorAll("[data-theme-toggle]").forEach((input) => {
      input.addEventListener("change", () => {
        if (input instanceof HTMLInputElement) {
          applyTheme(input.checked ? "dark" : "light");
        }
      });
    });
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    applyTheme(stored === "dark" ? "dark" : "light");
    bindToggles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }

  window.GlobalCallTheme = { applyTheme };
})();
