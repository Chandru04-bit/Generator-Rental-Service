/**
 * POWERRENT - THEME CONTROLLER (theme.js)
 * Light / Dark Mode management using localStorage
 */

(function () {
  const THEME_KEY = 'powerrent_theme';

  function getPreferredTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
    } catch (error) {
      console.warn('PowerRent could not read the saved theme.', error);
    }

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', selectedTheme);
    try {
      localStorage.setItem(THEME_KEY, selectedTheme);
    } catch (error) {
      console.warn('PowerRent could not save the selected theme.', error);
    }
    updateThemeToggleIcons(selectedTheme);
  }

  function updateThemeToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-warning';
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // Initialize theme as early as possible to prevent flicker
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeToggleIcons(document.documentElement.getAttribute('data-theme') || initialTheme);
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  });

  window.PowerRentTheme = {
    applyTheme,
    toggleTheme,
    getPreferredTheme,
  };
})();
