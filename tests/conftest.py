import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

@pytest.fixture(scope="function")
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode for GitHub Actions
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.maximize_window()
    yield driver
    driver.quit()

@pytest.fixture(scope="function")
def wait(driver):
    return WebDriverWait(driver, 10)

def wait_and_click(driver, xpath, timeout=10, use_js=False):
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

@pytest.fixture(scope="function")
def login_patient(driver, wait):
    """Fixture to log in as a patient"""
    driver.get("http://localhost:5173/")
    
    # Click sign in button
    signin_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[contains(@class, "MuiButton-root") and normalize-space(text())="Sign In"]'
    )))
    signin_button.click()

    # Enter credentials
    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = driver.find_element(By.NAME, "password")
    email_input.send_keys("olivia.smith@clinic.com")
    password_input.send_keys("password123")

    # Submit login
    sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]')))
    sign_in_button.click()

    # Verify successful login
    wait.until(EC.url_contains("dashboard"))
    assert "dashboard" in driver.current_url, "Failed to reach dashboard after login"
    
    return driver 