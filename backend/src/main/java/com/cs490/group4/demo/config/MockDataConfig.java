package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.DoctorRepository;
import com.cs490.group4.demo.security.Role;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.dao.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class MockDataConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    PatientRepository patientRepository;

    @Bean
    CommandLineRunner mockDataInitializer() {
        return args -> {
            if (doctorRepository.count() == 0) {
                createMockDoctor(
                    "doctor@clinic.com",
                    "Mario",
                    "Mario",
                    "1234567890",
                    "Weight Loss",
                    1L
                );

            }
            if(patientRepository.count() == 0)
            {
                createMockPatient(
                        "patient@clinic.com",
                        "Luigi",
                        "Luigi",
                        "1234567890",
                        "somewhere"
                );
            }
        };
    }

    private void createMockDoctor(
            String email,
            String firstName,
            String lastName,
            String phone,
            String specialty,
            Long licenseNumber
    ) {
        Doctor doctor = new Doctor();
        User user = getMockUser(email, "password", firstName, lastName);
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialty(specialty);
        doctor.setLicenseNumber(licenseNumber);
        doctor.setUser(user);
        doctorRepository.save(doctor);

    }

    private void createMockPatient(
        String email,
        String firstName,
        String lastName,
        String phone,
        String address
    ) {
        Patient patient = new Patient();
        User user = getMockUser(email, "password", firstName, lastName);
        patient.setEmail(email);
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setPhone(phone);
        patient.setAddress(address);
        patient.setUser(user);
        patientRepository.save(patient);

    }

    private User getMockUser(
        String email,
        String password,
        String firstName,
        String lastName
    ) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); 
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(Role.USER);
        userRepository.save(user);
        return user;
    }
} 