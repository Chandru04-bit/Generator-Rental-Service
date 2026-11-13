import os
import re

print("=== VERIFYING TEAM CARDS AND ASSETS ===")

# 1. Check all team images exist and are accessible
team_images = [
    'assets/images/team/team-1.jpg',
    'assets/images/team/team-2.jpg',
    'assets/images/team/team-3.jpg',
    'assets/images/team/team-4.jpg'
]

for img in team_images:
    if os.path.exists(img):
        print(f"[OK] Image exists: {img} ({os.path.getsize(img)} bytes)")
    else:
        print(f"[ERROR] Missing image: {img}")

# 2. Check pages/about.html
with open('pages/about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

expected_data = [
    ("Marcus Vance", "Chief Technical Officer", "Former Caterpillar chief engineer specializing in multi-megawatt paralleling arrays.", "team-1.jpg"),
    ("Elena Rostova, PE", "Head of Grid Synchronization", "Licensed PE directing automatic transfer switchgear and utility tie-in compliance.", "team-2.jpg"),
    ("David Chen", "Director of Logistics", "Coordinates 24/7 heavy crane flatbeds and telemetry-linked fuel dispatch tankers.", "team-3.jpg"),
    ("Sarah Jenkins", "Lead Fleet Diagnostics", "Directs 100% resistive load-bank testing protocols and IoT telemetry predictive alerts.", "team-4.jpg")
]

print("\n--- Verifying pages/about.html ---")
for name, role, desc, img in expected_data:
    if name in about_html and role in about_html and desc in about_html and img in about_html:
        print(f"[OK] Found exact card in about.html: {name} | {role}")
    else:
        print(f"[FAIL] Missing in about.html: {name} | {role}")

# 3. Check pages/team.html
with open('pages/team.html', 'r', encoding='utf-8') as f:
    team_html = f.read()

print("\n--- Verifying pages/team.html ---")
for name, role, desc, img in expected_data:
    if name in team_html and role in team_html and desc in team_html and img in team_html:
        print(f"[OK] Found exact card in team.html: {name} | {role}")
    else:
        print(f"[FAIL] Missing in team.html: {name} | {role}")

# 4. Check CSS definitions
with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    style_css = f.read()

for cls in ['.team-leader-card', '.team-leader-img-wrap', '.team-leader-img', '.team-leader-name', '.team-leader-role', '.team-leader-desc']:
    if cls in style_css:
        print(f"[OK] CSS class defined in style.css: {cls}")
    else:
        print(f"[FAIL] Missing in style.css: {cls}")

# 5. Check Dark Mode
with open('assets/css/dark-mode.css', 'r', encoding='utf-8') as f:
    dark_css = f.read()

if '.team-leader-card' in dark_css:
    print("[OK] Dark mode styling verified for .team-leader-card")
else:
    print("[FAIL] Missing dark mode styling for .team-leader-card")

# 6. Check duplicate names in home-2.html
with open('home-2.html', 'r', encoding='utf-8') as f:
    h2_html = f.read()

if 'Marcus Vance' in h2_html:
    print("[WARNING] Marcus Vance still in home-2.html")
else:
    print("[OK] No conflicting Marcus Vance testimonial in home-2.html")

print("\n=== VERIFICATION COMPLETE ===")
