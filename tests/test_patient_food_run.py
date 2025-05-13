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
def pickOption(label_id, x):
            dropdown = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                f"//div[@role='combobox' and @aria-labelledby='{label_id}']"
            )))
            dropdown.click()
            # wait for listbox, grab first <li>, click it
            opt = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                f"//ul[@role='listbox']/li[{x}]"
            )))
            opt.click()
            # wait for it to close before next
            wait.until(EC.invisibility_of_element_located((
                By.XPATH, "//ul[@role='listbox']"
            )))

try:
    wait = WebDriverWait(driver, 10)
    
    driver.get("http://localhost:5173/")
    wait_and_click('//button[contains(@class, "MuiButton-root") and normalize-space(text())="Sign In"]')
    
    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = driver.find_element(By.NAME, "password")
    email_input.send_keys("olivia.smith@clinic.com")
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
        '''
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
            '''
            #Go to create ingredient portion
        create_recipe_btn = "//div[@role='button' and .//span[normalize-space(text())='Create Ingredient']]"
        if wait_and_click(create_recipe_btn, use_js=True):
            wait.until(EC.url_contains("/ingredients/create"))
            print("Navigated to Create ingredient page")
            time.sleep(1)
            arrow_button_xpath = "//button[.//*[@data-testid='ArrowBackIcon']]"
            if wait_and_click(arrow_button_xpath, use_js=True):
                print("Clicked back-arrow to hide food navigation")
                
                # Wait for the navigation to collapse (you might need to adjust this condition)
                wait.until(EC.invisibility_of_element_located((
                    By.XPATH, "//div[contains(@class,'MuiDrawer-paper')]"
                )))
                print("Food navigation hidden")

            # 1) Fill in ingredient name
            name_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Ingredient name")]/following-sibling::div//input'
            )))
            name_input.send_keys("Jockey")
            print("Entered ingredient name")
            # 2) Fill in desc
            name_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Description")]/following-sibling::div//input'
            )))
            name_input.send_keys("Chicken")
            print("Entered Description name")
            # 3) Fill in fats
            name_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Fats")]/following-sibling::div//input'
            )))
            name_input.send_keys("20")
            print("Entered Fats")
            # 4) Fill in carbs
            name_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Carbs")]/following-sibling::div//input'
            )))
            name_input.send_keys("30")
            print("Entered Fats")
            # 5) Fill in protein
            name_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Protein")]/following-sibling::div//input'
            )))
            name_input.send_keys("200")
            print("Entered Protein")
            # 6) Fill in Calories
            name_input = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                '//label[contains(.,"Calories")]/following-sibling::div//input'
            )))
            name_input.send_keys("500")
            print("Entered Calories")
            time.sleep(2)
            submit_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                "//button[@type='button' and contains(@class,'MuiButton-contained') and normalize-space(text())='Create Ingredient']"
            )))
            time.sleep(1)
            '''arrow_forward_xpath = "//button[.//*[@data-testid='ArrowForwardIosIcon']]"
            if wait_and_click(arrow_forward_xpath, use_js=True):
                print("Clicked forward arrow button successfully")
            else:
                print("Failed to click forward arrow button")'''
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
            submit_btn.click()
            time.sleep(1)
            print("Clicked Create Ingredient button on form")
        #View meal plans
        create_recipe_btn = "//div[@role='button' and .//span[normalize-space(text())='View Meal Plans']]"
        if wait_and_click(create_recipe_btn, use_js=True):
            wait.until(EC.url_contains("/mealplans"))
            print("Navigated to meal plans page")
            time.sleep(1)
            print("On Meal Plans page")
            time.sleep(1)
            arrow_button_xpath = "//button[.//*[@data-testid='ArrowBackIcon']]"
            if wait_and_click(arrow_button_xpath, use_js=True):
                print("Clicked back-arrow to hide food navigation")
                
                # Wait for the navigation to collapse (you might need to adjust this condition)
                wait.until(EC.invisibility_of_element_located((
                    By.XPATH, "//div[contains(@class,'MuiDrawer-paper')]"
                )))
                print("Food navigation hidden")

            # Click the Breakfast card
            breakfast_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                "//button[@type='button' and .//p[normalize-space(text())='Breakfast']]"
            )))
            breakfast_btn.click()
            print("Clicked Breakfast card")
            time.sleep(1)
            ActionChains(driver).send_keys(Keys.ESCAPE).perform()
            time.sleep(2)
            arrow_forward_xpath = "//button[.//*[@data-testid='ArrowForwardIosIcon']]"
            if wait_and_click(arrow_forward_xpath, use_js=True):
                print("Clicked forward arrow button successfully")
            else:
                print("Failed to click forward arrow button")
            time.sleep(2)

        #Create a meal plan
        create_recipe_btn = "//div[@role='button' and .//span[normalize-space(text())='Create a Meal Plan']]"
        if wait_and_click(create_recipe_btn, use_js=True):
            wait.until(EC.url_contains("/mealplans/create"))
            print("Navigated to Create meal plans page")
            time.sleep(1)
            arrow_button_xpath = "//button[.//*[@data-testid='ArrowBackIcon']]"
            if wait_and_click(arrow_button_xpath, use_js=True):
                print("Clicked back-arrow to hide food navigation")
                
                # Wait for the navigation to collapse (you might need to adjust this condition)
                wait.until(EC.invisibility_of_element_located((
                    By.XPATH, "//div[contains(@class,'MuiDrawer-paper')]"
                )))
                print("Food navigation hidden")

            # 1) Fill in ingredient name
            name_input = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            '//label[normalize-space()="Name"]/following-sibling::div//input'
            )))
            name_input.send_keys("Mega Protein")
            print("Entered meal plan name")

            # 2) Pick Breakfast
            pickOption("breakfast-select-label",1)
            print("Selected breakfast")

            # 3) Pick Lunch 
            pickOption("lunch-select-label",2)
            print("Selected lunch")

            # 4) Pick Dinner
            pickOption("dinner-select-label",3)
            print("Selected dinner")
            time.sleep(2)
            # 5) Submit the form
            submit_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                "//button[@type='button' and normalize-space(text())='Create']"
            )))
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
            submit_btn.click()
            print("Clicked Create")
            time.sleep(1)
            arrow_forward_xpath = "//button[.//*[@data-testid='ArrowForwardIosIcon']]"
            if wait_and_click(arrow_forward_xpath, use_js=True):
                print("Clicked forward arrow button successfully")
            else:
                print("Failed to click forward arrow button")
        create_recipe_btn = "//div[@role='button' and .//span[normalize-space(text())='View Recipes']]"
        if wait_and_click(create_recipe_btn, use_js=True):
            wait.until(EC.url_contains("/recipes"))
            print("Navigated to View Recipes page")
            time.sleep(1)

except Exception as e:
    print(f"Test failed: {e}")

finally:
    print("\nTest completed. Closing browser.")
    driver.quit()