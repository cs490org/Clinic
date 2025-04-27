from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()

try:
    driver.get("http://localhost:5173/signup")
    driver.maximize_window()

    wait = WebDriverWait(driver, 10)

    pharmacist_tab = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Pharmacist")]')))
    pharmacist_tab.click()

    print("Pharmacist path")

    first_name_input = wait.until(EC.presence_of_element_located((By.NAME, "firstName")))
    last_name_input = driver.find_element(By.NAME, "lastName")
    email_input = driver.find_element(By.NAME, "email")
    password_input = driver.find_element(By.NAME, "password")

    unique_email = f"pharmacist{int(time.time())}@Dale.com"

    first_name_input.send_keys("Pharmacist")
    last_name_input.send_keys("User")
    email_input.send_keys(unique_email)
    password_input.send_keys("Password1")


    sign_up_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_up_button.click()

    print("Signup set")

    wait.until(EC.url_contains("complete-profile"))
    print("Complete pharmacy sign up")

    name_input = wait.until(EC.presence_of_element_located((By.NAME, "name")))
    zipcode_input = driver.find_element(By.NAME, "zipCode")
    phone_input = driver.find_element(By.NAME, "phone")
    address_input = driver.find_element(By.NAME, "address")

    name_input.send_keys("DrugsAndStuff")
    zipcode_input.send_keys("07008")
    phone_input.send_keys("1234567890")
    address_input.send_keys("456 Super Health Ave")

    print("Completed")

    complete_profile_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Complete Profile")]')))
    complete_profile_button.click()

    print("Submitted")

    wait.until(EC.url_contains("/pharmacist/dashboard"))

    print("Initial signup and profile complete")

except Exception as e:
    print(f"Test Failed: {e}")

finally:
    driver.quit()
