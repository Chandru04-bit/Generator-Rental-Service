/**
 * POWERRENT - NAVIGATION CONTROLLER (navigation.js)
 * Synchronizes navbar active states, auth buttons, dashboard links, and scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.powerrent-navbar');

  // Sticky navbar shadow on scroll
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // Calculate relative paths based on current directory depth
  const path = window.location.pathname;
  const isInsidePages = path.includes('/pages/');
  const isInsideAuth = path.includes('/auth/');
  const isInsideCustomer = path.includes('/customer/');

  let prefixToRoot = './';
  let prefixToPages = 'pages/';
  let prefixToAuth = 'auth/';
  let prefixToCustomer = 'customer/';

  if (isInsidePages || isInsideAuth || isInsideCustomer) {
    prefixToRoot = '../';
    prefixToPages = '';
    prefixToAuth = '../auth/';
    prefixToCustomer = '../customer/';
  }

  // Update Auth and Dashboard nav elements
  function syncNavAuth() {
    const authNavItem = document.getElementById('nav-auth-item');
    const dashboardNavItem = document.getElementById('nav-dashboard-item');
    const navControls = document.querySelector('.powerrent-navbar .nav-controls');
    const user = window.PowerRentAuth ? window.PowerRentAuth.getCurrentUser() : null;

    if (dashboardNavItem) {
      dashboardNavItem.style.display = 'none';
    }

    if (navControls && authNavItem) {
      let dashboardButton = document.getElementById('navbar-dashboard-button');
      if (!dashboardButton) {
        dashboardButton = document.createElement('a');
        dashboardButton.id = 'navbar-dashboard-button';
        dashboardButton.className = 'btn btn-sm btn-pr-outline';
        dashboardButton.innerHTML = '<i class="bi bi-speedometer2 me-1"></i>Dashboard';
        navControls.insertBefore(dashboardButton, authNavItem);
      }
      dashboardButton.href = `${prefixToCustomer}dashboard.html`;
    }

    // Ensure all auth navbar dashboard buttons point directly to customer dashboard
    document.querySelectorAll('.auth-dashboard-btn').forEach(btn => {
      btn.href = `${prefixToCustomer}dashboard.html`;
    });

    if (user) {
      // User is logged in
      if (authNavItem) {
        authNavItem.innerHTML = `
          <button class="btn btn-sm btn-pr-outline" type="button" id="nav-logout-action">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        `;

        const logoutBtn = document.getElementById('nav-logout-action');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            if (window.PowerRentAuth) window.PowerRentAuth.logout();
          });
        }
      }
    } else {
      // User is NOT logged in
      if (authNavItem) {
        authNavItem.innerHTML = `
          <a href="${prefixToAuth}login.html" class="btn btn-sm btn-pr-outline">
            <i class="bi bi-box-arrow-in-right me-1"></i>Login
          </a>
        `;
      }
    }
  }

  // Listen for auth events
  window.addEventListener('powerrent:authchange', syncNavAuth);

  // Initial sync
  syncNavAuth();

  // Set active links in the navbar, including dropdown items and nested pages.
  const nav = document.querySelector('.powerrent-navbar .navbar-nav');
  if (nav) {
    const currentUrl = new URL(window.location.href);
    const normalizePath = pathname => pathname.endsWith('/')
      ? `${pathname}index.html`
      : pathname;
    const currentPath = normalizePath(currentUrl.pathname);
    const sectionPages = {
      'blog-details.html': 'blog.html',
      'service-details.html': 'services.html'
    };
    const currentFileName = currentPath.split('/').pop();
    const sectionPage = sectionPages[currentFileName];
    const activePath = sectionPage
      ? normalizePath(new URL(sectionPage, currentUrl).pathname)
      : currentPath;

    nav.querySelectorAll('.active').forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    nav.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const linkPath = normalizePath(new URL(href, currentUrl).pathname);
      if (linkPath !== activePath) return;

      link.classList.add('active');
      link.setAttribute('aria-current', 'page');

      const dropdown = link.closest('.dropdown');
      const dropdownLink = dropdown && dropdown.querySelector('.nav-link');
      if (dropdownLink) dropdownLink.classList.add('active');
    });
  }
});
