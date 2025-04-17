package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ChosenDoctorRepository extends JpaRepository<ChosenDoctor, Integer> {

    @Query("from ChosenDoctor where patient.id = :patientId")
    Optional<ChosenDoctor> findByPatientId(Integer patientId);

    @Modifying
    @Query("delete from ChosenDoctor where patient.id = :patientId")
    void deleteByPatientId(Integer patientId);

}