import os
import re

files = [os.path.join(r, f) for r, d, fs in os.walk('.') for f in fs if f.endswith('.html')]

print("Searching for team / card duplication across all html files...")
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if Marcus Vance appears multiple times in the same file
    mv_count = content.count('Marcus Vance')
    if mv_count > 1:
        print(f"{fpath}: 'Marcus Vance' count = {mv_count}")

    # Check for duplicate paragraphs or card bodies
    # Find all h4, h5, h6
    headings = re.findall(r'<h[456][^>]*>(.*?)</h[456]>', content)
    # Check for duplicates
    seen = {}
    for h in headings:
        h_clean = re.sub(r'<[^>]+>', '', h).strip()
        if len(h_clean) > 3:
            seen[h_clean] = seen.get(h_clean, 0) + 1
    
    dups = {k: v for k, v in seen.items() if v > 1 and k not in ['Quick Links', 'Navigation', 'Contact Info', 'Services']}
    if dups and ('team' in fpath or 'about' in fpath or 'home-2' in fpath or 'index' in fpath):
        print(f"Duplicate headings in {fpath}: {dups}")
