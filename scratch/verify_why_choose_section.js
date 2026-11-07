const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-why-choose-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9250;

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

  const fileUrl = 'file:///' + path.resolve(BASE_DIR, 'home-2.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await cdp.send('Page.navigate', { url: fileUrl });
  await sleep(1500);

  // Set 1280px desktop viewport
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(400);

  // Locate the "Why Industry Leaders Choose PowerRent" section
  const sectionClip = await cdp.eval(`(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Why Industry Leaders Choose PowerRent'));
    const docTop = window.pageYOffset || document.documentElement.scrollTop;
    const r = sec.getBoundingClientRect();
    return {
      x: 0,
      y: Math.round(r.top + docTop),
      width: 1280,
      height: Math.round(r.height),
      scale: 1
    };
  })()`);

  console.log('Why choose section clip:', sectionClip);

  const desktopShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: sectionClip
  });

  const artifactDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
  fs.writeFileSync(path.join(artifactDir, 'verified_why_choose_section_1280px.png'), Buffer.from(desktopShot.data, 'base64'));
  fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_why_choose_section_1280px.png'), Buffer.from(desktopShot.data, 'base64'));
  console.log('Saved verified_why_choose_section_1280px.png');

  // Dark mode desktop shot
  await cdp.eval(`(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
  })()`);
  await sleep(300);

  const darkShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: sectionClip
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_why_choose_section_1280px_dark.png'), Buffer.from(darkShot.data, 'base64'));
  console.log('Saved verified_why_choose_section_1280px_dark.png');

  // Mobile 375px shot
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 2, mobile: true });
  await sleep(400);

  const mobileClip = await cdp.eval(`(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Why Industry Leaders Choose PowerRent'));
    const docTop = window.pageYOffset || document.documentElement.scrollTop;
    const r = sec.getBoundingClientRect();
    return {
      x: 0,
      y: Math.round(r.top + docTop),
      width: 375,
      height: Math.round(r.height),
      scale: 1
    };
  })()`);

  const mobileShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: mobileClip
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_why_choose_section_375px.png'), Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved verified_why_choose_section_375px.png');

  chromeProc.kill();
  console.log('All Why Choose verification screenshots complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
