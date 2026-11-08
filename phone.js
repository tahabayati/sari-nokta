// Generic phone (a plain rounded slab) with the three pptx screens drawn to CanvasTextures.
// Amina, 47 gün and the screens are mock data: every screen carries the draft label.
import * as THREE from 'three';

export const IMG = {};
export const loadImages = () => Promise.all(['shield', 'check', 'f1', 'f2', 'f4', 'f5', 'f6'].map(n => new Promise((ok, no) => {
  const im = new Image(); im.onload = () => { IMG[n] = im; ok(); }; im.onerror = () => no(new Error('missing image ' + n)); im.src = `assets/img/${n}.png`;
})));

const NAVY = '#14213D', PAPER = '#FBF8F0', SAND = '#E7E1D2', SLATE = '#3D4A63', YEL = '#F5B800';
const SG = (w, s) => `${w} ${s}px "Space Grotesk"`, IN = (w, s) => `${w} ${s}px Inter`;
const W = 800, H = 1708;

function box(x, c, X, Y, w, h, r) { x.fillStyle = c; x.beginPath(); x.roundRect(X, Y, w, h, r); x.fill(); }
function wrap(x, text, X, Y, maxW, lh) {
  let line = '';
  for (const w of text.split(' ')) {
    const t = line ? line + ' ' + w : w;
    if (x.measureText(t).width > maxW && line) { x.fillText(line, X, Y); Y += lh; line = w; } else line = t;
  }
  x.fillText(line, X, Y); return Y + lh;
}
function text(x, t, X, Y, font, c) { x.font = font; x.fillStyle = c; x.fillText(t, X, Y); }

const SCREENS = [
  (x) => { // Ana ekran
    x.drawImage(IMG.shield, 60, 92, 62, 62);
    text(x, 'sarı nokta', 136, 140, SG(700, 46), NAVY);
    text(x, 'Merhaba, Amina', 60, 262, SG(700, 66), NAVY);
    box(x, NAVY, 50, 320, 700, 500, 36);
    text(x, 'İkamet izninin bitmesine', 92, 408, IN(500, 40), PAPER);
    text(x, '47 gün', 88, 610, SG(700, 176), YEL);
    x.fillStyle = PAPER; x.fillRect(92, 680, 616, 2);
    text(x, 'Uzatma: 30 gün kala', 92, 756, IN(500, 40), PAPER);
    box(x, YEL, 50, 856, 700, 126, 28);
    x.textAlign = 'center'; text(x, 'Takvimi aç', 400, 938, SG(700, 50), NAVY); x.textAlign = 'left';
    box(x, SAND, 50, 1022, 700, 268, 28);
    text(x, 'Yeni bilgi', 92, 1094, SG(700, 40), NAVY);
    x.font = IN(500, 42); x.fillStyle = NAVY; wrap(x, 'Çalışma izni kuralları güncellendi', 92, 1166, 610, 56);
  },
  (x) => { // Hak rehberi
    text(x, 'Hak rehberi', 60, 170, SG(700, 74), NAVY);
    box(x, SAND, 50, 220, 700, 110, 26);
    text(x, 'Ara: çalışma, ikamet', 92, 292, IN(500, 40), SLATE);
    ['Çalışma izni alabilir miyim?', 'Hangi durumda sınır dışı?', 'İkamet nasıl uzatılır?', 'Mezun olunca ne olur?'].forEach((q, k) => {
      const Y = 400 + k * 250; x.fillStyle = NAVY; x.fillRect(60, Y, 680, 2);
      x.font = SG(700, 52); wrap(x, q, 60, Y + 92, 660, 62);
    });
    x.fillStyle = NAVY; x.fillRect(60, 1400, 680, 2);
  },
  (x) => { // Avukata sor
    box(x, NAVY, 0, 0, W, 260, 0);
    x.font = SG(700, 44); const name = 'Örnek İsim', w0 = x.measureText('Av. ').width, w1 = x.measureText(name).width;
    text(x, 'Av. ', 60, 130, SG(700, 44), PAPER);
    text(x, name, 60 + w0, 130, SG(700, 44), PAPER);
    x.drawImage(IMG.shield, 60, 164, 56, 56);
    text(x, 'Sarı Nokta', 128, 206, SG(700, 40), YEL);
    box(x, SAND, 250, 320, 500, 230, 30);
    x.font = IN(500, 40); x.fillStyle = NAVY; wrap(x, '1. sınıftayım. Part-time çalışabilir miyim?', 284, 390, 440, 54);
    box(x, NAVY, 50, 590, 590, 340, 30);
    x.font = IN(500, 40); x.fillStyle = PAPER; wrap(x, 'Lisans öğrencisi ilk yılı bitirince çalışma iznine başvurabilir.', 86, 664, 520, 54);
    box(x, SAND, 50, 1420, 700, 110, 55);
    text(x, 'Mesaj yaz', 100, 1490, IN(500, 40), SLATE);
  },
];

let textures = null;
function screenTextures(renderer) {
  return textures ||= SCREENS.map(draw => {
    const c = Object.assign(document.createElement('canvas'), { width: W, height: H }), x = c.getContext('2d');
    x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
    draw(x);
    x.textAlign = 'center'; text(x, 'Ekranlar tasarım taslağıdır', W / 2, H - 76, IN(600, 32), SLATE);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t;
  });
}

const rounded = (w, h, r) => {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
};

export function makePhone(renderer) {
  const tex = screenTextures(renderer), group = new THREE.Group(), BW = 3, BH = 6.2, D = .24;
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(BW, BH, .42), { depth: D, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 3, curveSegments: 16 }).translate(0, 0, -D / 2), new THREE.MeshLambertMaterial({ color: 0x3D4A63 }));
  group.add(body);
  const sw = BW - .2, sh = BH - .2, geo = new THREE.ShapeGeometry(rounded(sw, sh, .34), 16), uv = geo.attributes.uv, pos = geo.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / sw + .5, pos.getY(i) / sh + .5); // ShapeGeometry UVs are raw coordinates
  const mat = new THREE.MeshBasicMaterial({ map: tex[0], fog: false });
  const screen = new THREE.Mesh(geo, mat); screen.position.z = D / 2 + .035; group.add(screen);
  const mark = new THREE.Mesh(new THREE.CircleGeometry(.42, 40), new THREE.MeshBasicMaterial({ color: 0xF5B800, fog: false })); mark.rotation.y = Math.PI; mark.position.z = -D / 2 - .035; group.add(mark);
  let cur = 0;
  return { group, setScreen(i) { if (i !== cur) { cur = i; mat.map = tex[i]; } } };
}

// Generic ID card for the card-scan feature. Dates are a format mask, not real data.
export function cardTexture() {
  const c = Object.assign(document.createElement('canvas'), { width: 780, height: 492 }), x = c.getContext('2d');
  x.fillStyle = PAPER; x.fillRect(0, 0, 780, 492);
  x.fillStyle = SLATE; x.fillRect(0, 0, 780, 66); x.fillRect(44, 112, 190, 240);
  x.fillStyle = '#b7bcc7'; [112, 152, 192].forEach((y, k) => x.fillRect(274, y, 420 - k * 70, 20));
  text(x, 'GG.AA.YYYY', 274, 290, SG(700, 54), NAVY); text(x, 'GG.AA.YYYY', 274, 362, SG(700, 54), NAVY);
  x.fillStyle = YEL; x.fillRect(274, 378, 330, 8);
  text(x, 'kavramsal', 44, 448, IN(600, 34), NAVY);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export function iconTexture(name) {
  const c = Object.assign(document.createElement('canvas'), { width: 256, height: 256 }), x = c.getContext('2d');
  x.fillStyle = SAND; x.fillRect(0, 0, 256, 256); x.drawImage(IMG[name], 58, 58, 140, 140);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
