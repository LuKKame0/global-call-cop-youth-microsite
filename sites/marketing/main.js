(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  const canvas = document.getElementById("hero-canvas");
  if (!canvas || prefersReducedMotion) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const pointer = { x: 0.5, y: 0.5 };
  let animationFrame = 0;
  let width = 0;
  let height = 0;

  const nodes = Array.from({ length: 54 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    radius: 1 + Math.random() * 1.8,
    speed: 0.00008 + Math.random() * 0.00012,
    phase: Math.random() * Math.PI * 2,
    accent:
      index % 4 === 0
        ? "#37ABFA"
        : index % 4 === 1
          ? "#61C879"
          : index % 4 === 2
            ? "#FF91FE"
            : "#FF460D",
  }));

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawNetwork(time) {
    context.clearRect(0, 0, width, height);

    const projected = nodes.map((node) => {
      const driftX = Math.sin(time * node.speed + node.phase) * 0.04;
      const driftY = Math.cos(time * node.speed * 1.4 + node.phase) * 0.04;
      const x = (node.x + driftX) * width;
      const y = (node.y + driftY) * height;
      return { ...node, x, y };
    });

    for (let i = 0; i < projected.length; i += 1) {
      for (let j = i + 1; j < projected.length; j += 1) {
        const a = projected[i];
        const b = projected[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > 120) continue;

        const alpha = 1 - distance / 120;
        context.strokeStyle = `rgba(255,255,255,${alpha * 0.12})`;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }

    projected.forEach((node) => {
      const glow = Math.max(
        0,
        1 - Math.hypot(node.x - pointer.x * width, node.y - pointer.y * height) / 180,
      );

      context.beginPath();
      context.fillStyle = glow > 0.2 ? node.accent : "rgba(255,255,255,0.35)";
      context.globalAlpha = 0.35 + glow * 0.65;
      context.arc(node.x, node.y, node.radius + glow * 2.2, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
    });
  }

  function animate(time) {
    drawNetwork(time);
    animationFrame = window.requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
  });

  resizeCanvas();
  animationFrame = window.requestAnimationFrame(animate);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrame);
  });
})();

(function () {
  const detail = document.querySelector("[data-network-detail]");
  const regions = document.querySelectorAll("[data-region]");

  if (!detail || !regions.length) return;

  const copy = {
    africa: {
      title: "Africa",
      body: "Regional hubs connecting youth councils, implementation partners, and multilateral entry points across policy and climate action.",
    },
    americas: {
      title: "Americas",
      body: "National focal points translating local youth policy experience into structured frameworks for regional synthesis.",
    },
    europe: {
      title: "Europe",
      body: "Institutional bridges linking academia, civil society, and governance actors into one coordinated implementation layer.",
    },
    asia: {
      title: "Asia-Pacific",
      body: "Cross-sector coordination between innovation ecosystems, education systems, and youth leadership networks.",
    },
    mena: {
      title: "Middle East & North Africa",
      body: "Alliance nodes connecting communities, policy actors, and implementation partners across complex institutional landscapes.",
    },
    global: {
      title: "Global coordination layer",
      body: "The Global Call synchronizes fragmented signals into one operational network for policy, diplomacy, and youth implementation.",
    },
  };

  function setRegion(key) {
    const region = copy[key] || copy.global;
    detail.innerHTML = `<strong>${region.title}</strong><p>${region.body}</p>`;
    regions.forEach((node) => {
      node.classList.toggle("is-active", node.dataset.region === key);
    });
  }

  regions.forEach((node) => {
    node.addEventListener("mouseenter", () => setRegion(node.dataset.region));
    node.addEventListener("focus", () => setRegion(node.dataset.region));
    node.addEventListener("click", () => setRegion(node.dataset.region));
  });

  setRegion("global");
})();
