// What stands at each station. Each builder may return a tick({t,now,b,m,az}) animation.
import * as THREE from 'three';
import { WAYPOINTS, BLOCKS } from './stations.js';
import { makePhone, cardTexture, iconTexture } from './phone.js';

const hex = { navy: 0x14213D, paper: 0xFBF8F0, sand: 0xE7E1D2, slate: 0x3D4A63, yellow: 0xF5B800 };
const lam = c => new THREE.MeshLambertMaterial({ color: c });
const YELLOW = new THREE.MeshBasicMaterial({ color: hex.yellow, fog: false });
const ARRIVE = 1.9; // camera flight length: timelines start when the camera lands
const smooth = THREE.MathUtils.smoothstep, lerp = THREE.MathUtils.lerp;

export function figure(color) {
  const g = new THREE.Group(), m = lam(color);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.3, .62, 8, 20), m); body.position.y = .62;
  const head = new THREE.Mesh(new THREE.SphereGeometry(.23, 24, 16), m); head.position.y = 1.42;
  g.add(body, head); return g;
}
const badge = () => { const b = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .05, 32), YELLOW); b.rotation.x = Math.PI / 2; b.position.set(0, .86, .3); return b; };

function beam(a, b, r, mat) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10).translate(0, .5, 0), mat);
  m.position.copy(A); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); m.scale.y = d.length();
  m.userData.len = d.length(); return m;
}

function canvasTex(w, h, draw) {
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function slab(w, h, text) {
  const tex = canvasTex(Math.round(w * 170), Math.round(h * 170), (x, W, H) => {
    x.fillStyle = '#FBF8F0'; x.fillRect(0, 0, W, H); x.fillStyle = '#14213D';
    x.font = `700 ${Math.round(H * .34)}px "Space Grotesk"`; x.textBaseline = 'alphabetic'; x.fillText(text, H * .1, H * .9);
  });
  const side = lam(hex.sand);
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, .35), [side, side, side, side, new THREE.MeshBasicMaterial({ map: tex }), side]);
}

export const build = {
  0: (g, { dot, YEL }) => {
    const off = new THREE.Color(hex.slate);
    return ({ t }) => dot.material.color.lerpColors(off, YEL, smooth(t, .5, 1.5)); // the dot lights up alone
  },

  1: g => {
    g.add(figure(hex.slate));
    const card = new THREE.Mesh(new THREE.BoxGeometry(.72, .46, .02), lam(0x56627a));
    card.position.set(.68, .86, .55); card.rotation.set(-.35, -.3, .06); g.add(card);
  },

  2: g => {
    const m = lam(hex.sand), line = lam(hex.slate);
    WAYPOINTS.forEach((p, k) => {
      const d = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .1, 40), m); d.position.set(...p); g.add(d);
      if (k < 6) g.add(beam(p, WAYPOINTS[k + 1], .03, line));
    });
  },

  3: g => [-2.8, 0, 2.8].forEach(x => { const f = figure(hex.sand); f.position.set(x, 0, 0); f.scale.setScalar(1.55); g.add(f); }),

  4: g => { // a fake site that cannot be trusted; never yellow
    const tex = canvasTex(620, 420, (x, W, H) => {
      x.fillStyle = '#E7E1D2'; x.fillRect(0, 0, W, H); x.fillStyle = '#3D4A63'; x.fillRect(0, 0, W, 54);
      x.fillStyle = '#E7E1D2'; [28, 58, 88].forEach(c => { x.beginPath(); x.arc(c, 27, 9, 0, 7); x.fill(); }); x.fillRect(122, 16, 420, 22);
      x.fillStyle = '#3D4A63'; x.fillRect(40, 92, 340, 42); for (let y = 164; y < 340; y += 34) x.fillRect(40, y, 540 - (y % 7) * 28, 14); x.fillRect(40, 346, 180, 48);
    });
    const site = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 2.78), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    site.position.set(0, .15, .5); g.add(site);
    const pattern = [1, .3, 1, 1, .45, 1, .2, 1, 1, 1, .35, .8, 1, .25, 1, .6]; // irregular, about three changes a second
    return ({ now }) => site.material.opacity = pattern[Math.floor(now * 3) % pattern.length];
  },

  5: g => {
    const big = slab(6.3, 6.3, '16.3'); big.position.set(-1.6, 0, 0); g.add(big);
    const a = slab(3, 3, '16.10'), b = slab(3, 3, '16.b'); a.position.set(4, 1.65, -.4); b.position.set(4, -1.65, -.4); g.add(a, b);
  },

  6: g => { // the route: question, match, verified lawyer
    const m = lam(hex.sand), line = lam(hex.slate), node = x => { const d = new THREE.Mesh(new THREE.CylinderGeometry(.75, .75, .1, 44), m); d.position.set(x, 0, 0); g.add(d); };
    [-5, 0, 5].forEach(node); g.add(beam([-5, 0, 0], [5, 0, 0], .05, line));
    const student = new THREE.Mesh(new THREE.SphereGeometry(.36, 32, 20), new THREE.MeshLambertMaterial({ color: hex.paper })); g.add(student);
    const lawyer = figure(hex.sand); lawyer.position.set(5, 0, 0); lawyer.scale.setScalar(1.25); g.add(lawyer);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.62, .03, 10, 60), new THREE.MeshBasicMaterial({ color: hex.paper })); ring.rotation.x = Math.PI / 2; ring.position.x = 5; g.add(ring);
    const bd = badge(); lawyer.add(bd);
    return ({ t }) => {
      const T = t - ARRIVE;
      const x = T < 3 ? lerp(-5, 0, smooth(T, .4, 1.4)) : lerp(0, 3.85, smooth(T, 3.2, 4.2));
      student.position.set(x, .75, T < 3 ? 1 : lerp(1, .5, smooth(T, 3.2, 4.2)));
      ring.visible = T > 1.8 && T < 2.9; ring.position.y = lerp(.1, 2.2, smooth(T, 1.8, 2.8));
      bd.visible = T >= 2.9; bd.scale.setScalar(smooth(T, 2.9, 3.15) * 1.1 + 1e-3); // the badge exists only after the baro sicil check
    };
  },

  7: () => null, // documents form the stacks: the layout lives in world.js

  8: (g, { renderer }) => {
    const phone = makePhone(renderer); g.add(phone.group);
    return ({ az }) => phone.setScreen(THREE.MathUtils.clamp(Math.round(az / 360), 0, 2)); // the swap happens while the screen faces away
  },

  9: g => {
    BLOCKS.forEach((x, k) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), lam(k === 0 ? hex.paper : hex.slate)); b.position.set(x, 0, 0); g.add(b); // equal blocks: height carries no price
    });
    const seg = (y, c, H) => { const m = new THREE.Mesh(new THREE.BoxGeometry(2.8, H, 2.2).translate(0, H / 2, 0), lam(c)); m.position.set(-2.2, y, 0); g.add(m); return m; };
    const a = seg(12, hex.sand, 3.4), b = seg(15.4, 0x8a92a3, 1.7);
    const zero = new THREE.Mesh(new THREE.BoxGeometry(2.8, .1, 2.2), YELLOW); zero.position.set(2.2, 12.05, 0); g.add(zero);
    g.add(beam([-4.3, 12, 1.1], [4.3, 12, 1.1], .03, lam(hex.paper)));
    let mix = 0, last = 0;
    return ({ b: beat, now }) => {
      mix = THREE.MathUtils.clamp(mix + (beat === 1 ? 1 : -1) * (now - last) / 1.2, 0, 1); last = now;
      const h = Math.max(.001, smooth(mix, .25, 1));
      a.scale.y = b.scale.y = h; b.position.y = 12 + 3.4 * h;
    };
  },

  10: (g, { renderer, camera }) => {
    const phone = makePhone(renderer); g.add(phone.group);
    const side = lam(hex.slate);
    const obj = ['f1', 'f2', 'card', 'f4', 'f5', 'f6'].map(name => {
      if (name === 'card') { const m = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.7, .05), [side, side, side, side, new THREE.MeshBasicMaterial({ map: cardTexture() }), side]); g.add(m); return m; }
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.82, .82, .12, 48).rotateX(Math.PI / 2), [side, new THREE.MeshBasicMaterial({ map: iconTexture(name) }), side]); g.add(m); return m;
    });
    return ({ t }) => obj.forEach((m, k) => {
      const a = (k - 2) * Math.PI / 3 + (t - 1999) * .1; // exported frames use t=1999: the card rests beside the phone
      m.position.set(Math.cos(a) * 4.6, -Math.sin(a) * 2.6, Math.sin(a) * 4.6);
      m.lookAt(camera.position);
    });
  },

  11: (g) => {
    const student = figure(hex.sand); student.position.set(-1.8, 0, 1); student.scale.setScalar(1.5); g.add(student);
    const lawyer = figure(hex.sand); lawyer.position.set(1.9, 0, 1); lawyer.scale.setScalar(1.5); lawyer.add(badge()); g.add(lawyer);
    let mix = 0, last = 0;
    return ({ m, now }) => { mix = THREE.MathUtils.clamp(mix + (m === 2 ? 1 : -1) * (now - last) / 1.1, 0, 1); last = now; lawyer.scale.setScalar(1.5 * smooth(mix, 0, 1) + 1e-3); };
  },

  12: g => { // abstract dot map; no country outline, labelled kavramsal on the slide
    const pts = []; const sp = .42;
    for (let r = -16; r <= 16; r++) for (let q = -16; q <= 16; q++) { const x = (q + r / 2) * sp, z = r * sp * .866, d = Math.hypot(x, z); if (d < 5.7) pts.push([x, z, d]); }
    const mesh = new THREE.InstancedMesh(new THREE.CircleGeometry(.13, 18).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff }), pts.length);
    mesh.frustumCulled = false;
    const M = new THREE.Matrix4(), off = new THREE.Color(hex.slate), on = new THREE.Color(hex.yellow), c = new THREE.Color();
    pts.forEach((p, k) => { mesh.setMatrixAt(k, M.setPosition(p[0], 0, p[1])); mesh.setColorAt(k, off); });
    g.add(mesh);
    return ({ t }) => {
      const T = t - ARRIVE, R = T < 0 ? 0 : T < 1.4 ? lerp(0, 1.3, smooth(T, .1, .7)) : T < 2.7 ? lerp(1.3, 3.1, smooth(T, 1.4, 2)) : lerp(3.1, 5.8, smooth(T, 2.7, 3.5));
      pts.forEach((p, k) => mesh.setColorAt(k, c.copy(p[2] <= R ? on : off)));
      mesh.instanceColor.needsUpdate = true;
    };
  },

  13: g => {
    const beams = [];
    [[-4, 2.8], [4, 2.8], [-4, -3.1], [4, -3.1]].forEach(([x, y]) => {
      [-.8, 0, .8].forEach(dx => { const f = figure(hex.sand); f.position.set(x + dx, y - 1.25, 0); f.scale.setScalar(.82); g.add(f); });
      const b = beam([0, 0, 0], [x * .78, (y - .5) * .78, 0], .045, YELLOW); beams.push(b); g.add(b);
    });
    return ({ t }) => beams.forEach(b => b.scale.y = Math.max(.001, b.userData.len * smooth(t - ARRIVE, .1, .9)));
  },

  14: g => {
    const s = figure(hex.slate), l = figure(hex.slate); l.add(badge());
    s.position.set(-2.25, -1.5, 3.5); l.position.set(2.25, -1.5, 3.5); s.scale.setScalar(1.5); l.scale.setScalar(1.5); g.add(s, l);
  },
};
