package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.PatientPharmacy;
import com.cs490.group4.demo.service.PatientPharmacyService;
import org.springframework.stereotype.Component;

@Component
public class MockPatientPharmacy {
    private final PatientPharmacyService patientPharmacyService;

    public MockPatientPharmacy(PatientPharmacyService patientPharmacyService) {
        this.patientPharmacyService = patientPharmacyService;
    }

    public PatientPharmacy createPatientPharmacy(Integer patientId, Integer pharmacyId) {
        return patientPharmacyService.createPatientPharmacy(patientId, pharmacyId);
    }
}
