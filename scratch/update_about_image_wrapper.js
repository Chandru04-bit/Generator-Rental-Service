const fs = require('fs');

let aboutHtml = fs.readFileSync('pages/about.html', 'utf8');
aboutHtml = aboutHtml.replace(
  `<img src="../assets/images/about/about-experience.jpg" alt="PowerRent Heavy Generator Deployment" class="img-fluid rounded-4 shadow-lg border">`,
  `<div class="spotlight-image-wrapper shadow-lg border">\r\n            <img src="../assets/images/about/about-experience.jpg" alt="PowerRent Heavy Generator Deployment" class="img-fluid spotlight-img">\r\n          </div>`
);
if (!aboutHtml.includes('about-experience.jpg" alt="PowerRent Heavy Generator Deployment" class="img-fluid spotlight-img"')) {
  aboutHtml = aboutHtml.replace(
    `<img src="../assets/images/about/about-experience.jpg" alt="PowerRent Heavy Generator Deployment" class="img-fluid rounded-4 shadow-lg border">`,
    `<div class="spotlight-image-wrapper shadow-lg border">\n            <img src="../assets/images/about/about-experience.jpg" alt="PowerRent Heavy Generator Deployment" class="img-fluid spotlight-img">\n          </div>`
  );
}
fs.writeFileSync('pages/about.html', aboutHtml, 'utf8');
console.log('Updated pages/about.html spotlight image wrapper');
