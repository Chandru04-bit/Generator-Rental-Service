const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\satha\\.gemini\\antigravity\\brain\\4048fb93-9629-4d51-b9f2-f7654bda034d';
const destDir = path.resolve('assets/images/services');

// 1. Emergency Power Backup
const emergencySrc = path.join(srcDir, 'emergency_power_backup_hospital_1794064856846.jpg');
fs.copyFileSync(emergencySrc, path.join(destDir, 'service-emergency.jpg'));
console.log('Copied service-emergency.jpg');

// 2. Generator Installation
const installSrc = path.join(srcDir, 'generator_installation_crane_1794064880207.jpg');
fs.copyFileSync(installSrc, path.join(destDir, 'service-installation.jpg'));
console.log('Copied service-installation.jpg');

// 3. Generator Maintenance
const maintSrc = path.join(srcDir, 'generator_maintenance_service_1794064899794.jpg');
fs.copyFileSync(maintSrc, path.join(destDir, 'service-maintenance.jpg'));
console.log('Copied service-maintenance.jpg');

// 4. Temporary Power Solutions
const tempSrc = path.join(srcDir, 'temporary_power_solutions_1794064943859.jpg');
fs.copyFileSync(tempSrc, path.join(destDir, 'service-temporary.jpg'));
console.log('Copied service-temporary.jpg');
