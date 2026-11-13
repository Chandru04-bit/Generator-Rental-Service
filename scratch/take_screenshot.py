import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1400,1000')

driver = webdriver.Chrome(options=options)
abs_path = os.path.abspath('pages/about.html')
driver.get(f'file:///{abs_path}')

# Find section 8
section = driver.find_element(By.XPATH, '//h2[contains(text(), "The Engineers Behind Your Uptime")]/ancestor::section')
section.screenshot('scratch/team_section_screenshot.png')
driver.quit()
print('Screenshot saved successfully!')
