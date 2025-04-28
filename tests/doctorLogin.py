from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def doctor_login(driver, email, password):
    wait = WebDriverWait(driver, 10)

    driver.get("http://localhost:5173/signin")
    driver.maximize_window()

    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = driver.find_element(By.NAME, "password")

    email_input.send_keys(email)
    password_input.send_keys(password)

    sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_in_button.click()

    # Wait until redirected to patient dashboard
    wait.until(EC.url_contains("/patient/dashboard"))
