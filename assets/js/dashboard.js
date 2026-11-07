/**
 * POWERRENT - CUSTOMER DASHBOARD CONTROLLER (dashboard.js)
 * Manages Overview, Bookings, Active Rentals, History, Invoices, and Profile
 */

document.addEventListener('DOMContentLoaded', () => {
  // Protect dashboard routes
  if (window.location.pathname.includes('/customer/')) {
    if (window.PowerRentAuth && !window.PowerRentAuth.requireAuth()) {
      return;
    }
  }

  // Seed sample bookings if none exist
  seedDemoBookings();

  // Populate user data in dashboard topbar/sidebar
  populateDashboardUser();

  // Route-specific page renderers
  renderOverviewPage();
  renderMyBookingsPage();
  renderActiveRentalsPage();
  renderRentalHistoryPage();
  renderProfilePage();
});

function seedDemoBookings() {
  if (!localStorage.getItem('powerrent_bookings') || JSON.parse(localStorage.getItem('powerrent_bookings')).length === 0) {
    const demoBookings = [
      {
        id: 'PR-2026-88102',
        invoiceNumber: 'INV-2026-001',
        createdAt: '2026-10-20',
        customerName: 'John Doe',
        email: 'john.doe@enterprise.com',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Suite 400',
        city: 'Chicago, IL',
        generatorId: 'gen-250kva',
        generatorName: 'Cummins 250kVA Prime Powerhouse',
        generatorModel: 'C250-D5-Power',
        capacity: 250,
        generatorImage: 'assets/images/generators/gen-125-250-2.jpg',
        dailyRate: 520,
        startDate: '2026-11-01',
        endDate: '2026-11-20',
        durationDays: 19,
        baseCost: 8892,
        deliveryFee: 200,
        deposit: 2200,
        addonsCost: 450,
        totalAmount: 11742,
        status: 'Active'
      },
      {
        id: 'PR-2026-77341',
        invoiceNumber: 'INV-2026-002',
        createdAt: '2026-10-10',
        customerName: 'John Doe',
        email: 'john.doe@enterprise.com',
        phone: '+1 (555) 234-5678',
        address: 'Site #12 Logistics Center',
        city: 'Joliet, IL',
        generatorId: 'gen-80kva',
        generatorName: 'Cummins 80kVA Industrial Power',
        generatorModel: 'C80-D5-Silent',
        capacity: 80,
        generatorImage: 'assets/images/generators/gen-60-100-1.jpg',
        dailyRate: 240,
        startDate: '2026-11-05',
        endDate: '2026-11-15',
        durationDays: 10,
        baseCost: 2160,
        deliveryFee: 110,
        deposit: 1000,
        addonsCost: 200,
        totalAmount: 3470,
        status: 'Active'
      },
      {
        id: 'PR-2026-66290',
        invoiceNumber: 'INV-2026-003',
        createdAt: '2026-09-15',
        customerName: 'John Doe',
        email: 'john.doe@enterprise.com',
        phone: '+1 (555) 234-5678',
        address: 'Downtown Concert Pavilion',
        city: 'Chicago, IL',
        generatorId: 'gen-100kva',
        generatorName: 'Volvo Penta 100kVA Ultra-Quiet',
        generatorModel: 'VP-100-Quiet',
        capacity: 100,
        generatorImage: 'assets/images/generators/gen-60-100-2.jpg',
        dailyRate: 290,
        startDate: '2026-09-18',
        endDate: '2026-09-22',
        durationDays: 4,
        baseCost: 1160,
        deliveryFee: 125,
        deposit: 1200,
        addonsCost: 150,
        totalAmount: 2635,
        status: 'Completed'
      },
      {
        id: 'PR-2026-55118',
        invoiceNumber: 'INV-2026-004',
        createdAt: '2026-08-01',
        customerName: 'John Doe',
        email: 'john.doe@enterprise.com',
        phone: '+1 (555) 234-5678',
        address: 'Northside Medical Clinic Annex',
        city: 'Evanston, IL',
        generatorId: 'gen-35kva',
        generatorName: 'TitanPower 35kVA Commercial Silent',
        generatorModel: 'TP-35CS-Pro',
        capacity: 35,
        generatorImage: 'assets/images/generators/gen-25-50-1.jpg',
        dailyRate: 140,
        startDate: '2026-08-05',
        endDate: '2026-08-12',
        durationDays: 7,
        baseCost: 882,
        deliveryFee: 75,
        deposit: 600,
        addonsCost: 100,
        totalAmount: 1657,
        status: 'Completed'
      },
      {
        id: 'PR-2026-99410',
        invoiceNumber: 'INV-2026-005',
        createdAt: '2026-11-06',
        customerName: 'John Doe',
        email: 'john.doe@enterprise.com',
        phone: '+1 (555) 234-5678',
        address: 'West Substation Ground',
        city: 'Naperville, IL',
        generatorId: 'gen-500kva',
        generatorName: 'CAT 500kVA Heavy Containerized',
        generatorModel: 'CAT-C15-500',
        capacity: 500,
        generatorImage: 'assets/images/generators/gen-300-500-2.jpg',
        dailyRate: 950,
        startDate: '2026-11-25',
        endDate: '2026-12-05',
        durationDays: 10,
        baseCost: 8550,
        deliveryFee: 350,
        deposit: 4000,
        addonsCost: 600,
        totalAmount: 13500,
        status: 'Confirmed'
      }
    ];
    localStorage.setItem('powerrent_bookings', JSON.stringify(demoBookings));

    // Seed matching invoices
    const demoInvoices = demoBookings.map(b => ({
      invoiceNumber: b.invoiceNumber,
      bookingId: b.id,
      invoiceDate: b.createdAt,
      dueDate: b.endDate,
      customerName: b.customerName,
      customerEmail: b.email,
      customerPhone: b.phone,
      customerAddress: `${b.address}, ${b.city}`,
      generatorName: b.generatorName,
      generatorModel: b.generatorModel,
      capacity: `${b.capacity} kVA`,
      duration: `${b.durationDays} Days (${b.startDate} to ${b.endDate})`,
      dailyRate: b.dailyRate,
      rentalAmount: b.baseCost,
      additionalCharges: b.deliveryFee + b.deposit + b.addonsCost,
      totalAmount: b.totalAmount,
      paymentStatus: b.status === 'Completed' || b.status === 'Active' ? 'Paid' : 'Pending'
    }));
    localStorage.setItem('powerrent_invoices', JSON.stringify(demoInvoices));
  }
}

function populateDashboardUser() {
  const user = window.PowerRentAuth ? window.PowerRentAuth.getCurrentUser() : null;
  if (!user) return;

  document.querySelectorAll('.dash-user-name-display').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.dash-user-email-display').forEach(el => el.textContent = user.email);
  document.querySelectorAll('.dash-user-company-display').forEach(el => el.textContent = user.company || 'Enterprise Account');

  // Sidebar logout link
  const sidebarLogout = document.getElementById('dash-sidebar-logout');
  if (sidebarLogout) {
    sidebarLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.PowerRentAuth) window.PowerRentAuth.logout();
    });
  }
}

// 1. Overview Page
function renderOverviewPage() {
  const statsOverview = document.getElementById('dash-overview-stats');
  if (!statsOverview) return;

  const bookings = JSON.parse(localStorage.getItem('powerrent_bookings') || '[]');
  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'Active').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const pendingCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;

  document.getElementById('stat-total-bookings').textContent = totalCount;
  document.getElementById('stat-active-rentals').textContent = activeCount;
  document.getElementById('stat-completed-rentals').textContent = completedCount;
  document.getElementById('stat-pending-bookings').textContent = pendingCount;

  // Recent Bookings Table
  const tbody = document.getElementById('dash-recent-bookings-tbody');
  if (tbody) {
    const recents = bookings.slice(0, 5);
    tbody.innerHTML = recents.map(b => `
      <tr>
        <td><strong class="text-accent">${b.id}</strong></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="../${b.generatorImage}" alt="${b.generatorName}" class="rounded" style="width: 44px; height: 34px; object-fit: cover;">
            <div>
              <div class="fw-bold small text-navy">${b.generatorName}</div>
              <div class="text-muted" style="font-size: 0.76rem;">${b.capacity} kVA | ${b.generatorModel}</div>
            </div>
          </div>
        </td>
        <td><span class="small">${b.startDate} to ${b.endDate}</span></td>
        <td><span class="badge bg-light text-dark border">${b.durationDays} Days</span></td>
        <td><strong>$${b.totalAmount.toLocaleString()}</strong></td>
        <td><span class="badge-status badge-status-${b.status.toLowerCase()}">${b.status}</span></td>
        <td>
          <a href="invoices.html?ref=${b.id}" class="btn btn-sm btn-outline-secondary" title="View Invoice">
            <i class="bi bi-file-earmark-text"></i>
          </a>
        </td>
      </tr>
    `).join('');
  }
}

// 2. My Bookings Page
function renderMyBookingsPage() {
  const bookingsContainer = document.getElementById('my-bookings-list-container');
  if (!bookingsContainer) return;

  const bookings = JSON.parse(localStorage.getItem('powerrent_bookings') || '[]');
  const searchInput = document.getElementById('booking-search-input');
  const statusFilterBtns = document.querySelectorAll('.booking-filter-btn');

  let currentStatus = 'all';

  function filterAndDisplay() {
    let list = [...bookings];
    if (currentStatus !== 'all') {
      list = list.filter(b => b.status.toLowerCase() === currentStatus.toLowerCase());
    }
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (q) {
      list = list.filter(b => 
        b.id.toLowerCase().includes(q) ||
        b.generatorName.toLowerCase().includes(q) ||
        b.generatorModel.toLowerCase().includes(q)
      );
    }

    if (list.length === 0) {
      bookingsContainer.innerHTML = `
        <div class="text-center py-5 border rounded bg-white">
          <i class="bi bi-calendar-x text-muted fs-1"></i>
          <h5 class="mt-2">No Bookings Found</h5>
          <p class="text-muted small">No rental bookings match your search criteria.</p>
          <a href="../pages/services.html" class="btn btn-sm btn-pr-primary mt-2">Book a Generator</a>
        </div>
      `;
      return;
    }

    bookingsContainer.innerHTML = list.map(b => `
      <div class="dash-panel mb-3 p-3">
        <div class="row align-items-center">
          <div class="col-md-3 mb-2 mb-md-0">
            <div class="d-flex align-items-center gap-3">
              <img src="../${b.generatorImage}" alt="${b.generatorName}" class="rounded" style="width: 70px; height: 55px; object-fit: cover;">
              <div>
                <span class="badge-status badge-status-${b.status.toLowerCase()} mb-1">${b.status}</span>
                <div class="fw-bold text-accent" style="font-size: 0.9rem;">${b.id}</div>
                <div class="text-muted small">${b.createdAt}</div>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-2 mb-md-0">
            <div class="fw-bold text-navy">${b.generatorName}</div>
            <div class="text-muted small">${b.capacity} kVA Prime Output</div>
            <div class="text-muted small"><i class="bi bi-geo-alt me-1"></i>${b.city}</div>
          </div>
          <div class="col-md-3 mb-2 mb-md-0">
            <div class="small text-muted">Rental Schedule:</div>
            <div class="fw-semibold small">${b.startDate} &rarr; ${b.endDate}</div>
            <div class="text-muted small">Duration: <strong>${b.durationDays} Days</strong></div>
          </div>
          <div class="col-md-3 text-md-end">
            <div class="text-muted small">Total Cost:</div>
            <div class="fs-5 fw-bold text-navy mb-2">$${b.totalAmount.toLocaleString()}</div>
            <a href="invoice-details.html?ref=${b.id}" class="btn btn-sm btn-pr-secondary">
              <i class="bi bi-receipt me-1"></i>View Invoice
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterAndDisplay);
  }
  statusFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      statusFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.getAttribute('data-status');
      filterAndDisplay();
    });
  });

  filterAndDisplay();
}

// 3. Active Rentals Page
function renderActiveRentalsPage() {
  const activeContainer = document.getElementById('active-rentals-list-container');
  if (!activeContainer) return;

  const bookings = JSON.parse(localStorage.getItem('powerrent_bookings') || '[]');
  const activeList = bookings.filter(b => b.status === 'Active');

  if (activeList.length === 0) {
    activeContainer.innerHTML = `
      <div class="text-center py-5 border rounded bg-white">
        <i class="bi bi-lightning-charge text-muted fs-1"></i>
        <h5 class="mt-2">No Active Generator Rentals</h5>
        <p class="text-muted small">You currently have no equipment actively deployed on site.</p>
        <a href="../pages/services.html" class="btn btn-sm btn-pr-primary mt-2">Browse Services</a>
      </div>
    `;
    return;
  }

  activeContainer.innerHTML = activeList.map(b => `
    <div class="dash-panel mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
        <div>
          <span class="badge-status badge-status-active"><i class="bi bi-broadcast me-1"></i>Running On-Site</span>
          <h4 class="mb-0 mt-2 fw-bold text-navy">${b.generatorName} (${b.capacity} kVA)</h4>
          <span class="text-muted small">Booking Reference: <strong>${b.id}</strong> | Serial No: SN-${b.capacity}K-2026</span>
        </div>
        <div class="text-md-end mt-2 mt-md-0">
          <div class="small text-muted">Expected Return Date</div>
          <div class="fw-bold fs-5 text-accent">${b.endDate}</div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-lg-3 col-md-4">
          <img src="../${b.generatorImage}" alt="${b.generatorName}" class="img-fluid rounded border shadow-sm">
        </div>
        <div class="col-lg-5 col-md-8">
          <h6 class="fw-bold text-navy mb-2"><i class="bi bi-info-circle me-1 text-accent"></i>Deployment Information</h6>
          <ul class="list-unstyled small mb-3">
            <li class="mb-1"><strong>Site Address:</strong> ${b.address}, ${b.city}</li>
            <li class="mb-1"><strong>Commission Date:</strong> ${b.startDate}</li>
            <li class="mb-1"><strong>Contracted Period:</strong> ${b.durationDays} Days</li>
            <li class="mb-1"><strong>Service Frequency:</strong> Every 250 Runtime Hours (Automated Dispatch)</li>
            <li class="mb-1"><strong>Telemetry Status:</strong> <span class="text-success"><i class="bi bi-wifi me-1"></i>Connected & Online</span></li>
          </ul>
        </div>
        <div class="col-lg-4 col-md-12">
          <div class="p-3 bg-light rounded border">
            <h6 class="fw-bold text-navy mb-2">Equipment Operations</h6>
            <div class="d-flex justify-content-between small mb-1">
              <span>Estimated Runtime:</span>
              <strong>142 / 250 Hrs</strong>
            </div>
            <div class="progress mb-2" style="height: 6px;">
              <div class="progress-bar bg-warning" role="progressbar" style="width: 58%"></div>
            </div>
            <div class="d-flex justify-content-between small mb-3">
              <span>Fuel Level (Sensors):</span>
              <strong class="text-success">84% Capacity</strong>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-sm btn-pr-primary" onclick="alert('Extension request sent for ${b.id}. Our logistics team will contact you within 30 minutes.');">
                <i class="bi bi-calendar-plus me-1"></i>Extend Rental Period
              </button>
              <button class="btn btn-sm btn-outline-secondary" onclick="alert('Service ticket created for ${b.generatorName}. Field engineer on standby.');">
                <i class="bi bi-tools me-1"></i>Request Field Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// 4. Rental History Page
function renderRentalHistoryPage() {
  const historyContainer = document.getElementById('rental-history-list-container');
  if (!historyContainer) return;

  const bookings = JSON.parse(localStorage.getItem('powerrent_bookings') || '[]');
  const completedList = bookings.filter(b => b.status === 'Completed');

  if (completedList.length === 0) {
    historyContainer.innerHTML = `
      <div class="text-center py-5 border rounded bg-white">
        <i class="bi bi-clock-history text-muted fs-1"></i>
        <h5 class="mt-2">No Past Rental History</h5>
        <p class="text-muted small">Completed generator rentals will be archived here with inspection reports and receipts.</p>
      </div>
    `;
    return;
  }

  historyContainer.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>Reference</th>
            <th>Generator Model</th>
            <th>Capacity</th>
            <th>Rental Period</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${completedList.map(b => `
            <tr>
              <td><strong class="text-accent">${b.id}</strong></td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <img src="../${b.generatorImage}" alt="${b.generatorName}" class="rounded" style="width: 45px; height: 35px; object-fit: cover;">
                  <span class="fw-bold small text-navy">${b.generatorName}</span>
                </div>
              </td>
              <td>${b.capacity} kVA</td>
              <td><span class="small">${b.startDate} to ${b.endDate} (${b.durationDays}d)</span></td>
              <td><strong>$${b.totalAmount.toLocaleString()}</strong></td>
              <td><span class="badge-status badge-status-completed">Completed</span></td>
              <td>
                <div class="d-flex gap-2">
                  <a href="invoice-details.html?ref=${b.id}" class="btn btn-sm btn-outline-secondary" title="Invoice">
                    <i class="bi bi-receipt"></i>
                  </a>
                  <a href="../pages/booking.html?id=${b.generatorId}" class="btn btn-sm btn-pr-primary" title="Re-rent this generator">
                    <i class="bi bi-repeat me-1"></i>Re-Book
                  </a>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 5. Profile Page
function renderProfilePage() {
  const profileForm = document.getElementById('customer-profile-form');
  if (!profileForm) return;

  const user = window.PowerRentAuth ? window.PowerRentAuth.getCurrentUser() : null;
  if (!user) return;

  document.getElementById('profile-name').value = user.name || '';
  document.getElementById('profile-email').value = user.email || '';
  document.getElementById('profile-phone').value = user.phone || '';
  document.getElementById('profile-company').value = user.company || '';
  document.getElementById('profile-address').value = user.address || '';
  document.getElementById('profile-city').value = user.city || '';

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    user.name = document.getElementById('profile-name').value.trim();
    user.phone = document.getElementById('profile-phone').value.trim();
    user.company = document.getElementById('profile-company').value.trim();
    user.address = document.getElementById('profile-address').value.trim();
    user.city = document.getElementById('profile-city').value.trim();

    localStorage.setItem('powerrent_user', JSON.stringify(user));
    populateDashboardUser();

    if (window.PowerRentAuth) {
      window.PowerRentAuth.showToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
    }
  });
}
