import os
import re

files = [os.path.join(r, f) for r, d, fs in os.walk('.') for f in fs if f.endswith('.html')]

print("--- SCANNING FOR DUPLICATE CONTENT OR BROKEN IMAGES IN CARDS ---")

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check broken image paths
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    for src in img_srcs:
        if src.startswith('http') or src.startswith('data:'):
            continue
        # resolve relative path from fpath's directory
        fdir = os.path.dirname(fpath)
        img_full = os.path.normpath(os.path.join(fdir, src))
        if not os.path.exists(img_full):
            print(f"[BROKEN IMAGE] in {fpath}: {src} -> {img_full}")

    # Check for duplicate text across cards in sections
    # Find all <section> or card containers
    sections = re.findall(r'<section[^>]*>(.*?)</section>', html, re.DOTALL)
    for idx, sec in enumerate(sections):
        # find cards
        cards = re.findall(r'<(?:div|article)[^>]*class="[^"]*(?:card|item)[^"]*"[^>]*>(.*?)</(?:div|article)>', sec, re.DOTALL)
        if len(cards) >= 2:
            # extract text of cards
            card_texts = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', c)).strip() for c in cards]
            # check if any two cards are identical
            seen_texts = {}
            for c_idx, t in enumerate(card_texts):
                if t in seen_texts:
                    print(f"[DUPLICATE CARD] in {fpath} section {idx}: card {seen_texts[t]} and card {c_idx} have identical text: '{t[:80]}...'")
                else:
                    seen_texts[t] = c_idx
