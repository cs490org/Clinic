package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientMealPlanRepository extends JpaRepository<PatientMealPlan, Integer> {
    public List<PatientMealPlan> findByMealPlanId(Integer mealPlanId);
    public List<PatientMealPlan> findByPatientId(Integer patientId);
}