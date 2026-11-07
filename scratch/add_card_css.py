# Append card CSS rules
style_rules = """
/* ===================================================================
   SERVICE DETAILS CARDS & ALIGNMENT ENHANCEMENTS
   =================================================================== */
.benefit-card,
.app-card,
.related-service-card {
  transition: var(--pr-transition);
  border: 1px solid rgba(16, 28, 44, 0.08) !important;
}

.benefit-card:hover,
.app-card:hover,
.related-service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.09) !important;
  border-color: var(--pr-accent) !important;
}

.benefit-icon-badge,
.app-icon-badge,
.related-icon-badge {
  transition: var(--pr-transition);
}

.benefit-card:hover .benefit-icon-badge,
.app-card:hover .app-icon-badge,
.related-service-card:hover .related-icon-badge {
  background: var(--pr-accent) !important;
  color: #101C2C !important;
}
"""

dark_rules = """
/* Service Details in Dark Mode */
html[data-theme="dark"] .benefit-card,
html[data-theme="dark"] .app-card,
html[data-theme="dark"] .related-service-card {
  background-color: #18283E !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

html[data-theme="dark"] .benefit-card:hover,
html[data-theme="dark"] .app-card:hover,
html[data-theme="dark"] .related-service-card:hover {
  border-color: var(--pr-accent) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4) !important;
}

html[data-theme="dark"] .benefit-icon-badge,
html[data-theme="dark"] .app-icon-badge,
html[data-theme="dark"] .related-icon-badge {
  background: rgba(245, 158, 11, 0.18) !important;
  color: var(--pr-accent) !important;
}

html[data-theme="dark"] .benefit-card:hover .benefit-icon-badge,
html[data-theme="dark"] .app-card:hover .app-icon-badge,
html[data-theme="dark"] .related-service-card:hover .related-icon-badge {
  background: var(--pr-accent) !important;
  color: #101C2C !important;
}
"""

with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    s = f.read()
if '.benefit-card' not in s:
    with open('assets/css/style.css', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(s.strip() + '\n' + style_rules)
    print('[OK] Added style.css rules')

with open('assets/css/dark-mode.css', 'r', encoding='utf-8') as f:
    d = f.read()
if '.benefit-card' not in d:
    with open('assets/css/dark-mode.css', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(d.strip() + '\n' + dark_rules)
    print('[OK] Added dark-mode.css rules')
