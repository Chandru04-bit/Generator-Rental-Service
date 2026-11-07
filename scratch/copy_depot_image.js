const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
const srcFile = path.join(srcDir, 'powerrent_depot_fleet_staging_1794064217871.jpg');
const destFile = path.resolve('assets/images/about/about-experience.jpg');

fs.copyFileSync(srcFile, destFile);
console.log('Successfully copied new depot fleet image to assets/images/about/about-experience.jpg');
