package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PharmacyService {
    @Autowired
    private PharmacyRepository pharmacyRepository;

    public boolean isEmpty() {
        return pharmacyRepository.count() == 0;
    }

}
