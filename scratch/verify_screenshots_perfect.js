const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-cdp-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9233;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) { this.wsUrl = wsUrl; this.id = 0; this.callbacks = new Map(); }
  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
    return res.result ? res.result.value : undefined;
  }
}

async function main() {
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    '--allow-file-access-from-files',
    '--disable-extensions',
    '--user-data-dir=' + TEMP_USER_DATA,
    'about:blank'
  ]);
  await sleep(1500);

  try {
    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const home2Url = 'file:///' + path.join(BASE_DIR, 'home-2.html').replace(/\\/g, '/');
    await client.send('Page.navigate', { url: home2Url });
    await sleep(800);

    const breakpoints = [320, 360, 375, 390, 414, 480, 768, 1024, 1440];
    console.log('--- VERIFYING THREE ISSUES ACROSS BREAKPOINTS ---');

    for (const bp of breakpoints) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: bp, height: 900, deviceScaleFactor: 1, mobile: bp < 992
      });
      await sleep(100);

      const res = await client.eval(`
        (() => {
          const heroTitle = document.querySelector('.hero-title');
          const heroDesc = document.querySelector('.hero-desc');
          const reserveBtn = document.querySelector('.reserve-generator-btn');
          const reserveSpan = reserveBtn ? reserveBtn.querySelector('span') : null;
          const reserveIcon = reserveBtn ? reserveBtn.querySelector('i') : null;

          const hR = heroTitle.getBoundingClientRect();
          const bR = reserveBtn.getBoundingClientRect();
          const sR = reserveSpan.getBoundingClientRect();
          const iR = reserveIcon.getBoundingClientRect();

          const cards = Array.from(document.querySelectorAll('.testimonial-card')).map(c => {
            const av = c.querySelector('.author-avatar');
            const ar = av ? av.getBoundingClientRect() : null;
            return {
              w: ar ? Math.round(ar.width) : 0,
              h: ar ? Math.round(ar.height) : 0,
              circle: ar ? Math.round(ar.width) === Math.round(ar.height) : false
            };
          });

          return {
            hasHScroll: document.documentElement.scrollWidth > window.innerWidth,
            hero: {
              w: Math.round(hR.width),
              h: Math.round(hR.height),
              fontSize: window.getComputedStyle(heroTitle).fontSize,
              lineHeight: window.getComputedStyle(heroTitle).lineHeight
            },
            btn: {
              w: Math.round(bR.width),
              h: Math.round(bR.height),
              spanH: Math.round(sR.height),
              singleLine: sR.height <= 26,
              iconY: Math.round(iR.top + iR.height/2),
              spanY: Math.round(sR.top + sR.height/2)
            },
            allAvatarsCircular: cards.every(c => c.circle),
            avatarSizes: cards.map(c => c.w + 'x' + c.h).join(', ')
          };
        })()
      `);

      console.log(`[BP ${bp}px] HScroll: ${res.hasHScroll} | Hero lines: ~${Math.round(res.hero.h / 32)} (${res.hero.fontSize}) | Btn: ${res.btn.w}x${res.btn.h}px (SingleLine: ${res.btn.singleLine}) | Avatars: ${res.avatarSizes} (AllCircular: ${res.allAvatarsCircular})`);
    }

    // Screenshots at 375px
    await client.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: true });
    await sleep(200);

    // 1. Hero Screenshot
    const heroShot = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 375, height: 500, scale: 1 }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_hero_home2_375px.png'), Buffer.from(heroShot.data, 'base64'));
    console.log('Screenshot saved: scratch/verified_hero_home2_375px.png');

    // 2. Reserve Button in Quick Sizer Card Screenshot
    const sizerRect = await client.eval(`
      (() => {
        const r = document.querySelector('.quick-sizer-card').getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      })()
    `);
    const sizerShot = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: sizerRect.x, y: sizerRect.y, width: sizerRect.width, height: sizerRect.height, scale: 1 }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_quick_sizer_375px.png'), Buffer.from(sizerShot.data, 'base64'));
    console.log('Screenshot saved: scratch/verified_quick_sizer_375px.png');

    // 3. Testimonial Card Screenshot
    const cardRect = await client.eval(`
      (() => {
        const r = document.querySelector('.testimonial-card').getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      })()
    `);
    const cardShot = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: cardRect.x, y: cardRect.y, width: cardRect.width, height: cardRect.height, scale: 1 }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_testimonial_375px.png'), Buffer.from(cardShot.data, 'base64'));
    console.log('Screenshot saved: scratch/verified_testimonial_375px.png');

    console.log('ALL VERIFICATIONS AND SCREENSHOTS COMPLETED SUCCESSFULLY!');
  } catch(e) {
    console.error('Run error:', e);
  } finally {
    try { chromeProc.kill('SIGKILL'); } catch(e) {}
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch(e) {}
  }
}

main();
