const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-three-'));
const BASE_DIR = path.resolve(__dirname, '..');
const PORT = 9232;

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

    await send('Page.enable');
    await send('Runtime.enable');

    const home2Url = 'file:///' + path.join(BASE_DIR, 'home-2.html').replace(/\\/g, '/');
    await send('Page.navigate', { url: home2Url });
    await sleep(1500);

    const breakpoints = [320, 360, 375, 390, 414, 480, 768, 1024, 1440];
    const bpResults = [];

    for (const bp of breakpoints) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: bp, height: 900, deviceScaleFactor: 1, mobile: bp < 992
      });
      await sleep(150);

      const check = await send('Runtime.evaluate', {
        expression: `(() => {
          // 1. Hero Check
          const heroTitle = document.querySelector('.hero-title');
          const heroTitleR = heroTitle.getBoundingClientRect();
          const heroDesc = document.querySelector('.hero-desc');
          const heroDescR = heroDesc.getBoundingClientRect();
          const heroTitleStyle = window.getComputedStyle(heroTitle);

          // 2. Reserve Button Check
          const reserveBtn = document.querySelector('.reserve-generator-btn');
          const reserveBtnR = reserveBtn.getBoundingClientRect();
          const icon = reserveBtn.querySelector('i');
          const span = reserveBtn.querySelector('span');
          const iconR = icon.getBoundingClientRect();
          const spanR = span.getBoundingClientRect();

          // 3. Testimonial Cards Check
          const cards = Array.from(document.querySelectorAll('.testimonial-card')).map((c, i) => {
            const avatar = c.querySelector('.author-avatar');
            const avR = avatar ? avatar.getBoundingClientRect() : null;
            const name = c.querySelector('.author-name');
            const nameR = name ? name.getBoundingClientRect() : null;
            const role = c.querySelector('.author-role');
            const roleR = role ? role.getBoundingClientRect() : null;
            const text = c.querySelector('.testimonial-text');
            const textR = text ? text.getBoundingClientRect() : null;

            return {
              index: i,
              avatarWidth: avR ? Math.round(avR.width) : null,
              avatarHeight: avR ? Math.round(avR.height) : null,
              isCircular: avR ? Math.round(avR.width) === Math.round(avR.height) : false,
              name: name ? name.textContent.trim() : null,
              role: role ? role.textContent.trim() : null,
              roleHeight: roleR ? Math.round(roleR.height) : null
            };
          });

          return {
            hasHScroll: document.documentElement.scrollWidth > window.innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            windowWidth: window.innerWidth,
            hero: {
              width: Math.round(heroTitleR.width),
              height: Math.round(heroTitleR.height),
              fontSize: heroTitleStyle.fontSize,
              lineHeight: heroTitleStyle.lineHeight,
              estimatedLines: Math.round(heroTitleR.height / (parseFloat(heroTitleStyle.fontSize) * 1.2))
            },
            reserveBtn: {
              width: Math.round(reserveBtnR.width),
              height: Math.round(reserveBtnR.height),
              spanHeight: Math.round(spanR.height),
              isSingleLine: spanR.height <= 26,
              iconSpanDeltaY: Math.abs((iconR.top + iconR.height / 2) - (spanR.top + spanR.height / 2))
            },
            cards
          };
        })()`,
        returnByValue: true
      });

      if (!check || !check.result || !check.result.value) {
        console.error('EVAL ERROR at bp ' + bp + ':', JSON.stringify(check));
      }

      bpResults.push({ bp, result: check.result.value });
    }

    console.log('BREAKPOINT VERIFICATION SUMMARY:');
    for (const r of bpResults) {
      console.log(`BP ${r.bp}px: HScroll: ${r.result.hasHScroll} | Hero lines: ~${r.result.hero.estimatedLines} (${r.result.hero.fontSize}) | Btn singleLine: ${r.result.reserveBtn.isSingleLine} (H: ${r.result.reserveBtn.height}px) | Avatars circular: ${r.result.cards.every(c => c.isCircular)}`);
    }

    // Capture visual screenshots at 375px
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: true });
    await sleep(200);

    // 1. Screenshot of Hero Section
    const heroElem = await send('Runtime.evaluate', {
      expression: `(() => {
        const r = document.querySelector('.hero-section').getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 650) };
      })()`,
      returnByValue: true
    });
    const heroShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 375, height: Math.round(heroElem.result.value.height), scale: 1 }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_home2_hero_375px.png'), Buffer.from(heroShot.data, 'base64'));
    console.log('Saved scratch/verified_home2_hero_375px.png');

    // 2. Screenshot of Reserve Button in Quick Sizer Card
    const btnElem = await send('Runtime.evaluate', {
      expression: `(() => {
        const r = document.querySelector('.quick-sizer-card').getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });
    const sizerShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.round(btnElem.result.value.x),
        y: Math.round(btnElem.result.value.y),
        width: Math.round(btnElem.result.value.width),
        height: Math.round(btnElem.result.value.height),
        scale: 1
      }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_quick_sizer_btn_375px.png'), Buffer.from(sizerShot.data, 'base64'));
    console.log('Saved scratch/verified_quick_sizer_btn_375px.png');

    // 3. Screenshot of Testimonial Cards Section
    const testElem = await send('Runtime.evaluate', {
      expression: `(() => {
        const r = document.querySelector('.testimonial-card').getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });
    const testShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.round(testElem.result.value.x),
        y: Math.round(testElem.result.value.y),
        width: Math.round(testElem.result.value.width),
        height: Math.round(testElem.result.value.height),
        scale: 1
      }
    });
    fs.writeFileSync(path.join(BASE_DIR, 'scratch/verified_testimonial_card_375px.png'), Buffer.from(testShot.data, 'base64'));
    console.log('Saved scratch/verified_testimonial_card_375px.png');

  } catch(e) {
    console.error('Test error:', e);
  } finally {
    try { chromeProc.kill(); } catch(e) {}
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch(e) {}
  }
}

main();
