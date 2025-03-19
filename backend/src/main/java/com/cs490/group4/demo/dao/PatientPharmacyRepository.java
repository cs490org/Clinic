package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientPharmacyRepository extends JpaRepository<PatientPharmacy, Integer> {
    public PatientPharmacy getByPatientId(Integer patientId);

    public PatientPharmacy getByPharmacyId(Integer pharmacyId);
}