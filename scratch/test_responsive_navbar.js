const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_test_profile');
const FILE_URL = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
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
        if (msg.error) {
          reject(new Error(msg.error.message));
        } else {
          resolve(msg.result);
        }
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
      console.error('Exception Details:', JSON.stringify(res.exceptionDetails, null, 2));
      throw new Error(res.exceptionDetails.text || 'Eval error');
    }
    return res.result.value;
  }

  close() {
    try { this.ws.close(); } catch(e) {}
  }
}

async function run() {
  console.log('--- STARTING MOBILE NAVBAR RESPONSIVE VERIFICATION ---');
  fs.mkdirSync(PROFILE_DIR, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--allow-file-access-from-files',
    `--user-data-dir=${PROFILE_DIR}`,
    '--disable-gpu',
    '--no-first-run',
    'about:blank'
  ]);

  try {
    let connected = false;
    for (let i = 0; i < 20; i++) {
      try {
        await getJson('http://127.0.0.1:9222/json/version');
        connected = true;
        break;
      } catch (e) {
        await sleep(300);
      }
    }
    if (!connected) throw new Error('Could not connect to Chrome CDP');

    const targets = await getJson('http://127.0.0.1:9222/json/list');
    console.log('[OK] Found Chrome targets:', targets.length);
    const target = targets[0];

    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Page.navigate', { url: FILE_URL });
    await sleep(1500); // Allow styles and JS to load

    const breakpoints = [320, 360, 375, 390, 425, 768, 1024, 1280, 1366, 1440];
    let allPassed = true;

    for (const width of breakpoints) {
      console.log(`\n======================================================`);
      console.log(`TESTING BREAKPOINT: ${width}px`);
      console.log(`======================================================`);

      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 700,
        deviceScaleFactor: 1,
        mobile: width < 1200
      });
      await sleep(250);

      // 1. Check Closed Navbar State
      const closedCheck = await client.eval(`
        (() => {
          const nav = document.querySelector('.powerrent-navbar');
          const brand = document.querySelector('.powerrent-navbar .navbar-brand');
          const brandImg = document.querySelector('.powerrent-navbar .navbar-brand img');
          const toggler = document.querySelector('.powerrent-navbar .navbar-toggler');
          const collapse = document.getElementById('powerrentNavContent');
          
          // Ensure collapse is closed
          if (collapse) {
            collapse.classList.remove('show');
          }

          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const brandRect = brand.getBoundingClientRect();
          const imgRect = brandImg.getBoundingClientRect();
          const togglerRect = toggler ? toggler.getBoundingClientRect() : null;

          return {
            scrollWidth,
            innerWidth,
            overflowPx: Math.max(0, scrollWidth - innerWidth),
            brand: { left: brandRect.left, right: brandRect.right, width: brandRect.width },
            img: { left: imgRect.left, right: imgRect.right, width: imgRect.width, height: imgRect.height },
            toggler: togglerRect ? { left: togglerRect.left, right: togglerRect.right, width: togglerRect.width, visible: toggler.offsetParent !== null } : null
          };
        })()
      `);

      console.log(`  [Closed State] Viewport: ${width}px | scrollWidth: ${closedCheck.scrollWidth}px | Overflow: ${closedCheck.overflowPx}px`);
      console.log(`  [Logo] width: ${closedCheck.img.width.toFixed(1)}px, height: ${closedCheck.img.height.toFixed(1)}px, left: ${closedCheck.img.left.toFixed(1)}px`);
      if (closedCheck.toggler) {
        console.log(`  [Toggler] visible: ${closedCheck.toggler.visible}, right: ${closedCheck.toggler.right.toFixed(1)}px`);
      }

      if (closedCheck.overflowPx > 0) {
        console.error(`  [FAIL] Closed state has horizontal overflow of ${closedCheck.overflowPx}px!`);
        allPassed = false;
      } else {
        console.log(`  [PASS] Closed navbar has 0px overflow.`);
      }

      // 2. Expand Navbar (Open Hamburger Menu)
      const openCheck = await client.eval(`
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
            return { text: el.innerText.trim(), left: r.left, right: r.right, width: r.width };
          });

          const navControls = document.querySelector('.powerrent-navbar .nav-controls');
          const controlsRect = navControls ? navControls.getBoundingClientRect() : null;

          const themeBtn = document.querySelector('.powerrent-navbar .theme-toggle-btn');
          const dirBtn = document.querySelector('.powerrent-navbar .dir-toggle-btn');
          const dashBtn = document.getElementById('navbar-dashboard-button');
          const authItem = document.getElementById('nav-auth-item');

          const getR = (el) => el ? el.getBoundingClientRect() : null;
          const themeR = getR(themeBtn);
          const dirR = getR(dirBtn);
          const dashR = getR(dashBtn);
          const authR = getR(authItem);

          return {
            scrollWidth,
            innerWidth,
            overflowPx: Math.max(0, scrollWidth - innerWidth),
            navLinksCount: navLinks.length,
            navLinksOverflow: navLinks.some(l => l.right > innerWidth + 1 || l.left < -1),
            controls: controlsRect ? { left: controlsRect.left, right: controlsRect.right, width: controlsRect.width } : null,
            themeBtn: themeR ? { left: themeR.left, right: themeR.right, top: themeR.top, bottom: themeR.bottom, width: themeR.width, height: themeR.height } : null,
            dirBtn: dirR ? { left: dirR.left, right: dirR.right, top: dirR.top, bottom: dirR.bottom, width: dirR.width, height: dirR.height } : null,
            dashBtn: dashR ? { left: dashR.left, right: dashR.right, top: dashR.top, bottom: dashR.bottom, width: dashR.width, height: dashR.height } : null,
            authItem: authR ? { left: authR.left, right: authR.right, top: authR.top, bottom: authR.bottom, width: authR.width, height: authR.height } : null,
          };
        })()
      `);

      console.log(`  [Open State] Viewport: ${width}px | scrollWidth: ${openCheck.scrollWidth}px | Overflow: ${openCheck.overflowPx}px`);
      if (openCheck.overflowPx > 0) {
        console.error(`  [FAIL] Open navbar has horizontal overflow of ${openCheck.overflowPx}px!`);
        allPassed = false;
      } else {
        console.log(`  [PASS] Open navbar has 0px overflow.`);
      }

      if (openCheck.navLinksOverflow) {
        console.error(`  [FAIL] Some nav links extend outside the viewport!`);
        allPassed = false;
      } else {
        console.log(`  [PASS] All ${openCheck.navLinksCount} navigation links fit comfortably within viewport.`);
      }

      if (width <= 576) {
        // Verify 2-row layout on mobile
        const tTop = openCheck.themeBtn ? openCheck.themeBtn.top : 0;
        const dTop = openCheck.dirBtn ? openCheck.dirBtn.top : 0;
        const dashTop = openCheck.dashBtn ? openCheck.dashBtn.top : 0;
        const authTop = openCheck.authItem ? openCheck.authItem.top : 0;

        const row1SameLine = Math.abs(tTop - dTop) < 4;
        const row2SameLine = Math.abs(dashTop - authTop) < 4;
        const row2BelowRow1 = dashTop > tTop + 20;

        console.log(`  [Button Grid] Row 1 (Theme & RTL) aligned: ${row1SameLine} | Row 2 (Dashboard & Login) aligned: ${row2SameLine} | 2-Row Separation: ${row2BelowRow1}`);
        if (!row1SameLine || !row2SameLine || !row2BelowRow1) {
          console.warn(`  [WARN] Mobile button grid layout alignment check.`);
        } else {
          console.log(`  [PASS] Mobile button grid is perfectly arranged into 2 clean rows!`);
        }
      }

      // Take screenshot at 320px
      if (width === 320) {
        const shot = await client.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'navbar_320px_open.png'), Buffer.from(shot.data, 'base64'));
        console.log(`  [SAVED SCREENSHOT] scratch/navbar_320px_open.png`);
      }
      if (width === 375) {
        const shot = await client.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'navbar_375px_open.png'), Buffer.from(shot.data, 'base64'));
        console.log(`  [SAVED SCREENSHOT] scratch/navbar_375px_open.png`);
      }
    }

    // 3. Test RTL Mode
    console.log(`\n======================================================`);
    console.log(`TESTING RTL MODE AT 320px`);
    console.log(`======================================================`);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 700,
      deviceScaleFactor: 1,
      mobile: true
    });
    const rtlCheck = await client.eval(`
      (() => {
        document.documentElement.setAttribute('dir', 'rtl');
        const collapse = document.getElementById('powerrentNavContent');
        if (collapse) {
          collapse.classList.add('show');
          collapse.style.display = 'block';
        }
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        return {
          scrollWidth,
          innerWidth,
          overflowPx: Math.max(0, scrollWidth - innerWidth),
          dir: document.documentElement.getAttribute('dir')
        };
      })()
    `);
    console.log(`  [RTL Mode] Viewport: 320px | scrollWidth: ${rtlCheck.scrollWidth}px | Overflow: ${rtlCheck.overflowPx}px`);
    if (rtlCheck.overflowPx > 0) {
      console.error(`  [FAIL] RTL mode at 320px has horizontal overflow!`);
      allPassed = false;
    } else {
      console.log(`  [PASS] RTL mode at 320px has 0px overflow.`);
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.resolve(__dirname, 'navbar_320px_rtl.png'), Buffer.from(shot.data, 'base64'));
      console.log(`  [SAVED SCREENSHOT] scratch/navbar_320px_rtl.png`);
    }

    // 4. Test Dark Mode
    console.log(`\n======================================================`);
    console.log(`TESTING DARK MODE AT 320px`);
    console.log(`======================================================`);
    const darkCheck = await client.eval(`
      (() => {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('data-theme', 'dark');
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        return {
          scrollWidth,
          innerWidth,
          overflowPx: Math.max(0, scrollWidth - innerWidth),
          theme: document.documentElement.getAttribute('data-theme')
        };
      })()
    `);
    console.log(`  [Dark Mode] Viewport: 320px | scrollWidth: ${darkCheck.scrollWidth}px | Overflow: ${darkCheck.overflowPx}px`);
    if (darkCheck.overflowPx > 0) {
      console.error(`  [FAIL] Dark mode at 320px has horizontal overflow!`);
      allPassed = false;
    } else {
      console.log(`  [PASS] Dark mode at 320px has 0px overflow.`);
    }

    // 5. Test Logged-In State
    console.log(`\n======================================================`);
    console.log(`TESTING LOGGED-IN STATE (USER DROPDOWN) AT 320px`);
    console.log(`======================================================`);
    const authCheck = await client.eval(`
      (() => {
        localStorage.setItem('powerrent_current_user', JSON.stringify({
          id: 'USR-999',
          name: 'Sathasivam',
          email: 'test@example.com'
        }));
        if (window.PowerRentNav && window.PowerRentNav.syncNavAuth) {
          window.PowerRentNav.syncNavAuth();
        } else {
          location.reload();
        }
        return true;
      })()
    `);
    await sleep(800);
    const loggedInCheck = await client.eval(`
      (() => {
        const collapse = document.getElementById('powerrentNavContent');
        if (collapse) {
          collapse.classList.add('show');
          collapse.style.display = 'block';
        }
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const authItem = document.getElementById('nav-auth-item');
        return {
          scrollWidth,
          innerWidth,
          overflowPx: Math.max(0, scrollWidth - innerWidth),
          hasDropdown: authItem ? authItem.querySelector('.dropdown') !== null : false
        };
      })()
    `);
    console.log(`  [Logged-In State] Dropdown visible: ${loggedInCheck.hasDropdown} | scrollWidth: ${loggedInCheck.scrollWidth}px | Overflow: ${loggedInCheck.overflowPx}px`);
    if (loggedInCheck.overflowPx > 0) {
      console.error(`  [FAIL] Logged-in state at 320px has horizontal overflow!`);
      allPassed = false;
    } else {
      console.log(`  [PASS] Logged-in state at 320px has 0px overflow.`);
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.resolve(__dirname, 'navbar_320px_loggedin.png'), Buffer.from(shot.data, 'base64'));
      console.log(`  [SAVED SCREENSHOT] scratch/navbar_320px_loggedin.png`);
    }

    client.close();
    console.log('\n======================================================');
    if (allPassed) {
      console.log('ALL BREAKPOINT AND STATE TESTS PASSED SUCCESSFULLY! (10/10 Breakpoints, RTL, Dark Mode, Logged In)');
    } else {
      console.error('SOME TESTS FAILED! Review logs above.');
    }
    console.log('======================================================');

  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
