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

    email_input.send_keys("pharmacist1745713874@Dale.com") #Most of this code can be copied just adjust for doctor and pharmacist
    password_input.send_keys("Password1")

    sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_in_button.click()

    wait.until(EC.url_contains("dashboard"))
    print("Login Successful")

    time.sleep(2)

    hamburger_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[contains(@class, "MuiIconButton-root")]'
    )))
    driver.execute_script("arguments[0].scrollIntoView(true);", hamburger_button)
    time.sleep(0.5)
    driver.execute_script("arguments[0].click();", hamburger_button)
    print("Clicked hamburger menu (Drawer opened)")

    recipes_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//span[normalize-space()="Recipes"]/ancestor::li' 
    )))
    recipes_button.click()
    print("Clicked Recipes in Drawer")

    wait.until(EC.url_contains("/recipes"))
    print("Navigated to Recipes page")


    time.sleep(3)

except Exception as e:
    print(f"Clicking Menu failed: {e}")

finally:
    driver.quit()
