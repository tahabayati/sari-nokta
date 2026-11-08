// Re-renders fallback/*.png (and the PDF backup with --pdf). Serve the deck first, then from this folder:
//   npm i --no-save playwright-core && node tools/export.cjs
// Needs Google Chrome installed. Run it again after filling any placeholder.
const { chromium } = require('playwright-core'), path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8000/', OUT = path.join(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  await page.goto(BASE); await page.waitForFunction(() => window.__deck);
  if (!(await page.evaluate(() => __deck.state.gl))) throw new Error('WebGL unavailable: refusing to overwrite the fallback images');
  const frames = await page.evaluate(() => __deck.frames());
  for (const [i, b, m, name] of frames) {
    await page.evaluate(([i, b, m]) => __deck.seek(i, b, m), [i, b, m]);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, 'fallback', name + '.png') });
  }
  if (!process.argv.includes('--pdf')) { console.log(frames.length, 'frames exported (no PDF; add --pdf for one)'); return browser.close(); }
  const imgs = frames.map(f => `<img src="fallback/${f[3]}.png">`).join('');
  await page.setContent(`<base href="${BASE}"><style>@page{size:1920px 1080px;margin:0}html,body{margin:0}img{display:block;width:1920px;height:1080px;break-after:page}</style>${imgs}`, { waitUntil: 'load' });
  await page.pdf({ path: path.join(OUT, 'sari-nokta-yedek.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  console.log(frames.length, 'frames exported');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
