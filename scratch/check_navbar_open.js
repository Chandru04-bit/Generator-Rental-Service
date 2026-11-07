const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-navbar-verify-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9227;

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
  await sleep(1200);

  try {
    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const testPages = [
      'index.html',
      'pages/booking.html',
      'pages/fleet.html',
      'pages/pricing.html',
      'pages/contact.html',
      'auth/login.html',
      'customer/dashboard.html'
    ];

    const results = [];

    for (const p of testPages) {
      const pageUrl = 'file:///' + path.join(BASE_DIR, p).replace(/\\/g, '/');
      await client.send('Page.navigate', { url: pageUrl });
      await sleep(350);

      for (const w of [320, 375, 414, 768, 1024, 1440]) {
        await client.send('Emulation.setDeviceMetricsOverride', {
          width: w, height: 800, deviceScaleFactor: 1, mobile: w < 992
        });
        await sleep(60);

        // Click navbar toggler if present to open menu
        const navState = await client.eval(`
          (() => {
            const toggler = document.querySelector('.navbar-toggler');
            const collapse = document.querySelector('.navbar-collapse');
            const brandImg = document.querySelector('.navbar-brand img');
            const brandRect = brandImg ? brandImg.getBoundingClientRect() : null;

            let togglerClicked = false;
            if (toggler && collapse && window.getComputedStyle(toggler).display !== 'none') {
              if (!collapse.classList.contains('show')) {
                toggler.click();
                togglerClicked = true;
              }
            }

            return {
              hasToggler: !!toggler,
              togglerVisible: toggler ? window.getComputedStyle(toggler).display !== 'none' : false,
              brandWidth: brandRect ? Math.round(brandRect.width) : null,
              brandHeight: brandRect ? Math.round(brandRect.height) : null,
              togglerClicked
            };
          })()
        `);

        await sleep(150);

        // Check if opened collapse overflows or has misalignments
        const openCheck = await client.eval(`
          (() => {
            const collapse = document.querySelector('.navbar-collapse.show');
            const navControls = document.querySelector('.powerrent-navbar .nav-controls');
            const bodyHScroll = document.documentElement.scrollWidth > window.innerWidth;
            
            let navControlsRect = null;
            let themeBtnRect = null;
            let dirBtnRect = null;
            let dashBtnRect = null;
            let authBtnRect = null;

            if (navControls) {
              navControlsRect = navControls.getBoundingClientRect();
              const themeBtn = navControls.querySelector('.theme-toggle-btn');
              const dirBtn = navControls.querySelector('.dir-toggle-btn');
              const dashBtn = navControls.querySelector('#navbar-dashboard-button');
              const authBtn = navControls.querySelector('#nav-auth-item > *');

              if (themeBtn) themeBtnRect = themeBtn.getBoundingClientRect();
              if (dirBtn) dirBtnRect = dirBtn.getBoundingClientRect();
              if (dashBtn) dashBtnRect = dashBtn.getBoundingClientRect();
              if (authBtn) authBtnRect = authBtn.getBoundingClientRect();
            }

            return {
              isOpen: !!collapse,
              bodyHScroll,
              scrollWidth: document.documentElement.scrollWidth,
              windowWidth: window.innerWidth,
              themeBtn: themeBtnRect ? { w: Math.round(themeBtnRect.width), h: Math.round(themeBtnRect.height) } : null,
              dirBtn: dirBtnRect ? { w: Math.round(dirBtnRect.width), h: Math.round(dirBtnRect.height) } : null,
              dashBtn: dashBtnRect ? { w: Math.round(dashBtnRect.width), h: Math.round(dashBtnRect.height) } : null,
              authBtn: authBtnRect ? { w: Math.round(authBtnRect.width), h: Math.round(authBtnRect.height) } : null
            };
          })()
        `);

        results.push({ page: p, width: w, navState, openCheck });
      }
    }

    fs.writeFileSync(path.join(BASE_DIR, 'scratch/navbar_check_results.json'), JSON.stringify(results, null, 2));
    console.log('Navbar check complete! Results saved.');

    // Print summary of any issues
    const issues = results.filter(r => r.openCheck.bodyHScroll || (r.openCheck.themeBtn && r.openCheck.themeBtn.h < 28));
    console.log(`Issues found: ${issues.length}`);
    if (issues.length > 0) {
      console.log(JSON.stringify(issues, null, 2));
    }
  } catch(e) {
    console.error('Navbar error:', e);
  } finally {
    try { chromeProc.kill('SIGKILL'); } catch(e) {}
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch(e) {}
  }
}

main();
