from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
import time
import os  
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

    menu_icon = '//button[.//*[name()="svg" and @data-testid="MenuIcon"]]'
    wait_and_click(menu_icon, use_js=True)
    time.sleep(2)

     # ———— Click “Food” (Recipes) in the drawer ————
    Recipes_button = (
        '//div[contains(@class, "MuiDrawer-paper")]'
        '//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Food")]]'
    )
    if wait_and_click(Recipes_button, use_js=True):
        wait.until(EC.url_contains("/recipes"))
        print("Navigated to Food page")
        time.sleep(1)

        # ———— Click “Create Recipe” in the side nav ————
        create_recipe_btn = "//div[@role='button' and .//span[normalize-space(text())='Create Recipe']]"
        if wait_and_click(create_recipe_btn, use_js=True):
            wait.until(EC.url_contains("/recipes/create"))
            print("Navigated to Create Recipe page")
            time.sleep(1)
            arrow_button_xpath = "//button[.//*[@data-testid='ArrowBackIcon']]"
            if wait_and_click(arrow_button_xpath, use_js=True):
                print("Clicked back-arrow to hide food navigation")
                
                # Wait for the navigation to collapse (you might need to adjust this condition)
                wait.until(EC.invisibility_of_element_located((
                    By.XPATH, "//div[contains(@class,'MuiDrawer-paper')]"
                )))
                print("Food navigation hidden")

            # 1) Fill in Recipe name
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
            image_path = os.path.abspath("tests/hq720.jpg")
            file_input.send_keys(image_path)
            print("Uploaded image")
            time.sleep(1)

            # 4) Expand “2. Add Ingredients”
            ing_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                "//button[contains(@class,'MuiAccordionSummary-root') and .//p[contains(text(),'2. Add Ingredients')]]"
            )))
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", ing_btn)
            ing_btn.click()
            print("Expanded ingredients section")
            time.sleep(0.5)

            # 5) Pick first ingredient
            ing_select = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//div[@role="combobox" and contains(@class,"MuiSelect-select")]'
            )))
            ing_select.click()
            first_ing = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '(//ul[@role="listbox"]//li[not(@aria-disabled="true")])[1]'
            )))
            first_ing.click()
            wait.until(EC.invisibility_of_element_located((By.XPATH, "//ul[@role='listbox']")))
            print("Selected first ingredient")

            # 6) Expand “3. Add Instructions”
            instr_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                "//button[contains(@class,'MuiAccordionSummary-root') and .//p[contains(text(),'3. Add Instructions')]]"
            )))
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", instr_btn)
            instr_btn.click()
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

            # 8) Submit via the actual Create-Recipe <button>
            submit_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                "//button[@type='button' and contains(@class,'MuiButton-contained') and normalize-space(text())='Create Recipe']"
            )))
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
            submit_btn.click()
            print("Clicked Create Recipe button on form")

            # 9) Verify success
            wait.until(EC.url_contains("/recipes"))
            wait.until(EC.visibility_of_element_located((
                By.XPATH,
                "//*[contains(text(),'The Geekbob Meal')]"
            )))
            print("Recipe created successfully")
            arrow_forward_xpath = "//button[.//*[@data-testid='ArrowForwardIosIcon']]"
            if wait_and_click(arrow_forward_xpath, use_js=True):
                print("Clicked forward arrow button successfully")
            else:
                print("Failed to click forward arrow button")

            # 10) Close drawer and return to dashboard
            dashboard_button = '//div[contains(@class, "MuiDrawer-paper")]//div[contains(@class, "MuiListItemButton-root")][.//span[contains(text(), "Doctor Dashboard")]]'
            wait_and_click(menu_icon, use_js=True)
            time.sleep(1.5)
            wait_and_click(dashboard_button, use_js=True)
            wait.until(EC.url_contains("/doctor/dashboard"))
            print("Returned to Doctor Dashboard")
    time.sleep(1)

except Exception as e:
    print(f"Test failed: {e}")

finally:
    print("\nTest completed. Closing browser.")
    driver.quit()