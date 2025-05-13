package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.EnrichedPatientDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
            throw new EntityNotFoundException("Pharmacy for patient ID " + patientId + " not found");
        }
        return patientPharmacy.getPharmacy();
    }

    @Transactional
    public PatientPharmacy setPreferredPharmacy(Integer patientId, Integer pharmacyId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new EntityNotFoundException("Pharmacy not found"));

        patientPharmacyRepository.deleteByPatientId(patientId);

        PatientPharmacy patientPharmacy = new PatientPharmacy();
        patientPharmacy.setPatient(patient);
        patientPharmacy.setPharmacy(pharmacy);

        return patientPharmacyRepository.save(patientPharmacy);
    }

    @Transactional
    public List<EnrichedPatientDTO> getPatientsByPharmacyId(Integer pharmacyId) {
        return patientPharmacyRepository.getByPharmacyId(pharmacyId).stream().map(pp -> {
            Patient p = pp.getPatient();
            EnrichedPatientDTO dto = new EnrichedPatientDTO();

            dto.setId(p.getId());
            dto.setFirstName(p.getFirstName());
            dto.setLastName(p.getLastName());

            // Safe access to email
            if (p.getEmail() != null && !p.getEmail().isBlank()) {
                dto.setEmail(p.getEmail());
            } else if (p.getUser() != null && p.getUser().getEmail() != null) {
                dto.setEmail(p.getUser().getEmail());
            } else {
                dto.setEmail("—");
            }

            // Safe access to phone
            if (p.getPhone() != null && !p.getPhone().isBlank()) {
                dto.setPhone(p.getPhone());
            } else if (p.getUser() != null && p.getUser().getPhone() != null) {
                dto.setPhone(p.getUser().getPhone());
            } else {
                dto.setPhone("—");
            }

            // Safe access to address
            if (p.getAddress() != null && !p.getAddress().isBlank()) {
                dto.setAddress(p.getAddress());
            } else if (p.getUser() != null && p.getUser().getAddress() != null) {
                dto.setAddress(p.getUser().getAddress());
            } else {
                dto.setAddress("—");
            }

            return dto;
        }).collect(Collectors.toList());
    }
}
