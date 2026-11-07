import os
import re

files = [
    'index.html',
    'home-2.html',
    'pages/about.html',
    'pages/fleet.html',
    'pages/generator-details.html',
    'pages/services.html',
    'pages/service-details.html',
    'pages/pricing.html',
    'pages/booking.html',
    'pages/contact.html',
    'pages/blog.html',
    'pages/faq.html',
    'customer/dashboard.html'
]

img_pattern = re.compile(r'(?:src|url)\(["\']?([^"\'\)\s]+)["\']?\)')

missing_assets = []
for f in files:
    dir_name = os.path.dirname(f)
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    matches = img_pattern.findall(content)
    for ref in matches:
        if ref.startswith('data:') or ref.startswith('http') or ref.startswith('#'):
            continue
        clean_ref = ref.split('?')[0].strip("'\"")
        if clean_ref.endswith('.css') or clean_ref.endswith('.js') or clean_ref.endswith('.svg') or clean_ref.endswith('.jpg') or clean_ref.endswith('.png'):
            target = os.path.normpath(os.path.join(dir_name, clean_ref))
            if not os.path.exists(target):
                missing_assets.append((f, ref, target))

if missing_assets:
    print(f"Found {len(missing_assets)} missing asset refs:")
    for f, r, t in missing_assets[:20]:
        print(f"  In {f}: {r} -> {t}")
else:
    print("ALL image and asset references exist and are valid!")
