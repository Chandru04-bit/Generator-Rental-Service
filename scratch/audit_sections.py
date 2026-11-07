import os
import re

files = [
    'index.html',
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
    'home-2.html',
    'customer/dashboard.html'
]

section_pattern = re.compile(r'<(section|header)\b([^>]*)>(.*?)(?=<(?:section|header)\b|</body>|$)', re.DOTALL | re.IGNORECASE)
h_pattern = re.compile(r'<h[1-3]\b[^>]*>(.*?)</h[1-3]>', re.DOTALL | re.IGNORECASE)
tag_strip = re.compile(r'<[^>]+>')

for f in files:
    if not os.path.exists(f):
        print(f"=== {f}: NOT FOUND ===")
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    matches = list(section_pattern.finditer(content))
    print(f"\n=== {f} ({len(matches)} sections/headers) ===")
    for i, m in enumerate(matches, 1):
        tag = m.group(1)
        attrs = m.group(2)
        body = m.group(3)
        h_match = h_pattern.search(body)
        title = tag_strip.sub('', h_match.group(1)).strip() if h_match else '(no h1-h3)'
        id_match = re.search(r'id=["\']([^"\']+)["\']', attrs)
        class_match = re.search(r'class=["\']([^"\']+)["\']', attrs)
        s_id = id_match.group(1) if id_match else ''
        s_class = class_match.group(1) if class_match else ''
        print(f"  {i}. <{tag}> [#{s_id} .{s_class}] -> {title[:65]}")
