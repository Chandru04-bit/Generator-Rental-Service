for fname in ['pages/pricing.html', 'pages/about.html', 'home-2.html', 'index.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()
    import re
    m = re.search(r'class="cta-banner.*?</div>\s*</div>\s*</div>\s*</section>', text, re.DOTALL)
    if m:
        print(f'=== {fname} ===')
        print(m.group(0))
    else:
        # try searching for 'Speak to Sales'
        idx = text.find('Speak to Sales')
        if idx != -1:
            print(f'=== {fname} (around Speak to Sales) ===')
            print(text[max(0, idx-200):min(len(text), idx+400)])
