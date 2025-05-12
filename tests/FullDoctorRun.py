from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
import time
import os

'''
Need to implement creation of meal plans and stuff but navigation is fully implemented
'''


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
    email_input.send_keys("samanthasalomon@clinic.com")
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
    #View Patient Sym.
    if wait_and_click('//button[normalize-space(text())="View symptoms"]', use_js=True):
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)
        ActionChains(driver).send_keys(Keys.ESCAPE).perform()
        
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
        # 1) Open patient
        patient_dropdown = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//div[@role='combobox' and @aria-labelledby='patient-select-label']")
    ))
    patient_dropdown.click()
    print("Opened patient dropdown")

    # 2) Wait for the <li> options, grab them fresh, click the first
    patient_options = wait.until(EC.presence_of_all_elements_located(
        (By.XPATH, "//ul[@role='listbox']//li")
    ))
    patient_options[0].click()
    print("Selected first patient")

    # 3) Wait for that listbox to vanish before doing the next dropdown
    wait.until(EC.invisibility_of_element_located(
        (By.XPATH, "//ul[@role='listbox']")
    ))

    # 4) Open Drug dropdown
    drug_dropdown = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//div[@role='combobox' and @aria-labelledby='drug-select-label']")
    ))
    drug_dropdown.click()
    print("Opened drug dropdown")

    # 5) Grab the drug options fresh, click the first
    drug_options = wait.until(EC.presence_of_all_elements_located(
        (By.XPATH, "//ul[@role='listbox']//li")
    ))
    drug_options[2].click()
    print("Selected third drug")

    # 6) Again wait for the listbox to go away
    wait.until(EC.invisibility_of_element_located(
        (By.XPATH, "//ul[@role='listbox']")
    ))
    expiry_input = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//input[@type='datetime-local']"))
    )
    expiry_input.click()
    expiry_input.clear()
    # use ISO-format "YYYY-MM-DDThh:mm"
    new_expiry = "2025-06-30T12:00"
    expiry_input.send_keys(new_expiry)
    print(f"Set expiration date to {new_expiry}")

    # 7) Click Assign
    assign_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[normalize-space(text())='Assign']")
    ))
    assign_btn.click()
    print("Clicked Assign")

    # 8) Return via drawer
    time.sleep(1)
    wait_and_click(menu_icon, use_js=True)
    time.sleep(1.5)
    dashboard_button = ('//div[contains(@class, "MuiDrawer-paper")]' '//div[contains(@class, "MuiListItemButton-root")]' '[.//span[contains(text(), "Doctor Dashboard")]]')
    if wait_and_click(dashboard_button, use_js=True):
        wait.until(EC.url_contains("/doctor/dashboard"))
        print("Returned to Doctor Dashboard via drawer")

    #Hamburger 2
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)
    
    # Click Recipes 
    Recipes_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Food")]]'
    if wait_and_click(Recipes_button, use_js=True):
        wait.until(EC.url_contains("/recipes"))
        print("Navigated to Food page")
        time.sleep(1)
        if wait_and_click('//button[normalize-space(.)="Create Recipe"] | //a[normalize-space(.)="Create Recipe"]',use_js=True):
            wait.until(EC.url_contains("/recipes/create"))
            print("Navigated to Create Recipe page")
            time.sleep(1)
            name_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Recipe name")]/following-sibling::div//input'
            )))
            name_input.send_keys("The Geekbob Meal")
            print("Entered recipe name")

            # 2) Fill in Description
            desc_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Description")]/following-sibling::div//textarea'
            )))
            desc_input.send_keys("This automatic")
            print("Entered description")

            # 3) Upload an image
            file_input = wait.until(EC.presence_of_element_located((
                By.XPATH,
                '//input[@type="file"]'
            )))
            image_path = os.path.abspath("tests/hq720.jpg")  # adjust path
            file_input.send_keys(image_path)
            print("Uploaded image")
            time.sleep(1)

            # 4) Expand “2. Add Ingredients”
            ingredients_summary = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//p[contains(text(),"2. Add Ingredients")]/ancestor::div[contains(@class,"MuiAccordionSummary-root")]'
            )))
            ingredients_summary.click()
            print("Expanded ingredients section")
            time.sleep(0.5)

            # 5) Pick the first ingredient
            ingredient_select = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//div[@role="button" and contains(@class,"MuiSelect-select")]'
            )))
            ingredient_select.click()
            print("Opened ingredient dropdown")
            first_ing = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '(//ul[@role="listbox"]//li[@role="option" and not(@aria-disabled="true")])[1]'
            )))
            first_ing.click()
            print("Selected first ingredient")
            wait.until(EC.invisibility_of_element_located((By.XPATH, "//ul[@role='listbox']")))

            # 6) Expand “3. Add Instructions”
            instr_summary = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//p[contains(text(),"3. Add Instructions")]/ancestor::div[contains(@class,"MuiAccordionSummary-root")]'
            )))
            instr_summary.click()
            print("Expanded instructions section")
            time.sleep(0.5)

            # 7) Enter instructions
            instr_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Enter instructions")]/following-sibling::div//textarea'
            )))
            instr_input.send_keys(
                "1. yeah mmm yummy yeah yeah yumm I love it yeah mm yeah\n"
                "2. Where the Linkeduzz at"
            )
            print("Entered instructions")

            # 8) Submit the form
            submit_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//button[normalize-space(.)="Create Recipe"]'
            )))
            submit_btn.click()
            print("Clicked Create Recipe")

            # 9) Verify we’re back on /recipes and see the new entry
            wait.until(EC.url_contains("/recipes"))
            wait.until(EC.visibility_of_element_located((
                By.XPATH,
                f'//h6[contains(text(),"The Geekbob Meal")] | //*[contains(text(),"The Geekbob Meal")]'
            )))
            print("Recipe created successfully")
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
    print("On Assign Meal Plan page")

    # 1) Open patient
    patient_dropdown = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//div[@role='combobox' and @aria-labelledby='patient-select-label']")
    ))
    patient_dropdown.click()
    print("Opened patient dropdown")

    # 2) Select first patient 
    first_patient_option = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//ul[@role='listbox']//li[1]")
    ))
    first_patient_option.click()
    print("Selected first patient option")

    # 3) Open meal plan 
    mealplan_dropdown = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//div[@role='combobox' and @aria-labelledby='mealplan-label']")
    ))
    mealplan_dropdown.click()
    print("Opened meal plan dropdown")

    # 4) Select meal plan 
    first_mealplan_option = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//ul[@role='listbox']//li[2]")
    ))
    first_mealplan_option.click()
    print("Selected first meal plan option")

    # 5) Click Assign
    time.sleep(1)
    assign_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[normalize-space(text())='Assign']")
    ))
    assign_btn.click()
    print("Clicked Assign")

    time.sleep(0.5)
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
        # 1) URL check
        wait.until(EC.url_contains("/patients"))
        print("On Patient Registry page")

        # 2) locate the anchor
        first_patient_link = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//table//tbody//tr[1]//td[1]//a")
        ))
        first_patient_link.click()
        print("Clicked first patient name")

        # 3) verify nav
        wait.until(EC.url_matches(r".*/patients/\d+$"))
        print("Landed on patient detail page")
        time.sleep(1.5)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        print("Scrolled down on patient detail page")
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