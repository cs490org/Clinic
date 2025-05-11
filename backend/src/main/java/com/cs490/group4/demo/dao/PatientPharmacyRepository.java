package com.cs490.group4.demo.dao;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientPharmacyRepository extends JpaRepository<PatientPharmacy, Integer> {
    public PatientPharmacy getByPatientId(Integer patientId);
    public PatientPharmacy getByPharmacyId(Integer pharmacyId);
    public void deleteByPatientId(Integer patientId);

    List<PatientPharmacy> findByPatientIdOrderByCreateTimestampDesc(Integer patientId);
}