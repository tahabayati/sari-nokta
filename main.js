// Deck shell: navigation, rail, labels, fallback. All timing runs on a virtual clock.
import { SLIDES, frameName } from './content.js';
import { STATIONS } from './stations.js';
import { createWorld } from './world.js';

const $ = id => document.getElementById(id), rail = $('rail'), stage = $('stage'), labels = $('labels'), kav = $('kav'), hint = $('hint'), fb = $('fb');
const ch = new BroadcastChannel('sari-nokta');
let i = 0, b = 0, mode = 1, clock = 0, frozen = false, last = performance.now(), world = null, railAt = null, live = [];

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px,${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
  world?.setScale(Math.min(1.6, Math.max(.7, s * devicePixelRatio)));
}
addEventListener('resize', fit);

function paintRail() {
  rail.innerHTML = SLIDES[i].rail; rail.dataset.tone = SLIDES[i].tone || '';
  rail.querySelectorAll('.l').forEach((e, k) => e.style.setProperty('--i', k));
  flags();
}
function flags() {
  rail.dataset.b = b; rail.dataset.mode = i === 11 ? mode : '';
  const k = STATIONS[i].kav; kav.style.display = (typeof k === 'function' ? k(b, mode) : k) ? 'block' : 'none';
  const h = STATIONS[i].hint?.(b, mode); hint.style.display = h ? 'block' : 'none'; if (h) hint.innerHTML = h;
  if (!world) fb.src = `fallback/${frameName(i, b, mode)}.png`;
}
function paintLabels(arrive) {
  labels.innerHTML = '';
  live = (STATIONS[i].labels || []).map(L => {
    const el = document.createElement('div'); el.className = 'lb' + (L.y ? ' y' : ''); el.innerHTML = L.t.replace(/\[[^\]]+\]/g, m => `<span class="ph">${m}</span>`); labels.append(el);
    return { ...L, el, at0: arrive + (L.after || 0) };
  });
}

function go(ni, nb, nm, instant) {
  const moved = ni !== i || instant || !railAt && !rail.innerHTML;
  i = ni; b = nb; mode = nm;
  world?.enter(i, b, mode, clock, instant);
  if (moved) {
    paintLabels(instant || !world ? -1e6 : clock + world.FLIGHT * .82);
    if (instant || !world) { paintRail(); railAt = null; } else railAt = clock + world.FLIGHT * .52; // text lands as the camera arrives
  } else flags();
  broadcast();
}

const next = () => { if (b + 1 < SLIDES[i].beats) go(i, b + 1, mode); else if (i + 1 < SLIDES.length) go(i + 1, 0, 1); };
const prev = () => { if (b > 0) go(i, b - 1, mode); else if (i > 0) go(i - 1, SLIDES[i - 1].beats - 1, 1); };

function handle(key) {
  if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(key)) next();
  else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(key)) prev();
  else if ((key === '1' || key === '2') && i === 11) go(i, 0, +key);
  else return false;
  return true;
}
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (handle(e.key)) { e.preventDefault(); return; }
  const k = e.key.toLowerCase();
  if (k === 'f') document.fullscreenElement ? document.exitFullscreen() : stage.parentElement.requestFullscreen?.();
  if (k === 'p') window.open('presenter.html', 'sari-nokta-sunucu', 'popup,width=1100,height=720');
});

function broadcast() {
  ch.postMessage({ type: 'state', i, b, beats: SLIDES[i].beats, n: SLIDES.length, title: SLIDES[i].title, next: SLIDES[i + 1]?.title, mode });
}
ch.onmessage = ({ data }) => { if (data.type === 'hello') broadcast(); if (data.type === 'key') handle(data.key); };

function fallback() {
  document.documentElement.classList.add('nogl'); document.body.classList.add('nogl');
  world = null; fb.src = `fallback/${frameName(i, b, mode)}.png`;
}

function frame(t) {
  requestAnimationFrame(frame);
  if (!world) return;
  const dt = Math.min(.1, (t - last) / 1000); last = t;
  if (!frozen) clock += dt;
  render();
}
function render() {
  world.update(clock);
  if (railAt !== null && clock >= railAt) { railAt = null; paintRail(); }
  for (const L of live) {
    const [x, y] = world.project(i, typeof L.at === 'function' ? L.at(clock) : L.at);
    L.el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    L.el.classList.toggle('on', clock >= L.at0 && (!L.show || L.show(b, mode)));
  }
}

await Promise.all(['700 40px "Space Grotesk"', '500 40px "Space Grotesk"', '400 40px Inter', '600 40px Inter'].flatMap(f => ['a', 'ğ'].map(t => document.fonts.load(f, t))));
try { world = await createWorld($('gl')); $('gl').addEventListener('webglcontextlost', fallback); } catch (err) { world = null; document.body.classList.add('nogl'); document.documentElement.classList.add('nogl'); }
fit();
go(0, 0, 1, true);
if (world) { clock = 0; world.enter(0, 0, 1, 0, true); }
requestAnimationFrame(frame);

// Test and export hook: jump to a settled, frozen frame.
window.__deck = {
  seek(ni, nb = 0, nm = 1) { document.documentElement.classList.add('still'); frozen = false; clock = 998; go(ni, nb, nm, true); frozen = true; if (world) { render(); clock = 1000; render(); } flags(); },
  play() { frozen = false; document.documentElement.classList.remove('still'); },
  get state() { return { i, b, mode, clock, gl: !!world }; },
  frames() { const out = []; SLIDES.forEach((s, n) => { if (n === 11) out.push([n, 0, 1], [n, 0, 2]); else for (let k = 0; k < s.beats; k++) out.push([n, k, 1]); }); return out.map(f => [...f, frameName(...f)]); },
};
