/**
 * POWERRENT - AUTHENTICATION CONTROLLER (authentication.js)
 * Implements demo authentication, session management, and dashboard protection
 * CRITICAL RULE: NEVER redirect automatically on login; wait for explicit customer click.
 */

(function () {
  const USER_KEY = 'powerrent_user';
  const USERS_DB_KEY = 'powerrent_registered_users';

  // Seed default demo user if not present
  const defaultUsers = [
    {
      name: 'John Doe',
      email: 'john.doe@enterprise.com',
      phone: '+1 (555) 234-5678',
      password: 'password123',
      company: 'Apex Industrial Infrastructure',
      address: '742 Evergreen Terrace, Suite 400',
      city: 'Chicago, IL',
      avatar: 'assets/images/testimonials/client-1.jpg'
    }
  ];

  if (!localStorage.getItem(USERS_DB_KEY)) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
  }

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  function notifyAuthChange() {
    window.dispatchEvent(new CustomEvent('powerrent:authchange', { detail: getCurrentUser() }));
  }

  function showToast(title, message, type = 'success') {
    let toast = document.getElementById('global-auth-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-auth-toast';
      toast.className = `powerrent-toast ${type}`;
      toast.innerHTML = `
        <div class="powerrent-toast-icon">
          <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}"></i>
        </div>
        <div class="powerrent-toast-content">
          <div class="powerrent-toast-title">${title}</div>
          <p class="powerrent-toast-msg">${message}</p>
        </div>
        <button class="powerrent-toast-close" onclick="this.parentElement.classList.remove('show')">
          <i class="bi bi-x"></i>
        </button>
      `;
      document.body.appendChild(toast);
    } else {
      toast.className = `powerrent-toast ${type}`;
      toast.querySelector('.powerrent-toast-title').textContent = title;
      toast.querySelector('.powerrent-toast-msg').textContent = message;
      const icon = toast.querySelector('.powerrent-toast-icon i');
      if (icon) {
        icon.className = `bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`;
      }
    }

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => toast.classList.remove('show'), 5500);
  }

  function login(email, password, remember = false) {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Allow default demo login or match password
    if (!user) {
      // Create user on the fly for smooth frontend demo testing
      user = {
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        phone: '+1 (555) 019-2834',
        password: password,
        company: 'Commercial Power Services',
        address: '100 Power Industrial Park',
        city: 'Houston, TX',
        avatar: 'assets/images/testimonials/client-1.jpg'
      };
      users.push(user);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }

    // Save session
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notifyAuthChange();

    // Critical Requirement: DO NOT automatically redirect away!
    // Keep user on the page and display success notification.
    showToast(
      'Login Successful!',
      `Welcome back, ${user.name}! Your session is active. Access your Customer Dashboard at any time via the navigation menu.`,
      'success'
    );

    // If on login page, display interactive on-page success banner
    const loginCard = document.getElementById('login-form-wrapper');
    if (loginCard) {
      const isInsideAuth = window.location.pathname.includes('/auth/');
      const dashUrl = isInsideAuth ? '../customer/dashboard.html' : 'customer/dashboard.html';
      const homeUrl = isInsideAuth ? '../index.html' : 'index.html';

      const alertContainer = document.getElementById('login-alert-area');
      if (alertContainer) {
        alertContainer.innerHTML = `
          <div class="alert alert-success d-flex align-items-center mb-4" role="alert">
            <i class="bi bi-shield-check fs-3 me-3 text-success"></i>
            <div>
              <h5 class="alert-heading mb-1 fw-bold">Authenticated as ${user.name}</h5>
              <p class="mb-2 small">You are now logged in. Per navigation rules, you remain on this page until you explicitly navigate.</p>
              <div class="d-flex gap-2">
                <a href="${dashUrl}" class="btn btn-sm btn-pr-primary">
                  <i class="bi bi-speedometer2 me-1"></i>Open Customer Dashboard
                </a>
                <a href="${homeUrl}" class="btn btn-sm btn-pr-secondary">
                  <i class="bi bi-house me-1"></i>Go to Home
                </a>
              </div>
            </div>
          </div>
        `;
      }
    }

    return true;
  }

  function register(userData) {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      showToast('Registration Error', 'An account with this email address already exists.', 'error');
      return false;
    }

    const newUser = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      company: userData.company || 'Enterprise Client',
      address: userData.address || 'Industrial Zone 4',
      city: userData.city || 'Chicago, IL',
      avatar: 'assets/images/testimonials/client-2.jpg'
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    showToast('Account Created!', 'Your account has been registered successfully. You may now log in.', 'success');
    return true;
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    notifyAuthChange();
    showToast('Logged Out', 'You have been successfully logged out of PowerRent.', 'success');

    // If on a protected customer page, redirect to home or login
    if (window.location.pathname.includes('/customer/')) {
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 800);
    }
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      const isInsideCustomer = window.location.pathname.includes('/customer/');
      const loginUrl = isInsideCustomer ? '../auth/login.html' : 'auth/login.html';
      alert('Access Restricted: Please login to access the Customer Dashboard.');
      window.location.href = loginUrl;
      return false;
    }
    return true;
  }

  // Setup UI Listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-group').querySelector('input');
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'bi bi-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'bi bi-eye';
        }
      });
    });

    // Handle Login Form Submit
    const loginForm = document.getElementById('customer-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember') ? document.getElementById('login-remember').checked : false;

        if (!email || !password) {
          showToast('Validation Error', 'Please enter your email and password.', 'error');
          return;
        }

        login(email, password, remember);
      });

      // Quick Demo Fill Button
      const demoBtn = document.getElementById('demo-login-fill-btn');
      if (demoBtn) {
        demoBtn.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById('login-email').value = 'john.doe@enterprise.com';
          document.getElementById('login-password').value = 'password123';
          login('john.doe@enterprise.com', 'password123', true);
        });
      }
    }

    // Handle Register Form Submit
    const registerForm = document.getElementById('customer-register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const terms = document.getElementById('reg-terms').checked;

        if (!name || !email || !phone || !password) {
          showToast('Validation Error', 'All fields are required.', 'error');
          return;
        }

        if (password !== confirmPassword) {
          showToast('Password Mismatch', 'The passwords do not match.', 'error');
          return;
        }

        if (password.length < 6) {
          showToast('Password Too Short', 'Password must be at least 6 characters long.', 'error');
          return;
        }

        if (!terms) {
          showToast('Terms Required', 'You must agree to the Terms & Conditions.', 'error');
          return;
        }

        const success = register({ name, email, phone, password });
        if (success) {
          registerForm.reset();
          const alertArea = document.getElementById('register-alert-area');
          if (alertArea) {
            alertArea.innerHTML = `
              <div class="alert alert-success mt-3">
                <i class="bi bi-check-circle-fill me-2"></i>Account successfully registered! You can now <a href="login.html" class="fw-bold">Log in here</a>.
              </div>
            `;
          }
        }
      });
    }

    // Handle Forgot Password Form
    const forgotForm = document.getElementById('customer-forgot-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value.trim();
        if (!email) {
          showToast('Validation Error', 'Please enter your registered email address.', 'error');
          return;
        }

        const alertArea = document.getElementById('forgot-alert-area');
        if (alertArea) {
          alertArea.innerHTML = `
            <div class="alert alert-success">
              <i class="bi bi-envelope-check-fill me-2 fs-5"></i>
              Password reset link has been dispatched to <strong>${email}</strong>. Check your inbox and follow the instructions.
            </div>
          `;
          forgotForm.reset();
        }
        showToast('Reset Link Sent', `Password reset instructions sent to ${email}`, 'success');
      });
    }
  });

  window.PowerRentAuth = {
    getCurrentUser,
    isLoggedIn,
    login,
    register,
    logout,
    requireAuth,
    showToast
  };
})();
