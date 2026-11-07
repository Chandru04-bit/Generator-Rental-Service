const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit-site-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9225;

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
  console.log(`Starting headless Chrome for audit across ${PAGES.length} pages and ${BREAKPOINTS.length} breakpoints...`);
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

  await sleep(1500);

  try {
    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    // Enable Page and Runtime
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const issues = [];

    for (const pageRel of PAGES) {
      const pageFile = path.join(BASE_DIR, pageRel);
      if (!fs.existsSync(pageFile)) {
        issues.push({ page: pageRel, issue: 'File does not exist' });
        continue;
      }
      const pageUrl = 'file:///' + pageFile.replace(/\\/g, '/');

      // Navigate to page
      await client.send('Page.navigate', { url: pageUrl });
      await sleep(400);

      // Check console errors / broken images on load (default viewport)
      const pageErrors = await client.eval(`
        (() => {
          const errs = [];
          // check broken images
          const imgs = Array.from(document.querySelectorAll('img'));
          const brokenImgs = imgs.filter(img => {
            return img.src && (!img.complete || img.naturalWidth === 0);
          }).map(img => img.src || img.getAttribute('src'));

          if (brokenImgs.length > 0) {
            errs.push('Broken images: ' + brokenImgs.slice(0, 5).join(', '));
          }

          return errs;
        })()
      `);

      if (pageErrors && pageErrors.length > 0) {
        issues.push({ page: pageRel, issues: pageErrors });
      }

      // Check key breakpoints for horizontal overflow and element overflows
      for (const bp of BREAKPOINTS) {
        await client.send('Emulation.setDeviceMetricsOverride', {
          width: bp,
          height: 800,
          deviceScaleFactor: 1,
          mobile: bp < 992
        });
        await sleep(100);

        const bpAudit = await client.eval(`
          (() => {
            const results = {
              hasHScroll: document.documentElement.scrollWidth > window.innerWidth,
              scrollWidth: document.documentElement.scrollWidth,
              windowWidth: window.innerWidth,
              overflowingElements: []
            };

            if (results.hasHScroll) {
              const all = Array.from(document.querySelectorAll('*'));
              for (const el of all) {
                // skip svg defs, scripts, styles
                const tag = el.tagName.toLowerCase();
                if (['script', 'style', 'head', 'meta', 'link', 'title'].includes(tag)) continue;
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.right > window.innerWidth + 2) {
                  // check if it's intentionally scrollable
                  const style = window.getComputedStyle(el);
                  if (style.overflowX === 'auto' || style.overflowX === 'scroll') continue;
                  
                  // capture class/tag
                  const id = el.id ? '#' + el.id : '';
                  const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
                  results.overflowingElements.push({
                    selector: tag + id + cls,
                    right: Math.round(rect.right),
                    width: Math.round(rect.width)
                  });
                  if (results.overflowingElements.length >= 5) break;
                }
              }
            }

            // Check badges and section tags wrapping
            const sectionTags = Array.from(document.querySelectorAll('.section-tag')).map(st => {
              const rect = st.getBoundingClientRect();
              return {
                text: st.textContent.trim(),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                lineCount: Math.round(rect.height / 20)
              };
            });

            // Check buttons
            const buttons = Array.from(document.querySelectorAll('.btn, button')).map(b => {
              const r = b.getBoundingClientRect();
              return {
                text: b.textContent.trim().slice(0, 20),
                w: Math.round(r.w),
                h: Math.round(r.h),
                overflows: r.right > window.innerWidth + 1
              };
            }).filter(b => b.overflows || b.h < 28 && b.text.length > 0);

            return {
              ...results,
              sectionTags: sectionTags.filter(st => st.height > 42),
              problemButtons: buttons
            };
          })()
        `);

        if (bpAudit.hasHScroll) {
          issues.push({
            page: pageRel,
            breakpoint: bp,
            type: 'HORIZONTAL_OVERFLOW',
            scrollWidth: bpAudit.scrollWidth,
            windowWidth: bpAudit.windowWidth,
            elements: bpAudit.overflowingElements
          });
        }

        if (bpAudit.sectionTags && bpAudit.sectionTags.length > 0) {
          issues.push({
            page: pageRel,
            breakpoint: bp,
            type: 'SECTION_TAG_WRAPPING',
            tags: bpAudit.sectionTags
          });
        }

        if (bpAudit.problemButtons && bpAudit.problemButtons.length > 0) {
          issues.push({
            page: pageRel,
            breakpoint: bp,
            type: 'PROBLEM_BUTTONS',
            buttons: bpAudit.problemButtons
          });
        }
      }
    }

    console.log('--- AUDIT RESULTS ---');
    console.log(`Total issues found: ${issues.length}`);
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/audit_report.json'), JSON.stringify(issues, null, 2));
    
    // Group issues by type
    const grouped = {};
    for (const iss of issues) {
      const k = iss.type || 'PAGE_ERROR';
      grouped[k] = (grouped[k] || 0) + 1;
    }
    console.log('Issue counts by type:', JSON.stringify(grouped, null, 2));

  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    try { chromeProc.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch (e) {}
  }
}

main();
