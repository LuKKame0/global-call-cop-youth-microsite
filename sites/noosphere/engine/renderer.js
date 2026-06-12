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
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setClearColor(0x05070b, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070b, 0.006);
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 600);
    this.camera.position.set(0, 0, 110);

    this.target = new THREE.Vector3(0, 0, 0);
    this.orbit = { az: 0, el: 0.25, dist: 110, azT: 0, elT: 0.25, distT: 110 };

    this._buildWells();
    this._buildEdges();
    this._buildBodies();
    this.selected = null;
  }

  _buildWells() {
    const group = new THREE.Group();
    for (const [key, w] of Object.entries(this.field.wells)) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(14, 14.3, 64),
        new THREE.MeshBasicMaterial({
          color: DOMAIN_COLOR[key] ?? 0xffffff,
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
      const c = DOMAIN_COLOR[b.domain] ?? new THREE.Color(0xffffff);
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
      const c = (DOMAIN_COLOR[e.a.domain] ?? new THREE.Color(0xffffff)).clone();
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
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending }),
    );
    this.edgeLines.frustumCulled = false;
    this.scene.add(this.edgeLines);
  }

  orbitBy(dAz, dEl) {
    this.orbit.azT += dAz;
    this.orbit.elT = Math.max(-1.4, Math.min(1.4, this.orbit.elT + dEl));
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

    this.bodyMat.uniforms.uTime.value = t;
    this.renderer.render(this.scene, this.camera);
  }
}
