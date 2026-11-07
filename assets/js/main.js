/**
 * POWERRENT - MAIN CONTROLLER (main.js)
 * Global interactions, preloader, contact forms, and component initializers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Preloader removal
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => preloader.remove(), 400);
    }, 250);
  }

  // Initialize Bootstrap Tooltips if Bootstrap is loaded
  if (window.bootstrap && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Contact Form Handling
  const contactForm = document.getElementById('powerrent-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      const alertArea = document.getElementById('contact-alert-area');
      if (alertArea) {
        alertArea.innerHTML = `
          <div class="alert alert-success d-flex align-items-center mb-4" role="alert">
            <i class="bi bi-check-circle-fill fs-3 me-3 text-success"></i>
            <div>
              <h5 class="alert-heading mb-1 fw-bold">Message Dispatched Successfully!</h5>
              <p class="mb-0 small">Thank you <strong>${name}</strong>. A PowerRent technical power consultant will contact you at <strong>${email}</strong> within 1 hour.</p>
            </div>
          </div>
        `;
      }
      contactForm.reset();
    });
  }

  // Newsletter Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        alert(`Thank you for subscribing with ${input.value}. You will receive our latest fleet additions and technical guides.`);
        input.value = '';
      }
    });
  });

  // Coming soon countdown timer
  const countdownEl = document.getElementById('coming-soon-timer');
  if (countdownEl) {
    // 30 days from now
    const targetDate = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
    setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minutesEl = document.getElementById('cd-minutes');
      const secondsEl = document.getElementById('cd-seconds');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
  }
});
