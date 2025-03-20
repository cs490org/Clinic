package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.dao.PatientRepository;
import com.cs490.group4.demo.dao.Pharmacy;
import com.cs490.group4.demo.dao.PharmacyRepository;
import com.cs490.group4.demo.security.Role;
import com.cs490.group4.demo.security.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MockPharmacy {

    @Autowired
    private MockUser mockUser;

    @Autowired
    private PharmacyRepository pharmacyRepository;

    public void createMockPharmacy(
            String email,
            String address,
            String name,
            String phone,
            String zipCode
    ) {
        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setAddress(address);
        pharmacy.setName(name);
        pharmacy.setPhone(phone);
        pharmacy.setZipCode(zipCode);
        User user = mockUser.createMockUser(Role.PHARMACIST, email, "p", "ADMIN", "ACCOUNT");
        pharmacy.setUser(user);
        pharmacyRepository.save(pharmacy);

    }
}
