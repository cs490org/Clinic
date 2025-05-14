from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

opts = Options()
opts.add_experimental_option("prefs", {"autofill.profile_enabled": False})
# Initialize WebDriver
driver = webdriver.Chrome(options=opts)
wait = WebDriverWait(driver, 10)

def click(xpath, use_js=False):
    el = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
    if use_js:
        driver.execute_script("arguments[0].click();", el)
    else:
        el.click()

def fill_signup_form(email_value, password_value):
    driver.get("http://localhost:5173/signup?role=PATIENT")
    driver.maximize_window()
    wait.until(EC.visibility_of_element_located((By.NAME, "firstName"))).clear()
    driver.find_element(By.NAME, "firstName").send_keys("Patient")
    driver.find_element(By.NAME, "lastName").send_keys("User")

    email = driver.find_element(By.NAME, "email")
    email.clear()
    email.send_keys(email_value)

    pw = driver.find_element(By.NAME, "password")
    pw.clear()
    pw.send_keys(password_value)

    click('//button[@type="submit"]')
    print(f"Attempted signup with email: '{email_value}', password: '{password_value}'")

def check_error(field):
    selector_map = {
        "email": ".email-error, .MuiFormHelperText-root",
        "password": ".password-error, .MuiFormHelperText-root",
        "cardNumber": ".cardNumber-error, .MuiFormHelperText-root",
        "expirationDate": ".expirationDate-error, .MuiFormHelperText-root"
    }
    selector = selector_map.get(field)
    err = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, selector)))
    print(f"{field} validation error: {err.text.strip()}")
    return err.text.strip()

try:
    # 1) Duplicate-email test (valid password)
    fill_signup_form("olivia.smith@clinic.com", "Valid123")
    time.sleep(1)
    try:
        check_error("email")
    except:
        print("No duplicate-email error found!")
    finally:
        driver.delete_all_cookies()

    # 2) Invalid-email formats
    invalid_emails = ["noatsign.com", "user@@clinic.com", "user@clinic", "@clinic.com", "user@.com"]
    for bad_email in invalid_emails:
        fill_signup_form(bad_email, "Valid123")
        time.sleep(1)
        try:
            check_error("email")
        except:
            print(f"No email-error for '{bad_email}'")
        finally:
            driver.delete_all_cookies()

    # 3) Invalid-password tests
    invalid_passwords = ["short", "allletters", "1234567"]
    for pwd in invalid_passwords:
        dyn_email = f"patient{int(time.time())}@lim.com"
        fill_signup_form(dyn_email, pwd)
        time.sleep(1)
        try:
            check_error("password")
        except:
            print(f"No password-error for '{pwd}'")
        finally:
            driver.delete_all_cookies()

    # 4) Happy-path signup
    valid_email = f"patient{int(time.time())}@lim.com"
    fill_signup_form(valid_email, "Valid123")
    wait.until(EC.url_contains("/patient/add_payment"))
    print("Signup success, on add_payment page")

    # 5) Credit-card tests: invalid then valid
    # Invalid card number
    cc_fields = {
        "cardHolderName": "Patient User",
        "cardNumber": "1234",
        "expirationDate": "01/20",
        "street": "123 Billing St",
        "city": "Newark",
        "state": "NJ",
        "zip": "07102"
    }
    for name, value in cc_fields.items():
        field = wait.until(EC.visibility_of_element_located((By.NAME, name)))
        field.clear(); field.send_keys(value)
    click('//button[contains(.,"Save Card")]')
    try:
        check_error("cardNumber")
    except:
        print("No error for invalid card number")
    finally:
        driver.delete_all_cookies()

    # Valid card
    fill_signup_form(valid_email, "Valid123")
    wait.until(EC.url_contains("/patient/add_payment"))
    valid_cc = {
        "cardHolderName": "Patient User",
        "cardNumber": "4242424242424242",
        "expirationDate": "12/30",
        "street": "123 Billing St",
        "city": "Newark",
        "state": "NJ",
        "zip": "07102"
    }
    for name, value in valid_cc.items():
        field = wait.until(EC.visibility_of_element_located((By.NAME, name)))
        field.clear(); field.send_keys(value)
    click('//button[contains(.,"Save Card")]')
    wait.until(EC.url_contains("/patient/symptoms"))
    print("Valid credit card accepted, moved to symptoms")

    # 6) Symptoms flow
    wait.until(EC.url_contains("/patient/symptoms"))
    boxes = driver.find_elements(By.XPATH, '//input[@type="checkbox" and not(@disabled)]')
    for idx in [0, 1, 6, 10]:
        if idx < len(boxes):
            driver.execute_script(
                "arguments[0].checked = true; arguments[0].dispatchEvent(new Event('change',{bubbles:true}));",
                boxes[idx]
            )
            time.sleep(2)
    click('//button[contains(normalize-space(.),"Update symptoms")]')
    print("Symptoms updated")

    # 7) Complete flow
    wait.until(EC.url_contains("/patient/dashboard"))
    print("Patient onboarding complete!")
    time.sleep(2)

finally:
    driver.quit()