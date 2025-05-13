package com.cs490.group4.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cs490.group4.demo.dao.PatientPharmacy;

public interface PatientPharmacyRepository extends JpaRepository<PatientPharmacy, Integer> {
    PatientPharmacy getByPatientId(Integer patientId);
    List<PatientPharmacy> getByPharmacyId(Integer pharmacyId);
    void deleteByPatientId(Integer patientId);
    List<PatientPharmacy> findByPatientIdOrderByCreateTimestampDesc(Integer patientId);
}
