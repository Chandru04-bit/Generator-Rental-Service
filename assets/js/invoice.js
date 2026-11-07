/**
 * POWERRENT - INVOICE ENGINE (invoice.js)
 * Manages invoice rendering, lookup by booking reference, printing, and download
 */

document.addEventListener('DOMContentLoaded', () => {
  renderInvoicesList();
  renderInvoiceDetails();
});

function renderInvoicesList() {
  const container = document.getElementById('invoices-list-tbody');
  if (!container) return;

  const invoices = JSON.parse(localStorage.getItem('powerrent_invoices') || '[]');

  if (invoices.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-4 text-muted">
          No invoices recorded yet. Invoices are generated automatically upon booking confirmation.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = invoices.map(inv => `
    <tr>
      <td><strong class="text-accent">${inv.invoiceNumber}</strong></td>
      <td><span class="badge bg-light text-dark border">${inv.bookingId}</span></td>
      <td><span class="small">${inv.invoiceDate}</span></td>
      <td>
        <div class="fw-bold small text-navy">${inv.generatorName}</div>
        <div class="text-muted" style="font-size: 0.78rem;">${inv.capacity}</div>
      </td>
      <td>$${inv.rentalAmount.toLocaleString()}</td>
      <td>$${inv.additionalCharges.toLocaleString()}</td>
      <td><strong>$${inv.totalAmount.toLocaleString()}</strong></td>
      <td>
        <span class="badge-status ${inv.paymentStatus === 'Paid' ? 'badge-status-paid' : 'badge-status-pending'}">
          <i class="bi ${inv.paymentStatus === 'Paid' ? 'bi-check-all' : 'bi-clock'} me-1"></i>${inv.paymentStatus}
        </span>
      </td>
      <td>
        <div class="d-flex gap-1">
          <a href="invoice-details.html?ref=${inv.bookingId}" class="btn btn-sm btn-outline-secondary" title="View Full Invoice">
            <i class="bi bi-eye"></i>
          </a>
          <button class="btn btn-sm btn-outline-dark" onclick="window.location.href='invoice-details.html?ref=${inv.bookingId}&print=1'" title="Print Invoice">
            <i class="bi bi-printer"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderInvoiceDetails() {
  const detailCard = document.getElementById('invoice-detail-wrapper');
  if (!detailCard) return;

  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref') || urlParams.get('id');
  const shouldPrint = urlParams.get('print') === '1';

  const invoices = JSON.parse(localStorage.getItem('powerrent_invoices') || '[]');
  const bookings = JSON.parse(localStorage.getItem('powerrent_bookings') || '[]');

  let inv = invoices.find(i => i.bookingId === ref || i.invoiceNumber === ref);
  let b = bookings.find(item => item.id === ref || item.invoiceNumber === ref);

  if (!inv && invoices.length > 0) {
    inv = invoices[0];
    b = bookings.find(item => item.id === inv.bookingId) || bookings[0];
  }

  if (!inv) {
    detailCard.innerHTML = `
      <div class="alert alert-warning text-center">
        <h4>Invoice Not Found</h4>
        <p>No invoice matched the requested reference. Please check your bookings list.</p>
        <a href="invoices.html" class="btn btn-pr-primary mt-2">Back to Invoices</a>
      </div>
    `;
    return;
  }

  // Populate Fields
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText('inv-number', inv.invoiceNumber);
  setText('inv-date', inv.invoiceDate);
  setText('inv-due-date', inv.dueDate || inv.invoiceDate);
  setText('inv-status', inv.paymentStatus);
  setText('inv-booking-ref', inv.bookingId);

  // Customer info
  setText('inv-cust-name', inv.customerName);
  setText('inv-cust-email', inv.customerEmail);
  setText('inv-cust-phone', inv.customerPhone);
  setText('inv-cust-address', inv.customerAddress);

  // Line items
  setText('inv-item-name', `${inv.generatorName} (${inv.generatorModel})`);
  setText('inv-item-specs', `${inv.capacity} Prime Diesel Generator | Contract Period: ${inv.duration}`);
  setText('inv-item-rate', `$${inv.dailyRate}/day`);
  setText('inv-item-rental-amount', `$${inv.rentalAmount.toLocaleString()}`);

  setText('inv-delivery-fee', `$${b ? b.deliveryFee : 150}`);
  setText('inv-deposit', `$${b ? b.deposit : 1000}`);
  setText('inv-addons', `$${b ? b.addonsCost : 0}`);
  setText('inv-subtotal', `$${inv.totalAmount.toLocaleString()}`);
  setText('inv-total', `$${inv.totalAmount.toLocaleString()}`);

  // Setup Print & Download buttons
  const printBtn = document.getElementById('btn-print-invoice');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  const downloadBtn = document.getElementById('btn-download-invoice');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (shouldPrint) {
    setTimeout(() => window.print(), 600);
  }
}
