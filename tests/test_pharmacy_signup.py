from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import random
import time

#Pharmacy has been moved so that may be why we get a loading error

driver = webdriver.Chrome()

try:
    driver.get("http://localhost:5173/signup")
    driver.maximize_window()
    wait = WebDriverWait(driver, 10)

    pharmacist_tab = wait.until(EC.element_to_be_clickable(
        (By.XPATH, '//button[contains(text(), "Pharmacist")]')))
    pharmacist_tab.click()
    print("Selected Pharmacist path")

    first_name_input = wait.until(EC.presence_of_element_located((By.NAME, "firstName")))
    last_name_input = driver.find_element(By.NAME, "lastName")
    email_input = driver.find_element(By.NAME, "email")
    password_input = driver.find_element(By.NAME, "password")

    unique_email = f"pharmacist{int(time.time())}@Dale.com"

    first_name_input.send_keys("Pharmacist")
    last_name_input.send_keys("User")
    email_input.send_keys(unique_email)
    password_input.send_keys("Password1")

    sign_up_button = wait.until(EC.element_to_be_clickable(
        (By.XPATH, '//button[@type="submit"]')))
    sign_up_button.click()
    print("Submitted signup form")

    wait.until(EC.url_contains("complete-profile"))
    print("Reached profile completion page")

    try:
        autocomplete_div = wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "MuiAutocomplete-root"))
        )
        autocomplete_input = autocomplete_div.find_element(
            By.CSS_SELECTOR, "input.MuiInputBase-input"
        )
        
        autocomplete_input.clear()
        autocomplete_input.send_keys("Costco Pharmacy")
        print("Typed pharmacy name")
        
        wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[role='listbox']"))
        )
        option = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Costco Pharmacy')]"))
        )
        option.click()
        print("Selected pharmacy from dropdown")
    except Exception as e:
        print(f"Failed to set pharmacy name: {e}")
        raise

    # More info
    zip_code_field = wait.until(EC.presence_of_element_located((By.NAME, "zipCode")))
    zip_code_field.send_keys("07008")
    print("Filled zip code")

    phone_field = driver.find_element(By.NAME, "phone")
    phone_field.send_keys("1234567890")
    print("Filled phone number")

    rando = random.randint(0, 9999)
    addrNum = f"{rando} Super Health Ave, Newark, NJ"

    address_field = driver.find_element(By.NAME, "address")
    address_field.send_keys(addrNum)
    print("Filled address")

    # Submit profile complete
    complete_profile_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, '//button[contains(., "Complete Profile")]'))
    )
    complete_profile_button.click()
    print("Submitted profile completion form")

    # dashboard yay
    wait.until(EC.url_contains("/pharmacist/dashboard"))
    print("Successfully reached pharmacist dashboard")
    time.sleep(2)

except Exception as e:
    print(f"Test Failed: {e}")
finally:
    driver.quit()