const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-pages-test-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9225;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

class CDPClient {
  constructor(wsUrl) { this.wsUrl = wsUrl; this.id = 0; this.callbacks = new Map(); }
  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise(r => { this.ws.onopen = r; });
    this.ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.callbacks.has(m.id)) {
        const { resolve } = this.callbacks.get(m.id);
        this.callbacks.delete(m.id);
        resolve(m.result);
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
    return res.result.value;
  }
  close() { try { this.ws.close(); } catch(e) {} }
}

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    '--allow-file-access-from-files',
    '--disable-extensions',
    `--user-data-dir=${TEMP_USER_DATA}`,
    'about:blank'
  ]);

  try {
    await sleep(1500);
    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page');
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const testPages = [
      'index.html',
      'home-2.html',
      'pages/about.html',
      'pages/services.html',
      'pages/pricing.html',
      'pages/contact.html',
      'pages/blog.html',
      'customer/dashboard.html',
      'auth/login.html'
    ];

    console.log('Testing 320px viewport across all core pages:');
    for (const p of testPages) {
      const fileUrl = 'file:///' + path.join(BASE_DIR, p).replace(/\\/g, '/');
      await client.send('Page.navigate', { url: fileUrl });
      await sleep(800);

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: 320,
        height: 700,
        deviceScaleFactor: 1,
        mobile: true
      });

      const res = await client.eval(`
        (() => {
          const collapse = document.getElementById('powerrentNavContent');
          if (collapse) {
            collapse.classList.add('show');
            collapse.style.display = 'block';
          }
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
          };
        })()
      `);

      const status = res.overflowPx === 0 ? '[PASS]' : '[FAIL]';
      console.log(`  ${status} ${p.padEnd(25)} scrollWidth: ${res.scrollWidth}px | Overflow: ${res.overflowPx}px`);
    }

    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run();
