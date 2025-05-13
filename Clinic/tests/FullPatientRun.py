from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
#Updated
#Will not do an appointment as that is part of the chatFeature script

driver = webdriver.Chrome()

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
    #Dark/light mode
    theme_toggle_button = '//button[.//*[name()="svg" and (@data-testid="LightModeIcon" or @data-testid="DarkModeIcon")]]'
    if wait_and_click(theme_toggle_button, use_js=True):
        print("Toggled Dark/Light mode")
        time.sleep(1)
    else:
        print("Failed to toggle theme")
    time.sleep(1)

    edit_symptoms_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="Edit my symptoms"]'
    )))
    driver.execute_script("arguments[0].scrollIntoView(true);", edit_symptoms_button)
    time.sleep(1)
    driver.execute_script("arguments[0].click();", edit_symptoms_button)
    print("Clicked 'Edit my symptoms' button")

    wait.until(EC.url_contains("/patient/symptoms"))
    print("Navigated to symptom editing page")

    symptom_checkboxes = wait.until(EC.presence_of_all_elements_located((By.XPATH, '//input[@type="checkbox" and not(@disabled)]')))
    if len(symptom_checkboxes) >= 2:
        for i in range(2):
            checkbox = symptom_checkboxes[i]
            label_element = checkbox.find_element(By.XPATH, './ancestor::div[contains(@class, "MuiStack-root")]/div[1]')
            print(f"Selected symptom: {label_element.text}")
            time.sleep(1)
            checkbox.click()
    else:
        print("Less than 2 symptoms found")

    update_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Update symptoms")]')))
    update_button.click()
    print("Submitted updated symptoms")

    wait.until(EC.url_contains("/patient/dashboard"))
    print("Returned to dashboard")

    time.sleep(2)
    #View patient health
    view_health_button = wait.until(EC.presence_of_element_located((
    By.XPATH, '//button[normalize-space(text())="View my health"]'
    )))

    # 1️⃣ Scroll it into the middle of the viewport
    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
        view_health_button
    )
    time.sleep(0.5)  # a small pause to let any layout settle

    # 2️⃣ Click via JS so Selenium doesn’t worry about overlays
    driver.execute_script("arguments[0].click();", view_health_button)
    print("✔ Patient clicked 'View my health'")

    # 3) Wait for the metrics page
    wait.until(EC.url_contains("/metrics"))
    print("✔ Navigated to /metrics")
    time.sleep(2)

    # 4) Now your slow scroll
    slow_scroll_to_bottom(driver, pause=0.1, step=200)
    time.sleep(1)

    driver.back()
    wait.until(EC.url_contains("/patient/dashboard"))
    print("Patient returned to dashboard from view health")

    # Step 5.1: View Recipes
    view_recipes_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="View recipes"]'
    )))
    driver.execute_script("arguments[0].scrollIntoView(true);", view_recipes_button)
    time.sleep(1)
    driver.execute_script("arguments[0].click();", view_recipes_button)
    print("Patient went to 'View recipes'")

    wait.until(EC.url_contains("/recipes"))
    print("Patient back to landing")
    time.sleep(1)
    driver.back()

    wait.until(EC.url_contains("/patient/dashboard"))
    print("Patient returned to dashboard from recipes")

    # Step 5.2: View Meal Plans
    view_mealplans_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="View meal plans"]'
    )))
    driver.execute_script("arguments[0].scrollIntoView(true);", view_mealplans_button)
    time.sleep(1)
    driver.execute_script("arguments[0].click();", view_mealplans_button)
    print("Patient to 'View meal plans'")

    wait.until(EC.url_contains("/mealplans"))
    print("Patient to /mealplans page")
    time.sleep(1)
    driver.back()

    wait.until(EC.url_contains("/patient/dashboard"))
    print("Patient returned to dashboard from meal plans")
    time.sleep(1)

    #View pharma
    pharmacy_btn = wait.until(EC.presence_of_element_located((
    By.XPATH, '//button[normalize-space(text())="View my pharmacy"]'
    )))

    # 1️⃣ scroll it into center of viewport
    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
        pharmacy_btn
    )
    time.sleep(0.5)

    # 2️⃣ click via JS to avoid “click intercepted” errors
    driver.execute_script("arguments[0].click();", pharmacy_btn)
    print("✔ Patient clicked 'View my pharmacy'")

    # 3️⃣ wait for the pharmacy page to load
    wait.until(EC.url_contains("/pharmacy"))
    print("✔ Navigated to /pharmacy")

    time.sleep(2)
    driver.back()

    # 4️⃣ back to dashboard
    wait.until(EC.url_contains("/patient/dashboard"))
    print("✔ Patient returned to dashboard from pharmacy")
    '''
    book_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="Book Appointment"]'
    )))
    driver.execute_script("arguments[0].scrollIntoView(true);", book_button)
    time.sleep(1)
    driver.execute_script("arguments[0].click();", book_button)
    print("Clicked 'Book Appointment' button")

    symptom_field = wait.until(EC.presence_of_element_located((
        By.XPATH, '//textarea[@placeholder="Please describe your symptoms"]'
    )))
    symptom_field.send_keys("Mad because day by day nothing changes but when I look back everything is different")
    print("Entered symptoms")

    time.sleep(1)

    confirm_button = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(text())="Book"]'
    )))
    confirm_button.click()
    print("Clicked 'Book' button")
    '''
    #time.sleep(1.5)

    #Hamburger 1
    menu_icon = '//button[.//*[name()="svg" and @data-testid="MenuIcon"]]'
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Appointment chat history 
    chatHistory = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Appointment Chat History")]]'
    if wait_and_click(chatHistory, use_js=True):
        wait.until(EC.url_contains("/conversations"))
        print("Navigated to chat history page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Patient Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Patient Dashboard via drawer")
    time.sleep(1)

    #Hamburger 2 
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click My Symptoms 
    symptoms_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "My Symptoms")]]'
    if wait_and_click(symptoms_button, use_js=True):
        wait.until(EC.url_contains("/symptoms"))
        print("Navigated to Symptoms page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Patient Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Patient Dashboard via drawer")
    time.sleep(1)

    #Hamburger 3
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Recipes 
    Recipes_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Food")]]'
    if wait_and_click(Recipes_button, use_js=True):
        wait.until(EC.url_contains("/recipes"))
        print("Navigated to Recipes page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Patient Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Patient Dashboard via drawer")
    time.sleep(1)

    #Hamburger 4
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Assigned Meal Plans 
    mealPlan_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Assigned Meal Plans")]]'
    if wait_and_click(mealPlan_button, use_js=True):
        wait.until(EC.url_contains("/mealplans"))
        print("Navigated to Assign a Meal Plan page")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Patient Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Patient Dashboard via drawer")
    time.sleep(1)

    #Hamburger 5
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click payment plan 
    paymentPortal = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Payment Portal")]]'
    if wait_and_click(paymentPortal, use_js=True):
        wait.until(EC.url_contains("/bills"))
        print("Navigated to payments")
        time.sleep(1)
        wait_and_click(menu_icon, use_js=True)
        time.sleep(1.5)
        dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Patient Dashboard")]]'
        if wait_and_click(dashboard_button, use_js=True):
            wait.until(EC.url_contains("/dashboard"))
            print("Returned to Patient Dashboard via drawer")
    time.sleep(1)

    #Dark/light mode
    theme_toggle_button = '//button[.//*[name()="svg" and (@data-testid="LightModeIcon" or @data-testid="DarkModeIcon")]]'
    if wait_and_click(theme_toggle_button, use_js=True):
        print("Toggled Dark/Light mode")
        time.sleep(1)
    else:
        print("Failed to toggle theme")
    time.sleep(1)

    #Logging out portion
    try:
        logout_button = wait.until(EC.element_to_be_clickable((
            By.XPATH, '//button[contains(text(), "Logout") or contains(text(), "Log out") or contains(text(), "Sign out")]'
        )))
        logout_button.click()
        time.sleep(1)
        #print("1")
    except Exception as e:
        print("Couldn't happen")
    
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, '//button[contains(text(), "Sign In")]')))
        print("Logout Successful")
    except Exception as e:
        print(f"Could not verify logout: {e}")


except Exception as e:
    print(f"Test failed: {e}")

finally:
    driver.quit()
