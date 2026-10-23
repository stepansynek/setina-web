/* Statické rendery dílů pro img/. Spuštění: python3 -m http.server 8731 v kořeni webu, pak node tools/render-stills.js img (potřebuje playwright-core a Google Chrome). */
const { chromium } = require('playwright-core'); const fs = require('fs');
const out = process.argv[2];
const jobs = [
  { file: 'hridel-hero.webp', o: { part: 'shaft', axis: true, yaw: -0.3, pitch: 0.3, spin: 2.0, span: 0.86, tone: 'smalt', exposure: 1.0, w: 2400, h: 700 } },
  { file: 'priruba.webp', o: { part: 'flange', yaw: -0.5, pitch: 0.62, zoom: 1.05, tone: 'smalt', shadow: 0.75, exposure: 1.1, w: 1200, h: 900 } },
  { file: 'pouzdro-frezovane.webp', o: { part: 'housing', yaw: -0.55, pitch: 0.6, zoom: 1.05, tone: 'smalt', shadow: 0.75, exposure: 1.1, w: 1200, h: 900 } },
  { file: 'pouzdro-brousene.webp', o: { part: 'bushing', yaw: -0.5, pitch: 0.5, zoom: 1.05, tone: 'smalt', shadow: 0.75, exposure: 1.1, w: 1200, h: 900 } },
  { file: 'zakazka-ram.webp', o: { part: 'frame', yaw: -0.6, pitch: 0.42, zoom: 1.02, tone: 'smalt', shadow: 0.75, exposure: 1.1, w: 1200, h: 900 } },
  { file: 'zakazka-pripravek.webp', o: { part: 'fixture', yaw: -0.55, pitch: 0.5, zoom: 1.0, tone: 'smalt', shadow: 0.75, exposure: 1.1, w: 1200, h: 900 } },
  { file: 'zakazka-hridel.webp', o: { part: 'shaft', yaw: -1.05, pitch: 0.38, zoom: 1.45, tone: 'smalt', shadow: 0.75, exposure: 1.1, w: 1200, h: 900 } },
];
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const j of jobs) {
    const p = await b.newPage({ viewport: { width: j.o.w, height: j.o.h } });
    await p.goto((process.env.BASE || 'http://localhost:8731/') + 'tools/render-stills.html');
    const url = await p.evaluate(o => window.renderPart(o), j.o);
    fs.writeFileSync(out + '/' + j.file, Buffer.from(url.split(',')[1], 'base64'));
    console.log(j.file, url.length);
    await p.close();
  }
  await b.close();
})();
