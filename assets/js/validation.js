/**
 * POWERRENT - FORM VALIDATION UTILITIES (validation.js)
 * Clean reusable validators for inputs, emails, phone numbers, and dates
 */

const PowerRentValidation = {
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  isValidPhone(phone) {
    // Accepts common international and domestic formats
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone).trim());
  },

  isValidDateRange(startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) return false;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    return end >= start;
  },

  setFieldError(inputElement, errorMessage) {
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    let feedback = inputElement.parentElement.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      inputElement.parentElement.appendChild(feedback);
    }
    feedback.textContent = errorMessage;
  },

  clearFieldError(inputElement) {
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    const feedback = inputElement.parentElement.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = '';
    }
  }
};

window.PowerRentValidation = PowerRentValidation;
