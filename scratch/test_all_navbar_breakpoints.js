const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-navbar-test-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9224;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

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
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

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
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      console.error('Eval Exception:', res.exceptionDetails);
      throw new Error(res.exceptionDetails.text || 'Eval error');
    }
    return res.result.value;
  }

  close() {
    try { this.ws.close(); } catch(e) {}
  }
}

async function run() {
  console.log('================================================================');
  console.log('   FULL AUTOMATED VERIFICATION: POWERRENT MOBILE NAVBAR');
  console.log('================================================================');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    '--allow-file-access-from-files',
    '--disable-extensions',
    '--disable-component-extensions-with-background-pages',
    '--no-default-browser-check',
    '--no-first-run',
    `--user-data-dir=${TEMP_USER_DATA}`,
    'about:blank'
  ]);

  try {
    let connected = false;
    for (let i = 0; i < 25; i++) {
      try {
        await getJson(`http://127.0.0.1:${PORT}/json/version`);
        connected = true;
        break;
      } catch (e) {
        await sleep(200);
      }
    }
    if (!connected) throw new Error('Could not connect to Chrome CDP');

    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page');
    console.log('[OK] Connected to Chrome Page Target:', pageTarget.webSocketDebuggerUrl);

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const indexUrl = 'file:///' + path.join(BASE_DIR, 'index.html').replace(/\\/g, '/');
    await client.send('Page.navigate', { url: indexUrl });
    await sleep(1500);

    const pageTitle = await client.eval('document.title');
    console.log('[OK] Successfully loaded:', pageTitle);

    const breakpoints = [320, 360, 375, 390, 425, 768, 1024, 1280, 1366, 1440];
    let allPassed = true;

    for (const width of breakpoints) {
      console.log(`\n----------------------------------------------------------------`);
      console.log(`BREAKPOINT: ${width}px`);
      console.log(`----------------------------------------------------------------`);

      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 700,
        deviceScaleFactor: 1,
        mobile: width < 1200
      });
      await sleep(200);

      // 1. Closed state
      const closed = await client.eval(`
        (() => {
          const collapse = document.getElementById('powerrentNavContent');
          if (collapse) {
            collapse.classList.remove('show');
            collapse.style.display = '';
          }
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const brand = document.querySelector('.powerrent-navbar .navbar-brand');
          const brandImg = document.querySelector('.powerrent-navbar .navbar-brand img');
          const toggler = document.querySelector('.powerrent-navbar .navbar-toggler');
          
          const br = brand.getBoundingClientRect();
          const ir = brandImg.getBoundingClientRect();
          const tr = toggler ? toggler.getBoundingClientRect() : null;

          return {
            scrollWidth,
            innerWidth,
            overflowPx: Math.max(0, scrollWidth - innerWidth),
            brandRight: br.right,
            imgWidth: ir.width,
            imgHeight: ir.height,
            imgLeft: ir.left,
            togglerVisible: toggler ? (toggler.offsetParent !== null && window.getComputedStyle(toggler).display !== 'none') : false,
            togglerRight: tr ? tr.right : null
          };
        })()
      `);

      console.log(`  [CLOSED] Viewport: ${width}px | scrollWidth: ${closed.scrollWidth}px | Overflow: ${closed.overflowPx}px`);
      console.log(`  [LOGO]   Width: ${closed.imgWidth.toFixed(1)}px, Height: ${closed.imgHeight.toFixed(1)}px, Left: ${closed.imgLeft.toFixed(1)}px`);
      if (width < 1200) {
        console.log(`  [TOGGLE] Visible: ${closed.togglerVisible}, Right: ${closed.togglerRight ? closed.togglerRight.toFixed(1) : 'N/A'}px`);
      }

      if (closed.overflowPx > 0) {
        console.error(`  [FAIL] Closed state has ${closed.overflowPx}px overflow!`);
        allPassed = false;
      } else {
        console.log(`  [PASS] Closed navbar has 0px overflow.`);
      }

      // 2. Open state
      const open = await client.eval(`
        (() => {
          const collapse = document.getElementById('powerrentNavContent');
          if (collapse) {
            collapse.classList.add('show');
            collapse.style.display = 'block';
          }
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          
          const navLinks = Array.from(document.querySelectorAll('.powerrent-navbar .navbar-nav .nav-link')).map(el => {
            const r = el.getBoundingClientRect();
            return { text: el.innerText.trim(), left: r.left, right: r.right };
          });

          const themeBtn = document.querySelector('.powerrent-navbar .theme-toggle-btn');
          const dirBtn = document.querySelector('.powerrent-navbar .dir-toggle-btn');
          const dashBtn = document.getElementById('navbar-dashboard-button');
          const authItem = document.getElementById('nav-auth-item');

          const getR = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
          };

          return {
            scrollWidth,
            innerWidth,
            overflowPx: Math.max(0, scrollWidth - innerWidth),
            linksCount: navLinks.length,
            linksOverflow: navLinks.some(l => l.right > innerWidth + 1 || l.left < -1),
            theme: getR(themeBtn),
            dir: getR(dirBtn),
            dash: getR(dashBtn),
            auth: getR(authItem)
          };
        })()
      `);

      console.log(`  [OPEN]   Viewport: ${width}px | scrollWidth: ${open.scrollWidth}px | Overflow: ${open.overflowPx}px`);
      if (open.overflowPx > 0) {
        console.error(`  [FAIL] Open navbar has ${open.overflowPx}px overflow!`);
        allPassed = false;
      } else {
        console.log(`  [PASS] Open navbar has 0px overflow.`);
      }

      if (open.linksOverflow) {
        console.error(`  [FAIL] Some nav links extend outside viewport!`);
        allPassed = false;
      } else {
        console.log(`  [PASS] All ${open.linksCount} navigation links fit properly inside.`);
      }

      if (width <= 576 && open.theme && open.dir && open.dash && open.auth) {
        const row1Diff = Math.abs(open.theme.top - open.dir.top);
        const row2Diff = Math.abs(open.dash.top - open.auth.top);
        const rowSeparation = open.dash.top - open.theme.top;

        console.log(`  [GRID]   Row 1 diff: ${row1Diff.toFixed(1)}px | Row 2 diff: ${row2Diff.toFixed(1)}px | Row 2 Y-Offset: ${rowSeparation.toFixed(1)}px`);
        console.log(`  [ROW 1]  Theme: [${open.theme.left.toFixed(0)}, ${open.theme.right.toFixed(0)}] w=${open.theme.width.toFixed(0)} h=${open.theme.height.toFixed(0)} | RTL: [${open.dir.left.toFixed(0)}, ${open.dir.right.toFixed(0)}] w=${open.dir.width.toFixed(0)} h=${open.dir.height.toFixed(0)}`);
        console.log(`  [ROW 2]  Dash:  [${open.dash.left.toFixed(0)}, ${open.dash.right.toFixed(0)}] w=${open.dash.width.toFixed(0)} h=${open.dash.height.toFixed(0)} | Login: [${open.auth.left.toFixed(0)}, ${open.auth.right.toFixed(0)}] w=${open.auth.width.toFixed(0)} h=${open.auth.height.toFixed(0)}`);

        if (row1Diff < 4 && row2Diff < 4 && rowSeparation >= 28) {
          console.log(`  [PASS] Perfectly structured 2-row button grid!`);
        } else {
          console.warn(`  [WARN] Check button grid row alignment.`);
        }
      }

      // Capture screenshot at 320px
      if (width === 320) {
        const shot = await client.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(__dirname, 'verified_navbar_320px_open.png'), Buffer.from(shot.data, 'base64'));
        console.log(`  [SAVED] scratch/verified_navbar_320px_open.png`);
      }
    }

    // RTL verification at 320px
    console.log(`\n----------------------------------------------------------------`);
    console.log(`TESTING RTL MODE AT 320px`);
    console.log(`----------------------------------------------------------------`);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 700,
      deviceScaleFactor: 1,
      mobile: true
    });
    const rtl = await client.eval(`
      (() => {
        document.documentElement.setAttribute('dir', 'rtl');
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
    console.log(`  [RTL] Viewport: 320px | scrollWidth: ${rtl.scrollWidth}px | Overflow: ${rtl.overflowPx}px`);
    if (rtl.overflowPx === 0) {
      console.log(`  [PASS] RTL mode has 0px overflow.`);
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, 'verified_navbar_320px_rtl.png'), Buffer.from(shot.data, 'base64'));
      console.log(`  [SAVED] scratch/verified_navbar_320px_rtl.png`);
    } else {
      console.error(`  [FAIL] RTL mode has ${rtl.overflowPx}px overflow!`);
      allPassed = false;
    }

    // Dark Mode verification at 320px
    console.log(`\n----------------------------------------------------------------`);
    console.log(`TESTING DARK MODE AT 320px`);
    console.log(`----------------------------------------------------------------`);
    const dark = await client.eval(`
      (() => {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('data-theme', 'dark');
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
        };
      })()
    `);
    console.log(`  [DARK] Viewport: 320px | scrollWidth: ${dark.scrollWidth}px | Overflow: ${dark.overflowPx}px`);
    if (dark.overflowPx === 0) {
      console.log(`  [PASS] Dark mode has 0px overflow.`);
    } else {
      console.error(`  [FAIL] Dark mode has ${dark.overflowPx}px overflow!`);
      allPassed = false;
    }

    // Logged-in verification at 320px
    console.log(`\n----------------------------------------------------------------`);
    console.log(`TESTING LOGGED-IN STATE AT 320px`);
    console.log(`----------------------------------------------------------------`);
    await client.eval(`
      (() => {
        localStorage.setItem('powerrent_user', JSON.stringify({
          id: 'USR-101',
          name: 'Alex Johnson',
          email: 'alex@example.com'
        }));
      })()
    `);
    await client.send('Page.navigate', { url: indexUrl });
    await sleep(1500);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 700,
      deviceScaleFactor: 1,
      mobile: true
    });
    const loggedIn = await client.eval(`
      (() => {
        const collapse = document.getElementById('powerrentNavContent');
        if (collapse) {
          collapse.classList.add('show');
          collapse.style.display = 'block';
        }
        const authItem = document.getElementById('nav-auth-item');
        const hasDropdown = authItem && authItem.querySelector('.dropdown') !== null;
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          hasDropdown
        };
      })()
    `);
    console.log(`  [LOGGED-IN] Dropdown created: ${loggedIn.hasDropdown} | scrollWidth: ${loggedIn.scrollWidth}px | Overflow: ${loggedIn.overflowPx}px`);
    if (loggedIn.overflowPx === 0 && loggedIn.hasDropdown) {
      console.log(`  [PASS] Logged-in state has 0px overflow and dropdown renders correctly.`);
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, 'verified_navbar_320px_loggedin.png'), Buffer.from(shot.data, 'base64'));
      console.log(`  [SAVED] scratch/verified_navbar_320px_loggedin.png`);
    } else {
      console.error(`  [FAIL] Logged-in state overflow or dropdown failure!`);
      allPassed = false;
    }

    client.close();
    console.log('\n================================================================');
    if (allPassed) {
      console.log('>>> ALL VERIFICATION TESTS PASSED (10/10 BREAKPOINTS, ZERO OVERFLOW) <<<');
    } else {
      console.error('>>> SOME TESTS FAILED! Check logs above <<<');
    }
    console.log('================================================================');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
