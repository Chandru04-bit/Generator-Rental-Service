with open('assets/css/responsive.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find the block starting with "/* Auth navbar: stack the controls" up to "/* ==================================================================="
pattern = re.compile(r'/\*\s*Auth navbar:\s*stack the controls[\s\S]*?(?=\s*/\*\s*={10,})')

new_block = """/* ===================================================================
   AUTH NAVBAR RESPONSIVE ALIGNMENT (SINGLE ROW - NO STACKING/WRAPPING)
   Keeps brand on left and action controls on right on 1 unified row
   =================================================================== */
@media (max-width: 575.98px) {
  .auth-navbar {
    min-height: 56px;
    padding: 8px 0;
  }
  .auth-navbar .container {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 8px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .auth-navbar .navbar-brand {
    display: inline-flex !important;
    align-items: center !important;
    flex: 0 1 auto !important;
    min-width: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .auth-navbar .navbar-brand img {
    height: 28px !important;
    width: auto !important;
    max-width: 135px !important;
    object-fit: contain !important;
  }
  .auth-navbar .nav-controls {
    display: inline-flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    flex-shrink: 0 !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 6px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }
  .auth-navbar .control-btn {
    width: 34px !important;
    height: 34px !important;
    font-size: 0.85rem !important;
    border-radius: 8px !important;
    flex-shrink: 0 !important;
  }
  .auth-navbar .control-btn-badge {
    width: auto !important;
    height: 34px !important;
    padding: 0 8px !important;
    font-size: 0.7rem !important;
    border-radius: 8px !important;
    flex-shrink: 0 !important;
  }
  .auth-navbar .nav-controls .auth-dashboard-btn {
    min-height: 34px !important;
    height: 34px !important;
    padding: 0 10px !important;
    font-size: 0.78rem !important;
    border-radius: 8px !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
  }
}

@media (max-width: 380px) {
  .auth-navbar .container {
    gap: 6px !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .auth-navbar .navbar-brand img {
    height: 25px !important;
    max-width: 120px !important;
  }
  .auth-navbar .nav-controls {
    gap: 4px !important;
  }
  .auth-navbar .control-btn {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.8rem !important;
  }
  .auth-navbar .control-btn-badge {
    height: 32px !important;
    padding: 0 6px !important;
    font-size: 0.65rem !important;
  }
  .auth-navbar .nav-controls .auth-dashboard-btn {
    height: 32px !important;
    min-height: 32px !important;
    padding: 0 8px !important;
    font-size: 0.72rem !important;
  }
}

@media (max-width: 335px) {
  .auth-navbar .navbar-brand img {
    height: 22px !important;
    max-width: 105px !important;
  }
  .auth-navbar .control-btn-badge .dir-label {
    display: none;
  }
  .auth-navbar .control-btn-badge {
    width: 30px !important;
    padding: 0 !important;
  }
  .auth-navbar .nav-controls .auth-dashboard-btn span.dash-btn-text {
    display: none;
  }
  .auth-navbar .nav-controls .auth-dashboard-btn i {
    margin: 0 !important;
  }
  .auth-navbar .nav-controls .auth-dashboard-btn {
    width: 30px !important;
    padding: 0 !important;
    justify-content: center !important;
  }
}
"""

if pattern.search(text):
    text = pattern.sub(new_block, text)
    with open('assets/css/responsive.css', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced stacked auth-navbar with single-row layout successfully!")
else:
    print("Could not match pattern in responsive.css!")
