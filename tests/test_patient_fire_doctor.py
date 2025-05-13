from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.alert import Alert
import time

driver = webdriver.Chrome()
driver.maximize_window()

def wait_and_click(xpath, timeout=10, use_js=False):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((By.XPATH, xpath))
        )
        if use_js:
            driver.execute_script("arguments[0].click();", element)
        else:
            element.click()
        print(f"Clicked '{xpath}'")
        return True
    except Exception as e:
        print(f"Failed to click element with xpath '{xpath}': {e}")
        return False
def slow_scroll_to_bottom(driver, pause=0.2, step=300):
    total_height = driver.execute_script("return document.body.scrollHeight")
    current = 0
    
    while current < total_height:
        driver.execute_script("window.scrollBy(0, arguments[0]);", step)
        current += step
        time.sleep(pause)
    
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

try:
    driver.get("http://localhost:5173/")
    driver.maximize_window()
    def wait_and_click(xpath, timeout=10, use_js=False):
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.element_to_be_clickable((By.XPATH, xpath))
            )
            if use_js:
                driver.execute_script("arguments[0].click();", element)
            else:
                element.click()
            print(f"Clicked '{xpath}'")
            return True
        except Exception as e:
            print(f"Failed to click element with xpath '{xpath}': {e}")
            return False

    wait = WebDriverWait(driver, 10)

    signin_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[contains(@class, "MuiButton-root") and normalize-space(text())="Sign In"]'
    )))
    signin_button.click()

    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = driver.find_element(By.NAME, "password")
    email_input.send_keys("olivia.smith@clinic.com")
    password_input.send_keys("password123")

    sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_in_button.click()

    wait.until(EC.url_contains("dashboard"))
    print("Login successful")

    time.sleep(1)
    #View more of current meal plan
    viewMoreMealPlan = wait.until(EC.presence_of_element_located((
    By.XPATH, '//button[normalize-space(text())="Fire Doctor"]'
    )))

    #Scroll it into the middle of the viewport
    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
        viewMoreMealPlan
    )
    time.sleep(0.5)  

    #Click via JS so Selenium doesn’t worry about overlays
    driver.execute_script("arguments[0].click();", viewMoreMealPlan)
    print("Patient clicked 'Fire Doctor'")

    wait.until(EC.alert_is_present(), message="Waiting for JS confirm")
    alert = driver.switch_to.alert
    print("Confirm dialog says:", alert.text)
    alert.accept()   # or .dismiss() to hit “Cancel”
    print("Confirmed firing doctor")

    driver.back()
    wait.until(EC.url_contains("/dashboard"))
    print("Patient returned to dashboard from view health")

except Exception as e:
    print(f"Test failed: {e}")

finally:
    driver.quit()