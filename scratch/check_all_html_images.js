const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

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
  'customer/profile.html',
  'components/navbar.html',
  'components/footer.html',
  'components/dashboard-sidebar.html'
];

let totalImg = 0;
let missingImg = 0;

for (const p of PAGES) {
  const fullP = path.join(baseDir, p);
  if (!fs.existsSync(fullP)) continue;
  const content = fs.readFileSync(fullP, 'utf8');
  const dirOfPage = path.dirname(fullP);

  // find img src
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let m;
  while ((m = imgRegex.exec(content)) !== null) {
    totalImg++;
    const src = m[1];
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) continue;
    // Resolve relative path
    const resolved = path.resolve(dirOfPage, src);
    if (!fs.existsSync(resolved)) {
      console.log(`[MISSING IMG] in ${p}: ${src} -> resolved ${resolved}`);
      missingImg++;
    }
  }

  // find background-image: url(...)
  const bgRegex = /url\(['"]?([^'"\)]+)['"]?\)/g;
  while ((m = bgRegex.exec(content)) !== null) {
    const src = m[1];
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) continue;
    const resolved = path.resolve(dirOfPage, src);
    if (!fs.existsSync(resolved)) {
      console.log(`[MISSING BG] in ${p}: ${src} -> resolved ${resolved}`);
      missingImg++;
    }
  }
}

console.log(`Checked ${totalImg} image references across ${PAGES.length} pages. Total missing: ${missingImg}`);
