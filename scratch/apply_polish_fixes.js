const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// 1. Update style.css
const styleCssPath = path.join(baseDir, 'assets/css/style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

// Ensure Inter import at top
if (!styleCss.includes('fonts.googleapis.com/css2?family=Inter')) {
  styleCss = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');\n\n" + styleCss;
}

// Polish .section-tag in style.css
const oldSectionTag = /\.section-tag\s*\{[^}]+\}/;
const newSectionTag = `.section-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--pr-accent);
  background: var(--pr-accent-light);
  padding: 6px 16px;
  border-radius: 50px;
  margin-bottom: 14px;
  max-width: 100%;
  text-align: center;
  line-height: 1.35;
  box-sizing: border-box;
}

.section-tag i {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05em;
  margin-top: -1px;
}`;

styleCss = styleCss.replace(oldSectionTag, newSectionTag);

// Add button active, disabled, focus-visible, and standard heights if not already present
if (!styleCss.includes('/* Polish: Button System Enhancements */')) {
  const btnEnhancements = `
/* Polish: Button System Enhancements */
.btn-pr-primary:active,
.btn-pr-outline:active,
.btn-pr-dark:active,
.btn-pr-secondary:active {
  transform: translateY(0) scale(0.98) !important;
}

.btn:focus-visible,
button:focus-visible,
a.btn:focus-visible {
  outline: 3px solid var(--pr-accent) !important;
  outline-offset: 2px !important;
}

.btn:disabled,
.btn.disabled,
button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  transform: none !important;
  box-shadow: none !important;
}

.btn-lg {
  min-height: 52px;
  padding: 12px 28px;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 8px;
}

.btn-sm {
  min-height: 38px;
  padding: 6px 14px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 6px;
}
`;
  styleCss += '\n' + btnEnhancements;
}

fs.writeFileSync(styleCssPath, styleCss, 'utf8');
console.log('Updated style.css');

// 2. Update responsive.css
const respCssPath = path.join(baseDir, 'assets/css/responsive.css');
let respCss = fs.readFileSync(respCssPath, 'utf8');

// Fix .dashboard-wrapper to .dashboard-layout
respCss = respCss.replace(/\.dashboard-wrapper\s*\{/g, '.dashboard-layout {');

// Append comprehensive responsive polish rules if not already present
if (!respCss.includes('/* Polish: Comprehensive Responsive Polish Enhancements */')) {
  const responsivePolish = `
/* Polish: Comprehensive Responsive Polish Enhancements */

/* Section Tag Mobile Scalability */
@media (max-width: 575.98px) {
  .section-tag {
    font-size: 0.74rem !important;
    letter-spacing: 0.8px !important;
    padding: 5px 12px !important;
    gap: 6px !important;
    margin-bottom: 12px !important;
    white-space: normal !important;
    line-height: 1.35 !important;
  }
  .section-tag i {
    font-size: 1em !important;
  }
}

@media (max-width: 359.98px) {
  .section-tag {
    font-size: 0.70rem !important;
    letter-spacing: 0.6px !important;
    padding: 4px 10px !important;
  }
}

/* Hero Buttons & Stats on Mobile */
@media (max-width: 767.98px) {
  .hero-buttons {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    gap: 10px !important;
    align-items: stretch !important;
  }
  .hero-buttons .btn {
    width: 100% !important;
    min-height: 48px !important;
    justify-content: center !important;
    text-align: center !important;
  }
  .hero-stats-badge {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 360px !important;
    margin: 28px auto 0 auto !important;
    padding: 16px 18px !important;
    gap: 12px !important;
  }
  .hero-stats-item {
    width: 100% !important;
    text-align: center !important;
    align-items: center !important;
  }
  .hero-stats-item:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    padding-bottom: 10px !important;
  }
}

/* Full Width Mobile Action & Form Buttons */
@media (max-width: 575.98px) {
  .cta-banner-actions .btn,
  .gen-card-actions .btn,
  .form-card .btn,
  #customer-login-form .login-submit-button,
  #customer-register-form .register-submit-button,
  #forgot-password-form button[type="submit"] {
    width: 100% !important;
    min-height: 48px !important;
    justify-content: center !important;
    text-align: center !important;
  }
}

/* Dashboard Responsive Layout & Sidebar */
@media (max-width: 991.98px) {
  .dashboard-layout {
    flex-direction: column !important;
  }
  .dashboard-sidebar {
    width: 100% !important;
    position: relative !important;
    height: auto !important;
    min-height: 0 !important;
  }
  .dashboard-sidebar .dash-nav {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    padding: 10px !important;
  }
  .dashboard-sidebar .dash-nav-item {
    margin-bottom: 0 !important;
    flex: 1 1 calc(50% - 6px) !important;
  }
  .dashboard-sidebar .dash-nav-link {
    padding: 8px 12px !important;
    font-size: 0.88rem !important;
  }
  .dashboard-sidebar .dashboard-user-card {
    padding: 12px 16px !important;
  }
  .dashboard-sidebar .dashboard-brand {
    padding: 16px !important;
  }
  .dashboard-sidebar .dash-sidebar-footer {
    display: flex !important;
    gap: 8px !important;
    padding: 12px 16px !important;
  }
  .dashboard-sidebar .dash-sidebar-footer > * {
    margin-bottom: 0 !important;
    flex: 1 !important;
  }
  .dashboard-topbar {
    padding: 12px 16px !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 12px !important;
  }
  .dashboard-topbar-actions {
    width: 100% !important;
    justify-content: flex-end !important;
  }
  .dashboard-content {
    padding: 18px 14px !important;
  }
}

@media (max-width: 480px) {
  .dashboard-sidebar .dash-nav-item {
    flex: 1 1 100% !important;
  }
}
`;
  respCss += '\n' + responsivePolish;
}

fs.writeFileSync(respCssPath, respCss, 'utf8');
console.log('Updated responsive.css');

// 3. Update index.html badge
const indexHtmlPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(
  '24/7 Prime & Emergency Power Services',
  '24/7 Prime & Emergency Power'
);
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('Updated index.html');

// 4. Update home-2.html
const home2HtmlPath = path.join(baseDir, 'home-2.html');
let home2Html = fs.readFileSync(home2HtmlPath, 'utf8');
home2Html = home2Html.replace(
  '<div class="d-flex flex-wrap gap-3 mb-4">',
  '<div class="d-flex flex-wrap gap-3 mb-4 hero-buttons">'
);
fs.writeFileSync(home2HtmlPath, home2Html, 'utf8');
console.log('Updated home-2.html');

// 5. Update pages/pricing.html
const pricingHtmlPath = path.join(baseDir, 'pages/pricing.html');
let pricingHtml = fs.readFileSync(pricingHtmlPath, 'utf8');
pricingHtml = pricingHtml.replace(
  'class="position-absolute bottom-0 start-0 m-4 p-4 rounded-3 shadow-lg bg-white border" style="max-width: 340px;"',
  'class="position-absolute bottom-0 start-0 m-3 m-sm-4 p-3 p-sm-4 rounded-3 shadow-lg bg-white border d-none d-sm-block max-w-320"'
);
fs.writeFileSync(pricingHtmlPath, pricingHtml, 'utf8');
console.log('Updated pages/pricing.html');

console.log('ALL POLISH FIXES APPLIED SUCCESSFULLY!');
