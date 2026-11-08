// The single continuous world: renderer, depth of field, documents, the dot, camera flights.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { STATIONS, SPACING, CLUSTERS } from './stations.js';
import { build } from './scenes.js';
import { loadImages } from './phone.js';

export const COL = { navy: 0x14213D, paper: 0xFBF8F0, sand: 0xE7E1D2, slate: 0x3D4A63, yellow: 0xF5B800 };
export const rng = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export const clamp01 = x => Math.min(1, Math.max(0, x));
export const ease = x => { x = clamp01(x); return x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
export const center = i => new THREE.Vector3(i * SPACING, 0, 0);

const N = 264, FLIGHT = 1.9, ORBIT = 2.4, W = 1120, H = 1080;
const resolve = (v, b, m) => typeof v === 'function' ? v(b, m) : v;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

function greekTexture() {
  const c = Object.assign(document.createElement('canvas'), { width: 256, height: 340 }), x = c.getContext('2d'), r = rng(7);
  x.fillStyle = '#fff'; x.fillRect(0, 0, 256, 340); x.fillStyle = '#8a92a3';
  x.fillRect(22, 26, 120, 18);
  for (let y = 70; y < 310; y += 22) x.fillRect(22, y, 130 + r() * 82, 9);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function makeDocs(scene) {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 2, .02), new THREE.MeshLambertMaterial({ map: greekTexture() }), N);
  mesh.frustumCulled = false; scene.add(mesh);
  const SAND = new THREE.Color(COL.sand), YEL = new THREE.Color(COL.yellow);
  const r0 = rng(11);
  const item = () => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), c: SAND.clone() });
  const docs = Array.from({ length: N }, () => ({ cur: item(), from: item(), delay: r0() * .7, phase: r0() * 6.28 }));
  const spin = (r) => new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * 6.28, r() * 6.28, r() * 6.28));
  const cache = {};
  const layouts = {
    field() { // the scattered documents of slides 1-4; kept out of the camera tube at each station
      const r = rng(23);
      return docs.map(() => {
        const p = new THREE.Vector3(-22 + r() * 190, -11 + r() * 24, -26 + r() * 37);
        const near = [0, 1, 2, 3].some(k => Math.abs(p.x - k * SPACING) < 10);
        if (near && p.z > -3.5) p.z = -3.5 - r() * 20;
        return { p, q: spin(r), c: SAND, drift: .35 };
      });
    },
    clusters() { // four equal clusters: size carries no quantity
      const r = rng(31), c0 = center(4);
      return docs.map((_, k) => {
        const [x, y, z] = CLUSTERS[k % 4], a = r() * 6.28, b = Math.acos(2 * r() - 1), R = 1 + r() * 1.25;
        return { p: new THREE.Vector3(x + R * Math.sin(b) * Math.cos(a), y + R * Math.sin(b) * Math.sin(a), z + R * Math.cos(b)).add(c0), q: spin(r), c: SAND, drift: .5 };
      });
    },
    scatter(i) {
      const r = rng(41 + i), c0 = center(i);
      return docs.map(() => ({ p: new THREE.Vector3(-11 + r() * 22, -5 + r() * 14, -8 + r() * 13).add(c0), q: spin(r), c: SAND, drift: .35 }));
    },
    stacks(i) { // three equal ordered stacks; the top sheet of each is the verified one
      const c0 = center(i), r = rng(53), flat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), n = Math.floor(N / 3);
      return docs.map((_, k) => {
        const col = k % 3, h = Math.floor(k / 3);
        return { p: new THREE.Vector3((col - 1) * 4.5, -1.5 + h * .055, i === 11 ? -6 : 0).add(c0), q: flat.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (r() - .5) * .05)), c: h === n - 1 ? YEL : SAND, drift: 0, delay: 1.1 + h / n * 1.5 }; // the stack builds bottom-up once the camera has landed
      });
    },
  };
  const get = key => {
    if (cache[key]) return cache[key];
    const [kind, arg] = key.split('@');
    return cache[key] = layouts[kind](+arg);
  };
  let target = null, key = null, t0 = -99;
  const m = new THREE.Matrix4(), S = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
  return {
    set(k, now, instant) {
      if (k === key && !instant) return;
      key = k; target = get(k); t0 = instant ? -999 : now;
      docs.forEach(d => { d.from.p.copy(d.cur.p); d.from.q.copy(d.cur.q); d.from.c.copy(d.cur.c); });
    },
    update(now) {
      docs.forEach((d, k) => {
        const T = target[k], u = ease((now - t0 - (T.delay ?? d.delay)) / 2.1);
        d.cur.p.lerpVectors(d.from.p, T.p, u); d.cur.q.slerpQuaternions(d.from.q, T.q, u); d.cur.c.lerpColors(d.from.c, T.c, u);
        P.copy(d.cur.p); if (T.drift) { P.y += Math.sin(now * .35 + d.phase) * T.drift * u; P.x += Math.cos(now * .27 + d.phase) * T.drift * .6 * u; }
        mesh.setMatrixAt(k, m.compose(P, d.cur.q, S)); mesh.setColorAt(k, d.cur.c);
      });
      mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
    },
  };
}

export async function createWorld(canvas) {
  await loadImages();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  const scene = new THREE.Scene(), bgNavy = new THREE.Color(COL.navy), bgPaper = new THREE.Color(COL.paper);
  scene.background = bgNavy.clone(); scene.fog = new THREE.FogExp2(COL.navy, .085);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x77809a, 1.7));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5); sun.position.set(4, 9, 10); scene.add(sun);

  const camera = new THREE.PerspectiveCamera(32, W / H, .5, 420);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: 17, aperture: .0004, maxblur: .005 });
  composer.addPass(bokeh); composer.addPass(new OutputPass());
  const setScale = pr => { const w = Math.round(W * pr), h = Math.round(H * pr); renderer.setPixelRatio(1); renderer.setSize(w, h, false); composer.setSize(w, h); };

  const docs = makeDocs(scene);
  const YEL = new THREE.Color(COL.yellow);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 32), new THREE.MeshBasicMaterial({ color: COL.yellow, fog: false }));
  scene.add(dot);

  const api = { THREE, scene, camera, dot, YEL, renderer };
  const groups = STATIONS.map((_, i) => { const g = new THREE.Group(); g.position.copy(center(i)); scene.add(g); return g; });
  const ticks = STATIONS.map((s, i) => build[i] ? build[i](groups[i], api) : null);

  // Camera and tween state. `now` is the deck's virtual clock.
  const cur = { p: new THREE.Vector3(0, 0, 40), l: new THREE.Vector3(), az: 0 };
  let flight = null, slide = 0, beat = 0, mode = 1, prev = -1, tEnter = 0;
  const dotTw = { from: new THREE.Vector3(), to: new THREE.Vector3(), sf: 0, st: 0, t0: -99 };
  const env = { from: .085, to: .085, bgFrom: bgNavy.clone(), bgTo: bgNavy.clone(), t0: -99 };
  const tmp = new THREE.Vector3(), dir = new THREE.Vector3();

  const targetCam = (i, b, m) => {
    const s = resolve(STATIONS[i].cam, b, m), c = center(i), l = new THREE.Vector3(...s.l).add(c);
    const rel = new THREE.Vector3(...s.p).sub(new THREE.Vector3(...s.l)).applyAxisAngle(Y_AXIS, (s.az || 0) * Math.PI / 180);
    return { p: l.clone().add(rel), l, az: s.az || 0, orbit: s.az !== undefined };
  };

  function enter(i, b, m, now, instant) {
    const same = i === slide, to = targetCam(i, b, m), S = STATIONS[i];
    if (!same) { prev = slide; tEnter = now; }
    const dur = instant ? 0 : (same && to.orbit ? ORBIT : FLIGHT);
    if (!(same && to.p.distanceTo(flight?.to.p ?? cur.p) < 1e-3))
      flight = { from: { p: cur.p.clone(), l: cur.l.clone(), az: cur.az }, to, t0: now, dur, orbit: same && to.orbit, leg: !same };
    slide = i; beat = b; mode = m;
    if (instant) tEnter = -999;
    docs.set(resolve(S.docs, b, m), now, instant);
    env.from = scene.fog.density; env.to = resolve(S.fog, b, m); env.bgFrom.copy(scene.background); env.bgTo.copy(S.bg === 'paper' ? bgPaper : bgNavy); env.t0 = instant ? -999 : now;
    const d = resolve(S.dot, b, m);
    dotTw.from.copy(dot.position); dotTw.sf = dot.scale.x;
    if (d) { dotTw.to.set(d[0], d[1], d[2]).add(center(i)); dotTw.st = d[3]; } else { dotTw.to.copy(dotTw.from); dotTw.st = 0; }
    dotTw.t0 = instant ? -999 : now;
  }

  function update(now) {
    let u = 1;
    if (flight) {
      u = flight.dur ? clamp01((now - flight.t0) / flight.dur) : 1;
      const e = ease(u), lift = Math.sin(Math.PI * e);
      cur.l.lerpVectors(flight.from.l, flight.to.l, e);
      if (flight.orbit) {
        cur.az = THREE.MathUtils.lerp(flight.from.az, flight.to.az, e);
        const a = cur.az - flight.to.az;
        cur.p.copy(flight.to.p).sub(flight.to.l).applyAxisAngle(Y_AXIS, a * Math.PI / 180).add(cur.l);
      } else {
        cur.az = flight.to.az;
        cur.p.lerpVectors(flight.from.p, flight.to.p, e);
        if (flight.leg) { cur.p.z += lift * 9; cur.p.y += lift * 2.4; } // pull back mid-flight so stations read as one world
      }
    }
    const S = STATIONS[slide], amp = (S.idle ?? .14) * (u === 1 ? 1 : 0);
    camera.position.copy(cur.p); camera.position.x += Math.sin(now * .22) * amp; camera.position.y += Math.cos(now * .17) * amp * .6;
    camera.lookAt(cur.l);

    const fly = flight && u < 1 ? Math.sin(Math.PI * u) : 0;
    bokeh.uniforms.focus.value = camera.position.distanceTo(cur.l);
    bokeh.uniforms.aperture.value = .00045 + fly * .0035;
    bokeh.uniforms.maxblur.value = .006 + fly * .016;

    const ee = ease((now - env.t0) / 1.8);
    scene.fog.density = THREE.MathUtils.lerp(env.from, env.to, ee);
    scene.background.lerpColors(env.bgFrom, env.bgTo, ee); scene.fog.color.copy(scene.background);

    const de = ease((now - dotTw.t0) / 1.7);
    dot.position.lerpVectors(dotTw.from, dotTw.to, de);
    dot.scale.setScalar(Math.max(1e-4, THREE.MathUtils.lerp(dotTw.sf, dotTw.st, de)));
    dot.material.color.copy(YEL);

    docs.update(now);
    groups.forEach((g, j) => g.visible = j === slide || (j === prev && u < 1));
    ticks[slide]?.({ t: now - tEnter, now, b: beat, m: mode, az: cur.az });

    composer.render();
    return { flying: u < 1 };
  }

  const v = new THREE.Vector3();
  const project = (i, at) => { v.set(...at).add(center(i)).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z < 1]; };
  return { enter, update, project, setScale, renderer, FLIGHT };
}
