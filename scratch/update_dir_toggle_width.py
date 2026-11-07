with open('assets/css/responsive.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. 575.98px breakpoint
old_576 = """  .powerrent-navbar .navbar-collapse .nav-controls .dir-toggle-btn {
    height: 36px !important;
    min-height: 36px !important;
    flex: 1 1 auto !important;"""

new_576 = """  .powerrent-navbar .navbar-collapse .nav-controls .dir-toggle-btn {
    height: 36px !important;
    min-height: 36px !important;
    flex: 1 1 calc(100% - 44px - 8px) !important;
    width: calc(100% - 44px - 8px) !important;"""

# 2. 375px breakpoint
old_375 = """  .powerrent-navbar .navbar-collapse .nav-controls .dir-toggle-btn {
    height: 34px !important;
    min-height: 34px !important;
    font-size: 0.75rem !important;
  }"""

new_375 = """  .powerrent-navbar .navbar-collapse .nav-controls .dir-toggle-btn {
    height: 34px !important;
    min-height: 34px !important;
    font-size: 0.75rem !important;
    flex: 1 1 calc(100% - 38px - 6px) !important;
    width: calc(100% - 38px - 6px) !important;
  }"""

# 3. 335px breakpoint
old_335 = """  .powerrent-navbar .navbar-collapse .nav-controls .dir-toggle-btn {
    height: 32px !important;
    min-height: 32px !important;
    font-size: 0.72rem !important;
    padding: 0 6px !important;
  }"""

new_335 = """  .powerrent-navbar .navbar-collapse .nav-controls .dir-toggle-btn {
    height: 32px !important;
    min-height: 32px !important;
    font-size: 0.72rem !important;
    padding: 0 6px !important;
    flex: 1 1 calc(100% - 34px - 5px) !important;
    width: calc(100% - 34px - 5px) !important;
  }"""

# Normalize for matching
css = css.replace('\r\n', '\n')
if old_576 in css:
    css = css.replace(old_576, new_576)
    print('[OK] Replaced 576px dir-toggle')
else:
    print('[FAIL] 576px not matched')

if old_375 in css:
    css = css.replace(old_375, new_375)
    print('[OK] Replaced 375px dir-toggle')
else:
    print('[FAIL] 375px not matched')

if old_335 in css:
    css = css.replace(old_335, new_335)
    print('[OK] Replaced 335px dir-toggle')
else:
    print('[FAIL] 335px not matched')

with open('assets/css/responsive.css', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(css)

print('[OK] Updated assets/css/responsive.css')
