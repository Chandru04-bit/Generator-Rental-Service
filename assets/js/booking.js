/**
 * POWERRENT - BOOKING ENGINE & CALCULATOR (booking.js)
 * Real-time price calculation, date validation, and localStorage persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('generator-booking-form');
  if (!bookingForm) return;

  const generatorSelect = document.getElementById('booking-generator-select');
  const startDateInput = document.getElementById('booking-start-date');
  const endDateInput = document.getElementById('booking-end-date');
  const durationInput = document.getElementById('booking-duration-days');
  const serviceCheckboxes = document.querySelectorAll('.booking-addon-service');

  // Summary Elements
  const summaryGenName = document.getElementById('summary-gen-name');
  const summaryGenCapacity = document.getElementById('summary-gen-capacity');
  const summaryDates = document.getElementById('summary-dates');
  const summaryDays = document.getElementById('summary-days');
  const summaryDailyRate = document.getElementById('summary-daily-rate');
  const summaryBaseCost = document.getElementById('summary-base-cost');
  const summaryDeliveryFee = document.getElementById('summary-delivery-fee');
  const summaryDeposit = document.getElementById('summary-deposit');
  const summaryAddons = document.getElementById('summary-addons');
  const summaryTotal = document.getElementById('summary-total');

  // Populate generator options from fleet
  if (window.PowerRentFleet && generatorSelect) {
    generatorSelect.innerHTML = '<option value="">-- Choose a Generator Model --</option>' +
      window.PowerRentFleet.getAll().map(g => `
        <option value="${g.id}" data-price="${g.dailyPrice}" data-capacity="${g.capacity}" data-delivery="${g.deliveryFee}" data-deposit="${g.securityDeposit}">
          ${g.name} (${g.capacity} kVA) - $${g.dailyPrice}/day
        </option>
      `).join('');

    // Pre-select if passed in query param
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('id');
    if (paramId) {
      generatorSelect.value = paramId;
    }
  }

  // Prevent past dates
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  if (startDateInput) {
    startDateInput.min = minDateStr;
  }
  if (endDateInput) {
    endDateInput.min = minDateStr;
  }

  // Default dates: tomorrow to +4 days
  if (startDateInput && !startDateInput.value) {
    const tmrw = new Date(today);
    tmrw.setDate(tmrw.getDate() + 1);
    startDateInput.value = tmrw.toISOString().split('T')[0];
  }
  if (endDateInput && !endDateInput.value) {
    const endDef = new Date(today);
    endDef.setDate(endDef.getDate() + 4);
    endDateInput.value = endDef.toISOString().split('T')[0];
  }

  function calculateBooking() {
    const selectedOption = generatorSelect && generatorSelect.options[generatorSelect.selectedIndex];
    const genId = generatorSelect ? generatorSelect.value : '';
    const gen = window.PowerRentFleet ? window.PowerRentFleet.getById(genId) : null;

    let days = 1;
    const startVal = startDateInput ? startDateInput.value : '';
    const endVal = endDateInput ? endDateInput.value : '';

    if (startVal && endVal) {
      const start = new Date(startVal);
      const end = new Date(endVal);

      // Validate end is after start
      if (end < start) {
        endDateInput.setCustomValidity('End date cannot be earlier than start date.');
        days = 1;
      } else {
        endDateInput.setCustomValidity('');
        const diffTime = Math.abs(end - start);
        days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      }
    }

    if (durationInput) {
      durationInput.value = `${days} Day${days > 1 ? 's' : ''}`;
    }

    if (!gen || !genId) {
      if (summaryGenName) summaryGenName.textContent = 'None Selected';
      if (summaryGenCapacity) summaryGenCapacity.textContent = '--';
      if (summaryDates) summaryDates.textContent = '--';
      if (summaryDays) summaryDays.textContent = '0 Days';
      if (summaryDailyRate) summaryDailyRate.textContent = '$0';
      if (summaryBaseCost) summaryBaseCost.textContent = '$0';
      if (summaryDeliveryFee) summaryDeliveryFee.textContent = '$0';
      if (summaryDeposit) summaryDeposit.textContent = '$0';
      if (summaryAddons) summaryAddons.textContent = '$0';
      if (summaryTotal) summaryTotal.textContent = '$0';
      return;
    }

    const dailyRate = gen.dailyPrice;
    let baseRentalCost = dailyRate * days;

    // Apply 10% discount for week+ rentals, 20% for month+ rentals
    if (days >= 30) {
      baseRentalCost = Math.round(baseRentalCost * 0.80);
    } else if (days >= 7) {
      baseRentalCost = Math.round(baseRentalCost * 0.90);
    }

    // Addon services cost
    let addonsTotal = 0;
    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        const costPerDay = parseFloat(cb.getAttribute('data-cost') || 0);
        const costFixed = parseFloat(cb.getAttribute('data-fixed') || 0);
        addonsTotal += (costPerDay * days) + costFixed;
      }
    });

    const delivery = gen.deliveryFee;
    const deposit = gen.securityDeposit;
    const totalCost = baseRentalCost + delivery + deposit + addonsTotal;

    // Update Summary UI
    if (summaryGenName) summaryGenName.textContent = gen.name;
    if (summaryGenCapacity) summaryGenCapacity.textContent = `${gen.capacity} kVA`;
    if (summaryDates) summaryDates.textContent = `${startVal} to ${endVal}`;
    if (summaryDays) summaryDays.textContent = `${days} Day${days > 1 ? 's' : ''}`;
    if (summaryDailyRate) summaryDailyRate.textContent = `$${dailyRate}`;
    if (summaryBaseCost) summaryBaseCost.textContent = `$${baseRentalCost.toLocaleString()}`;
    if (summaryDeliveryFee) summaryDeliveryFee.textContent = `$${delivery}`;
    if (summaryDeposit) summaryDeposit.textContent = `$${deposit}`;
    if (summaryAddons) summaryAddons.textContent = `$${addonsTotal.toLocaleString()}`;
    if (summaryTotal) summaryTotal.textContent = `$${totalCost.toLocaleString()}`;
  }

  // Event Listeners for Live Update
  if (generatorSelect) {
    generatorSelect.addEventListener('change', calculateBooking);
  }
  if (startDateInput) {
    startDateInput.addEventListener('change', () => {
      if (endDateInput && startDateInput.value) {
        endDateInput.min = startDateInput.value;
        if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
          endDateInput.value = startDateInput.value;
        }
      }
      calculateBooking();
    });
  }
  if (endDateInput) {
    endDateInput.addEventListener('change', calculateBooking);
  }
  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateBooking);
  });

  // Handle Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!bookingForm.checkValidity()) {
      e.stopPropagation();
      bookingForm.classList.add('was-validated');
      return;
    }

    const genId = generatorSelect.value;
    if (!genId) {
      alert('Please select a generator model from the fleet.');
      generatorSelect.focus();
      return;
    }

    const gen = window.PowerRentFleet.getById(genId);
    const fullName = document.getElementById('booking-full-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const address = document.getElementById('booking-address').value.trim();
    const city = document.getElementById('booking-city').value.trim();
    const notes = (document.getElementById('booking-notes') || {}).value || '';
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    const startD = new Date(startDate);
    const endD = new Date(endDate);
    const diffTime = Math.abs(endD - startD);
    const days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    let baseCost = gen.dailyPrice * days;
    if (days >= 30) baseCost = Math.round(baseCost * 0.80);
    else if (days >= 7) baseCost = Math.round(baseCost * 0.90);

    let addonsCost = 0;
    const selectedAddons = [];
    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        const label = cb.parentElement.textContent.trim();
        const cost = (parseFloat(cb.getAttribute('data-cost') || 0) * days) + parseFloat(cb.getAttribute('data-fixed') || 0);
        addonsCost += cost;
        selectedAddons.push({ label, cost });
      }
    });

    const totalEstimated = baseCost + gen.deliveryFee + gen.securityDeposit + addonsCost;
    const bookingRef = 'PR-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const invoiceNumber = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    const todayStr = new Date().toISOString().split('T')[0];

    const newBooking = {
      id: bookingRef,
      invoiceNumber: invoiceNumber,
      createdAt: todayStr,
      customerName: fullName,
      email: email,
      phone: phone,
      address: address,
      city: city,
      notes: notes,
      generatorId: gen.id,
      generatorName: gen.name,
      generatorModel: gen.model,
      capacity: gen.capacity,
      generatorImage: gen.primaryImage,
      dailyRate: gen.dailyPrice,
      startDate: startDate,
      endDate: endDate,
      durationDays: days,
      baseCost: baseCost,
      deliveryFee: gen.deliveryFee,
      deposit: gen.securityDeposit,
      addonsCost: addonsCost,
      addonsList: selectedAddons,
      totalAmount: totalEstimated,
      status: 'Confirmed'
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('powerrent_bookings') || '[]');
    existingBookings.unshift(newBooking);
    localStorage.setItem('powerrent_bookings', JSON.stringify(existingBookings));

    // Save corresponding Invoice
    const existingInvoices = JSON.parse(localStorage.getItem('powerrent_invoices') || '[]');
    const newInvoice = {
      invoiceNumber: invoiceNumber,
      bookingId: bookingRef,
      invoiceDate: todayStr,
      dueDate: endDate,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: `${address}, ${city}`,
      generatorName: gen.name,
      generatorModel: gen.model,
      capacity: `${gen.capacity} kVA`,
      duration: `${days} Days (${startDate} to ${endDate})`,
      dailyRate: gen.dailyPrice,
      rentalAmount: baseCost,
      additionalCharges: gen.deliveryFee + gen.securityDeposit + addonsCost,
      totalAmount: totalEstimated,
      paymentStatus: 'Paid'
    };
    existingInvoices.unshift(newInvoice);
    localStorage.setItem('powerrent_invoices', JSON.stringify(existingInvoices));

    // Save latest booking for immediate access on confirmation page
    localStorage.setItem('powerrent_latest_booking', JSON.stringify(newBooking));

    // Redirect to confirmation page
    const isInsidePages = window.location.pathname.includes('/pages/');
    const redirectUrl = isInsidePages
      ? `booking-confirmation.html?ref=${bookingRef}`
      : `pages/booking-confirmation.html?ref=${bookingRef}`;

    window.location.href = redirectUrl;
  });

  // Run initial calculation
  calculateBooking();
});
