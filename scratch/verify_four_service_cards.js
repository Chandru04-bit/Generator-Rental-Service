const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-services-cards-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9251;

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

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${TEMP_USER_DATA}`
  ]);

  let versionInfo = null;
  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      versionInfo = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      if (versionInfo) break;
    } catch (e) {}
  }

  const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');

  const fileUrl = 'file:///' + path.resolve(BASE_DIR, 'pages/services.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await cdp.send('Page.navigate', { url: fileUrl });
  await sleep(1500);

  // Set 1280px desktop viewport
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(400);

  // Locate the 4 cards: 5, 6, 7, 8 in pages/services.html
  const rowClip = await cdp.eval(`(() => {
    const cards = Array.from(document.querySelectorAll('.service-card'));
    const targetCards = cards.filter(c => 
      c.textContent.includes('Emergency Power Backup') || 
      c.textContent.includes('Generator Installation') ||
      c.textContent.includes('Generator Maintenance') ||
      c.textContent.includes('Temporary Power Solutions')
    );
    if (targetCards.length === 0) return null;
    const docTop = window.pageYOffset || document.documentElement.scrollTop;
    
    let minX = 999999, minY = 999999, maxX = -999999, maxY = -999999;
    targetCards.forEach(c => {
      const r = c.getBoundingClientRect();
      minX = Math.min(minX, r.left);
      minY = Math.min(minY, r.top + docTop);
      maxX = Math.max(maxX, r.right);
      maxY = Math.max(maxY, r.bottom + docTop);
    });

    return {
      x: Math.max(0, Math.round(minX - 20)),
      y: Math.max(0, Math.round(minY - 20)),
      width: Math.min(1280, Math.round(maxX - minX + 40)),
      height: Math.round(maxY - minY + 40),
      scale: 1
    };
  })()`);

  console.log('4 Service cards clip:', rowClip);

  const desktopShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: rowClip
  });

  const artifactDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
  fs.writeFileSync(path.join(artifactDir, 'verified_four_service_cards_1280px.png'), Buffer.from(desktopShot.data, 'base64'));
  fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_four_service_cards_1280px.png'), Buffer.from(desktopShot.data, 'base64'));
  console.log('Saved verified_four_service_cards_1280px.png');

  // Dark mode desktop shot
  await cdp.eval(`(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
  })()`);
  await sleep(300);

  const darkShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: rowClip
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_four_service_cards_1280px_dark.png'), Buffer.from(darkShot.data, 'base64'));
  console.log('Saved verified_four_service_cards_1280px_dark.png');

  // Mobile 375px shot
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 2, mobile: true });
  await sleep(400);

  const mobileClip = await cdp.eval(`(() => {
    const cards = Array.from(document.querySelectorAll('.service-card'));
    const targetCards = cards.filter(c => 
      c.textContent.includes('Emergency Power Backup') || 
      c.textContent.includes('Generator Installation')
    );
    const docTop = window.pageYOffset || document.documentElement.scrollTop;
    let minX = 0, minY = 999999, maxY = -999999;
    targetCards.forEach(c => {
      const r = c.getBoundingClientRect();
      minY = Math.min(minY, r.top + docTop);
      maxY = Math.max(maxY, r.bottom + docTop);
    });
    return {
      x: 0,
      y: Math.max(0, Math.round(minY - 15)),
      width: 375,
      height: Math.round(maxY - minY + 30),
      scale: 1
    };
  })()`);

  const mobileShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: mobileClip
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_four_service_cards_375px.png'), Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved verified_four_service_cards_375px.png');

  chromeProc.kill();
  console.log('All 4 service cards screenshots complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
