const fs = require('fs');

const darkCssAppend = `

/* Dark mode spotlight styling */
[data-theme="dark"] .spotlight-image-wrapper {
  border-color: rgba(255, 255, 255, 0.12) !important;
  background-color: var(--pr-navy-surface, #142236) !important;
}
`;

let darkCss = fs.readFileSync('assets/css/dark-mode.css', 'utf8');
if (!darkCss.includes('.spotlight-image-wrapper')) {
  fs.appendFileSync('assets/css/dark-mode.css', darkCssAppend);
  console.log('Appended spotlight styles to dark-mode.css');
} else {
  console.log('dark-mode.css already has spotlight styles');
}
