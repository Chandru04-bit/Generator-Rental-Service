const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const genJsPath = path.join(baseDir, 'assets/js/generator.js');
const genJsContent = fs.readFileSync(genJsPath, 'utf8');

const regex = /"assets\/images\/[^"]+"/g;
const matches = genJsContent.match(regex) || [];

console.log(`Found ${matches.length} image references in generator.js`);
const missing = [];
for (const m of matches) {
  const rel = m.replace(/"/g, '');
  const full = path.join(baseDir, rel);
  if (!fs.existsSync(full)) {
    missing.push(rel);
  }
}

console.log(`Missing images from generator.js: ${missing.length}`);
if (missing.length > 0) {
  console.log(missing);
} else {
  console.log('All image paths in generator.js exist on disk!');
}
