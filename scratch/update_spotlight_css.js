const fs = require('fs');
const path = require('path');

const spotlightStyleCss = `

/* Spotlight & Service Feature Image Containers */
.spotlight-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: var(--pr-radius-lg, 1rem);
  width: 100%;
  max-height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0d1724;
}

.spotlight-img {
  width: 100%;
  height: 100%;
  max-height: 440px;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;
}

.spotlight-image-wrapper:hover .spotlight-img {
  transform: scale(1.025);
}
`;

const spotlightResponsiveCss = `

/* Responsive Spotlight & Hero Image Rules */
@media (max-width: 991.98px) {
  .spotlight-image-wrapper {
    max-height: 380px !important;
    margin-top: 1.5rem !important;
  }
  .spotlight-img {
    max-height: 380px !important;
    aspect-ratio: 16 / 10 !important;
  }
}

@media (max-width: 767.98px) {
  .spotlight-image-wrapper {
    max-height: 280px !important;
    margin-top: 1.25rem !important;
  }
  .spotlight-img {
    max-height: 280px !important;
    aspect-ratio: 16 / 10 !important;
  }
}

@media (max-width: 480px) {
  .spotlight-image-wrapper {
    max-height: 230px !important;
    margin-top: 1rem !important;
  }
  .spotlight-img {
    max-height: 230px !important;
    aspect-ratio: 16 / 10 !important;
  }
}
`;

// Append to style.css if not already present
let styleCss = fs.readFileSync('assets/css/style.css', 'utf8');
if (!styleCss.includes('.spotlight-image-wrapper')) {
  fs.appendFileSync('assets/css/style.css', spotlightStyleCss);
  console.log('Appended spotlight classes to assets/css/style.css');
} else {
  console.log('style.css already has spotlight classes');
}

// Append to responsive.css if not already present
let respCss = fs.readFileSync('assets/css/responsive.css', 'utf8');
if (!respCss.includes('.spotlight-image-wrapper')) {
  fs.appendFileSync('assets/css/responsive.css', spotlightResponsiveCss);
  console.log('Appended responsive spotlight classes to assets/css/responsive.css');
} else {
  console.log('responsive.css already has spotlight classes');
}
