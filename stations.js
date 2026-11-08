// One entry per slide: where the camera rests, how foggy the world is, where the
// dot sits, how the documents are arranged, and which labels are pinned to the scene.
export const SPACING = 46;

const stacks7 = 'stacks@7', stacks11 = 'stacks@11', stacks14 = 'stacks@14';

export const CLUSTERS = [[-4.7, 3.2, -2], [4.5, 3.4, -2.6], [-4.5, -3.3, -1.4], [4.7, -3.2, -2.2]];
export const WAYPOINTS = [0, 1, 2, 3, 4, 5, 6].map(k => [Math.sin(k * .95) * 3.1, 0, -k * 3.4]);
export const BLOCKS = [-5.1, -2.55, 0, 2.55, 5.1];

export const STATIONS = [
  /* 1  */ { cam: { p: [0, 0, 17], l: [0, 0, 0] }, fog: .085, dot: [0, 0, 0, 1], docs: 'field' },
  /* 2  */ { cam: { p: [1.5, 1.5, 6.4], l: [.15, 1.02, 0] }, idle: 0, fog: .1, dot: null, docs: 'field' },
  /* 3  */ { cam: { p: [-3, 10.5, 13], l: [0, 0, -8] }, fog: .022, dot: [0, .6, 0, .22], docs: 'field',
    labels: WAYPOINTS.map(([x, , z], k) => ({ t: '0' + (k + 1), at: [x, .05, z + 1.05], after: k * .12 })) },
  /* 4  */ { cam: { p: [0, 2.4, 17], l: [0, 1.4, 0] }, fog: .05, dot: [0, 4.1, 0, .4], docs: 'field' },
  /* 5  */ { cam: { p: [0, 0, 23], l: [0, 0, 0] }, fog: .03, dot: null, docs: 'clusters', kav: true,
    labels: [
      { t: 'Mevzuat', at: CLUSTERS[0] }, { t: 'Göç İdaresi', at: CLUSTERS[1] },
      { t: 'üniversite', at: CLUSTERS[2] }, { t: 'konsolosluk', at: CLUSTERS[3] },
      { t: 'Sahte ikamet siteleri', at: [0, -1.75, .5], after: .4 },
    ] },
  /* 6  */ { cam: { p: [1.6, .6, 23], l: [.4, 0, 0] }, fog: .014, dot: [-3.6, 2.2, .6, .42], docs: 'clusters' },
  /* 7  */ { cam: { p: [0, 5, 20], l: [0, .4, 0] }, fog: .03, dot: [0, 2.4, 0, .5], docs: 'clusters',
    labels: [
      { t: 'Adım 1', at: [-5, -.75, 1.2] }, { t: 'Adım 2', at: [0, -.75, 1.2] }, { t: 'Adım 3', at: [5, -.75, 1.2] },
      { t: 'Baro sicil kontrolü', at: [4.4, 3.2, 0], after: 2.2 },
    ] },
  /* 8  */ { cam: { p: [-1.2, 9.5, 23], l: [0, 2.2, 0] }, fog: .014, dot: [0, 6.3, 0, .5], docs: stacks7,
    labels: [
      { t: 'Kişiye özel hak rehberi', at: [-4.5, 4.2, 0], after: 2.6 }, { t: 'Süre takvimi', at: [0, 4.2, 0], after: 2.6 }, { t: 'Sarı Nokta avukatları', at: [4.5, 4.2, 0], after: 2.6 },
    ] },
  /* 9  */ { cam: b => ({ p: [0, .2, 11.6], l: [0, 0, 0], az: b * 360 + [-14, 10, -7][b] }), fog: .016, dot: null, docs: stacks7 },
  /* 10 */ { cam: b => b === 1 ? { p: [1.2, 16, 18], l: [0, 14.4, 0] } : { p: [2.5, 7.5, 21], l: [0, .2, 0] }, fog: .014, dot: b => b === 1 ? [2.2, 12.75, 0, .35] : [BLOCKS[0], 1.75, 0, .4], docs: stacks7,
    kav: true, hint: b => b === 1 ? 'Öğrenci · Ne öder?' : null,
    labels: [
      { t: 'Öğrenci<small>Ücretsiz</small>', at: [BLOCKS[0], -1.9, 1.1], after: .1 },
      { t: 'Üniversite<small>Kurumsal lisans<br>₺150.000 / yıl</small>', at: [BLOCKS[1], -1.9, 1.1], after: .2 },
      { t: 'Gönüllü avukat<small>Ücretsiz</small>', at: [BLOCKS[2], -1.9, 1.1], after: .3 },
      { t: 'Ücretli danışmanlık<small>Platform komisyonu<br>%15</small>', at: [BLOCKS[3], -1.9, 1.1], after: .4 },
      { t: 'Sponsor ve hibe<small>₺250.000</small>', at: [BLOCKS[4], -1.9, 1.1], after: .5 },
      // Before/after chart: bars to scale; every amount is the team's estimate, marked tahmini.
      { t: 'Ücretli avukat ya da aracı<small>~₺10.000 (tahmini)</small>', at: [-2.2, 13.7, 1.4], show: b => b === 1 }, { t: 'Ceza riski<small>~₺5.000 (tahmini)</small>', at: [-2.2, 16.25, 1.4], show: b => b === 1 },
      { t: 'Bugün', at: [-2.2, 11.3, 1.4], show: b => b === 1 }, { t: 'Sarı Nokta', y: true, at: [2.2, 11.3, 1.4], show: b => b === 1 },
      { t: 'Ücretsiz<small>₺0</small>', at: [2.2, 14, 0], show: b => b === 1 },
    ] },
  /* 11 */ { cam: { p: [0, 2.6, 21], l: [0, 0, 0] }, fog: .012, dot: null, docs: stacks7, kav: true },
  /* 12 */ { cam: { p: [0, 3.2, 17], l: [0, 1.2, -1] }, fog: (b, m) => m === 1 ? .085 : .006, dot: (b, m) => m === 2 ? [-1.8, 3.3, 1, .35] : null, docs: (b, m) => m === 1 ? 'scatter@11' : stacks11,
    hint: (b, m) => m === 1 ? 'Bugün' : '<span class="y">Sarı Nokta</span>' },
  /* 13 */ { cam: { p: [0, 18, 12], l: [0, 0, -.2] }, fog: .006, dot: [0, .4, 0, .3], docs: stacks11, kav: true,
    labels: [
      { t: 'Ankara', at: [0, .4, -1.05] },
      { t: 'Faz 1', at: [1.55, .3, 1.35], after: .4 }, { t: 'Faz 2', at: [3.2, .3, 2.5], after: 1.7 }, { t: 'Faz 3', at: [3.85, .3, 4.1], after: 3 },
    ] },
  /* 14 */ { cam: { p: [0, .5, 20.5], l: [0, 0, 0] }, fog: .004, dot: [0, 0, 0, .8], docs: stacks11,
    labels: [
      { t: 'Öğrenciler', at: [-4, .95, 0], after: .5 }, { t: 'Gönüllü avukatlar', at: [4, .95, 0], after: .5 },
      { t: 'Üniversiteler', at: [-4, -4.95, 0], after: .5 }, { t: 'Toplum · SDG 16', at: [4, -4.95, 0], after: .5 },
    ] },
  /* 15 */ { cam: { p: [0, 4.5, 23], l: [0, 2.2, 0] }, idle: 0, fog: 0, dot: [0, 6.2, 0, .9], docs: stacks14, bg: 'paper' },
];
