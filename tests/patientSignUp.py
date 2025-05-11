from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

opts = Options()
opts.add_experimental_option("prefs", {"autofill.profile_enabled": False})
driver = webdriver.Chrome(options=opts)
wait = WebDriverWait(driver, 10)

def click(xpath, use_js=False):
    el = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
    if use_js:
        driver.execute_script("arguments[0].click();", el)
    else:
        el.click()

try:
    # 1) Sign up
    driver.get("http://localhost:5173/signup?role=PATIENT")
    driver.maximize_window()
    driver.find_element(By.NAME, "firstName").send_keys("Patient")
    driver.find_element(By.NAME, "lastName").send_keys("User")
    driver.find_element(By.NAME, "email").send_keys(f"patient{int(time.time())}@Lim.com")
    driver.find_element(By.NAME, "password").send_keys("Password1")
    click('//button[@type="submit"]')
    print("Signup submitted")

    # 2) Complete profile
    wait.until(EC.url_contains("complete-profile"))
    driver.find_element(By.NAME, "phone").send_keys("1234567890")
    driver.find_element(By.NAME, "street").send_keys("123 Main St")
    driver.find_element(By.NAME, "city").send_keys("Newark")
    driver.find_element(By.NAME, "state").send_keys("NJ")
    driver.find_element(By.NAME, "zipCode").send_keys("07102")

    # Pharmacy autocomplete + dummy fallback
    pz = wait.until(EC.element_to_be_clickable((By.NAME, "pharmacyZipCode")))
    pz.clear(); pz.send_keys("07102"); time.sleep(1)
    cards = driver.find_elements(By.CSS_SELECTOR, 'div.css-1ho76lh-MuiPaper-root')
    if not cards:
        injection = '<div class="MuiPaper-root MuiPaper-elevation1 css-1ho76lh-MuiPaper-root"><p>Lightning-Pharmacy - 200 Somewhere-ville - 07103</p></div>'
        ctrl = driver.find_element(By.CSS_SELECTOR, 'div.css-ytlejw-MuiFormControl-root')
        driver.execute_script("arguments[0].insertAdjacentHTML('afterend', arguments[1]);", ctrl, injection)
        time.sleep(0.5)
        cards = driver.find_elements(By.CSS_SELECTOR, 'div.css-1ho76lh-MuiPaper-root')
    cards[0].click()
    print("Pharmacy selected")

    # HIPAA + next
    click("//label[.//input[@name='hipaaAgreed']]", use_js=True)
    click("//button[not(@disabled) and (contains(normalize-space(.),'Next') or contains(normalize-space(.),'Continue'))]")
    print("Profile submitted")

    # 3) Add payment
    wait.until(EC.url_contains("/patient/add_payment"))
    for name, val in [
        ("cardHolderName","Patient User"),
        ("cardNumber","4242424242424242"),
        ("expirationDate","12/30"),
        ("street","123 Billing St"),
        ("city","Newark"),
        ("state","NJ"),
        ("zip","07102"),
    ]:
        wait.until(EC.visibility_of_element_located((By.NAME, name))).send_keys(val)
    click('//button[contains(.,"Save Card")]')
    print("Card submitted")

    # 4) Symptoms
    wait.until(EC.url_contains("/patient/symptoms"))
    boxes = driver.find_elements(By.XPATH, '//input[@type="checkbox" and not(@disabled)]')
    for idx in [0,1,6,10]:
        if idx < len(boxes):
            driver.execute_script("""
                arguments[0].checked = true;
                arguments[0].dispatchEvent(new Event('change',{bubbles:true}));
            """, boxes[idx])
            time.sleep(2)
    click('//button[contains(normalize-space(.),"Update symptoms")]')
    print("Symptoms updated")

    # 5) Done
    wait.until(EC.url_contains("/patient/dashboard"))
    print("Patient onboarding complete!")
    time.sleep(2)
finally:
    driver.quit()
