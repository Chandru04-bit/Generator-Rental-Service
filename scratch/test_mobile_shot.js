const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-mob-shot-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9247;

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
  await cdp.send('Page.navigate', { url: fileUrl });
  await sleep(1500);

  // Set 375px mobile viewport
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 2, mobile: true });
  await sleep(500);

  const mobLoc = await cdp.eval(`(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Industrial Power Solutions'));
    const docTop = window.pageYOffset || document.documentElement.scrollTop;
    const r = sec.getBoundingClientRect();
    return {
      pageY: r.top + docTop,
      rHeight: r.height
    };
  })()`);

  console.log('Mobile section info:', mobLoc);

  const mobShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: Math.round(mobLoc.pageY),
      width: 375,
      height: Math.round(mobLoc.rHeight),
      scale: 1
    }
  });

  const artifactDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
  fs.writeFileSync(path.join(artifactDir, 'verified_services_spotlight_375px.png'), Buffer.from(mobShot.data, 'base64'));
  fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_services_spotlight_375px.png'), Buffer.from(mobShot.data, 'base64'));
  console.log('Successfully saved verified_services_spotlight_375px.png');

  chromeProc.kill();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
