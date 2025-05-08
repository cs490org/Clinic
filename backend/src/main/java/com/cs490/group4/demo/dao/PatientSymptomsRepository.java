package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientSymptomsRepository extends JpaRepository<PatientSymptoms, Integer> {
    public List<PatientSymptoms> findAllPatientSymptomsByPatientId(Integer patientId);
    public void deleteByPatientId(Integer patientId);
}
