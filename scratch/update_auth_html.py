import os

def update_file(filepath, old_text, new_text):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath} successfully!")
    else:
        print(f"Target not found in {filepath}!")

# Update login.html
old_login_btn = """        <a class="btn btn-sm btn-pr-outline auth-dashboard-btn" href="../customer/dashboard.html">
          <i class="bi bi-speedometer2 me-1"></i>Dashboard
        </a>"""
new_login_btn = """        <a class="btn btn-sm btn-pr-outline auth-dashboard-btn" href="../customer/dashboard.html">
          <i class="bi bi-speedometer2 me-1"></i><span class="dash-btn-text">Dashboard</span>
        </a>"""
update_file('auth/login.html', old_login_btn, new_login_btn)

# Update register.html
update_file('auth/register.html', old_login_btn, new_login_btn)

# Update forgot-password.html
old_forgot_nav = """  <!-- Global Header & Navbar -->
  <nav class="navbar navbar-expand-xl powerrent-navbar">
    <div class="container">
      <a class="navbar-brand" href="../index.html">
        <img src="../assets/images/logo/logo.svg" alt="PowerRent Logo" width="180" height="38">
      </a>
      <div class="ms-auto d-flex gap-2">
        <button class="control-btn theme-toggle-btn" type="button" title="Toggle Theme"><i class="bi bi-moon-stars-fill"></i></button>
        <button class="control-btn dir-toggle-btn control-btn-badge" type="button" title="Toggle Direction"><i class="bi bi-arrow-left-right me-1"></i><span class="dir-label">RTL</span></button>
        <a href="login.html" class="btn btn-sm btn-pr-outline"><i class="bi bi-arrow-left me-1"></i>Back to Login</a>
      </div>
    </div>
  </nav>"""

new_forgot_nav = """  <!-- Minimal auth navbar -->
  <nav class="navbar navbar-expand-xl powerrent-navbar auth-navbar">
    <div class="container">
      <a class="navbar-brand" href="../index.html">
        <img src="../assets/images/logo/logo.svg" alt="PowerRent Logo" width="180" height="38">
      </a>
      <div class="nav-controls ms-auto">
        <button class="control-btn theme-toggle-btn" type="button" title="Toggle Dark/Light Mode" aria-label="Toggle Dark/Light Mode"><i class="bi bi-moon-stars-fill"></i></button>
        <button class="control-btn dir-toggle-btn control-btn-badge" type="button" title="Toggle Text Direction" aria-label="Toggle Text Direction"><i class="bi bi-arrow-left-right me-1"></i><span class="dir-label">RTL</span></button>
        <a href="login.html" class="btn btn-sm btn-pr-outline auth-dashboard-btn"><i class="bi bi-arrow-left me-1"></i><span class="dash-btn-text">Login</span></a>
      </div>
    </div>
  </nav>"""
update_file('auth/forgot-password.html', old_forgot_nav, new_forgot_nav)
