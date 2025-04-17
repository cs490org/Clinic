package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientChartRepository extends JpaRepository<PatientChart, Integer> {

    @Query("from PatientChart where patient.id = :patientId")
    Optional<PatientChart> findByPatientId(Integer patientId);

}