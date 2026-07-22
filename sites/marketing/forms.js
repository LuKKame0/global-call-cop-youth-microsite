(function () {
  const openButtons = document.querySelectorAll("[data-open-modal]");
  const modals = document.querySelectorAll("[data-modal]");
  let activeModal = null;

  function lockScroll(locked) {
    document.body.style.overflow = locked ? "hidden" : "";
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    activeModal = modal;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);

    const focusTarget = modal.querySelector("input, textarea, select, button");
    if (focusTarget) {
      window.setTimeout(() => focusTarget.focus(), 120);
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (activeModal === modal) activeModal = null;
    lockScroll(Boolean(document.querySelector("[data-modal].is-open")));
  }

  function closeAllModals() {
    modals.forEach((modal) => closeModal(modal));
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(button.dataset.openModal);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", () => {
      const modal = element.closest("[data-modal]");
      closeModal(modal);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModals();
  });

  async function submitForm(form) {
    const endpoint = form.dataset.endpoint;
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('[type="submit"]');

    if (!endpoint) return;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    submitButton.disabled = true;
    if (status) {
      status.textContent = "Sending…";
      status.dataset.state = "pending";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok || !body.ok) {
        throw new Error(body.error || "Unable to send your request.");
      }

      form.reset();
      if (status) {
        status.textContent =
          "Request sent. Check your inbox for confirmation and next steps.";
        status.dataset.state = "success";
      }
    } catch (error) {
      if (status) {
        status.textContent =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        status.dataset.state = "error";
      }
    } finally {
      submitButton.disabled = false;
    }
  }

  document.querySelectorAll("[data-landing-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForm(form);
    });
  });

  window.GlobalCallLanding = { openModal, closeModal, closeAllModals };

  const params = new URLSearchParams(window.location.search);
  const modalFromQuery = params.get("modal");
  if (modalFromQuery) {
    window.setTimeout(() => openModal(`modal-${modalFromQuery}`), 120);
  }
})();
