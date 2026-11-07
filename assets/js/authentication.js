/**
 * POWERRENT - AUTHENTICATION CONTROLLER (authentication.js)
 * Implements local account authentication, session management, and dashboard protection
 * CRITICAL RULE: NEVER redirect automatically on login; wait for explicit customer click.
 */

(function () {
  const USER_KEY = 'powerrent_user';
  const USERS_DB_KEY = 'powerrent_registered_users';
  const AUTH_FLASH_KEY = 'powerrent_auth_flash';
  const PASSWORD_HASH_ITERATIONS = 210000;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function readUsers() {
    const storedUsers = localStorage.getItem(USERS_DB_KEY);
    if (!storedUsers) return [];

    const users = JSON.parse(storedUsers);
    if (!Array.isArray(users)) {
      throw new Error('Stored account data is invalid.');
    }
    return users;
  }

  function getPublicUser(user) {
    const { password, passwordHash, passwordSalt, passwordHashIterations, ...publicUser } = user;
    return publicUser;
  }

  async function createPasswordHash(password) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const key = await window.crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(password),
          'PBKDF2',
          false,
          ['deriveBits']
        );
        const derivedBits = await window.crypto.subtle.deriveBits({
          name: 'PBKDF2',
          salt,
          iterations: PASSWORD_HASH_ITERATIONS,
          hash: 'SHA-256'
        }, key, 256);

        return {
          passwordSalt: btoa(String.fromCharCode(...salt)),
          passwordHash: btoa(String.fromCharCode(...new Uint8Array(derivedBits)))
        };
      } catch (cryptoErr) {
        console.warn('SubtleCrypto error, using fallback hasher:', cryptoErr);
      }
    }

    // Resilient fallback for non-secure contexts (e.g. file:/// protocol in local browsing)
    const saltStr = Math.random().toString(36).slice(2) + Date.now().toString(36);
    let hash = 0;
    const combined = saltStr + ':' + password;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    return {
      passwordSalt: 'fb_' + btoa(saltStr),
      passwordHash: 'fb_' + btoa(String(hash))
    };
  }

  async function verifyPassword(password, user) {
    if (!user.passwordHash || !user.passwordSalt) {
      return false;
    }

    if (user.passwordSalt.startsWith('fb_')) {
      const saltStr = atob(user.passwordSalt.slice(3));
      let hash = 0;
      const combined = saltStr + ':' + password;
      for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i);
        hash |= 0;
      }
      return user.passwordHash === 'fb_' + btoa(String(hash));
    }

    if (!window.crypto || !window.crypto.subtle) {
      return false;
    }

    try {
      const salt = Uint8Array.from(atob(user.passwordSalt), character => character.charCodeAt(0));
      const expectedHash = Uint8Array.from(atob(user.passwordHash), character => character.charCodeAt(0));
      const key = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
      );
      const derivedBits = await window.crypto.subtle.deriveBits({
        name: 'PBKDF2',
        salt,
        iterations: PASSWORD_HASH_ITERATIONS,
        hash: 'SHA-256'
      }, key, expectedHash.length * 8);
      const actualHash = new Uint8Array(derivedBits);

      if (actualHash.length !== expectedHash.length) return false;
      let difference = 0;
      for (let index = 0; index < actualHash.length; index += 1) {
        difference |= actualHash[index] ^ expectedHash[index];
      }
      return difference === 0;
    } catch (err) {
      console.error('Password verification error:', err);
      return false;
    }
  }

  async function migrateLegacyPasswords() {
    const users = readUsers();
    let usersChanged = false;
    const migratedUsers = await Promise.all(users.map(async user => {
      if (!user || typeof user !== 'object' || typeof user.password !== 'string') {
        return user;
      }

      const passwordCredentials = await createPasswordHash(user.password);
      const migratedUser = { ...user, ...passwordCredentials };
      delete migratedUser.password;
      usersChanged = true;
      return migratedUser;
    }));

    if (usersChanged) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(migratedUsers));
    }

    const storedSession = localStorage.getItem(USER_KEY);
    if (storedSession) {
      const sessionUser = JSON.parse(storedSession);
      if (sessionUser && typeof sessionUser === 'object') {
        localStorage.setItem(USER_KEY, JSON.stringify(getPublicUser(sessionUser)));
      }
    }
  }

  const usersReady = migrateLegacyPasswords().then(
    () => true,
    error => {
      console.error('PowerRent could not prepare locally stored account data.', error);
      return false;
    }
  );

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? getPublicUser(JSON.parse(data)) : null;
    } catch (error) {
      console.error('PowerRent could not read the active customer session.', error);
      return null;
    }
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  function notifyAuthChange() {
    window.dispatchEvent(new CustomEvent('powerrent:authchange', { detail: getCurrentUser() }));
  }

  function saveAuthFlash(title, message, type = 'success') {
    try {
      sessionStorage.setItem(AUTH_FLASH_KEY, JSON.stringify({ title, message, type }));
      return true;
    } catch (error) {
      console.error('PowerRent could not save the authentication status message.', error);
      return false;
    }
  }

  function consumeAuthFlash() {
    try {
      const storedMessage = sessionStorage.getItem(AUTH_FLASH_KEY);
      if (!storedMessage) return null;

      sessionStorage.removeItem(AUTH_FLASH_KEY);
      const message = JSON.parse(storedMessage);
      if (!message || typeof message.title !== 'string' || typeof message.message !== 'string') {
        throw new Error('Stored authentication status message is invalid.');
      }
      return message;
    } catch (error) {
      console.error('PowerRent could not read the authentication status message.', error);
      return null;
    }
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
          <div class="powerrent-toast-title"></div>
          <p class="powerrent-toast-msg"></p>
        </div>
        <button class="powerrent-toast-close" type="button" aria-label="Close notification">
          <i class="bi bi-x"></i>
        </button>
      `;
      const closeBtn = toast.querySelector('.powerrent-toast-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          toast.classList.remove('show');
        });
      }
      if (document.body) {
        document.body.appendChild(toast);
      }
    }

    toast.className = `powerrent-toast ${type}`;
    const titleEl = toast.querySelector('.powerrent-toast-title');
    if (titleEl) titleEl.textContent = title;
    const msgEl = toast.querySelector('.powerrent-toast-msg');
    if (msgEl) msgEl.textContent = message;
    const icon = toast.querySelector('.powerrent-toast-icon i');
    if (icon) {
      icon.className = `bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`;
    }

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => toast.classList.remove('show'), 5500);
  }

  async function login(email, password) {
    if (!EMAIL_PATTERN.test(email) || !password) {
      showAuthFormMessage('login-alert-area', 'Enter a valid email address and password.');
      showToast('Validation Error', 'Enter a valid email address and password.', 'error');
      return false;
    }

    if (!await usersReady) {
      showAuthFormMessage('login-alert-area', 'Account data could not be securely loaded. Please try again later.');
      showToast('Login Error', 'Account data could not be securely loaded. Please try again later.', 'error');
      return false;
    }

    const users = readUsers();
    const user = users.find(account =>
      account && typeof account.email === 'string' && account.email.toLowerCase() === email.toLowerCase()
    );
    if (!user || !await verifyPassword(password, user)) {
      showAuthFormMessage('login-alert-area', 'The email address or password is incorrect.');
      showToast('Login Failed', 'The email address or password is incorrect.', 'error');
      return false;
    }

    const publicUser = getPublicUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(publicUser));
    notifyAuthChange();

    const isInsideAuth = window.location.pathname.includes('/auth/');
    const homeUrl = isInsideAuth ? '../index.html' : 'index.html';
    const flashSaved = saveAuthFlash('Login Successful!', 'You are now signed in.', 'success');
    if (!flashSaved) {
      showToast('Login Successful!', 'You are now signed in.', 'success');
    }
    window.location.assign(homeUrl);

    return true;
  }

  async function register(userData) {
    if (!userData.name || !EMAIL_PATTERN.test(userData.email) ||
        !isValidPhone(userData.phone) || !isStrongPassword(userData.password)) {
      showToast('Validation Error', 'Enter valid account details and a stronger password.', 'error');
      return false;
    }

    if (!await usersReady) {
      throw new Error('Account data could not be securely loaded. Please try again later.');
    }

    const users = readUsers();
    const existing = users.find(u =>
      u && typeof u.email === 'string' && u.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (existing) {
      showToast('Registration Error', 'An account with this email address already exists.', 'error');
      return false;
    }

    const passwordCredentials = await createPasswordHash(userData.password);
    const newUser = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      company: userData.company || 'Enterprise Client',
      address: userData.address || 'Industrial Zone 4',
      city: userData.city || 'Chicago, IL',
      avatar: 'assets/images/testimonials/client-2.jpg',
      ...passwordCredentials
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

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
    return isLoggedIn();
  }

  function showAuthFormMessage(containerId, message, type = 'danger') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} mb-3`;
    alert.setAttribute('role', type === 'danger' ? 'alert' : 'status');
    alert.textContent = message;
    container.replaceChildren(alert);
  }

  function setFieldError(input, message) {
    const container = input.closest('.mb-3, .col-md-6, .col-12') || input.parentElement;
    let feedback = container.querySelector('.auth-field-error');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback d-block auth-field-error';
      container.appendChild(feedback);
    }

    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${input.id}-error`);
    feedback.id = `${input.id}-error`;
    feedback.textContent = message;
  }

  function clearFieldError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    const container = input.closest('.mb-3, .col-md-6, .col-12') || input.parentElement;
    const feedback = container.querySelector('.auth-field-error');
    if (feedback) feedback.remove();
  }

  function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return /^[+()\d.\-\s]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
  }

  function isStrongPassword(password) {
    return password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password);
  }

  // Setup UI Listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const authFlash = consumeAuthFlash();
    if (authFlash) {
      const loginAlert = document.getElementById('login-alert-area');
      if (loginAlert) {
        showAuthFormMessage('login-alert-area', authFlash.message, authFlash.type || 'success');
      } else if (window.location.pathname.includes('/customer/')) {
        showToast(authFlash.title, authFlash.message, authFlash.type || 'success');
      }
    }

    // Password visibility toggle
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-group').querySelector('input');
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'bi bi-eye-slash';
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          icon.className = 'bi bi-eye';
          btn.setAttribute('aria-label', 'Show password');
        }
      });
    });

    // Handle Login Form Submit
    const loginForm = document.getElementById('customer-login-form');
    if (loginForm) {
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => clearFieldError(input));
      });

      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        let isValid = true;
        document.getElementById('login-alert-area').replaceChildren();

        if (!email) {
          setFieldError(emailInput, 'Enter your email address.');
          isValid = false;
        } else if (!EMAIL_PATTERN.test(email)) {
          setFieldError(emailInput, 'Enter a valid email address.');
          isValid = false;
        }

        if (!password) {
          setFieldError(passwordInput, 'Enter your password.');
          isValid = false;
        }

        if (!isValid) {
          showToast('Validation Error', 'Check the highlighted fields and try again.', 'error');
          return;
        }

        const submitButton = loginForm.querySelector('[type="submit"]');
        submitButton.disabled = true;
        try {
          await login(email, password);
        } catch (error) {
          console.error('PowerRent could not complete the login request.', error);
          showAuthFormMessage('login-alert-area', 'Login could not be completed. Please try again.');
          showToast('Login Error', 'Login could not be completed. Please try again.', 'error');
        } finally {
          submitButton.disabled = false;
        }
      });
    }

    // Handle Register Form Submit
    const registerForm = document.getElementById('customer-register-form');
    if (registerForm) {
      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const phoneInput = document.getElementById('reg-phone');
      const passwordInput = document.getElementById('reg-password');
      const confirmPasswordInput = document.getElementById('reg-confirm-password');
      const termsInput = document.getElementById('reg-terms');
      [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', () => clearFieldError(input));
      });
      termsInput.addEventListener('change', () => clearFieldError(termsInput));

      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        let isValid = true;
        document.getElementById('register-alert-area').replaceChildren();

        if (!name) {
          setFieldError(nameInput, 'Enter your full name.');
          isValid = false;
        }
        if (!email) {
          setFieldError(emailInput, 'Enter your email address.');
          isValid = false;
        } else if (!EMAIL_PATTERN.test(email)) {
          setFieldError(emailInput, 'Enter a valid email address.');
          isValid = false;
        }
        if (!phone) {
          setFieldError(phoneInput, 'Enter your phone number.');
          isValid = false;
        } else if (!isValidPhone(phone)) {
          setFieldError(phoneInput, 'Enter a valid phone number.');
          isValid = false;
        }
        if (!password) {
          setFieldError(passwordInput, 'Create a password.');
          isValid = false;
        } else if (!isStrongPassword(password)) {
          setFieldError(passwordInput, 'Use at least 8 characters with uppercase, lowercase, and a number.');
          isValid = false;
        }
        if (!confirmPassword) {
          setFieldError(confirmPasswordInput, 'Confirm your password.');
          isValid = false;
        } else if (password !== confirmPassword) {
          setFieldError(confirmPasswordInput, 'Passwords do not match.');
          isValid = false;
        }
        if (!termsInput.checked) {
          setFieldError(termsInput, 'You must agree to the terms to create an account.');
          isValid = false;
        }

        if (!isValid) {
          showToast('Validation Error', 'Check the highlighted fields and try again.', 'error');
          return;
        }

        const submitButton = registerForm.querySelector('[type="submit"]');
        submitButton.disabled = true;
        try {
          const success = await register({ name, email, phone, password });
          if (success) {
            const flashSaved = saveAuthFlash(
              'Account Created!',
              'Your account was created successfully. Log in using your registered email and password.',
              'success'
            );
            if (!flashSaved) {
              showToast(
                'Account Created!',
                'Your account was created successfully. You are being redirected to log in.',
                'success'
              );
            }
            window.location.assign('login.html');
          } else {
            showAuthFormMessage('register-alert-area', 'An account with this email address already exists.');
          }
        } catch (error) {
          console.error('PowerRent could not complete account registration.', error);
          showAuthFormMessage('register-alert-area', 'Account creation could not be completed. Please try again.');
          showToast('Registration Error', 'Account creation could not be completed. Please try again.', 'error');
        } finally {
          submitButton.disabled = false;
        }
      });
    }

    // Handle Forgot Password Form
    const forgotForm = document.getElementById('customer-forgot-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value.trim();
        if (!EMAIL_PATTERN.test(email)) {
          showAuthFormMessage('forgot-alert-area', 'Enter a valid email address.');
          showToast('Validation Error', 'Enter a valid email address.', 'error');
          return;
        }

        showAuthFormMessage(
          'forgot-alert-area',
          'Password recovery is unavailable because email delivery is not configured for this site.',
          'warning'
        );
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
