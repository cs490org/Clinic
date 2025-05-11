from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import traceback

def wait_and_click(driver, xpath, timeout=10, use_js=False):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((By.XPATH, xpath))
        )
        if use_js:
            driver.execute_script("arguments[0].click();", element)
        else:
            element.click()
        #print(f"Clicked '{xpath}'")
        return True
    except Exception as e:
        print(f"Failed to click: {xpath}: {e}")
        return False


# Setup browsers
patient_driver = webdriver.Chrome()
doctor_driver = webdriver.Chrome()

patient_driver.set_window_size(1280, 1400)
patient_driver.set_window_position(0, 0)
doctor_driver.set_window_size(1280, 1400)
doctor_driver.set_window_position(1280, 0)

try:
    #Patient booking appointment
    patient_driver.get("http://localhost:5173/")
    patient_wait = WebDriverWait(patient_driver, 10)

    wait_and_click(patient_driver, '//button[contains(text(), "Sign In")]', use_js=True)
    patient_wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys("patient1746827926@Lim.com") #Replace with another patient
    patient_driver.find_element(By.NAME, "password").send_keys("Password1")
    wait_and_click(patient_driver, '//button[@type="submit"]', use_js=True)
    patient_wait.until(EC.url_contains("/dashboard"))
    print("Patient logged in")

    time.sleep(2)
    book_buttons = patient_wait.until(EC.presence_of_all_elements_located((By.XPATH, '//button[normalize-space(text())="Book Appointment"]')))
    patient_driver.execute_script("arguments[0].click();", book_buttons[1])
    print("Clicked second 'Book Appointment'")

    patient_wait.until(EC.presence_of_element_located((By.XPATH, '//textarea[@placeholder="Please describe your symptoms"]'))).send_keys("Crisis")
    wait_and_click(patient_driver, '//button[normalize-space(text())="Book"]', use_js=True)
    print("Appointment booked")

    time.sleep(4)

    #Doctor Logging in 
    doctor_driver.get("http://localhost:5173/")
    doctor_wait = WebDriverWait(doctor_driver, 10)

    wait_and_click(doctor_driver, '//button[contains(text(), "Sign In")]', use_js=True)
    doctor_wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys("valentineobi@clinic.com")
    doctor_driver.find_element(By.NAME, "password").send_keys("password123")
    wait_and_click(doctor_driver, '//button[@type="submit"]', use_js=True)
    doctor_wait.until(EC.url_contains("/dashboard"))
    print("Doctor logged in")

    wait_and_click(doctor_driver, '//button[normalize-space(text())="Accept"]', use_js=True)
    print("Doctor accepted")

    time.sleep(2)

    #Patient entering appointment
    patient_driver.refresh()
    time.sleep(2)
    wait_and_click(patient_driver, '//button[normalize-space(text())="Enter"]', use_js=True)
    print("Patient entered appointment")
    time.sleep(1)
    #Doctor ent appoint
    wait_and_click(doctor_driver, '//button[normalize-space(text())="Enter"]', use_js=True)
    print("Doctor entered appointment")
    time.sleep(1)
    
    #pat. mess.
    patient_message = "Hello Doctor, day by day nothing changes."
    try:
        time.sleep(1)
        patient_input = patient_wait.until(EC.presence_of_element_located((By.XPATH, '//input[@placeholder="Type a message..."]')))
        time.sleep(1)
        patient_input.send_keys(patient_message)
        time.sleep(1)
        wait_and_click(patient_driver, '//button[contains(text(), "Send")]')
        time.sleep(2)
    except Exception as e:
        print("Patient message error")
    
    try:
        time.sleep(1)
        doctor_input = doctor_wait.until(EC.presence_of_element_located((By.XPATH, '//input[@placeholder="Type a message..."]')))
        print("Doctor navigated back")
        time.sleep(1)
        doctor_input.send_keys("Yet when you look back it's all different?")
        time.sleep(1)
        print("Doctor navigated back")
        wait_and_click(doctor_driver, '//button[contains(text(), "Send")]')
        time.sleep(2)
    except Exception as e:
        print("Doctor message error")

    #Ending Chat Pat
    try:
        patient_driver.back()
        print("Patient navigated back")
    except Exception as e:
        print("End Appointment failed")
        

    #End Talk Doc
    try:
        doctor_driver.back()
        print("Doctor navigated back")
    except Exception as e:
        print("Doctor back failed")
        

except Exception as e:
    print("Full test flow failed")
    
finally:
    time.sleep(3)
    print("Closing browsers")
    patient_driver.quit()
    doctor_driver.quit()
