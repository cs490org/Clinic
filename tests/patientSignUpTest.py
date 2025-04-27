from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

'''
When completing the patient profile we have to click the dropdown, tried 
to fix it but we have to manually click it during the test
'''
driver = webdriver.Chrome()

try:
    driver.get("http://localhost:5173/signup")
    driver.maximize_window()

    wait = WebDriverWait(driver, 10)

    first_name_input = wait.until(EC.presence_of_element_located((By.NAME, "firstName")))
    last_name_input = driver.find_element(By.NAME, "lastName")
    email_input = driver.find_element(By.NAME, "email")
    password_input = driver.find_element(By.NAME, "password")

    unique_email = f"patient{int(time.time())}@Itani.com"

    first_name_input.send_keys("Patient")
    last_name_input.send_keys("User")
    email_input.send_keys(unique_email)
    password_input.send_keys("Password1")

    sign_up_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_up_button.click()

    print("Signup set")

    wait.until(EC.url_contains("complete-profile"))
    print("Complete patient profile")

    phone_input = wait.until(EC.presence_of_element_located((By.NAME, "phone")))
    address_input = driver.find_element(By.NAME, "address")

    phone_input.send_keys("1234567890")
    address_input.send_keys("123 Justin Street")

    pharmacy_dropdown = wait.until(EC.presence_of_element_located((By.NAME, "pharmacyId")))
    driver.execute_script("arguments[0].click();", pharmacy_dropdown)

    time.sleep(1)

    first_pharmacy_option = wait.until(EC.element_to_be_clickable((By.XPATH, '//ul//li[@role="option"]')))

    
    first_pharmacy_option.click()

    print("Pharmacy selected")

    complete_profile_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Complete Profile")]')))
    complete_profile_button.click()

    print("Submitted")

    wait.until(EC.url_contains("/patient/dashboard"))

    print("Initial signup and profile complete")

except Exception as e:
    print(f"Test Failed: {e}")

finally:
    driver.quit()
