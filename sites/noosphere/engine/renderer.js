// Renderer — Three.js view of the field. Bodies as shader points whose
// glow/size encode energy & temperature; edges as additive lines; domain
// wells as faint rings. Data-art first: the physics is made visible.

import * as THREE from "../vendor/three.module.min.js";

const DOMAIN_COLOR = {
  political: new THREE.Color("#37ABFA"),
  capital: new THREE.Color("#61C879"),
  institutional: new THREE.Color("#FF91FE"),
  legal: new THREE.Color("#FF460D"),
  research: new THREE.Color("#FFD27A"),
};

export class Renderer {
  constructor(canvas, field) {
    this.canvas = canvas;
    this.field = field;
    this._colorCache = {};
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setClearColor(0x05070b, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070b, 0.006);
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 600);
    this.camera.position.set(0, 0, 110);

    // start looking at the field almost head-on (gentle tilt) → no vertigo
    this.target = new THREE.Vector3(0, 0, 0);
    this.orbit = { az: 0, el: 0.12, dist: 132, azT: 0, elT: 0.12, distT: 132 };

    this._buildStarfield();
    this._buildNebulae();
    this._buildWells();
    this._buildEdges();
    this._buildBodies();
    this.selected = null;
    this._proj = new THREE.Vector3();
  }

  // resolve a domain color from the field's corpus, falling back to the
  // built-in noosphere palette — lets FileSpace reuse this renderer
  _domainColor(key) {
    if (this._colorCache[key]) return this._colorCache[key];
    const hex = this.field.domains?.[key]?.color;
    const c = hex ? new THREE.Color(hex) : DOMAIN_COLOR[key] ?? new THREE.Color(0xffffff);
    this._colorCache[key] = c;
    return c;
  }

  // ── Ambient starfield — depth + dream haze, procedurally placed ─────
  _buildStarfield() {
    const N = 1400;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i += 1) {
      // shell around the field so it surrounds without crowding
      const r = 180 + Math.random() * 260;
      const a = Math.random() * Math.PI * 2;
      const e = (Math.random() - 0.5) * Math.PI;
      pos[i * 3] = Math.cos(a) * Math.cos(e) * r;
      pos[i * 3 + 1] = Math.sin(e) * r;
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r;
      const t = 0.3 + Math.random() * 0.7;
      col[i * 3] = t * 0.6; col[i * 3 + 1] = t * 0.7; col[i * 3 + 2] = t;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const stars = new THREE.Points(
      g,
      new THREE.PointsMaterial({ size: 1.1, vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false }),
    );
    stars.frustumCulled = false;
    this.scene.add(stars);
    this.starfield = stars;
  }

  // ── Domain nebulae — generative procedural clouds (noise shader) ────
  // Each domain gets a soft volumetric haze billboard at its well; this is
  // the "dream / data-art generativo" layer that makes regions legible.
  _buildNebulae() {
    const group = new THREE.Group();
    this.nebulaMat = [];
    for (const [key, w] of Object.entries(this.field.wells)) {
      const c = this._domainColor(key);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uColor: { value: c.clone() }, uSeed: { value: Math.random() * 10 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec2 vUv; uniform float uTime; uniform vec3 uColor; uniform float uSeed;
          // value-noise fbm — cheap procedural cloud
          float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
          float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }
          void main(){
            vec2 uv=(vUv-0.5)*2.0;
            float r=length(uv);
            if(r>1.0) discard;
            vec2 q=uv*2.2+vec2(uSeed);
            float n=fbm(q+vec2(uTime*0.04,uTime*0.03));
            n=fbm(q+n*1.5);
            float edge=smoothstep(1.0,0.1,r);
            float cloud=pow(n,1.6)*edge;
            gl_FragColor=vec4(uColor*cloud*1.6, cloud*0.5*edge);
          }`,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(56, 56), mat);
      mesh.position.set(w.x, w.y, w.z - 2);
      mesh.userData.well = w;
      group.add(mesh);
      this.nebulaMat.push({ mat, mesh });
    }
    this.scene.add(group);
    this.nebulaGroup = group;
  }

  _buildWells() {
    const group = new THREE.Group();
    for (const [key, w] of Object.entries(this.field.wells)) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(14, 14.3, 64),
        new THREE.MeshBasicMaterial({
          color: this._domainColor(key),
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.set(w.x, w.y, w.z);
      group.add(ring);
    }
    this.scene.add(group);
    this.wellGroup = group;
  }

  _buildBodies() {
    const bodies = this.field.bodies;
    const n = bodies.length;
    const geo = new THREE.BufferGeometry();
    this.posArr = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const aux = new Float32Array(n * 3); // size, energy, temperature
    bodies.forEach((b, i) => {
      const c = this._domainColor(b.domain);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      aux[i * 3] = 14 + b.mass * 46;
      aux[i * 3 + 1] = b.energy;
      aux[i * 3 + 2] = b.temperature;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(this.posArr, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aAux", new THREE.BufferAttribute(aux, 3));

    this.bodyMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uSel: { value: -1 } },
      vertexShader: /* glsl */ `
        attribute vec3 aColor; attribute vec3 aAux;
        uniform float uTime; uniform float uPx;
        varying vec3 vColor; varying float vEnergy; varying float vTemp;
        void main(){
          vColor=aColor; vEnergy=aAux.y; vTemp=aAux.z;
          vec4 mv=modelViewMatrix*vec4(position,1.0);
          float pulse=0.85+0.15*sin(uTime*(1.0+aAux.z*3.0));
          gl_PointSize=aAux.x*uPx*pulse*(120.0/-mv.z);
          gl_Position=projectionMatrix*mv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vColor; varying float vEnergy; varying float vTemp;
        void main(){
          float d=length(gl_PointCoord-vec2(0.5));
          if(d>0.5) discard;
          float core=smoothstep(0.5,0.0,d);
          float halo=smoothstep(0.5,0.18,d);
          vec3 hot=mix(vColor,vec3(1.0),vTemp*0.5);
          float a=core*(0.5+vEnergy*0.5)+halo*0.25;
          gl_FragColor=vec4(hot,a);
        }`,
    });
    this.bodyPoints = new THREE.Points(geo, this.bodyMat);
    this.bodyPoints.frustumCulled = false;
    this.scene.add(this.bodyPoints);
  }

  _buildEdges() {
    const edges = this.field.edges;
    const geo = new THREE.BufferGeometry();
    this.edgePos = new Float32Array(edges.length * 6);
    const col = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => {
      const c = this._domainColor(e.a.domain).clone();
      for (let k = 0; k < 2; k += 1) {
        col[i * 6 + k * 3] = c.r;
        col[i * 6 + k * 3 + 1] = c.g;
        col[i * 6 + k * 3 + 2] = c.b;
      }
    });
    geo.setAttribute("position", new THREE.BufferAttribute(this.edgePos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    this.edgeLines = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending }),
    );
    this.edgeLines.frustumCulled = false;
    this.scene.add(this.edgeLines);
  }

  orbitBy(dAz, dEl) {
    this.orbit.azT += dAz;
    // clamp tilt to a comfortable band — never flip under/over the field
    this.orbit.elT = Math.max(-0.85, Math.min(0.95, this.orbit.elT + dEl));
  }
  zoomBy(f) {
    this.orbit.distT = Math.max(24, Math.min(360, this.orbit.distT * f));
  }
  focusOn(body) {
    this.target.set(body.x, body.y, body.z);
    this.orbit.distT = Math.max(28, 18 + body.radius * 6);
  }

  screenToRayHit(sx, sy) {
    // project all bodies, pick nearest to cursor within a pixel radius
    const rect = this.canvas.getBoundingClientRect();
    const v = new THREE.Vector3();
    let best = null, bestD = 26 * 26;
    for (const b of this.field.bodies) {
      v.set(b.x, b.y, b.z).project(this.camera);
      const px = (v.x * 0.5 + 0.5) * rect.width;
      const py = (-v.y * 0.5 + 0.5) * rect.height;
      if (v.z > 1) continue;
      const d2 = (px - sx) ** 2 + (py - sy) ** 2;
      if (d2 < bestD) { bestD = d2; best = b; }
    }
    return best;
  }

  resize(w, h, dpr) {
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.bodyMat.uniforms.uPx.value = dpr;
  }

  render(t) {
    const o = this.orbit;
    o.az += (o.azT - o.az) * 0.08;
    o.el += (o.elT - o.el) * 0.08;
    o.dist += (o.distT - o.dist) * 0.08;
    const cx = this.target.x + o.dist * Math.cos(o.el) * Math.sin(o.az);
    const cy = this.target.y + o.dist * Math.sin(o.el);
    const cz = this.target.z + o.dist * Math.cos(o.el) * Math.cos(o.az);
    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(this.target);

    // sync body positions from the field
    this.field.bodies.forEach((b, i) => {
      this.posArr[i * 3] = b.x;
      this.posArr[i * 3 + 1] = b.y;
      this.posArr[i * 3 + 2] = b.z;
    });
    this.bodyPoints.geometry.attributes.position.needsUpdate = true;

    this.field.edges.forEach((e, i) => {
      this.edgePos[i * 6] = e.a.x; this.edgePos[i * 6 + 1] = e.a.y; this.edgePos[i * 6 + 2] = e.a.z;
      this.edgePos[i * 6 + 3] = e.b.x; this.edgePos[i * 6 + 4] = e.b.y; this.edgePos[i * 6 + 5] = e.b.z;
    });
    this.edgeLines.geometry.attributes.position.needsUpdate = true;
    this.wellGroup.children.forEach((r) => r.lookAt(this.camera.position));

    // nebulae: face camera + animate noise
    for (const { mat, mesh } of this.nebulaMat) {
      mesh.quaternion.copy(this.camera.quaternion);
      mat.uniforms.uTime.value = t;
    }
    this.starfield.rotation.y = t * 0.005;

    this.bodyMat.uniforms.uTime.value = t;
    this.renderer.render(this.scene, this.camera);
  }

  // project a world point → screen px + camera distance (for DOM labels)
  project(x, y, z) {
    this._proj.set(x, y, z);
    const dist = this._proj.distanceTo(this.camera.position);
    this._proj.project(this.camera);
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (this._proj.x * 0.5 + 0.5) * rect.width,
      y: (-this._proj.y * 0.5 + 0.5) * rect.height,
      visible: this._proj.z < 1,
      dist, // world-space distance to camera, for distance fade
    };
  }
}
