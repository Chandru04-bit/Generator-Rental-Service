import re

files = [
    ('Home Page 1', 'index.html', 8),
    ('Home Page 2', 'home-2.html', 8),
    ('About Us', 'pages/about.html', 8),
    ('Generator Fleet', 'pages/fleet.html', 7),
    ('Generator Details', 'pages/generator-details.html', 8),
    ('Services', 'pages/services.html', 8),
    ('Service Details', 'pages/service-details.html', 8),
    ('Pricing', 'pages/pricing.html', 9),
    ('Booking', 'pages/booking.html', 7),
    ('Contact Us', 'pages/contact.html', 7),
    ('Blog', 'pages/blog.html', 7),
    ('FAQ', 'pages/faq.html', 8),
    ('Customer Dashboard', 'customer/dashboard.html', 7),
]

section_pattern = re.compile(r'<(section|header)\b([^>]*)>(.*?)(?=<(?:section|header)\b|</body>|$)', re.DOTALL | re.IGNORECASE)

print(f"{'Page Title':<22} | {'File Path':<32} | {'Req':<4} | {'Actual':<6} | Status")
print('-' * 80)
for title, path, req in files:
    with open(path, 'r', encoding='utf-8') as fp:
        c = fp.read()
    count = len(list(section_pattern.finditer(c)))
    status = 'PASS [OK]' if count >= req else f'FAIL ({count} < {req})'
    print(f"{title:<22} | {path:<32} | {req:<4} | {count:<6} | {status}")
