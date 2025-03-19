package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.PatientPharmacy;
import com.cs490.group4.demo.dao.PatientPharmacyRepository;
import com.cs490.group4.demo.dao.Pharmacy;
import com.cs490.group4.demo.dao.PharmacyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PharmacyService {
    @Autowired
    private PharmacyRepository pharmacyRepository;

    public List<Pharmacy> getPharmacies() {
        return pharmacyRepository.findAll();
    }


    public boolean isEmpty() {
        return pharmacyRepository.count() == 0;
    }


}
