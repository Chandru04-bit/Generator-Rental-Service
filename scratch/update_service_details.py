# Update pages/service-details.html with alignment and icon fixes
import re

with open('pages/service-details.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Related Services HTML Fallback (Section 6)
old_related_html = """      <div class="row g-4" id="related-services-grid">
        <div class="col-md-4">
          <div class="p-4 rounded-4 border bg-light-grey h-100 transition-hover">
            <div class="text-accent fs-2 mb-2"><i class="bi bi-factory"></i></div>
            <h5 class="fw-bold text-navy mb-2">Industrial Generator Rental</h5>
            <p class="small text-muted mb-3">Multi-megawatt synchronized power arrays for refineries, manufacturing lines, and mines.</p>
            <a href="service-details.html?id=industrial" class="text-accent fw-bold small text-decoration-none">View Service &rarr;</a>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-4 rounded-4 border bg-light-grey h-100 transition-hover">
            <div class="text-accent fs-2 mb-2"><i class="bi bi-building"></i></div>
            <h5 class="fw-bold text-navy mb-2">Commercial Standby Rental</h5>
            <p class="small text-muted mb-3">Sub-10 second automatic transfer switch systems for data centers, clinics, and offices.</p>
            <a href="service-details.html?id=commercial" class="text-accent fw-bold small text-decoration-none">View Service &rarr;</a>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-4 rounded-4 border bg-light-grey h-100 transition-hover">
            <div class="text-accent fs-2 mb-2"><i class="bi bi-plug-fill"></i></div>
            <h5 class="fw-bold text-navy mb-2">Temporary Power Solutions</h5>
            <p class="small text-muted mb-3">High-voltage transformers, distribution I-line panels, junction boxes, and safety cable ramps.</p>
            <a href="service-details.html?id=temporary" class="text-accent fw-bold small text-decoration-none">View Service &rarr;</a>
          </div>
        </div>
      </div>"""

new_related_html = """      <div class="row g-4" id="related-services-grid">
        <div class="col-md-4">
          <div class="card related-service-card p-4 rounded-4 border bg-light-grey h-100 shadow-sm transition-hover d-flex flex-column">
            <div class="related-icon-badge mb-3 d-inline-flex align-items-center justify-content-center text-accent fs-3 rounded-3" style="width: 50px; height: 50px; background: rgba(245, 158, 11, 0.12); flex-shrink: 0;">
              <i class="bi bi-gear-wide-connected"></i>
            </div>
            <h5 class="fw-bold text-navy mb-2" style="min-height: 2.85rem; display: flex; align-items: flex-start; line-height: 1.35;">Industrial Generator Rental</h5>
            <p class="small text-muted mb-3 flex-grow-1" style="line-height: 1.55;">Multi-megawatt synchronized power arrays for refineries, manufacturing lines, and mines.</p>
            <a href="service-details.html?id=industrial" class="text-accent fw-bold small text-decoration-none mt-auto pt-2 d-inline-flex align-items-center">View Service <i class="bi bi-arrow-right ms-2"></i></a>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card related-service-card p-4 rounded-4 border bg-light-grey h-100 shadow-sm transition-hover d-flex flex-column">
            <div class="related-icon-badge mb-3 d-inline-flex align-items-center justify-content-center text-accent fs-3 rounded-3" style="width: 50px; height: 50px; background: rgba(245, 158, 11, 0.12); flex-shrink: 0;">
              <i class="bi bi-building"></i>
            </div>
            <h5 class="fw-bold text-navy mb-2" style="min-height: 2.85rem; display: flex; align-items: flex-start; line-height: 1.35;">Commercial Standby Rental</h5>
            <p class="small text-muted mb-3 flex-grow-1" style="line-height: 1.55;">Sub-10 second automatic transfer switch systems for data centers, clinics, and offices.</p>
            <a href="service-details.html?id=commercial" class="text-accent fw-bold small text-decoration-none mt-auto pt-2 d-inline-flex align-items-center">View Service <i class="bi bi-arrow-right ms-2"></i></a>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card related-service-card p-4 rounded-4 border bg-light-grey h-100 shadow-sm transition-hover d-flex flex-column">
            <div class="related-icon-badge mb-3 d-inline-flex align-items-center justify-content-center text-accent fs-3 rounded-3" style="width: 50px; height: 50px; background: rgba(245, 158, 11, 0.12); flex-shrink: 0;">
              <i class="bi bi-plug-fill"></i>
            </div>
            <h5 class="fw-bold text-navy mb-2" style="min-height: 2.85rem; display: flex; align-items: flex-start; line-height: 1.35;">Temporary Power Solutions</h5>
            <p class="small text-muted mb-3 flex-grow-1" style="line-height: 1.55;">High-voltage transformers, distribution I-line panels, junction boxes, and safety cable ramps.</p>
            <a href="service-details.html?id=temporary" class="text-accent fw-bold small text-decoration-none mt-auto pt-2 d-inline-flex align-items-center">View Service <i class="bi bi-arrow-right ms-2"></i></a>
          </div>
        </div>
      </div>"""

# Normalize CRLF
content = content.replace('\r\n', '\n')
if old_related_html in content:
    content = content.replace(old_related_html, new_related_html)
    print('[OK] Replaced related services HTML')
else:
    print('[FAIL] Related services HTML not matched')

# 2. Update the full JS script block
old_script_start = "  <!-- Service Details Populator Script -->"
script_idx = content.find(old_script_start)

new_script = """  <!-- Service Details Populator Script -->
  <script>
    const SERVICES_DATABASE = {
      industrial: {
        title: "Industrial Generator Rental",
        tagline: "Continuous heavy prime power designed for chemical plants, refineries, mining, and manufacturing.",
        image: "../assets/images/services/service-industrial.jpg",
        icon: "bi-gear-wide-connected",
        description: `Our industrial generator rental service delivers robust electrical power generation engineered for severe ambient conditions and continuous 24/7 heavy duty operations. Equipped with electronic isochronous governors, dual redundant battery starting banks, and heavy particulate filtration, our units ensure zero thermal derating even in extreme industrial heat. We offer single-unit prime ratings from 150 kVA up to 1,250 kVA, with complete synchronizing switchgear capable of scaling to 10+ Megawatt temporary generation stations.`,
        benefits: [
          { title: "Zero Production Interruption", desc: "Guaranteed 99.98% fleet uptime with automated redundant swap capability.", icon: "bi-shield-check" },
          { title: "Heavy Block-Load Acceptance", desc: "Handles instant 100% inductive motor surges without voltage sag.", icon: "bi-lightning-charge-fill" },
          { title: "Automated Fuel Logistics", desc: "Cellular telemetry schedules bulk tanker refills before fuel reaches 30%.", icon: "bi-fuel-pump-fill" },
          { title: "Emission Compliant", desc: "EPA Tier 4 Final / EU Stage V engines compatible with 100% HVO biofuel.", icon: "bi-patch-check-fill" }
        ],
        applications: [
          { title: "Refinery Planned Turnarounds", desc: "Supplying main process lines and worker compounds during utility maintenance.", icon: "bi-gear-wide-connected" },
          { title: "Mining & Quarry Exploration", desc: "Powering primary stone crushers, conveyor lines, and site accommodation.", icon: "bi-cone-striped" },
          { title: "Chemical & Cold Storage", desc: "Maintaining critical temperature control systems during grid outages.", icon: "bi-snow" }
        ]
      },
      commercial: {
        title: "Commercial Generator Rental",
        tagline: "Uninterrupted standby power systems safeguarding commercial towers, hospitals, and retail plazas.",
        image: "../assets/images/services/service-commercial.jpg",
        icon: "bi-building",
        description: `Commercial facilities cannot afford power drops. A momentary blackout can destroy perishable retail inventory, crash financial data networks, or compromise clinical laboratory operations. PowerRent provides soundproof commercial generators with integrated Automatic Transfer Switches (ATS) that detect grid failure and restore clean, regulated electricity within 10 seconds.`,
        benefits: [
          { title: "Sub-10 Second Auto-Start", desc: "NFPA 110 compliant automatic changeover switches for seamless transition.", icon: "bi-stopwatch-fill" },
          { title: "24-Hour Base Tanks", desc: "High-capacity internal double-wall bunded fuel cells require no external tanks.", icon: "bi-fuel-pump-fill" },
          { title: "Clean Harmonic Waveform", desc: "Pure sine wave electricity with THD < 3% protecting delicate server clusters.", icon: "bi-activity" },
          { title: "Silent Acoustic Canopies", desc: "Acoustic attenuation designed for suburban commercial parks and medical offices.", icon: "bi-volume-mute-fill" }
        ],
        applications: [
          { title: "Healthcare Centers & Clinics", desc: "Backing up surgical lights, diagnostic scanners, and cold medicine storage.", icon: "bi-hospital" },
          { title: "Corporate Data Centers", desc: "Uninterruptible power for server racks, HVAC chillers, and network operations.", icon: "bi-server" },
          { title: "Shopping Malls & Supermarkets", desc: "Continuous lighting, point-of-sale systems, and commercial refrigeration.", icon: "bi-cart-check-fill" }
        ]
      },
      construction: {
        title: "Construction Site Power Supply",
        tagline: "Rugged prime power for tower cranes, batching plants, site trailers, and perimeter security.",
        image: "../assets/images/services/service-construction.jpg",
        icon: "bi-cone-striped",
        description: `Construction project delays cost thousands of dollars per hour. Before the permanent electrical grid is connected, heavy civil and commercial infrastructure projects depend entirely on temporary prime power. PowerRent delivers skid-mounted and trailer-mounted generators engineered to absorb the high starting inrush currents of tower cranes, concrete pumps, hoists, and arc welders.`,
        benefits: [
          { title: "Crane Motor Sized", desc: "High-reactance alternators easily start high-inertia crane hoist motors.", icon: "bi-lightning-charge-fill" },
          { title: "Crane & Forklift Mobile", desc: "Integrated heavy forklift pockets and certified central single-point lift eyes.", icon: "bi-truck" },
          { title: "Weather & Impact Proof", desc: "Heavy-gauge galvannealed steel enclosures withstand harsh construction debris.", icon: "bi-shield-shaded" },
          { title: "Complete Cable Packages", desc: "Includes rubber armored distribution boxes, 4/0 feeder cables, and ramps.", icon: "bi-plug-fill" }
        ],
        applications: [
          { title: "Civil Infrastructure & Bridges", desc: "Providing 24-hour continuous power for roadway slipforming and bridge casting.", icon: "bi-building" },
          { title: "High-Rise Commercial Builds", desc: "Powering high-capacity exterior construction hoists and climbing cranes.", icon: "bi-buildings" },
          { title: "Tunneling & Excavation", desc: "Heavy dewatering pumps, subterranean exhaust blowers, and tunnel lighting.", icon: "bi-cone-striped" }
        ]
      },
      events: {
        title: "Event Generator Rental",
        tagline: "Super-silent, ripple-free synchronized power for festivals, film productions, and sporting galas.",
        image: "../assets/images/services/service-events.jpg",
        icon: "bi-music-note-beamed",
        description: `Live entertainment and broadcast television leave zero margin for error. A single audio drop, lighting flicker, or camera feed interruption can disrupt an entire production. PowerRent provides purpose-built entertainment generators engineered with ultra-quiet multi-stage sound baffles (down to 58 dBA at 7 meters) and digital load-sharing synchronizers.`,
        benefits: [
          { title: "Super-Silent Operation", desc: "Multi-stage exhaust silencers and sound attenuation baffles down to 58 dBA.", icon: "bi-volume-mute-fill" },
          { title: "Dual Redundant Synchronization", desc: "Twin generators operate in parallel with automatic bumpless hot-standby failover.", icon: "bi-arrow-repeat" },
          { title: "Pure Sine Wave Output", desc: "Electronic voltage regulation produces clean sine waves safe for LED arrays.", icon: "bi-activity" },
          { title: "Camlock Quick-Connect", desc: "Color-coded 400A Camlock connections for rapid stage power mobilization.", icon: "bi-plug-fill" }
        ],
        applications: [
          { title: "Music Festivals & Arenas", desc: "Synchronized megawatts powering multi-stage line arrays, pyrotechnics, and video.", icon: "bi-music-note-beamed" },
          { title: "Film & Television Shoots", desc: "Ultra-quiet mobile twin packs providing location lighting without audio pickup.", icon: "bi-camera-reels-fill" },
          { title: "Outdoor Weddings & Galas", desc: "Clean power for catering villages, luxury marquees, and architectural uplighting.", icon: "bi-trophy-fill" }
        ]
      },
      emergency: {
        title: "Emergency Power Backup",
        tagline: "Rapid response 60-minute mobilization for storm outages, grid blackouts, and critical plant shutdowns.",
        image: "../assets/images/services/service-emergency.jpg",
        icon: "bi-lightning-fill",
        description: `When utility sub-stations fail or severe weather knocks out overhead transmission lines, every second counts. PowerRent maintains a dedicated 24/7/365 Emergency Dispatch Fleet on standby at strategic depots across major industrial corridors. Our hot-staged generators are pre-fueled, load-bank certified, and hitched for instant dispatch.`,
        benefits: [
          { title: "60-Minute Emergency Dispatch", desc: "Pre-staged highway trailer units ready to roll within minutes of call activation.", icon: "bi-alarm-fill" },
          { title: "Priority Fueling Guarantee", desc: "Dedicated mobile tanker fleet guarantees continuous fuel replenishment.", icon: "bi-fuel-pump-fill" },
          { title: "Plug-and-Play Quick Drops", desc: "Pre-terminated Camlock cables and quick-connect lugs accelerate tie-in.", icon: "bi-lightning-fill" },
          { title: "Turnkey Electrical Management", desc: "Licensed electricians handle transfer switch connection and phase rotation.", icon: "bi-tools" }
        ],
        applications: [
          { title: "Hospitals & Healthcare", desc: "Restoring power to intensive care units, dialysis centers, and vaccine chillers.", icon: "bi-hospital" },
          { title: "Municipal Water Treatment", desc: "Keeping municipal drinking water pressure pumps and sewer lift stations active.", icon: "bi-droplet-fill" },
          { title: "Data Centers & Hubs", desc: "Preventing global server downtime and transaction processing failure.", icon: "bi-server" }
        ]
      },
      installation: {
        title: "Generator Installation Services",
        tagline: "Professional electrical engineering, rigging, crane placement, and ATS commissioning.",
        image: "../assets/images/services/service-installation.jpg",
        icon: "bi-tools",
        description: `A generator is as reliable as its installation. PowerRent's licensed electrical engineering crews oversee every facet of deployment: heavy transport, crane rigging, concrete pad placement, grounding rod testing, sub-panel breaker tie-ins, and automated transfer switch calibration.`,
        benefits: [
          { title: "Licensed Master Electricians", desc: "Complete code compliance with NFPA 70 (NEC) and NFPA 110 regulations.", icon: "bi-person-badge-fill" },
          { title: "Heavy Rigging & Crane Service", desc: "Safe, precision crane lifts over parapet walls, rooftops, and restricted courtyards.", icon: "bi-truck" },
          { title: "Phase Rotation Testing", desc: "Rigorous phase sequencing verification prevents motor rotation reversal.", icon: "bi-arrow-clockwise" },
          { title: "Resistive Load-Bank Testing", desc: "Full 100% capacity load-bank verification conducted prior to system handover.", icon: "bi-speedometer2" }
        ],
        applications: [
          { title: "Rooftop Commercial Placement", desc: "High-reach crane positioning for urban skyscraper standby installations.", icon: "bi-building-up" },
          { title: "Substation Tie-Ins", desc: "Connecting directly to 480V or medium-voltage transformers.", icon: "bi-cpu-fill" },
          { title: "Temporary Switchgear Setup", desc: "Installing outdoor distribution boards and cable crossover ramps.", icon: "bi-sliders2" }
        ]
      },
      maintenance: {
        title: "Generator Maintenance Services",
        tagline: "Scheduled 250-hr servicing, fluid analysis, load-bank testing, and 24/7 on-call field support.",
        image: "../assets/images/services/service-maintenance.jpg",
        icon: "bi-wrench-adjustable",
        description: `Routine maintenance is the key to preventing catastrophic generator failure under load. PowerRent offers complete ongoing service agreements for all rental fleets and customer-owned units. Our factory-certified mechanics perform comprehensive multi-point inspections, oil/coolant analysis, filter replacements, and resistive load-bank testing.`,
        benefits: [
          { title: "Scheduled 250-Hour Intervals", desc: "Full fluid changes, valve lash inspections, and fuel filter replacements.", icon: "bi-calendar-check-fill" },
          { title: "Laboratory Fluid Analysis", desc: "Spectrographic oil testing detects early bearing wear and coolant dilution.", icon: "bi-droplet-half" },
          { title: "Full Resistive Load Banking", desc: "Prevents wet-stacking and verifies cooling system thermal dissipation.", icon: "bi-speedometer2" },
          { title: "24/7 Standby Mechanics", desc: "Emergency mobile field repair service trucks stocked with genuine OEM parts.", icon: "bi-wrench-adjustable" }
        ],
        applications: [
          { title: "Long-Term Construction Projects", desc: "Scheduled weekly maintenance programs for continuous project power.", icon: "bi-cone-striped" },
          { title: "Hospital Standby Generator Care", desc: "Monthly compliance test runs and annual 4-hour load banking.", icon: "bi-hospital" },
          { title: "Industrial Plant Turnarounds", desc: "On-site 24-hr dedicated technicians throughout scheduled factory overhauls.", icon: "bi-gear-wide-connected" }
        ]
      },
      temporary: {
        title: "Temporary Power Solutions",
        tagline: "Turnkey electrical microgrids, step-up transformers, feeder cables, and power distribution panels.",
        image: "../assets/images/services/service-temporary.jpg",
        icon: "bi-plug-fill",
        description: `PowerRent provides complete balance-of-plant temporary distribution. In addition to generators, we engineer custom power distribution networks comprising dry-type step-up transformers (480V to 4,160V/13,800V), heavy Camlock feeder cables, I-line distribution panels, and automatic load-shedding switchboards.`,
        benefits: [
          { title: "Complete Balance of Plant", desc: "Everything from primary generator to secondary distribution sub-panels.", icon: "bi-grid-fill" },
          { title: "Step-Up / Step-Down Transformers", desc: "Transforming 480V generator output to medium voltage for long-distance runs.", icon: "bi-lightning-charge-fill" },
          { title: "Heavy Safety Cable Protectors", desc: "Rubber crossover ramps protect pedestrian and heavy vehicular traffic.", icon: "bi-shield-check" },
          { title: "Automated Load Shedding", desc: "Intelligent controllers prioritize critical circuits during peak demand.", icon: "bi-toggles" }
        ],
        applications: [
          { title: "Utility Substation Overhauls", desc: "Feeding local neighborhood circuits during primary grid maintenance.", icon: "bi-cpu-fill" },
          { title: "Remote Mining Camps", desc: "Complete microgrid distribution powering processing plants and dormitories.", icon: "bi-truck" },
          { title: "Temporary Construction Villages", desc: "Powering multiple contractor trailers, tools, and safety floodlights.", icon: "bi-buildings" }
        ]
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceId = urlParams.get('id') || 'industrial';
      const service = SERVICES_DATABASE[serviceId] || SERVICES_DATABASE['industrial'];

      document.title = `${service.title} | PowerRent`;
      const bc = document.getElementById('breadcrumb-service-title');
      if (bc) bc.textContent = service.title;
      
      const st = document.getElementById('service-title');
      if (st) st.textContent = service.title;
      
      const stag = document.getElementById('service-tagline');
      if (stag) stag.textContent = service.tagline;
      
      const sdesc = document.getElementById('service-description');
      if (sdesc) sdesc.textContent = service.description;
      
      const overviewImg = document.getElementById('service-overview-img');
      if (overviewImg) {
        overviewImg.src = service.image;
        overviewImg.alt = service.title;
      }

      // Populate Benefits Grid (4 Cards with Distinct Icons & Equal Alignment)
      const benefitsGrid = document.getElementById('service-benefits-grid');
      if (benefitsGrid && service.benefits) {
        benefitsGrid.innerHTML = service.benefits.map((b) => `
          <div class="col-md-6 col-lg-3">
            <div class="card benefit-card p-4 rounded-4 border bg-white h-100 shadow-sm transition-hover d-flex flex-column">
              <div class="benefit-icon-badge mb-3 d-inline-flex align-items-center justify-content-center text-accent fs-3 rounded-3" style="width: 50px; height: 50px; background: rgba(245, 158, 11, 0.12); flex-shrink: 0;">
                <i class="bi ${b.icon || 'bi-shield-check'}"></i>
              </div>
              <h5 class="fw-bold text-navy mb-2" style="min-height: 2.85rem; display: flex; align-items: flex-start; line-height: 1.35;">${b.title}</h5>
              <p class="small text-muted mb-0 flex-grow-1" style="line-height: 1.55;">${b.desc}</p>
            </div>
          </div>
        `).join('');
      }

      // Populate Applications Grid (3 Cards with Distinct Icons & Equal Alignment)
      const appGrid = document.getElementById('service-applications-grid');
      if (appGrid && service.applications) {
        appGrid.innerHTML = service.applications.map((a) => `
          <div class="col-md-4">
            <div class="card app-card p-4 rounded-4 border bg-light-grey h-100 shadow-sm transition-hover d-flex flex-column">
              <div class="app-icon-badge mb-3 d-inline-flex align-items-center justify-content-center text-accent fs-3 rounded-3" style="width: 50px; height: 50px; background: rgba(245, 158, 11, 0.12); flex-shrink: 0;">
                <i class="bi ${a.icon || 'bi-check2-circle'}"></i>
              </div>
              <h5 class="fw-bold text-navy mb-2" style="min-height: 2.85rem; display: flex; align-items: flex-start; line-height: 1.35;">${a.title}</h5>
              <p class="small text-muted mb-0 flex-grow-1" style="line-height: 1.55;">${a.desc}</p>
            </div>
          </div>
        `).join('');
      }

      // Populate Related Services (Complementary services excluding current)
      const relatedGrid = document.getElementById('related-services-grid');
      if (relatedGrid) {
        const otherKeys = Object.keys(SERVICES_DATABASE).filter(k => k !== serviceId);
        const selectedKeys = otherKeys.slice(0, 3);
        relatedGrid.innerHTML = selectedKeys.map(k => {
          const s = SERVICES_DATABASE[k];
          return `
            <div class="col-md-4">
              <div class="card related-service-card p-4 rounded-4 border bg-light-grey h-100 shadow-sm transition-hover d-flex flex-column">
                <div class="related-icon-badge mb-3 d-inline-flex align-items-center justify-content-center text-accent fs-3 rounded-3" style="width: 50px; height: 50px; background: rgba(245, 158, 11, 0.12); flex-shrink: 0;">
                  <i class="bi ${s.icon || 'bi-lightning-charge-fill'}"></i>
                </div>
                <h5 class="fw-bold text-navy mb-2" style="min-height: 2.85rem; display: flex; align-items: flex-start; line-height: 1.35;">${s.title}</h5>
                <p class="small text-muted mb-3 flex-grow-1" style="line-height: 1.55;">${s.tagline}</p>
                <a href="service-details.html?id=${k}" class="text-accent fw-bold small text-decoration-none mt-auto pt-2 d-inline-flex align-items-center">
                  View Service <i class="bi bi-arrow-right ms-2"></i>
                </a>
              </div>
            </div>
          `;
        }).join('');
      }
    });
  </script>
</body>
</html>"""

if script_idx != -1:
    content = content[:script_idx] + new_script
    print('[OK] Replaced script block')
else:
    print('[FAIL] Script block start not found')

with open('pages/service-details.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print('[OK] Successfully updated pages/service-details.html')
