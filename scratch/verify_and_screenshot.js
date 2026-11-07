const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-screens-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9228;

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

    const pageUrl = 'file:///' + path.join(BASE_DIR, 'index.html').replace(/\\/g, '/');
    await client.send('Page.navigate', { url: pageUrl });
    await sleep(400);

    // Test mobile breakpoint (375px) matching user's screenshot
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 375, height: 800, deviceScaleFactor: 1, mobile: true
    });
    await sleep(150);

    const heroCheck = await client.eval(`
      (() => {
        const badge = document.querySelector('.hero-section .section-tag');
        const badgeRect = badge.getBoundingClientRect();
        const heroTitle = document.querySelector('.hero-title');
        const heroTitleRect = heroTitle.getBoundingClientRect();
        const heroButtons = Array.from(document.querySelectorAll('.hero-buttons .btn')).map(b => {
          const r = b.getBoundingClientRect();
          return {
            text: b.textContent.replace(/\\s+/g, ' ').trim(),
            w: Math.round(r.width),
            h: Math.round(r.height)
          };
        });
        const statsItems = Array.from(document.querySelectorAll('.hero-stats-item')).map(si => {
          const r = si.getBoundingClientRect();
          return {
            text: si.textContent.replace(/\\s+/g, ' ').trim(),
            w: Math.round(r.width),
            h: Math.round(r.height)
          };
        });

        return {
          badge: {
            text: badge.textContent.replace(/\\s+/g, ' ').trim(),
            width: Math.round(badgeRect.width),
            height: Math.round(badgeRect.height),
            singleLine: badgeRect.height <= 36
          },
          heroTitle: {
            width: Math.round(heroTitleRect.width),
            height: Math.round(heroTitleRect.height)
          },
          heroButtons,
          statsItems,
          hasHScroll: document.documentElement.scrollWidth > window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          windowWidth: window.innerWidth
        };
      })()
    `);

    console.log('INDEX HERO VERIFICATION (375px):');
    console.log(JSON.stringify(heroCheck, null, 2));

    // Capture screenshot of hero section at 375px
    const heroShot = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 375, height: 750, scale: 1 }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_hero_375px.png'), Buffer.from(heroShot.data, 'base64'));
    console.log('Saved scratch/verified_hero_375px.png');

    // Also test 320px (tiny mobile)
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 320, height: 800, deviceScaleFactor: 1, mobile: true
    });
    await sleep(150);

    const check320 = await client.eval(`
      (() => {
        const badge = document.querySelector('.hero-section .section-tag');
        const badgeRect = badge.getBoundingClientRect();
        return {
          badgeText: badge.textContent.replace(/\\s+/g, ' ').trim(),
          badgeWidth: Math.round(badgeRect.width),
          badgeHeight: Math.round(badgeRect.height),
          singleLine: badgeRect.height <= 36,
          hasHScroll: document.documentElement.scrollWidth > window.innerWidth
        };
      })()
    `);
    console.log('INDEX HERO VERIFICATION (320px):', JSON.stringify(check320, null, 2));

    // Capture screenshot at 320px
    const heroShot320 = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 320, height: 750, scale: 1 }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_hero_320px.png'), Buffer.from(heroShot320.data, 'base64'));
    console.log('Saved scratch/verified_hero_320px.png');

  } catch(e) {
    console.error('Verify error:', e);
  } finally {
    try { chromeProc.kill('SIGKILL'); } catch(e) {}
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch(e) {}
  }
}

main();
