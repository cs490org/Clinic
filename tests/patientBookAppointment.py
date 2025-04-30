from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()

try:
    driver.get("http://localhost:5173/")
    driver.maximize_window()

    wait = WebDriverWait(driver, 10)

    signin_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[contains(@class, "MuiButton-root") and normalize-space(text())="Sign In"]'
    )))
    signin_button.click()

    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = driver.find_element(By.NAME, "password")

    email_input.send_keys("patient1745712973@Itani.com")
    password_input.send_keys("Password1")

    sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_in_button.click()

    wait.until(EC.url_contains("dashboard"))
    print("Login Successful")

    time.sleep(2)

    book_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="Book Appointment"]'
    )))
    driver.execute_script("arguments[0].scrollIntoView(true);", book_button)
    time.sleep(0.5)
    driver.execute_script("arguments[0].click();", book_button)
    print("Clicked Book Appointment button")

    symptom_field = wait.until(EC.presence_of_element_located((
        By.XPATH, '//textarea[@placeholder="Please describe your symptoms"]'
    )))
    symptom_field.send_keys("Ouch ouch ouch, my hand ouch ouch help my hand help ouch")
    print("Entered symptoms")

    time.sleep(1)

    confirm_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="Book"]'
    )))
    confirm_button.click()
    print("Clicked Book button")

    time.sleep(3)

except Exception as e:
    print(f"Appointment booking failed: {e}")

finally:
    driver.quit()
