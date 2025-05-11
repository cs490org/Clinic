from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

'''
Need to implement creation of meal plans and stuff but navigation is fully implemented
'''

# Initialize driver with options
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

try:
    wait = WebDriverWait(driver, 10)
    
    driver.get("http://localhost:5173/")
    wait_and_click('//button[contains(@class, "MuiButton-root") and normalize-space(text())="Sign In"]')
    
    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = driver.find_element(By.NAME, "password")
    email_input.send_keys("valentineobi@clinic.com")
    password_input.send_keys("password123")
    wait_and_click('//button[@type="submit"]')
    
    wait.until(EC.url_contains("dashboard"))
    print("Login Successful")
    time.sleep(1)
    
    #Dark/light mode
    theme_toggle_button = '//button[.//*[name()="svg" and (@data-testid="LightModeIcon" or @data-testid="DarkModeIcon")]]'
    if wait_and_click(theme_toggle_button, use_js=True):
        print("Toggled Dark/Light mode")
        time.sleep(1)
    else:
        print("Failed to toggle theme")
    time.sleep(1)
    
    # Toggle Accepting Patients
    accepting_switch = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@type="checkbox"]')))
    driver.execute_script("arguments[0].click();", accepting_switch)
    print("Toggled 'Accepting New Patients' switch")
    time.sleep(1)
    # View All Reviews
    if wait_and_click('//button[normalize-space(text())="View All Reviews"]', use_js=True):
        wait.until(EC.url_contains("/doctor/reviews"))
        print("Navigated to Reviews page")
        time.sleep(1)
        driver.back()
        wait.until(EC.url_contains("dashboard"))
        
    time.sleep(1)
    # Assign Meal Plan
    if wait_and_click('//button[normalize-space(text())="Assign Meal Plan"]', use_js=True):
        wait.until(EC.url_contains("/mealplans"))
        print("Navigated to /mealplans page")
        time.sleep(1)
        driver.back()
        wait.until(EC.url_contains("dashboard"))
    time.sleep(1)
    #Hamburger 1
    menu_icon = '//button[.//*[name()="svg" and @data-testid="MenuIcon"]]'
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Assign Medication 
    medication_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Assign Medication")]]'
    if wait_and_click(medication_button, use_js=True):
        wait.until(EC.url_contains("/doctor/assignrx"))
        print("Navigated to Assign Medication page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Doctor Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/doctor/dashboard"))
            print("Returned to Doctor Dashboard via drawer")
    time.sleep(1)

    #Hamburger 2
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Recipes 
    Recipes_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Food")]]'
    if wait_and_click(Recipes_button, use_js=True):
        wait.until(EC.url_contains("/recipes"))
        print("Navigated to Food page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Doctor Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/doctor/dashboard"))
            print("Returned to Doctor Dashboard via drawer")
    time.sleep(1)

    #Hamburger 3
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Assign Meal Plans 
    mealPlan_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Assign a Meal Plan")]]'
    if wait_and_click(mealPlan_button, use_js=True):
        wait.until(EC.url_contains("/mealplans/assign"))
        print("Navigated to Assign a Meal Plan page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Doctor Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/doctor/dashboard"))
            print("Returned to Doctor Dashboard via drawer")
    time.sleep(1)

    #Hamburger 4
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Patient Registry 
    patient_registry = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Patient Registry")]]'
    if wait_and_click(patient_registry, use_js=True):
        # 1) wait until the URL is /patients
        wait.until(EC.url_contains("/patients"))
        print("On Patient Registry page")

        # 2) locate the first <a> in the first table row’s first cell
        first_patient_link = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//table//tbody//tr[1]//td[1]//a")
        ))
        first_patient_link.click()
        print("Clicked first patient name")

        # 3) verify navigation to /patients/{id}
        wait.until(EC.url_matches(r".*/patients/\d+$"))
        print("Landed on patient detail page")

        # 4) go back if you need to return
        time.sleep(2)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Doctor Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/doctor/dashboard"))
            print("Returned to Doctor Dashboard via drawer")
    time.sleep(1)

    #Dark/light mode
    theme_toggle_button = '//button[.//*[name()="svg" and (@data-testid="LightModeIcon" or @data-testid="DarkModeIcon")]]'
    if wait_and_click(theme_toggle_button, use_js=True):
        print("Toggled Dark/Light mode")
        time.sleep(1)
    else:
        print("Failed to toggle theme")
    time.sleep(1)
    # Click Logout
    logout_button = '//button[contains(@class, "MuiButton-root") and text()="Logout"]'
    if wait_and_click(logout_button, use_js=True):
        wait.until(EC.presence_of_element_located((By.XPATH, '//button[contains(text(), "Sign In")]')))
        print("Logout Successful")
    
except Exception as e:
    print(f"Test failed: {e}")

finally:
    print("\nTest completed. Closing browser.")
    driver.quit()