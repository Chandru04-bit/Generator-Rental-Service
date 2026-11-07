/**
 * POWERRENT - GENERATOR FLEET FILTERS (filters.js)
 * Live filtering, search, sorting, and dynamic card generation
 */

document.addEventListener('DOMContentLoaded', () => {
  const fleetContainer = document.getElementById('generator-fleet-grid');
  if (!fleetContainer) return;

  const searchInput = document.getElementById('fleet-search-input');
  const categoryFilter = document.getElementById('fleet-category-select');
  const sortSelect = document.getElementById('fleet-sort-select');
  const availabilityCheckbox = document.getElementById('fleet-available-only');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const resultCount = document.getElementById('fleet-result-count');

  // Check URL query param for category (e.g. ?category=60-100)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');
  if (initialCategory && categoryFilter) {
    categoryFilter.value = initialCategory;
    categoryButtons.forEach(btn => {
      if (btn.getAttribute('data-category') === initialCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function renderCard(gen) {
    // Relative path adjustment depending on whether we are in root or pages/
    const isInsidePages = window.location.pathname.includes('/pages/') || 
                          window.location.pathname.includes('/customer/') || 
                          window.location.pathname.includes('/auth/');
    const pathPrefix = isInsidePages ? '../' : './';
    const pagesPrefix = isInsidePages ? '' : 'pages/';

    const statusBadge = gen.status === 'Available'
      ? '<span class="gen-card-status status-available"><i class="bi bi-check-circle-fill me-1"></i>Available</span>'
      : '<span class="gen-card-status status-rented"><i class="bi bi-clock-history me-1"></i>Rented</span>';

    return `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="gen-card">
          <div class="gen-card-img-wrap">
            <span class="gen-card-badge">${gen.capacity} kVA</span>
            ${statusBadge}
            <img src="${pathPrefix}${gen.primaryImage}" alt="${gen.name}" class="gen-card-img" loading="lazy">
          </div>
          <div class="gen-card-body">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-accent fw-bold small"><i class="bi bi-cpu me-1"></i>${gen.model}</span>
              <span class="badge bg-light text-dark border">${gen.categoryLabel}</span>
            </div>
            <h3 class="gen-card-title">${gen.name}</h3>
            <p class="small text-muted mb-2">${gen.shortDesc}</p>
            
            <div class="gen-card-specs">
              <div class="gen-spec-item" title="Fuel Type">
                <i class="bi bi-fuel-pump"></i>
                <span>${gen.fuelType.split('/')[0]}</span>
              </div>
              <div class="gen-spec-item" title="Noise Level">
                <i class="bi bi-volume-down-fill"></i>
                <span>${gen.noiseLevel.split(' ')[0]} dB(A)</span>
              </div>
              <div class="gen-spec-item" title="Fuel Consumption">
                <i class="bi bi-speedometer2"></i>
                <span>${gen.fuelConsumption.split('@')[0]}</span>
              </div>
              <div class="gen-spec-item" title="Tank Capacity">
                <i class="bi bi-droplet-fill"></i>
                <span>${gen.tankCapacity.split(' ')[0]} L</span>
              </div>
            </div>

            <div class="gen-card-price-wrap">
              <div>
                <span class="gen-price-amount">$${gen.dailyPrice}</span>
                <span class="gen-price-unit">/ day</span>
              </div>
              <div class="text-end small text-muted">
                Weekly: <strong class="text-navy">$${gen.weeklyPrice}</strong>
              </div>
            </div>

            <div class="gen-card-actions">
              <a href="${pathPrefix}${pagesPrefix}generator-details.html?id=${gen.id}" class="btn btn-pr-secondary btn-sm">
                <i class="bi bi-info-circle me-1"></i>Details
              </a>
              <a href="${pathPrefix}${pagesPrefix}booking.html?id=${gen.id}" class="btn btn-pr-primary btn-sm">
                <i class="bi bi-calendar-check me-1"></i>Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function filterAndDisplay() {
    let list = window.PowerRentFleet ? window.PowerRentFleet.getAll() : [];
    
    // Category from select or buttons
    const activeCategory = categoryFilter ? categoryFilter.value : 'all';
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter(g => g.category === activeCategory);
    }

    // Search query
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      list = list.filter(g => 
        g.name.toLowerCase().includes(query) ||
        g.model.toLowerCase().includes(query) ||
        g.categoryLabel.toLowerCase().includes(query) ||
        g.shortDesc.toLowerCase().includes(query)
      );
    }

    // Available only
    if (availabilityCheckbox && availabilityCheckbox.checked) {
      list = list.filter(g => g.status === 'Available');
    }

    // Sorting
    const sortVal = sortSelect ? sortSelect.value : 'default';
    if (sortVal === 'price-low') {
      list.sort((a, b) => a.dailyPrice - b.dailyPrice);
    } else if (sortVal === 'price-high') {
      list.sort((a, b) => b.dailyPrice - a.dailyPrice);
    } else if (sortVal === 'capacity-low') {
      list.sort((a, b) => a.capacity - b.capacity);
    } else if (sortVal === 'capacity-high') {
      list.sort((a, b) => b.capacity - a.capacity);
    }

    // Update count
    if (resultCount) {
      resultCount.textContent = `${list.length} Generator${list.length === 1 ? '' : 's'} Found`;
    }

    // Render
    if (list.length === 0) {
      fleetContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="p-5 border rounded-3 bg-white">
            <i class="bi bi-search text-muted" style="font-size: 3rem;"></i>
            <h4 class="mt-3">No Generators Found</h4>
            <p class="text-muted">No equipment matches your current search and filter settings. Try resetting the filters.</p>
            <button id="reset-fleet-filters" class="btn btn-pr-primary mt-2">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Reset All Filters
            </button>
          </div>
        </div>
      `;
      const resetBtn = document.getElementById('reset-fleet-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (categoryFilter) categoryFilter.value = 'all';
          if (availabilityCheckbox) availabilityCheckbox.checked = false;
          if (sortSelect) sortSelect.value = 'default';
          categoryButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === 'all'));
          filterAndDisplay();
        });
      }
    } else {
      fleetContainer.innerHTML = list.map(renderCard).join('');
    }
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', filterAndDisplay);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      const val = categoryFilter.value;
      categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === val);
      });
      filterAndDisplay();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', filterAndDisplay);
  }
  if (availabilityCheckbox) {
    availabilityCheckbox.addEventListener('change', filterAndDisplay);
  }
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      if (categoryFilter) categoryFilter.value = cat;
      filterAndDisplay();
    });
  });

  // Initial render
  filterAndDisplay();
});
