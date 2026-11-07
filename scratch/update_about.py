import re

with open('pages/about.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update navbar if Generators is missing
if '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Generators</a>' not in html:
    old_nav_item = """          <!-- Single Direct Link (No Dropdown) -->
          <li class="nav-item">
            <a class="nav-link active" href="about.html">About Us</a>
          </li>"""
    new_nav_item = """          <!-- Single Direct Link (No Dropdown) -->
          <li class="nav-item">
            <a class="nav-link active" href="about.html">About Us</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Generators</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item fw-bold text-accent" href="fleet.html"><i class="bi bi-grid-fill me-2"></i>All Generator Fleet</a></li>
              <li><hr class="dropdown-divider border-secondary"></li>
              <li><a class="dropdown-item" href="fleet.html?category=5-20"><i class="bi bi-lightning-charge me-2"></i>5–20 kVA Portable</a></li>
              <li><a class="dropdown-item" href="fleet.html?category=25-50"><i class="bi bi-lightning-charge me-2"></i>25–50 kVA Commercial</a></li>
              <li><a class="dropdown-item" href="fleet.html?category=60-100"><i class="bi bi-lightning-charge me-2"></i>60–100 kVA Industrial</a></li>
              <li><a class="dropdown-item" href="fleet.html?category=125-250"><i class="bi bi-lightning-charge me-2"></i>125–250 kVA Heavy Duty</a></li>
              <li><a class="dropdown-item" href="fleet.html?category=300-500"><i class="bi bi-lightning-charge me-2"></i>300–500 kVA Containerized</a></li>
              <li><a class="dropdown-item" href="fleet.html?category=above-500"><i class="bi bi-lightning-charge me-2"></i>Above 500 kVA Megawatt</a></li>
            </ul>
          </li>"""
    html = html.replace(old_nav_item, new_nav_item)

# Insert Team section before CTA
team_section = """
  <!-- ===================================================================
       SECTION 8: OUR ENGINEERING & LEADERSHIP TEAM
       =================================================================== -->
  <section class="section-padding bg-light-grey">
    <div class="container">
      <div class="text-center mb-5">
        <span class="section-tag"><i class="bi bi-people-fill"></i> Engineering Leadership</span>
        <h2 class="section-title">The Engineers Behind Your Uptime</h2>
        <p class="section-subtitle">
          Over 75 combined years in industrial power generation, high-voltage distribution, and rapid disaster recovery.
        </p>
      </div>

      <div class="row g-4">
        <!-- Marcus Vance -->
        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border rounded-4 overflow-hidden shadow-sm bg-white text-center">
            <img src="../assets/images/team/team-1.jpg" alt="Marcus Vance" class="w-100" style="height: 260px; object-fit: cover;">
            <div class="p-4">
              <h5 class="fw-bold text-navy mb-1">Marcus Vance</h5>
              <span class="badge bg-warning text-dark mb-3">Chief Technical Officer</span>
              <p class="small text-muted mb-0">Former Caterpillar chief engineer specializing in multi-megawatt paralleling arrays.</p>
            </div>
          </div>
        </div>

        <!-- Elena Rostova -->
        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border rounded-4 overflow-hidden shadow-sm bg-white text-center">
            <img src="../assets/images/team/team-2.jpg" alt="Elena Rostova" class="w-100" style="height: 260px; object-fit: cover;">
            <div class="p-4">
              <h5 class="fw-bold text-navy mb-1">Elena Rostova, PE</h5>
              <span class="badge bg-primary text-white mb-3">Head of Grid Synchronization</span>
              <p class="small text-muted mb-0">Licensed PE directing automatic transfer switchgear and utility tie-in compliance.</p>
            </div>
          </div>
        </div>

        <!-- David Chen -->
        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border rounded-4 overflow-hidden shadow-sm bg-white text-center">
            <img src="../assets/images/team/team-3.jpg" alt="David Chen" class="w-100" style="height: 260px; object-fit: cover;">
            <div class="p-4">
              <h5 class="fw-bold text-navy mb-1">David Chen</h5>
              <span class="badge bg-success text-white mb-3">Director of Logistics</span>
              <p class="small text-muted mb-0">Coordinates 24/7 heavy crane flatbeds and telemetry-linked fuel dispatch tankers.</p>
            </div>
          </div>
        </div>

        <!-- Sarah Jenkins -->
        <div class="col-lg-3 col-md-6">
          <div class="card h-100 border rounded-4 overflow-hidden shadow-sm bg-white text-center">
            <img src="../assets/images/team/team-4.jpg" alt="Sarah Jenkins" class="w-100" style="height: 260px; object-fit: cover;">
            <div class="p-4">
              <h5 class="fw-bold text-navy mb-1">Sarah Jenkins</h5>
              <span class="badge bg-info text-dark mb-3">Lead Fleet Diagnostics</span>
              <p class="small text-muted mb-0">Directs 100% resistive load-bank testing protocols and IoT telemetry predictive alerts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
"""

cta_marker = "<!-- ===================================================================\n       SECTION 8: CALL-TO-ACTION SECTION (CLEAN BACKGROUND)\n       =================================================================== -->"
if cta_marker in html:
    html = html.replace(cta_marker, team_section + "\n  " + cta_marker.replace("SECTION 8", "SECTION 9"))

with open('pages/about.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("pages/about.html updated successfully with Team section & navbar!")
