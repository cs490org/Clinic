package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientPharmacyService {
    @Autowired
    private PatientPharmacyRepository patientPharmacyRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private PharmacyRepository pharmacyRepository;

    public Pharmacy getByPatientId(Integer patientId) {
        PatientPharmacy patientPharmacy = patientPharmacyRepository.getByPatientId(patientId);

        if (patientPharmacy == null || patientPharmacy.getPharmacy() == null) {
            throw new EntityNotFoundException("pharmacy for patient ID " + patientId + " not found");
        }

        return patientPharmacy.getPharmacy();
    }

    @Transactional
    public PatientPharmacy setPreferredPharmacy(Integer patientId, Integer pharmacyId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(()->new EntityNotFoundException("patient not found"));
        patientPharmacyRepository.deleteByPatientId(patientId);
        Pharmacy pharmacy= pharmacyRepository.findById(pharmacyId).orElseThrow(()->new EntityNotFoundException("pharmacy not found"));

        PatientPharmacy patientPharmacy = new PatientPharmacy();
        patientPharmacy.setPatient(patient);
        patientPharmacy.setPharmacy(pharmacy);
        return patientPharmacyRepository.save(patientPharmacy);
    }

    @Transactional
    public List<PatientPharmacy> patientsByPharmacyId(Integer pharmacyId) {
        return patientPharmacyRepository.getByPharmacyId(pharmacyId);
    }
    

}
