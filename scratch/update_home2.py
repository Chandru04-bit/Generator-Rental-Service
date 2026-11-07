import os

home2_html = """<!DOCTYPE html>
<html lang="en" data-theme="light" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PowerRent – Commercial & Event Generator Rental Solutions | Home 2</title>
  <meta name="description" content="PowerRent Alternative Homepage – Commercial standby, quiet event generators, and construction site power packages.">
  <link rel="icon" type="image/svg+xml" href="assets/images/logo/favicon.svg">

  <script src="assets/js/theme.js"></script>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/bootstrap-icons.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/dark-mode.css">
  <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>

  <!-- Global Header & Navbar -->
  <nav class="navbar navbar-expand-xl powerrent-navbar">
    <div class="container">
      <a class="navbar-brand" href="index.html">
        <img src="assets/images/logo/logo.svg" alt="PowerRent Logo" width="180" height="38">
      </a>
      <button class="navbar-toggler text-white border-0" type="button" data-bs-toggle="collapse" data-bs-target="#powerrentNavContent" aria-label="Toggle navigation">
        <i class="bi bi-list fs-1 text-accent"></i>
      </button>

      <div class="collapse navbar-collapse" id="powerrentNavContent">
        <ul class="navbar-nav mx-auto mb-2 mb-xl-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown">Home</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="index.html"><i class="bi bi-house-door me-2"></i>Home 1 – Industrial Main</a></li>
              <li><a class="dropdown-item active" href="home-2.html"><i class="bi bi-building me-2"></i>Home 2 – Commercial & Events</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="pages/about.html">About Us</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Generators</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item fw-bold text-accent" href="pages/fleet.html"><i class="bi bi-grid-fill me-2"></i>All Generator Fleet</a></li>
              <li><hr class="dropdown-divider border-secondary"></li>
              <li><a class="dropdown-item" href="pages/fleet.html?category=5-20"><i class="bi bi-lightning-charge me-2"></i>5–20 kVA Portable</a></li>
              <li><a class="dropdown-item" href="pages/fleet.html?category=25-50"><i class="bi bi-lightning-charge me-2"></i>25–50 kVA Commercial</a></li>
              <li><a class="dropdown-item" href="pages/fleet.html?category=60-100"><i class="bi bi-lightning-charge me-2"></i>60–100 kVA Industrial</a></li>
              <li><a class="dropdown-item" href="pages/fleet.html?category=125-250"><i class="bi bi-lightning-charge me-2"></i>125–250 kVA Heavy Duty</a></li>
              <li><a class="dropdown-item" href="pages/fleet.html?category=300-500"><i class="bi bi-lightning-charge me-2"></i>300–500 kVA Containerized</a></li>
              <li><a class="dropdown-item" href="pages/fleet.html?category=above-500"><i class="bi bi-lightning-charge me-2"></i>Above 500 kVA Megawatt</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Services</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item fw-bold text-accent" href="pages/services.html"><i class="bi bi-gear-wide-connected me-2"></i>All Power Services</a></li>
              <li><hr class="dropdown-divider border-secondary"></li>
              <li><a class="dropdown-item" href="pages/service-details.html?service=industrial"><i class="bi bi-tools me-2"></i>Industrial Power Solutions</a></li>
              <li><a class="dropdown-item" href="pages/service-details.html?service=commercial"><i class="bi bi-building-check me-2"></i>Commercial Standby Power</a></li>
              <li><a class="dropdown-item" href="pages/service-details.html?service=construction"><i class="bi bi-cone-striped me-2"></i>Construction Site Power</a></li>
              <li><a class="dropdown-item" href="pages/service-details.html?service=events"><i class="bi bi-music-note-beamed me-2"></i>Event Power Solutions</a></li>
              <li><a class="dropdown-item" href="pages/service-details.html?service=emergency"><i class="bi bi-lightning-fill me-2"></i>Emergency Power Backup</a></li>
              <li><a class="dropdown-item" href="pages/service-details.html?service=maintenance"><i class="bi bi-wrench-adjustable me-2"></i>Generator Maintenance</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="pages/pricing.html">Pricing</a></li>
          <li class="nav-item"><a class="nav-link" href="pages/blog.html">Blog</a></li>
          <li class="nav-item"><a class="nav-link" href="pages/contact.html">Contact</a></li>
          <li class="nav-item" id="nav-dashboard-item" style="display: none;">
            <a class="nav-link text-warning fw-bold" href="customer/dashboard.html"><i class="bi bi-speedometer2 me-1"></i>Dashboard</a>
          </li>
        </ul>

        <div class="nav-controls">
          <button class="control-btn theme-toggle-btn" type="button" title="Toggle Theme"><i class="bi bi-moon-stars-fill"></i></button>
          <button class="control-btn dir-toggle-btn control-btn-badge" type="button" title="Toggle Direction"><i class="bi bi-arrow-left-right me-1"></i><span class="dir-label">RTL</span></button>
          <div id="nav-auth-item">
            <a href="auth/login.html" class="btn btn-sm btn-pr-outline"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- SECTION 1: HERO SECTION -->
  <header class="hero-section" style="background-image: url('assets/images/hero/hero-home-2.jpg'); min-height: 90vh;">
    <div class="hero-overlay" style="background: linear-gradient(105deg, rgba(16, 28, 44, 0.96) 0%, rgba(16, 28, 44, 0.88) 50%, rgba(16, 28, 44, 0.75) 100%);"></div>
    <div class="container hero-content py-5">
      <div class="row align-items-center g-5">
        <div class="col-lg-7">
          <span class="section-tag"><i class="bi bi-broadcast"></i> Commercial & Industrial Power</span>
          <h1 class="hero-title" style="font-size: 3.4rem;">Next-Gen Fleet Power For Mission-Critical Operations</h1>
          <p class="hero-desc">
            Explore commercial, industrial, and silent event generators equipped with cloud telemetry and automatic transfer switching. Instant availability across major metropolitan hubs.
          </p>
          <div class="d-flex flex-wrap gap-3 mb-4">
            <a href="pages/services.html" class="btn btn-pr-primary btn-lg"><i class="bi bi-grid-fill me-1"></i>Explore Services</a>
            <a href="pages/pricing.html" class="btn btn-pr-outline btn-lg"><i class="bi bi-tags-fill me-1"></i>View Rental Rates</a>
            <a href="pages/booking.html" class="btn btn-warning btn-lg fw-bold text-dark"><i class="bi bi-calendar-check me-1"></i>Book Online</a>
          </div>
          <div class="d-flex align-items-center gap-4 text-white-50 small">
            <div><i class="bi bi-check-circle-fill text-warning me-1"></i> Same-Day Delivery</div>
            <div><i class="bi bi-check-circle-fill text-warning me-1"></i> 100% Load-Bank Tested</div>
            <div><i class="bi bi-check-circle-fill text-warning me-1"></i> Zero Hidden Fees</div>
          </div>
        </div>

        <!-- Quick Generator Sizer Card -->
        <div class="col-lg-5">
          <div class="p-4 bg-white text-dark rounded-4 shadow-lg border">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fw-bold mb-0 text-navy"><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Quick Sizer</h4>
              <span class="badge bg-warning text-dark">Instant Match</span>
            </div>
            <p class="small text-muted mb-3">Select your application to identify the exact capacity match and estimated rate.</p>

            <form onsubmit="event.preventDefault(); window.location.href='pages/booking.html?id=' + (document.getElementById('quick-sizer-gen').value || 'gen-80kva');">
              <div class="mb-3">
                <label class="form-label small fw-bold">Primary Application</label>
                <select class="form-select" id="quick-sizer-app" onchange="
                  const genSel = document.getElementById('quick-sizer-gen');
                  if (this.value === 'events') genSel.value = 'gen-100kva';
                  else if (this.value === 'construction') genSel.value = 'gen-150kva';
                  else if (this.value === 'industrial') genSel.value = 'gen-250kva';
                  else if (this.value === 'residential') genSel.value = 'gen-18kva';
                  else genSel.value = 'gen-80kva';
                ">
                  <option value="construction">Construction Site Power (Heavy Machinery)</option>
                  <option value="events">Outdoor Concert / Festival (Super Silent)</option>
                  <option value="commercial">Commercial Building Standby (ATS Required)</option>
                  <option value="industrial">Industrial Plant / Manufacturing</option>
                  <option value="residential">Residential Backup / Broadcast</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Recommended Model</label>
                <select class="form-select" id="quick-sizer-gen">
                  <option value="gen-18kva">EcoPower 18kVA Diesel Canopy ($95/day)</option>
                  <option value="gen-35kva">TitanPower 35kVA Commercial ($140/day)</option>
                  <option value="gen-80kva" selected>Cummins 80kVA Industrial ($240/day)</option>
                  <option value="gen-100kva">Volvo Penta 100kVA Ultra-Quiet ($290/day)</option>
                  <option value="gen-150kva">CAT 150kVA Heavy Duty ($380/day)</option>
                  <option value="gen-250kva">Cummins 250kVA Powerhouse ($520/day)</option>
                  <option value="gen-500kva">CAT 500kVA Heavy Container ($950/day)</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Approximate Duration</label>
                <select class="form-select">
                  <option>1 to 6 Days (Standard Daily Rate)</option>
                  <option selected>1 to 4 Weeks (10% Weekly Discount)</option>
                  <option>1+ Months (20% Long-Term Discount)</option>
                </select>
              </div>

              <button type="submit" class="btn btn-pr-primary w-100 fw-bold">
                <i class="bi bi-arrow-right-circle me-1"></i>Proceed to Reserve Generator
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- SECTION 2: POWER SOLUTIONS -->
  <section class="section-padding bg-light-grey">
    <div class="container">
      <div class="text-center mb-5">
        <span class="section-tag"><i class="bi bi-grid-3x3-gap"></i> Engineered Capability</span>
        <h2 class="section-title">Specialized Power Solutions</h2>
        <p class="section-subtitle">Turnkey generator packages specifically tailored to the unique operational demands of your sector.</p>
      </div>

      <div class="row g-4">
        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border p-4 rounded-4 shadow-sm bg-white">
            <div class="rounded-3 bg-light p-3 text-warning mb-3 d-inline-block" style="width: fit-content;">
              <i class="bi bi-cone-striped fs-3"></i>
            </div>
            <h5 class="fw-bold mb-2">Construction Sites</h5>
            <p class="small text-muted mb-3">High-inrush capacity to handle tower cranes, batching plants, and welding stations without voltage collapse.</p>
            <a href="pages/service-details.html?service=construction" class="small fw-bold text-decoration-none">Learn More &rarr;</a>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border p-4 rounded-4 shadow-sm bg-white">
            <div class="rounded-3 bg-light p-3 text-primary mb-3 d-inline-block" style="width: fit-content;">
              <i class="bi bi-music-note-beamed fs-3"></i>
            </div>
            <h5 class="fw-bold mb-2">Events & Entertainment</h5>
            <p class="small text-muted mb-3">Acoustic super-silent generators under 63 dB(A) with clean sinewave voltage for broadcast and concert sound.</p>
            <a href="pages/service-details.html?service=events" class="small fw-bold text-decoration-none">Learn More &rarr;</a>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border p-4 rounded-4 shadow-sm bg-white">
            <div class="rounded-3 bg-light p-3 text-success mb-3 d-inline-block" style="width: fit-content;">
              <i class="bi bi-buildings fs-3"></i>
            </div>
            <h5 class="fw-bold mb-2">Commercial Standby</h5>
            <p class="small text-muted mb-3">Automatic transfer switch (ATS) synchronization protecting data centers, corporate towers, and clinics.</p>
            <a href="pages/service-details.html?service=commercial" class="small fw-bold text-decoration-none">Learn More &rarr;</a>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border p-4 rounded-4 shadow-sm bg-white">
            <div class="rounded-3 bg-light p-3 text-danger mb-3 d-inline-block" style="width: fit-content;">
              <i class="bi bi-lightning-fill fs-3"></i>
            </div>
            <h5 class="fw-bold mb-2">Emergency Outage Response</h5>
            <p class="small text-muted mb-3">Pre-fueled, skid and trailer-mounted staging reserve dispatched within 2 hours of catastrophic grid loss.</p>
            <a href="pages/service-details.html?service=emergency" class="small fw-bold text-decoration-none">Learn More &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3: FEATURED GENERATORS -->
  <section class="section-padding bg-white">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-between align-items-end mb-5">
        <div>
          <span class="section-tag"><i class="bi bi-star-fill text-warning"></i> Ready For Immediate Dispatch</span>
          <h2 class="section-title mb-0">Featured Rental Generators</h2>
        </div>
        <a href="pages/fleet.html" class="btn btn-pr-primary mt-3 mt-md-0">View Entire Fleet Matrix</a>
      </div>

      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <div class="gen-card border rounded-4 overflow-hidden shadow-sm h-100 d-flex flex-column">
            <div class="gen-card-img-wrap position-relative">
              <span class="gen-card-badge badge bg-warning text-dark position-absolute top-0 start-0 m-3 px-3 py-1">35 kVA</span>
              <span class="gen-card-status status-available position-absolute top-0 end-0 m-3 badge bg-success">Available</span>
              <img src="assets/images/generators/gen-25-50-1.jpg" alt="TitanPower 35kVA" class="w-100" style="height: 220px; object-fit: cover;">
            </div>
            <div class="p-4 d-flex flex-column flex-grow-1">
              <span class="text-accent fw-bold small">Commercial Canopy</span>
              <h4 class="fw-bold text-navy mb-2">TitanPower 35kVA Silent</h4>
              <p class="small text-muted mb-3 flex-grow-1">24-hour continuous internal fuel cell for commercial stores and remote medical clinics.</p>
              <div class="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                <div><span class="fs-4 fw-bold text-navy">$140</span><span class="text-muted small"> / day</span></div>
                <span class="badge bg-light text-dark border">Weekly: $840</span>
              </div>
              <div class="d-flex gap-2">
                <a href="pages/generator-details.html?id=gen-35kva" class="btn btn-pr-secondary btn-sm flex-grow-1">Specs</a>
                <a href="pages/booking.html?id=gen-35kva" class="btn btn-pr-primary btn-sm flex-grow-1">Rent Now</a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="gen-card border rounded-4 overflow-hidden shadow-sm h-100 d-flex flex-column">
            <div class="gen-card-img-wrap position-relative">
              <span class="gen-card-badge badge bg-info text-dark position-absolute top-0 start-0 m-3 px-3 py-1">100 kVA</span>
              <span class="gen-card-status status-available position-absolute top-0 end-0 m-3 badge bg-success">Available</span>
              <img src="assets/images/generators/gen-60-100-2.jpg" alt="Volvo Penta 100kVA" class="w-100" style="height: 220px; object-fit: cover;">
            </div>
            <div class="p-4 d-flex flex-column flex-grow-1">
              <span class="text-accent fw-bold small">Ultra-Quiet Series</span>
              <h4 class="fw-bold text-navy mb-2">Volvo Penta 100kVA</h4>
              <p class="small text-muted mb-3 flex-grow-1">63 dB(A) sound-attenuated acoustic canopy designed for outdoor festivals and live broadcast.</p>
              <div class="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                <div><span class="fs-4 fw-bold text-navy">$290</span><span class="text-muted small"> / day</span></div>
                <span class="badge bg-light text-dark border">Weekly: $1,740</span>
              </div>
              <div class="d-flex gap-2">
                <a href="pages/generator-details.html?id=gen-100kva" class="btn btn-pr-secondary btn-sm flex-grow-1">Specs</a>
                <a href="pages/booking.html?id=gen-100kva" class="btn btn-pr-primary btn-sm flex-grow-1">Rent Now</a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="gen-card border rounded-4 overflow-hidden shadow-sm h-100 d-flex flex-column">
            <div class="gen-card-img-wrap position-relative">
              <span class="gen-card-badge badge bg-dark text-white position-absolute top-0 start-0 m-3 px-3 py-1">500 kVA</span>
              <span class="gen-card-status status-available position-absolute top-0 end-0 m-3 badge bg-success">Available</span>
              <img src="assets/images/generators/gen-300-500-2.jpg" alt="CAT 500kVA" class="w-100" style="height: 220px; object-fit: cover;">
            </div>
            <div class="p-4 d-flex flex-column flex-grow-1">
              <span class="text-accent fw-bold small">Containerized Power</span>
              <h4 class="fw-bold text-navy mb-2">CAT 500kVA Container</h4>
              <p class="small text-muted mb-3 flex-grow-1">Mega-scale power plant in a 20ft container for mining, tunneling, and utility bypass.</p>
              <div class="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                <div><span class="fs-4 fw-bold text-navy">$950</span><span class="text-muted small"> / day</span></div>
                <span class="badge bg-light text-dark border">Weekly: $5,700</span>
              </div>
              <div class="d-flex gap-2">
                <a href="pages/generator-details.html?id=gen-500kva" class="btn btn-pr-secondary btn-sm flex-grow-1">Specs</a>
                <a href="pages/booking.html?id=gen-500kva" class="btn btn-pr-primary btn-sm flex-grow-1">Rent Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: OUR SERVICES -->
  <section class="section-padding bg-light-grey">
    <div class="container">
      <div class="text-center mb-5">
        <span class="section-tag"><i class="bi bi-gear-fill"></i> End-to-End Delivery</span>
        <h2 class="section-title">Complete Turnkey Power Services</h2>
        <p class="section-subtitle">We don't simply deliver a machine; we engineer, connect, maintain, and fuel your temporary electrical infrastructure.</p>
      </div>

      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <div class="p-4 bg-white rounded-4 border shadow-sm h-100">
            <i class="bi bi-truck fs-1 text-warning mb-3 d-block"></i>
            <h5 class="fw-bold mb-2">Hiab Crane Delivery</h5>
            <p class="small text-muted mb-0">Precision offloading, ground-level leveling, and obstacle placement directly onto your site coordinates.</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="p-4 bg-white rounded-4 border shadow-sm h-100">
            <i class="bi bi-hdd-network fs-1 text-primary mb-3 d-block"></i>
            <h5 class="fw-bold mb-2">Certified Electrical Tie-In</h5>
            <p class="small text-muted mb-0">Master electricians connect Cam-Lok cabling, verify phase sequence, and synchronize automatic transfer switches.</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="p-4 bg-white rounded-4 border shadow-sm h-100">
            <i class="bi bi-fuel-pump fs-1 text-success mb-3 d-block"></i>
            <h5 class="fw-bold mb-2">Automated Fuel Management</h5>
            <p class="small text-muted mb-0">Cellular telemetry signals our tankers to refill your diesel or HVO fuel before tanks drop below 30%.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: WHY CHOOSE US -->
  <section class="section-padding bg-white">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <span class="section-tag"><i class="bi bi-shield-check"></i> Proven Reliability</span>
          <h2 class="section-title">Why Industry Leaders Choose PowerRent</h2>
          <p class="lead text-muted mb-4">
            With more than 15 years in mission-critical power generation, we eliminate downtime through engineering rigor and rapid-response logistics.
          </p>

          <div class="row g-3">
            <div class="col-sm-6">
              <div class="p-3 bg-light-grey rounded-3 border">
                <i class="bi bi-check2-circle text-warning fs-3 mb-1 d-block"></i>
                <h6 class="fw-bold mb-1">99.98% Uptime SLA</h6>
                <p class="small text-muted mb-0">Backed by our immediate equipment swap guarantee.</p>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 bg-light-grey rounded-3 border">
                <i class="bi bi-stopwatch text-danger fs-3 mb-1 d-block"></i>
                <h6 class="fw-bold mb-1">&lt; 2hr Rapid Dispatch</h6>
                <p class="small text-muted mb-0">Pre-fueled emergency staging bays ready 24/7/365.</p>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 bg-light-grey rounded-3 border">
                <i class="bi bi-award text-success fs-3 mb-1 d-block"></i>
                <h6 class="fw-bold mb-1">100% Load-Banked</h6>
                <p class="small text-muted mb-0">Full resistive test certification with every hire.</p>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 bg-light-grey rounded-3 border">
                <i class="bi bi-broadcast-pin text-primary fs-3 mb-1 d-block"></i>
                <h6 class="fw-bold mb-1">Live IoT Telemetry</h6>
                <p class="small text-muted mb-0">Remote monitoring of voltage, fuel, and engine temp.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <img src="assets/images/about/about-experience.jpg" alt="Industrial Power Distribution Substation" class="img-fluid rounded-4 shadow-lg border">
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 6: HOW IT WORKS -->
  <section class="section-padding bg-light-grey">
    <div class="container">
      <div class="text-center mb-5">
        <span class="section-tag"><i class="bi bi-diagram-3"></i> Simple Workflow</span>
        <h2 class="section-title">How Our Rental Process Works</h2>
        <p class="section-subtitle">From load estimation to final decommissioning, we handle every step smoothly.</p>
      </div>

      <div class="row g-4">
        <div class="col-lg-3 col-md-6">
          <div class="p-4 bg-white rounded-4 border text-center shadow-sm h-100">
            <div class="rounded-circle bg-warning text-dark fw-bold fs-4 d-inline-flex align-items-center justify-content-center mb-3" style="width: 55px; height: 55px;">1</div>
            <h5 class="fw-bold mb-2">Load Sizing</h5>
            <p class="small text-muted mb-0">Select your model online or let our engineers calculate your starting and running kVA.</p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="p-4 bg-white rounded-4 border text-center shadow-sm h-100">
            <div class="rounded-circle bg-primary text-white fw-bold fs-4 d-inline-flex align-items-center justify-content-center mb-3" style="width: 55px; height: 55px;">2</div>
            <h5 class="fw-bold mb-2">Book Online</h5>
            <p class="small text-muted mb-0">Choose your start date, duration, site location, and optional transfer switches.</p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="p-4 bg-white rounded-4 border text-center shadow-sm h-100">
            <div class="rounded-circle bg-success text-white fw-bold fs-4 d-inline-flex align-items-center justify-content-center mb-3" style="width: 55px; height: 55px;">3</div>
            <h5 class="fw-bold mb-2">Rapid Mobilization</h5>
            <p class="small text-muted mb-0">Our crane flatbed delivers, positions, connects cables, and load-tests on site.</p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="p-4 bg-white rounded-4 border text-center shadow-sm h-100">
            <div class="rounded-circle bg-dark text-white fw-bold fs-4 d-inline-flex align-items-center justify-content-center mb-3" style="width: 55px; height: 55px;">4</div>
            <h5 class="fw-bold mb-2">24/7 Support</h5>
            <p class="small text-muted mb-0">Continuous telemetry tracking, routine 250hr servicing, and scheduled fuel top-ups.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 7: CUSTOMER TESTIMONIALS -->
  <section class="section-padding bg-white">
    <div class="container">
      <div class="text-center mb-5">
        <span class="section-tag"><i class="bi bi-chat-quote-fill text-warning"></i> Client Reviews</span>
        <h2 class="section-title">What Project Directors Say</h2>
        <p class="section-subtitle">Trusted by contractors, healthcare engineers, and festival production managers nationwide.</p>
      </div>

      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <div class="p-4 bg-light-grey rounded-4 border h-100 d-flex flex-column shadow-sm">
            <div class="mb-2 text-warning">
              <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
            </div>
            <p class="fst-italic text-dark small flex-grow-1">"When our primary hospital transformer failed during summer storms, PowerRent had two 500 kVA generators synchronized within 90 minutes. Lifesaving service."</p>
            <div class="d-flex align-items-center gap-3 pt-3 border-top">
              <img src="assets/images/team/team-2.jpg" alt="Dr. Alistair Finch" class="rounded-circle" width="45" height="45" style="object-fit: cover;">
              <div>
                <h6 class="fw-bold mb-0 text-navy">Dr. Alistair Finch</h6>
                <span class="small text-muted">Facilities Director, Metro Health</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="p-4 bg-light-grey rounded-4 border h-100 d-flex flex-column shadow-sm">
            <div class="mb-2 text-warning">
              <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
            </div>
            <p class="fst-italic text-dark small flex-grow-1">"The Volvo Penta ultra-quiet sets ran flawlessly for 4 straight days across our festival stages. Zero ripple, zero noise complaints from neighboring residents."</p>
            <div class="d-flex align-items-center gap-3 pt-3 border-top">
              <img src="assets/images/team/team-3.jpg" alt="Claire Beauchamp" class="rounded-circle" width="45" height="45" style="object-fit: cover;">
              <div>
                <h6 class="fw-bold mb-0 text-navy">Claire Beauchamp</h6>
                <span class="small text-muted">Head of Production, SoundWave Festivals</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="p-4 bg-light-grey rounded-4 border h-100 d-flex flex-column shadow-sm">
            <div class="mb-2 text-warning">
              <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
            </div>
            <p class="fst-italic text-dark small flex-grow-1">"PowerRent is our single call for temporary power across all our Midwest bridge construction packages. Equipment is always clean, load-bank verified, and delivered on the hour."</p>
            <div class="d-flex align-items-center gap-3 pt-3 border-top">
              <img src="assets/images/team/team-1.jpg" alt="Marcus Vance" class="rounded-circle" width="45" height="45" style="object-fit: cover;">
              <div>
                <h6 class="fw-bold mb-0 text-navy">Marcus Vance</h6>
                <span class="small text-muted">VP Operations, Midwest Civil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 8: CONTACT CTA -->
  <section class="section-padding text-center position-relative" style="background: linear-gradient(135deg, #101c2c 0%, #1a2f4c 100%);">
    <div class="container py-4 position-relative z-1">
      <span class="badge bg-warning text-dark px-3 py-2 fw-bold text-uppercase mb-3"><i class="bi bi-lightning-charge-fill me-1"></i> Rapid 24/7 Mobilization</span>
      <h2 class="display-5 fw-bold text-white mb-3">Ready to Power Your Next Site?</h2>
      <p class="lead text-white-50 max-w-700 mx-auto mb-4">
        Our electrical power specialists are available 24/7 to size, deliver, and commission the exact generator package you need.
      </p>
      <div class="d-flex flex-wrap justify-content-center gap-3">
        <a href="pages/booking.html" class="btn btn-warning btn-lg px-4 fw-bold text-dark"><i class="bi bi-calendar-check me-2"></i>Book a Generator Online</a>
        <a href="pages/fleet.html" class="btn btn-pr-outline btn-lg px-4"><i class="bi bi-grid me-2"></i>Explore Generator Fleet</a>
        <a href="pages/contact.html" class="btn btn-light btn-lg px-4 text-dark fw-bold"><i class="bi bi-telephone-outbound me-2"></i>Call 24/7 Dispatch</a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="powerrent-footer">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <a href="index.html" class="d-inline-block mb-3">
            <img src="assets/images/logo/logo.svg" alt="PowerRent Logo" width="200" height="42">
          </a>
          <p class="small text-muted mb-4 pe-lg-3">
            PowerRent provides industry-grade generator rental solutions engineered for peak reliability. From 10 kVA silent event sets to 1,250 kVA multi-megawatt industrial microgrids, we deliver temporary and emergency power anywhere, anytime.
          </p>
          <div class="border-start border-warning ps-3">
            <span class="d-block text-white fw-bold">24/7 Rapid Response</span>
            <span class="small text-muted">Emergency Line: +1 (800) 555-POWER</span>
          </div>
        </div>

        <div class="col-lg-2 col-md-6 col-6">
          <h5 class="footer-widget-title">Quick Links</h5>
          <ul class="footer-links">
            <li><a href="index.html"><i class="bi bi-chevron-right"></i>Home</a></li>
            <li><a href="pages/about.html"><i class="bi bi-chevron-right"></i>About Us</a></li>
            <li><a href="pages/fleet.html"><i class="bi bi-chevron-right"></i>Generator Fleet</a></li>
            <li><a href="pages/services.html"><i class="bi bi-chevron-right"></i>Services</a></li>
            <li><a href="pages/pricing.html"><i class="bi bi-chevron-right"></i>Pricing Plans</a></li>
            <li><a href="pages/blog.html"><i class="bi bi-chevron-right"></i>Industry News</a></li>
            <li><a href="pages/faq.html"><i class="bi bi-chevron-right"></i>Rental FAQ</a></li>
            <li><a href="pages/contact.html"><i class="bi bi-chevron-right"></i>Contact Support</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 col-6">
          <h5 class="footer-widget-title">Fleet Capacities</h5>
          <ul class="footer-links">
            <li><a href="pages/fleet.html?category=5-20"><i class="bi bi-chevron-right"></i>5–20 kVA Portable</a></li>
            <li><a href="pages/fleet.html?category=25-50"><i class="bi bi-chevron-right"></i>25–50 kVA Commercial</a></li>
            <li><a href="pages/fleet.html?category=60-100"><i class="bi bi-chevron-right"></i>60–100 kVA Industrial</a></li>
            <li><a href="pages/fleet.html?category=125-250"><i class="bi bi-chevron-right"></i>125–250 kVA Heavy Duty</a></li>
            <li><a href="pages/fleet.html?category=300-500"><i class="bi bi-chevron-right"></i>300–500 kVA Containerized</a></li>
            <li><a href="pages/fleet.html?category=above-500"><i class="bi bi-chevron-right"></i>Above 500 kVA Megawatt</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h5 class="footer-widget-title">Global Headquarters</h5>
          <div class="footer-contact-item">
            <i class="bi bi-geo-alt-fill"></i>
            <span>100 Power Industrial Park, Chicago, IL 60616</span>
          </div>
          <div class="footer-contact-item">
            <i class="bi bi-telephone-fill"></i>
            <span>+1 (800) 555-7693 / (312) 555-0199</span>
          </div>
          <div class="footer-contact-item">
            <i class="bi bi-envelope-fill"></i>
            <span>dispatch@powerrent-service.com</span>
          </div>
          <div class="footer-contact-item">
            <i class="bi bi-clock-fill"></i>
            <span>Operations: 24/7/365 Non-Stop</span>
          </div>
          <div class="footer-socials">
            <a href="#" class="footer-social-btn"><i class="bi bi-linkedin"></i></a>
            <a href="#" class="footer-social-btn"><i class="bi bi-twitter-x"></i></a>
            <a href="#" class="footer-social-btn"><i class="bi bi-facebook"></i></a>
            <a href="#" class="footer-social-btn"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p class="mb-0">&copy; 2026 PowerRent Inc. All rights reserved. Industrial Power Solutions.</p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <a href="#" class="text-muted text-decoration-none me-3 small">Privacy Policy</a>
            <a href="#" class="text-muted text-decoration-none me-3 small">Terms of Service</a>
            <a href="pages/faq.html" class="text-muted text-decoration-none small">Rental Agreement</a>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <script src="assets/js/bootstrap.bundle.min.js"></script>
  <script src="assets/js/direction.js"></script>
  <script src="assets/js/generator.js"></script>
  <script src="assets/js/authentication.js"></script>
  <script src="assets/js/navigation.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>
"""

with open('home-2.html', 'w', encoding='utf-8') as f:
    f.write(home2_html)

print("home-2.html updated successfully with 8 sections!")
