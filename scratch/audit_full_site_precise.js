const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit-precise-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9226;

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
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }
}

const PAGES = [
  'index.html',
  'home-2.html',
  'pages/about.html',
  'pages/services.html',
  'pages/service-details.html',
  'pages/fleet.html',
  'pages/generator-details.html',
  'pages/pricing.html',
  'pages/booking.html',
  'pages/booking-confirmation.html',
  'pages/blog.html',
  'pages/blog-details.html',
  'pages/contact.html',
  'pages/faq.html',
  'pages/team.html',
  'pages/404.html',
  'pages/coming-soon.html',
  'auth/login.html',
  'auth/register.html',
  'auth/forgot-password.html',
  'customer/dashboard.html',
  'customer/my-bookings.html',
  'customer/active-rentals.html',
  'customer/rental-history.html',
  'customer/invoices.html',
  'customer/invoice-details.html',
  'customer/profile.html'
];

const BREAKPOINTS = [320, 360, 375, 390, 414, 480, 768, 1024, 1280, 1440, 1920];

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

  await sleep(1500);

  try {
    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const issues = [];

    for (const pageRel of PAGES) {
      const pageFile = path.join(BASE_DIR, pageRel);
      const pageUrl = 'file:///' + pageFile.replace(/\\/g, '/');

      await client.send('Page.navigate', { url: pageUrl });
      await sleep(350);

      // Check for console errors
      const pageAudit = await client.eval(`
        (() => {
          const errs = [];
          // check if bootstrap loaded
          if (!window.bootstrap) errs.push('Bootstrap JS not loaded');
          return errs;
        })()
      `);

      for (const bp of BREAKPOINTS) {
        await client.send('Emulation.setDeviceMetricsOverride', {
          width: bp,
          height: 800,
          deviceScaleFactor: 1,
          mobile: bp < 992
        });
        await sleep(50);

        const bpAudit = await client.eval(`
          (() => {
            const hasHScroll = document.documentElement.scrollWidth > window.innerWidth;
            
            // Section tags wrapping check
            const sectionTags = Array.from(document.querySelectorAll('.section-tag')).map(st => {
              const r = st.getBoundingClientRect();
              return {
                text: st.textContent.replace(/\\s+/g, ' ').trim(),
                width: Math.round(r.width),
                height: Math.round(r.height),
                isMultiLine: r.height > 38
              };
            }).filter(st => st.isMultiLine);

            // Button touch target / clipping check outside of horizontal scroll containers
            const btns = Array.from(document.querySelectorAll('.btn:not(.table .btn)')).map(b => {
              const r = b.getBoundingClientRect();
              const text = b.textContent.replace(/\\s+/g, ' ').trim();
              const style = window.getComputedStyle(b);
              return {
                text: text.slice(0, 30),
                width: Math.round(r.width),
                height: Math.round(r.height),
                tooSmall: r.height < 32 && text.length > 0,
                overflowing: r.right > window.innerWidth + 2
              };
            }).filter(b => b.tooSmall || b.overflowing);

            return {
              hasHScroll,
              scrollWidth: document.documentElement.scrollWidth,
              sectionTags,
              btns
            };
          })()
        `);

        if (bpAudit.hasHScroll) {
          issues.push({ page: pageRel, bp, type: 'HORIZONTAL_OVERFLOW', scrollWidth: bpAudit.scrollWidth });
        }
        if (bpAudit.sectionTags.length > 0) {
          issues.push({ page: pageRel, bp, type: 'WRAPPED_SECTION_TAGS', tags: bpAudit.sectionTags });
        }
        if (bpAudit.btns.length > 0) {
          issues.push({ page: pageRel, bp, type: 'BUTTON_ISSUES', btns: bpAudit.btns });
        }
      }
    }

    console.log('PRECISE AUDIT COMPLETE:');
    console.log(`Total actionable items: ${issues.length}`);
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/audit_report_precise.json'), JSON.stringify(issues, null, 2));

    const counts = {};
    for (const i of issues) counts[i.type] = (counts[i.type] || 0) + 1;
    console.log('Issues by type:', counts);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { chromeProc.kill('SIGKILL'); } catch(e) {}
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch(e) {}
  }
}

main();
