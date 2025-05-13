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

            # helper to pick first option from a MUI Select by its label-id

            # 2) Pick Breakfast (first option)
            pickOption("breakfast-select-label",1)
            print("Selected breakfast")

            # 3) Pick Lunch (first option)
            pickOption("lunch-select-label",2)
            print("Selected lunch")

            # 4) Pick Dinner (first option)
            pickOption("dinner-select-label",3)
            print("Selected dinner")
            time.sleep(2)
            # 5) Submit the form
            submit_btn = wait.until(EC.element_to_be_clickable((
                By.XPATH,
                "//button[@type='button' and normalize-space(text())='Create']"
            )))
            arrow_forward_xpath = "//button[.//*[@data-testid='ArrowForwardIosIcon']]"
            if wait_and_click(arrow_forward_xpath, use_js=True):
                print("Clicked forward arrow button successfully")
            else:
                print("Failed to click forward arrow button")
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
            submit_btn.click()
            print("Clicked Create")
            


except Exception as e:
    print(f"Test failed: {e}")

finally:
    print("\nTest completed. Closing browser.")
    driver.quit()


