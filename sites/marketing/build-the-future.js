(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.querySelectorAll(".reveal").forEach((element) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
  });

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(button.dataset.scrollTarget);
      target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  document.querySelectorAll("[data-preset-role]").forEach((button) => {
    button.addEventListener("click", () => {
      const roleInput = document.getElementById("coordination-role");
      if (roleInput) {
        roleInput.value = button.dataset.presetRole;
      }
    });
  });

  document.querySelectorAll("[data-set-role]").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-set-role]").forEach((node) => {
        node.classList.remove("is-selected");
      });
      card.classList.add("is-selected");

      const roleInput = document.getElementById("coordination-role");
      if (roleInput) {
        roleInput.value = card.dataset.setRole;
      }

      const enterSection = document.getElementById("enter");
      enterSection?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  const canvas = document.getElementById("btf-canvas");
  if (!canvas || prefersReducedMotion) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let frameId = 0;

  const nodes = Array.from({ length: 72 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    r: 1 + Math.random() * 1.4,
    speed: 0.00005 + Math.random() * 0.00008,
    phase: Math.random() * Math.PI * 2,
    color:
      index % 4 === 0
        ? "#37ABFA"
        : index % 4 === 1
          ? "#61C879"
          : index % 4 === 2
            ? "#FF91FE"
            : "#FF460D",
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);

    const projected = nodes.map((node) => {
      const x =
        (node.x + Math.sin(time * node.speed + node.phase) * 0.03) * width;
      const y =
        (node.y + Math.cos(time * node.speed * 1.3 + node.phase) * 0.03) * height;
      return { ...node, x, y };
    });

    for (let i = 0; i < projected.length; i += 1) {
      for (let j = i + 1; j < projected.length; j += 1) {
        const a = projected[i];
        const b = projected[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > 100) continue;
        const alpha = 1 - distance / 100;
        context.strokeStyle = `rgba(55,171,250,${alpha * 0.14})`;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }

    projected.forEach((node) => {
      context.beginPath();
      context.fillStyle = node.color;
      context.globalAlpha = 0.55;
      context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
    });

    frameId = window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  frameId = window.requestAnimationFrame(draw);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(frameId);
  });
})();

(function () {
  const mapDetail = document.querySelector("[data-map-detail]");
  const mapNodes = document.querySelectorAll("[data-map-node]");

  if (!mapDetail || !mapNodes.length) return;

  const copy = {
    na: "North America — active implementation corridor with institutional allies and youth policy focal points.",
    sa: "South America — regional coordination across national frameworks and civil society implementation nodes.",
    eu: "Europe — multilateral bridge layer connecting academia, policy networks, and regional hubs.",
    af: "Africa — high-density youth coordination with advocacy and field implementation partners.",
    as: "Asia-Pacific — innovation, education, and climate implementation pathways in active sync.",
    oc: "Oceania — alliance nodes linking Pacific policy dialogue to global coordination infrastructure.",
  };

  mapNodes.forEach((node) => {
    const activate = () => {
      mapNodes.forEach((item) => item.classList.remove("is-active"));
      node.classList.add("is-active");
      mapDetail.textContent = copy[node.dataset.mapNode] || copy.na;
    };
    node.addEventListener("mouseenter", activate);
    node.addEventListener("focus", activate);
    node.addEventListener("click", activate);
  });
})();
