const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-ss-'));
const PORT = 9231;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    '--allow-file-access-from-files',
    '--user-data-dir=' + TEMP_USER_DATA,
    'about:blank'
  ]);
  await sleep(1500);

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const targets = await listRes.json();
    const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 0;
    const send = (m, p = {}) => new Promise(res => {
      const cur = ++id;
      const h = (ev) => {
        const d = JSON.parse(ev.data);
        if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    const pageUrl = 'file:///' + path.resolve(__dirname, '../home-2.html').replace(/\\/g, '/');
    await send('Page.navigate', { url: pageUrl });
    await sleep(500);

    // Test at 375px (standard mobile)
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 800, deviceScaleFactor: 1, mobile: true });
    await sleep(200);

    const data = await send('Runtime.evaluate', {
      expression: `(() => {
        // Issue 1: Testimonials
        const testimonials = Array.from(document.querySelectorAll('.testimonial-card')).map(card => {
          const img = card.querySelector('.author-avatar');
          const author = card.querySelector('.testimonial-author');
          const copy = card.querySelector('.testimonial-author-copy');
          const name = card.querySelector('.author-name');
          const role = card.querySelector('.author-role');
          const text = card.querySelector('.testimonial-text');
          const stars = card.querySelector('.stars-rating');

          const imgR = img ? img.getBoundingClientRect() : null;
          const authorR = author ? author.getBoundingClientRect() : null;
          const nameR = name ? name.getBoundingClientRect() : null;
          const roleR = role ? role.getBoundingClientRect() : null;
          const cardR = card.getBoundingClientRect();

          return {
            cardH: Math.round(cardR.height),
            img: imgR ? { w: Math.round(imgR.width), h: Math.round(imgR.height), naturalW: img.naturalWidth, naturalH: img.naturalHeight } : null,
            authorH: authorR ? Math.round(authorR.height) : null,
            name: name ? name.textContent.trim() : null,
            nameW: nameR ? Math.round(nameR.width) : null,
            role: role ? role.textContent.trim() : null,
            roleW: roleR ? Math.round(roleR.width) : null,
            roleH: roleR ? Math.round(roleR.height) : null,
            roleWrapped: roleR ? roleR.height > 22 : false
          };
        });

        // Issue 2: Button Proceed to Reserve Generator
        const reserveBtn = document.querySelector('.reserve-generator-btn');
        const reserveBtnR = reserveBtn ? reserveBtn.getBoundingClientRect() : null;
        const icon = reserveBtn ? reserveBtn.querySelector('i') : null;
        const span = reserveBtn ? reserveBtn.querySelector('span') : null;
        const iconR = icon ? icon.getBoundingClientRect() : null;
        const spanR = span ? span.getBoundingClientRect() : null;

        // Issue 3: Hero Title
        const heroTitle = document.querySelector('.hero-title');
        const heroTitleR = heroTitle ? heroTitle.getBoundingClientRect() : null;
        const heroTitleStyle = heroTitle ? window.getComputedStyle(heroTitle) : null;
        const heroDesc = document.querySelector('.hero-desc');
        const heroDescR = heroDesc ? heroDesc.getBoundingClientRect() : null;

        return {
          testimonials,
          reserveBtn: {
            btnW: reserveBtnR ? Math.round(reserveBtnR.width) : null,
            btnH: reserveBtnR ? Math.round(reserveBtnR.height) : null,
            iconY: iconR ? Math.round(iconR.top) : null,
            spanY: spanR ? Math.round(spanR.top) : null,
            spanH: spanR ? Math.round(spanR.height) : null,
            spanWrapped: spanR ? spanR.height > 25 : false
          },
          hero: {
            titleW: heroTitleR ? Math.round(heroTitleR.width) : null,
            titleH: heroTitleR ? Math.round(heroTitleR.height) : null,
            fontSize: heroTitleStyle ? heroTitleStyle.fontSize : null,
            lineHeight: heroTitleStyle ? heroTitleStyle.lineHeight : null,
            inlineStyle: heroTitle ? heroTitle.getAttribute('style') : null,
            descH: heroDescR ? Math.round(heroDescR.height) : null
          }
        };
      })()`,
      returnByValue: true
    });

    console.log('AUDIT AT 375px:');
    console.log(JSON.stringify(data.result.value, null, 2));

  } catch(e) {
    console.error(e);
  } finally {
    try { chromeProc.kill(); } catch(e) {}
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch(e) {}
  }
}

main();
