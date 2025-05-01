package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.DoctorRepository;
import com.cs490.group4.demo.security.Role;
import com.cs490.group4.demo.security.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class MockDoctor {

    @Autowired
    private MockUser mockUser;
    @Autowired
    private DoctorRepository doctorRepository;

    public User createMockDoctor(
            String email,
            String firstName,
            String lastName,
            String phone,
            String specialty,
            Long licenseNumber) {
        Doctor doctor = new Doctor();
        User user = mockUser.createMockUser(Role.DOCTOR, email, "password123", firstName, lastName);
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialty(specialty);
        doctor.setLicenseNumber(licenseNumber);
        doctor.setUser(user);
        doctorRepository.save(doctor);

        return user;
    }
}
