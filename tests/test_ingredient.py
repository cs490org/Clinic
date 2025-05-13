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
            arrow_forward_xpath = "//button[.//*[@data-testid='ArrowForwardIosIcon']]"
            if wait_and_click(arrow_forward_xpath, use_js=True):
                print("Clicked forward arrow button successfully")
            else:
                print("Failed to click forward arrow button")
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
            submit_btn.click()
            print("Clicked Create Ingredient button on form")


except Exception as e:
    print(f"Test failed: {e}")

finally:
    print("\nTest completed. Closing browser.")
    driver.quit()


