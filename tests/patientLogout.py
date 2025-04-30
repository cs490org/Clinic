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
    assert "dashboard" in driver.current_url.lower()

    print("Login Successful")
    
    time.sleep(2)

    try:
        logout_button = wait.until(EC.element_to_be_clickable((
            By.XPATH, '//button[contains(text(), "Logout") or contains(text(), "Log out") or contains(text(), "Sign out")]'
        )))
        logout_button.click()
        #print("1")
    except Exception as e:
        print("Couldn't happen")
    
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, '//button[contains(text(), "Sign In")]')))
        print("Logout Successful")
    except Exception as e:
        print(f"Could not verify logout: {e}")

except Exception as e:
    print(f"Test Failed: {e}")

finally:
    driver.quit()