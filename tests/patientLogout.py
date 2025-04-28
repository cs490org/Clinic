from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from patientLogIn import patient_login  

#Doesn't fully work, can't click the Logout button
#Used the same path as LongerPathtoSignIn since they are similar but idk why it doesn't click
driver = webdriver.Chrome()

try:
    wait = WebDriverWait(driver, 10)

    patient_login(driver, email="patient1745713014@Itani.com", password="Password1")
    print("Logged in")

    time.sleep(3)

    logout_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[contains(@class, "MuiButton-root") and normalize-space(text())="Logout"]'
    )))
    logout_button.click()
    print("Clicked Logout button.")

    wait.until(EC.url_contains("/signin"))
    print("Redirected to Sign In page.")

    body_text = driver.find_element(By.TAG_NAME, "body").text
    if "Sign In" in body_text:
        print("Logout Successful")
    else:
        print("Logout not verified")

except Exception as e:
    print(f"Logout Test Failed: {e}")

finally:
    driver.quit()
