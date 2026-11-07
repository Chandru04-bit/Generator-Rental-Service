# Update footers across all HTML files
import glob, re

files = [
    'components/footer.html',
    'index.html',
    'home-2.html',
    'pages/404.html',
    'pages/about.html',
    'pages/blog-details.html',
    'pages/blog.html',
    'pages/booking-confirmation.html',
    'pages/booking.html',
    'pages/coming-soon.html',
    'pages/contact.html',
    'pages/faq.html',
    'pages/fleet.html',
    'pages/generator-details.html',
    'pages/pricing.html',
    'pages/service-details.html',
    'pages/services.html',
    'pages/team.html'
]

for fpath in files:
    try:
        with open(fpath, 'r', encoding='utf-8') as fp:
            content = fp.read()
    except Exception as e:
        print(f'[SKIP] {fpath}: {e}')
        continue

    orig = content
    # Normalize CRLF
    content = content.replace('\r\n', '\n')

    # 1. Update col-6 on Quick Links & Fleet Capacities to col-sm-6 col-12
    content = re.sub(
        r'<div class="col-lg-2 col-md-6 col-6">',
        r'<div class="col-lg-2 col-md-6 col-sm-6 col-12">',
        content
    )
    content = re.sub(
        r'<div class="col-lg-3 col-md-6 col-6">',
        r'<div class="col-lg-3 col-md-6 col-sm-6 col-12">',
        content
    )

    # 2. Update footer legal links container
    content = re.sub(
        r'<div class="col-md-6 text-center text-md-end">(\s*<a href="[^"]*" class="text-muted text-decoration-none) me-3 (small">Privacy Policy</a>\s*<a href="[^"]*" class="text-muted text-decoration-none) me-3 (small">Terms of Service</a>\s*<a href="([^"]*)" class="text-muted text-decoration-none small">Rental Agreement</a>\s*</div>',
        r'<div class="col-md-6 text-center text-md-end footer-legal-links d-flex flex-wrap justify-content-center justify-content-md-end gap-3 pt-2 pt-md-0">\1 \2 \3\n            <a href="\4" class="text-muted text-decoration-none small">Rental Agreement</a>\n          </div>',
        content
    )

    if content != orig.replace('\r\n', '\n'):
        with open(fpath, 'w', encoding='utf-8', newline='\r\n') as fp:
            fp.write(content)
        print(f'[OK] Updated {fpath}')
    else:
        print(f'[NO CHANGE] {fpath}')
