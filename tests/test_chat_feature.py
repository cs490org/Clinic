from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, traceback
#Complete

def wait_and_click(driver, xpath, timeout=10, use_js=False):
    elem = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((By.XPATH, xpath))
    )
    if use_js:
        driver.execute_script("arguments[0].click();", elem)
    else:
        elem.click()
    return elem

def fill_survey_popup(driver, timeout=10):
    dialog = WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((
            By.XPATH,
            "//div[@role='dialog'][.//h2[text()='Submit Appointment Data']]"
        ))
    )

    for name, val in (
        ("height",       "180"),
        ("weight",       "75"),
        ("waterIntake",  "2"),
        ("bloodPressure","120/80")
    ):
        fld = WebDriverWait(dialog, timeout).until(
            EC.presence_of_element_located((By.NAME, name))
        )
        fld.clear()
        fld.send_keys(val)

    time.sleep(2)
    submit_btn = dialog.find_element(
        By.XPATH, ".//button[normalize-space(.)='Submit']"
    )
    driver.execute_script("arguments[0].click();", submit_btn)

    WebDriverWait(driver, timeout).until(
        EC.invisibility_of_element_located((By.XPATH, "//div[@role='dialog']"))
    )
    print("Survey submitted")

patient_driver = webdriver.Chrome()
doctor_driver  = webdriver.Chrome()
for d, x in ((patient_driver, 0), (doctor_driver, 1280)):
    d.set_window_size(1280, 1400)
    d.set_window_position(x, 0)

try:
    # 1) Patient in and appointment
    patient_driver.get("http://localhost:5173/")
    wait_and_click(patient_driver, '//button[contains(text(),"Sign In")]', use_js=True)
    WebDriverWait(patient_driver, 5).until(
        EC.presence_of_element_located((By.NAME,"email"))
    ).send_keys("olivia.smith@clinic.com")
    patient_driver.find_element(By.NAME,"password").send_keys("password123")
    wait_and_click(patient_driver, '//button[@type="submit"]', use_js=True)
    WebDriverWait(patient_driver, 5).until(EC.url_contains("/dashboard"))
    print("Patient logged in")

    buttons = WebDriverWait(patient_driver,5).until(
        EC.presence_of_all_elements_located(
            (By.XPATH,'//button[normalize-space(text())="Book Appointment"]')
        )
    )
    patient_driver.execute_script("arguments[0].click();", buttons[0])
    print("Clicked Book Appointment")

    WebDriverWait(patient_driver,5).until(
        EC.presence_of_element_located((By.XPATH,'//textarea[@placeholder="Please describe your symptoms"]'))
    ).send_keys("Crisis")
    wait_and_click(patient_driver, '//button[normalize-space(text())="Book"]', use_js=True)
    print("Appointment booked")

    # 2) Doctor in and accepts
    doctor_driver.get("http://localhost:5173/")
    wait_and_click(doctor_driver, '//button[contains(text(),"Sign In")]', use_js=True)
    WebDriverWait(doctor_driver, 5).until(
        EC.presence_of_element_located((By.NAME,"email"))
    ).send_keys("samanthasalomon@clinic.com")
    doctor_driver.find_element(By.NAME,"password").send_keys("password123")
    wait_and_click(doctor_driver, '//button[@type="submit"]', use_js=True)
    WebDriverWait(doctor_driver,5).until(EC.url_contains("/dashboard"))
    print("Doctor logged in")
    wait_and_click(doctor_driver, '//button[normalize-space(text())="Accept"]', use_js=True)
    print("Doctor accepted")

    # 3) Patient enters appointment
    enter_btn = WebDriverWait(patient_driver, 10).until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(@class,'MuiButton-containedError') and normalize-space(.)='Enter']"
        ))
    )
    patient_driver.execute_script("arguments[0].click();", enter_btn)
    print("Patient clicked Enter (survey should appear)")

    # 4) Fill the survey
    fill_survey_popup(patient_driver)

    print("Patient in appointment")

    wait_and_click(doctor_driver, '//button[normalize-space(text())="Enter"]', use_js=True)
    print("Doctor entered appointment")

    pat_input = WebDriverWait(patient_driver,3).until(
        EC.presence_of_element_located((By.XPATH,'//input[@placeholder="Type a message..."]'))
    )
    #patient texts
    pat_input.send_keys("Hello Doctor, day by day nothing changes.")
    time.sleep(2)
    wait_and_click(patient_driver,'//button[contains(text(),"Send")]',use_js=True)
    print("Patient sent message")
    

    doc_input = WebDriverWait(doctor_driver,3).until(
        EC.presence_of_element_located((By.XPATH,'//input[@placeholder="Type a message..."]'))
    )
    time.sleep(2)
    #Doc texts
    doc_input.send_keys("Yet when you look back it's all different?")
    time.sleep(2)
    wait_and_click(doctor_driver,'//button[contains(text(),"Send")]',use_js=True)
    print("Doctor sent message")
    time.sleep(2)

    #doc ends app.
    wait_and_click(doctor_driver,'//button[contains(text(),"End Appointment")]',use_js=True)
    print("Doctor navigated back")
    time.sleep(1)
    
    WebDriverWait(patient_driver, 10).until(
        EC.url_contains("/complete")
    )
    print("Patient on post-appointment page")
    time.sleep(2)

    # 9) post game interview
    star5 = WebDriverWait(patient_driver, 5).until(
    EC.element_to_be_clickable((By.XPATH, "//input[@type='radio' and @value='3']"))
    )
    patient_driver.execute_script("arguments[0].click();", star5)
    print("Rated 5 stars")

    # 9b) Title
    title_input = WebDriverWait(patient_driver, 5).until(
        EC.presence_of_element_located((By.XPATH,
            "//label[text()='Review Title']/following::input[1]"
        ))
    )
    title_input.send_keys("Okay Sessions")

    # 9c) Desc
    body_input = patient_driver.find_element(By.XPATH,
        "//label[text()='Write a review (optional)']/following::textarea[1]"
    )
    body_input.send_keys("Doctor was lowkey mid ngl .")
    time.sleep(2)

    # 9d) Submit
    submit_btn = WebDriverWait(patient_driver, 5).until(
        EC.element_to_be_clickable((By.XPATH,
            "//button[normalize-space(.)='Submit Review']"
        ))
    )
    submit_btn.click()
    print("Post-appointment review submitted")

    # 10) Check back to dash
    WebDriverWait(patient_driver, 10).until(
        EC.url_contains("/patient/dashboard")
    )
    print("Patient returned to Dashboard")

except Exception:
    traceback.print_exc()

finally:
    time.sleep(2)
    patient_driver.quit()
    doctor_driver.quit()
