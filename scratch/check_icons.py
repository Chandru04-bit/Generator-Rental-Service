with open('pages/services.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<i class="bi ([^"]+)"></i>.*?<h[345][^>]*>([^<]+)</h', text, re.DOTALL)
for icon, title in matches:
    print(f'Icon: {icon.strip()} -> Title: {title.strip()}')
