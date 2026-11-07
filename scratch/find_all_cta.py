import os, re

cta_data = {}
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
                # Find sections with CTA buttons
                matches = re.findall(r'<div[^>]*class="[^"]*(?:cta-banner-actions|d-flex flex-wrap justify-content-center gap-3)[^"]*"[^>]*>(.*?)</div>', c, re.DOTALL)
                if matches:
                    cta_data[p] = matches

for page, blocks in cta_data.items():
    print(f'=== {page} ===')
    for b in blocks:
        # extract buttons
        btn_texts = re.findall(r'>([^<]+)</a>', b)
        print('  Buttons:', [t.strip() for t in btn_texts if t.strip()])
