const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-clean-'));
const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--remote-allow-origins=*',
  '--allow-file-access-from-files',
  '--disable-extensions',
  '--disable-component-extensions-with-background-pages',
  '--no-default-browser-check',
  '--no-first-run',
  '--user-data-dir=' + tempDir,
  'about:blank'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9223/json/list');
    const targets = await res.json();
    console.log('Clean Chrome targets:', JSON.stringify(targets.map(t => ({ url: t.url, type: t.type }))));
  } catch(e) {
    console.error('Fetch error:', e);
  } finally {
    chromeProc.kill('SIGKILL');
  }
}, 1500);
