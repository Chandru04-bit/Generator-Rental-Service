import glob
import re

print("Scanning all HTML files for cards and text issues...")

for f in sorted(glob.glob('*.html') + glob.glob('pages/*.html')):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Check if Marcus Vance is present
    if 'Marcus Vance' in content:
        print(f"=== {f} ===")
        for line in content.splitlines():
            if any(k in line for k in ['Marcus Vance', 'Elena Rostova', 'David Chen', 'Sarah Jenkins', 'Chief Technical Officer', 'Chief Executive Officer', 'Head of Grid Synchronization', 'VP of Engineering', 'Director of Logistics', 'Lead Fleet Diagnostics', 'Master Fleet Technician']):
                print("  ", line.strip())
