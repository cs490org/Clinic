package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Pharmacy;
import com.cs490.group4.demo.dao.PharmacyRepository;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.cs490.group4.demo.dto.PharmacyCreateDTO;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PharmacyService {
    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;

    public List<Pharmacy> getPharmacies() {
        return pharmacyRepository.findAll();
    }

    public Pharmacy getPharmacyByUserId(Integer userId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId);
        if (pharmacy == null) {
            throw new EntityNotFoundException("pharmacist not defined for user " + userId);
        }
        return pharmacy;
    }

    @Transactional
    public Pharmacy createPharmacy(PharmacyCreateDTO pharmacyCreateDTO) {
        User user = userRepository.findById(pharmacyCreateDTO.getUserId()).orElseThrow(
                ()-> new EntityNotFoundException("User Not Found"));

        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setUser(user);
        pharmacy.setName(pharmacyCreateDTO.getName());
        pharmacy.setZipCode(pharmacyCreateDTO.getZipCode());
        pharmacy.setPhone(pharmacyCreateDTO.getPhone());
        pharmacy.setAddress(pharmacyCreateDTO.getAddress());

        return pharmacyRepository.save(pharmacy);
    }

    public boolean isEmpty() {
        return pharmacyRepository.count() == 0;
    }


}
