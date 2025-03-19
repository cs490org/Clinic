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
public class PatientPharmacyService {
    @Autowired
    private PatientPharmacyRepository patientPharmacyRepository;

    public Pharmacy getByPatientId(Integer patientId) {
        PatientPharmacy patientPharmacy = patientPharmacyRepository.getByPatientId(patientId);

        if (patientPharmacy == null || patientPharmacy.getPharmacy() == null) {
            throw new EntityNotFoundException("pharmacy for patient ID " + patientId + " not found");
        }

        return patientPharmacy.getPharmacy();
    }
}
