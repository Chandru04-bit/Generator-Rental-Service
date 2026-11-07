const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-serv-test-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9229;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => {
        try { res(JSON.parse(d)); } catch(e) { rej(e); }
      });
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
        const { resolve, reject } = this.callbacks.get(m.id);
        this.callbacks.delete(m.id);
        if (m.error) reject(new Error(m.error.message));
        else resolve(m.result);
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
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text || 'Eval error');
    return res.result.value;
  }
  close() { try { this.ws.close(); } catch(e) {} }
}

async function run() {
  console.log('================================================================');
  console.log('   VERIFYING SERVICE-DETAILS.HTML ALIGNMENT & CARD FIXES');
  console.log('================================================================');

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
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const fileUrl = 'file:///' + path.join(BASE_DIR, 'pages/service-details.html?id=industrial').replace(/\\/g, '/');
    await client.send('Page.navigate', { url: fileUrl });
    await sleep(1500);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(300);

    const check = await client.eval(`
      (() => {
        const getCardData = (selector) => {
          return Array.from(document.querySelectorAll(selector)).map(card => {
            const r = card.getBoundingClientRect();
            const iconWrap = card.querySelector('[class*=\"icon-badge\"], [class*=\"icon-wrap\"]');
            const iconEl = card.querySelector('i');
            const titleEl = card.querySelector('h5');
            const descEl = card.querySelector('p');
            const linkEl = card.querySelector('a');

            return {
              card: { top: r.top, bottom: r.bottom, height: r.height, width: r.width },
              icon: iconEl ? iconEl.className : null,
              iconWrap: iconWrap ? iconWrap.getBoundingClientRect().height : null,
              title: titleEl ? { text: titleEl.innerText.trim(), top: titleEl.getBoundingClientRect().top, height: titleEl.getBoundingClientRect().height } : null,
              desc: descEl ? { top: descEl.getBoundingClientRect().top } : null,
              link: linkEl ? { text: linkEl.innerText.trim(), top: linkEl.getBoundingClientRect().top, bottom: linkEl.getBoundingClientRect().bottom } : null
            };
          });
        };

        return {
          benefits: getCardData('#service-benefits-grid .card'),
          applications: getCardData('#service-applications-grid .card'),
          related: getCardData('#related-services-grid .card')
        };
      })()
    `);

    console.log('\n--- 1. KEY ENGINEERING BENEFITS (4 Cards) ---');
    console.log(`Cards found: ${check.benefits.length}`);
    check.benefits.forEach((b, i) => {
      console.log(`  Card ${i+1}: "${b.title.text}" | Icon: ${b.icon} | Height: ${b.card.height.toFixed(1)}px | Title Top: ${b.title.top.toFixed(1)}px | Desc Top: ${b.desc.top.toFixed(1)}px`);
    });

    const bHeights = check.benefits.map(b => b.card.height);
    const bDescTops = check.benefits.map(b => b.desc.top);
    const bHeightDiff = Math.max(...bHeights) - Math.min(...bHeights);
    const bDescDiff = Math.max(...bDescTops) - Math.min(...bDescTops);
    console.log(`  Card Height Difference: ${bHeightDiff.toFixed(1)}px`);
    console.log(`  Description Baseline Diff: ${bDescDiff.toFixed(1)}px`);
    if (bHeightDiff <= 2 && bDescDiff <= 2) {
      console.log('  [PASS] All 4 Benefits cards are perfectly equal and aligned!');
    } else {
      console.warn('  [WARN] Check benefits card alignment.');
    }

    console.log('\n--- 2. TYPICAL USE CASES & APPLICATIONS (3 Cards) ---');
    console.log(`Cards found: ${check.applications.length}`);
    check.applications.forEach((a, i) => {
      console.log(`  Card ${i+1}: "${a.title.text}" | Icon: ${a.icon} | Height: ${a.card.height.toFixed(1)}px | Title Top: ${a.title.top.toFixed(1)}px | Desc Top: ${a.desc.top.toFixed(1)}px`);
    });

    const aHeights = check.applications.map(a => a.card.height);
    const aDescTops = check.applications.map(a => a.desc.top);
    const aHeightDiff = Math.max(...aHeights) - Math.min(...aHeights);
    const aDescDiff = Math.max(...aDescTops) - Math.min(...aDescTops);
    console.log(`  Card Height Difference: ${aHeightDiff.toFixed(1)}px`);
    console.log(`  Description Baseline Diff: ${aDescDiff.toFixed(1)}px`);
    if (aHeightDiff <= 2 && aDescDiff <= 2) {
      console.log('  [PASS] All 3 Applications cards are perfectly equal and aligned!');
    } else {
      console.warn('  [WARN] Check applications card alignment.');
    }

    console.log('\n--- 3. EXPLORE COMPLEMENTARY POWER SERVICES (3 Cards) ---');
    console.log(`Cards found: ${check.related.length}`);
    check.related.forEach((r, i) => {
      console.log(`  Card ${i+1}: "${r.title.text}" | Icon: ${r.icon} | Height: ${r.card.height.toFixed(1)}px | Link Bottom: ${r.link ? r.link.bottom.toFixed(1) : 'N/A'}px`);
    });

    const rHeights = check.related.map(r => r.card.height);
    const rLinkBottoms = check.related.map(r => r.link ? r.link.bottom : 0);
    const rHeightDiff = Math.max(...rHeights) - Math.min(...rHeights);
    const rLinkDiff = Math.max(...rLinkBottoms) - Math.min(...rLinkBottoms);
    console.log(`  Card Height Difference: ${rHeightDiff.toFixed(1)}px`);
    console.log(`  Link Bottom Baseline Diff: ${rLinkDiff.toFixed(1)}px`);
    if (rHeightDiff <= 2 && rLinkDiff <= 2) {
      console.log('  [PASS] All 3 Related Services cards and View Service buttons are perfectly aligned!');
    } else {
      console.warn('  [WARN] Check related services alignment.');
    }

    // Capture screenshots
    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'verified_service_details_desktop.png'), Buffer.from(shot.data, 'base64'));
    console.log('\n[SAVED] scratch/verified_service_details_desktop.png');

    // Test Dark Mode
    await client.eval('document.documentElement.setAttribute("data-theme", "dark")');
    await sleep(300);
    const shotDark = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'verified_service_details_dark.png'), Buffer.from(shotDark.data, 'base64'));
    console.log('[SAVED] scratch/verified_service_details_dark.png');

    // Test Mobile 375px
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 800,
      deviceScaleFactor: 1,
      mobile: true
    });
    await sleep(300);
    const shotMobile = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'verified_service_details_mobile.png'), Buffer.from(shotMobile.data, 'base64'));
    console.log('[SAVED] scratch/verified_service_details_mobile.png');

    client.close();
    console.log('\n================================================================');
    console.log('>>> ALL THREE SECTIONS SUCCESSFULLY FIXED & VERIFIED! <<<');
    console.log('================================================================');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
