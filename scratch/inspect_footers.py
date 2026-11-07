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

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    cols = re.findall(r'<div class="col-[^"]*">', c)
    # footer columns
    footer_match = re.search(r'<footer[^>]*>.*?</footer>', c, re.DOTALL)
    if footer_match:
        f_cols = re.findall(r'<div class="col-[^"]*">', footer_match.group(0))
        print(f'{f}: {f_cols}')
