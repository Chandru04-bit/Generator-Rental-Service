/**
 * POWERRENT - TEXT DIRECTION CONTROLLER (direction.js)
 * LTR / RTL toggle management using localStorage
 */

(function () {
  const DIR_KEY = 'powerrent_dir';

  function getSavedDirection() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    updateDirectionToggleButtons(dir);
  }

  function updateDirectionToggleButtons(dir) {
    const dirBtns = document.querySelectorAll('.dir-toggle-btn');
    dirBtns.forEach((btn) => {
      const textSpan = btn.querySelector('.dir-label') || btn;
      if (dir === 'rtl') {
        btn.setAttribute('title', 'Switch to LTR (Left to Right)');
        btn.innerHTML = '<span class="dir-label">LTR</span>';
      } else {
        btn.setAttribute('title', 'Switch to RTL (Right to Left)');
        btn.innerHTML = '<span class="dir-label">RTL</span>';
      }
    });
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(newDir);
  }

  // Early apply to avoid layout shifts
  const initialDir = getSavedDirection();
  document.documentElement.setAttribute('dir', initialDir);

  document.addEventListener('DOMContentLoaded', () => {
    updateDirectionToggleButtons(initialDir);
    const dirBtns = document.querySelectorAll('.dir-toggle-btn');
    dirBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDirection();
      });
    });
  });

  window.PowerRentDirection = {
    applyDirection,
    toggleDirection,
    getSavedDirection,
  };
})();
