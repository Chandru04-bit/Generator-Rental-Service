with open('assets/css/responsive.css', 'r', encoding='utf-8') as f:
    text = f.read()

rtl_auth_rules = """
/* RTL Auth Navbar Alignment */
html[dir="rtl"] .auth-navbar .container {
  flex-direction: row !important;
}

html[dir="rtl"] .auth-navbar .auth-dashboard-btn i {
  margin-right: 0 !important;
  margin-left: 0.25rem !important;
}

html[dir="rtl"] .auth-navbar .control-btn-badge i {
  margin-right: 0 !important;
  margin-left: 0.25rem !important;
}
"""

if 'RTL Auth Navbar Alignment' not in text:
    text += rtl_auth_rules
    with open('assets/css/responsive.css', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Added RTL auth-navbar rules successfully!')
else:
    print('Already present!')
