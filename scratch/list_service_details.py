with open('pages/service-details.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\w+):\s*\{\s*title:\s*"([^"]+)".*?benefits:\s*\[(.*?)\].*?applications:\s*\[(.*?)\]', text, re.DOTALL)
for k, title, ben, apps in matches:
    print(f'=== {k}: {title} ===')
    b_titles = re.findall(r'title:\s*"([^"]+)"', ben)
    a_titles = re.findall(r'title:\s*"([^"]+)"', apps)
    print('  Benefits:', b_titles)
    print('  Applications:', a_titles)
