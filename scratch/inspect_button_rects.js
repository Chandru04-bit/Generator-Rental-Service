const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_test_profile');
const FILE_URL = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
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
    return res.result.value;
  }

  close() { try { this.ws.close(); } catch(e) {} }
}

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--allow-file-access-from-files',
    `--user-data-dir=${PROFILE_DIR}`,
    '--disable-gpu',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 1500));
    const targets = await getJson('http://127.0.0.1:9222/json/list');
    const client = new CDPClient(targets[0].webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Page.navigate', { url: FILE_URL });
    await new Promise(r => setTimeout(r, 1500));

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 700,
      deviceScaleFactor: 1,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 300));

    const rects = await client.eval(`
      (() => {
        const collapse = document.getElementById('powerrentNavContent');
        if (collapse) {
          collapse.classList.add('show');
          collapse.style.display = 'block';
        }
        const themeBtn = document.querySelector('.powerrent-navbar .theme-toggle-btn');
        const dirBtn = document.querySelector('.powerrent-navbar .dir-toggle-btn');
        const dashBtn = document.getElementById('navbar-dashboard-button');
        const authItem = document.getElementById('nav-auth-item');

        const getInfo = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const s = window.getComputedStyle(el);
          return {
            left: r.left, right: r.right, top: r.top, bottom: r.bottom,
            width: r.width, height: r.height,
            display: s.display, flex: s.flex, widthCSS: s.width
          };
        };

        return {
          theme: getInfo(themeBtn),
          dir: getInfo(dirBtn),
          dash: getInfo(dashBtn),
          auth: getInfo(authItem)
        };
      })()
    `);

    console.log('Button rects at 320px:', JSON.stringify(rects, null, 2));
    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run();
