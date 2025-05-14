import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

@pytest.fixture(scope="function")
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode for GitHub Actions
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    driver.maximize_window()
    yield driver
    driver.quit()

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

def test_weekly_survey(driver):
    try:
        driver.get("http://localhost:5173/")
        wait = WebDriverWait(driver, 10)

        # Sign in
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

        # Verify successful login
        wait.until(EC.url_contains("dashboard"))
        assert "dashboard" in driver.current_url, "Failed to reach dashboard after login"

        time.sleep(1)
        slow_scroll_to_bottom(driver, pause=0.1, step=200)

        # Open Weekly Survey
        weekly_xpath = '//button[normalize-space(text())="Take Weekly survey"]'
        weeklySurvey = wait.until(EC.element_to_be_clickable((By.XPATH, weekly_xpath)))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", weeklySurvey)
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", weeklySurvey)
        print("Clicked 'Take Weekly survey'")

        # Fill in weight
        weightInput = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            '//label[normalize-space(text())="Weight (lbs)"]/following-sibling::div//input'
        )))
        weightInput.clear()
        weightInput.send_keys("134")   
        print("Entered weight")

        # Submit
        submit_btn = wait.until(EC.element_to_be_clickable((
            By.XPATH, '//button[normalize-space(text())="Submit"]'
        )))
        submit_btn.click()
        print("Clicked 'Submit'")

        # Verify submission
        wait.until(EC.invisibility_of_element_located((By.XPATH, '//button[normalize-space(text())="Submit"]')))
        wait.until(EC.url_contains("/dashboard"))
        assert "dashboard" in driver.current_url, "Failed to return to dashboard after survey submission"
        print("Survey submitted and back on dashboard")

    except Exception as e:
        pytest.fail(f"Test failed: {e}")