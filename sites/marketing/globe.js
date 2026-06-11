// The Global Call — 3D coordination globe (hero background).
// 194 country nodes + animated multilateral coordination arcs.
// Renders on its own canvas; on success it hides the 2D network fallback
// (html[data-globe="on"]). If WebGL is unavailable the 2D canvas stays.
// Relative import (no import map / CDN): resolves correctly both when served
// statically from sites/marketing and when synced under /marketing/ — and the
// site CSP (script-src 'self') stays intact.
import * as THREE from "./vendor/three.module.min.js";
import { COUNTRIES } from "./globe-data.js";

(function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const R = 2;
  const BRAND = {
    blue: new THREE.Color("#37ABFA"),
    green: new THREE.Color("#61C879"),
    pink: new THREE.Color("#FF91FE"),
    orange: new THREE.Color("#FF460D"),
  };
  const REGION_COLOR = {
    Africa: BRAND.green,
    Americas: BRAND.blue,
    Asia: BRAND.orange,
    Europe: BRAND.pink,
    Oceania: BRAND.blue,
  };
  const ARC_PALETTE = [BRAND.blue, BRAND.green, BRAND.pink, BRAND.orange];

  function latLonToVec3(lat, lon, radius) {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  }

  const canvas = document.createElement("canvas");
  canvas.className = "globe-canvas";
  canvas.setAttribute("aria-hidden", "true");
  hero.prepend(canvas);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch (error) {
    canvas.remove();
    return;
  }

  document.documentElement.dataset.globe = "on";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0, 6.4);

  // tiltGroup carries axial tilt + pointer parallax; spinGroup rotates.
  const tiltGroup = new THREE.Group();
  const spinGroup = new THREE.Group();
  tiltGroup.rotation.z = -0.23;
  tiltGroup.add(spinGroup);
  scene.add(tiltGroup);

  const theme = {
    bg: new THREE.Color("#06070b"),
    isLight: false,
  };

  // ── Occluder sphere (hides far-side dots, takes theme background color)
  const occluderMaterial = new THREE.MeshBasicMaterial({ color: theme.bg });
  const occluder = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.992, 64, 48),
    occluderMaterial,
  );
  spinGroup.add(occluder);

  // ── Atmosphere (fresnel rim, additive)
  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uColor: { value: BRAND.blue.clone() },
      uIntensity: { value: 0.6 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.62 + dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
        gl_FragColor = vec4(uColor, 1.0) * rim * uIntensity;
      }
    `,
  });
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.18, 64, 48),
    atmosphereMaterial,
  );
  tiltGroup.add(atmosphere);

  // ── Graticule (faint lat/lon grid)
  function buildGraticule() {
    const positions = [];
    const SEGMENTS = 72;
    const push = (a, b) => positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let i = 0; i < SEGMENTS; i += 1) {
        push(
          latLonToVec3(lat, (i / SEGMENTS) * 360 - 180, R),
          latLonToVec3(lat, ((i + 1) / SEGMENTS) * 360 - 180, R),
        );
      }
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let i = 0; i < SEGMENTS; i += 1) {
        push(
          latLonToVec3((i / SEGMENTS) * 180 - 90, lon, R),
          latLonToVec3(((i + 1) / SEGMENTS) * 180 - 90, lon, R),
        );
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geometry;
  }
  const graticuleMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
  });
  spinGroup.add(new THREE.LineSegments(buildGraticule(), graticuleMaterial));

  // ── Country nodes (194 pulsing points, brand color per region)
  const countryVectors = COUNTRIES.map(([, , lat, lon]) =>
    latLonToVec3(lat, lon, R * 1.004),
  );
  const pointCount = COUNTRIES.length;
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const phases = new Float32Array(pointCount);
  const sizes = new Float32Array(pointCount);
  COUNTRIES.forEach(([, , , , region], i) => {
    countryVectors[i].toArray(positions, i * 3);
    (REGION_COLOR[region] || BRAND.blue).toArray(colors, i * 3);
    phases[i] = Math.random() * Math.PI * 2;
    sizes[i] = 1.5 + Math.random() * 1.4;
  });
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  pointsGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  pointsGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const pointsMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uPx: { value: 1 },
      uDim: { value: 0 }, // 1 in light theme: slightly darker, opaque dots
    },
    vertexShader: /* glsl */ `
      attribute vec3 aColor;
      attribute float aPhase;
      attribute float aSize;
      uniform float uTime;
      uniform float uPx;
      varying vec3 vColor;
      varying float vPulse;
      void main() {
        vColor = aColor;
        vPulse = 0.65 + 0.35 * sin(uTime * 1.4 + aPhase);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPx * vPulse * (130.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uDim;
      varying vec3 vColor;
      varying float vPulse;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float core = smoothstep(0.5, 0.12, d);
        vec3 color = mix(vColor, vColor * 0.72, uDim);
        float alpha = core * (0.45 + 0.55 * vPulse);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
  spinGroup.add(new THREE.Points(pointsGeometry, pointsMaterial));

  // ── Coordination arcs (great-circle routes between regions)
  const ARC_SEGMENTS = 60;
  const isSmallViewport = window.matchMedia("(max-width: 880px)").matches;
  const ARC_COUNT = isSmallViewport ? 9 : 16;

  function arcShaderMaterial(color) {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: color.clone() },
        uHead: { value: 0 },
        uTail: { value: 0 },
        uDim: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute float aT;
        varying float vT;
        void main() {
          vT = aT;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uHead;
        uniform float uTail;
        uniform float uDim;
        varying float vT;
        void main() {
          if (vT > uHead || vT < uTail) discard;
          float span = max(uHead - uTail, 0.0001);
          float ramp = (vT - uTail) / span;
          float alpha = pow(ramp, 1.6) * mix(0.9, 0.55, uDim);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
  }

  const arcs = [];
  const ringGeometry = new THREE.RingGeometry(1, 1.16, 40);
  for (let i = 0; i < ARC_COUNT; i += 1) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array((ARC_SEGMENTS + 1) * 3), 3),
    );
    const ts = new Float32Array(ARC_SEGMENTS + 1);
    for (let s = 0; s <= ARC_SEGMENTS; s += 1) ts[s] = s / ARC_SEGMENTS;
    geometry.setAttribute("aT", new THREE.BufferAttribute(ts, 1));

    const color = ARC_PALETTE[i % ARC_PALETTE.length];
    const line = new THREE.Line(geometry, arcShaderMaterial(color));
    line.frustumCulled = false;
    spinGroup.add(line);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color.clone(),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.visible = false;
    spinGroup.add(ring);

    arcs.push({
      line,
      ring,
      progress: Math.random() * 1.7, // staggered start
      speed: 0.32 + Math.random() * 0.22,
      target: new THREE.Vector3(),
    });
    respawnArc(arcs[i]);
  }

  function respawnArc(arc) {
    const a = Math.floor(Math.random() * COUNTRIES.length);
    let b = Math.floor(Math.random() * COUNTRIES.length);
    // multilateral: bias routes across regions
    for (let tries = 0; tries < 8 && COUNTRIES[b][4] === COUNTRIES[a][4]; tries += 1) {
      b = Math.floor(Math.random() * COUNTRIES.length);
    }
    const v0 = countryVectors[a];
    const v1 = countryVectors[b];
    const angle = v0.angleTo(v1);
    const lift = 1 + angle * 0.32;
    const c1 = v0.clone().lerp(v1, 0.25).normalize().multiplyScalar(R * lift);
    const c2 = v0.clone().lerp(v1, 0.75).normalize().multiplyScalar(R * lift);
    const curve = new THREE.CubicBezierCurve3(v0, c1, c2, v1);
    const attr = arc.line.geometry.getAttribute("position");
    curve.getPoints(ARC_SEGMENTS).forEach((p, s) => attr.setXYZ(s, p.x, p.y, p.z));
    attr.needsUpdate = true;
    arc.line.geometry.computeBoundingSphere();

    arc.target.copy(v1);
    arc.ring.position.copy(v1).multiplyScalar(1.003);
    // orient in spinGroup local space (lookAt would use world space)
    arc.ring.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      v1.clone().normalize(),
    );
    arc.speed = 0.32 + Math.random() * 0.22;
  }

  function updateArc(arc, dt) {
    arc.progress += dt * arc.speed;
    if (arc.progress > 1.75) {
      arc.progress = 0;
      respawnArc(arc);
    }
    const p = arc.progress;
    const ease = (t) => 1 - Math.pow(1 - t, 2.2);
    arc.line.material.uniforms.uHead.value = ease(Math.min(p, 1));
    arc.line.material.uniforms.uTail.value = ease(
      THREE.MathUtils.clamp((p - 0.45) / 1.3, 0, 1),
    );
    // arrival ripple at the destination country
    const k = THREE.MathUtils.clamp((p - 0.92) / 0.7, 0, 1);
    arc.ring.visible = k > 0 && k < 1;
    if (arc.ring.visible) {
      const s = 0.03 + k * 0.22;
      arc.ring.scale.setScalar(s);
      arc.ring.material.opacity = (1 - k) * 0.55;
    }
  }

  // ── Theme sync (light/dark toggle on the page)
  function applyTheme() {
    const isLight =
      document.documentElement.getAttribute("data-theme") !== "dark";
    theme.isLight = isLight;
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    occluderMaterial.color.set(bodyBg).multiplyScalar(isLight ? 0.96 : 1.25);
    atmosphereMaterial.uniforms.uIntensity.value = isLight ? 0.34 : 0.6;
    graticuleMaterial.color.set(isLight ? 0x000000 : 0xffffff);
    graticuleMaterial.opacity = isLight ? 0.11 : 0.05;
    pointsMaterial.uniforms.uDim.value = isLight ? 1 : 0;
    arcs.forEach((arc) => {
      arc.line.material.uniforms.uDim.value = isLight ? 1 : 0;
    });
  }
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // ── Layout: globe sits right of the hero copy on wide screens
  function layout() {
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, isSmallViewport ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    pointsMaterial.uniforms.uPx.value = dpr;
    if (width > 880) {
      tiltGroup.position.set(width > 1200 ? 1.5 : 1.1, 0.1, 0);
      tiltGroup.scale.setScalar(1);
    } else {
      tiltGroup.position.set(0, 0.55, 0);
      tiltGroup.scale.setScalar(0.8);
    }
  }

  // ── Pointer parallax
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (event) => {
    parallax.tx = (event.clientX / window.innerWidth - 0.5) * 0.22;
    parallax.ty = (event.clientY / window.innerHeight - 0.5) * 0.16;
  });

  // ── Render loop (pauses when tab hidden or hero off-screen)
  const clock = new THREE.Clock();
  let running = true;
  let heroVisible = true;
  let rafId = 0;

  function frame() {
    rafId = window.requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    spinGroup.rotation.y += dt * 0.05;
    parallax.x += (parallax.tx - parallax.x) * 0.04;
    parallax.y += (parallax.ty - parallax.y) * 0.04;
    tiltGroup.rotation.y = parallax.x;
    tiltGroup.rotation.x = parallax.y;
    pointsMaterial.uniforms.uTime.value = clock.elapsedTime;
    arcs.forEach((arc) => updateArc(arc, dt));
    renderer.render(scene, camera);
  }

  function setRunning(next) {
    if (next === running) return;
    running = next;
    if (running) {
      clock.getDelta();
      frame();
    } else {
      window.cancelAnimationFrame(rafId);
    }
  }

  document.addEventListener("visibilitychange", () => {
    setRunning(!document.hidden && heroVisible && !prefersReducedMotion);
  });
  new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    setRunning(!document.hidden && heroVisible && !prefersReducedMotion);
  }).observe(canvas);

  window.addEventListener("resize", () => {
    layout();
    if (!running) renderer.render(scene, camera);
  });

  layout();
  applyTheme();

  if (prefersReducedMotion) {
    // Static frame: arcs frozen mid-flight, no rotation, no loop.
    running = false;
    arcs.forEach((arc, i) => {
      arc.progress = 0.55 + (i % 4) * 0.1;
      updateArc(arc, 0);
    });
    renderer.render(scene, camera);
    return;
  }

  frame();
})();
