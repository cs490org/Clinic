from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

def test_recipe_creation_with_image_and_instructions():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 15)

    try:
        # Login process
        driver.get("http://localhost:5173/")
        driver.maximize_window()

        wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(., "Sign In")]'))).click()
        wait.until(EC.visibility_of_element_located((By.NAME, "email"))).send_keys("patient1745712973@Itani.com")
        driver.find_element(By.NAME, "password").send_keys("Password1")
        wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]'))).click()
        wait.until(EC.url_contains("dashboard"))

        # Navigate to recipe creation
        driver.get("http://localhost:5173/recipes/create")
        wait.until(EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Create new recipe")]')))

        # Set recipe name and description
        recipe_name = "The Geekbob Meal"
        recipe_desc = "This automatic"

        name_field = wait.until(EC.visibility_of_element_located(
            (By.XPATH, '//label[contains(., "Recipe name")]/following-sibling::div//input')
        ))
        name_field.send_keys(recipe_name)

        desc_field = driver.find_element(
            By.XPATH, '//label[contains(., "Description")]/following-sibling::div//textarea'
        )
        desc_field.send_keys(recipe_desc)

        # Upload image
        image_section = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//p[contains(text(), "1. Add Image")]')
        ))
        if "Mui-expanded" not in image_section.find_element(By.XPATH, './..').get_attribute("class"):
            image_section.click()

        file_input = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//input[@type="file"]')
        ))
        image_path = os.path.abspath("tests/hq720.jpg") #Replace with the path 
        file_input.send_keys(image_path)
        time.sleep(1) 

        # Add ingredients
        ingredients_header = wait.until(EC.presence_of_element_located((
            By.XPATH, '//p[contains(text(), "2. Add Ingredients")]'
        )))
        if "Mui-expanded" not in ingredients_header.find_element(By.XPATH, './..').get_attribute("class"):
            ingredients_header.click()
            time.sleep(0.5)

        # Select ingredient
        ingredient_combobox = wait.until(EC.element_to_be_clickable((
            By.XPATH, '//div[@role="combobox" and contains(@class, "MuiSelect-select")]'
        )))

        driver.execute_script("""
            arguments[0].scrollIntoView({block: 'center'});
            window.scrollBy(0, 50);
        """, ingredient_combobox)
        ingredient_combobox.click()

        time.sleep(0.5)

        # Select the first ingredient
        first_ingredient = wait.until(EC.visibility_of_element_located((
            By.XPATH, '(//ul[@role="listbox"]/li[@role="option" and not(@aria-disabled="true")])[1]'
        )))
        first_ingredient.click()


        # Add instructions
        instructions_header = wait.until(EC.presence_of_element_located((
            By.XPATH, '//p[contains(text(), "3. Add Instructions")]'
        )))
        if "Mui-expanded" not in instructions_header.find_element(By.XPATH, './..').get_attribute("class"):
            instructions_header.click()
            time.sleep(0.5)

        instructions_field = wait.until(EC.visibility_of_element_located(
            (By.XPATH, '//div[contains(@class, "Mui-expanded")]//textarea[not(@id="description")]')
        ))
        instructions = """1.yeah mmm yummy yeah yeah yumm I love it yeah mm yeah \n2. Where the Linkeduzz at"""
        instructions_field.send_keys(instructions)

        # Submit the form
        submit_btn = wait.until(EC.element_to_be_clickable(
            (By.XPATH, '//button[contains(., "Create Recipe")]')
        ))
        submit_btn.click()

        # Verify success
        wait.until(EC.url_contains("/recipes"))
        wait.until(EC.visibility_of_element_located((By.XPATH, f'//*[contains(text(), "{recipe_name}")]')))

    finally:
        driver.quit()

if __name__ == "__main__":
    test_recipe_creation_with_image_and_instructions()