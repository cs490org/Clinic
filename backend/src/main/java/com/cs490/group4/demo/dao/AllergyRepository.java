package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllergyRepository extends JpaRepository<Allergy, Integer> {
    List<Allergy> findByPatientId(Integer patientId);
}