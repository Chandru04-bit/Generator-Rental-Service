const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// 1. UPDATE home-2.html
const home2Path = path.join(baseDir, 'home-2.html');
let home2 = fs.readFileSync(home2Path, 'utf8');

// Quick sizer card padding: p-4 -> p-3 p-sm-4
home2 = home2.replace(
  'class="quick-sizer-card p-4 bg-white text-dark rounded-4 shadow-lg border"',
  'class="quick-sizer-card p-3 p-sm-4 bg-white text-dark rounded-4 shadow-lg border"'
);

// Standardize testimonial cards in home-2.html
home2 = home2.replace(
  /<div class="testimonial-card p-4 bg-light-grey rounded-4 border h-100 shadow-sm">/g,
  '<div class="testimonial-card">'
);

// Standardize testimonial author divider class in home-2.html
home2 = home2.replace(
  /<div class="testimonial-author pt-3 border-top">/g,
  '<div class="testimonial-author">'
);

// Standardize stars rating class
home2 = home2.replace(
  /<div class="stars-rating mb-2">/g,
  '<div class="stars-rating">'
);

fs.writeFileSync(home2Path, home2, 'utf8');
console.log('Updated home-2.html');

// 2. UPDATE index.html
const indexPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Ensure index.html testimonial-author child div has class="testimonial-author-copy"
indexHtml = indexHtml.replace(
  /<div class="testimonial-author">\s*<img src="([^"]+)" alt="([^"]+)" class="author-avatar">\s*<div>\s*<div class="author-name">([^<]+)<\/div>\s*<div class="author-role">([^<]+)<\/div>\s*<\/div>\s*<\/div>/g,
  '<div class="testimonial-author">\n              <img src="$1" alt="$2" class="author-avatar">\n              <div class="testimonial-author-copy">\n                <h6 class="author-name mb-0 text-navy">$3</h6>\n                <span class="author-role small text-muted">$4</span>\n              </div>\n            </div>'
);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Updated index.html');

// 3. UPDATE style.css
const styleCssPath = path.join(baseDir, 'assets/css/style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

// Replace .hero-title in style.css
const heroTitleOld = /\.hero-title\s*\{[^}]+\}/;
const heroTitleNew = `.hero-title {
  font-size: clamp(1.85rem, 4vw + 0.5rem, 3.5rem);
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1.18;
  letter-spacing: -0.025em;
  margin-bottom: 1.25rem;
  hyphens: none;
  -webkit-hyphens: none;
  overflow-wrap: break-word;
  word-break: normal;
  text-wrap: balance;
}`;
styleCss = styleCss.replace(heroTitleOld, heroTitleNew);

// Replace .reserve-generator-btn and its children in style.css
const reserveBtnOld = /\.reserve-generator-btn\s*\{[\s\S]*?\.reserve-generator-btn span\s*\{[^}]+\}/;
const reserveBtnNew = `.reserve-generator-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 50px;
  padding: 11px 14px;
  font-size: clamp(0.82rem, 2.5vw, 0.98rem);
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  white-space: nowrap;
  border-radius: 8px;
  border: 2px solid var(--pr-accent);
  background-color: var(--pr-accent);
  color: #101C2C;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
  transition: var(--pr-transition);
  cursor: pointer;
}

.reserve-generator-btn:hover,
.reserve-generator-btn:focus {
  background-color: var(--pr-accent-hover);
  border-color: var(--pr-accent-hover);
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.45);
}

.reserve-generator-btn:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
}

.reserve-generator-btn i {
  font-size: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0;
  line-height: 1;
}

.reserve-generator-btn span {
  display: inline-block;
  white-space: nowrap;
}`;
styleCss = styleCss.replace(reserveBtnOld, reserveBtnNew);

// Replace .testimonial-card through .author-role in style.css
const testimonialOld = /\.testimonial-card\s*\{[\s\S]*?\.author-role\s*\{[^}]+\}/;
const testimonialNew = `.testimonial-card {
  background: var(--pr-card-bg);
  border: 1px solid var(--pr-border);
  border-radius: var(--pr-radius-lg);
  padding: 28px;
  box-shadow: var(--pr-shadow-sm);
  transition: var(--pr-transition);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--pr-shadow);
  border-color: var(--pr-accent);
}

.stars-rating {
  color: #F59E0B;
  font-size: 1rem;
  line-height: 1;
  letter-spacing: 2px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.testimonial-text {
  font-style: italic;
  font-size: 0.96rem;
  line-height: 1.65;
  color: var(--pr-text);
  margin-bottom: 20px;
  flex-grow: 1;
  overflow-wrap: break-word;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--pr-border);
  min-width: 0;
}

.author-avatar {
  width: 52px !important;
  height: 52px !important;
  min-width: 52px !important;
  min-height: 52px !important;
  max-width: 52px !important;
  max-height: 52px !important;
  flex: 0 0 52px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
  object-fit: cover !important;
  object-position: center !important;
  border: 2px solid var(--pr-accent) !important;
  display: block !important;
}

.testimonial-author-copy,
.testimonial-author > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  flex: 1 1 auto;
}

.author-name {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--pr-primary);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-role {
  display: block;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.35;
  color: var(--pr-text-muted);
  white-space: normal;
  overflow-wrap: break-word;
}`;
styleCss = styleCss.replace(testimonialOld, testimonialNew);

fs.writeFileSync(styleCssPath, styleCss, 'utf8');
console.log('Updated style.css');

// 4. UPDATE responsive.css
const respCssPath = path.join(baseDir, 'assets/css/responsive.css');
let respCss = fs.readFileSync(respCssPath, 'utf8');

// Replace .hero-section .hero-title in responsive.css (remove max-width: 22ch)
const respHeroOld = /\.hero-section \.hero-title\s*\{[\s\S]*?\.hero-section \.hero-desc\s*\{[\s\S]*?line-height: 1\.6;\s*\}/;
const respHeroNew = `.hero-section .hero-title {
    max-width: 100% !important;
    margin-right: auto !important;
    margin-left: auto !important;
    font-size: clamp(1.75rem, 5.2vw, 2.45rem) !important;
    line-height: 1.2 !important;
    letter-spacing: -0.02em !important;
    text-align: center !important;
    hyphens: none !important;
    -webkit-hyphens: none !important;
    text-wrap: balance !important;
  }
  .hero-section .hero-desc {
    margin-right: auto !important;
    margin-left: auto !important;
    font-size: clamp(0.92rem, 2.6vw, 1.1rem) !important;
    line-height: 1.6 !important;
    max-width: 36rem !important;
    text-align: center !important;
  }`;
respCss = respCss.replace(respHeroOld, respHeroNew);

// Remove the problematic reserve-generator-btn rule with flex-wrap: wrap
respCss = respCss.replace(
  /\.reserve-generator-btn\s*\{\s*white-space:\s*normal;\s*flex-wrap:\s*wrap;\s*\}\s*\.reserve-generator-btn span\s*\{\s*flex:\s*0 1 auto;\s*max-width:\s*100%;\s*text-wrap:\s*balance;\s*\}/,
  `.reserve-generator-btn {
    white-space: nowrap !important;
    flex-wrap: nowrap !important;
  }
  .reserve-generator-btn span {
    white-space: nowrap !important;
  }`
);

// Add mobile-specific testimonial and hero refinements to responsive.css
if (!respCss.includes('/* Polish: Three Screenshots Alignment Refinements */')) {
  const threeShotsRefinements = `
/* Polish: Three Screenshots Alignment Refinements */
@media (max-width: 575.98px) {
  .hero-section {
    padding: 50px 0 42px 0 !important;
  }
  .hero-section .hero-title {
    font-size: clamp(1.55rem, 6.2vw, 1.95rem) !important;
    line-height: 1.22 !important;
    letter-spacing: -0.015em !important;
    margin-bottom: 0.85rem !important;
  }
  .hero-section .hero-desc {
    font-size: clamp(0.9rem, 3.2vw, 1.02rem) !important;
    line-height: 1.58 !important;
    max-width: 32rem !important;
    margin-bottom: 1.5rem !important;
  }
  .testimonial-card {
    padding: 22px 18px !important;
  }
  .testimonial-author {
    gap: 12px !important;
    padding-top: 14px !important;
  }
  .author-avatar {
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    flex: 0 0 48px !important;
  }
  .author-name {
    font-size: 1rem !important;
  }
  .author-role {
    font-size: 0.8rem !important;
  }
}

@media (max-width: 340px) {
  .reserve-generator-btn {
    padding: 10px 8px !important;
    font-size: 0.8rem !important;
    gap: 6px !important;
  }
}
`;
  respCss += '\n' + threeShotsRefinements;
}

fs.writeFileSync(respCssPath, respCss, 'utf8');
console.log('Updated responsive.css');

console.log('ALL THREE SCREENSHOT FIXES APPLIED SUCCESSFULLY!');
