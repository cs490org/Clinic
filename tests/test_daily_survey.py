from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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
    slow_scroll_to_bottom(driver, pause=0.1, step=200)
    # 1) Open Daily Survey
    daily_btn_xpath = '//button[normalize-space(text())="Take Daily survey"]'
    dailySurvey = wait.until(EC.presence_of_element_located((By.XPATH, daily_btn_xpath)))
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", dailySurvey)
    time.sleep(0.5)
    driver.execute_script("arguments[0].click();", dailySurvey)
    print("Clicked 'Take Daily survey'")

    # 2) Select first meal plan from the combobox
    mealPlanXPath = '//div[@role="combobox" and contains(@class,"MuiSelect-select")]'
    mealPlanDS = wait.until(EC.element_to_be_clickable((By.XPATH, mealPlanXPath)))
    mealPlanDS.click()
    firstOption = wait.until(EC.element_to_be_clickable((
        By.XPATH,
        '(//ul[@role="listbox"]//li[not(@aria-disabled="true")])[1]'
    )))
    firstOption.click()
    wait.until(EC.invisibility_of_element_located((By.XPATH, "//ul[@role='listbox']")))
    print("Selected first meal plan")

    # 3) (Optional) Autofill Calories if you want default values
    if wait_and_click('//button[normalize-space(text())="Autofill Calories"]', use_js=True):
        print("Clicked 'Autofill Calories'")
        # you can add a short wait here if needed for the inputs to populate
        time.sleep(0.5)

    # 4) Fill in Mood (1–10)
    mood_input = wait.until(EC.element_to_be_clickable((
        By.XPATH,
        '//label[normalize-space(text())="Mood (1-10)"]/following-sibling::div//input'
    )))
    mood_input.clear()
    mood_input.send_keys("7")   # adjust the value as desired
    print("Entered Mood")

    # 5) Submit
    submit_btn = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="Submit"]'
    )))
    submit_btn.click()
    print("Clicked 'Submit'")

    # 6) Wait for modal to disappear or for dashboard to re-appear
    wait.until(EC.invisibility_of_element_located((By.XPATH, '//button[normalize-space(text())="Submit"]')))
    wait.until(EC.url_contains("/dashboard"))
    print("Survey submitted and back on dashboard")

except Exception as e:
    print(f"Test failed: {e}")

finally:
    driver.quit()