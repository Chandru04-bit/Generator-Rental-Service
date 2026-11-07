const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-spotlight-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9244;

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

  console.log('\n--- VERIFYING SPOTLIGHT SECTION 3 ACROSS 11 BREAKPOINTS ---');
  let allPassed = true;

  for (const w of BREAKPOINTS) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: w < 768
    });
    await sleep(300);

    const metrics = await cdp.eval(`(() => {
      // Find Industrial section (Section 3)
      const sections = Array.from(document.querySelectorAll('section'));
      const sec = sections.find(s => s.textContent.includes('Industrial Power Solutions for Maximum Baseload Uptime'));
      if (!sec) return { error: 'Section not found' };

      const wrapper = sec.querySelector('.spotlight-image-wrapper');
      const img = sec.querySelector('.spotlight-img');
      const secRect = sec.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      const docEl = document.documentElement;
      const hasHScroll = docEl.scrollWidth > docEl.clientWidth;

      return {
        secHeight: Math.round(secRect.height),
        secBottom: Math.round(secRect.bottom),
        wrapHeight: Math.round(wrapRect.height),
        wrapWidth: Math.round(wrapRect.width),
        wrapBottom: Math.round(wrapRect.bottom),
        imgHeight: Math.round(imgRect.height),
        imgWidth: Math.round(imgRect.width),
        isInsideSec: Math.round(wrapRect.bottom) <= Math.round(secRect.bottom),
        hasHScroll,
        imgSrc: img.currentSrc || img.src
      };
    })()`);

    const isOk = !metrics.hasHScroll && metrics.isInsideSec && metrics.wrapHeight <= 450;
    if (!isOk) allPassed = false;

    console.log(
      `Breakpoint ${w}px: ${isOk ? 'PASS' : 'FAIL'} | wrap: ${metrics.wrapWidth}x${metrics.wrapHeight}px | secHeight: ${metrics.secHeight}px | insideSec: ${metrics.isInsideSec} | hasHScroll: ${metrics.hasHScroll}`
    );
  }

  // Capture desktop screenshot (1280px)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(400);

  const desktopClip = await cdp.eval(`(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Industrial Power Solutions'));
    const r = sec.getBoundingClientRect();
    return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height, scale: 1 };
  })()`);

  const desktopShot = await cdp.send('Page.captureScreenshot', { format: 'png', clip: desktopClip });
  fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_services_spotlight_1280px.png'), Buffer.from(desktopShot.data, 'base64'));
  console.log('Saved scratch/verified_services_spotlight_1280px.png');

  // Also save to brain artifact directory for artifact embedding
  const artifactDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
  if (fs.existsSync(artifactDir)) {
    fs.writeFileSync(path.join(artifactDir, 'verified_services_spotlight_1280px.png'), Buffer.from(desktopShot.data, 'base64'));
    console.log('Saved artifact verified_services_spotlight_1280px.png');
  }

  // Capture mobile screenshot (375px)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 2, mobile: true });
  await sleep(400);

  const mobileClip = await cdp.eval(`(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Industrial Power Solutions'));
    const r = sec.getBoundingClientRect();
    return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height, scale: 1 };
  })()`);

  const mobileShot = await cdp.send('Page.captureScreenshot', { format: 'png', clip: mobileClip });
  fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_services_spotlight_375px.png'), Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved scratch/verified_services_spotlight_375px.png');
  if (fs.existsSync(artifactDir)) {
    fs.writeFileSync(path.join(artifactDir, 'verified_services_spotlight_375px.png'), Buffer.from(mobileShot.data, 'base64'));
    console.log('Saved artifact verified_services_spotlight_375px.png');
  }

  chromeProc.kill();
  console.log('\nAll Spotlight checks passed:', allPassed);
}

run().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
