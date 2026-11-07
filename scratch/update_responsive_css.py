import os

with open('assets/css/responsive.css', 'r', encoding='utf-8') as f:
    content = f.read()

target_start = "@media (max-width: 575.98px) {\n  .auth-navbar .container {"
if target_start not in content:
    target_start = "@media (max-width: 575.98px) {\r\n  .auth-navbar .container {"

replacement = """/* ===================================================================
   AUTH NAVBAR RESPONSIVE ALIGNMENT (NO WRAPPING)
   Prevents mobile wrapping, keeping brand and controls on 1 single row
   =================================================================== */
@media (max-width: 768px) {
  .auth-navbar {
    min-height: 58px;
    padding: 8px 0;
  }
  .auth-navbar .container {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 10px !important;
  }
  .auth-navbar .navbar-brand img {
    height: 32px !important;
    max-width: 155px !important;
  }
}

@media (max-width: 575.98px) {
  .auth-navbar {
    min-height: 52px;
    padding: 6px 0;
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
    height: 27px !important;
    width: auto !important;
    max-width: 135px !important;
    object-fit: contain !important;
  }
  .auth-navbar .nav-controls {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    flex-shrink: 0 !important;
    align-items: center !important;
    gap: 6px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }
  .auth-navbar .control-btn {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.85rem !important;
    border-radius: 6px !important;
    flex-shrink: 0 !important;
  }
  .auth-navbar .control-btn-badge {
    width: auto !important;
    padding: 0 7px !important;
    font-size: 0.68rem !important;
    height: 32px !important;
    border-radius: 6px !important;
  }
  .auth-navbar .auth-dashboard-btn {
    min-height: 32px !important;
    height: 32px !important;
    padding: 0 9px !important;
    font-size: 0.75rem !important;
    border-radius: 6px !important;
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
    width: 30px !important;
    height: 30px !important;
    font-size: 0.8rem !important;
  }
  .auth-navbar .control-btn-badge {
    height: 30px !important;
    padding: 0 6px !important;
    font-size: 0.65rem !important;
  }
  .auth-navbar .auth-dashboard-btn {
    height: 30px !important;
    min-height: 30px !important;
    padding: 0 7px !important;
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
    width: 28px !important;
    padding: 0 !important;
  }
  .auth-navbar .auth-dashboard-btn span.dash-btn-text {
    display: none;
  }
  .auth-navbar .auth-dashboard-btn i {
    margin: 0 !important;
  }
  .auth-navbar .auth-dashboard-btn {
    width: 28px !important;
    padding: 0 !important;
  }
}"""

import re
# Match from @media (max-width: 575.98px) to the end of that block before RTL comment
pattern = re.compile(r'@media\s*\(\s*max-width:\s*575\.98px\s*\)\s*\{[\s\S]*?\.auth-dashboard-btn[\s\S]*?\}\s*\}', re.MULTILINE)
m = pattern.search(content)
if m:
    content = content[:m.start()] + replacement + content[m.end():]
    with open('assets/css/responsive.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated responsive.css auth-navbar section successfully!")
else:
    print("Regex match failed for auth-navbar in responsive.css!")
