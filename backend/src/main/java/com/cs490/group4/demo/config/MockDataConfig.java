package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.DoctorRepository;
import com.cs490.group4.demo.security.Role;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
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

    @Bean
    CommandLineRunner commandLineRunner() {
        return args -> {
            if (doctorRepository.count() == 0) {
                createMockDoctor(
                    "mario@clinic.com",
                    "Mario",
                    "Mario",
                    "1234567890",
                    "Weight Loss",
                    1L,
                    userRepository,
                    doctorRepository
                );

                createMockDoctor(
                    "luigi@clinic.com",
                    "Luigi",
                    "Mario",
                    "1234567891",
                    "Dietitian",
                    2L,
                    userRepository,
                    doctorRepository
                );

                createMockDoctor(
                    "peach@clinic.com",
                    "Peach",
                    "Toadstool",
                    "1234567892",
                    "Dietitian",
                    3L,
                    userRepository,
                    doctorRepository
                );

                createMockDoctor(
                    "yoshi@clinic.com",
                    "Yoshi",
                    "Muschakoopas",
                    "1234567893",
                    "Weight Loss",
                    4L,
                    userRepository,
                    doctorRepository
                );

                createMockDoctor(
                    "toad@clinic.com",
                    "Toad",
                    "Toadstool",
                    "1234567894",
                    "Dietitian",
                    5L,
                    userRepository,
                    doctorRepository
                );
            }
            if(userRepository.count() == 0) {
                createMockUser(
                    "test@clinic.com",
                    "Password123!",
                    "Test",
                    "User"
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
            Long licenseNumber,
            UserRepository userRepository,
            DoctorRepository doctorRepository
    ) {
        Doctor doctor = new Doctor();
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialty(specialty);
        doctor.setLicenseNumber(licenseNumber);
        doctorRepository.save(doctor);
    }

    private void createMockUser(
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
    }
} 