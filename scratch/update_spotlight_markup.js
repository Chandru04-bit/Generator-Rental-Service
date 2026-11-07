const fs = require('fs');

// 1. Update pages/services.html
let servicesHtml = fs.readFileSync('pages/services.html', 'utf8');

// Section 3
servicesHtml = servicesHtml.replace(
  `<img src="../assets/images/services/service-industrial.jpg" alt="Industrial Power Plant Setup" class="img-fluid rounded-4 shadow-lg border">`,
  `<div class="spotlight-image-wrapper shadow-lg border">\r\n            <img src="../assets/images/services/service-industrial.jpg" alt="Industrial Power Plant Setup" class="img-fluid spotlight-img">\r\n          </div>`
);
if (!servicesHtml.includes('spotlight-img')) {
  // If \r\n replacement didn't match due to \n, try with \n
  servicesHtml = servicesHtml.replace(
    `<img src="../assets/images/services/service-industrial.jpg" alt="Industrial Power Plant Setup" class="img-fluid rounded-4 shadow-lg border">`,
    `<div class="spotlight-image-wrapper shadow-lg border">\n            <img src="../assets/images/services/service-industrial.jpg" alt="Industrial Power Plant Setup" class="img-fluid spotlight-img">\n          </div>`
  );
}

// Section 4
servicesHtml = servicesHtml.replace(
  `<img src="../assets/images/services/service-commercial.jpg" alt="Commercial Skyscraper Power" class="img-fluid rounded-4 shadow-lg border">`,
  `<div class="spotlight-image-wrapper shadow-lg border">\r\n            <img src="../assets/images/services/service-commercial.jpg" alt="Commercial Skyscraper Power" class="img-fluid spotlight-img">\r\n          </div>`
);
if (!servicesHtml.includes('service-commercial.jpg" alt="Commercial Skyscraper Power" class="img-fluid spotlight-img')) {
  servicesHtml = servicesHtml.replace(
    `<img src="../assets/images/services/service-commercial.jpg" alt="Commercial Skyscraper Power" class="img-fluid rounded-4 shadow-lg border">`,
    `<div class="spotlight-image-wrapper shadow-lg border">\n            <img src="../assets/images/services/service-commercial.jpg" alt="Commercial Skyscraper Power" class="img-fluid spotlight-img">\n          </div>`
  );
}

// Section 5
servicesHtml = servicesHtml.replace(
  `<img src="../assets/images/services/service-construction.jpg" alt="Construction Site Crane Power" class="img-fluid rounded-4 shadow-lg border">`,
  `<div class="spotlight-image-wrapper shadow-lg border">\r\n            <img src="../assets/images/services/service-construction.jpg" alt="Construction Site Crane Power" class="img-fluid spotlight-img">\r\n          </div>`
);
if (!servicesHtml.includes('service-construction.jpg" alt="Construction Site Crane Power" class="img-fluid spotlight-img')) {
  servicesHtml = servicesHtml.replace(
    `<img src="../assets/images/services/service-construction.jpg" alt="Construction Site Crane Power" class="img-fluid rounded-4 shadow-lg border">`,
    `<div class="spotlight-image-wrapper shadow-lg border">\n            <img src="../assets/images/services/service-construction.jpg" alt="Construction Site Crane Power" class="img-fluid spotlight-img">\n          </div>`
  );
}

// Section 6
servicesHtml = servicesHtml.replace(
  `<img src="../assets/images/services/service-events.jpg" alt="Outdoor Music Festival Lighting" class="img-fluid rounded-4 shadow-lg border">`,
  `<div class="spotlight-image-wrapper shadow-lg border">\r\n            <img src="../assets/images/services/service-events.jpg" alt="Outdoor Music Festival Lighting" class="img-fluid spotlight-img">\r\n          </div>`
);
if (!servicesHtml.includes('service-events.jpg" alt="Outdoor Music Festival Lighting" class="img-fluid spotlight-img')) {
  servicesHtml = servicesHtml.replace(
    `<img src="../assets/images/services/service-events.jpg" alt="Outdoor Music Festival Lighting" class="img-fluid rounded-4 shadow-lg border">`,
    `<div class="spotlight-image-wrapper shadow-lg border">\n            <img src="../assets/images/services/service-events.jpg" alt="Outdoor Music Festival Lighting" class="img-fluid spotlight-img">\n          </div>`
  );
}

fs.writeFileSync('pages/services.html', servicesHtml, 'utf8');
console.log('Updated pages/services.html spotlight images');

// 2. Update pages/service-details.html
let sDetailsHtml = fs.readFileSync('pages/service-details.html', 'utf8');
sDetailsHtml = sDetailsHtml.replace(
  `<img src="../assets/images/services/service-industrial.jpg" alt="Service Engineering Overview" id="service-overview-img" class="img-fluid rounded-4 shadow-lg border">`,
  `<div class="spotlight-image-wrapper shadow-lg border">\r\n            <img src="../assets/images/services/service-industrial.jpg" alt="Service Engineering Overview" id="service-overview-img" class="img-fluid spotlight-img">\r\n          </div>`
);
if (!sDetailsHtml.includes('id="service-overview-img" class="img-fluid spotlight-img"')) {
  sDetailsHtml = sDetailsHtml.replace(
    `<img src="../assets/images/services/service-industrial.jpg" alt="Service Engineering Overview" id="service-overview-img" class="img-fluid rounded-4 shadow-lg border">`,
    `<div class="spotlight-image-wrapper shadow-lg border">\n            <img src="../assets/images/services/service-industrial.jpg" alt="Service Engineering Overview" id="service-overview-img" class="img-fluid spotlight-img">\n          </div>`
  );
}
fs.writeFileSync('pages/service-details.html', sDetailsHtml, 'utf8');
console.log('Updated pages/service-details.html spotlight images');

// 3. Update home-2.html
let home2Html = fs.readFileSync('home-2.html', 'utf8');
home2Html = home2Html.replace(
  `<img src="assets/images/about/about-experience.jpg" alt="Industrial Power Distribution Substation" class="img-fluid rounded-4 shadow-lg border">`,
  `<div class="spotlight-image-wrapper shadow-lg border">\r\n            <img src="assets/images/about/about-experience.jpg" alt="Industrial Power Distribution Substation" class="img-fluid spotlight-img">\r\n          </div>`
);
if (!home2Html.includes('about-experience.jpg" alt="Industrial Power Distribution Substation" class="img-fluid spotlight-img"')) {
  home2Html = home2Html.replace(
    `<img src="assets/images/about/about-experience.jpg" alt="Industrial Power Distribution Substation" class="img-fluid rounded-4 shadow-lg border">`,
    `<div class="spotlight-image-wrapper shadow-lg border">\n            <img src="assets/images/about/about-experience.jpg" alt="Industrial Power Distribution Substation" class="img-fluid spotlight-img">\n          </div>`
  );
}
fs.writeFileSync('home-2.html', home2Html, 'utf8');
console.log('Updated home-2.html spotlight image');
