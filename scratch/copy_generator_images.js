const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
const destDir = path.resolve('assets/images/generators');

// 1. TitanPower 35kVA
const titanSrc = path.join(srcDir, 'titanpower_35kva_silent_generator_1794063717850.jpg');
fs.copyFileSync(titanSrc, path.join(destDir, 'gen-25-50-1.jpg'));
fs.copyFileSync(titanSrc, path.join(destDir, 'gen-25-50-2.jpg'));
console.log('Copied TitanPower 35kVA to gen-25-50-1.jpg and gen-25-50-2.jpg');

// 2. Volvo Penta 100kVA
const volvoSrc = path.join(srcDir, 'volvo_penta_100kva_silent_generator_1794063729578.jpg');
fs.copyFileSync(volvoSrc, path.join(destDir, 'gen-60-100-2.jpg'));
console.log('Copied Volvo Penta 100kVA to gen-60-100-2.jpg');

// 3. CAT 500kVA Container
const catSrc = path.join(srcDir, 'cat_500kva_container_generator_1794063747924.jpg');
fs.copyFileSync(catSrc, path.join(destDir, 'gen-300-500-2.jpg'));
console.log('Copied CAT 500kVA to gen-300-500-2.jpg');
