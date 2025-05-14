from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

'''
Not sure what actions can be done on the pharmacy page
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
    email_input.send_keys("pharmacy@clinic.com")
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
    #Hamburger 1
    menu_icon = '//button[.//*[name()="svg" and @data-testid="MenuIcon"]]'
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click conversations 
    appChatHist = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Appointment Chat History")]]'
    if wait_and_click(appChatHist, use_js=True):
        wait.until(EC.url_contains("/conversations"))
        print("Navigated to Chat History page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Pharmacist Dashboard via drawer")
    time.sleep(1)

    #Hamburger 2
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Bills 
    medication_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Bills")]]'
    if wait_and_click(medication_button, use_js=True):
        wait.until(EC.url_contains("/bills"))
        print("Navigated to Bills page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Pharmacist Dashboard via drawer")
    time.sleep(1)

    #Hamburger 3
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Patients 
    Recipes_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Patients")]]'
    if wait_and_click(Recipes_button, use_js=True):
        wait.until(EC.url_contains("/patients"))
        print("Navigated to Patients page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Pharmacist Dashboard via drawer")
    time.sleep(1)

    #Hamburger 3
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Inventory 
    pharmInven = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Pharmacy Inventory")]]'
    if wait_and_click(pharmInven, use_js=True):
        wait.until(EC.url_contains("/Inventory"))
        print("Navigated to Inventory page")
        time.sleep(1)
        wait.until(EC.presence_of_element_located((
            By.CSS_SELECTOR,
            "div.MuiCard-root"
        )))

        #Ibuprofen
        drug_name = "Ibuprofen"
        card_xpath = (
            f"//div[contains(@class,'MuiCard-root') and .//p[normalize-space(text())='{drug_name}']]"
        )
        card = wait.until(EC.presence_of_element_located((
            By.XPATH,
            card_xpath
        )))

        #Modify
        modify_btn = card.find_element(
            By.XPATH,
            ".//button[normalize-space(text())='MODIFY QUANTITY']"
        )
        modify_btn.click()
        print(f"Clicked Modify Quantity on {drug_name}")

        #fill in quantity
        new_qty_input = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//label[contains(text(),'New Quantity')]/following-sibling::div//input"
        )))
        new_qty_input.clear()
        new_qty = "10"
        new_qty_input.send_keys(new_qty)
        print(f"Entered new quantity: {new_qty}")

        # Save
        save_btn = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//button[normalize-space(text())='Save']"
        )))
        save_btn.click()
        print("Clicked Save")

        #Verify the update
        updated_qty = wait.until(EC.visibility_of_element_located((
            By.XPATH,
            f"{card_xpath}//p[contains(text(),'Quantity')]/..//*[contains(text(),'{new_qty}')]"
        ))).text
        print(f"Quantity now shows: {updated_qty}")
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Pharmacist Dashboard via drawer")
    time.sleep(1)


    #Hamburger 4
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Pharmacy History and Override 
    pharmInven = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Pharmacy History and Override")]]'
    if wait_and_click(pharmInven, use_js=True):
        wait.until(EC.url_contains("/override"))
        print("Navigated to Pharmacy History and Override page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Pharmacist Dashboard via drawer")
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