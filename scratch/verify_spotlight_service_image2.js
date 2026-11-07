const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-spotlight2-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9245;

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
  if (!versionInfo) throw new Error('Could not connect to Chrome');

  const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');

  const BREAKPOINTS = [320, 360, 375, 390, 414, 480, 768, 1024, 1280, 1440, 1920];
  const fileUrl = 'file:///' + path.resolve(BASE_DIR, 'pages/services.html').replace(/\\/g, '/');

  console.log('Navigating to:', fileUrl);
  await cdp.send('Page.navigate', { url: fileUrl });
  await sleep(1000);

  // Capture desktop screenshot (1280px)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false });
  await sleep(400);

  const desktopClip = await cdp.eval(`(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Industrial Power Solutions'));
    sec.scrollIntoView({ block: 'center' });
    const r = sec.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.min(950, Math.round(r.height)), scale: 1 };
  })()`);

  await sleep(300);

  const desktopShot = await cdp.send('Page.captureScreenshot', { format: 'png', clip: desktopClip });
  fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_services_spotlight_1280px.png'), Buffer.from(desktopShot.data, 'base64'));

  const artifactDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
  if (fs.existsSync(artifactDir)) {
    fs.writeFileSync(path.join(artifactDir, 'verified_services_spotlight_1280px.png'), Buffer.from(desktopShot.data, 'base64'));
  }
  console.log('Saved verified_services_spotlight_1280px.png at rect:', desktopClip);

  // Capture mobile screenshot (375px)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 1200, deviceScaleFactor: 1, mobile: true });
  await sleep(400);

  const mobileClip = await cdp.eval(`(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Industrial Power Solutions'));
    sec.scrollIntoView({ block: 'start' });
    const r = sec.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.min(1150, Math.round(r.height)), scale: 1 };
  })()`);

  await sleep(300);

  const mobileShot = await cdp.send('Page.captureScreenshot', { format: 'png', clip: mobileClip });
  fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_services_spotlight_375px.png'), Buffer.from(mobileShot.data, 'base64'));
  if (fs.existsSync(artifactDir)) {
    fs.writeFileSync(path.join(artifactDir, 'verified_services_spotlight_375px.png'), Buffer.from(mobileShot.data, 'base64'));
  }
  console.log('Saved verified_services_spotlight_375px.png at rect:', mobileClip);

  chromeProc.kill();
  console.log('Done capturing screenshots!');
}

run().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
