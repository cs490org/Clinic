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
    
    doctor_tab = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Doctor")]')))
    doctor_tab.click()

    print("Doctor path")

    first_name_input = wait.until(EC.presence_of_element_located((By.NAME, "firstName")))
    last_name_input = driver.find_element(By.NAME, "lastName")
    email_input = driver.find_element(By.NAME, "email")
    password_input = driver.find_element(By.NAME, "password")

    unique_email = f"doctor{int(time.time())}@Naik.com"

    first_name_input.send_keys("Doctor")
    last_name_input.send_keys("User")
    email_input.send_keys(unique_email)
    password_input.send_keys("Password1")


    sign_up_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_up_button.click()

    print("Signup complete")

    wait.until(EC.url_contains("complete-profile"))
    print("Complete Doctor profile")

    phone_input = wait.until(EC.presence_of_element_located((By.NAME, "phone")))
    specialty_input = driver.find_element(By.NAME, "specialty")
    license_input = driver.find_element(By.NAME, "licenseNumber")

    phone_input.send_keys("1234567890")
    specialty_input.send_keys("Partying")
    license_input.send_keys("987654")

    print("Completed the profile")

    complete_profile_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Complete Profile")]')))
    complete_profile_button.click()

    print("Submitted")

    wait.until(EC.url_contains("/doctor/dashboard"))

    print("Initial signup and profile complete")

except Exception as e:
    print(f"Test Failed: {e}")

finally:
    driver.quit()
